export async function getBusinessByIdUseCase(repo, { id }) {
    if (!id) {
        const e = new Error("ID requerido.");
        e.status = 400;
        e.code = "VALIDATION";
        throw e;
    }

    const item = await repo.getById(id);
    if (!item) {
        const e = new Error("Negocio no encontrado.");
        e.status = 404;
        e.code = "NOT_FOUND";
        throw e;
    }

    return item;
}
