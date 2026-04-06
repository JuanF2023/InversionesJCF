// server/src/modules/corporativo/application/usecases/units/update-unit.usecase.js

import slugify from "slugify";

/**
 * Actualizar una unidad existente
 */
export class UpdateUnitUseCase {
    constructor({ unitsRepository }) {
        this.unitsRepository = unitsRepository;
    }

    async execute({ id, nombre, abreviatura, tipo, activo, actorId }) {
        const patch = {
            updatedBy: actorId ?? null,
        };

        if (typeof nombre === "string" && nombre.trim()) {
            patch.nombre = nombre.trim();
            patch.slug = slugify(nombre, { lower: true, strict: true });
        }

        if (typeof abreviatura === "string") {
            patch.abreviatura = abreviatura.trim();
        }

        if (typeof tipo === "string") patch.tipo = tipo;
        if (typeof activo === "boolean") patch.activo = activo;

        const updated = await this.unitsRepository.updateById(id, patch);

        if (!updated) {
            const err = new Error("Unidad no encontrada.");
            err.status = 404;
            throw err;
        }

        return updated;
    }
}
