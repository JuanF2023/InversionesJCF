// server/src/modules/corporativo/application/builders/users.builder.js

import usersRepository from "#modules/corporativo/infrastructure/repositories/users.repository.js";

import {
    buildCreateUserUseCase,
    buildDeleteUserAccessUseCase,
    buildDeleteUserUseCase,
    buildGetUserByIdUseCase,
    buildListUsersUseCase,
    buildUpdateUserAccessUseCase,
    buildUpdateUserUseCase,
} from "#modules/corporativo/application/use-cases/users/index.js";

export function buildUsersModule() {
    return {
        listUsersUseCase: buildListUsersUseCase({ usersRepository }),
        getUserByIdUseCase: buildGetUserByIdUseCase({ usersRepository }),
        createUserUseCase: buildCreateUserUseCase({ usersRepository }),
        updateUserUseCase: buildUpdateUserUseCase({ usersRepository }),
        deleteUserUseCase: buildDeleteUserUseCase({ usersRepository }),
        updateUserAccessUseCase: buildUpdateUserAccessUseCase({ usersRepository }),
        deleteUserAccessUseCase: buildDeleteUserAccessUseCase({ usersRepository }),
    };
}

export default buildUsersModule;