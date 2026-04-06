// server/src/modules/corporativo/application/usecases/catalogo-negocios/createCatalogoNegocioItem.usecase.js
import { validateCreateCatalogoItem } from "#modules/corporativo/domain/catalogo-negocios/catalogo-negocios.rules.js";
import {
    assertParentExists,
    createCatalogoItem,
} from "#modules/corporativo/infrastructure/mongoose/repositories/catalogo-negocios.repository.js";

export async function createCatalogoNegocioItemUseCase(input) {
    const data = validateCreateCatalogoItem(input);
    await assertParentExists(data.level, data.parentKey);
    return createCatalogoItem(data);
}

