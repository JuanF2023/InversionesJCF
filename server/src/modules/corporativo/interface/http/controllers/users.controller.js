// server/src/modules/corporativo/interface/http/controllers/users.controller.js

import { buildUsersModule } from "#modules/corporativo/application/builders/users.builder.js";
import { buildGetAccessOptionsUseCase } from "#modules/corporativo/application/builders/access.builder.js";

const {
    listUsersUseCase,
    getUserByIdUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    updateUserAccessUseCase,
    deleteUserAccessUseCase,
} = buildUsersModule();

function normalizeActorId(req) {
    return req?.actorId || req?.auth?.user?._id || req?.user?._id || null;
}

function str(value) {
    return String(value ?? "").trim();
}

function handleError(res, error, fallbackMessage) {
    return res.status(error?.statusCode || 500).json({
        ok: false,
        code: error?.code || "INTERNAL_ERROR",
        message: error?.message || fallbackMessage,
        data: error?.data || null,
    });
}

/**
 * GET /api/corporativo/users
 */
export async function listUsers(req, res) {
    try {
        const result = await listUsersUseCase.execute({
            q: str(req.query?.q),
            estado: str(req.query?.estado),
            tenantKey: str(req.query?.tenantKey || req.query?.tenantId),
            roleKey: str(req.query?.roleKey || req.query?.rolId),
            page: req.query?.page,
            limit: req.query?.limit,
        });

        return res.status(200).json({
            ok: true,
            total: result.total,
            page: result.page,
            limit: result.limit,
            items: Array.isArray(result.items) ? result.items : [],
        });
    } catch (error) {
        return handleError(res, error, "Error obteniendo usuarios.");
    }
}

/**
 * GET /api/corporativo/users/:id
 */
export async function getUserById(req, res) {
    try {
        const user = await getUserByIdUseCase.execute(req.params.id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                error: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            item: user,
        });
    } catch (error) {
        return handleError(res, error, "Error obteniendo usuario.");
    }
}

/**
 * POST /api/corporativo/users
 */
export async function createUser(req, res) {
    try {
        const actorId = normalizeActorId(req);

        const created = await createUserUseCase.execute({
            ...(req.body || {}),
            createdBy: actorId,
            updatedBy: actorId,
        });

        return res.status(201).json({
            ok: true,
            item: created,
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                ok: false,
                error: "Email duplicado",
            });
        }

        return handleError(res, error, "Error creando usuario.");
    }
}

/**
 * PATCH /api/corporativo/users/:id
 */
export async function updateUser(req, res) {
    try {
        const actorId = normalizeActorId(req);

        const updated = await updateUserUseCase.execute(req.params.id, {
            ...(req.body || {}),
            updatedBy: actorId,
        });

        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            item: updated,
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                ok: false,
                error: "Email duplicado",
            });
        }

        return handleError(res, error, "Error actualizando usuario.");
    }
}

/**
 * DELETE /api/corporativo/users/:id
 */
export async function deleteUser(req, res) {
    try {
        const actorId = normalizeActorId(req);
        const updated = await deleteUserUseCase.execute(req.params.id, actorId);

        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            item: updated,
            message: "Usuario desactivado correctamente.",
        });
    } catch (error) {
        return handleError(res, error, "Error eliminando usuario.");
    }
}

/**
 * GET /api/corporativo/users/access/options?tenantId=
 */
export async function listUserAccessOptions(req, res) {
    try {
        const tenantId = str(req.query?.tenantId || "");
        const getAccessOptionsUseCase = buildGetAccessOptionsUseCase();

        const result = await getAccessOptionsUseCase.execute({
            tenantId: tenantId || null,
            status: "active",
        });

        return res.status(200).json({
            ok: true,
            ...result,
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Error obteniendo opciones de acceso."
        );
    }
}

/**
 * PATCH /api/corporativo/users/:id/access
 */
export async function updateUserAccess(req, res) {
    try {
        const actorId = normalizeActorId(req);

        const updated = await updateUserAccessUseCase.execute(req.params.id, {
            ...(req.body || {}),
            createdBy: actorId,
            updatedBy: actorId,
        });

        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            item: updated,
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Error actualizando acceso del usuario."
        );
    }
}

/**
 * DELETE /api/corporativo/users/:id/access/:membershipId
 */
export async function deleteUserAccess(req, res) {
    try {
        const actorId = normalizeActorId(req);

        const updated = await deleteUserAccessUseCase.execute(
            req.params.id,
            req.params.membershipId,
            {
                updatedBy: actorId,
            }
        );

        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: "Acceso no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            item: updated,
            message: "Acceso desactivado correctamente.",
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Error eliminando acceso del usuario."
        );
    }
}