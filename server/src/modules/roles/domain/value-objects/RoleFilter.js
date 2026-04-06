// server/src/modules/roles/domain/value-objects/RoleFilter.js
export class RoleFilter {
    constructor({ tenantType = null, status = 'active' }) {
        this.tenantType = tenantType;
        this.status = status;
    }

    static fromQuery(query) {
        return new RoleFilter({
            tenantType: query.tenantType || query.tenantId,
            status: query.status || 'active'
        });
    }

    toRepositoryQuery() {
        const query = { status: this.status };
        if (this.tenantType) {
            query.tenantType = this.tenantType;
        }
        return query;
    }
}

export default RoleFilter;