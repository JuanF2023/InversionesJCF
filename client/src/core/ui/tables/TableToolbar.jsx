// client/src/core/ui/tables/TableToolbar.jsx
import React from "react";

export default function TableToolbar({
  children,
  className = "",
}) {
  return (
    <div
      className={[
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
