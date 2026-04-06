// server/src/modules/corporativo/application/usecases/get-properties-summary.usecase.js
export class GetPropertiesSummaryUsecase {
    /**
     * @param {{ propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    /**
     * @returns {Promise<Object>}
     */
    async execute() {
        return this.propertiesRepository.summary();
    }
}
