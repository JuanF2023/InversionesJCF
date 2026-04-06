// client/src/components/security/SessionWatcher.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { loadSession, clearSession, isTokenValid, getTokenExpiration } from "@/core/utils/authSession.js";

/**
 * SessionWatcher (enterprise)
 * - Observa expiración del JWT (exp)
 * - Si expira o es inválido, limpia sesión y redirige a /login
 * - No hace requests: solo control UI
 *
 * Nota importante:
 * - NO hacemos logout por inactividad aquí (eso es UI-only y lo maneja useIdleLogout).
 * - NO forzamos logout por "tenantId vacío" porque el tenant puede resolverse por selección o por backend.
 */
export default function SessionWatcher() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Tick liviano para reevaluar sesión aunque no cambie la ruta (evita bug de depender de pathname).
    const [tick, setTick] = useState(0);
    const lastRedirectRef = useRef(0);

    useEffect(() => {
        const id = setInterval(() => setTick((t) => (t + 1) % 10_000), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        // En /login no molestamos
        if (pathname.startsWith("/login")) return;

        const s = loadSession() || {};
        const token = typeof s?.token === "string" ? s.token.trim() : "";
        const expiresAtLocal = typeof s?.expiresAt === "number" ? s.expiresAt : null;

        // Sin token -> fuera (pero SIN loops)
        if (!token) {
            try {
                clearSession();
            } finally {
                navigate("/login", { replace: true, state: { from: { pathname } } });
            }
            return;
        }

        // Token inválido -> fuera
        if (!isTokenValid(token)) {
            try {
                clearSession();
            } finally {
                navigate("/login", { replace: true, state: { from: { pathname } } });
            }
            return;
        }

        // Expiración efectiva: preferimos JWT exp; si no existe, usamos expiresAt local si existe
        const expJwt = getTokenExpiration(token);
        const effectiveExpiresAt = expJwt ?? expiresAtLocal;

        // Si no hay exp, no inventamos logout (legacy tokens)
        if (!effectiveExpiresAt) return;

        const msLeft = effectiveExpiresAt - Date.now();
        if (msLeft <= 0) {
            // Evita doble redirect en el mismo segundo por re-renders
            const now = Date.now();
            if (now - lastRedirectRef.current < 800) return;
            lastRedirectRef.current = now;

            try {
                clearSession();
            } finally {
                navigate("/login", { replace: true, state: { from: { pathname } } });
            }
            return;
        }

        // Programar logout exacto en expiración
        const timer = setTimeout(() => {
            try {
                clearSession();
            } finally {
                navigate("/login", { replace: true, state: { from: { pathname } } });
            }
        }, msLeft);

        return () => clearTimeout(timer);
    }, [pathname, navigate, tick]);

    return null;
}
