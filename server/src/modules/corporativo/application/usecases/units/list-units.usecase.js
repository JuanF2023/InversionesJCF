// server/src/modules/corporativo/application/usecases/units/list-units.usecase.js

/**
 * Use case: Listar unidades (filtros corporativo)
 * Retorna una lista plana (UI decide paginación si aplica).
 */
export class ListUnitsUseCase {
    /**
     * @param {{ unitsRepository: { list: Function } }} deps
     */
    constructor({ unitsRepository }) {
        this.unitsRepository = unitsRepository;
    }

    /**
     * @param {{
     *  tenantId: string,
     *  propertyId?: string,
     *  businessId?: string,
     *  status?: string,
     *  q?: string,
     *  active?: boolean
     * }} filters
     */
    async execute(filters = {}) {
        // Seguridad mínima: no listar sin tenant
        if (!filters?.tenantId) {
            return [];
        }

        const normalized = {
            tenantId: String(filters.tenantId),
        };

        if (filters.propertyId) normalized.propertyId = String(filters.propertyId);
        if (filters.businessId) normalized.businessId = String(filters.businessId);

        if (filters.status != null && String(filters.status).trim()) {
            normalized.status = String(filters.status).trim();
        }

        if (filters.q != null && String(filters.q).trim()) {
            normalized.q = String(filters.q).trim();
        }

        if (filters.active !== undefined) {
            normalized.active = Boolean(filters.active);
        }

        return this.unitsRepository.list(normalized);
    }
}
