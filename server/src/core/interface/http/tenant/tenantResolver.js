// server/src/core/interface/http/tenant/tenantResolver.js

/**
 * Tenant Resolver (enterprise)
 * Fuente canónica: req.context.tenantId (set por applyHttpContext)
 * Fallbacks: req.tenantId, headers tolerados
 */
export function getTenantIdFromRequest(req) {
    const fromContext =
        req?.context?.tenantId != null ? String(req.context.tenantId).trim() : "";

    if (fromContext) return fromContext;

    const fromReq =
        req?.tenantId != null ? String(req.tenantId).trim() : "";

    if (fromReq) return fromReq;

    // Fallback: headers (tolerancia)
    const raw =
        req?.headers?.["x-tenant-id"] ||
        req?.headers?.["x-tenantid"] ||
        req?.headers?.["tenant-id"] ||
        req?.headers?.["tenantid"] ||
        null;

    const fromHeader = typeof raw === "string" ? raw.trim() : "";
    return fromHeader || "";
}