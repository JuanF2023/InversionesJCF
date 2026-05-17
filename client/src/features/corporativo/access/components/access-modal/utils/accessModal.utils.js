// client/src/features/corporativo/access/components/access-modal/utils/accessModal.utils.js

export const EMPTY_VALUE = "N/A";

export function normalizeId(value) {
    return String(value || "").trim();
}

export function normalizeType(value) {
    return String(value || "").trim().toLowerCase();
}

export function getUserMemberships(user) {
    if (Array.isArray(user?.memberships)) {
        return user.memberships.filter(
            (membership) => membership?.membershipStatus !== "inactive"
        );
    }

    if (user?.tenantNombre || user?.roleName) {
        return [
            {
                membershipId: `${user?.tenantId || "tenant"}-${user?.rolId || "role"}`,
                tenantId: user?.tenantId,
                roleId: user?.rolId,
                rolId: user?.rolId,
                tenantNombre: user?.tenantNombre,
                tenantTipo: user?.tenantTipo,
                roleName: user?.roleName,
                membershipStatus: user?.membershipStatus || "active",
            },
        ];
    }

    return [];
}

export function buildAssignedTenantIds(memberships = []) {
    return new Set(
        memberships
            .map((membership) => normalizeId(membership?.tenantId))
            .filter(Boolean)
    );
}

export function filterAvailableTenants(tenants = [], assignedTenantIds = new Set()) {
    return tenants.filter((tenant) => !assignedTenantIds.has(normalizeId(tenant.id)));
}

export function filterRolesByTenantType(roles = [], selectedTenant = null) {
    if (!selectedTenant) {
        return [];
    }

    const selectedType = normalizeType(
        selectedTenant.tenantType || selectedTenant.tipo
    );

    return roles.filter((role) => {
        const roleType = normalizeType(role.tenantType || role.tipo);

        if (!roleType || !selectedType) {
            return true;
        }

        return roleType === selectedType;
    });
}
