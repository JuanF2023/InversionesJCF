// server/src/modules/auth/infrastructure/mongoose/models/refresh-token.model.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, index: true },
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", index: true },

        tokenHash: { type: String, required: true, unique: true, index: true },

        expiresAt: { type: Date, required: true, index: true },
        revokedAt: { type: Date, default: null },

        replacedByTokenHash: { type: String, default: null },

        createdByIp: { type: String },
        revokedByIp: { type: String },
        userAgent: { type: String },
    },
    {
        timestamps: true,
        collection: "refresh_tokens",
    }
);

// TTL automático
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel =
    mongoose.models.RefreshToken ||
    mongoose.model("RefreshToken", schema);