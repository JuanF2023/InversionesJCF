// client/src/core/ui/detail/DetailSection.jsx
import React from "react";

import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

export default function DetailSection({
  icon: Icon,
  title,
  description,
  children,
  actions,
}) {
  return (
    <PanelSurface padding="lg">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2">
          {Icon ? <Icon size={18} className="mt-0.5 shrink-0 opacity-70" /> : null}

          <div className="min-w-0">
            <h2 className="font-bold">{title}</h2>

            {description ? (
              <p className="mt-1 text-sm opacity-65">{description}</p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {children}
    </PanelSurface>
  );
}
