import authChain from "#core/interface/http/middlewares/authChain.middleware.js";
// server/src/modules/corporativo/interface/http/routes/businessCategories.routes.js
import { Router } from "express";
const router = Router();
router.get("/_ping", (_req, res) =>
    res.json({ ok: true, mod: "business-categories" })
);
export default router;

