// server/src/modules/corporativo/application/use-cases/users/create-user.usecase.js

import { validateUserCreatePayload } from "#modules/corporativo/domain/users/users.rules.js";

export function buildCreateUserUseCase({ usersRepository }) {
    return {
        async execute(payload = {}) {
            const normalizedPayload = validateUserCreatePayload(payload);

            return usersRepository.create(normalizedPayload);
        },
    };
}