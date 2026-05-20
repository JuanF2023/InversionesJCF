// server/src/modules/corporativo/interface/http/routes/propiedades.routes.js

import { Router } from "express";

const router = Router();

/**
 * GET /api/corporativo/propiedades
 * Temporal: mock hasta conectar use case
 */
router.get("/", async (_req, res) => {
    return res.json({
        ok: true,
        items: [],
        total: 0,
    });
});

export default router;
