// client/src/features/corporativo/access/components/users-table/users-table.utils.js
export function initialsFromName(name) {
    return String(name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  export function getUserAccesses(user) {
    const memberships = Array.isArray(user?.memberships) ? user.memberships : [];

    const validMemberships = memberships.filter(
      (membership) =>
        membership &&
        membership.tenantNombre &&
        membership.tenantNombre !== "Sin tenant" &&
        membership.roleName &&
        membership.roleName !== "Sin rol"
    );

    if (validMemberships.length) return validMemberships;

    if (
      user?.tenantNombre &&
      user?.tenantNombre !== "Sin tenant" &&
      user?.roleName &&
      user.roleName !== "Sin rol"
    ) {
      return [
        {
          tenantNombre: user.tenantNombre,
          roleName: user.roleName,
        },
      ];
    }

    return [];
  }
