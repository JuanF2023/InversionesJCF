// client/src/features/corporativo/access/store/accessUsers.store.js
import { create } from "zustand";

import {
    listUsers,
    getUserById,
    getUserActivity,
    createUser,
    updateUser,
    deleteUser,
} from "@/features/corporativo/access/api/users.api.js";

const EMPTY_VALUE = "N/A";

const asArray = (value) => (Array.isArray(value) ? value : []);

function safeString(value) {
    if (value == null) return "";

    if (typeof value === "string") return value.trim();

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value).trim();
    }

    return "";
}

function unwrapResponse(response) {
    return response?.data || response;
}

function textFromUnknown(value, fallback = "") {
    if (value == null) return fallback;

    if (typeof value === "string") {
        const text = value.trim();
        return text || fallback;
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value).trim() || fallback;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const text = textFromUnknown(item, "");
            if (text) return text;
        }

        return fallback;
    }

    if (typeof value === "object") {
        const candidates = [
            value.name,
            value.nombre,
            value.label,
            value.title,
            value.displayName,
            value.key,
            value.slug,
            value.descripcion,
            value.description,
            value.value,
        ];

        for (const candidate of candidates) {
            const text = textFromUnknown(candidate, "");
            if (text) return text;
        }
    }

    return fallback;
}

function normalizeBooleanActivo(item = {}) {
    if (typeof item.activo === "boolean") return item.activo;

    const normalized = safeString(item.estado || item.status).toLowerCase();

    if (["active", "activo", "activa"].includes(normalized)) return true;
    if (["inactive", "inactivo", "inactiva"].includes(normalized)) return false;

    return false;
}

function normalizeMembership(item = {}) {
    return {
        ...item,
        membershipId: safeString(item.membershipId || item._id),
        tenantId: safeString(item.tenantId),
        tenantKey: safeString(item.tenantKey),
        tenantNombre: textFromUnknown(item.tenantNombre, "Sin tenant"),
        tenantTipo: safeString(item.tenantTipo || item.tenantType || item.tipo),
        roleId: safeString(item.roleId || item.rolId),
        rolId: safeString(item.rolId || item.roleId),
        roleKey: safeString(item.roleKey),
        roleName: textFromUnknown(item.roleName, "Sin rol"),
        roleTenantType: safeString(item.roleTenantType),
        membershipStatus: safeString(
            item.membershipStatus || item.status || "unknown"
        ),
        assignedAt: item.assignedAt || item.createdAt || null,
        updatedAt: item.updatedAt || null,
        expiresAt: item.expiresAt || null,
        metadata:
            item.metadata && typeof item.metadata === "object"
                ? item.metadata
                : {},
        createdBy: safeString(item.createdBy),
        updatedBy: safeString(item.updatedBy),
    };
}

function normalizeMemberships(items = []) {
    return asArray(items)
        .map(normalizeMembership)
        .sort((a, b) => {
            const aActive = a.membershipStatus === "active" ? 0 : 1;
            const bActive = b.membershipStatus === "active" ? 0 : 1;

            return aActive - bActive;
        });
}

function resolvePrimaryAccess(item = {}, memberships = []) {
    if (item.accesoPrincipal && typeof item.accesoPrincipal === "object") {
        return {
            tenantNombre: textFromUnknown(
                item.accesoPrincipal.tenantNombre,
                EMPTY_VALUE
            ),
            tenantTipo: safeString(item.accesoPrincipal.tenantTipo),
            roleName: textFromUnknown(item.accesoPrincipal.roleName, EMPTY_VALUE),
            membershipStatus: safeString(
                item.accesoPrincipal.membershipStatus || EMPTY_VALUE
            ),
        };
    }

    const activeMembership =
        memberships.find(
            (membership) => membership.membershipStatus === "active"
        ) ||
        memberships[0] ||
        null;

    if (!activeMembership) {
        return {
            tenantNombre: EMPTY_VALUE,
            tenantTipo: EMPTY_VALUE,
            roleName: EMPTY_VALUE,
            membershipStatus: EMPTY_VALUE,
        };
    }

    return {
        tenantNombre: activeMembership.tenantNombre || EMPTY_VALUE,
        tenantTipo: activeMembership.tenantTipo || EMPTY_VALUE,
        roleName: activeMembership.roleName || EMPTY_VALUE,
        membershipStatus: activeMembership.membershipStatus || EMPTY_VALUE,
    };
}

function resolveActivity(item = {}) {
    const actividad =
        item.actividad && typeof item.actividad === "object"
            ? item.actividad
            : {};

    return {
        ultimoAcceso:
            actividad.ultimoAcceso || item.lastLoginAt || item.ultimoAcceso || null,
        ultimaIp: safeString(actividad.ultimaIp || item.lastLoginIp),
        ultimoDispositivo: safeString(
            actividad.ultimoDispositivo || item.lastLoginUserAgent
        ),
        createdAt: actividad.createdAt || item.createdAt || null,
        updatedAt: actividad.updatedAt || item.updatedAt || null,
    };
}

function resolveSecurity(item = {}) {
    const security =
        item.security && typeof item.security === "object" ? item.security : {};

    const pinLength =
        typeof security.pinLength !== "undefined"
            ? security.pinLength
            : item.pinLength;

    return {
        hasPin:
            typeof security.hasPin === "boolean"
                ? security.hasPin
                : Number(pinLength || 0) > 0,
        pinLength: pinLength || null,
        pinChangedAt: security.pinChangedAt || item.pinChangedAt || null,
        failedPinAttempts:
            typeof security.failedPinAttempts !== "undefined"
                ? security.failedPinAttempts
                : item.failedPinAttempts ?? 0,
        lockedUntil: security.lockedUntil || item.lockedUntil || null,
        mustChangePin:
            typeof security.mustChangePin === "boolean"
                ? security.mustChangePin
                : Boolean(item.mustChangePin),
    };
}

function resolveAudit(item = {}) {
    const auditoria =
        item.auditoria && typeof item.auditoria === "object"
            ? item.auditoria
            : {};

    return {
        createdBy: textFromUnknown(
            auditoria.createdBy || item.createdBy,
            EMPTY_VALUE
        ),
        updatedBy: textFromUnknown(
            auditoria.updatedBy || item.updatedBy,
            EMPTY_VALUE
        ),
        createdAt: auditoria.createdAt || item.createdAt || null,
        updatedAt: auditoria.updatedAt || item.updatedAt || null,
    };
}

function normalizeActivityEvent(item = {}) {
    return {
        id: safeString(item.id || item._id),
        type: safeString(item.type || "SESSION"),
        title: textFromUnknown(item.title, "Evento de actividad"),
        status: safeString(item.status || "UNKNOWN"),
        startedAt: item.startedAt || null,
        lastActiveAt: item.lastActiveAt || null,
        closedAt: item.closedAt || null,
        expiresAt: item.expiresAt || null,
        deviceLabel: textFromUnknown(item.deviceLabel, "web"),
        ipAddress: safeString(item.ipAddress),
        userAgent: safeString(item.userAgent),
        closedReason: safeString(item.closedReason),
        closeSource: safeString(item.closeSource),
        tenantId: safeString(item.tenantId),
        membershipId: safeString(item.membershipId),
        createdAt: item.createdAt || null,
        updatedAt: item.updatedAt || null,
    };
}

function normalizeActivityHistory(response = {}) {
    const payload = unwrapResponse(response);

    return {
        items: asArray(payload?.items).map(normalizeActivityEvent),
        total: Number(payload?.total || 0),
    };
}

function normalizeUser(item = {}) {
    const memberships = normalizeMemberships(item.memberships);

    const roleName = textFromUnknown(item.roleName, "Sin rol");
    const roleKey = textFromUnknown(item.roleKey, "");
    const tenantNombre = textFromUnknown(item.tenantNombre, "Sin tenant");
    const tenantKey = textFromUnknown(item.tenantKey, "");
    const tenantTipo = textFromUnknown(item.tenantTipo, "");
    const membershipStatus = textFromUnknown(item.membershipStatus, "");
    const nombre = textFromUnknown(item.nombre, "");
    const email = textFromUnknown(item.email, "");
    const activo = normalizeBooleanActivo(item);

    return {
        ...item,
        id: safeString(item.id || item._id || item.mongoId),
        nombre,
        email,
        activo,
        estado: safeString(item.estado || (activo ? "Activo" : "Inactivo")),

        tenantId: safeString(item.tenantId),
        tenantKey,
        tenantNombre,
        tenantTipo,

        rolId: safeString(item.rolId || item.roleId),
        roleKey,
        roleName,

        ultimoAcceso: item.ultimoAcceso || item.lastLoginAt || null,
        membershipStatus,

        memberships,
        membershipsCount:
            typeof item.membershipsCount !== "undefined"
                ? Number(item.membershipsCount || 0)
                : memberships.length,

        accesoPrincipal: resolvePrimaryAccess(item, memberships),
        actividad: resolveActivity(item),
        security: resolveSecurity(item),
        auditoria: resolveAudit(item),
    };
}

export const useAccessUsersStore = create((set, get) => ({
    items: [],
    total: 0,
    page: 1,
    limit: 50,
    loading: false,
    saving: false,
    error: null,
    loaded: false,
    currentItem: null,

    activityHistory: [],
    activityTotal: 0,
    activityLoading: false,

    lastParams: {
        q: "",
        estado: "",
        tenantKey: "",
        roleKey: "",
        page: 1,
        limit: 50,
    },

    async cargar(params = {}) {
        const nextParams = {
            ...get().lastParams,
            ...params,
        };

        set({
            loading: true,
            error: null,
            lastParams: nextParams,
        });

        try {
            const response = await listUsers(nextParams);
            const payload = unwrapResponse(response);
            const items = asArray(payload?.items).map(normalizeUser);

            set({
                items,
                total: Number(payload?.total || 0),
                page: Number(payload?.page || nextParams.page || 1),
                limit: Number(payload?.limit || nextParams.limit || 50),
                loading: false,
                loaded: true,
            });

            return items;
        } catch (error) {
            set({
                loading: false,
                error: error?.message || "Error cargando usuarios",
            });

            throw error;
        }
    },

    async obtenerPorId(id) {
        set({
            loading: true,
            error: null,
            currentItem: null,
            activityHistory: [],
            activityTotal: 0,
            activityLoading: false,
        });

        try {
            const response = await getUserById(id);
            const payload = unwrapResponse(response);
            const item = normalizeUser(payload?.item || payload);

            set({
                loading: false,
                currentItem: item,
            });

            return item;
        } catch (error) {
            set({
                loading: false,
                error: error?.message || "Error cargando usuario",
            });

            throw error;
        }
    },

    async cargarActividadUsuario(id, params = {}) {
        set({
            activityLoading: true,
            error: null,
        });

        try {
            const response = await getUserActivity(id, {
                limit: params.limit || 25,
            });

            const history = normalizeActivityHistory(response);

            set({
                activityHistory: history.items,
                activityTotal: history.total,
                activityLoading: false,
            });

            return history;
        } catch (error) {
            set({
                activityHistory: [],
                activityTotal: 0,
                activityLoading: false,
                error: error?.message || "Error cargando actividad del usuario",
            });

            throw error;
        }
    },

    limpiarActual() {
        set({
            currentItem: null,
            activityHistory: [],
            activityTotal: 0,
            activityLoading: false,
        });
    },

    async crear(payload) {
        set({
            saving: true,
            error: null,
        });

        try {
            const response = await createUser(payload);
            const responsePayload = unwrapResponse(response);
            const created = normalizeUser(responsePayload?.item || responsePayload);

            set((state) => ({
                saving: false,
                items: [created, ...state.items],
                total: state.total + 1,
            }));

            return created;
        } catch (error) {
            set({
                saving: false,
                error: error?.message || "Error creando usuario",
            });

            throw error;
        }
    },

    async actualizar(id, payload) {
        set({
            saving: true,
            error: null,
        });

        try {
            const response = await updateUser(id, payload);
            const responsePayload = unwrapResponse(response);
            const updated = normalizeUser(responsePayload?.item || responsePayload);

            set((state) => ({
                saving: false,
                currentItem: updated,
                items: state.items.map((item) =>
                    item.id === updated.id ? updated : item
                ),
            }));

            return updated;
        } catch (error) {
            set({
                saving: false,
                error: error?.message || "Error actualizando usuario",
            });

            throw error;
        }
    },

    async eliminar(id) {
        set({
            saving: true,
            error: null,
        });

        try {
            await deleteUser(id);

            set((state) => ({
                saving: false,
                items: state.items.filter((item) => item.id !== String(id)),
                total: Math.max(0, state.total - 1),
            }));

            return true;
        } catch (error) {
            set({
                saving: false,
                error: error?.message || "Error eliminando usuario",
            });

            throw error;
        }
    },
}));
