// server/src/modules/auth/infrastructure/repositories/memberships.repository.js
import Membership from "#modules/auth/infrastructure/mongoose/models/membership.model.js";

const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 2000);

function assertConnected() {
    const rs = Membership?.db?.readyState;
    if (rs !== 1) {
        const err = new Error(`[MembershipsRepository] Mongo no listo. readyState=${rs}`);
        err.code = "MONGO_NOT_READY";
        throw err;
    }
}

export const MembershipsRepository = {
    async listActiveByUserId(userId) {
        assertConnected();

        return Membership.find({ userId, status: "active" })
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    },

    async findActiveByUserAndTenant({ userId, tenantId }) {
        assertConnected();

        return Membership.findOne({ userId, tenantId, status: "active" })
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    },
};

export default MembershipsRepository;