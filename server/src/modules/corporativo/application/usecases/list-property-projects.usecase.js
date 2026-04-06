// server/src/modules/corporativo/application/usecases/list-property-projects.usecase.js
export class ListPropertyProjectsUsecase {
    /**
     * @param {{ propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(codigoOrId, query = {}) {
        return this.propertiesRepository.listProjectsByPropertyCodigoOrId(codigoOrId, query);
    }
}
