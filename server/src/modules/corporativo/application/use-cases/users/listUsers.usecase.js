// server/src/modules/corporativo/application/use-cases/users/listUsers.usecase.js
import usersRepositoryMongo from "#modules/corporativo/infrastructure/repositories/users.repository.mongo.js";

/**
 * Lista usuarios corporativos desde MongoDB con memberships, roles y tenants resueltos.
 */
export async function listUsersUseCase(params = {}) {
    const result = await usersRepositoryMongo.list({
        q: params.q,
        estado: params.estado,
        tenantKey: params.tenantKey,
        roleKey: params.roleKey,
        page: params.page,
        limit: params.limit,
    });

    return {
        ok: true,
        data: result,
    };
}