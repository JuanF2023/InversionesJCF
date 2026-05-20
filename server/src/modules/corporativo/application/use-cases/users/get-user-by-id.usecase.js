// server/src/modules/corporativo/application/use-cases/users/get-user-by-id.usecase.js

export function buildGetUserByIdUseCase({ usersRepository }) {
    return {
        async execute(id) {
            return usersRepository.findById(id);
        },
    };
}