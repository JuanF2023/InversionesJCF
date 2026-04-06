// server/src/modules/auth/application/use-cases/sessions/toggleBreak.usecase.js
import { buildSessionsRepository } from "../../builders/sessions.builder.js";

/**
 * Iniciar/finalizar receso con trazabilidad.
 */
export async function toggleBreakUseCase({ token, action } = {}) {
  const t = String(token || "").trim();
  const normalizedAction = String(action || "").trim().toLowerCase();

  if (!t) {
    return {
      ok: false,
      statusCode: 400,
      code: "NO_TOKEN",
      message: "Token requerido.",
    };
  }

  if (!["start", "end"].includes(normalizedAction)) {
    return {
      ok: false,
      statusCode: 400,
      code: "INVALID_ACTION",
      message: 'La acción debe ser "start" o "end".',
    };
  }

  const sessionsRepository = buildSessionsRepository();
  const session = await sessionsRepository.findActiveByToken(t);

  if (!session) {
    return {
      ok: false,
      statusCode: 404,
      code: "SESSION_NOT_FOUND",
      message: "No se encontró una sesión activa para ese token.",
    };
  }

  const currentState = String(session.state || "").trim().toUpperCase();

  if (normalizedAction === "start" && currentState !== "ACTIVE") {
    return {
      ok: false,
      statusCode: 409,
      code: "INVALID_STATE_TRANSITION",
      message: "Solo una sesión ACTIVE puede pasar a BREAK.",
    };
  }

  if (normalizedAction === "end" && currentState !== "BREAK") {
    return {
      ok: false,
      statusCode: 409,
      code: "INVALID_STATE_TRANSITION",
      message: "Solo una sesión BREAK puede volver a ACTIVE.",
    };
  }

  const nextState = normalizedAction === "start" ? "BREAK" : "ACTIVE";

  const updated = await sessionsRepository.updateById(session._id, {
    state: nextState,
    lastActiveAt: new Date(),
  });

  return {
    ok: true,
    statusCode: 200,
    data: {
      token: t,
      state: updated?.state || nextState,
      sessionId: String(session._id),
    },
  };
}

export default toggleBreakUseCase;