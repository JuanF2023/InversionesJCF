// server/src/modules/corporativo/infrastructure/repositories/users.repository.js

import usersRepositoryMongo from "#modules/corporativo/infrastructure/repositories/users/users.repository.mongo.js";

/**
 * Repository facade for corporativo users.
 */
const usersRepository = usersRepositoryMongo;

export default usersRepository;