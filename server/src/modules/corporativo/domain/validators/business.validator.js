const str = (v) => String(v ?? "").trim();

function err(msg) {
    const e = new Error(msg);
    e.status = 400;
    e.code = "VALIDATION";
    return e;
}

export function validateBusinessCreate(payload = {}) {
    const codigo = str(payload.codigo);
    const nombre = str(payload.nombre);
    const descripcion = str(payload.descripcion);

    const categoryId = str(payload.categoryId);
    const subcategoryId = str(payload.subcategoryId);
    const typeId = str(payload.typeId);

    const estadoOperacion = str(payload.estadoOperacion || "ACTIVO").toUpperCase();

    if (!nombre) throw err("Nombre requerido.");
    if (!categoryId) throw err("categoryId requerido.");
    if (!subcategoryId) throw err("subcategoryId requerido.");
    if (!typeId) throw err("typeId requerido.");

    if (!["ACTIVO", "INACTIVO"].includes(estadoOperacion)) {
        throw err("estadoOperacion inválido (ACTIVO|INACTIVO).");
    }

    return {
        codigo: codigo || undefined,
        nombre,
        descripcion: descripcion || undefined,
        categoryId,
        subcategoryId,
        typeId,
        estadoOperacion,
        creadoPor: payload.creadoPor ?? undefined,
        fechaCreacion: payload.fechaCreacion ?? undefined,
    };
}

export function validateBusinessUpdate(payload = {}) {
    const out = {};

    if ("codigo" in payload) out.codigo = str(payload.codigo) || undefined;
    if ("nombre" in payload) {
        const n = str(payload.nombre);
        if (!n) throw err("Nombre requerido.");
        out.nombre = n;
    }

    if ("descripcion" in payload) out.descripcion = str(payload.descripcion) || undefined;

    if ("categoryId" in payload) {
        const v = str(payload.categoryId);
        if (!v) throw err("categoryId requerido.");
        out.categoryId = v;
    }
    if ("subcategoryId" in payload) {
        const v = str(payload.subcategoryId);
        if (!v) throw err("subcategoryId requerido.");
        out.subcategoryId = v;
    }
    if ("typeId" in payload) {
        const v = str(payload.typeId);
        if (!v) throw err("typeId requerido.");
        out.typeId = v;
    }

    if ("estadoOperacion" in payload) {
        const st = str(payload.estadoOperacion || "").toUpperCase();
        if (!["ACTIVO", "INACTIVO"].includes(st)) {
            throw err("estadoOperacion inválido (ACTIVO|INACTIVO).");
        }
        out.estadoOperacion = st;
    }

    return out;
}
