// client/src/features/corporativo/layout/utils/corporate-layout.utils.js
import { loadSession } from "@/core/utils/authSession.js";

export function computeIsFormRoute(pathname = "") {
  return /\/(nuevo|nueva|crear|editar|edit|new|form)(\/|$)/i.test(pathname);
}

export function readRuntimeUser() {
  const persisted = loadSession()?.user || {};
  const runtime = window.__user || {};
  const merged = { ...persisted, ...runtime };

  const name =
    merged.nombre ||
    merged.displayName ||
    [merged.firstName, merged.lastName].filter(Boolean).join(" ") ||
    "Usuario";

  return {
    raw: merged,
    name,
    email: merged.email || "",
    photoUrl: merged.photoUrl || "",
    rol: merged.rol || merged.role || merged.roleName || "",
  };
}

export function normalizeRoles(user) {
  const rolesFromArray = Array.isArray(user?.roles)
    ? user.roles
        .map((role) => {
          if (!role) return null;

          if (typeof role === "string") {
            return role.toLowerCase();
          }

          if (typeof role === "object") {
            return String(
              role.slug ||
                role.roleSlug ||
                role.name ||
                role.roleName ||
                role.code ||
                role.id ||
                role._id ||
                ""
            ).toLowerCase();
          }

          return String(role).toLowerCase();
        })
        .filter(Boolean)
    : [];

  const rolesFromFlatFields = [
    user?.rol,
    user?.role,
    user?.roleSlug,
    user?.roleName,
  ]
    .filter(Boolean)
    .map((role) => String(role).toLowerCase());

  return Array.from(new Set([...rolesFromArray, ...rolesFromFlatFields]));
}

export function normalizePermissions(user) {
  return Array.isArray(user?.permissions)
    ? user.permissions.map((permission) => String(permission).toLowerCase())
    : [];
}

export function canSeeAccessTab(user) {
  const rawTenant =
    user?.tenant ||
    user?.tenantSlug ||
    user?.corporateTenant ||
    user?.defaultTenant ||
    (Array.isArray(user?.tenants) ? user.tenants[0] : null);

  const tenant = rawTenant ? String(rawTenant).toLowerCase() : "";

  const isCorpTenant =
    tenant === "corp" ||
    tenant === "corporativo" ||
    tenant === "corporate" ||
    tenant === "corporation";

  const roles = normalizeRoles(user);
  const permissions = normalizePermissions(user);

  const hasCorporateRole =
    roles.includes("owner") ||
    roles.includes("corporativo") ||
    roles.includes("corporate_admin") ||
    roles.includes("corp_admin");

  const hasUsersManagePermission = permissions.includes("users.manage");

  return isCorpTenant || hasCorporateRole || hasUsersManagePermission;
}
