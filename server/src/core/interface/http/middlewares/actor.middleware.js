// server/src/core/interface/http/middlewares/actor.middleware.js
import { randomUUID } from "crypto";

/**
 * Actor middleware (enterprise)
 * - Define requestId para trazabilidad.
 * - Normaliza actor desde headers o desde req.auth.user si ya existe.
 * - NO hace I/O, NO lanza errores.
 */
export function actor() {
  return function actorMiddleware(req, _res, next) {
    req.requestId = req.requestId || randomUUID();

    // Si auth ya seteo contexto, respétalo
    const authUser = req?.auth?.user || null;
    if (authUser && !req.actor) {
      req.actor = {
        _id: authUser?._id ? String(authUser._id) : null,
        nombre: authUser?.nombre || authUser?.name || authUser?.username || "",
        rol: authUser?.rol || authUser?.role || null,
      };
    }

    // Headers opcionales (soporte técnico / auditoría)
    const headerActorId = req.headers?.["x-actor-id"];
    const headerActorName = req.headers?.["x-actor-name"];

    if (!req.actor && (headerActorId || headerActorName)) {
      req.actor = {
        _id: headerActorId ? String(headerActorId) : null,
        nombre: headerActorName ? String(headerActorName) : "",
        rol: null,
      };
    }

    req.actorId =
      req.actorId ||
      req.actor?._id ||
      req.actor?.id ||
      (authUser?._id ? String(authUser._id) : null) ||
      null;

    return next();
  };
}

export default actor;