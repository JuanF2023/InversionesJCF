// server/src/modules/corporativo/infrastructure/repositories/users.repository.mongo.js
import { User } from "#modules/auth/infrastructure/mongoose/models/user.model.js";
import { Role } from "#modules/roles/infrastructure/mongoose/models/role.model.js";
import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";
import { Membership } from "#modules/auth/infrastructure/mongoose/models/membership.model.js";
import mongoose from "mongoose";
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
                    ],
                },
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "_id",
                as: "roleDoc",
            },
        },
        {
            $lookup: {
                from: "tenants",
                localField: "tenantId",
                foreignField: "_id",
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
                status: 1,
                createdAt: 1,
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
                        $cond: [
                            { $ne: ["$$displayName", ""] },
                            "$$displayName",
                            "$$fallbackName",
                        ],
                    },
                },
            },
            email: { $ifNull: ["$email", ""] },
            activo: {
                $eq: [{ $toLower: { $ifNull: ["$status", "inactive"] } }, "active"],
            },
            estado: {
                $cond: [
                    { $eq: [{ $toLower: { $ifNull: ["$status", "inactive"] } }, "active"] },
                    "Activo",
                    "Inactivo",
                ],
            },
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
                    "",
                ],
            },
            tenantNombre: {
                $ifNull: [
                    { $arrayElemAt: ["$membershipsResolved.tenantResolved.name", 0] },
                    "Sin tenant",
                ],
            },
            tenantTipo: {
                $ifNull: [
                    { $arrayElemAt: ["$membershipsResolved.tenantResolved.type", 0] },
                    "",
                ],
            },
            rolId: {
                $cond: [
                    { $ifNull: [{ $arrayElemAt: ["$membershipsResolved.roleResolved._id", 0] }, false] },
                    { $toString: { $arrayElemAt: ["$membershipsResolved.roleResolved._id", 0] } },
                    "",
                ],
            },
            roleKey: {
                $ifNull: [
                    { $arrayElemAt: ["$membershipsResolved.roleResolved.key", 0] },
                    "",
                ],
            },
            roleName: {
                $ifNull: [
                    { $arrayElemAt: ["$membershipsResolved.roleResolved.name", 0] },
                    "Sin rol",
                ],
            },
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
                        tenantNombre: {
                            $ifNull: ["$$mem.tenantResolved.name", "Sin tenant"],
                        },
                        roleName: {
                            $ifNull: ["$$mem.roleResolved.name", "Sin rol"],
                        },
                    },
                },
            },
            membershipsCount: { $size: "$membershipsResolved" },
            membershipStatus: {
                $ifNull: [{ $arrayElemAt: ["$membershipsResolved.status", 0] }, "unassigned"],
            },
            ultimoAcceso: { $ifNull: ["$lastLoginAt", null] },
            createdAt: 1,
            updatedAt: 1,
        },
    };
}

export const usersRepositoryMongo = {
    async list({ q = "", estado = "", tenantKey = "", roleKey = "", page = 1, limit = 50 }) {
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

    async create({ nombre, email, pin, rolId = null, tenantId = null, activo = true, createdBy = null, updatedBy = null }) {
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
            const cleanPin = str(nextPatch.pin);

            if (!cleanPin) {
                delete nextPatch.pin;
                delete nextPatch.pinLength;
            } else {
                nextPatch.pin = cleanPin;
                nextPatch.pinLength = cleanPin.length;
            }
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

    /**
     * Eliminación física temporal para limpieza inicial de datos.
     * Después de limpiar la BD, el controller debe volver a usar softDeleteById.
     */
    async hardDeleteById(id) {
        const safeId = str(id);
        if (!safeId) return null;

        const doc = await User.findByIdAndDelete(safeId).lean().exec();

        if (!doc) return null;

        await Membership.deleteMany({
            $or: [
                { userId: safeId },
                { user: safeId },
            ],
        }).exec();

        return {
            id: String(doc._id),
            nombre: doc.displayName || `${doc.firstName || ""} ${doc.lastName || ""}`.trim(),
            email: doc.email,
        };
    },

    async upsertAccessByUserId(userId, { tenantId, roleId, status = "active", createdBy = null, updatedBy = null }) {
        const safeUserId = str(userId);
        const safeTenantId = str(tenantId);
        const safeRoleId = str(roleId);

        if (!safeUserId) throw new Error("User ID is required");
        if (!safeTenantId) throw new Error("Tenant ID is required");
        if (!safeRoleId) throw new Error("Role ID is required");

        const user = await User.findById(safeUserId).lean().exec();
        if (!user) return null;

        const tenant = await Tenant.findById(safeTenantId).lean().exec();
        if (!tenant) throw new Error(`Tenant not found: ${safeTenantId}`);

        const role = await Role.findById(safeRoleId).lean().exec();
        if (!role) throw new Error(`Role not found: ${safeRoleId}`);

        const userObjectId = new mongoose.Types.ObjectId(safeUserId);
        const tenantObjectId = new mongoose.Types.ObjectId(safeTenantId);
        const roleObjectId = new mongoose.Types.ObjectId(safeRoleId);

        const now = new Date();
        const actorId = updatedBy || createdBy || null;

        await Membership.updateOne(
            {
                $or: [
                    { userId: userObjectId, tenantId: tenantObjectId },
                    { userId: safeUserId, tenantId: safeTenantId },
                ],
            },
            {
                $set: {
                    userId: userObjectId,
                    tenantId: tenantObjectId,
                    roleId: roleObjectId,
                    roleKey: role.key || "",
                    tenantKey: tenant.key || "",
                    status,
                    updatedAt: now,
                    updatedBy: actorId,
                },
                $setOnInsert: {
                    createdAt: now,
                    createdBy: actorId,
                },
            },
            { upsert: true }
        ).exec();

        return this.findById(safeUserId);
    },
};

export default usersRepositoryMongo;