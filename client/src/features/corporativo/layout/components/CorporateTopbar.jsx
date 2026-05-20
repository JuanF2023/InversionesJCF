// client/src/features/corporativo/layout/components/CorporateTopbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Menu, Undo2, X } from "lucide-react";
import clsx from "clsx";

import AppUserMenuPanel from "./AppUserMenuPanel.jsx";
import CorporateDesktopNav from "./CorporateDesktopNav.jsx";
import CorporateMobileNav from "./CorporateMobileNav.jsx";
import { useUserMenu } from "../hooks/useUserMenu.js";

export default function CorporateTopbar({
  user,
  isNeo,
  mobileOpen,
  visibleMainTabs,
  onToggleMobile,
  onGoLogin,
  onRequestLogout,
}) {
  const { userMenuOpen, setUserMenuOpen } = useUserMenu();
  const MobileMenuIcon = mobileOpen ? X : Menu;

  return (
    <header
      role="banner"
      className="app-header sticky top-0 z-40 bg-bgElev/95 backdrop-blur"
    >
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

            <span className="font-semibold tracking-tight">
              Inversiones JCF
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoLogin}
              className={clsx(
                "hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm ring-1 ring-border",
                isNeo
                  ? "bg-bgElev neu"
                  : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
              )}
              title="Cambiar usuario manteniendo sesión activa"
            >
              <Undo2 size={16} />
              Ir a Login
            </button>

            <AppUserMenuPanel
              user={user}
              open={userMenuOpen}
              onToggle={() => setUserMenuOpen((value) => !value)}
              onRequestLogout={onRequestLogout}
            />

            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
                onClick={onToggleMobile}
                className={clsx(
                  "inline-flex items-center justify-center h-11 w-11 rounded-xl ring-1 ring-border",
                  isNeo
                    ? "bg-bgElev neu"
                    : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
                )}
              >
                <MobileMenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CorporateDesktopNav items={visibleMainTabs} />

      {mobileOpen ? (
        <CorporateMobileNav
          items={visibleMainTabs}
          onGoLogin={onGoLogin}
          onRequestLogout={onRequestLogout}
          onClose={onToggleMobile}
        />
      ) : null}
    </header>
  );
}
