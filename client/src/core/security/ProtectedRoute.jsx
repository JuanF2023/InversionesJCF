// client/src/core/security/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { loadSession, isTokenValid } from "@/core/utils/authSession.js";

/**
 * ProtectedRoute
 * - Bloquea acceso si no existe una sesi¨®n v¨¢lida persistida.
 * - Usa la misma fuente de verdad del login: authSession.
 */
export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const session = loadSession() || {};

    const hasValidSession = Boolean(
        session?.token &&
        session?.user &&
        isTokenValid(session.token)
    );

    if (!hasValidSession) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
