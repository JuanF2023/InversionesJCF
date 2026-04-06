// server/src/modules/auth/infrastructure/repositories/tenants.repository.js
import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";

const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 2000);

function assertConnected() {
    const rs = Tenant?.db?.readyState;
    if (rs !== 1) {
        const err = new Error(`[TenantsRepository] Mongo no listo. readyState=${rs}`);
        err.code = "MONGO_NOT_READY";
        throw err;
    }
}

export const TenantsRepository = {
    async findByIds(ids = []) {
        assertConnected();

        const list = Array.isArray(ids) ? ids.filter(Boolean) : [];
        if (!list.length) return [];

        return Tenant.find({
            _id: { $in: list },
            status: "active",
        })
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    },

    async findById(id) {
        assertConnected();

        if (!id) return null;

        return Tenant.findById(id)
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    },
};

export default TenantsRepository;