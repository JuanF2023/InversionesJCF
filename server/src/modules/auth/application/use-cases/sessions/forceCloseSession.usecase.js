// server/src/modules/auth/application/use-cases/sessions/forceCloseSession.usecase.js
import { buildAuthService } from "#modules/auth/application/builders/auth.builder.js";

/**
 * Caso de uso: cierre forzado de sesión.
 * Orquesta la acción de aplicación y delega al AuthService.
 */
export async function forceCloseSessionUseCase({
  sessionId = null,
  token = null,
  tenantId = null,
} = {}) {
  const authService = buildAuthService();

  if (typeof authService.forceCloseSession !== "function") {
    throw new Error(
      "[forceCloseSessionUseCase] AuthService no implementa forceCloseSession."
    );
  }

  return authService.forceCloseSession({
    sessionId,
    token,
    tenantId,
  });
}