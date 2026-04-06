// server/src/modules/auth/application/use-cases/refresh/refreshSession.usecase.js
import {
    signAccessToken,
    generateRefreshToken,
    getRefreshExpiresAt,
} from "#modules/auth/domain/services/token.service.js";

export function buildRefreshSessionUseCase({
    refreshRepo,
    sessionsRepo,
    usersRepo,
}) {
    return async function refreshSession({ refreshToken, ip, userAgent }) {
        const stored = await refreshRepo.findValidByRawToken(refreshToken);

        if (!stored) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        const session = await sessionsRepo.findById(stored.sessionId);
        if (!session || session.status !== "active") {
            throw new Error("SESSION_INVALID");
        }

        const user = await usersRepo.findById(stored.userId);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        // ROTATION 🔥
        const nextRaw = generateRefreshToken();
        const nextHash = refreshRepo.hashToken(nextRaw);

        await refreshRepo.revokeAndReplace({
            currentHash: stored.tokenHash,
            nextHash,
            ip,
        });

        await refreshRepo.create({
            userId: stored.userId,
            sessionId: stored.sessionId,
            tenantId: stored.tenantId,
            tokenHash: nextHash,
            expiresAt: getRefreshExpiresAt(),
            createdByIp: ip,
            userAgent,
        });

        const accessToken = signAccessToken({
            _id: user._id,
            sessionId: session._id,
            tenantId: stored.tenantId,
            rol: user.rol,
            nombre: user.nombre,
        });

        return {
            token: accessToken,
            refreshToken: nextRaw,
            tenantId: stored.tenantId,
            user,
        };
    };
}