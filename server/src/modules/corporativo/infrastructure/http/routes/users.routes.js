// server/src/modules/corporativo/interface/http/routes/users.routes.js
import { Router } from "express";
import {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    listUserAccessOptions,
    updateUserAccess,
} from "#modules/corporativo/infrastructure/http/controllers/users.controller.js";

const router = Router();

router.get("/_ping", (_req, res) => {
    res.json({ ok: true, module: "users" });
});

router.get("/access/options", listUserAccessOptions);
router.patch("/:id/access", updateUserAccess);

router.get("/", listUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;