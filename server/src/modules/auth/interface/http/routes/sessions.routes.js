// server/src/modules/auth/interface/http/routes/sessions.routes.js
import { Router } from "express";
import {
    verifySessionHandler,
    activeStatusHandler,
    breakHandler,
    closeSessionHandler,
} from "#modules/auth/interface/http/controllers/sessions.controller.js";

const router = Router();

/**
 * Rutas del módulo de sesiones.
 * - verify: valida sesión actual
 * - active-status: lista/estado de sesiones activas
 * - break: inicia/finaliza receso
 * - close: cierra sesión actual/manual
 */
router.get("/verify", verifySessionHandler);
router.get("/active-status", activeStatusHandler);
router.post("/break", breakHandler);
router.post("/close", closeSessionHandler);

export default router;