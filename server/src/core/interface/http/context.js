// server/src/core/interface/http/context.js
import { actor } from "./middlewares/actor.middleware.js";
import sessionActivityMiddleware from "./middlewares/sessionActivity.middleware.js";

/**
 * Context HTTP (enterprise)
 * - deviceLabel normalizado
 * - req.context inicializado (request-scoped)
 * - tenantId normalizado (multi-tenant)
 * - actor/actividad
 * - headers anti-cache para /api
 * - health endpoints
 */
export function applyHttpContext(app) {
  // 1) Device label (para auditoría / sesiones)
  app.use((req, _res, next) => {
    const fromHeader = String(req.headers["x-device-label"] || "").trim();
    if (fromHeader) {
      req.deviceLabel = fromHeader;
      return next();
    }

    const ua = String(req.headers["user-agent"] || "");
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    req.deviceLabel = `${ua.slice(0, 40)} @ ${ip}`;
    return next();
  });

  // 2) Context request-scoped + tenant normalization (multi-tenant)
  // IMPORTANT: Express normaliza headers a lowercase.
  app.use((req, _res, next) => {
    req.context = req.context || {};

    // Leer tenant desde headers (variantes toleradas)
    const rawHeaderTenant =
      req.headers["x-tenant-id"] ||
      req.headers["x-tenantid"] ||
      req.headers["tenant-id"] ||
      req.headers["tenantid"] ||
      null;

    const tenantFromHeader =
      typeof rawHeaderTenant === "string" ? rawHeaderTenant.trim() : "";

    // Si requireAuth ya corrió antes en algún flujo raro, respetarlo.
    const tenantFromAuth =
      req?.auth?.tenantId != null ? String(req.auth.tenantId).trim() : "";

    const tenantFromAuthUser =
      req?.auth?.user?.tenantId != null
        ? String(req.auth.user.tenantId).trim()
        : "";

    const tenantFromExistingContext =
      req?.context?.tenantId != null ? String(req.context.tenantId).trim() : "";

    // Regla: NO inventamos tenant. Si no viene, queda null.
    const tenantId =
      tenantFromHeader ||
      tenantFromAuth ||
      tenantFromAuthUser ||
      tenantFromExistingContext ||
      null;

    // Persistir en context
    req.context.tenantId = tenantId || null;

    // Compat enterprise: algunos módulos usan req.tenantId directamente
    req.tenantId = req.context.tenantId;

    // Request id (si llega desde upstream, respétalo; si no, actor middleware lo asigna)
    const hReqId = req.headers["x-request-id"];
    if (typeof hReqId === "string" && hReqId.trim()) {
      req.context.requestId = hReqId.trim();
      req.requestId = req.requestId || hReqId.trim();
    }

    return next();
  });

  // 3) Actor + actividad
  app.use(actor());

  // Importante: sessionActivity.middleware.js en tu árbol parece exportar default middleware
  // Si tú tienes `touchActivity` como export, cámbialo aquí por ese.
  app.use(sessionActivityMiddleware());

  // 4) Anti-cache para API
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    next();
  });

  // 5) Health checks
  app.get("/healthz", (_req, res) => res.json({ ok: true, ts: Date.now() }));
  app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
}