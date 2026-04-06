// server/src/modules/corporativo/infrastructure/mongoose/models/properties.model.js
import mongoose from "mongoose";

/**
 * PropertiesModel
 * Módulo corporativo: propiedades.
 * Esquema minimalista para arrancar. Se amplía en iteraciones.
 */
const PropertiesSchema = new mongoose.Schema(
    {
        // Índice único se declara abajo con PropertiesSchema.index(...)
        codigo: { type: String, required: true, trim: true, uppercase: true },

        nombre: { type: String, required: true, trim: true },

        estado: { type: String, default: "ACTIVA", trim: true, index: true }, // ACTIVA | INACTIVA | VENDIDA
        tipo: { type: String, default: "", trim: true, index: true },

        descripcionActual: { type: String, default: "", trim: true },
        notas: { type: String, default: "", trim: true },

        ubicacion: {
            pais: { type: String, default: "", trim: true, index: true },
            departamento: { type: String, default: "", trim: true },
            ciudad: { type: String, default: "", trim: true },
            municipio: { type: String, default: "", trim: true },
            direccion: { type: String, default: "", trim: true },
            gps: { type: String, default: "", trim: true },
        },

        finanzas: {
            moneda: { type: String, default: "USD", trim: true },
            valorCompra: { type: Number, default: 0 },
            valorActual: { type: Number, default: 0 },
        },

        // Metadata interna (regla del proyecto)
        creadoPor: { type: String, default: "" },
        fechaCreacion: { type: Date, default: () => new Date() },

        active: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

// Índice único para evitar códigos duplicados
PropertiesSchema.index({ codigo: 1 }, { unique: true });

const PropertiesModel =
    mongoose.models.Properties || mongoose.model("Properties", PropertiesSchema);

export default PropertiesModel;
export { PropertiesModel };
