// server/src/modules/auth/interface/http/controllers/auth-refresh.controller.js
import { buildRefreshSessionUseCase } from "#modules/auth/application/use-cases/refresh/refreshSession.usecase.js";
import RefreshRepo from "#modules/auth/infrastructure/repositories/refresh-tokens.repository.mongo.js";
import SessionsRepo from "#modules/auth/infrastructure/repositories/sessions.repository.mongo.js";
import UsersRepo from "#modules/corporativo/infrastructure/repositories/users.repository.mongo.js";

const refreshUseCase = buildRefreshSessionUseCase({
    refreshRepo: RefreshRepo,
    sessionsRepo: SessionsRepo,
    usersRepo: UsersRepo,
});

export async function refreshTokenController(req, res, next) {
    try {
        const result = await refreshUseCase({
            refreshToken: req.body?.refreshToken,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        res.json({
            ok: true,
            data: result,
        });
    } catch (err) {
        res.status(401).json({
            ok: false,
            error: err.message,
        });
    }
}