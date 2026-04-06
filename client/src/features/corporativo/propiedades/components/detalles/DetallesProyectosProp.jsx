// src/pages/Corporativo/Propiedades/Detalles/DetallesProyectosProp.jsx
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/shared/components/ui/table/DataTable.jsx";
import { apiFetch, extractItems } from "@/core/utils/api";
import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";

const fmtDate = (iso) => {
  if (!iso) return "??;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "?? : d.toLocaleDateString("es-SV");
};

const pct = (n) => {
  const x = Number(n ?? 0);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
};

async function fetchFirstOK(urls, opt) {
  for (const u of urls) {
    const res = await apiFetch(u, opt);
    if (res?.ok) return res;
    // Si NO es 404, probamos la siguiente igual (no rompemos UX)
    if (res?.status !== 404) continue;
  }
  return { ok: false, data: null };
}

const SectionCard = ({ title, children }) => (
  <section className="neo-card neo-card--deep neo-card--tinted p-4 rounded-2xl space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
    </div>
    {children}
  </section>
);

export default function DetallesProyectosProp({ propiedadId: propIdProp }) {
  const selectedPropId = usePropertiesStore((s) => s.selectedPropId);
  const propiedadId = String(propIdProp ?? selectedPropId ?? "").trim();

  const [loading, setLoading] = useState(false);
  const [rowsApi, setRowsApi] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const qs = propiedadId ? `?propiedadId=${encodeURIComponent(propiedadId)}` : "";

        const { ok, data } = await fetchFirstOK([`/api/corporativo/projects${qs}`], {
          method: "GET",
          errorMessage: "No se pudo cargar proyectos",
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

  const rows = useMemo(() => {
    const list = Array.isArray(rowsApi) ? rowsApi : [];
    return list.map((p, i) => ({
      id: p?._id || p?.id || `row-${i}`,
      codigo: p?.codigo || p?.code || "??,
      nombre: p?.nombre || p?.name || "??,
      estado: p?.estado || p?.status || "??,
      inicio: p?.inicio || p?.fechaInicio || p?.startDate || "",
      fin: p?.fin || p?.fechaFin || p?.endDate || "",
      avance: pct(p?.avance ?? p?.progress ?? 0),
    }));
  }, [rowsApi]);

  const columns = useMemo(
    () => [
      { key: "codigo", header: "C¨®digo", width: 120, render: (r) => r.codigo },
      { key: "nombre", header: "Nombre", className: "max-w-[340px] truncate", render: (r) => r.nombre },
      { key: "estado", header: "Estado", width: 140, render: (r) => r.estado || "?? },
      {
        key: "inicio",
        header: "Inicio",
        width: 110,
        render: (r) => fmtDate(r.inicio),
        sort: (a, b) => new Date(a.inicio || 0) - new Date(b.inicio || 0),
      },
      {
        key: "fin",
        header: "Fin",
        width: 110,
        render: (r) => fmtDate(r.fin),
        sort: (a, b) => new Date(a.fin || 0) - new Date(b.fin || 0),
      },
      {
        key: "avance",
        header: "Avance",
        align: "right",
        width: 110,
        className: "[font-variant-numeric:tabular-nums]",
        render: (r) => `${r.avance}%`,
        sort: (a, b) => a.avance - b.avance,
      },
    ],
    []
  );

  return (
    <SectionCard title="Proyectos">
      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        striped
        dense
        searchable
        searchPlaceholder="Buscar: c¨®digo, nombre, estado"
        pageSize={10}
        rowKey={(r) => r.id}
        footerLeft={
          <span>
            Proyectos: <b className="text-text">{rows.length}</b>
          </span>
        }
      />
    </SectionCard>
  );
}


