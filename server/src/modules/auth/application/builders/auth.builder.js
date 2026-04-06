// server/src/modules/auth/application/builders/auth.builder.js
import { AuthService } from "#modules/auth/application/services/auth.service.js";
import { UserRepository } from "#modules/auth/infrastructure/repositories/user.repository.js";
import SessionsRepositoryMongo from "#modules/auth/infrastructure/repositories/sessions.repository.mongo.js";
import membershipsRepository from "#modules/auth/infrastructure/repositories/memberships.repository.js";
import tenantsRepository from "#modules/auth/infrastructure/repositories/tenants.repository.js";

export function buildAuthService() {
    const userRepository =
        typeof UserRepository === "function"
            ? new UserRepository()
            : UserRepository;

    const sessionRepository =
        typeof SessionsRepositoryMongo === "function"
            ? new SessionsRepositoryMongo()
            : SessionsRepositoryMongo;

    return new AuthService({
        userRepository,
        sessionRepository,
        membershipsRepository,
        tenantsRepository,
    });
}

export default buildAuthService;