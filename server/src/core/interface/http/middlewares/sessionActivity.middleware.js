// server/src/core/interface/http/middlewares/sessionActivity.middleware.js
import { Session } from "#modules/auth/infrastructure/mongoose/models/session.model.js";

/**
 * sessionActivityMiddleware (enterprise)
 * - NO bloquea el request.
 * - Si hay token (x-session-token o Authorization Bearer), toca lastActiveAt.
 */
function extractToken(req) {
  const headerToken = String(req.headers?.["x-session-token"] || "").trim();
  if (headerToken) return headerToken;

  const authHeader = String(req.headers?.authorization || req.headers?.Authorization || "").trim();
  if (authHeader && /^Bearer\s+/i.test(authHeader)) {
    return authHeader.replace(/^Bearer\s+/i, "").trim();
  }
  return "";
}

/**
 * Middleware directo (NO factory) para compatibilidad con imports tipo:
 * import { touchActivity } from "./middlewares/sessionActivity.middleware.js";
 */
export function touchActivity(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();

    // Fire-and-forget (no await)
    Session.updateOne(
      { token, state: { $in: ["ACTIVE", "BREAK"] } },
      { $set: { lastActiveAt: new Date() } }
    ).catch(() => { });

    return next();
  } catch (_err) {
    return next();
  }
}

/**
 * Factory original (por si en otro lado lo usas como: app.use(sessionActivityMiddleware()))
 */
export function sessionActivityMiddleware() {
  return function sessionActivity(req, _res, next) {
    return touchActivity(req, _res, next);
  };
}

export default sessionActivityMiddleware;
