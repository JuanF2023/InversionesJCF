// server/src/modules/auth/interface/http/routes/auth.routes.js
import { Router } from "express";
import { authChainHandler } from "#core/interface/http/middlewares/authChain.middleware.js";

import {
    loginByPinHandler,
    verifyAuthHandler,
    getActiveSessionsStatusHandler,
    forceCloseSessionHandler,
    breakStartHandler,
    breakStopHandler,
} from "#modules/auth/infrastructure/http/controllers/auth.controller.js";

const router = Router();

/**
 * Guard de autenticación.
 * Para endpoints de auth no toca actividad automáticamente.
 */
const guardAuth = authChainHandler({ touchActivity: false });

/* =========================
   RUTAS PÚBLICAS
========================= */

/**
 * Login por PIN.
 */
router.post("/login", loginByPinHandler);

/**
 * Alias backward-compatible.
 */
router.post("/pin", loginByPinHandler);

/**
 * Estado de sesiones activas para pantalla de login.
 */
router.get("/active", getActiveSessionsStatusHandler);
router.get("/active-sessions", getActiveSessionsStatusHandler);

/* =========================
   RUTAS PROTEGIDAS
========================= */

router.get("/verify", guardAuth, verifyAuthHandler);

/**
 * Cierre forzado / logout.
 */
router.post("/logout", guardAuth, forceCloseSessionHandler);
router.post("/force-close", guardAuth, forceCloseSessionHandler);

/* =========================
   BREAK / RECESO
========================= */

router.post("/break", guardAuth, (req, res, next) => {
    const action = String(req?.body?.action || "").trim().toLowerCase();

    if (action === "start") return breakStartHandler(req, res, next);
    if (action === "end" || action === "stop") return breakStopHandler(req, res, next);

    return res.status(400).json({
        ok: false,
        status: 400,
        error: "INVALID_ACTION",
        message: 'Acción inválida. Use { action: "start" } o { action: "end" }.',
    });
});

router.post("/break/start", guardAuth, breakStartHandler);
router.post("/break/stop", guardAuth, breakStopHandler);

export default router;