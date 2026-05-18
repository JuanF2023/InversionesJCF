// server/src/modules/corporativo/application/use-cases/users/update-user-access.usecase.js

export function buildUpdateUserAccessUseCase({ usersRepository }) {
    return {
        async execute(userId, payload = {}) {
            return usersRepository.upsertAccessByUserId(userId, payload);
        },
    };
}