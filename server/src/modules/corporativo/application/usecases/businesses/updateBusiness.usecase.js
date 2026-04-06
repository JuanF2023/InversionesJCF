import { validateBusinessUpdate } from "#modules/corporativo/domain/validators/business.validator.js";

export async function updateBusinessUseCase(repo, { id, payload }) {
    if (!id) {
        const e = new Error("ID requerido.");
        e.status = 400;
        e.code = "VALIDATION";
        throw e;
    }

    const data = validateBusinessUpdate(payload);

    const updated = await repo.update(id, data);
    if (!updated) {
        const e = new Error("Negocio no encontrado.");
        e.status = 404;
        e.code = "NOT_FOUND";
        throw e;
    }

    return updated;
}
