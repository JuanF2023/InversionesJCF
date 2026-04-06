// server/src/core/interface/http/middlewares/requireAuth.middleware.js
import { buildAuthService } from "#modules/auth/application/builders/auth.builder.js";

/**
 * requireAuth (enterprise)
 * - Fuente de verdad única: AuthService.verifySession()
 * - Evita inconsistencias entre /api/auth/verify y rutas protegidas.
 *
 * Adjunta:
 *   req.auth = { token, sessionId, tenantId, state, user, scopes }
 *
 * Headers soportados:
 * - x-session-token: <token>
 * - Authorization: Bearer <token>
 */

function extractToken(req) {
  const headerToken = String(req.headers?.["x-session-token"] || "").trim();
  if (headerToken) {
    return headerToken;
  }

  const authHeader = String(
    req.headers?.authorization || req.headers?.Authorization || ""
  ).trim();

  if (authHeader && /^Bearer\s+/i.test(authHeader)) {
    return authHeader.replace(/^Bearer\s+/i, "").trim();
  }

  return "";
}

function normalizeScopes(user) {
  if (Array.isArray(user?.scopes)) {
    return user.scopes.map(String);
  }

  if (Array.isArray(user?.permissions)) {
    return user.permissions.map(String);
  }

  return [];
}

function resolveTenantId(req, outData) {
  const headerTenant =
    typeof req.headers?.["x-tenant-id"] === "string"
      ? req.headers["x-tenant-id"].trim()
      : "";

  const outTenant =
    outData?.tenantId != null
      ? String(outData.tenantId).trim()
      : "";

  const contextTenant =
    req?.context?.tenantId != null
      ? String(req.context.tenantId).trim()
      : "";

  return headerTenant || outTenant || contextTenant || null;
}

/**
 * Instancia compartida del servicio de autenticación.
 * Se reutiliza para mantener consistencia del middleware.
 */
const authService = buildAuthService();

export function requireAuth(options = {}) {
  const strict = options?.strict === true;
  const touchActivity = options?.touchActivity === true;

  return async function requireAuthMiddleware(req, res, next) {
    try {
      const token = extractToken(req);

      if (!token) {
        return res.status(401).json({
          ok: false,
          status: 401,
          code: "NO_TOKEN",
          message: "Token requerido.",
        });
      }

      const result = await authService.verifySession({
        token,
        touchActivity,
      });

      if (!result?.ok) {
        const statusCode = result?.statusCode || 401;

        return res.status(statusCode).json({
          ok: false,
          status: statusCode,
          code: result?.code || "SESSION_INVALID",
          message: result?.message || "Sesión no válida.",
        });
      }

      const data = result?.data || {};
      const user = data?.user || null;

      if (strict && user && user.active === false) {
        return res.status(403).json({
          ok: false,
          status: 403,
          code: "USER_INACTIVE",
          message: "Usuario inactivo.",
        });
      }

      const tenantId = resolveTenantId(req, data);

      if (!tenantId) {
        return res.status(401).json({
          ok: false,
          status: 401,
          code: "TENANT_MISSING",
          message: "Tenant no disponible para esta sesión.",
        });
      }

      req.context = req.context || {};
      req.context.tenantId = tenantId;

      req.tenantId = tenantId;

      req.auth = {
        token: data?.token || token,
        sessionId: data?.sessionId ? String(data.sessionId) : null,
        tenantId,
        state: data?.state || null,
        user,
        scopes: normalizeScopes(user),
      };

      if (!req.actor && user) {
        req.actor = {
          _id: user?._id ? String(user._id) : null,
          nombre:
            user?.nombre ||
            user?.fullName ||
            user?.name ||
            user?.username ||
            "",
          rol: user?.rol || user?.role || null,
        };

        req.actorId = req.actor?._id || null;
      }

      return next();
    } catch (error) {
      console.error("[requireAuth.middleware] error inesperado:", error);

      return res.status(500).json({
        ok: false,
        status: 500,
        code: "AUTH_MIDDLEWARE_ERROR",
        message: "Error interno en autenticación.",
      });
    }
  };
}

export default requireAuth;