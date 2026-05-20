// client/src/features/corporativo/layout/components/CorporateDesktopNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function CorporateDesktopNav({ items = [] }) {
  return (
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
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "tabline text-sm font-semibold",
                    isActive ? "active" : "tablinemuted"
                  )
                }
                end={Boolean(item.end)}
              >
                {Icon ? (
                  <span className="opacity-80">
                    <Icon size={16} />
                  </span>
                ) : null}

                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
