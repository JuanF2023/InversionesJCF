// server/src/modules/tenants/infrastructure/repositories/tenant.repository.js
import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";

const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 4000);

export class TenantRepository {
    async findAllActive({ status = 'active', type = null } = {}) {
        const query = { status };
        if (type) {
            query.type = type;
        }
        
        return Tenant.find(query)
            .select('_id key slug name type status')
            .sort({ name: 1 })
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    }

    async findById(id) {
        return Tenant.findById(id)
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    }

    async findByIds(ids) {
        return Tenant.find({ _id: { $in: ids } })
            .select('_id key slug name type status')
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    }
}

export default TenantRepository;