// client/src/features/corporativo/layout/components/CorporateFooterNav.jsx
import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const FOOTER_LINKS = [
  { to: "/corporativo", label: "Inicio" },
  { to: "/corporativo/transacciones", label: "Transacciones" },
  { to: "/corporativo/dashboards/informes", label: "Informes" },
];

export default function CorporateFooterNav({ isNeo }) {
  return (
    <div className="flex items-center gap-2">
      {FOOTER_LINKS.map((button) => (
        <Link
          key={button.to}
          to={button.to}
          className={clsx(
            "rounded-md px-3 py-1.5 text-sm text-text",
            isNeo
              ? "bg-bgElev neu"
              : "bg-[var(--chip)] hover:bg-[var(--chip-hover)]"
          )}
        >
          {button.label}
        </Link>
      ))}
    </div>
  );
}
