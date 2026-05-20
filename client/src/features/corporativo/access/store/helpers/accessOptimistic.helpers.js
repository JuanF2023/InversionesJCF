// client/src/features/corporativo/access/store/helpers/accessOptimistic.helpers.js

function cloneValue(value) {
    if (typeof structuredClone === "function") {
        return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value ?? null));
}

export function createAccessUsersSnapshot(state = {}) {
    return {
        items: cloneValue(state.items || []),
        currentItem: cloneValue(state.currentItem || null),
    };
}

export function buildOptimisticMembership(payload = {}, options = {}) {
    const tenant = options.tenants?.find(
        (item) => item.id === String(payload.tenantId || "")
    );

    const role = options.roles?.find(
        (item) => item.id === String(payload.roleId || "")
    );

    return {
        membershipId: `temp-${Date.now()}`,
        tenantId: String(payload.tenantId || ""),
        roleId: String(payload.roleId || ""),
        rolId: String(payload.roleId || ""),
        tenantNombre: payload.tenantNombre || tenant?.nombre || "Actualizando...",
        tenantTipo: payload.tenantTipo || tenant?.tipo || tenant?.tenantType || "",
        roleName: payload.roleName || role?.nombre || "Actualizando...",
        roleKey: payload.roleKey || role?.key || "",
        membershipStatus: payload.status || "active",
        status: payload.status || "active",
        optimistic: true,
    };
}

export function addOrReplaceOptimisticMembership(user = {}, membership = {}) {
    const memberships = Array.isArray(user.memberships) ? user.memberships : [];

    const nextMemberships = memberships.filter(
        (item) =>
            String(item.tenantId || "") !== String(membership.tenantId || "") &&
            String(item.membershipId || "") !== String(membership.membershipId || "")
    );

    return {
        ...user,
        memberships: [...nextMemberships, membership],
        membershipsCount: nextMemberships.length + 1,
    };
}

export function removeOptimisticMembership(user = {}, membershipId) {
    const memberships = Array.isArray(user.memberships) ? user.memberships : [];

    const nextMemberships = memberships.filter(
        (item) => String(item.membershipId || "") !== String(membershipId || "")
    );

    return {
        ...user,
        memberships: nextMemberships,
        membershipsCount: nextMemberships.length,
    };
}
