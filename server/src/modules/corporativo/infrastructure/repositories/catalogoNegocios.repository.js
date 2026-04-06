// server/src/modules/corporativo/infrastructure/mongoose/repositories/catalogo-negocios.repository.js
import catalogo-negociosModel from "#modules/negocio/infrastructure/mongoose/models/catalogo-negocios.model.js";

function str(v) {
    return String(v ?? "").trim();
}

function normLevel(v) {
    const s = str(v).toLowerCase();
    if (!s) return "";
    if (["categoria", "category", "cat"].includes(s)) return "category";
    if (["subcategoria", "subcategory", "sub_category", "subcat"].includes(s)) return "subcategory";
    if (["tipo", "type", "business_type", "business-type"].includes(s)) return "type";
    return s;
}

function slugifyKey(text) {
    const s = str(text)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 60);

    return s || `item_${Date.now()}`;
}

async function ensureUniqueKey(base) {
    const root = slugifyKey(base);
    let key = root;
    let n = 2;

    while (await catalogo-negociosModel.exists({ key })) {
        key = `${root}_${n}`;
        n += 1;
        if (n > 50) key = `${root}_${Date.now()}`;
    }
    return key;
}

export async function listAllCatalogoItems() {
    const docs = await catalogo-negociosModel.find({ activo: true })
        .sort({ level: 1, parentKey: 1, order: 1, label: 1 })
        .lean();

    return docs;
}

export async function findByKey(key) {
    const id = str(key);
    if (!id) return null;
    return catalogo-negociosModel.findOne({ key: id }).lean();
}

export async function assertParentExists(levelRaw, parentKeyRaw) {
    const level = normLevel(levelRaw);
    const parentKey = str(parentKeyRaw);

    if (!parentKey) return;

    const parent = await catalogo-negociosModel.findOne({ key: parentKey }).lean();
    if (!parent) {
        const err = new Error("parentKey no existe");
        err.statusCode = 400;
        err.code = "CATALOGO_PARENT_NOT_FOUND";
        throw err;
    }

    if (level === "subcategory" && parent.level !== "category") {
        const err = new Error("parentKey de subcategory debe apuntar a category");
        err.statusCode = 400;
        err.code = "CATALOGO_PARENT_LEVEL_INVALID";
        throw err;
    }

    if (level === "type" && parent.level !== "subcategory") {
        const err = new Error("parentKey de type debe apuntar a subcategory");
        err.statusCode = 400;
        err.code = "CATALOGO_PARENT_LEVEL_INVALID";
        throw err;
    }
}

export async function createCatalogoItem(data = {}) {
    const level = normLevel(data.level);
    const label = str(data.label);

    if (!level) {
        const err = new Error("level requerido");
        err.statusCode = 400;
        err.code = "CATALOGO_LEVEL_REQUIRED";
        throw err;
    }

    if (!label) {
        const err = new Error("label requerido");
        err.statusCode = 400;
        err.code = "CATALOGO_LABEL_REQUIRED";
        throw err;
    }

    const parentKey = str(data.parentKey || "") || null;
    if (level !== "category" && !parentKey) {
        const err = new Error("parentKey requerido para subcategory/type");
        err.statusCode = 400;
        err.code = "CATALOGO_PARENT_REQUIRED";
        throw err;
    }

    await assertParentExists(level, parentKey);

    const key = await ensureUniqueKey(data.key ?? label);

    const doc = await catalogo-negociosModel.create({
        key,
        level,
        parentKey,
        label,
        system: false,
        activo: true,
        tags: Array.isArray(data.tags) ? data.tags : [],
        scope: data.scope ?? null,
        synonyms: Array.isArray(data.synonyms) ? data.synonyms : [],
        order: Number(data.order ?? 0) || 0,
    });

    return doc.toObject();
}

export async function updateCatalogoItem(key, patch = {}) {
    const id = str(key);
    if (!id) {
        const err = new Error("key requerido");
        err.statusCode = 400;
        err.code = "CATALOGO_KEY_REQUIRED";
        throw err;
    }

    const nextPatch = { ...patch };
    if (typeof nextPatch.level === "string") nextPatch.level = normLevel(nextPatch.level);

    const current = await catalogo-negociosModel.findOne({ key: id }).lean();
    if (!current) {
        const err = new Error("Item no encontrado");
        err.statusCode = 404;
        err.code = "CATALOGO_NOT_FOUND";
        throw err;
    }

    if (current.system && typeof patch.label === "string") {
        const err = new Error("No se puede editar label de un item del sistema (system=true)");
        err.statusCode = 403;
        err.code = "CATALOGO_SYSTEM_LOCKED";
        throw err;
    }

    const updated = await catalogo-negociosModel.findOneAndUpdate({ key: id }, { $set: nextPatch }, { new: true }).lean();
    return updated;
}

/**
 * âœ?Default export (para usecases que importan default)
 */
const catalogo-negociosRepository = {
    listAllCatalogoItems,
    findByKey,
    createCatalogoItem,
    updateCatalogoItem,
    assertParentExists,
    model: catalogo-negociosModel,
};

export default catalogo-negociosRepository;

