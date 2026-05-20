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
    deleteUserAccess,
} from "#modules/corporativo/interface/http/controllers/users.controller.js";

const router = Router();

router.get("/_ping", (_req, res) => {
    res.json({
        ok: true,
        module: "users",
    });
});

/*
|--------------------------------------------------------------------------
| Access options
|--------------------------------------------------------------------------
*/

router.get("/access/options", listUserAccessOptions);

/*
|--------------------------------------------------------------------------
| User access / memberships
|--------------------------------------------------------------------------
*/

router.patch("/:id/access", updateUserAccess);

router.delete("/:id/access/:membershipId", deleteUserAccess);

/*
|--------------------------------------------------------------------------
| Users CRUD
|--------------------------------------------------------------------------
*/

router.get("/", listUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
