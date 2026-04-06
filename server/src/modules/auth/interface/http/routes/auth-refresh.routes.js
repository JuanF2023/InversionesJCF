// server/src/modules/auth/interface/http/routes/auth-refresh.routes.js
import { Router } from "express";
import { refreshTokenController } from "#modules/auth/interface/http/controllers/auth-refresh.controller.js";

const router = Router();

router.post("/refresh", refreshTokenController);

export default router;