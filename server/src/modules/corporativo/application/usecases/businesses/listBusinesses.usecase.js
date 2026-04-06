export async function listBusinessesUseCase(repo, params) {
    const { page, limit, sort, search, filters } = params || {};
    return repo.list({ page, limit, sort, search, filters });
}
