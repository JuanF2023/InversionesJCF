// client/src/core/ui/surfaces/PanelSurface.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/surfaces/styles/surfaces.css";

const PADDING = {
  none: "surface-panel--padding-none",
  sm: "surface-panel--padding-sm",
  md: "surface-panel--padding-md",
  lg: "surface-panel--padding-lg",
};

const VARIANTS = {
  default: "surface-panel--default",
  soft: "surface-panel--soft",
  glass: "surface-panel--glass",
  elevated: "surface-panel--elevated",
  table: "surface-panel--table",
};

export default function PanelSurface({
  children,
  className = "",
  padding = "md",
  variant = "default",
  hoverable = false,
}) {
  return (
    <section
      className={clsx(
        "surface-panel",
        VARIANTS[variant] || VARIANTS.default,
        PADDING[padding] || PADDING.md,
        hoverable && "surface-panel--hoverable",
        className
      )}
    >
      {children}
    </section>
  );
}
