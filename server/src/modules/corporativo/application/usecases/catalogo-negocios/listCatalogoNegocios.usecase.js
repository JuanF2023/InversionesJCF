// server/src/modules/corporativo/application/usecases/catalogo-negocios/listcatalogo-negocios.usecase.js
import catalogoNegociosRepository from "#modules/corporativo/infrastructure/mongoose/repositories/catalogo-negocios.repository.js";

/**
 * UseCase: listar catálogo de negocios (enterprise)
 * - Retorna solo datos, sin shape HTTP.
 */
export async function listCatalogoNegociosUseCase({ tenantId } = {}) {
    if (
        !catalogoNegociosRepository ||
        typeof catalogoNegociosRepository.listAllCatalogoItems !== "function"
    ) {
        throw new Error(
            "catalogoNegociosRepository.listAllCatalogoItems() no existe. Revisa exports del repository."
        );
    }

    return catalogoNegociosRepository.listAllCatalogoItems({ tenantId });
}