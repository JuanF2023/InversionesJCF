// client/src/features/corporativo/layout/CorporativoLayout.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import "@/styles/corporativo/underline-tabs.css";

import { useTheme } from "@/context/ThemeContext.jsx";
import { loadSession } from "@/core/utils/authSession.js";
import { useIdleLogout } from "@/core/utils/idleLogout";
import { useAuthStore } from "@/features/auth/store/auth.store.js";

import {
  LayoutDashboard,
  KanbanSquare,
  Building2,
  FileSpreadsheet,
  BarChart3,
  ListChecks,
  Info,
  Home as HomeIcon,
  Users,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Undo2,
  Menu,
  ShieldCheck,
} from "lucide-react";

/**
 * Tabs principales del shell corporativo.
 * El layout no debe depender de stores de dominio inexistentes.
 */
const MAIN_TABS = [
  { to: "/corporativo/dashboards", label: "Dashboards", icon: <LayoutDashboard size={16} />, end: false },
  { to: "/corporativo/negocios", label: "Negocios", icon: <KanbanSquare size={16} /> },
  { to: "/corporativo/propiedades", label: "Propiedades", icon: <Building2 size={16} /> },
  { to: "/corporativo/proyectos", label: "Proyectos", icon: <KanbanSquare size={16} /> },
  { to: "/corporativo/transacciones", label: "Transacciones", icon: <FileSpreadsheet size={16} /> },
  { to: "/corporativo/admin/users", label: "Accesos", icon: <ShieldCheck size={16} /> },
  { to: "/corporativo/por-hacer", label: "Por hacer", icon: <ListChecks size={16} /> },
  { to: "/corporativo/acerca-de", label: "Acerca de", icon: <Info size={16} /> },
  { to: "/corporativo/filosofia-de-dar", label: "Filosof赤a de Dar", icon: <HomeIcon size={16} /> },
];

function computeIsFormRoute(pathname) {
  return /\/(nuevo|nueva|crear|editar|edit|new|form)(\/|$)/i.test(pathname);
}

function readRuntimeUser() {
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

function normalizeRoles(user) {
  const rolesFromArray = Array.isArray(user?.roles)
    ? user.roles
      .map((r) => {
        if (!r) return null;
        if (typeof r === "string") return r.toLowerCase();
        if (typeof r === "object") {
          return String(
            r.slug ||
            r.roleSlug ||
            r.name ||
            r.roleName ||
            r.code ||
            r.id ||
            r._id ||
            ""
          ).toLowerCase();
        }
        return String(r).toLowerCase();
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
    .map((r) => String(r).toLowerCase());

  return Array.from(new Set([...rolesFromArray, ...rolesFromFlatFields]));
}

function normalizePermissions(user) {
  return Array.isArray(user?.permissions)
    ? user.permissions.map((p) => String(p).toLowerCase())
    : [];
}

function canSeeAccessTab(user) {
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
  const perms = normalizePermissions(user);

  const hasCorporateRole =
    roles.includes("owner") ||
    roles.includes("corporativo") ||
    roles.includes("corporate_admin") ||
    roles.includes("corp_admin");

  const hasUsersManagePerm = perms.includes("users.manage");

  return isCorpTenant || hasCorporateRole || hasUsersManagePerm;
}

function ConfirmLogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold">Cerrar sesi車n</h3>
        <p className="mt-2 text-sm opacity-80">
          ?Seguro que deseas cerrar la sesi車n?
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200"
          >
            Cerrar sesi車n
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CorporativoLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const logout = useAuthStore((s) => s.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const isNeo = theme?.startsWith("neo");
  const isFormRoute = useMemo(() => computeIsFormRoute(pathname), [pathname]);
  const mainBottomPadding = isFormRoute ? "pb-8" : "pb-20";

  const user = useMemo(() => readRuntimeUser(), []);
  const canManageUsers = useMemo(() => canSeeAccessTab(user.raw), [user.raw]);

  const visibleMainTabs = useMemo(() => {
    return MAIN_TABS.filter((item) => {
      if (item.to === "/corporativo/admin/users") return canManageUsers;
      return true;
    });
  }, [canManageUsers]);

  useIdleLogout({
    timeoutMinutes: 10,
    onTimeout: () => {
      navigate("/login", { replace: true, state: { from: { pathname } } });
    },
  });

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onDoc = (e) => {
      const menu = document.getElementById("user-menu-popover");
      const btn = document.getElementById("user-menu-button");
      if (!menu || !btn) return;
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [userMenuOpen]);

  const doLogout = useCallback(async () => {
    try {
      await logout({ callBackend: true });
    } finally {
      window.__user = null;
      navigate("/login", { replace: true });
    }
  }, [logout, navigate]);

  const goLoginKeepAlive = useCallback(() => {
    navigate("/login", { replace: true, state: { from: { pathname } } });
  }, [navigate, pathname]);

  return (
    <div className="min-h-dvh bg-bg text-text flex flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-bgElev border border-border rounded-md px-3 py-1.5"
      >
        Saltar al contenido
      </a>

      <header role="banner" className="app-header sticky top-0 z-40 bg-bgElev/95 backdrop-blur">
        <div className="container-90">
          <div className="h-14 flex items-center justify-between">
            <Link to="/corporativo" className="flex items-center gap-2">
              <div
                className={clsx(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-border",
                  isNeo ? "bg-bgElev neu" : "bg-[var(--chip)]"
                )}
              >
                <BarChart3 size={16} />
              </div>
              <span className="font-semibold tracking-tight">Inversiones JCF</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={goLoginKeepAlive}
                className={clsx(
                  "hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm ring-1 ring-border",
                  isNeo ? "bg-bgElev neu" : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
                )}
                title="Cambiar usuario (mantiene sesi車n activa)"
              >
                <Undo2 size={16} />
                Ir a Login
              </button>

              <div className="hidden md:flex items-center">
                <button
                  id="user-menu-button"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="user-pill"
                  title={user.email}
                >
                  <div className="user-pill__avatar flex items-center justify-center overflow-hidden">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={18} className="opacity-70" />
                    )}
                  </div>
                  <span className="user-pill__name">{user.name}</span>
                  <ChevronDown size={16} className="caret opacity-70" />
                </button>

                {userMenuOpen && (
                  <div
                    id="user-menu-popover"
                    role="menu"
                    aria-label="Men迆 de usuario"
                    className="user-menu"
                    style={{ marginTop: 8 }}
                    tabIndex={-1}
                  >
                    <div className="user-menu__item user-menu__item--static" role="presentation">
                      <UserIcon size={16} />
                      <div className="text-left">
                        <div className="text-sm font-semibold leading-4">{user.name}</div>
                        <div className="text-[11px] subtle leading-4">{user.email}</div>
                      </div>
                    </div>

                    <div className="user-menu__sep" />

                    <button
                      className="user-menu__item user-menu__item--danger"
                      role="menuitem"
                      onClick={() => setConfirmLogoutOpen(true)}
                      title="Cerrar sesi車n"
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesi車n</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="md:hidden flex items-center gap-2">
                <button
                  aria-label="Abrir men迆"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((v) => !v)}
                  className={clsx(
                    "inline-flex items-center justify-center h-11 w-11 rounded-xl ring-1 ring-border",
                    isNeo ? "bg-bgElev neu" : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
                  )}
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="container-90">
            <nav
              aria-label="Secciones corporativas"
              className="relative flex items-center gap-1 pt-2 pb-2 overflow-visible"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
                maskImage:
                  "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
              }}
            >
              {visibleMainTabs.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx("tabline text-sm font-semibold", isActive ? "active" : "tabline--muted")
                  }
                  end={Boolean(item.end)}
                >
                  <span className="opacity-80">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-bgElev">
            <div className="container-90 py-3 flex flex-col gap-2">
              {visibleMainTabs.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "rounded-xl px-3 py-2 text-sm font-semibold",
                      isActive
                        ? "bg-[var(--chip-hover)]"
                        : "bg-[var(--chip)]"
                    )
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </NavLink>
              ))}

              <button
                type="button"
                onClick={goLoginKeepAlive}
                className="rounded-xl px-3 py-2 text-left text-sm font-semibold bg-[var(--chip)]"
              >
                Ir a Login
              </button>

              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(true)}
                className="rounded-xl px-3 py-2 text-left text-sm font-semibold bg-red-500/15 text-red-200"
              >
                Cerrar sesi車n
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none overflow-y-auto overflow-x-hidden">
        <div className={clsx("container-90 pt-6", mainBottomPadding)}>
          <Outlet />
        </div>
      </main>

      <footer
        role="contentinfo"
        className={clsx(
          "app-footer z-40 border-t border-border/60 bg-[color-mix(in_srgb,var(--bgElev)_92%,transparent)] backdrop-blur supports-[backdrop-filter]:backdrop-blur-md",
          isFormRoute ? "relative" : "sticky bottom-0"
        )}
      >
        <div className="container-90 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 text-sm subtle">
            <span className="inline-flex items-center gap-2">
              <Users size={16} />
              {user.name}
            </span>

            {user.rol ? (
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs">
                {user.rol}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {[
              { to: "/corporativo", label: "Inicio" },
              { to: "/corporativo/transacciones", label: "Transacciones" },
              { to: "/corporativo/dashboards/informes", label: "Informes" },
            ].map((b) => (
              <Link
                key={b.to}
                to={b.to}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-sm text-text",
                  isNeo ? "bg-bgElev neu" : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
                )}
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <ConfirmLogoutModal
        open={confirmLogoutOpen}
        onCancel={() => setConfirmLogoutOpen(false)}
        onConfirm={async () => {
          setConfirmLogoutOpen(false);
          await doLogout();
        }}
      />
    </div>
  );
}
