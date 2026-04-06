// server/src/modules/corporativo/infrastructure/mongoose/models/catalogo-negocios.model.js
import mongoose from "mongoose";

/**
 * Model 鈥?Cat谩logo de Negocios
 * Colecci贸n real en Atlas: catalogos_negocios
 *
 * Nota:
 * - Los documentos actuales pueden venir en formato legacy jer谩rquico.
 * - Se mantiene strict:false para no bloquear lectura durante la migraci贸n.
 * - La normalizaci贸n/flatten se resuelve en presenter/repository.
 */
const CatalogoNegociosSchema = new mongoose.Schema(
    {
        tenantId: { type: String, index: true, trim: true },
        codigo: { type: String, index: true, trim: true },
        nombre: { type: String, trim: true },
        orden: { type: Number, default: 0 },
        activo: { type: Boolean, default: true, index: true },
        subcategorias: { type: Array, default: [] },

        /**
         * Compatibilidad con modo flat
         */
        key: { type: String, trim: true, default: null },
        level: { type: String, index: true, trim: true, default: null },
        parentKey: { type: String, trim: true, default: null },
        label: { type: String, trim: true, default: null },
        system: { type: Boolean, default: false },
        tags: { type: [String], default: [] },
        synonyms: { type: [String], default: [] },
        scope: { type: String, trim: true, default: null },
        order: { type: Number, default: 0 },
        icono: { type: String, trim: true, default: null },
        color: { type: String, trim: true, default: null },
        descripcion: { type: String, trim: true, default: null },
        description: { type: String, trim: true, default: null },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    {
        timestamps: true,
        strict: false,
        collection: "catalogos_negocios",
    }
);

CatalogoNegociosSchema.index({ tenantId: 1, codigo: 1 });
CatalogoNegociosSchema.index({ tenantId: 1, key: 1 });
CatalogoNegociosSchema.index({ tenantId: 1, level: 1, parentKey: 1 });

const CatalogoNegociosModel =
    mongoose.models.CatalogoNegocios ||
    mongoose.model("CatalogoNegocios", CatalogoNegociosSchema);

export default CatalogoNegociosModel;

