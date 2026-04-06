// server/src/modules/corporativo/infrastructure/repositories/units.repository.js
import Unit from "#modules/negocio/infrastructure/mongoose/models/unit.model.js";

function isObjectIdLike(v) {
    if (v == null) return false;
    const s = String(v).trim();
    return /^[a-fA-F0-9]{24}$/.test(s);
}

function buildQuery(filters = {}) {
    const q = {};

    if (isObjectIdLike(filters?.tenantId)) q.tenantId = String(filters.tenantId).trim();

    if (isObjectIdLike(filters?.propertyId)) q.propertyId = String(filters.propertyId).trim();
    if (isObjectIdLike(filters?.businessId)) q.businessId = String(filters.businessId).trim();

    if (filters?.status != null && String(filters.status).trim()) q.status = String(filters.status).trim();
    if (filters?.active !== undefined) q.active = Boolean(filters.active);

    if (filters?.q != null && String(filters.q).trim()) {
        const rx = new RegExp(String(filters.q).trim(), "i");
        q.$or = [{ name: rx }, { code: rx }, { unitType: rx }, { level: rx }, { doorNumber: rx }];
    }

    return q;
}

export default class UnitsRepository {
    async list(filters = {}) {
        const q = buildQuery(filters);

        return Unit.find(q)
            .populate({ path: "propertyId", select: "codigo code nombre name pais ubicacion tenantId active" })
            .populate({ path: "businessId", select: "codigo code nombre name tenantId active" })
            .sort({ createdAt: -1 })
            .lean();
    }

    async getById(id) {
        return Unit.findById(id)
            .populate({ path: "propertyId", select: "codigo code nombre name pais ubicacion tenantId active" })
            .populate({ path: "businessId", select: "codigo code nombre name tenantId active" })
            .lean();
    }

    async create(payload) {
        const doc = await Unit.create(payload);
        return doc.toObject();
    }

    async update(id, payload) {
        const doc = await Unit.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
        return doc ? doc.toObject() : null;
    }

    async remove(id) {
        const doc = await Unit.findByIdAndDelete(id);
        return doc ? doc.toObject() : null;
    }
}

