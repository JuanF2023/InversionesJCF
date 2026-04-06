// server/src/modules/corporativo/infrastructure/repositories/properties.media.repository.js
import Properties from "#modules/negocio/infrastructure/mongoose/models/properties.model.js";

/**
 * PropertiesMediaRepository
 * - Acceso a subdocumentos "media" en Properties.
 * - Mantiene operaciones atómicas y retornos consistentes.
 */
export class PropertiesMediaRepository {
    /**
     * Obtiene el array media de una propiedad.
     * @param {string} propertyId
     * @returns {Promise<Array|null>}
     */
    async list(propertyId) {
        const doc = await Properties.findById(propertyId, { media: 1 }).lean();
        if (!doc) return null;
        return Array.isArray(doc.media) ? doc.media : [];
    }

    /**
     * Agrega un item al array media.
     * @param {string} propertyId
     * @param {object} mediaItem
     * @returns {Promise<object|null>}
     */
    async add(propertyId, mediaItem) {
        const updated = await Properties.findByIdAndUpdate(
            propertyId,
            { $push: { media: mediaItem } },
            { new: true, projection: { media: 1 } }
        ).lean();

        return updated || null;
    }

    /**
     * Elimina un item del array media por _id.
     * @param {string} propertyId
     * @param {string} mediaId
     * @returns {Promise<{updated: object|null, removed: object|null}>}
     */
    async remove(propertyId, mediaId) {
        const prop = await Properties.findById(propertyId, { media: 1 });
        if (!prop) return { updated: null, removed: null };

        const removed = prop.media?.id?.(mediaId)?.toObject?.() || null;

        const updated = await Properties.findByIdAndUpdate(
            propertyId,
            { $pull: { media: { _id: mediaId } } },
            { new: true, projection: { media: 1 } }
        ).lean();

        return { updated: updated || null, removed };
    }

    /**
     * Reordena el array media basado en una lista de IDs.
     * - No permite perder elementos: si faltan IDs, conserva el orden previo para los restantes.
     * - Si llegan IDs desconocidos, se ignoran.
     * @param {string} propertyId
     * @param {string[]} orderIds
     * @returns {Promise<{items:Array}|null>}
     */
    async reorder(propertyId, orderIds = []) {
        const prop = await Properties.findById(propertyId, { media: 1 }).lean();
        if (!prop) return null;

        const current = Array.isArray(prop.media) ? prop.media : [];
        const byId = new Map(current.map((m) => [String(m?._id), m]));

        const normalized = Array.isArray(orderIds)
            ? orderIds.map((x) => String(x)).filter(Boolean)
            : [];

        // Construye nuevo orden respetando IDs válidos y existentes
        const next = [];
        const used = new Set();

        for (const id of normalized) {
            const m = byId.get(id);
            if (m && !used.has(id)) {
                next.push(m);
                used.add(id);
            }
        }

        // Agrega al final los que no fueron enviados
        for (const m of current) {
            const id = String(m?._id);
            if (!used.has(id)) next.push(m);
        }

        const updated = await Properties.findByIdAndUpdate(
            propertyId,
            { $set: { media: next } },
            { new: true, projection: { media: 1 } }
        ).lean();

        if (!updated) return null;
        return { items: Array.isArray(updated.media) ? updated.media : [] };
    }
}

export default PropertiesMediaRepository;

