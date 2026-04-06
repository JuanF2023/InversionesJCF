// server/src/modules/auth/infrastructure/mongoose/models/membership.model.js
import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", index: true },
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", index: true },
        roleKey: { type: String, trim: true },
        tenantKey: { type: String, trim: true },
        status: {
            type: String,
            enum: ["active", "inactive", "pending", "suspended"],
            default: "pending",
        },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
        expiresAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true,
        collection: "memberships",
    }
);

membershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true, sparse: true });
membershipSchema.index({ userId: 1, status: 1 });
membershipSchema.index({ tenantId: 1, roleId: 1 });
membershipSchema.index({ expiresAt: 1 }, { sparse: true });

membershipSchema.methods.isActive = function () {
    const now = new Date();
    return this.status === "active" && (!this.expiresAt || this.expiresAt > now);
};

membershipSchema.methods.isExpired = function () {
    return this.expiresAt && this.expiresAt <= new Date();
};

membershipSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
});

membershipSchema.virtual("role", {
    ref: "Role",
    localField: "roleId",
    foreignField: "_id",
    justOne: true,
});

membershipSchema.virtual("tenant", {
    ref: "Tenant",
    localField: "tenantId",
    foreignField: "_id",
    justOne: true,
});

const Membership =
    mongoose.models.Membership || mongoose.model("Membership", membershipSchema);

export { Membership };
export default Membership;