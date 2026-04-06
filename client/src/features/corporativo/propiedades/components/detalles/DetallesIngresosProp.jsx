// src/pages/Corporativo/Propiedades/Detalles/DetallesIngresosProp.jsx
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/shared/components/ui/table/DataTable.jsx";
import { apiFetch, extractItems } from "@/core/utils/api";
import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";


const FALLBACK = "??;

const money = (n) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const fmtDate = (iso) => {
  if (!iso) return FALLBACK;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? FALLBACK : d.toLocaleDateString("es-SV");
};

async function fetchFirstOK(urls, opt) {
  for (const u of urls) {
    const res = await apiFetch(u, opt);
    if (res?.ok) return res;
    if (res?.status !== 404) continue;
  }
  return { ok: false, data: null };
}

const SectionCard = ({ title, right, children }) => (
  <section className="neo-card neo-card--deep neo-card--tinted p-4 rounded-2xl space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
      {right ?? null}
    </div>
    {children}
  </section>
);

export default function DetallesIngresosProp({ propiedadId: propIdProp }) {
  const selectedPropId = usePropertiesStore((s) => s.selectedPropId);
  const propiedadId = String(propIdProp ?? selectedPropId ?? "");

  const [loading, setLoading] = useState(false);
  const [rowsApi, setRowsApi] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!propiedadId) {
        setRowsApi([]);
        return;
      }

      setLoading(true);
      try {
        const qs = `?propiedadId=${encodeURIComponent(propiedadId)}`;
        const { ok, data } = await fetchFirstOK([`/api/corporativo/incomes${qs}`], {
          method: "GET",
          errorMessage: "No se pudo cargar ingresos",
        });

        if (!alive) return;
        setRowsApi(ok ? extractItems(data) : []);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [propiedadId]);

  const rows = useMemo(
    () =>
      (rowsApi || []).map((it, i) => ({
        id: it._id || it.id || `row-${i}`,
        fecha: it.fecha || it.date || null,
        periodo: it.periodo || it.period || FALLBACK,
        negocio: it.negocioNombre || it.negocio || FALLBACK,
        unidad: it.unidadCodigo || it.unidad || FALLBACK,
        categoria: it.categoria || it.category || FALLBACK,
        concepto: it.concepto || it.description || FALLBACK,
        monto: Number(it.monto ?? it.amount ?? 0) || 0,
        origen: it.origen || it.source || FALLBACK,
      })),
    [rowsApi]
  );

  const cols = useMemo(
    () => [
      {
        key: "fecha",
        header: "Fecha",
        width: 110,
        render: (r) => fmtDate(r.fecha),
        sort: (a, b) => new Date(a.fecha || 0) - new Date(b.fecha || 0),
      },
      { key: "periodo", header: "Per¨ªodo", width: 110, render: (r) => r.periodo || FALLBACK },
      { key: "negocio", header: "Negocio", width: 180, render: (r) => r.negocio || FALLBACK },
      { key: "unidad", header: "Unidad", width: 120, render: (r) => r.unidad || FALLBACK },
      { key: "categoria", header: "Categor¨ªa", width: 160, render: (r) => r.categoria || FALLBACK },
      {
        key: "concepto",
        header: "Concepto",
        className: "max-w-[360px] truncate",
        render: (r) => r.concepto || FALLBACK,
      },
      {
        key: "monto",
        header: "Monto",
        align: "right",
        width: 120,
        className: "[font-variant-numeric:tabular-nums]",
        render: (r) => money(r.monto),
        sort: (a, b) => (a.monto || 0) - (b.monto || 0),
      },
      { key: "origen", header: "Origen", width: 140, render: (r) => r.origen || FALLBACK },
    ],
    []
  );

  return (
    <SectionCard title="Ingresos">
      <DataTable
        columns={cols}
        data={rows}
        loading={loading}
        striped
        dense
        searchable
        searchPlaceholder="Buscar por fecha, concepto o categor¨ªa"
        pageSize={10}
        rowKey={(r) => r.id}
        footerLeft={
          <span>
            Ingresos: <b className="text-text">{rows.length}</b>
          </span>
        }
      />
    </SectionCard>
  );
}


