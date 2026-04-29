// server/src/modules/corporativo/interface/http/controllers/users.controller.js
import usersRepositoryMongo from "#modules/corporativo/infrastructure/repositories/users.repository.mongo.js";
import { listUsersUseCase } from "#modules/corporativo/application/use-cases/users/listUsers.usecase.js";
import { Role } from "#modules/roles/infrastructure/mongoose/models/role.model.js";
import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";

function sendError(res, error, fallbackMessage = "Error interno del servidor.") {
    console.error("[users.controller] error:", error);

    return res.status(error?.statusCode || 500).json({
        ok: false,
        message: error?.message || fallbackMessage,
    });
}

function mapTenant(doc) {
    return {
        id: String(doc._id),
        nombre: doc.name || doc.nombre || doc.key || "Sin nombre",
        key: doc.key || "",
        slug: doc.slug || "",
        tipo: doc.type || doc.tipo || "",
        status: doc.status || "",
    };
}

function mapRole(doc) {
    return {
        id: String(doc._id),
        nombre: doc.name || doc.nombre || doc.key || "Sin nombre",
        key: doc.key || "",
        slug: doc.slug || "",
        tenantType: doc.tenantType || "",
        status: doc.status || "active",
    };
}

export async function listUsersController(req, res) {
    try {
        const result = await listUsersUseCase(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return sendError(res, error, "Error obteniendo usuarios.");
    }
}

export async function getUserAccessOptionsController(_req, res) {
    try {
        const [tenants, roles] = await Promise.all([
            Tenant.find({ status: { $ne: "inactive" } }).sort({ type: 1, name: 1 }).lean().exec(),
            Role.find({}).sort({ tenantType: 1, name: 1 }).lean().exec(),
        ]);

        return res.status(200).json({
            ok: true,
            data: {
                tenants: tenants.map(mapTenant),
                roles: roles.map(mapRole),
            },
        });
    } catch (error) {
        return sendError(res, error, "Error cargando opciones de acceso.");
    }
}

export async function getUserByIdController(req, res) {
    try {
        const user = await usersRepositoryMongo.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({ ok: true, data: user });
    } catch (error) {
        return sendError(res, error, "Error obteniendo usuario.");
    }
}

export async function createUserController(req, res) {
    try {
        const user = await usersRepositoryMongo.create(req.body);
        return res.status(201).json({ ok: true, data: user });
    } catch (error) {
        return sendError(res, error, "Error creando usuario.");
    }
}

export async function updateUserController(req, res) {
    try {
        const user = await usersRepositoryMongo.updateById(req.params.userId, req.body);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({ ok: true, data: user });
    } catch (error) {
        return sendError(res, error, "Error actualizando usuario.");
    }
}

export async function deleteUserController(req, res) {
    try {
        const user = await usersRepositoryMongo.hardDeleteById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Usuario eliminado completamente",
            data: user,
        });
    } catch (error) {
        return sendError(res, error, "Error eliminando usuario.");
    }
}

export async function updateUserAccessController(req, res) {
    try {
        const user = await usersRepositoryMongo.upsertAccessByUserId(req.params.userId, req.body);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({ ok: true, data: user });
    } catch (error) {
        return sendError(res, error, "Error actualizando acceso del usuario.");
    }
}

export async function deleteUserAccessController(req, res) {
    try {
        const user = await usersRepositoryMongo.deactivateAccessByMembershipId(
            req.params.userId,
            req.params.membershipId
        );

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "Acceso no encontrado.",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Acceso desactivado correctamente.",
            data: user,
        });
    } catch (error) {
        return sendError(res, error, "Error eliminando acceso del usuario.");
    }
}