// server/src/modules/corporativo/application/use-cases/users/list-users.usecase.js

export function buildListUsersUseCase({ usersRepository }) {
    return {
        async execute(params = {}) {
            return usersRepository.list(params);
        },
    };
}