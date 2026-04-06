// server/src/modules/corporativo/application/builders/properties.builder.js
import { PropertiesRepositoryMongo } from "#modules/corporativo/infrastructure/repositories/properties.repository.mongo.js";

import { ListPropertiesUseCase } from "#modules/corporativo/application/usecases/properties/list-properties.usecase.js";
import { GetPropertyByIdUseCase } from "#modules/corporativo/application/usecases/properties/get-property-by-id.usecase.js";
import { CreatePropertyUseCase } from "#modules/corporativo/application/usecases/properties/create-property.usecase.js";
import { UpdatePropertyUseCase } from "#modules/corporativo/application/usecases/properties/update-property.usecase.js";
import { DeletePropertyUseCase } from "#modules/corporativo/application/usecases/properties/delete-property.usecase.js";

export function buildPropertiesUseCases() {
    const propertiesRepository = new PropertiesRepositoryMongo();

    return {
        list: new ListPropertiesUseCase({ propertiesRepository }),
        getById: new GetPropertyByIdUseCase({ propertiesRepository }),
        create: new CreatePropertyUseCase({ propertiesRepository }),
        update: new UpdatePropertyUseCase({ propertiesRepository }),
        delete: new DeletePropertyUseCase({ propertiesRepository }),
    };
}
