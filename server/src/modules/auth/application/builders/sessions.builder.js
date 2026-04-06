// server/src/modules/auth/application/builders/sessions.builder.js
import SessionsRepositoryMongo from "#modules/auth/infrastructure/repositories/sessions.repository.mongo.js";

/**
 * Builder del repositorio de sesiones.
 * Centraliza la construcción de dependencias para casos de uso de sesiones.
 *
 * @returns {SessionsRepositoryMongo}
 */
export function buildSessionsRepository() {
    return new SessionsRepositoryMongo();
}

export default buildSessionsRepository;