// server/src/modules/auth/interface/http/controllers/verify.controller.js
import { verifySession } from "#modules/auth/application/services/auth.service.js";


/**
 * Extrae el token de la request.
 * - Primero x-session-token
 * - Luego Authorization: Bearer xxx
 */
function extractTokenFromRequest(req) {
    const headerToken = req.headers["x-session-token"];
    if (headerToken && typeof headerToken === "string") {
        return headerToken.trim();
    }

    const authHeader = req.headers["authorization"] || "";
    if (!authHeader) return null;

    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7).trim();
    }

    return authHeader.trim();
}

export async function verifyAuthHandler(req, res) {
    try {
        const token = extractTokenFromRequest(req);

        if (!token) {
            return res
                .status(401)
                .json({ ok: false, error: "Token requerido", code: "TOKEN_REQUIRED" });
        }

        const out = await verifySessionService({
            token,
            touchActivity: true,
        });

        return res
            .status(out.status)
            .json(out.ok ? out.data : { ok: false, error: out.error, code: out.code });
    } catch (err) {
        console.error("[verifyAuthHandler] error:", err);
        return res
            .status(500)
            .json({ ok: false, error: "Internal Server Error", code: "UNEXPECTED" });
    }
}
