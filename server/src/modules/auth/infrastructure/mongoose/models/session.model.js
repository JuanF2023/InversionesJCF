// server/src/modules/auth/infrastructure/mongoose/models/session.model.js
import mongoose from "mongoose";

const SESSION_STATES = ["ACTIVE", "BREAK", "CLOSED"];

const CLOSED_REASONS = [
    "manual_logout",
    "expired",
    "idle_timeout",
    "force_close",
    "force_close_by_token",
    "login_replaced",
    "admin_force_close",
];

const CLOSE_SOURCES = [
    "frontend_logout",
    "expire_job",
    "idle_job",
    "admin_action",
    "system",
];

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            default: null,
            index: true,
        },

        membershipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Membership",
            default: null,
        },

        token: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },

        refreshToken: {
            type: String,
            default: null,
        },

        state: {
            type: String,
            enum: SESSION_STATES,
            default: "ACTIVE",
            index: true,
        },

        startedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        lastActiveAt: {
            type: Date,
            default: Date.now,
            index: true,
        },

        deviceLabel: {
            type: String,
            trim: true,
            default: "web",
        },

        ipAddress: {
            type: String,
            trim: true,
            default: null,
        },

        userAgent: {
            type: String,
            trim: true,
            default: null,
        },

        closedAt: {
            type: Date,
            default: null,
        },

        closedReason: {
            type: String,
            enum: CLOSED_REASONS,
            default: null,
        },

        closeSource: {
            type: String,
            enum: CLOSE_SOURCES,
            default: null,
        },

        closedBy: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "sessions",
        versionKey: false,
    }
);

sessionSchema.index({ userId: 1, state: 1 });
sessionSchema.index({ tenantId: 1, state: 1 });
sessionSchema.index({ membershipId: 1 });
sessionSchema.index({ startedAt: -1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionModel =
    mongoose.models.Session || mongoose.model("Session", sessionSchema);

export { SessionModel };
export const Session = SessionModel;
export default SessionModel;