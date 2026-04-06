// server/src/modules/corporativo/application/usecases/units/create-unit.usecase.js

import slugify from "slugify";

/**
 * Crear una nueva unidad
 */
export class CreateUnitUseCase {
    constructor({ unitsRepository }) {
        this.unitsRepository = unitsRepository;
    }

    async execute({ nombre, abreviatura, tipo = "unidad", tenantId, actorId }) {
        if (!nombre?.trim()) {
            const err = new Error("El campo 'nombre' es requerido.");
            err.status = 400;
            throw err;
        }

        const data = {
            nombre: nombre.trim(),
            slug: slugify(nombre, { lower: true, strict: true }),
            abreviatura: abreviatura?.trim() || "",
            tipo,
            activo: true,
            tenantId: tenantId ?? null,
            createdBy: actorId ?? null,
            updatedBy: actorId ?? null,
        };

        return this.unitsRepository.create(data);
    }
}
