import React, { useMemo } from "react";
import { useCorporativo } from "@/features/corporativo/propiedades/store/corporativoStore.js";
import DataTable from "@/shared/components/ui/table/DataTable.jsx";

const money = (n) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(Number(n || 0));
const d = (x) => (x ? String(x).slice(0, 10) : "??);

export default function DetallesIngresosProp({ propiedadId }) {
  const ingresos = useCorporativo((s) => s.ingresos) || [];
  const negocios = useCorporativo((s) => s.negocios) || [];
  const unidades = useCorporativo((s) => s.unidades) || [];

  const mapNegocio = useMemo(() => {
    const m = new Map();
    for (const n of negocios || []) m.set(String(n.id ?? n._id), n);
    return m;
  }, [negocios]);

  const mapUnidad = useMemo(() => {
    const m = new Map();
    for (const u of unidades || []) m.set(String(u.id ?? u._id), u);
    return m;
  }, [unidades]);

  const rows = useMemo(() => {
    return (ingresos || []).filter((r) => String(r.propiedadId) === String(propiedadId));
  }, [ingresos, propiedadId]);

  const columns = useMemo(
    () => [
      {
        key: "fecha", header: "Fecha", width: 120, render: (r) => d(r.fecha || r.date),
        sort: (a, b) => new Date(a.fecha || a.date || 0) - new Date(b.fecha || b.date || 0)
      },
      { key: "periodo", header: "Per¨ªodo", width: 110, render: (r) => r.periodo || r.ym || "?? },
      {
        key: "negocioId", header: "Negocio", width: 220,
        render: (r) => mapNegocio.get(String(r.negocioId))?.nombre || r.negocioNombre || "??
      },
      {
        key: "unidadId", header: "Unidad", width: 160,
        render: (r) => mapUnidad.get(String(r.unidadId))?.nombre || r.unidadCodigo || "??
      },
      { key: "categoria", header: "Categor¨ªa", width: 180, render: (r) => r.categoria || r.category || "?? },
      {
        key: "concepto", header: "Concepto", className: "max-w-[420px] truncate",
        render: (r) => r.concepto || r.description || "??
      },
      {
        key: "monto", header: "Monto", align: "right", width: 140,
        className: "[font-variant-numeric:tabular-nums]",
        render: (r) => money(r.monto ?? r.amount),
        sort: (a, b) => Number(a.monto ?? a.amount ?? 0) - Number(b.monto ?? b.amount ?? 0)
      },
      { key: "origen", header: "Origen", width: 160, render: (r) => r.origen || r.source || "?? },
    ],
    [mapNegocio, mapUnidad]
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Ingresos</h3>
        {/* Bot¨®n eliminado: ¡°Ir a transacciones ingresos??ya no se usa */}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        striped
        dense
        searchable
        searchPlaceholder="Buscar??concepto, categor¨ªa, negocio, unidad"
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        rowKey={(r, i) => r.id || r._id || `${r.fecha}-${r.unidadId}-${i}`}
        footerLeft={<span>Ingresos: <b className="text-text">{rows.length}</b></span>}
      />
    </section>
  );
}


