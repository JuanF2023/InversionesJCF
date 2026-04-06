// server/src/modules/corporativo/application/usecases/add-property-media.usecase.js
export class AddPropertyMediaUsecase {
    constructor({ mediaRepository, mediaService }) {
        this.mediaRepository = mediaRepository;
        this.mediaService = mediaService;
    }

    async execute(propertyId, file) {
        if (!file) {
            const err = new Error("Archivo requerido.");
            err.statusCode = 400;
            throw err;
        }

        const uploaded = await this.mediaService.uploadFile(file);

        const mediaItem = {
            kind: file.mimetype?.startsWith("image/") ? "image" : "file",
            url: uploaded.url,
            key: uploaded.key,
            filename: uploaded.filename,
            name: file.originalname || uploaded.filename,
            size: file.size || 0,
            mime: file.mimetype || "",
            createdAt: new Date(),
        };

        const updated = await this.mediaRepository.add(propertyId, mediaItem);
        if (!updated) return null;

        return { media: mediaItem, property: updated };
    }
}
