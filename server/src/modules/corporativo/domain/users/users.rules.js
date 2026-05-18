// server/src/modules/corporativo/domain/users/users.rules.js

import {
    USER_DEFAULT_LIMIT,
    USER_DEFAULT_PAGE,
    USER_MAX_LIMIT,
    USER_PIN_LENGTHS,
    USER_STATUS,
} from "#modules/corporativo/domain/users/users.constants.js";

export function cleanText(value) {
    return String(value ?? "").trim();
}

export function normalizeEmail(value) {
    return cleanText(value).toLowerCase();
}

export function normalizeUserStatusFromActive(value) {
    return value ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
}

export function normalizeActiveFromStatus(value) {
    return cleanText(value).toLowerCase() === USER_STATUS.ACTIVE;
}

export function normalizeUserPagination({ page, limit } = {}) {
    const normalizedPage = Math.max(USER_DEFAULT_PAGE, Number(page) || USER_DEFAULT_PAGE);
    const normalizedLimit = Math.max(
        1,
        Math.min(USER_MAX_LIMIT, Number(limit) || USER_DEFAULT_LIMIT)
    );

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        skip: (normalizedPage - 1) * normalizedLimit,
    };
}

export function validateUserCreatePayload(payload = {}) {
    const nombre = cleanText(payload.nombre);
    const email = normalizeEmail(payload.email);
    const pin = cleanText(payload.pin);

    if (!nombre) {
        throw new Error("Nombre requerido.");
    }

    if (!email) {
        throw new Error("Email requerido.");
    }

    if (!pin) {
        throw new Error("PIN requerido.");
    }

    if (!USER_PIN_LENGTHS.includes(pin.length)) {
        throw new Error("El PIN debe tener 4 o 6 dígitos.");
    }

    return {
        nombre,
        email,
        pin,
        activo: typeof payload.activo === "undefined" ? true : Boolean(payload.activo),
        createdBy: payload.createdBy ?? null,
        updatedBy: payload.updatedBy ?? null,
    };
}

export function normalizeUserUpdatePayload(payload = {}) {
    const patch = {};

    if (typeof payload.nombre !== "undefined") {
        patch.nombre = cleanText(payload.nombre);
    }

    if (typeof payload.email !== "undefined") {
        patch.email = normalizeEmail(payload.email);
    }

    if (typeof payload.pin !== "undefined") {
        const pin = cleanText(payload.pin);

        if (pin && !USER_PIN_LENGTHS.includes(pin.length)) {
            throw new Error("El PIN debe tener 4 o 6 dígitos.");
        }

        if (pin) {
            patch.pin = pin;
        }
    }

    if (typeof payload.activo !== "undefined") {
        patch.activo = Boolean(payload.activo);
    }

    patch.updatedBy = payload.updatedBy ?? null;

    return patch;
}