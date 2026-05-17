// client/src/features/corporativo/access/components/user-detail/utils/userDetail.utils.js

export const EMPTY_VALUE = "N/A";

export function safeText(value, fallback = EMPTY_VALUE) {
    if (value == null) return fallback;

    const text = String(value).trim();

    return text || fallback;
}

export function formatDate(value, fallback = EMPTY_VALUE) {
    if (!value) return fallback;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    return new Intl.DateTimeFormat("es-SV", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export function yesNo(value) {
    return value ? "Sí" : "No";
}

export function formatSystemLabel(value, fallback = EMPTY_VALUE) {
    if (value == null) return fallback;

    const text = String(value)
        .trim()
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .toLowerCase();

    if (!text) return fallback;

    return text
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function formatStatusLabel(value, fallback = EMPTY_VALUE) {
    const normalized = String(value ? "").trim().toLowerCase();

    const labels = {
        active: "Activo",
        inactive: "Inactivo",
        pending: "Pendiente",
        suspended: "Suspendido",
        unknown: "Desconocido",
    };

    return labels[normalized] || formatSystemLabel(value, fallback);
}

export function getUserMemberships(user) {
    if (!Array.isArray(user?.memberships)) {
        return [];
    }

    return user.memberships.filter(
        (membership) => membership?.membershipStatus !== "inactive"
    );
}

export function getUserInitials(name = "") {
    const parts = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "U";
    }

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

export function getMembershipKey(membership, index) {
    return (
        membership?.membershipId ||
        `${membership?.tenantId || "tenant"}-${membership?.roleId || "role"}-${index}`
    );
}
