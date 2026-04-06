export async function removeBusinessUseCase(repo, { id }) {
    if (!id) {
        const e = new Error("ID requerido.");
        e.status = 400;
        e.code = "VALIDATION";
        throw e;
    }

    const removed = await repo.softDelete(id);
    if (!removed) {
        const e = new Error("Negocio no encontrado.");
        e.status = 404;
        e.code = "NOT_FOUND";
        throw e;
    }

    return { id, deleted: true };
}
