// server/src/modules/corporativo/application/usecases/remove-property-media.usecase.js
export class RemovePropertyMediaUsecase {
    constructor({ mediaRepository, mediaService }) {
        this.mediaRepository = mediaRepository;
        this.mediaService = mediaService;
    }

    async execute(propertyId, mediaId) {
        const { updated, removed } = await this.mediaRepository.remove(propertyId, mediaId);
        if (!updated) return null;

        // Eliminar archivo del disco si existe key/filename/url
        const key = removed?.key || removed?.filename || removed?.url;
        if (key) {
            await this.mediaService.deleteFile(key);
        }

        return { property: updated, removed };
    }
}
