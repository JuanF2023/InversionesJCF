// server/src/modules/corporativo/infrastructure/repositories/users/users-read.repository.mongo.js

import { User } from "#modules/auth/infrastructure/mongoose/models/user.model.js";

import {
    Q_MAX_TIME_MS,
    buildMembershipLookupPipeline,
    buildProjectionStage,
    buildSearchMatch,
    buildStatusMatch,
    escapeRegex,
    str,
} from "#modules/corporativo/infrastructure/repositories/users/users-aggregation.mongo.js";

const usersReadRepositoryMongo = {
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

        if (searchMatch) {
            Object.assign(baseMatch, searchMatch);
        }

        if (statusMatch) {
            Object.assign(baseMatch, statusMatch);
        }

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
                    memberships: {
                        $elemMatch: {
                            $or: [
                                { tenantKey: tenantKeySafe },
                                {
                                    tenantNombre: new RegExp(
                                        `^${escapeRegex(tenantKeySafe)}$`,
                                        "i"
                                    ),
                                },
                            ],
                        },
                    },
                },
            });
        }

        const roleKeySafe = str(roleKey);

        if (roleKeySafe) {
            pipeline.push({
                $match: {
                    memberships: {
                        $elemMatch: {
                            $or: [
                                { roleKey: roleKeySafe },
                                {
                                    roleName: new RegExp(
                                        `^${escapeRegex(roleKeySafe)}$`,
                                        "i"
                                    ),
                                },
                            ],
                        },
                    },
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
                rows: [{ $skip: skip }, { $limit: limitNum }],
                meta: [{ $count: "total" }],
            },
        });

        const result = await User.aggregate(pipeline)
            .option({ maxTimeMS: Q_MAX_TIME_MS })
            .exec();

        const payload = Array.isArray(result) && result[0] ? result[0] : {};

        return {
            items: payload.rows || [],
            total: Number(payload.meta?.[0]?.total || 0),
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
};

export default usersReadRepositoryMongo;