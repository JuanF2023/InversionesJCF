// server/src/core/interface/http/middlewares/cors.middleware.js
import cors from "cors";

/**
 * CORS enterprise — Inversiones JCF
 * Permite headers multi-tenant y sesión.
 */
export function buildCorsMiddleware() {
    const allowOriginsEnv = String(
        process.env.CORS_ORIGIN || "http://localhost:5173"
    ).trim();

    const allowlist = allowOriginsEnv
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    return cors({
        origin(origin, callback) {
            if (!origin) return callback(null, true);

            const isLocal =
                /^http:\/\/localhost:\d+$/i.test(origin) ||
                /^http:\/\/127\.0\.0\.1:\d+$/i.test(origin);

            if (allowlist.includes(origin) || isLocal) {
                return callback(null, true);
            }

            return callback(new Error(`CORS bloqueado para origin: ${origin}`));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-session-token",
            "x-tenant-id",
            "x-device-label",
            "x-request-id",
        ],
        exposedHeaders: ["x-request-id"],
        credentials: false,
        maxAge: 86400,
    });
}

/**
 * Preflight explícito
 */
export function corsPreflightHandler(req, res, next) {
    if (req.method !== "OPTIONS") return next();

    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Vary", "Origin");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-session-token, x-tenant-id, x-device-label, x-request-id"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    return res.sendStatus(204);
}