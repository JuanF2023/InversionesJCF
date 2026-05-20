// server/src/modules/corporativo/interface/http/routes/unidades.routes.js

import { Router } from "express";

const router = Router();

/**
 * GET /api/corporativo/unidades
 * Temporal: mock
 */
router.get("/", async (_req, res) => {
    return res.json({
        ok: true,
        items: [],
        total: 0,
    });
});

export default router;
