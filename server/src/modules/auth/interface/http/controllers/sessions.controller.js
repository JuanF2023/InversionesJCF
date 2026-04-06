// server/src/modules/auth/interface/http/controllers/sessions.controller.js
import { sendResponse } from "#core/interface/http/response.js";

import { verifySessionUseCase } from "#modules/auth/application/use-cases/sessions/verifySession.usecase.js";
import { getActiveSessionsUseCase } from "#modules/auth/application/use-cases/sessions/getActiveSessions.usecase.js";
import { toggleBreakUseCase } from "#modules/auth/application/use-cases/sessions/toggleBreak.usecase.js";
import { forceCloseSessionUseCase } from "#modules/auth/application/use-cases/sessions/forceCloseSession.usecase.js";

function extractBearerToken(req) {
    const authorization = req.headers?.authorization;

    if (
        typeof authorization === "string" &&
        authorization.toLowerCase().startsWith("bearer ")
    ) {
        return authorization.slice(7).trim();
    }

    return null;
}

function resolveToken(req) {
    return req.body?.token || extractBearerToken(req) || null;
}

function resolveTenantId(req) {
    return (
        req.body?.tenantId ||
        req.headers?.["x-tenant-id"] ||
        req.auth?.tenantId ||
        req.tenantId ||
        null
    );
}

function resolveSessionId(req) {
    return req.body?.sessionId || req.auth?.sessionId || null;
}

export async function verifySessionHandler(req, res, next) {
    try {
        const token = resolveToken(req);

        const result = await verifySessionUseCase({
            token,
        });

        return sendResponse(res, result);
    } catch (error) {
        return next(error);
    }
}

export async function activeStatusHandler(req, res, next) {
    try {
        const tenantId = resolveTenantId(req);

        const result = await getActiveSessionsUseCase({
            tenantId,
        });

        return sendResponse(res, result);
    } catch (error) {
        error.context = {
            ...(error.context || {}),
            handler: "activeStatusHandler",
            tenantId: resolveTenantId(req),
        };
        return next(error);
    }
}

export async function breakHandler(req, res, next) {
    try {
        const token = resolveToken(req);
        const { action } = req.body || {};

        const result = await toggleBreakUseCase({
            token,
            action,
        });

        return sendResponse(res, result);
    } catch (error) {
        return next(error);
    }
}

export async function closeSessionHandler(req, res, next) {
    try {
        const sessionId = resolveSessionId(req);
        const token = resolveToken(req);
        const tenantId = resolveTenantId(req);

        const result = await forceCloseSessionUseCase({
            sessionId,
            token,
            tenantId,
        });

        return sendResponse(res, result);
    } catch (error) {
        return next(error);
    }
}