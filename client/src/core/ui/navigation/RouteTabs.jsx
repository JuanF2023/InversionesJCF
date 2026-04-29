// client/src/core/ui/navigation/RouteTabs.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

/**
 * RouteTabs
 * Navegación secundaria reutilizable basada en rutas.
 *
 * Soporta:
 * - items o tabs
 * - action a la derecha
 * - forceActive
 * - rutas relativas o absolutas
 */
export default function RouteTabs({
  items,
  tabs,
  basePath = "",
  ariaLabel = "Navegación secundaria",
  className = "",
  tabsClassName = "",
  itemClassName = "",
  activeClassName = "",
  inactiveClassName = "",
  action = null,
}) {
  const normalizedTabs = Array.isArray(items)
    ? items
    : Array.isArray(tabs)
      ? tabs
      : [];

  if (!normalizedTabs.length && !action) return null;

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label={ariaLabel} className="w-full overflow-x-auto">
          <div
            className={clsx(
              "inline-flex min-w-full items-center gap-2",
              tabsClassName
            )}
          >
            {normalizedTabs.map((tab, index) => {
              const rawTo = String(tab?.to ?? "").trim();
              const isAbsolute = rawTo.startsWith("/");
              const cleanRelativeTo = rawTo.replace(/^\/+/, "");
              const to = isAbsolute
                ? rawTo
                : cleanRelativeTo
                  ? `${basePath}/${cleanRelativeTo}`.replace(/\/+/g, "/")
                  : basePath || ".";

              const label = tab?.label || `Tab ${index + 1}`;
              const Icon = tab?.icon || null;
              const end = Boolean(tab?.end ?? tab?.index ?? true);
              const disabled = Boolean(tab?.disabled);
              const forceActive = Boolean(tab?.forceActive);

              const baseClasses =
                "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all whitespace-nowrap";

              if (disabled) {
                return (
                  <span
                    key={`${label}-${index}`}
                    aria-disabled="true"
                    className={clsx(
                      baseClasses,
                      "cursor-not-allowed border-[var(--border)] bg-[var(--panel)] opacity-50",
                      itemClassName,
                      inactiveClassName
                    )}
                  >
                    {Icon ? <Icon size={16} /> : null}
                    <span>{label}</span>
                  </span>
                );
              }

              return (
                <NavLink
                  key={`${to}-${index}`}
                  to={to}
                  end={end}
                  className={({ isActive }) => {
                    const active = forceActive || isActive;

                    return clsx(
                      baseClasses,
                      active
                        ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--text)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--panel)] text-[var(--text)] hover:bg-[var(--chip)]",
                      itemClassName,
                      active ? activeClassName : inactiveClassName
                    );
                  }}
                >
                  {Icon ? <Icon size={16} /> : null}
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {action ? (
          <div className="flex shrink-0 items-center justify-start lg:justify-end">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}
