// client/src/shared/ui/navigation/RouteTabs.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

/**
 * RouteTabs
 * Componente transversal de navegaci¨®n por pesta?as basado en rutas.
 *
 * Props:
 * - tabs: [{ to, label, icon, end, disabled }]
 * - basePath?: string
 * - className?: string
 * - tabsClassName?: string
 * - itemClassName?: string
 * - activeClassName?: string
 * - inactiveClassName?: string
 */
export default function RouteTabs({
    tabs = [],
    basePath = "",
    className = "",
    tabsClassName = "",
    itemClassName = "",
    activeClassName = "",
    inactiveClassName = "",
}) {
    const normalizedTabs = Array.isArray(tabs) ? tabs : [];

    return (
        <nav
            aria-label="Navegaci¨®n por pesta?as"
            className={clsx("w-full overflow-x-auto", className)}
        >
            <div
                className={clsx(
                    "inline-flex min-w-full items-center gap-2 border-b border-[var(--border)] pb-2",
                    tabsClassName
                )}
            >
                {normalizedTabs.map((tab, index) => {
                    const rawTo = String(tab?.to || "").replace(/^\/+/, "");
                    const to = rawTo ? `${basePath}/${rawTo}`.replace(/\/+/g, "/") : basePath || ".";
                    const label = tab?.label || `Tab ${index + 1}`;
                    const Icon = tab?.icon || null;
                    const end = Boolean(tab?.end ?? tab?.index ?? false);
                    const disabled = Boolean(tab?.disabled);

                    if (disabled) {
                        return (
                            <span
                                key={`${label}-${index}`}
                                className={clsx(
                                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed border border-[var(--border)]",
                                    itemClassName,
                                    inactiveClassName
                                )}
                                aria-disabled="true"
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
                            className={({ isActive }) =>
                                clsx(
                                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all border",
                                    isActive
                                        ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--text)] shadow-sm"
                                        : "border-[var(--border)] bg-[var(--panel)] text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--panel)_82%,white_18%)]",
                                    itemClassName,
                                    isActive ? activeClassName : inactiveClassName
                                )
                            }
                        >
                            {Icon ? <Icon size={16} /> : null}
                            <span>{label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
