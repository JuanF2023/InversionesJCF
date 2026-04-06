// server/src/modules/corporativo/application/usecases/properties/update-property.usecase.js
import { PropertyEntity } from "#modules/corporativo/domain/entities/property.entity.js";

export class UpdatePropertyUseCase {
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    async execute(id, patch) {
        if (!id) return null;
        const normalized = PropertyEntity.patch(patch);
        return this.propertiesRepository.update(id, normalized);
    }
}
