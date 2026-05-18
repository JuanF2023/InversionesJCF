// server/src/modules/corporativo/infrastructure/repositories/users.repository.mongo.js

import mongoose from "mongoose";

import { User } from "#modules/auth/infrastructure/mongoose/models/user.model.js";
import { Membership } from "#modules/auth/infrastructure/mongoose/models/membership.model.js";

import { Role } from "#modules/roles/infrastructure/mongoose/models/role.model.js";

import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";

import { hashPin } from "#modules/auth/application/security/pin.security.js";

import { auditLogService } from "#modules/audit/application/services/audit-log.service.js";

import {
    AUDIT_ACTIONS,
    AUDIT_MODULES,
} from "#modules/audit/domain/audit-actions.constants.js";

const Q_MAX_TIME_MS = Number(
    process.env.MONGO_QUERY_MAX_TIME_MS || 4000
);

function str(value) {
    return String(value ?? "").trim();
}

function escapeRegex(value) {
    return String(value).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}

function resolveActorId(value) {
    if (!value) return null;
    if (value?._id) return value._id;
    return value;
}

async function recordAuditSafe(payload) {
    try {
        await auditLogService.record(payload);
    } catch (error) {
        console.error(
            "[audit] No se pudo registrar auditoría:",
            error?.message || error
        );
    }
}

function buildSearchMatch(q) {
    const safe = str(q);

    if (!safe) {
        return null;
    }

    const regex = new RegExp(
        escapeRegex(safe),
        "i"
    );

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

    if (
        [
            "activo",
            "activos",
            "activa",
            "activas",
        ].includes(normalized)
    ) {
        return {
            status: "active",
        };
    }

    if (
        [
            "inactivo",
            "inactivos",
            "inactiva",
            "inactivas",
        ].includes(normalized)
    ) {
        return {
            status: "inactive",
        };
    }

    return null;
}

function buildMembershipLookupPipeline() {
    return [
        {
            $match: {
                $expr: {
                    $or: [
                        {
                            $eq: [
                                "$userId",
                                "$$userIdObj",
                            ],
                        },
                        {
                            $eq: [
                                {
                                    $toString:
                                        "$userId",
                                },
                                "$$userIdStr",
                            ],
                        },
                    ],
                },
            },
        },

        {
            $sort: {
                createdAt: -1,
            },
        },

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
                roleResolved: {
                    $arrayElemAt: [
                        "$roleDoc",
                        0,
                    ],
                },

                tenantResolved: {
                    $arrayElemAt: [
                        "$tenantDoc",
                        0,
                    ],
                },
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
                createdBy: 1,
                updatedBy: 1,
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

            id: {
                $toString: "$_id",
            },

            mongoId: "$_id",

            nombre: {
                $let: {
                    vars: {
                        displayName: {
                            $trim: {
                                input: {
                                    $ifNull: [
                                        "$displayName",
                                        "",
                                    ],
                                },
                            },
                        },

                        fallbackName: {
                            $trim: {
                                input: {
                                    $concat: [
                                        {
                                            $ifNull:
                                                [
                                                    "$firstName",
                                                    "",
                                                ],
                                        },

                                        " ",

                                        {
                                            $ifNull:
                                                [
                                                    "$lastName",
                                                    "",
                                                ],
                                        },
                                    ],
                                },
                            },
                        },
                    },

                    in: {
                        $cond: [
                            {
                                $ne: [
                                    "$$displayName",
                                    "",
                                ],
                            },

                            "$$displayName",

                            "$$fallbackName",
                        ],
                    },
                },
            },

            email: {
                $ifNull: [
                    "$email",
                    "",
                ],
            },

            activo: {
                $eq: [
                    {
                        $toLower: {
                            $ifNull: [
                                "$status",
                                "inactive",
                            ],
                        },
                    },
                    "active",
                ],
            },

            estado: {
                $cond: [
                    {
                        $eq: [
                            {
                                $toLower: {
                                    $ifNull: [
                                        "$status",
                                        "inactive",
                                    ],
                                },
                            },
                            "active",
                        ],
                    },

                    "Activo",

                    "Inactivo",
                ],
            },

            memberships: {
                $map: {
                    input:
                        "$membershipsResolved",

                    as: "mem",

                    in: {
                        membershipId: {
                            $cond: [
                                {
                                    $ifNull: [
                                        "$$mem._id",
                                        false,
                                    ],
                                },

                                {
                                    $toString:
                                        "$$mem._id",
                                },

                                "",
                            ],
                        },

                        membershipStatus: {
                            $ifNull: [
                                "$$mem.status",
                                "unknown",
                            ],
                        },

                        tenantId: {
                            $cond: [
                                {
                                    $ifNull: [
                                        "$$mem.tenantResolved._id",
                                        false,
                                    ],
                                },

                                {
                                    $toString:
                                        "$$mem.tenantResolved._id",
                                },

                                "",
                            ],
                        },

                        tenantKey: {
                            $ifNull: [
                                "$$mem.tenantResolved.key",
                                "",
                            ],
                        },

                        tenantNombre: {
                            $ifNull: [
                                "$$mem.tenantResolved.name",
                                "Sin tenant",
                            ],
                        },

                        tenantTipo: {
                            $ifNull: [
                                "$$mem.tenantResolved.type",
                                "",
                            ],
                        },

                        roleId: {
                            $cond: [
                                {
                                    $ifNull: [
                                        "$$mem.roleResolved._id",
                                        false,
                                    ],
                                },

                                {
                                    $toString:
                                        "$$mem.roleResolved._id",
                                },

                                "",
                            ],
                        },

                        roleKey: {
                            $ifNull: [
                                "$$mem.roleResolved.key",
                                "",
                            ],
                        },

                        roleName: {
                            $ifNull: [
                                "$$mem.roleResolved.name",
                                "Sin rol",
                            ],
                        },

                        assignedAt: {
                            $ifNull: [
                                "$$mem.createdAt",
                                null,
                            ],
                        },

                        updatedAt: {
                            $ifNull: [
                                "$$mem.updatedAt",
                                null,
                            ],
                        },
                    },
                },
            },

            membershipsCount: {
                $size:
                    "$membershipsResolved",
            },

            createdAt: 1,
            updatedAt: 1,
            lastLoginAt: 1,
        },
    };
}

const usersRepositoryMongo = {
    async list({
        q = "",
        estado = "",
        tenantKey = "",
        roleKey = "",
        page = 1,
        limit = 50,
    }) {
        const pageNum = Math.max(
            1,
            Number(page) || 1
        );

        const limitNum = Math.max(
            1,
            Math.min(
                200,
                Number(limit) || 50
            )
        );

        const skip =
            (pageNum - 1) * limitNum;

        const baseMatch = {};

        const searchMatch =
            buildSearchMatch(q);

        const statusMatch =
            buildStatusMatch(
                estado
            );

        if (searchMatch) {
            Object.assign(
                baseMatch,
                searchMatch
            );
        }

        if (statusMatch) {
            Object.assign(
                baseMatch,
                statusMatch
            );
        }

        const pipeline = [];

        if (
            Object.keys(baseMatch)
                .length > 0
        ) {
            pipeline.push({
                $match: baseMatch,
            });
        }

        pipeline.push({
            $lookup: {
                from: "memberships",

                let: {
                    userIdObj: "$_id",

                    userIdStr: {
                        $toString:
                            "$_id",
                    },
                },

                pipeline:
                    buildMembershipLookupPipeline(),

                as: "membershipsResolved",
            },
        });

        pipeline.push(
            buildProjectionStage()
        );

        const tenantKeySafe =
            str(tenantKey);

        if (tenantKeySafe) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            tenantKey:
                                tenantKeySafe,
                        },

                        {
                            tenantNombre:
                                new RegExp(
                                    `^${escapeRegex(
                                        tenantKeySafe
                                    )}$`,
                                    "i"
                                ),
                        },
                    ],
                },
            });
        }

        const roleKeySafe =
            str(roleKey);

        if (roleKeySafe) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            roleKey:
                                roleKeySafe,
                        },

                        {
                            roleName:
                                new RegExp(
                                    `^${escapeRegex(
                                        roleKeySafe
                                    )}$`,
                                    "i"
                                ),
                        },
                    ],
                },
            });
        }

        pipeline.push({
            $sort: {
                nombre: 1,
                email: 1,
            },
        });

        pipeline.push({
            $facet: {
                rows: [
                    {
                        $skip: skip,
                    },

                    {
                        $limit:
                            limitNum,
                    },
                ],

                meta: [
                    {
                        $count:
                            "total",
                    },
                ],
            },
        });

        const result =
            await User.aggregate(
                pipeline
            )
                .option({
                    maxTimeMS:
                        Q_MAX_TIME_MS,
                })
                .exec();

        const payload =
            Array.isArray(result) &&
            result[0]
                ? result[0]
                : {};

        return {
            items:
                payload.rows || [],

            total: Number(
                payload.meta?.[0]
                    ?.total || 0
            ),

            page: pageNum,
            limit: limitNum,
        };
    },

    async findById(id) {
        const safeId = str(id);

        if (!safeId) {
            return null;
        }

        const pipeline = [
            {
                $match: {
                    $expr: {
                        $eq: [
                            {
                                $toString:
                                    "$_id",
                            },
                            safeId,
                        ],
                    },
                },
            },

            {
                $lookup: {
                    from: "memberships",

                    let: {
                        userIdObj: "$_id",

                        userIdStr: {
                            $toString:
                                "$_id",
                        },
                    },

                    pipeline:
                        buildMembershipLookupPipeline(),

                    as: "membershipsResolved",
                },
            },

            buildProjectionStage(),
        ];

        const docs =
            await User.aggregate(
                pipeline
            )
                .option({
                    maxTimeMS:
                        Q_MAX_TIME_MS,
                })
                .exec();

        return Array.isArray(docs) &&
            docs[0]
            ? docs[0]
            : null;
    },

    async create({
        nombre,
        email,
        pin,
        activo = true,
        createdBy = null,
        updatedBy = null,
    }) {
        const safeNombre = str(nombre);
        const safeEmail = str(email).toLowerCase();
        const safePin = str(pin);

        if (!safeNombre) {
            throw new Error("Nombre requerido.");
        }

        if (!safeEmail) {
            throw new Error("Email requerido.");
        }

        if (!safePin) {
            throw new Error("PIN requerido.");
        }

        const pinHash = await hashPin(safePin);
        const actorId = resolveActorId(updatedBy || createdBy);

        const created = await User.create({
            displayName: safeNombre,
            email: safeEmail,
            pinHash,
            pinLength: safePin.length,
            pinChangedAt: new Date(),
            status: activo ? "active" : "inactive",
            createdBy: actorId,
            updatedBy: actorId,
        });

        await recordAuditSafe({
            actorUserId: actorId,
            actorTenantId: null,
            module: AUDIT_MODULES.ACCESS,
            action: AUDIT_ACTIONS.USER_CREATED || "USER_CREATED",
            targetType: "USER",
            targetId: String(created._id),
            before: null,
            after: {
                userId: String(created._id),
                email: created.email,
                displayName: created.displayName,
                status: created.status,
            },
            diff: {
                created: true,
            },
        });

        return this.findById(String(created._id));
    },

    async updateById(id, patch = {}) {
        const safeId = str(id);

        if (!safeId) {
            throw new Error("User ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(safeId)) {
            return null;
        }

        const beforeUser = await User.findById(safeId).lean().exec();

        if (!beforeUser) {
            return null;
        }

        const update = {};
        const actorId = resolveActorId(patch.updatedBy);

        if (typeof patch.nombre !== "undefined") {
            update.displayName = str(patch.nombre);
        }

        if (typeof patch.email !== "undefined") {
            update.email = str(patch.email).toLowerCase();
        }

        if (typeof patch.activo !== "undefined") {
            update.status = patch.activo ? "active" : "inactive";
        }

        if (typeof patch.pin !== "undefined" && str(patch.pin)) {
            const safePin = str(patch.pin);

            update.pinHash = await hashPin(safePin);
            update.pinLength = safePin.length;
            update.pinChangedAt = new Date();
            update.failedPinAttempts = 0;
            update.lockedUntil = null;
        }

        update.updatedBy = actorId;
        update.updatedAt = new Date();

        await User.findByIdAndUpdate(
            safeId,
            {
                $set: update,
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        const afterUser = await User.findById(safeId).lean().exec();

        await recordAuditSafe({
            actorUserId: actorId,
            actorTenantId: null,
            module: AUDIT_MODULES.ACCESS,
            action: AUDIT_ACTIONS.USER_UPDATED || "USER_UPDATED",
            targetType: "USER",
            targetId: safeId,
            before: {
                userId: safeId,
                email: beforeUser.email,
                displayName: beforeUser.displayName,
                status: beforeUser.status,
            },
            after: {
                userId: safeId,
                email: afterUser?.email || "",
                displayName: afterUser?.displayName || "",
                status: afterUser?.status || "",
            },
            diff: {
                fields: Object.keys(update).filter(
                    (field) => field !== "updatedAt"
                ),
            },
        });

        return this.findById(safeId);
    },

    async softDeleteById(id, updatedBy = null) {
        const safeId = str(id);

        if (!safeId) {
            throw new Error("User ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(safeId)) {
            return null;
        }

        const actorId = resolveActorId(updatedBy);

        const beforeUser = await User.findById(safeId).lean().exec();

        if (!beforeUser) {
            return null;
        }

        await User.findByIdAndUpdate(
            safeId,
            {
                $set: {
                    status: "inactive",
                    updatedBy: actorId,
                    updatedAt: new Date(),
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        await recordAuditSafe({
            actorUserId: actorId,
            actorTenantId: null,
            module: AUDIT_MODULES.ACCESS,
            action: AUDIT_ACTIONS.USER_DEACTIVATED || "USER_DEACTIVATED",
            targetType: "USER",
            targetId: safeId,
            before: {
                userId: safeId,
                email: beforeUser.email,
                displayName: beforeUser.displayName,
                status: beforeUser.status,
            },
            after: {
                userId: safeId,
                email: beforeUser.email,
                displayName: beforeUser.displayName,
                status: "inactive",
            },
            diff: {
                status: "inactive",
            },
        });

        return this.findById(safeId);
    },

    async getAccessOptions() {
        const [
            tenants,
            roles,
        ] = await Promise.all([
            Tenant.find({
                status: "active",
            })
                .lean()
                .exec(),

            Role.find({
                status: "active",
            })
                .lean()
                .exec(),
        ]);

        return {
            tenants,

            roles,
        };
    },

    async upsertAccessByUserId(
        userId,
        {
            tenantId,
            roleId,
            status = "active",
            createdBy = null,
            updatedBy = null,
        }
    ) {
        const safeUserId =
            str(userId);

        const safeTenantId =
            str(tenantId);

        const safeRoleId =
            str(roleId);

        if (!safeUserId) {
            throw new Error(
                "User ID is required"
            );
        }

        if (!safeTenantId) {
            throw new Error(
                "Tenant ID is required"
            );
        }

        if (!safeRoleId) {
            throw new Error(
                "Role ID is required"
            );
        }

        const user =
            await User.findById(
                safeUserId
            )
                .lean()
                .exec();

        if (!user) {
            return null;
        }

        const tenant =
            await Tenant.findById(
                safeTenantId
            )
                .lean()
                .exec();

        if (!tenant) {
            throw new Error(
                `Tenant not found: ${safeTenantId}`
            );
        }

        const role =
            await Role.findById(
                safeRoleId
            )
                .lean()
                .exec();

        if (!role) {
            throw new Error(
                `Role not found: ${safeRoleId}`
            );
        }

        const userObjectId =
            new mongoose.Types.ObjectId(
                safeUserId
            );

        const tenantObjectId =
            new mongoose.Types.ObjectId(
                safeTenantId
            );

        const roleObjectId =
            new mongoose.Types.ObjectId(
                safeRoleId
            );

        const now = new Date();

        const actorId =
            updatedBy ||
            createdBy ||
            null;

        const beforeMembership =
            await Membership.findOne({
                userId:
                    userObjectId,

                tenantId:
                    tenantObjectId,
            })
                .lean()
                .exec();

        await Membership.updateOne(
            {
                userId:
                    userObjectId,

                tenantId:
                    tenantObjectId,
            },

            {
                $set: {
                    userId:
                        userObjectId,

                    tenantId:
                        tenantObjectId,

                    roleId:
                        roleObjectId,

                    roleKey:
                        role.key ||
                        "",

                    tenantKey:
                        tenant.key ||
                        "",

                    status,

                    updatedAt:
                        now,

                    updatedBy:
                        actorId,
                },

                $setOnInsert: {
                    createdAt:
                        now,

                    createdBy:
                        actorId,
                },
            },

            {
                upsert: true,
            }
        ).exec();

        const afterMembership =
            await Membership.findOne({
                userId:
                    userObjectId,

                tenantId:
                    tenantObjectId,
            })
                .lean()
                .exec();

        await recordAuditSafe({
            actorUserId:
                resolveActorId(
                    actorId
                ),

            actorTenantId:
                safeTenantId,

            module:
                AUDIT_MODULES.ACCESS,

            action:
                AUDIT_ACTIONS.ACCESS_ASSIGNED,

            targetType:
                "MEMBERSHIP",

            targetId:
                afterMembership?._id
                    ? String(
                          afterMembership._id
                      )
                    : safeUserId,

            before:
                beforeMembership,

            after: {
                membershipId:
                    afterMembership?._id
                        ? String(
                              afterMembership._id
                          )
                        : null,

                userId:
                    safeUserId,

                userEmail:
                    user.email || "",

                tenantId:
                    safeTenantId,

                tenantKey:
                    tenant.key || "",

                tenantName:
                    tenant.name || "",

                roleId:
                    safeRoleId,

                roleKey:
                    role.key || "",

                roleName:
                    role.name || "",

                status,
            },

            diff: {
                tenantId:
                    safeTenantId,

                roleId:
                    safeRoleId,

                status,
            },
        });

        return this.findById(
            safeUserId
        );
    },

    async deactivateAccessByMembershipId(
        userId,
        membershipId,
        {
            updatedBy = null,
        } = {}
    ) {
        const safeUserId =
            str(userId);

        const safeMembershipId =
            str(membershipId);

        if (!safeUserId) {
            throw new Error(
                "User ID is required"
            );
        }

        if (!safeMembershipId) {
            throw new Error(
                "Membership ID is required"
            );
        }

        const beforeMembership =
            await Membership.findById(
                safeMembershipId
            )
                .lean()
                .exec();

        if (!beforeMembership) {
            return null;
        }

        await Membership.findByIdAndUpdate(
            safeMembershipId,
            {
                status: "inactive",

                updatedAt:
                    new Date(),

                updatedBy:
                    updatedBy ||
                    null,
            },

            {
                new: true,
            }
        ).exec();

        await recordAuditSafe({
            actorUserId:
                resolveActorId(
                    updatedBy
                ),

            actorTenantId:
                beforeMembership.tenantId ||
                null,

            module:
                AUDIT_MODULES.ACCESS,

            action:
                AUDIT_ACTIONS.ACCESS_REVOKED ||
                "ACCESS_REVOKED",

            targetType:
                "MEMBERSHIP",

            targetId:
                safeMembershipId,

            before:
                beforeMembership,

            after: {
                ...beforeMembership,

                status:
                    "inactive",

                updatedBy:
                    updatedBy ||
                    null,
            },

            diff: {
                status:
                    "inactive",
            },
        });

        return this.findById(
            safeUserId
        );
    },
};

export default usersRepositoryMongo;
