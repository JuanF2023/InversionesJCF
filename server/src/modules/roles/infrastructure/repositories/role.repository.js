// server/src/modules/roles/infrastructure/repositories/role.repository.js
import { Role } from "#modules/roles/infrastructure/mongoose/models/role.model.js";
import { RoleFilter } from "../../domain/value-objects/RoleFilter.js";

const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 4000);

export class RoleRepository {
    async findByFilter(filter) {
        const query = filter instanceof RoleFilter 
            ? filter.toRepositoryQuery() 
            : { status: 'active' };

        return Role.find(query)
            .select('_id key slug name tenantType status')
            .sort({ name: 1 })
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    }

    async findAllActive() {
        return this.findByFilter({ status: 'active' });
    }

    async findByTenantType(tenantType) {
        return this.findByFilter({ tenantType, status: 'active' });
    }

    async findById(id) {
        return Role.findById(id)
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    }

    async findByIds(ids) {
        return Role.find({ _id: { $in: ids } })
            .select('_id key slug name tenantType status')
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    }
}

export default RoleRepository;