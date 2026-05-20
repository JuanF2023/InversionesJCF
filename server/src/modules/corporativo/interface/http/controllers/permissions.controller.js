// server/src/modules/corporativo/interface/http/controllers/permissions.controller.js
import { PermissionsRepository } from "#modules/corporativo/infrastructure/repositories/permissions.repository.js";

export async function listPermissionsController(req, res) {
    try {
        const items = await PermissionsRepository.findAll();

        return res.json({
            ok: true,
            data: items,
        });
    } catch (error) {
        console.error("[permissions.controller] error:", error);

        return res.status(500).json({
            ok: false,
            message: "Error obteniendo permisos",
        });
    }
}