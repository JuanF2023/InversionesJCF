// server/src/modules/corporativo/infrastructure/repositories/User.repository.mongo.js
import { User } from "#modules/auth/infrastructure/mongoose/models/user.model.js";
import { Role } from "#modules/roles/infrastructure/mongoose/models/role.model.js";
import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";
import { Membership } from "#modules/auth/infrastructure/mongoose/models/membership.model.js";

const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 4000);

function str(value) {
    return String(value ?? "").trim();
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchMatch(q) {
    const safe = str(q);
    if (!safe) return null;

    const regex = new RegExp(escapeRegex(safe), "i");

    return {
        $or: [
            { displayName: regex },
            { firstName: regex },
            { lastName: regex },
            { email: regex },
        ],
    };
}

function buildStatusMatch(estado) {
    const normalized = str(estado).toLowerCase();

    if (["activo", "activos", "activa", "activas"].includes(normalized)) {
        return { status: "active" };
    }

    if (["inactivo", "inactivos", "inactiva", "inactivas"].includes(normalized)) {
        return { status: "inactive" };
    }

    return null;
}

function buildMembershipLookupPipeline() {
    return [
        {
            $match: {
                $expr: {
                    $or: [
                        { $eq: ["$userId", "$$userIdObj"] },
                        { $eq: [{ $toString: "$userId" }, "$$userIdStr"] },
                        { $eq: ["$user._id", "$$userIdObj"] },
                        { $eq: [{ $toString: "$user._id" }, "$$userIdStr"] },
                    ],
                },
            },
        },
        {
            $sort: { createdAt: -1, _id: -1 },
        },
        {
            $lookup: {
                from: "roles",
                let: {
                    roleIdObj: "$roleId",
                    roleIdStr: { $toString: "$roleId" },
                    roleKeyRaw: "$roleKey",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$_id", "$$roleIdObj"] },
                                    { $eq: [{ $toString: "$_id" }, "$$roleIdStr"] },
                                    { $eq: ["$key", "$$roleKeyRaw"] },
                                    { $eq: ["$slug", "$$roleKeyRaw"] },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            key: 1,
                            slug: 1,
                            name: 1,
                            tenantType: 1,
                        },
                    },
                ],
                as: "roleDoc",
            },
        },
        {
            $lookup: {
                from: "tenants",
                let: {
                    tenantIdObj: "$tenantId",
                    tenantIdStr: { $toString: "$tenantId" },
                    tenantKeyRaw: "$tenantKey",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$_id", "$$tenantIdObj"] },
                                    { $eq: [{ $toString: "$_id" }, "$$tenantIdStr"] },
                                    { $eq: ["$key", "$$tenantKeyRaw"] },
                                    { $eq: ["$slug", "$$tenantKeyRaw"] },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            key: 1,
                            slug: 1,
                            name: 1,
                            type: 1,
                            status: 1,
                        },
                    },
                ],
                as: "tenantDoc",
            },
        },
        {
            $addFields: {
                roleResolved: { $arrayElemAt: ["$roleDoc", 0] },
                tenantResolved: { $arrayElemAt: ["$tenantDoc", 0] },
            },
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                roleId: 1,
                tenantId: 1,
                roleKey: 1,
                tenantKey: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                roleResolved: 1,
                tenantResolved: 1,
            },
        },
    ];
}

function buildProjectionStage() {
    return {
        $project: {
            _id: 0,
            id: { $toString: "$_id" },
            mongoId: "$_id",

            nombre: {
                $let: {
                    vars: {
                        displayName: { $trim: { input: { $ifNull: ["$displayName", ""] } } },
                        fallbackName: {
                            $trim: {
                                input: {
                                    $concat: [
                                        { $ifNull: ["$firstName", ""] },
                                        " ",
                                        { $ifNull: ["$lastName", ""] },
                                    ],
                                },
                            },
                        },
                    },
                    in: {
                        $cond: [{ $ne: ["$$displayName", ""] }, "$$displayName", "$$fallbackName"],
                    },
                },
            },

            email: { $ifNull: ["$email", ""] },

            activo: {
                $eq: [{ $toLower: { $ifNull: ["$status", "inactive"] } }, "active"],
            },

            estado: {
                $cond: [
                    {
                        $eq: [{ $toLower: { $ifNull: ["$status", "inactive"] } }, "active"],
                    },
                    "Activo",
                    "Inactivo",
                ],
            },

            // NUEVO: Array de membresías con todos los tenants y roles
            memberships: {
                $map: {
                    input: "$membershipsResolved",
                    as: "mem",
                    in: {
                        membershipId: { $toString: "$$mem._id" },
                        membershipStatus: { $ifNull: ["$$mem.status", "unknown"] },
                        tenantId: {
                            $cond: [
                                { $ifNull: ["$$mem.tenantResolved._id", false] },
                                { $toString: "$$mem.tenantResolved._id" },
                                "",
                            ],
                        },
                        tenantKey: {
                            $ifNull: [
                                "$$mem.tenantResolved.key",
                                { $ifNull: ["$$mem.tenantKey", ""] },
                            ],
                        },
                        tenantNombre: {
                            $let: {
                                vars: {
                                    resolvedTenantName: { $ifNull: ["$$mem.tenantResolved.name", ""] },
                                },
                                in: {
                                    $cond: [
                                        { $ne: ["$$resolvedTenantName", ""] },
                                        "$$resolvedTenantName",
                                        "Sin tenant",
                                    ],
                                },
                            },
                        },
                        tenantTipo: {
                            $ifNull: ["$$mem.tenantResolved.type", ""],
                        },
                        rolId: {
                            $cond: [
                                { $ifNull: ["$$mem.roleResolved._id", false] },
                                { $toString: "$$mem.roleResolved._id" },
                                "",
                            ],
                        },
                        roleKey: {
                            $let: {
                                vars: {
                                    resolvedRoleKey: { $ifNull: ["$$mem.roleResolved.key", ""] },
                                    membershipRoleKey: { $ifNull: ["$$mem.roleKey", ""] },
                                },
                                in: {
                                    $cond: [
                                        { $ne: ["$$resolvedRoleKey", ""] },
                                        "$$resolvedRoleKey",
                                        { $ifNull: ["$$membershipRoleKey", ""] },
                                    ],
                                },
                            },
                        },
                        roleName: {
                            $let: {
                                vars: {
                                    resolvedRoleName: { $ifNull: ["$$mem.roleResolved.name", ""] },
                                },
                                in: {
                                    $cond: [
                                        { $ne: ["$$resolvedRoleName", ""] },
                                        "$$resolvedRoleName",
                                        "Sin rol",
                                    ],
                                },
                            },
                        },
                        createdAt: { $ifNull: ["$$mem.createdAt", null] },
                    },
                },
            },

            // MANTENEMOS CAMPOS POR COMPATIBILIDAD (primer tenant/rol)
            tenantId: {
                $cond: [
                    { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.tenantResolved._id", 0] }, false] },
                    { $toString: { $arrayElemAt: ["$membershipsResolved.tenantResolved._id", 0] } },
                    "",
                ],
            },
            tenantKey: {
                $ifNull: [
                    { $arrayElemAt: ["$membershipsResolved.tenantResolved.key", 0] },
                    { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.tenantKey", 0] }, ""] },
                ],
            },
            tenantNombre: {
                $let: {
                    vars: {
                        resolvedTenantName: { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.tenantResolved.name", 0] }, ""] },
                    },
                    in: {
                        $cond: [
                            { $ne: ["$$resolvedTenantName", ""] },
                            "$$resolvedTenantName",
                            "Sin tenant",
                        ],
                    },
                },
            },
            tenantTipo: {
                $ifNull: [{ $arrayElemAt: ["$membershipsResolved.tenantResolved.type", 0] }, ""],
            },

            rolId: {
                $cond: [
                    { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.roleResolved._id", 0] }, false] },
                    { $toString: { $arrayElemAt: ["$membershipsResolved.roleResolved._id", 0] } },
                    "",
                ],
            },
            roleKey: {
                $let: {
                    vars: {
                        resolvedRoleKey: { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.roleResolved.key", 0] }, ""] },
                        membershipRoleKey: { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.roleKey", 0] }, ""] },
                    },
                    in: {
                        $cond: [
                            { $ne: ["$$resolvedRoleKey", ""] },
                            "$$resolvedRoleKey",
                            "$$membershipRoleKey",
                        ],
                    },
                },
            },
            roleName: {
                $let: {
                    vars: {
                        resolvedRoleName: { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.roleResolved.name", 0] }, ""] },
                    },
                    in: {
                        $cond: [
                            { $ne: ["$$resolvedRoleName", ""] },
                            "$$resolvedRoleName",
                            "Sin rol",
                        ],
                    },
                },
            },

            ultimoAcceso: { $ifNull: ["$lastLoginAt", null] },
            membershipStatus: { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.status", 0] }, "unassigned"] },
            membershipsCount: { $size: "$membershipsResolved" },
            createdAt: 1,
            updatedAt: 1,
        },
    };
}

export const usersRepositoryMongo = {
    async list({
        q = "",
        estado = "",
        tenantKey = "",
        roleKey = "",
        page = 1,
        limit = 50,
    }) {
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Math.min(200, Number(limit) || 50));
        const skip = (pageNum - 1) * limitNum;

        const baseMatch = {};
        const searchMatch = buildSearchMatch(q);
        const statusMatch = buildStatusMatch(estado);

        if (searchMatch) Object.assign(baseMatch, searchMatch);
        if (statusMatch) Object.assign(baseMatch, statusMatch);

        const pipeline = [];

        if (Object.keys(baseMatch).length > 0) {
            pipeline.push({ $match: baseMatch });
        }

        pipeline.push({
            $lookup: {
                from: "memberships",
                let: {
                    userIdObj: "$_id",
                    userIdStr: { $toString: "$_id" },
                },
                pipeline: buildMembershipLookupPipeline(),
                as: "membershipsResolved",
            },
        });

        // CAMBIO IMPORTANTE: Ya no tomamos solo el primer elemento
        // Mantenemos el array completo para procesarlo en la proyección
        pipeline.push(buildProjectionStage());

        const tenantKeySafe = str(tenantKey);
        if (tenantKeySafe) {
            pipeline.push({
                $match: {
                    $or: [
                        { tenantKey: tenantKeySafe },
                        { tenantId: tenantKeySafe },
                        { tenantNombre: new RegExp(`^${escapeRegex(tenantKeySafe)}$`, "i") },
                    ],
                },
            });
        }

        const roleKeySafe = str(roleKey);
        if (roleKeySafe) {
            pipeline.push({
                $match: {
                    $or: [
                        { roleKey: roleKeySafe },
                        { rolId: roleKeySafe },
                        { roleName: new RegExp(`^${escapeRegex(roleKeySafe)}$`, "i") },
                    ],
                },
            });
        }

        pipeline.push({ $sort: { nombre: 1, email: 1 } });

        pipeline.push({
            $facet: {
                rows: [{ $skip: skip }, { $limit: limitNum }],
                meta: [{ $count: "total" }],
            },
        });

        const result = await User.aggregate(pipeline)
            .option({ maxTimeMS: Q_MAX_TIME_MS })
            .exec();

        const payload = Array.isArray(result) && result[0] ? result[0] : {};
        const items = Array.isArray(payload.rows) ? payload.rows : [];
        const total = Number(payload.meta?.[0]?.total || 0);

        return {
            items,
            total,
            page: pageNum,
            limit: limitNum,
        };
    },

    async findById(id) {
        const safeId = str(id);
        if (!safeId) return null;

        const pipeline = [
            {
                $match: {
                    $expr: {
                        $eq: [{ $toString: "$_id" }, safeId],
                    },
                },
            },
            {
                $lookup: {
                    from: "memberships",
                    let: {
                        userIdObj: "$_id",
                        userIdStr: { $toString: "$_id" },
                    },
                    pipeline: buildMembershipLookupPipeline(),
                    as: "membershipsResolved",
                },
            },
            buildProjectionStage(),
        ];

        const docs = await User.aggregate(pipeline)
            .option({ maxTimeMS: Q_MAX_TIME_MS })
            .exec();

        return Array.isArray(docs) && docs[0] ? docs[0] : null;
    },

    async create({
        nombre,
        email,
        pin,
        rolId = null,
        tenantId = null,
        activo = true,
        createdBy = null,
        updatedBy = null,
    }) {
        const safeNombre = str(nombre);
        const [firstName = "", ...rest] = safeNombre.split(/\s+/);
        const lastName = rest.join(" ").trim();

        const doc = await User.create({
            firstName,
            lastName,
            displayName: safeNombre,
            email: str(email).toLowerCase(),
            pin,
            pinLength: str(pin).length || undefined,
            status: activo ? "active" : "inactive",
            roles: [],
            tenantId: tenantId || null,
            createdBy: createdBy || null,
            updatedBy: updatedBy || null,
        });

        return {
            id: String(doc._id),
            nombre: doc.displayName,
            email: doc.email,
            activo: doc.status === "active",
            estado: doc.status === "active" ? "Activo" : "Inactivo",
            tenantId: tenantId || "",
            tenantKey: "",
            tenantNombre: tenantId ? "Asignado" : "Sin tenant",
            rolId: rolId || "",
            roleKey: "",
            roleName: rolId ? "Asignado" : "Sin rol",
            ultimoAcceso: doc.lastLoginAt ?? null,
            membershipStatus: "pending",
            memberships: [],
        };
    },

    async updateById(id, patch = {}) {
        const nextPatch = { ...patch };

        if (typeof nextPatch.nombre !== "undefined") {
            const safeNombre = str(nextPatch.nombre);
            const [firstName = "", ...rest] = safeNombre.split(/\s+/);
            const lastName = rest.join(" ").trim();

            nextPatch.displayName = safeNombre;
            nextPatch.firstName = firstName;
            nextPatch.lastName = lastName;
            delete nextPatch.nombre;
        }

        if (typeof nextPatch.activo !== "undefined") {
            nextPatch.status = nextPatch.activo ? "active" : "inactive";
            delete nextPatch.activo;
        }

        if (typeof nextPatch.email !== "undefined") {
            nextPatch.email = str(nextPatch.email).toLowerCase();
        }

        if (typeof nextPatch.pin !== "undefined") {
            nextPatch.pinLength = str(nextPatch.pin).length || undefined;
        }

        const doc = await User.findByIdAndUpdate(id, nextPatch, {
            new: true,
            runValidators: true,
        }).lean();

        if (!doc) return null;

        return this.findById(id);
    },

    async softDeleteById(id, updatedBy = null) {
        const doc = await User.findByIdAndUpdate(
            id,
            {
                status: "inactive",
                updatedBy: updatedBy || null,
            },
            { new: true }
        ).lean();

        if (!doc) return null;

        return this.findById(id);
    },

    // Actualizar acceso de usuario (crear/actualizar membership)
    async upsertAccessByUserId(userId, { tenantId, roleId, status = "active", createdBy = null, updatedBy = null }) {
        try {
            const safeUserId = str(userId);
            if (!safeUserId) {
                throw new Error("User ID is required");
            }

            console.log(`[UpsertAccess] Updating access for user: ${safeUserId}`);

            // Verificar que el usuario existe
            const user = await User.findById(safeUserId).lean().exec();
            if (!user) {
                console.log(`[UpsertAccess] User not found: ${safeUserId}`);
                return null;
            }

            // Verificar que el rol existe (si se proporcionó)
            if (roleId) {
                const roleExists = await Role.findById(roleId).lean().exec();
                if (!roleExists) {
                    throw new Error(`Role not found: ${roleId}`);
                }
            }

            // Verificar que el tenant existe (si se proporcionó)
            if (tenantId) {
                const tenantExists = await Tenant.findById(tenantId).lean().exec();
                if (!tenantExists) {
                    throw new Error(`Tenant not found: ${tenantId}`);
                }
            }

            // Buscar membership existente para este tenant específico
            let membership = await Membership.findOne({
                $or: [
                    { userId: safeUserId, tenantId: tenantId },
                    { user: safeUserId, tenantId: tenantId }
                ]
            }).exec();

            const now = new Date();
            const actorId = updatedBy || createdBy || null;

            if (membership) {
                // Actualizar membership existente
                membership.roleId = roleId || membership.roleId;
                membership.status = status;
                membership.updatedAt = now;
                membership.updatedBy = actorId;

                await membership.save();
                console.log(`[UpsertAccess] Updated existing membership: ${membership._id}`);
            } else {
                // Crear nueva membership
                membership = await Membership.create({
                    userId: safeUserId,
                    roleId,
                    tenantId,
                    status,
                    createdAt: now,
                    updatedAt: now,
                    createdBy: actorId,
                    updatedBy: actorId
                });
                console.log(`[UpsertAccess] Created new membership: ${membership._id}`);
            }

            // Obtener el usuario actualizado con todas sus memberships
            const updatedUser = await this.findById(safeUserId);

            return updatedUser;
        } catch (error) {
            console.error("[UpsertAccess Error]", error);
            throw error;
        }
    }
};

export default usersRepositoryMongo;