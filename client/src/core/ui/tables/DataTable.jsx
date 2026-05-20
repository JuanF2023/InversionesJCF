// client/src/core/ui/tables/DataTable.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/tables/styles/tables.css";

export default function DataTable({ children, className = "" }) {
  return <table className={clsx("data-table", className)}>{children}</table>;
}
