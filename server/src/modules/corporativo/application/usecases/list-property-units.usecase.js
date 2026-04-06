// server/src/modules/corporativo/application/usecases/list-property-units.usecase.js
export class ListPropertyUnitsUsecase {
    /**
     * @param {{ propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(codigoOrId, query = {}) {
        return this.propertiesRepository.listUnitsByPropertyCodigoOrId(codigoOrId, query);
    }
}
