// src/pages/Corporativo/Propiedades/Detalles/DetallesUnidadesProp.jsx
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/shared/components/ui/table/DataTable.jsx";
import { apiFetch, extractItems } from "@/core/utils/api";
import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";


const FALLBACK = "??;

const money = (n) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

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
      {right || null}
    </div>
    {children}
  </section>
);

export default function DetallesUnidadesProp({ propiedadId: propIdProp }) {
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
        const { ok, data } = await fetchFirstOK([`/api/corporativo/units${qs}`], {
          method: "GET",
          errorMessage: "No se pudo cargar unidades",
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
      (rowsApi || []).map((u, i) => ({
        id: u._id || u.id || u.codigo || `row-${i}`,
        codigo: u.codigo || u.code || FALLBACK,
        nombre: u.nombre || u.name || FALLBACK,
        tipo: u.tipo || u.type || FALLBACK,
        estado: u.estado || u.status || FALLBACK,
        m2: Number(u.m2 ?? u.area ?? 0) || 0,
        renta: Number(u.rentaMensual ?? u.renta ?? u.rentalPrice ?? 0) || 0,
        negocio: u.negocioNombre || u.negocio || FALLBACK,
      })),
    [rowsApi]
  );

  const columns = useMemo(
    () => [
      { key: "codigo", header: "C¨®digo", width: 120, render: (r) => r.codigo },
      {
        key: "nombre",
        header: "Nombre",
        className: "max-w-[280px] truncate",
        render: (r) => r.nombre,
      },
      { key: "tipo", header: "Tipo", width: 160, render: (r) => r.tipo || FALLBACK },
      { key: "estado", header: "Estado", width: 140, render: (r) => r.estado || FALLBACK },
      {
        key: "m2",
        header: "m2",
        align: "right",
        width: 90,
        className: "[font-variant-numeric:tabular-nums]",
        render: (r) => (Number.isFinite(r.m2) ? r.m2 : FALLBACK),
        sort: (a, b) => (a.m2 || 0) - (b.m2 || 0),
      },
      {
        key: "renta",
        header: "Renta sugerida",
        align: "right",
        width: 150,
        className: "[font-variant-numeric:tabular-nums]",
        render: (r) => (r.renta ? money(r.renta) : FALLBACK),
        sort: (a, b) => (a.renta || 0) - (b.renta || 0),
      },
      { key: "negocio", header: "Negocio", width: 220, render: (r) => r.negocio || FALLBACK },
    ],
    []
  );

  return (
    <SectionCard title="Unidades">
      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        striped
        dense
        searchable
        searchPlaceholder="Buscar por c¨®digo, nombre o tipo"
        pageSize={10}
        rowKey={(r) => r.id}
        footerLeft={
          <span>
            Unidades: <b className="text-text">{rows.length}</b>
          </span>
        }
      />
    </SectionCard>
  );
}


