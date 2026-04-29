// client/src/features/corporativo/proyectos/pages/ProyectosListPage.jsx
import React, { useMemo, useState } from "react";
import DataTable from "@/core/ui/components/DataTable.jsx";

const money = (n) =>
  new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n || 0));

const formatDate = (value) =>
  value ? String(value).slice(0, 10) : "—";

export default function ProyectosListPage() {
  // Más adelante vas a reemplazar esto con fetch real a /api/proyectos
  const [loading] = useState(false);
  const [rows] = useState([
    {
      id: "demo-1",
      codigo: "PRJ-0001",
      nombre: "Proyecto demo",
      estado: "en_idea",
      inicio: "2025-01-15",
      fin: "2025-06-30",
      presupuesto: 10000,
    },
  ]);

  const columns = useMemo(
    () => [
      { key: "codigo", header: "Código", width: 120 },
      {
        key: "nombre",
        header: "Nombre",
        className: "max-w-[360px] truncate",
      },
      { key: "estado", header: "Estado", width: 140 },
      {
        key: "inicio",
        header: "Inicio",
        width: 130,
        render: (r) => formatDate(r.inicio),
      },
      {
        key: "fin",
        header: "Fin",
        width: 130,
        render: (r) => formatDate(r.fin),
      },
      {
        key: "presupuesto",
        header: "Presupuesto",
        align: "right",
        width: 150,
        className: "[font-variant-numeric:tabular-nums]",
        render: (r) => money(r.presupuesto),
        sort: (a, b) =>
          Number(a.presupuesto ?? 0) - Number(b.presupuesto ?? 0),
      },
    ],
    []
  );

  return (
    <section className="neo-card neo-card--deep neo-card--tinted space-y-3 rounded-2xl p-4">
      <div className="subtle text-sm">Listado de proyectos</div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        striped
        dense
        searchable
        searchPlaceholder="Buscar por código, nombre o estado"
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        rowKey={(r) => r.id || r.codigo}
        footerLeft={
          <span>
            Proyectos totales: <b className="text-text">{rows.length}</b>
          </span>
        }
      />
    </section>
  );
}
