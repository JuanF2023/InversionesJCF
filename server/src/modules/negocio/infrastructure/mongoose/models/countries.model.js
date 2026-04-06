// server/src/modules/corporativo/infrastructure/mongoose/models/countries.model.js
import mongoose from "mongoose";

/**
 * CountriesModel
 * Catálogo corporativo: países.
 * - ISO code (SV, US, etc.)
 * - Uso corporativo transversal (propiedades, negocios, reportes)
 */
const CountriesSchema = new mongoose.Schema(
    {
        // Código ISO del país (único)
        code: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },

        // Nombre del país
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Estado lógico
        active: {
            type: Boolean,
            default: true,
            index: true,
        },

        // Auditoría básica
        creadoPor: {
            type: String,
            default: "",
        },
        fechaCreacion: {
            type: Date,
            default: () => new Date(),
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Índices
 * - Único por código ISO
 * - Definido explícitamente para evitar duplicados
 */
CountriesSchema.index({ code: 1 }, { unique: true });

const CountriesModel =
    mongoose.models.Countries ||
    mongoose.model("Countries", CountriesSchema);

export default CountriesModel;
export { CountriesModel };
