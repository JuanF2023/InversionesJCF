// server/src/modules/auth/infrastructure/repositories/refresh-tokens.repository.mongo.js
import crypto from "crypto";
import { RefreshTokenModel } from "#modules/auth/infrastructure/mongoose/models/refresh-token.model.js";

function hash(value) {
    return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export const RefreshTokensRepositoryMongo = {
    hashToken(raw) {
        return hash(raw);
    },

    async create(data) {
        return RefreshTokenModel.create(data);
    },

    async findValidByRawToken(rawToken) {
        const tokenHash = hash(rawToken);

        return RefreshTokenModel.findOne({
            tokenHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        }).lean().exec();
    },

    async revokeAndReplace({ currentHash, nextHash, ip }) {
        return RefreshTokenModel.findOneAndUpdate(
            { tokenHash: currentHash, revokedAt: null },
            {
                $set: {
                    revokedAt: new Date(),
                    revokedByIp: ip || null,
                    replacedByTokenHash: nextHash,
                },
            }
        ).exec();
    },

    async revokeAllBySession(sessionId, ip) {
        return RefreshTokenModel.updateMany(
            { sessionId, revokedAt: null },
            {
                $set: {
                    revokedAt: new Date(),
                    revokedByIp: ip || null,
                },
            }
        ).exec();
    },
};

export default RefreshTokensRepositoryMongo;