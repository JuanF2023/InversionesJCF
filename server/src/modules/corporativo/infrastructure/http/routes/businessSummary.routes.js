import authChain from "#core/interface/http/middlewares/authChain.middleware.js";
// server/src/modules/corporativo/interface/http/routes/businessSummary.routes.js
// -----------------------------------------------------------------------------
// Stub temporal para el m贸dulo corporativo (panel de negocios, etc.).
// Cubre cualquier GET bajo /api/corporativo/* para que el frontend no truene
// mientras terminamos los modelos/consultas reales.
// -----------------------------------------------------------------------------

import { Router } from "express";

const router = Router();

/**
 * Handler com煤n: responde siempre OK con estructuras vac铆as.
 */
function handleSummary(_req, res) {
    return res.json({
        ok: true,
        // Resumen financiero del panel de negocios (valores en cero por ahora)
        resumen: {
            ingresosMes: 0,
            costosMes: 0,
            margenMes: 0,
            produccionPlanificada: 0,
        },
        // Lista de negocios visibles en el panel
        negocios: [],
    });
}

// /api/corporativo
router.get("/", handleSummary);

// /api/corporativo/lo-que-sea (panel, lista, etc.)
router.get("/*", handleSummary);

export default router;

