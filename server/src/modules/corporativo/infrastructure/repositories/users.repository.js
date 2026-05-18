// server/src/modules/corporativo/infrastructure/repositories/users.repository.js

import usersRepositoryMongo from "#modules/corporativo/infrastructure/repositories/users.repository.mongo.js";

/**
 * Repository facade for corporativo users.
 *
 * This facade keeps the application layer independent from the concrete MongoDB
 * implementation path. The next refactor phase will split the Mongo adapter into
 * read, write, access and aggregation files behind this facade.
 */
const usersRepository = usersRepositoryMongo;

export default usersRepository;