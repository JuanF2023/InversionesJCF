// server/src/modules/corporativo/interface/http/routes/permissions.routes.js
import { Router } from "express";
import { listPermissionsController } from "../controllers/permissions.controller.js";

const router = Router();

router.get("/", listPermissionsController);

export default router;