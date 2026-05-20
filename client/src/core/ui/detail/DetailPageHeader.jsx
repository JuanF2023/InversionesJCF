// client/src/core/ui/detail/DetailPageHeader.jsx
import React from "react";

import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

export default function DetailPageHeader({
  eyebrow,
  title,
  subtitle,
  avatar,
  status,
  actions,
}) {
  return (
    <PanelSurface padding="lg" variant="soft">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {avatar ? <div className="shrink-0">{avatar}</div> : null}

          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-55">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight">
              {title}
            </h1>

            {subtitle ? (
              <div className="mt-2 text-sm opacity-70">{subtitle}</div>
            ) : null}

            {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </div>

        {status ? <div className="shrink-0">{status}</div> : null}
      </div>
    </PanelSurface>
  );
}
