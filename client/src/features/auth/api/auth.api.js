// client/src/features/auth/api/auth.api.js
import http from "@/core/http/HttpClient.js";

/**
 * API de autenticación (PIN)
 * Firma alineada al store:
 * login(pin, intent, tenantId)
 */

export async function loginWithPin(pin, intent = "enter", tenantId = null) {
    try {
        const payload = {
            pin: String(pin ?? "").trim(),
            intent,
            ...(tenantId ? { tenantId } : {}),
        };

        const res = await http.post("/auth/pin", payload);
        return res.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

// Alias para compatibilidad con el store
export const loginByPin = loginWithPin;

/* -------------------------------------------------- */
/* Session / Auth                                     */
/* -------------------------------------------------- */

export async function verifySession() {
    try {
        const res = await http.get("/auth/verify");
        return res.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

export async function getActiveSessionsStatus() {
    try {
        const res = await http.get("/sessions/active-status");
        return res.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

/* -------------------------------------------------- */
/* Break (Receso)                                     */
/* -------------------------------------------------- */

export async function startBreak() {
    try {
        const res = await http.post("/sessions/break/start");
        return res.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

export async function stopBreak() {
    try {
        const res = await http.post("/sessions/break/stop");
        return res.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

/* -------------------------------------------------- */
/* Logout / Close session                             */
/* -------------------------------------------------- */

export async function forceCloseSession(payload = {}) {
    try {
        const res = await http.post("/sessions/close", payload);
        return res.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

/* -------------------------------------------------- */
/* Error normalizer                                   */
/* -------------------------------------------------- */

function normalizeError(err) {
    return {
        message: err?.message || "Error desconocido",
        status: err?.response?.status || err?.status,
        data: err?.response?.data || err?.data,
    };
}
