// server/src/modules/corporativo/infrastructure/repositories/properties.repository.js
import Properties from "#modules/negocio/infrastructure/mongoose/models/properties.model.js";

function isObjectIdLike(v) {
    if (v == null) return false;
    return /^[a-fA-F0-9]{24}$/.test(String(v).trim());
}

export default class PropertiesRepository {
    constructor() {
        this.model = Properties;
    }

    async list(filters = {}) {
        const find = {};

        if (filters?.q?.trim()) {
            const term = String(filters.q).trim();
            find.$or = [
                { nombre: { $regex: term, $options: "i" } },
                { codigo: { $regex: term, $options: "i" } },
                { "ubicacion.ciudad": { $regex: term, $options: "i" } },
            ];
        }

        if (filters?.pais?.trim()) {
            find["ubicacion.pais"] = String(filters.pais).trim();
        }

        if (filters?.estado?.trim()) {
            find.estado = String(filters.estado).trim();
        }

        const page = Number(filters?.page || 1);
        const limit = Number(filters?.limit ?? 0);

        const query = this.model.find(find).sort({ createdAt: -1 });

        if (limit > 0) {
            query.skip((page - 1) * limit).limit(limit);
        }

        const [items, total] = await Promise.all([
            query.lean(),
            this.model.countDocuments(find),
        ]);

        return { items, total, page, limit };
    }

    /**
     * API CANON (Clean Arch):
     * Detalle por ObjectId o por codigo.
     */
    async getByCodigoOrId(codigoOrId) {
        const key = String(codigoOrId || "").trim();
        if (!key) return null;

        if (isObjectIdLike(key)) {
            return this.model.findById(key).lean();
        }

        return this.model.findOne({ codigo: key.toUpperCase() }).lean();
    }

    /**
     * COMPAT (si alguna parte vieja llama detail()).
     */
    async detail(codigoOrId) {
        return this.getByCodigoOrId(codigoOrId);
    }

    /**
     * COMPAT (si alguna parte vieja aún llama el nombre anterior).
     * Lo dejamos para no romper nada y lo retiramos cuando limpies rutas/FE.
     */
    async getDetailByIdOrCodigo(idOrCodigo) {
        return this.getByCodigoOrId(idOrCodigo);
    }
}

