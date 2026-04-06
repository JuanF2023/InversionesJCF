// server/src/modules/corporativo/application/use-cases/access/GetAccessOptionsUseCase.js
import { RoleFilter } from "#modules/roles/domain/value-objects/RoleFilter.js";

export class GetAccessOptionsUseCase {
    constructor({ tenantRepository, roleRepository }) {
        this.tenantRepository = tenantRepository;
        this.roleRepository = roleRepository;
    }

    async execute({ tenantId = null, status = "active" } = {}) {
        try {
            console.log("[GetAccessOptionsUseCase] Fetching options...", {
                tenantId,
                status,
            });

            // 1) Siempre devolver todos los tenants activos
            const tenants = await this.tenantRepository.findAllActive({ status });

            // 2) Si no hay tenant seleccionado, roles vacíos (el frontend ya disparará otra petición)
            if (!tenantId) {
                console.log(
                    `[GetAccessOptionsUseCase] Found ${tenants.length} tenants, 0 roles (tenant no seleccionado)`
                );

                return {
                    tenants: tenants.map((tenant) => this.toTenantDTO(tenant)),
                    roles: [],
                };
            }

            // 3) Buscar el tenant seleccionado para obtener su type
            const selectedTenant = await this.tenantRepository.findById(tenantId);

            if (!selectedTenant) {
                throw new Error(`Tenant no encontrado: ${tenantId}`);
            }

            const tenantType = selectedTenant.type || null;

            if (!tenantType) {
                throw new Error(`El tenant ${tenantId} no tiene type definido`);
            }

            // 4) Buscar roles por tenantType
            const roleFilter = new RoleFilter({
                tenantType,
                status,
            });

            const roles = await this.roleRepository.findByFilter(roleFilter);

            // 5) Aplicar reglas de negocio (por si acaso)
            const processedRoles = this.applyBusinessRules(roles, [selectedTenant]);

            console.log(
                `[GetAccessOptionsUseCase] Found ${tenants.length} tenants, ${processedRoles.length} roles for tenantType=${tenantType}`
            );

            return {
                tenants: tenants.map((tenant) => this.toTenantDTO(tenant)),
                roles: processedRoles.map((role) => this.toRoleDTO(role)),
            };
        } catch (error) {
            console.error("[GetAccessOptionsUseCase Error]", error);
            throw new Error(`Error loading access options: ${error.message}`);
        }
    }

    applyBusinessRules(roles, tenants) {
        if (tenants.length > 0) {
            const tenantTypes = [...new Set(tenants.map((tenant) => tenant.type).filter(Boolean))];

            return roles.filter((role) => {
                return !role.tenantType || tenantTypes.includes(role.tenantType);
            });
        }
        return roles;
    }

    toTenantDTO(tenant) {
        return {
            id: String(tenant._id),
            key: tenant.key || "",
            slug: tenant.slug || "",
            nombre: tenant.name || "",
            tenantType: tenant.type || "",
            tipo: tenant.type || "",
            status: tenant.status || "active",
        };
    }

    toRoleDTO(role) {
        return {
            id: String(role._id),
            key: role.key || "",
            slug: role.slug || "",
            nombre: role.name || "",
            tenantType: role.tenantType || "",
            tipo: role.tenantType || "",
            status: role.status || "active",
        };
    }
}

export default GetAccessOptionsUseCase;