// client/src/core/ui/tables/TableContainer.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/tables/styles/tables.css";

export default function TableContainer({ children, className = "" }) {
  return <div className={clsx("data-table-container", className)}>{children}</div>;
}
