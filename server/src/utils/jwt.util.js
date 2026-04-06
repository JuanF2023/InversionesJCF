// server/src/utils/jwt.util.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

/**
 * Firma un JWT con expiración fija de 8 horas
 * payload: { sub, email, displayName, roles, permissions }
 */
export function signJwt(payload = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: "10h" });
}

/**
 * (Opcional) Verificar un token (útil para /me o middlewares)
 */
export function verifyJwt(token = "") {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
