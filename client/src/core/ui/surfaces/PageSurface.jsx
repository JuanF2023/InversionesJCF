// client/src/core/ui/surfaces/PageSurface.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/surfaces/styles/surfaces.css";

export default function PageSurface({ children, className = "" }) {
  return (
    <section className={clsx("surface-page", className)}>
      {children}
    </section>
  );
}
