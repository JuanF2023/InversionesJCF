// server/src/modules/auth/application/use-cases/sessions/verifySession.usecase.js
import jwt from "jsonwebtoken";
import { buildSessionsRepository } from "../../builders/sessions.builder.js";
import { UserRepository } from "#modules/auth/infrastructure/repositories/user.repository.js";

/**
 * Caso de uso: verificar sesión.
 * - Verifica JWT (firma/exp)
 * - Confirma sesión vigente en DB (ACTIVE/BREAK) por token
 * - Devuelve datos mínimos para contexto
 *
 * @param {{ token?: string }} input
 * @returns {Promise<{
 *   ok: boolean,
 *   status: number,
 *   code?: string,
 *   message?: string,
 *   data?: {
 *     token: string,
 *     sessionId: string,
 *     tenantId: string | null,
 *     state: string | null,
 *     user: any
 *   }
 * }>}
 */
export async function verifySessionUseCase({ token } = {}) {
  const t = String(token || "").trim();

  if (!t) {
    return {
      ok: false,
      status: 401,
      code: "NO_TOKEN",
      message: "Token requerido.",
    };
  }

  const secret = process.env.JWT_SECRET || "change_me_in_env";

  let payload;
  try {
    payload = jwt.verify(t, secret);
  } catch {
    return {
      ok: false,
      status: 401,
      code: "INVALID_TOKEN",
      message: "Token inválido o expirado.",
    };
  }

  const sessionsRepository = buildSessionsRepository();

  const session = await sessionsRepository.findActiveByToken(t, { populateUser: true });

  if (!session) {
    return {
      ok: false,
      status: 401,
      code: "SESSION_INVALID",
      message: "Sesión no válida.",
    };
  }

  if (typeof sessionsRepository.touchActivityByToken === "function") {
    try {
      await sessionsRepository.touchActivityByToken(t);
    } catch {
      // No bloquear verificación por fallo de touch
    }
  }

  const userDoc = session.userId || session.user || null;
  const userId = userDoc?._id ? String(userDoc._id) : String(session.userId || "");

  let user = userDoc;

  if (!user && userId) {
    const userRepository =
      typeof UserRepository === "function" ? new UserRepository() : UserRepository;

    if (typeof userRepository.findById === "function") {
      user = await userRepository.findById(userId);
    }
  }

  const tenantFromSession = session?.tenantId ? String(session.tenantId) : null;
  const tenantFromJwt = payload?.tenantId ? String(payload.tenantId) : null;
  const tenantFromUser = user?.tenantId ? String(user.tenantId) : null;

  return {
    ok: true,
    status: 200,
    data: {
      token: t,
      sessionId: String(session._id),
      tenantId: tenantFromSession || tenantFromJwt || tenantFromUser || null,
      state: session.state || null,
      user,
    },
  };
}

export default verifySessionUseCase;