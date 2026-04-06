// server/src/modules/corporativo/application/usecases/list-properties.usecase.js
export class ListPropertiesUsecase {
    /**
     * @param {{
     *  propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort
     * }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    /**
     * @param {Object} query
     * @returns {Promise<{items:Array, total:number, page:number, limit:number}>}
     */
    async execute(query = {}) {
        const normalized = {
            q: query.q,
            estado: query.estado,
            pais: query.pais,
            page: query.page,
            limit: query.limit ?? 0, // 0 = sin límite
        };

        return this.propertiesRepository.list(normalized);
    }
}
