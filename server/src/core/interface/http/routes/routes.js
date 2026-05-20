// server/src/core/interface/http/routes/routes.js

import { Router } from "express";

// auth
import authRoutes from "#modules/auth/interface/http/routes/auth.routes.js";
import sessionsRoutes from "#modules/auth/interface/http/routes/sessions.routes.js";

// corporativo
import usersRoutes from "#modules/corporativo/interface/http/routes/users.routes.js";
import permissionsRoutes from "#modules/corporativo/interface/http/routes/permissions.routes.js";

// 👇 NUEVO
import propiedadesRoutes from "#modules/corporativo/interface/http/routes/propiedades.routes.js";
import unidadesRoutes from "#modules/corporativo/interface/http/routes/unidades.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Inversiones JCF API",
    timestamp: new Date().toISOString(),
  });
});

// auth
router.use("/auth", authRoutes);
router.use("/sessions", sessionsRoutes);

// corporativo
router.use("/corporativo/users", usersRoutes);
router.use("/corporativo/permissions", permissionsRoutes);

// 👇 ESTE ES EL FIX
router.use("/corporativo/propiedades", propiedadesRoutes);
router.use("/corporativo/unidades", unidadesRoutes);

export default router;
