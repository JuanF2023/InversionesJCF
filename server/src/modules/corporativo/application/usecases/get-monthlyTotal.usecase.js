// server/src/modules/corporativo/application/usecases/get-monthlyTotal.usecase.js

/**
 * Use case: Obtener total mensual (producci¨®n)
 * Clean Architecture:
 * - NO importa infraestructura.
 * - Recibe monthlyProductionRepository por inyecci¨®n.
 */
export class GetMonthlyTotalUsecase {
  /**
   * @param {{ monthlyProductionRepository: { getMonthlyTotal: Function } }} deps
   */
  constructor({ monthlyProductionRepository }) {
    if (!monthlyProductionRepository) {
      throw new Error("GetMonthlyTotalUsecase requiere monthlyProductionRepository");
    }
    this.monthlyProductionRepository = monthlyProductionRepository;
  }

  /**
   * @param {{ from?: string, to?: string, businessId?: string, propertyId?: string }} [params]
   */
  async execute(params = {}) {
    return this.monthlyProductionRepository.getMonthlyTotal(params);
  }
}
