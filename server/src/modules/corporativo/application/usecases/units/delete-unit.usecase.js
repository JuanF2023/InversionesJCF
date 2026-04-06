// server/src/modules/corporativo/application/usecases/units/delete-unit.usecase.js

/**
 * Eliminación lógica de unidad
 */
export class DeleteUnitUseCase {
    constructor({ unitsRepository }) {
        this.unitsRepository = unitsRepository;
    }

    async execute({ id, actorId }) {
        const updated = await this.unitsRepository.updateById(id, {
            activo: false,
            updatedBy: actorId ?? null,
        });

        if (!updated) {
            const err = new Error("Unidad no encontrada.");
            err.status = 404;
            throw err;
        }

        return true;
    }
}
