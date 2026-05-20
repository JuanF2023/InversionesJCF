// client/src/features/corporativo/layout/components/AppUserMenuPanel.jsx
import React from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";

import CorporateThemeSelector from "./CorporateThemeSelector.jsx";

export default function AppUserMenuPanel({
  user,
  open,
  onToggle,
  onRequestLogout,
}) {
  return (
    <div className="hidden md:flex items-center">
      <button
        id="user-menu-button"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
        className="user-pill"
        title={user.email}
      >
        <div className="user-pill__avatar flex items-center justify-center overflow-hidden">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={18} className="opacity-70" />
          )}
        </div>

        <span className="user-pill__name">{user.name}</span>
        <ChevronDown size={16} className="caret opacity-70" />
      </button>

      {open ? (
        <div
          id="user-menu-popover"
          role="menu"
          aria-label="Menú de usuario"
          className="user-menu"
          tabIndex={-1}
        >
          <div
            className="user-menu__item user-menu__itemstatic"
            role="presentation"
          >
            <UserIcon size={16} />

            <div className="text-left">
              <div className="text-sm font-semibold leading-4">
                {user.name}
              </div>

              <div className="text-[11px] subtle leading-4">
                {user.email}
              </div>
            </div>
          </div>

          <div className="user-menu__sep" />

          <CorporateThemeSelector onClose={onToggle} />

          <div className="user-menu__sep" />

          <button
            type="button"
            className="user-menu__item user-menu__itemdanger"
            role="menuitem"
            onClick={onRequestLogout}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
