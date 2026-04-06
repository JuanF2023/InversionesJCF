// server/src/modules/corporativo/infrastructure/repositories/countries.repository.js
import CountriesModel from "#modules/negocio/infrastructure/mongoose/models/countries.model.js";



/**
 * CountriesRepository
 * Lee la colecci鐠愮�?"countries" de MongoDB.
 */
export class CountriesRepository {
    /**
     * @param {{ active?: boolean }} filters
     */
    async list(filters = {}) {
        const q = {};

        // Por defecto: solo activos
        if (filters.active === undefined) q.active = true;
        else q.active = Boolean(filters.active);

        const docs = await CountriesModel.find(q)
            .sort({ name: 1 })
            .lean();

        return docs;
    }
}



