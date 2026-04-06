// server/src/modules/corporativo/infrastructure/mongoose/models/unit.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * UnitModel (enterprise)
 * Unidades dentro de una propiedad (apartamentos, locales, cuartos, etc.)
 * - Multi-tenant
 * - Refs (propertyId, businessId)
 * - Campos canon: code, name, unitType, status
 * - Compat: aliases (codigo, nombre, tipo, estado)
 */
const UnitSchema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, required: true, index: true },

        propertyId: { type: Schema.Types.ObjectId, ref: "Properties", required: true, index: true },
        businessId: { type: Schema.Types.ObjectId, ref: "Businesses", default: null, index: true },

        // Canon
        code: { type: String, required: true, trim: true, uppercase: true, index: true, alias: "codigo" },
        name: { type: String, default: "", trim: true, alias: "nombre" },

        unitType: { type: String, default: "", trim: true, index: true, alias: "tipo" }, // APTO | LOCAL | CUARTO...
        status: { type: String, default: "ACTIVA", trim: true, index: true, alias: "estado" }, // ACTIVA | INACTIVA | OCUPADA...

        // Opcionales (si tu UI ya los usa)
        level: { type: String, default: "", trim: true, index: true },
        doorNumber: { type: String, default: "", trim: true, index: true },

        builtAreaM2: { type: Number, default: 0 },
        usableAreaM2: { type: Number, default: 0 },
        capacityPeople: { type: Number, default: 0 },

        baseRentMonthly: { type: Number, default: 0 },
        currency: { type: String, default: "USD", trim: true },

        economicNotes: { type: String, default: "", trim: true },
        notes: { type: String, default: "", trim: true },

        active: { type: Boolean, default: true, index: true },

        // Auditoría enterprise (canon)
        createdBy: { type: Schema.Types.ObjectId, default: null },
        updatedBy: { type: Schema.Types.ObjectId, default: null },

        // Compat con tu regla vieja (por si en UI/exports ya existe)
        creadoPor: { type: String, default: "" },
        fechaCreacion: { type: Date, default: () => new Date() },
    },
    { timestamps: true, minimize: false }
);

// Unicidad por tenant + propiedad + código
UnitSchema.index({ tenantId: 1, propertyId: 1, code: 1 }, { unique: true });

// Mantener compat auditoría si llegan campos viejos
UnitSchema.pre("validate", function syncCompat(next) {
    if (!this.fechaCreacion) this.fechaCreacion = this.createdAt || new Date();
    if (!this.creadoPor && this.createdBy) this.creadoPor = String(this.createdBy);
    next();
});

const UnitModel = mongoose.models.Unit || mongoose.model("Unit", UnitSchema);

export default UnitModel;
export { UnitModel };
