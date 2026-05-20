// server/src/modules/corporativo/application/use-cases/users/delete-user.usecase.js

export function buildDeleteUserUseCase({ usersRepository }) {
    return {
        async execute(id, updatedBy = null) {
            return usersRepository.softDeleteById(id, updatedBy);
        },
    };
}