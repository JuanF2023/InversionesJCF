// server/src/modules/corporativo/application/usecases/properties/create-property.usecase.js
import { PropertyEntity } from "#modules/corporativo/domain/entities/property.entity.js";

export class CreatePropertyUseCase {
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(payload) {
        const entity = PropertyEntity.create(payload);
        return this.propertiesRepository.create(entity);
    }
}
