// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\server\src\modules\auth\infrastructure\mongoose\models\user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    displayName: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    pin: { type: String, required: true },
    pinLength: { type: Number },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    roles: [{ type: String }],
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
    lastLoginAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
    timestamps: true,
    collection: 'users'
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ status: 1 });

export const User = mongoose.model('User', userSchema);
export default User;