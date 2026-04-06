// client/src/features/auth/hooks/useLoginFlow.js
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    saveSession,
    setLastTenantId,
    getLastTenantId,
} from "@/core/utils/authSession.js";
import { formatDateShortES, formatHour12 } from "@/core/utils/timefmt.js";
import {
    getActiveSessionsStatus,
    loginWithPin,
} from "@/features/auth/api/auth.api.js";

function normalizeBusinessError(err) {
    return {
        status: err?.status ?? 500,
        code: err?.data?.code || err?.data?.errorCode || null,
        message:
            err?.data?.message ||
            err?.message ||
            "No se pudo completar la operación.",
        data: err?.data || null,
    };
}

function resolveHomePath(payload) {
    const scope = payload?.scope || payload?.module || payload?.tenantType || "";

    if (String(scope).toLowerCase().includes("restaurante")) {
        return "/restaurante";
    }

    return "/corporativo";
}

function normalizeVisibleName(item) {
    const rawName =
        item?.nombre ||
        item?.user?.nombre ||
        item?.fullName ||
        item?.name ||
        item?.username ||
        "";

    const cleanedName = String(rawName || "").trim();

    if (!cleanedName || cleanedName.includes("@")) {
        return "Usuario";
    }

    return cleanedName;
}

function normalizeRole(item) {
    return (
        item?.rol ||
        item?.roleName ||
        item?.role?.name ||
        item?.role?.nombre ||
        item?.membership?.roleName ||
        item?.membership?.role?.name ||
        item?.user?.roleName ||
        item?.user?.role?.name ||
        "Rol no disponible"
    );
}

function normalizeActiveItems(rawItems = []) {
    return rawItems.map((item) => ({
        ...item,
        nombre: normalizeVisibleName(item),
        rol: normalizeRole(item),
    }));
}

export function useLoginFlow({ allowedPinLengths = [4, 6], maxPin = 6 }) {
    const navigate = useNavigate();

    const [pin, setPin] = useState("");
    const [loadingUi, setLoadingUi] = useState(false);

    const [tenantModalOpen, setTenantModalOpen] = useState(false);
    const [tenantOptions, setTenantOptions] = useState([]);
    const [selectedTenantId, setSelectedTenantId] = useState(null);

    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const [active, setActive] = useState({
        status: "idle",
        items: [],
        refreshedAt: null,
    });

    const [conflictMessage, setConflictMessage] = useState("");
    const [lastIntent, setLastIntent] = useState("enter");
    const [tenantRetryAttempted, setTenantRetryAttempted] = useState(false);

    const todayText = useMemo(() => {
        return `${formatDateShortES()} • ${formatHour12()}`;
    }, []);

    const canAttempt = allowedPinLengths.includes(pin.length);
    const canContinue = canAttempt && !loadingUi;

    function resetMessages() {
        setConflictMessage("");
    }

    async function loadActiveSessions() {
        setActive((prev) => ({
            ...prev,
            status: prev.items.length > 0 ? "online" : "loading",
        }));

        try {
            const res = await getActiveSessionsStatus();
            const payload = res?.data || res || {};
            const rawItems = Array.isArray(payload?.items) ? payload.items : [];
            const items = normalizeActiveItems(rawItems);

            setActive({
                status: payload?.status || (items.length > 0 ? "online" : "empty"),
                items,
                refreshedAt: payload?.refreshedAt || new Date().toISOString(),
            });
        } catch (err) {
            console.error("[LoginFlow] Error loading active sessions", err);

            setActive({
                status: "offline",
                items: [],
                refreshedAt: new Date().toISOString(),
            });
        }
    }

    useEffect(() => {
        loadActiveSessions();

        const intervalId = window.setInterval(() => {
            loadActiveSessions();
        }, 20000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    function pushDigit(digit) {
        const normalized = String(digit ?? "").trim();

        if (!/^\d$/.test(normalized)) return;
        if (pin.length >= maxPin) return;

        resetMessages();
        setPin((prev) => prev + normalized);
    }

    function handleClear() {
        setPin("");
        resetMessages();
    }

    function handleBackspace() {
        setPin((prev) => prev.slice(0, -1));
        resetMessages();
    }

    function finalizeLogin(payload) {
        if (!payload) return;

        saveSession(payload);

        if (payload?.tenantId) {
            setLastTenantId(payload.tenantId);
        }

        navigate(resolveHomePath(payload));
    }

    function openTenantPicker(tenants = [], intent = "enter") {
        setTenantOptions(Array.isArray(tenants) ? tenants : []);
        setSelectedTenantId(null);
        setLastIntent(intent);
        setTenantModalOpen(true);
    }

    async function handleTenantAmbiguous(errPayload, intent) {
        const tenants = errPayload?.tenants || errPayload?.data?.tenants || [];
        const lastTenantId = getLastTenantId ? getLastTenantId() : null;

        if (
            !tenantRetryAttempted &&
            lastTenantId &&
            Array.isArray(tenants) &&
            tenants.some(
                (tenant) =>
                    String(tenant?.id || tenant?._id) === String(lastTenantId)
            )
        ) {
            setTenantRetryAttempted(true);
            await executeAuth(intent, lastTenantId);
            return;
        }

        openTenantPicker(tenants, intent);
    }

    async function executeAuth(intent, tenantId = null) {
        if (!canAttempt) return;

        setLoadingUi(true);
        resetMessages();
        setLastIntent(intent);

        try {
            const res = await loginWithPin(pin, intent, tenantId);
            const payload = res?.data || res;

            if (Array.isArray(payload?.tenants) && payload.tenants.length > 1) {
                openTenantPicker(payload.tenants, intent);
                return;
            }

            finalizeLogin(payload);
        } catch (rawError) {
            const err = normalizeBusinessError(rawError);
            console.error(`[LoginFlow] LOGIN ERROR (${intent})`, err);

            if (err.code === "TENANT_AMBIGUOUS") {
                await handleTenantAmbiguous(err.data, intent);
                return;
            }

            if (intent === "continue" && err.code === "NO_ACTIVE_SESSION") {
                setConflictMessage(
                    "No hay una sesión activa para este usuario. Usa Entrar para crear una nueva."
                );
                return;
            }

            if (
                intent === "enter" &&
                (err.code === "SESSION_EXISTS" ||
                    err.code === "SESSION_ALREADY_ACTIVE")
            ) {
                setConflictMessage(
                    "Ya existe una sesión activa para este usuario. Usa Continuar."
                );
                return;
            }

            if (err.code === "SESSION_IN_BREAK") {
                setConflictMessage(
                    "La sesión actual está en receso. Finaliza el receso o continúa la sesión existente."
                );
                return;
            }

            setConflictMessage(
                err.message || "No se pudo completar el inicio de sesión."
            );
        } finally {
            setLoadingUi(false);
        }
    }

    async function handleEntrar() {
        setTenantRetryAttempted(false);
        await executeAuth("enter");
    }

    async function handleContinue() {
        setTenantRetryAttempted(false);
        await executeAuth("continue");
    }

    async function onPickTenant(tenantId) {
        if (!tenantId) return;

        setSelectedTenantId(tenantId);
        setTenantModalOpen(false);

        await executeAuth(lastIntent, tenantId);
    }

    function closeTenantModal() {
        setTenantModalOpen(false);
    }

    function openLogoutModal() {
        setLogoutModalOpen(true);
    }

    function closeLogoutModal() {
        setLogoutModalOpen(false);
    }

    async function confirmLogout() {
        setLogoutLoading(true);

        window.setTimeout(() => {
            setLogoutLoading(false);
            setLogoutModalOpen(false);
            setPin("");
            resetMessages();
        }, 500);
    }

    function handleReceso() {
        console.log("[LoginFlow] Receso action pendiente de integrar");
    }

    return {
        pin,
        loadingUi,
        onBreak: false,
        logoutModalOpen,
        logoutLoading,
        tenantModalOpen,
        tenantOptions,
        selectedTenantId,
        active,
        todayText,
        canContinue,
        canAttempt,
        sessionConflictMessage: conflictMessage,
        pushDigit,
        handleClear,
        handleBackspace,
        handleEntrar,
        handleContinue,
        handleReceso,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout,
        onPickTenant,
        closeTenantModal,
    };
}

export default useLoginFlow;