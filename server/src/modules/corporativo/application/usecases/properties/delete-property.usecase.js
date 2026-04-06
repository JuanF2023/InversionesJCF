// server/src/modules/corporativo/application/usecases/properties/delete-property.usecase.js
export class DeletePropertyUseCase {
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(id) {
        if (!id) return { deleted: false };
        return this.propertiesRepository.delete(id);
    }
}
