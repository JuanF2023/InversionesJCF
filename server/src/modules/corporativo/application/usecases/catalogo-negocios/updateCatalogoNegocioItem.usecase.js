// server/src/modules/corporativo/application/usecases/catalogo-negocios/updateCatalogoNegocioItem.usecase.js
import { validateUpdateCatalogoItem } from "#modules/corporativo/domain/catalogo-negocios/catalogo-negocios.rules.js";
import { updateCatalogoItem } from "#modules/corporativo/infrastructure/mongoose/repositories/catalogo-negocios.repository.js";

export async function updateCatalogoNegocioItemUseCase(key, input) {
    const patch = validateUpdateCatalogoItem(input);
    return updateCatalogoItem(key, patch);
}

