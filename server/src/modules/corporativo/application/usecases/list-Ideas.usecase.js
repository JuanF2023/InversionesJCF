// server/src/modules/corporativo/application/usecases/list-Ideas.usecase.js

/**
 * Use case: Listar ideas
 * Clean Architecture:
 * - NO importa infraestructura.
 * - Recibe ideasRepository por inyecci¨®n.
 */
export class ListIdeasUsecase {
    /**
     * @param {{ ideasRepository: { findMany: Function, count?: Function } }} deps
     */
    constructor({ ideasRepository }) {
        if (!ideasRepository) throw new Error("ListIdeasUsecase requiere ideasRepository");
        this.ideasRepository = ideasRepository;
    }

    /**
     * @param {{ filter?: object, sort?: string, skip?: number, limit?: number }} [params]
     */
    async execute(params = {}) {
        const {
            filter = {},
            sort = "-createdAt",
            skip = 0,
            limit = 50,
        } = params;

        const items = await this.ideasRepository.findMany({
            filter,
            sort,
            skip,
            limit,
            lean: true,
        });

        const total = this.ideasRepository.count
            ? await this.ideasRepository.count(filter)
            : items.length;

        return { items, total };
    }
}
