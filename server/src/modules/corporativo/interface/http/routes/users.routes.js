// server/src/modules/corporativo/interface/http/routes/users.routes.js
import { Router } from "express";

import {
  listUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserAccessOptionsController,
  updateUserAccessController,
} from "#modules/corporativo/interface/http/controllers/users.controller.js";

const router = Router();

router.get("/", listUsersController);
router.get("/:userId/access-options", getUserAccessOptionsController);
router.get("/:userId", getUserByIdController);

router.post("/", createUserController);
router.patch("/:userId", updateUserController);
router.delete("/:userId", deleteUserController);

router.put("/:userId/access", updateUserAccessController);

export default router;