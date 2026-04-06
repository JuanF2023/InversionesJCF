// server/src/modules/corporativo/application/usecases/properties/get-property-by-id.usecase.js
export class GetPropertyByIdUseCase {
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(id) {
        if (!id) return null;
        return this.propertiesRepository.getById(id);
    }
}
