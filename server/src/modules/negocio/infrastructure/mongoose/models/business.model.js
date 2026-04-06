// server/src/modules/corporativo/infrastructure/mongoose/models/business.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Business (Corporativo) — enterprise / multi-tenant
 *
 * Compatibilidad:
 * - Mantiene campos legacy: tipo, estado, propiedadCodigo, metadata.*
 * - Agrega campos canónicos usados por el frontend:
 *   - categoryId, subcategoryId, typeId, estadoOperacion
 *   - propiedadId (ObjectId)
 *   - ubicacion* (para negocios independientes)
 * - Soft delete: deletedAt
 *
 * Reglas:
 * - tenantId obligatorio (multi-tenant real)
 * - Si propiedadId existe => NO se debe guardar ubicación manual
 */
const BusinessSchema = new Schema(
    {
        tenantId: { type: String, required: true, index: true },

        codigo: { type: String, required: true, trim: true, index: true },
        nombre: { type: String, required: true, trim: true, index: true },
        descripcion: { type: String, trim: true, default: "" },

        /* -----------------------------
         * Clasificación (CATÁLOGO)
         * ----------------------------- */
        categoryId: { type: String, trim: true, default: "", index: true },
        subcategoryId: { type: String, trim: true, default: "", index: true },
        typeId: { type: String, trim: true, default: "", index: true },

        /* -----------------------------
         * Estado canónico (frontend)
         * ----------------------------- */
        estadoOperacion: {
            type: String,
            trim: true,
            enum: ["ACTIVO", "INACTIVO"],
            default: "ACTIVO",
            index: true,
        },

        /* -----------------------------
         * Relación con Propiedad (canónico)
         * ----------------------------- */
        propiedadId: {
            type: Schema.Types.ObjectId,
            ref: "Property",
            default: null,
            index: true,
        },

        /* -----------------------------
         * Ubicación manual (solo si NO hay propiedadId)
         * Mismo set que Propiedades (enterprise)
         * ----------------------------- */
        ubicacion: {
            pais: { type: String, trim: true, default: "" },
            departamento: { type: String, trim: true, default: "" },
            municipio: { type: String, trim: true, default: "" },
            ciudad: { type: String, trim: true, default: "" },
            direccion: { type: String, trim: true, default: "" },
        },
        ubicacionGeneral: { type: String, trim: true, default: "" },
        calleAcceso: { type: String, trim: true, default: "" },
        notas: { type: String, trim: true, default: "" },

        /* -----------------------------
         * Legacy / compat
         * ----------------------------- */
        tipo: { type: String, trim: true, default: "" },
        estado: { type: String, trim: true, default: "ACTIVO", index: true },

        // Legacy (si ya hay data que guarda un código en vez del ObjectId)
        propiedadCodigo: { type: String, trim: true, default: "", index: true },

        /* -----------------------------
         * Metadata interna (regla)
         * ----------------------------- */
        creadoPor: { type: String, trim: true, default: "" },
        fechaCreacion: { type: Date, default: Date.now },

        // Compat por si ya hay documentos con metadata.*
        metadata: {
            creadoPor: { type: String, trim: true, default: "" },
            fechaCreacion: { type: Date, default: Date.now },
        },

        /* -----------------------------
         * Soft delete
         * ----------------------------- */
        deletedAt: { type: Date, default: null, index: true },
    },
    { timestamps: true, minimize: false }
);

/**
 * Índice compuesto único recomendado (multi-tenant)
 * - Evita duplicados de codigo por tenant.
 */
BusinessSchema.index({ tenantId: 1, codigo: 1 }, { unique: true });

/**
 * Búsqueda por texto (opcional)
 */
BusinessSchema.index({ nombre: "text", descripcion: "text", codigo: "text" });

/**
 * Normalización enterprise:
 * - Si propiedadId existe => limpia ubicación manual (evita duplicar)
 */
BusinessSchema.pre("validate", function preValidate(next) {
    try {
        if (this.propiedadId) {
            this.ubicacion = {
                pais: "",
                departamento: "",
                municipio: "",
                ciudad: "",
                direccion: "",
            };
            this.ubicacionGeneral = "";
            this.calleAcceso = "";
            this.notas = "";
        }
        next();
    } catch (e) {
        next(e);
    }
});

/**
 * Export canónico:
 * - Nombre de modelo en Mongo: "Business"
 */
export const BusinessModel =
    mongoose.models.Business || mongoose.model("Business", BusinessSchema);

export default BusinessModel;
