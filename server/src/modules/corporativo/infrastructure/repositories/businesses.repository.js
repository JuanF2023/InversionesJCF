// server/src/modules/corporativo/infrastructure/repositories/businesses.repository.js
import BusinessModel from "#modules/negocio/infrastructure/mongoose/models/business.model.js";

/**
 * BusinessesRepository (Corporativo) �?enterprise / multi-tenant
 *
 * - CRUD con filtros/paginación/orden
 * - Soft delete (deletedAt)
 * - Aislamiento multi-tenant (tenantId obligatorio)
 *
 * Nota:
 * - Este repositorio asume que el use-case/controller inyecta tenantId.
 * - No hace fallback silencioso: tenantId es requerido.
 */

const asInt = (v, d) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
};

function normalizeSort(sort = "-createdAt") {
    const s = String(sort || "").trim();
    if (!s) return { createdAt: -1 };

    const parts = s
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

    const out = {};
    for (const p of parts) {
        if (p.startsWith("-")) out[p.slice(1)] = -1;
        else out[p] = 1;
    }
    return Object.keys(out).length ? out : { createdAt: -1 };
}

function toDTO(doc) {
    if (!doc) return null;
    const o = doc.toObject ? doc.toObject({ virtuals: true }) : doc;
    return { ...o, id: String(o._id) };
}

function requireTenantId(tenantId) {
    const t = String(tenantId ?? "").trim();
    if (!t) {
        const e = new Error("tenantId requerido (multi-tenant).");
        e.status = 400;
        e.code = "TENANT_REQUIRED";
        throw e;
    }
    return t;
}

export function buildBusinessesRepository() {
    return {
        /**
         * Lista negocios
         * @param {Object} args
         * @param {string} args.tenantId
         * @param {number} [args.page=1]
         * @param {number} [args.limit=50]
         * @param {string} [args.sort=-createdAt]
         * @param {string} [args.search=""]
         * @param {Object} [args.filters={}]
         */
        async list({
            tenantId,
            page = 1,
            limit = 50,
            sort = "-createdAt",
            search = "",
            filters = {},
        } = {}) {
            const t = requireTenantId(tenantId);

            const q = { tenantId: t };

            // Soft delete
            const includeDeleted = Boolean(filters?.includeDeleted);
            if (!includeDeleted) q.deletedAt = null;

            // Filtros canónicos (frontend)
            if (filters?.estadoOperacion) q.estadoOperacion = String(filters.estadoOperacion).toUpperCase();
            if (filters?.categoryId) q.categoryId = String(filters.categoryId);
            if (filters?.subcategoryId) q.subcategoryId = String(filters.subcategoryId);
            if (filters?.typeId) q.typeId = String(filters.typeId);

            // Compat legacy (si aún lo usas en otras pantallas)
            if (!q.estadoOperacion && filters?.estado) q.estado = String(filters.estado).toUpperCase();
            if (!q.typeId && filters?.tipo) q.tipo = String(filters.tipo);

            // Búsqueda (requiere índice text en el modelo)
            const s = String(search || "").trim();
            if (s) q.$text = { $search: s };

            const pg = Math.max(1, asInt(page, 1));
            const lim = Math.min(200, Math.max(1, asInt(limit, 50)));
            const skip = (pg - 1) * lim;

            const [items, total] = await Promise.all([
                BusinessModel.find(q).sort(normalizeSort(sort)).skip(skip).limit(lim),
                BusinessModel.countDocuments(q),
            ]);

            return {
                items: items.map(toDTO),
                page: pg,
                limit: lim,
                total,
                pages: Math.max(1, Math.ceil(total / lim)),
            };
        },

        /**
         * Obtener por id (solo activos, no soft-deleted)
         */
        async getById({ tenantId, id }) {
            const t = requireTenantId(tenantId);
            const _id = String(id ?? "").trim();
            if (!_id) return null;

            const doc = await BusinessModel.findOne({ _id, tenantId: t, deletedAt: null });
            return toDTO(doc);
        },

        /**
         * Crear
         */
        async create({ tenantId, data }) {
            const t = requireTenantId(tenantId);
            const doc = await BusinessModel.create({ ...data, tenantId: t });
            return toDTO(doc);
        },

        /**
         * Actualizar (solo no eliminados)
         */
        async update({ tenantId, id, data }) {
            const t = requireTenantId(tenantId);
            const _id = String(id ?? "").trim();
            if (!_id) return null;

            const doc = await BusinessModel.findOneAndUpdate(
                { _id, tenantId: t, deletedAt: null },
                { $set: data },
                { new: true }
            );

            return toDTO(doc);
        },

        /**
         * Soft delete
         */
        async softDelete({ tenantId, id }) {
            const t = requireTenantId(tenantId);
            const _id = String(id ?? "").trim();
            if (!_id) return false;

            const doc = await BusinessModel.findOneAndUpdate(
                { _id, tenantId: t, deletedAt: null },
                { $set: { deletedAt: new Date() } },
                { new: true }
            );

            return Boolean(doc);
        },
    };
}

export default buildBusinessesRepository;
