// server/src/core/interface/http/middlewares/withScopes.middleware.js

/**
 * withScopes (enterprise)
 * - HARD: bloquea (403) si faltan scopes.
 * - SOFT: permite en DEV pero loggea warning.
 *
 * Fuente de scopes:
 * - req.auth.scopes (seteado por requireAuth)
 * - req.auth.user.scopes (fallback)
 */
function normalizeList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x || "").trim()).filter(Boolean);
  return String(v || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function hasAnyScope(userScopes, requiredScopes) {
  const set = new Set(normalizeList(userScopes));
  const required = normalizeList(requiredScopes);
  if (!required.length) return true;
  return required.some((r) => set.has(r) || set.has("corporativo:*") || set.has("super:*"));
}

export function withScopes(required, opts = {}) {
  const mode = String(opts.mode || process.env.RBAC_MODE || "SOFT").toUpperCase();

  return function withScopesMiddleware(req, res, next) {
    try {
      const userScopes =
        req?.auth?.scopes ||
        req?.auth?.user?.scopes ||
        [];

      const ok = hasAnyScope(userScopes, required);
      if (ok) return next();

      const label = req?.auth?.user?.nombre || req?.auth?.user?.email || "-";
      const route = `${req.method} ${req.originalUrl}`;

      if (mode === "SOFT") {
        console.warn(
          `[withScopes:${mode}] Falta RBAC real. Se permite acceso en DEV. Ruta: ${route} required:`,
          required,
          "userScopes:",
          userScopes,
          "label:",
          label
        );
        return next();
      }

      return res.status(403).json({
        ok: false,
        status: 403,
        code: "FORBIDDEN",
        message: "No tiene permisos suficientes.",
        required,
      });
    } catch (err) {
      console.error("[withScopes.middleware] error inesperado:", err);
      return res.status(500).json({
        ok: false,
        status: 500,
        code: "SCOPES_MIDDLEWARE_ERROR",
        message: "Error interno validando permisos.",
      });
    }
  };
}

export default withScopes;