import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/shared/components/ui/table/DataTable.jsx";

const money = (n) =>
  new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n || 0));

const d = (x) => (x ? String(x).slice(0, 10) : "â€?);

export default function ProyectosListPage() {
  // MÃ¡s adelante vas a remplazar esto con fetch real a /api/proyectos
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([
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
      { key: "codigo", header: "CÃ³digo", width: 120 },
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
        render: (r) => d(r.inicio),
      },
      {
        key: "fin",
        header: "Fin",
        width: 130,
        render: (r) => d(r.fin),
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
    <section className="neo-card neo-card--deep neo-card--tinted p-4 rounded-2xl space-y-3">
      <div className="text-sm subtle">Listado de proyectos</div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        striped
        dense
        searchable
        searchPlaceholder="Buscarâ€?cÃ³digo, nombre, estado"
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

