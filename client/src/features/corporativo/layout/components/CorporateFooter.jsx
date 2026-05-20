// client/src/features/corporativo/layout/components/CorporateFooter.jsx
import React from "react";
import { Users } from "lucide-react";
import clsx from "clsx";

import CorporateFooterNav from "./CorporateFooterNav.jsx";

export default function CorporateFooter({ user, isNeo, isFormRoute }) {
  return (
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

        <CorporateFooterNav isNeo={isNeo} />
      </div>
    </footer>
  );
}
