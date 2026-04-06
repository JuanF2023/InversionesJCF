// server/src/modules/corporativo/application/builders/access.builder.js
import { TenantRepository } from "#modules/tenants/infrastructure/repositories/tenant.repository.js";
import { RoleRepository } from "#modules/roles/infrastructure/repositories/role.repository.js";
import { GetAccessOptionsUseCase } from "../use-cases/access/GetAccessOptionsUseCase.js";

export function buildGetAccessOptionsUseCase() {
    const tenantRepository = new TenantRepository();
    const roleRepository = new RoleRepository();
    
    return new GetAccessOptionsUseCase({
        tenantRepository,
        roleRepository
    });
}

export default buildGetAccessOptionsUseCase;