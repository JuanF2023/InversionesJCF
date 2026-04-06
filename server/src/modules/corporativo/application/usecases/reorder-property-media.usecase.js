// server/src/modules/corporativo/application/usecases/reorder-property-media.usecase.js

/**
 * Use case: Reordenar media de una propiedad
 * @param {string} propertyId
 * @param {string[]} orderIds
 * @returns {Promise<{items:Array}|null>}
 */
export class ReorderPropertyMediaUsecase {
    constructor({ mediaRepository }) {
        this.mediaRepository = mediaRepository;
    }

    async execute(propertyId, orderIds = []) {
        const ids = Array.isArray(orderIds) ? orderIds : [];
        const result = await this.mediaRepository.reorder(propertyId, ids);
        return result; // { items } o null
    }
}
