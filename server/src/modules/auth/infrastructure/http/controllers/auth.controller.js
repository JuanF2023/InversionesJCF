// server/src/modules/auth/interface/http/controllers/auth.controller.js

import { sendResponse } from "#core/interface/http/response.js";

import { buildAuthService } from "#modules/auth/application/builders/auth.builder.js";
import { extractTokenFromHeaders } from "#modules/auth/application/services/auth.service.js";

const authService = buildAuthService();

/**
 * Obtiene IP real considerando proxy / load balancer
 */
function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }

  return (
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    null
  );
}

/**
 * Obtiene user agent
 */
function getUserAgent(req) {
  return String(req.headers["user-agent"] || "").trim() || null;
}

/**
 * POST /api/auth/pin
 * Body: { pin, intent, tenantId? }
 */
export async function loginByPinHandler(req, res, next) {
  try {
    const deviceLabel = String(req.headers["x-device-label"] || "web").trim();

    const tenantId =
      (req?.body?.tenantId != null ? String(req.body.tenantId).trim() : "") ||
      (req.headers["x-tenant-id"] != null
        ? String(req.headers["x-tenant-id"]).trim()
        : "") ||
      null;

    const payload = {
      pin: req?.body?.pin,
      intent: req?.body?.intent,
      tenantId,
      device: deviceLabel,

      // 🔥 AUDITORÍA
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
    };

    const result = await authService.loginByPin(payload);

    return sendResponse(res, result);
  } catch (e) {
    return next(e);
  }
}

/**
 * GET /api/auth/verify
 */
export async function verifyAuthHandler(req, res, next) {
  try {
    const token = extractTokenFromHeaders(req.headers);

    const result = await authService.verifySession({
      token,
      touchActivity: true,
    });

    return sendResponse(res, result);
  } catch (e) {
    return next(e);
  }
}

/**
 * GET /api/auth/active
 */
export async function getActiveSessionsStatusHandler(req, res, next) {
  try {
    const result = await authService.getActiveSessionsStatus();

    return sendResponse(res, result);
  } catch (e) {
    return next(e);
  }
}

/**
 * POST /api/auth/force-close
 */
export async function forceCloseSessionHandler(req, res, next) {
  try {
    const token =
      req?.body?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7).trim()
        : req.headers["x-session-token"]) ||
      null;

    const sessionId = req?.body?.sessionId || null;

    const result = await authService.forceCloseSession({
      token,
      sessionId,

      // 🔥 AUDITORÍA
      closedBy: req?.auth?.user?._id || "admin",
      closeSource: "admin_action",
    });

    return sendResponse(res, result);
  } catch (e) {
    return next(e);
  }
}

/**
 * POST /api/auth/break/start
 */
export async function breakStartHandler(req, res, next) {
  try {
    const token =
      req?.body?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7).trim()
        : req.headers["x-session-token"]) ||
      null;

    const result = await authService.startBreak({
      token,
    });

    return sendResponse(res, result);
  } catch (e) {
    return next(e);
  }
}

/**
 * POST /api/auth/break/stop
 */
export async function breakStopHandler(req, res, next) {
  try {
    const token =
      req?.body?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7).trim()
        : req.headers["x-session-token"]) ||
      null;

    const result = await authService.stopBreak({
      token,
    });

    return sendResponse(res, result);
  } catch (e) {
    return next(e);
  }
}