// server/src/modules/corporativo/infrastructure/repositories/users/users-aggregation.mongo.js

export const Q_MAX_TIME_MS = Number(
    process.env.MONGO_QUERY_MAX_TIME_MS || 4000
);

export function str(value) {
    return String(value ?? "").trim();
}

export function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function resolveActorId(value) {
    if (!value) return null;
    if (value?._id) return value._id;
    return value;
}

export function buildSearchMatch(q) {
    const safe = str(q);

    if (!safe) {
        return null;
    }

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

export function buildStatusMatch(estado) {
    const normalized = str(estado).toLowerCase();

    if (["activo", "activos", "activa", "activas"].includes(normalized)) {
        return { status: "active" };
    }

    if (["inactivo", "inactivos", "inactiva", "inactivas"].includes(normalized)) {
        return { status: "inactive" };
    }

    return null;
}

export function buildMembershipLookupPipeline() {
    return [
        {
            $match: {
                $expr: {
                    $or: [
                        { $eq: ["$userId", "$$userIdObj"] },
                        {
                            $eq: [
                                { $toString: "$userId" },
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
                    $arrayElemAt: ["$roleDoc", 0],
                },
                tenantResolved: {
                    $arrayElemAt: ["$tenantDoc", 0],
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

export function buildProjectionStage() {
    return {
        $project: {
            _id: 0,
            id: { $toString: "$_id" },
            mongoId: "$_id",

            nombre: {
                $let: {
                    vars: {
                        displayName: {
                            $trim: {
                                input: {
                                    $ifNull: ["$displayName", ""],
                                },
                            },
                        },
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

            email: {
                $ifNull: ["$email", ""],
            },

            activo: {
                $eq: [
                    {
                        $toLower: {
                            $ifNull: ["$status", "inactive"],
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
                                    $ifNull: ["$status", "inactive"],
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
                    input: "$membershipsResolved",
                    as: "mem",
                    in: {
                        membershipId: {
                            $cond: [
                                { $ifNull: ["$$mem._id", false] },
                                { $toString: "$$mem._id" },
                                "",
                            ],
                        },
                        membershipStatus: {
                            $ifNull: ["$$mem.status", "unknown"],
                        },
                        tenantId: {
                            $cond: [
                                { $ifNull: ["$$mem.tenantResolved._id", false] },
                                { $toString: "$$mem.tenantResolved._id" },
                                "",
                            ],
                        },
                        tenantKey: {
                            $ifNull: ["$$mem.tenantResolved.key", ""],
                        },
                        tenantNombre: {
                            $ifNull: ["$$mem.tenantResolved.name", "Sin tenant"],
                        },
                        tenantTipo: {
                            $ifNull: ["$$mem.tenantResolved.type", ""],
                        },
                        roleId: {
                            $cond: [
                                { $ifNull: ["$$mem.roleResolved._id", false] },
                                { $toString: "$$mem.roleResolved._id" },
                                "",
                            ],
                        },
                        roleKey: {
                            $ifNull: ["$$mem.roleResolved.key", ""],
                        },
                        roleName: {
                            $ifNull: ["$$mem.roleResolved.name", "Sin rol"],
                        },
                        assignedAt: {
                            $ifNull: ["$$mem.createdAt", null],
                        },
                        updatedAt: {
                            $ifNull: ["$$mem.updatedAt", null],
                        },
                    },
                },
            },

            membershipsCount: {
                $size: "$membershipsResolved",
            },

            createdAt: 1,
            updatedAt: 1,
            lastLoginAt: 1,
        },
    };
}