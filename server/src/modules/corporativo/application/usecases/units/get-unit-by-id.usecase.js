// server/src/modules/corporativo/application/usecases/units/get-unit-by-id.usecase.js

/**
 * Use case: Obtener unidad por ID
 * - Requiere un repositorio con getById(id)
 */
export class GetUnitByIdUseCase {
  /**
   * @param {{ unitsRepository: { getById: Function } }} deps
   */
  constructor({ unitsRepository }) {
    this.unitsRepository = unitsRepository;
  }

  /**
   * @param {string} id
   * @returns {Promise<any|null>}
   */
  async execute(id) {
    const key = String(id || "").trim();
    if (!key) return null;
    return this.unitsRepository.getById(key);
  }
}

export default GetUnitByIdUseCase;
