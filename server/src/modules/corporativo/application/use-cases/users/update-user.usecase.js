// server/src/modules/corporativo/application/use-cases/users/update-user.usecase.js

import { normalizeUserUpdatePayload } from "#modules/corporativo/domain/users/users.rules.js";

export function buildUpdateUserUseCase({ usersRepository }) {
    return {
        async execute(id, payload = {}) {
            const normalizedPatch = normalizeUserUpdatePayload(payload);

            return usersRepository.updateById(id, normalizedPatch);
        },
    };
}