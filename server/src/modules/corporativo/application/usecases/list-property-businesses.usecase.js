// server/src/modules/corporativo/application/usecases/list-property-businesses.usecase.js
export class ListPropertyBusinessesUsecase {
    /**
     * @param {{ propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(codigoOrId, query = {}) {
        return this.propertiesRepository.listBusinessesByPropertyCodigoOrId(codigoOrId, query);
    }
}
