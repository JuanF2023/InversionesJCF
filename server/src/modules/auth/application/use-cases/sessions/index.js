// server/src/modules/auth/application/use-cases/sessions/index.js
import verifySessionUseCase from "./verifySession.usecase.js";
import getActiveSessionsStatusUseCase from "./getActiveSessionsStatus.usecase.js";
import toggleBreakUseCase from "./toggleBreak.usecase.js";
import forceCloseSessionUseCase from "./forceCloseSession.usecase.js";

/**
 * Barrel (enterprise)
 * - Exporta use-cases consistentes (status numérico + state textual cuando aplica)
 */
export {
  verifySessionUseCase,
  getActiveSessionsStatusUseCase,
  toggleBreakUseCase,
  forceCloseSessionUseCase,
};

export default {
  verifySessionUseCase,
  getActiveSessionsStatusUseCase,
  toggleBreakUseCase,
  forceCloseSessionUseCase,
};
