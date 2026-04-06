// server/src/modules/corporativo/application/usecases/list-property-incomes.usecase.js
export class ListPropertyIncomesUsecase {
    /**
     * @param {{ propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(codigoOrId, query = {}) {
        return this.propertiesRepository.listIncomesByPropertyCodigoOrId(codigoOrId, query);
    }
}
