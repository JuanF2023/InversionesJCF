import authChain from "#core/interface/http/middlewares/authChain.middleware.js";
// server/src/modules/corporativo/interface/http/routes/businesses.routes.js
import { Router } from "express";
const router = Router();
// Lista m铆nima
router.get("/", (_req, res) => res.json({ ok: true, items: [] }));
router.get("/_ping", (_req, res) => res.json({ ok: true, mod: "businesses" }));
export default router;

