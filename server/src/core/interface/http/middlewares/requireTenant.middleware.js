// server/src/core/interface/http/middlewares/requireTenant.middleware.js

/**
 * requireTenant (enterprise)
 * - Fuente canónica: req.context.tenantId (applyHttpContext)
 * - Pero tolera fallback seguro:
 *   1) header x-tenant-id
 *   2) req.auth.tenantId
 *   3) req.context.tenantId
 *   4) req.tenantId
 *
 * - Sin inventar tenant.
 * - Normaliza y sincroniza:
 *   req.context.tenantId
 *   req.tenantId
 */
function readHeaderTenant(req) {
    // Express normaliza headers a lowercase, pero req.get() es más robusto.
    const raw =
        (typeof req.get === "function" && req.get("x-tenant-id")) ||
        req.headers?.["x-tenant-id"] ||
        req.headers?.["x-tenantid"] ||
        req.headers?.["tenant-id"] ||
        req.headers?.["tenantid"] ||
        "";

    return String(raw || "").trim();
}

function pickTenantId(req) {
    const fromHeader = readHeaderTenant(req);
    if (fromHeader) return fromHeader;

    const fromAuth = req?.auth?.tenantId != null ? String(req.auth.tenantId).trim() : "";
    if (fromAuth) return fromAuth;

    const fromCtx = req?.context?.tenantId != null ? String(req.context.tenantId).trim() : "";
    if (fromCtx) return fromCtx;

    const fromReq = req?.tenantId != null ? String(req.tenantId).trim() : "";
    if (fromReq) return fromReq;

    return "";
}

export function requireTenant() {
    return function requireTenantMiddleware(req, res, next) {
        const tenantId = pickTenantId(req);

        if (!tenantId) {
            return res.status(400).json({
                ok: false,
                status: 400,
                code: "TENANT_REQUIRED",
                message: "tenantId requerido (multi-tenant).",
            });
        }

        // Sync enterprise: deja el tenant consistente en todo el request
        req.context = req.context || {};
        req.context.tenantId = tenantId;
        req.tenantId = tenantId;

        return next();
    };
}

export default requireTenant;