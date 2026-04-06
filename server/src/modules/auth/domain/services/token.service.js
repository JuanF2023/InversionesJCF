// server/src/modules/auth/domain/services/token.service.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

export function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
}

export function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

export function getRefreshExpiresAt() {
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}