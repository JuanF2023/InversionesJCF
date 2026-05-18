// server/src/modules/corporativo/application/use-cases/users/delete-user-access.usecase.js

export function buildDeleteUserAccessUseCase({ usersRepository }) {
    return {
        async execute(userId, membershipId, payload = {}) {
            return usersRepository.deactivateAccessByMembershipId(
                userId,
                membershipId,
                payload
            );
        },
    };
}