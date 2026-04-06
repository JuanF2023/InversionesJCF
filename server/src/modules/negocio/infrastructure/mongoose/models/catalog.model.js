// server/src/modules/corporativo/infrastructure/mongoose/models/catalog.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const TipoSchema = new Schema(
    {
        codigo: { type: String, required: true, trim: true, uppercase: true },
        nombre: { type: String, required: true, trim: true },
        activo: { type: Boolean, default: true },
        orden: { type: Number, default: 0 },
    },
    { _id: false }
);

const SubcategoriaSchema = new Schema(
    {
        codigo: { type: String, required: true, trim: true, uppercase: true },
        nombre: { type: String, required: true, trim: true },
        activo: { type: Boolean, default: true },
        orden: { type: Number, default: 0 },
        tipos: { type: [TipoSchema], default: [] },
    },
    { _id: false }
);

const catalogo-negociosSchema = new Schema(
    {
        tenantId: { type: String, required: true, trim: true, default: "CORPORATIVO" },

        codigo: { type: String, required: true, trim: true, uppercase: true },
        nombre: { type: String, required: true, trim: true },
        orden: { type: Number, default: 0 },
        activo: { type: Boolean, default: true },

        subcategorias: { type: [SubcategoriaSchema], default: [] },

        creadoPor: { type: String, default: "system" },
        fechaCreacion: { type: Date, default: Date.now },
        actualizadoPor: { type: String, default: "system" },
        fechaActualizacion: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false,
        collection: "catalogos_negocios",
    }
);

catalogo-negociosSchema.index({ tenantId: 1, codigo: 1 }, { unique: true, name: "uq_tenant_codigo" });

export default mongoose.models.catalogo-negocios ||
    mongoose.model("catalogo-negocios", catalogo-negociosSchema);

