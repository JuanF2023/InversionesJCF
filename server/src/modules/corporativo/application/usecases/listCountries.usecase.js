// server/src/modules/corporativo/application/usecases/listCountries.usecase.js
/**
 * Use case: Listar países (desde MongoDB)
 */
export class ListCountriesUseCase {
    /**
     * @param {{ countriesRepo: { list: Function } }} deps
     */
    constructor({ countriesRepo }) {
        this.countriesRepo = countriesRepo;
    }

    async execute(filters = {}) {
        const items = await this.countriesRepo.list(filters);

        // Normalizamos a contrato frontend: { id, codigo, nombre }
        const normalized = items.map((c) => ({
            id: String(c._id),
            codigo: c.code || c.iso2 || c.iso3 || "",
            nombre: c.name || "",
            iso2: c.iso2 || "",
            iso3: c.iso3 || "",
            active: Boolean(c.active),
        }));

        return { ok: true, items: normalized };
    }
}
