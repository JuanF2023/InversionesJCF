import React from "react";

export default function BusinessOverview() {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl ring-1 ring-border p-4 bg-bgElev">Resumen del negocio</div>
      <div className="rounded-xl ring-1 ring-border p-4 bg-bgElev">Indicadores</div>
      <div className="rounded-xl ring-1 ring-border p-4 bg-bgElev">Actividad reciente</div>
    </div>
  );
}
