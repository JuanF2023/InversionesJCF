// server/src/modules/auth/application/services/jwt.service.js
import jwt from "jsonwebtoken";

/**
 * Emite un JWT firmado (HS256) con expiración configurable.
 * @param {object} payload
 * @param {{ expiresIn: number }} opts
 */
export async function signJwt(payload, { expiresIn = 3600 } = {}) {
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
}

/**
 * Verifica/decodifica un JWT.
 * @returns {object} payload
 * @throws si el token es inválido/expirado
 */
export async function verifyJwt(token) {
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    return jwt.verify(token, secret, { algorithms: ["HS256"] });
}
