// client/src/core/ui/detail/DetailGrid.jsx
import React from "react";
import clsx from "clsx";

const COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

const GAP = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export default function DetailGrid({
  children,
  columns = 2,
  gap = "md",
  className = "",
}) {
  return (
    <div
      className={clsx(
        "grid",
        COLUMNS[columns] || COLUMNS[2],
        GAP[gap] || GAP.md,
        className
      )}
    >
      {children}
    </div>
  );
}
