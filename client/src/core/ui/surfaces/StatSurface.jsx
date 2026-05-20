// client/src/core/ui/surfaces/StatSurface.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/surfaces/styles/surfaces.css";

export default function StatSurface({
  icon: Icon,
  label,
  value,
  helper,
  tone = "default",
}) {
  return (
    <article className={clsx("surface-stat", `surface-stat--${tone}`)}>
      <div className="min-w-0">
        <p className="surface-stat__label">{label}</p>
        <p className="surface-stat__value">{value}</p>

        {helper ? <p className="surface-stat__helper">{helper}</p> : null}
      </div>

      {Icon ? (
        <div className="surface-stat__icon">
          <Icon size={18} />
        </div>
      ) : null}
    </article>
  );
}
