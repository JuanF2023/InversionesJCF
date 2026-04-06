// server/src/modules/corporativo/application/usecases/properties/list-properties.usecase.js
export class ListPropertiesUseCase {
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(filters = {}) {
        return this.propertiesRepository.list(filters);
    }
}
