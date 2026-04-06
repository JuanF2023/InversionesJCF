// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\server\src\modules\roles\infrastructure\mongoose\models\role.model.js
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    key: { type: String, required: true, trim: true, lowercase: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    tenantType: { type: String, trim: true, default: 'corporativo' },
    permissions: [{ type: String, trim: true }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
    timestamps: true,
    collection: 'roles'
});

roleSchema.index({ key: 1 }, { unique: true });
roleSchema.index({ slug: 1 }, { unique: true });
roleSchema.index({ status: 1 });
roleSchema.index({ tenantType: 1 });

roleSchema.pre('validate', function (next) {
    if (!this.slug && this.key) this.slug = this.key;
    if (!this.key && this.slug) this.key = this.slug;
    next();
});

export const Role = mongoose.model('Role', roleSchema);
export default Role;
