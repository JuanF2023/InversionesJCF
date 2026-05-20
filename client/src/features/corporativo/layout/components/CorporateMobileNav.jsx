// client/src/features/corporativo/layout/components/CorporateMobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Undo2 } from "lucide-react";
import clsx from "clsx";

export default function CorporateMobileNav({
  items = [],
  onGoLogin,
  onRequestLogout,
  onClose,
}) {
  const handleGoLogin = () => {
    onClose?.();
    onGoLogin?.();
  };

  const handleRequestLogout = () => {
    onClose?.();
    onRequestLogout?.();
  };

  return (
    <div className="corporate-mobile-menu md:hidden">
      <div className="container-90 flex flex-col gap-2 py-3">
        <div className="grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.99]",
                    isActive
                      ? "bg-[var(--chip-hover)] ring-1 ring-[var(--accent)]"
                      : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
                  )
                }
                end={Boolean(item.end)}
              >
                <span className="inline-flex items-center gap-2">
                  {Icon ? <Icon size={16} /> : null}
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        <div className="my-2 h-px bg-[var(--border)]" />

        <div className="grid gap-2">
          <p className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] opacity-55">
            Sesión
          </p>

          <button
            type="button"
            onClick={handleGoLogin}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--chip)] px-3 py-2 text-left text-sm font-semibold transition-all duration-150 hover:bg-[var(--chip-hover)] active:scale-[0.99]"
          >
            <Undo2 size={16} />
            Cambiar usuario
          </button>

          <button
            type="button"
            onClick={handleRequestLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-left text-sm font-semibold text-red-500 transition-all duration-150 hover:bg-red-500/15 active:scale-[0.99]"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
