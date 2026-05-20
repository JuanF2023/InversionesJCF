// client/src/core/ui/tables/TableEmpty.jsx
import React from "react";

import "@/core/ui/tables/styles/tables.css";

export default function TableEmpty({ title = "No hay registros", description }) {
  return (
    <div className="data-table-empty">
      <p className="data-table-empty__title">{title}</p>

      {description ? (
        <p className="data-table-empty__description">{description}</p>
      ) : null}
    </div>
  );
}
