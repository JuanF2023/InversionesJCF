// server/src/modules/auth/infrastructure/repositories/index.js
import userRepository from "#modules/auth/infrastructure/repositories/user.repository.js";
import sessionRepository from "#modules/auth/infrastructure/repositories/session.repository.js";
import membershipsRepository from "#modules/auth/infrastructure/repositories/memberships.repository.js";

export { userRepository, sessionRepository, membershipsRepository };

export default {
    userRepository,
    sessionRepository,
    membershipsRepository,
};