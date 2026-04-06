import { validateBusinessCreate } from "#modules/corporativo/domain/validators/business.validator.js";

export async function createBusinessUseCase(repo, { payload }) {
    const data = validateBusinessCreate(payload);
    return repo.create(data);
}
