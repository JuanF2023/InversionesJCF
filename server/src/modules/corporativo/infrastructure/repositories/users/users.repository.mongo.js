// server/src/modules/corporativo/infrastructure/repositories/users/users.repository.mongo.js

import usersReadRepositoryMongo from "#modules/corporativo/infrastructure/repositories/users/users-read.repository.mongo.js";
import { buildUsersAccessRepositoryMongo } from "#modules/corporativo/infrastructure/repositories/users/users-access.repository.mongo.js";
import { buildUsersWriteRepositoryMongo } from "#modules/corporativo/infrastructure/repositories/users/users-write.repository.mongo.js";

const usersWriteRepositoryMongo = buildUsersWriteRepositoryMongo({
    usersReadRepository: usersReadRepositoryMongo,
});

const usersAccessRepositoryMongo = buildUsersAccessRepositoryMongo({
    usersReadRepository: usersReadRepositoryMongo,
});

const usersRepositoryMongo = {
    ...usersReadRepositoryMongo,
    ...usersWriteRepositoryMongo,
    ...usersAccessRepositoryMongo,
};

export default usersRepositoryMongo;