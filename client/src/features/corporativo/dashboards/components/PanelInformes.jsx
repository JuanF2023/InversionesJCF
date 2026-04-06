// client/src/features/corporativo/dashboards/components/PanelInformes.jsx
import React from "react";
import { Link } from "react-router-dom";

const INFORMES_CLAVE = [
  {
    id: "flujo-mensual",
    titulo: "Flujo de caja mensual",
    descripcion:
      "Resumen de ingresos y egresos por propiedad, negocio y pa赤s para el periodo seleccionado.",
    destino: "/corporativo/informes/resumen",
    rango: "迆ltimo mes",
  },
  {
    id: "rentabilidad-prop",
    titulo: "Rentabilidad por propiedad",
    descripcion:
      "ROI, flujo neto y ocupaci車n para cada propiedad de El Salvador y USA.",
    destino: "/corporativo/informes/tablas",
    rango: "迆ltimos 12 meses",
  },
  {
    id: "rentabilidad-negocios",
    titulo: "Rentabilidad por negocio",
    descripcion:
      "Estado de resultados consolidado por negocio (ej. Chaparral / Restaurantes).",
    destino: "/corporativo/informes/tablas",
    rango: "迆ltimos 6 meses",
  },
  {
    id: "historial-transacciones",
    titulo: "Historial de transacciones",
    descripcion:
      "Listado detallado de transacciones con filtros por cuenta, negocio, propiedad y rango de fechas.",
    destino: "/corporativo/informes/tablas",
    rango: "Personalizable",
  },
];

const MOCK_ULTIMOS_INFORMES = [
  {
    id: 1,
    nombre: "Flujo de caja 每 Junio 2025",
    fecha: "2025-07-02",
    rango: "01/06/2025 每 30/06/2025",
    tipo: "PDF",
  },
  {
    id: 2,
    nombre: "Rentabilidad propiedades 每 12 meses",
    fecha: "2025-07-01",
    rango: "01/07/2024 每 30/06/2025",
    tipo: "Excel",
  },
  {
    id: 3,
    nombre: "Ventas Chaparral 每 迆ltimos 3 meses",
    fecha: "2025-06-30",
    rango: "01/04/2025 每 30/06/2025",
    tipo: "Excel",
  },
  {
    id: 4,
    nombre: "Transacciones consolidadas 每 sistema",
    fecha: "2025-06-29",
    rango: "01/06/2025 每 29/06/2025",
    tipo: "Tabla interna",
  },
];

const FAVORITOS = [
  "Flujo de caja mensual",
  "Rentabilidad por propiedad",
  "Ventas Chaparral / Restaurantes",
];

export default function PanelInformes() {
  const formatoFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-SV", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  return (
    <div className="container-90 mx-auto space-y-6 pb-6">
      {/* HEADER */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Informes corporativos
          </h1>
          <p className="text-sm subtle mt-1 max-w-2xl">
            Acceso r芍pido a los principales reportes financieros y operativos
            de Inversiones JCF: propiedades, negocios, transacciones y flujo
            de caja consolidado.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <Link
            to="/corporativo/informes/resumen"
            className="btn-gradient btn-action btn-shimmer text-xs md:text-sm"
          >
            Ir al centro de informes avanzados
          </Link>
          <span className="text-[11px] subtle">
            Dise?ado para exportar a PDF / Excel y compartir con socios.
          </span>
        </div>
      </header>

      {/* INFORMES CLAVE */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {INFORMES_CLAVE.map((inf) => (
          <div
            key={inf.id}
            className="neo-card neo-card--tinted p-4 flex flex-col justify-between no-clip"
          >
            <div className="raise space-y-2">
              <h2 className="text-sm font-semibold">{inf.titulo}</h2>
              <p className="text-xs subtle leading-snug">{inf.descripcion}</p>
              <div className="mt-1 text-[11px] subtle">
                Rango por defecto: <span className="font-semibold">{inf.rango}</span>
              </div>
            </div>
            <div className="mt-3 raise flex justify-between items-center">
              <Link
                to={inf.destino}
                className="text-xs font-semibold text-[color-mix(in_oklab,var(--accent)_85%,var(--text)_15%)] hover:underline"
              >
                Ver detalles
              </Link>
              <span className="kpi-chip text-[10px]">Informe clave</span>
            </div>
          </div>
        ))}
      </section>

      {/* 迆LTIMOS INFORMES GENERADOS + FAVORITOS */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-4 items-start">
        {/* Tabla 迆ltimos informes */}
        <div className="neo-card p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">迆ltimos informes generados</h2>
            <span className="text-[11px] subtle">Historial reciente</span>
          </div>
          <div className="mt-2 overflow-auto max-h-72">
            <table className="w-full text-xs border-collapse table-lined">
              <thead className="bg-[color-mix(in_oklab,var(--panel)_90%,var(--accent)_10%)]">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold">
                    Nombre
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Fecha
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Rango
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ULTIMOS_INFORMES.map((r) => (
                  <tr key={r.id} className="hover:bg-[color-mix(in_oklab,var(--panel)_88%,var(--accent)_12%/9%)]">
                    <td className="px-2 py-2 align-top">
                      <div className="font-semibold">{r.nombre}</div>
                    </td>
                    <td className="px-2 py-2 align-top whitespace-nowrap">
                      {formatoFecha(r.fecha)}
                    </td>
                    <td className="px-2 py-2 align-top whitespace-nowrap">
                      {r.rango}
                    </td>
                    <td className="px-2 py-2 align-top whitespace-nowrap">
                      {r.tipo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] subtle mt-2">
            Este historial se alimentar芍 autom芍ticamente cada vez que generes o
            exportes un informe desde el m車dulo de Informes.
          </p>
        </div>

        {/* Favoritos / categor赤as */}
        <div className="neo-card p-4">
          <h2 className="text-sm font-semibold mb-2">
            Informes favoritos y categor赤as
          </h2>

          <div className="mb-3">
            <div className="text-[11px] subtle mb-1">M芍s usados por ti</div>
            <div className="flex flex-wrap gap-2">
              {FAVORITOS.map((f, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[color-mix(in_oklab,var(--panel)_85%,var(--accent)_15%/22%)] border border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div>
              <div className="font-semibold mb-1">Propiedades</div>
              <ul className="list-disc list-inside subtle space-y-1">
                <li>Flujo por propiedad (ES / USA)</li>
                <li>Ocupaci車n y rentas pendientes</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">Negocios</div>
              <ul className="list-disc list-inside subtle space-y-1">
                <li>Ventas y costos Chaparral / Restaurantes</li>
                <li>Margen operativo por negocio</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">Finanzas</div>
              <ul className="list-disc list-inside subtle space-y-1">
                <li>Resumen de bancos e indicadores de liquidez</li>
                <li>Flujo consolidado del sistema</li>
              </ul>
            </div>
          </div>

          <div className="mt-3 text-[11px] subtle">
            La idea es que desde aqu赤 entres en 1每2 clics al reporte correcto,
            y el m車dulo de <strong>Informes</strong> te permita ajustar filtros y
            exportar para compartir con socios o contabilidad.
          </div>
        </div>
      </section>
    </div>
  );
}
