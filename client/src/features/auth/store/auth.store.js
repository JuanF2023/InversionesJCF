// client/src/features/auth/store/auth.store.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
    saveSession,
    loadSession,
    clearSession,
    isTokenValid,
    getTokenExpiration,
    resolveHomePath,
} from "@/core/utils/authSession.js";

import {
    loginByPin,
    verifySession,
    getActiveSessionsStatus,
    forceCloseSession,
} from "@/features/auth/api/auth.api.js";

/* -------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------- */

const safeStr = (v) => String(v ?? "").trim();

function normalizeUser(user) {
    if (!user) return null;

    const rolesArr = Array.isArray(user.roles) ? user.roles : [];
    const primary = rolesArr[0] || {};

    return {
        ...user,
        roleSlug: user.roleSlug || primary.slug || null,
        roleName: user.roleName || primary.name || null,
        roleLevel:
            user.roleLevel ??
            (typeof primary.level === "number" ? primary.level : null),
    };
}

function deriveExpiresAt(token, fallback) {
    const exp = getTokenExpiration(token);
    if (Number.isFinite(exp)) return exp;
    if (Number.isFinite(fallback)) return fallback;
    return null;
}

function normalizeTenantOption(item = {}) {
    return {
        id: item?.id || item?._id || item?.tenantId || item?.value || null,
        nombre:
            item?.nombre ||
            item?.name ||
            item?.label ||
            item?.title ||
            "Tenant",
        tipo: item?.tipo || item?.tenantTipo || item?.type || "",
        raw: item,
    };
}

function emptySession() {
    return {
        token: null,
        user: null,
        expiresAt: null,
        tenantId: null,
        sessionId: null,
    };
}

function emptyTenantSelection() {
    return {
        required: false,
        pin: "",
        intent: "enter",
        options: [],
    };
}

/* -------------------------------------------------- */
/* Store */
/* -------------------------------------------------- */

export const useAuthStore = create(
    devtools((set, get) => ({
        session: loadSession() || emptySession(),
        status: "idle",
        error: null,

        tenantSelection: emptyTenantSelection(),

        active: {
            status: "idle",
            items: [],
        },

        isAuthenticated() {
            const s = get().session;
            return Boolean(s?.token && s?.user && isTokenValid(s.token));
        },

        hydrate() {
            const sess = loadSession();

            if (!sess?.token || !isTokenValid(sess.token)) {
                set({ session: emptySession(), status: "unauthenticated" });
                return;
            }

            set({ session: sess, status: "authenticated" });
        },

        async login(pin, intent = "enter", tenantId = null) {
            const cleanPin = safeStr(pin);

            set({ status: "loading", error: null });

            try {
                const resp = await loginByPin(cleanPin, intent, tenantId);
                const data = resp?.data || resp;

                if (data?.ok === false && data?.code === "TENANT_AMBIGUOUS") {
                    const options = (data?.tenants || []).map(normalizeTenantOption);

                    set({
                        status: "tenant_required",
                        tenantSelection: {
                            required: true,
                            pin: cleanPin,
                            intent,
                            options,
                        },
                    });

                    return {
                        requiresTenantSelection: true,
                        options,
                    };
                }

                const token = safeStr(data?.token);
                const user = normalizeUser(data?.user);

                if (!token || !user) {
                    throw new Error("Respuesta inv芍lida del servidor.");
                }

                const tenantIdFinal =
                    data?.tenantId || data?.context?.tenantId || tenantId || null;

                const expiresAt = deriveExpiresAt(token, data?.expiresAt);

                const sessionId =
                    data?.sessionId ||
                    data?.session?._id ||
                    data?.session?.id ||
                    data?.session?.sessionId ||
                    null;

                const session = {
                    token,
                    user,
                    tenantId: tenantIdFinal,
                    expiresAt,
                    sessionId,
                };

                saveSession(session);

                set({
                    session,
                    status: "authenticated",
                    tenantSelection: emptyTenantSelection(),
                });

                const homePath = resolveHomePath(user) || "/corporativo";

                return {
                    session,
                    tenantId: tenantIdFinal,
                    homePath,
                };
            } catch (e) {
                set({
                    status: "error",
                    error: e?.message || "Error en login",
                });

                throw e;
            }
        },

        async verify() {
            try {
                const resp = await verifySession();
                return resp;
            } catch (e) {
                get().logout({ callBackend: false, forceLocal: true });
                throw e;
            }
        },

        /**
         * Logout enterprise:
         * - Intenta cerrar sesi車n en backend por sessionId/token.
         * - Si backend falla y no se permite forceLocal, conserva sesi車n local y expone error.
         * - Solo limpia local autom芍ticamente cuando backend confirm車 o cuando forceLocal=true.
         */
        async logout({ callBackend = true, forceLocal = false } = {}) {
            const current = loadSession() || get().session || {};
            const sessionId = current?.sessionId || null;
            const token = current?.token || null;
            const tenantId = current?.tenantId || null;

            set({ status: "logging_out", error: null });

            if (!callBackend) {
                clearSession();
                set({
                    session: emptySession(),
                    status: "unauthenticated",
                    error: null,
                });
                return { ok: true, localOnly: true };
            }

            try {
                await forceCloseSession({
                    sessionId,
                    token,
                    tenantId,
                });

                clearSession();

                set({
                    session: emptySession(),
                    status: "unauthenticated",
                    error: null,
                });

                return { ok: true };
            } catch (error) {
                if (forceLocal) {
                    clearSession();

                    set({
                        session: emptySession(),
                        status: "unauthenticated",
                        error: error?.message || "No se pudo cerrar sesi車n en servidor.",
                    });

                    return {
                        ok: false,
                        forcedLocal: true,
                        error,
                    };
                }

                set({
                    status: "authenticated",
                    error: error?.message || "No se pudo cerrar sesi車n en servidor.",
                });

                throw error;
            }
        },

        async refreshActiveSessions() {
            try {
                const resp = await getActiveSessionsStatus();
                const data = resp?.data || resp;
                const items = Array.isArray(data?.items) ? data.items : [];

                set({
                    active: {
                        status: items.length ? "online" : "empty",
                        items,
                    },
                });
            } catch {
                set({
                    active: {
                        status: "offline",
                        items: [],
                    },
                });
            }
        },
    }))
);
