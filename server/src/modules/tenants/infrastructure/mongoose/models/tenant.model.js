// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\server\src\modules\tenants\infrastructure\mongoose\models\tenant.model.js
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    key: { type: String, required: true, trim: true, lowercase: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    name: { type: String, required: true, trim: true },
    type: { type: String, trim: true },

    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'tenants'
});

// índices centralizados
tenantSchema.index({ key: 1 }, { unique: true });
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ status: 1 });
tenantSchema.index({ type: 1 });

export const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;