// server/src/modules/corporativo/application/builders/businesses.builder.js
import { buildBusinessesRepository } from "#modules/corporativo/infrastructure/repositories/businesses.repository.js";

import { listBusinessesUseCase } from "#modules/corporativo/application/usecases/businesses/listBusinesses.usecase.js";
import { getBusinessByIdUseCase } from "#modules/corporativo/application/usecases/businesses/getBusinessById.usecase.js";
import { createBusinessUseCase } from "#modules/corporativo/application/usecases/businesses/createBusiness.usecase.js";
import { updateBusinessUseCase } from "#modules/corporativo/application/usecases/businesses/updateBusiness.usecase.js";
import { removeBusinessUseCase } from "#modules/corporativo/application/usecases/businesses/removeBusiness.usecase.js";

/**
 * Businesses Service Builder (Corporativo) — enterprise
 * - Ensambla repositorio + casos de uso
 * - Mantiene Clean Architecture (application orquesta, infra implementa)
 */
export function buildBusinessesService() {
    const repo = buildBusinessesRepository();

    return {
        list: (params) => listBusinessesUseCase(repo, params),
        getById: (params) => getBusinessByIdUseCase(repo, params),
        create: (params) => createBusinessUseCase(repo, params),
        update: (params) => updateBusinessUseCase(repo, params),
        remove: (params) => removeBusinessUseCase(repo, params),
    };
}
