// server/src/modules/corporativo/application/usecases/list-property-media.usecase.js
export class ListPropertyMediaUsecase {
    constructor({ mediaRepository }) {
        this.mediaRepository = mediaRepository;
    }

    async execute(propertyId) {
        const items = await this.mediaRepository.list(propertyId);
        if (!items) return null;
        return { items };
    }
}
