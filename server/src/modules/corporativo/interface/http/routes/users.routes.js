// server/src/modules/corporativo/interface/http/routes/users.routes.js
import { Router } from "express";

const router = Router();

/**
 * Endpoint temporal para estabilizar frontend.
 * Se reemplazará por integración real con Mongo y memberships.
 */
router.get("/", async (_req, res) => {
  return res.json({
    ok: true,
    data: [
      {
        id: "1",
        nombre: "Juan Flores",
        email: "juanito003013@hotmail.com",
        rol: "Administrador Corporativo",
        activo: true,
      },
    ],
  });
});

export default router;