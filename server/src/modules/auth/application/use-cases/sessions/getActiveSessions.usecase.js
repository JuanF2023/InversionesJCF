// server/src/modules/auth/application/use-cases/sessions/getActiveSessions.usecase.js
import { buildSessionsRepository } from "../../builders/sessions.builder.js";

/**
 * Caso de uso: obtener sesiones activas visibles para la UI.
 *
 * Contrato:
 * - status: estado funcional para UI
 * - statusCode: código HTTP
 */
export async function getActiveSessionsUseCase({ tenantId = null } = {}) {
  const repository = buildSessionsRepository();

  const normalizedTenantId =
    typeof tenantId === "string" && tenantId.trim()
      ? tenantId.trim()
      : null;

  const result = await repository.listActiveSessions(
    normalizedTenantId ? { tenantId: normalizedTenantId } : {}
  );

  const items = Array.isArray(result?.items)
    ? result.items
    : Array.isArray(result)
      ? result
      : [];

  const stale = Boolean(result?.stale);

  return {
    ok: true,
    statusCode: 200,
    data: {
      status: items.length > 0 ? "online" : "empty",
      items,
      stale,
      refreshedAt: new Date().toISOString(),
    },
  };
}

export default getActiveSessionsUseCase;