// server/src/modules/corporativo/interface/http/controllers/users.controller.js
import { buildUsersModule } from "#modules/corporativo/application/builders/users.builder.js";
import { buildGetAccessOptionsUseCase } from "#modules/corporativo/application/builders/access.builder.js";

const { usersRepository } = buildUsersModule();

function normalizeActorId(req) {
  return req?.actorId || req?.auth?.user?._id || req?.user?._id || null;
}

function str(value) {
  return String(value ?? "").trim();
}

export async function listUsers(req, res, next) {
  try {
    const result = await usersRepository.list({
      q: str(req.query?.q),
      estado: str(req.query?.estado),
      tenantKey: str(req.query?.tenantKey || req.query?.tenantId),
      roleKey: str(req.query?.roleKey || req.query?.rolId),
      page: req.query?.page,
      limit: req.query?.limit,
    });

    res.json({
      ok: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      items: result.items,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await usersRepository.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      item: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const actorId = normalizeActorId(req);
    const { nombre, email, pin, rolId, tenantId, activo = true } = req.body || {};

    const created = await usersRepository.create({
      nombre,
      email,
      pin,
      rolId,
      tenantId,
      activo,
      createdBy: actorId,
      updatedBy: actorId,
    });

    res.status(201).json({
      ok: true,
      item: created,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        ok: false,
        error: "Email duplicado",
      });
    }
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const actorId = normalizeActorId(req);
    const { nombre, email, pin, rolId, tenantId, activo } = req.body || {};

    const patch = {
      updatedBy: actorId,
    };

    if (typeof nombre !== "undefined") patch.nombre = nombre;
    if (typeof email !== "undefined") patch.email = email;
    if (typeof pin !== "undefined") patch.pin = pin;
    if (typeof rolId !== "undefined") patch.rolId = rolId;
    if (typeof tenantId !== "undefined") patch.tenantId = tenantId;
    if (typeof activo !== "undefined") patch.activo = !!activo;

    const updated = await usersRepository.updateById(req.params.id, patch);

    if (!updated) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      item: updated,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        ok: false,
        error: "Email duplicado",
      });
    }
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const actorId = normalizeActorId(req);

    const updated = await usersRepository.softDeleteById(req.params.id, actorId);

    if (!updated) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function listUserAccessOptions(req, res, next) {
  try {
    const tenantId = str(req.query?.tenantId || "");
    const getAccessOptionsUseCase = buildGetAccessOptionsUseCase();

    const result = await getAccessOptionsUseCase.execute({
      tenantId: tenantId || null,
      status: "active",
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserAccess(req, res, next) {
  try {
    const actorId = normalizeActorId(req);
    const { tenantId, roleId, status = "active" } = req.body || {};

    const updated = await usersRepository.upsertAccessByUserId(req.params.id, {
      tenantId,
      roleId,
      status,
      createdBy: actorId,
      updatedBy: actorId,
    });

    if (!updated) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      item: updated,
    });
  } catch (err) {
    next(err);
  }
}