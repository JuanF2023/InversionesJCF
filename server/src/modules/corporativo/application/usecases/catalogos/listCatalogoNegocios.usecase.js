// server/src/modules/corporativo/application/usecases/catalogos/listcatalogo-negocios.usecase.js
import catalogo-negociosModel from "#modules/negocio/infrastructure/mongoose/models/catalog.model.js";

export async function listcatalogo-negociosUseCase({ tenantId }) {
    const t = String(tenantId || "CORPORATIVO").trim();

    const items = await catalogo-negociosModel.find({ tenantId: t, activo: true })
        .sort({ orden: 1 })
        .lean();

    return {
        ok: true,
        status: 200,
        data: { items },
    };
}

