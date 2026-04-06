// server/src/modules/corporativo/application/usecases/get-property-detail.usecase.js
export class GetPropertyDetailUsecase {
    /**
     * @param {{
     *  propertiesRepository: import("#modules/corporativo/domain/repositories/properties.repository.port.js").PropertiesRepositoryPort
     * }} deps
     */
    constructor({ propertiesRepository }) {
        this.propertiesRepository = propertiesRepository;
    }

    /**
     * @param {string} codigoOrId
     * @returns {Promise<null | { property: any }>}
     */
    async execute(codigoOrId) {
        const id = String(codigoOrId || "").trim();
        if (!id) return null;

        // �?Preferimos la API nueva del repo (Clean Arch)
        if (typeof this.propertiesRepository.getByCodigoOrId === "function") {
            const property = await this.propertiesRepository.getByCodigoOrId(id);
            if (!property) return null;
            return { property };
        }

        // �?Compatibilidad por si aún existe detail() en alguna implementación antigua
        if (typeof this.propertiesRepository.detail === "function") {
            const property = await this.propertiesRepository.detail(id);
            if (!property) return null;
            return { property };
        }

        // 🚫 Si ninguna existe, la implementación está incompleta
        throw new Error(
            "Repositorio de propiedades incompleto: falta getByCodigoOrId() o detail()."
        );
    }
}
