// server/src/modules/auth/interface/http/controllers/sessions.controller.js
import { verifySessionUseCase } from "#modules/auth/application/use-cases/sessions/verifySession.usecase.js";
import { getActiveSessionsUseCase } from "#modules/auth/application/use-cases/sessions/getActiveSessions.usecase.js";
import { toggleBreakUseCase } from "#modules/auth/application/use-cases/sessions/toggleBreak.usecase.js";
import { forceCloseSessionUseCase } from "#modules/auth/application/use-cases/sessions/forceCloseSession.usecase.js";

function extractBearerToken(req) {
    const auth = req.headers?.authorization;
    if (typeof auth === "string" && auth.startsWith("Bearer ")) {
        return auth.replace("Bearer ", "").trim();
    }
    return null;
}

function resolveHttpStatus(result, fallback = 200) {
    const status = result?.status;
    return Number.isInteger(status) && status >= 100 && status <= 599
        ? status
        : fallback;
}

/**
 * GET /api/sessions/verify
 */
export async function verifySessionHandler(req, res, next) {
    try {
        const token = extractBearerToken(req) || req.body?.token || null;

        const result = await verifySessionUseCase({ token });
        const status = resolveHttpStatus(result, 200);

        return res.status(status).json(result);
    } catch (error) {
        return next(error);
    }
}

/**
 * GET /api/sessions/active-status
 */
export async function activeStatusHandler(req, res, next) {
    try {
        const tenantId =
            req.headers["x-tenant-id"] ||
            req.auth?.tenantId ||
            req.tenantId ||
            null;

        const result = await getActiveSessionsUseCase({ tenantId });
        const status = resolveHttpStatus(result, 200);

        return res.status(status).json(result);
    } catch (error) {
        return next(error);
    }
}

/**
 * POST /api/sessions/break
 * body: { action: "start" | "end" }
 */
export async function breakHandler(req, res, next) {
    try {
        const token = extractBearerToken(req) || req.body?.token || null;
        const { action } = req.body || {};

        const result = await toggleBreakUseCase({ token, action });
        const status = resolveHttpStatus(result, 200);

        return res.status(status).json(result);
    } catch (error) {
        return next(error);
    }
}

/**
 * POST /api/sessions/close
 * body opcional: { sessionId?, token?, tenantId? }
 */
export async function closeSessionHandler(req, res, next) {
    try {
        const token = req.body?.token || extractBearerToken(req) || null;

        const sessionId =
            req.body?.sessionId ||
            req.auth?.sessionId ||
            null;

        const tenantId =
            req.body?.tenantId ||
            req.auth?.tenantId ||
            req.headers["x-tenant-id"] ||
            null;

        const result = await forceCloseSessionUseCase({
            sessionId,
            token,
            tenantId,
        });

        const status = resolveHttpStatus(result, 200);

        return res.status(status).json(result);
    } catch (error) {
        return next(error);
    }
}