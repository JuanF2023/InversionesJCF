// server/src/modules/corporativo/domain/users/users.constants.js

export const USER_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
});

export const USER_STATUS_LABELS = Object.freeze({
    active: "Activo",
    inactive: "Inactivo",
});

export const USER_PIN_LENGTHS = Object.freeze([4, 6]);

export const USER_DEFAULT_PAGE = 1;
export const USER_DEFAULT_LIMIT = 50;
export const USER_MAX_LIMIT = 200;