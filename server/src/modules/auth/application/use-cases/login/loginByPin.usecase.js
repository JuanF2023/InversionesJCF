// server/src/modules/auth/application/use-cases/login/loginByPin.usecase.js
import { buildAuthService } from "#modules/auth/application/builders/auth.builder.js";

/**
 * Caso de uso: login por PIN (enterprise)
 * - Soporta multi-tenant: si viene tenantId, se envía al AuthService.
 * - intent: "enter" | "continue" | "validate_only"
 */
export async function loginByPinUseCase({ pin, intent = "enter", tenantId = null, device = "web" }) {
    const authService = buildAuthService();

    return authService.loginByPin({
        pin,
        intent,
        tenantId, // ✅ CLAVE: ya no se pierde
        device,
    });
}