// server/src/modules/corporativo/application/builders/users.builder.js
import usersRepositoryMongo from "#modules/corporativo/infrastructure/repositories/users.repository.mongo.js";

export function buildUsersModule() {
    return {
        usersRepository: usersRepositoryMongo,
    };
}

export default buildUsersModule;