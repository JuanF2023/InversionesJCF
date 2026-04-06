// client/src/features/corporativo/dashboards/components/PanelIndicadores.jsx
import React from "react";

const MOCK_KPIS = {
  ocupacionTotal: 0.92,
  ocupacionES: 0.95,
  ocupacionUSA: 0.88,
  flujoMes: 2450,
  roiProps: 0.16,
  roiNegocios: 0.22,
};

const MOCK_TOP_ACTIVOS = [
  { nombre: "APT04 每 Lourdes Col車n", tipo: "Apartamento", pais: "El Salvador", ingreso: 650 },
  { nombre: "LOC01 每 Chaparral", tipo: "Restaurante", pais: "El Salvador", ingreso: 540 },
  { nombre: "APT01 每 Los 芍ngeles", tipo: "Apartamento", pais: "USA", ingreso: 520 },
  { nombre: "APT02 每 Los 芍ngeles", tipo: "Apartamento", pais: "USA", ingreso: 480 },
  { nombre: "LOC02 每 Comercial Lourdes", tipo: "Local", pais: "El Salvador", ingreso: 430 },
];

const MOCK_ALERTAS = [
  "APT02 每 Los 芍ngeles presenta flujo negativo 2 meses seguidos.",
  "LOC01 每 Chaparral: revisar margen de utilidad de men迆.",
  "APT04 每 Lourdes Col車n: contrato por vencer en 60 d赤as.",
];

const MOCK_SERIES_MESES = [
  { mes: "Ene", ingreso: 1800 },
  { mes: "Feb", ingreso: 1950 },
  { mes: "Mar", ingreso: 2100 },
  { mes: "Abr", ingreso: 2300 },
  { mes: "May", ingreso: 2500 },
  { mes: "Jun", ingreso: 2450 },
];

const MOCK_BY_AREA = [
  { label: "Lourdes Col車n (ES)", valor: 0.42 },
  { label: "Chaparral / Restaurantes (ES)", valor: 0.28 },
  { label: "Los 芍ngeles (USA)", valor: 0.30 },
];

export default function PanelIndicadores() {
  const formatoMoneda = (v) =>
    new Intl.NumberFormat("es-SV", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const formatoPorcentaje = (v) =>
    `${(v * 100).toFixed(1).replace(".", ",")}%`;

  const totalByArea = MOCK_BY_AREA.reduce((acc, cur) => acc + cur.valor, 0) || 1;

  return (
    <div className="container-90 mx-auto space-y-6 pb-6">
      {/* HEADER + FILTROS */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Indicadores clave del portafolio
          </h1>
          <p className="text-sm subtle mt-1 max-w-2xl">
            Vista ejecutiva de ocupaci車n, flujo de caja y rentabilidad de todas
            las propiedades y negocios de Inversiones JCF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
          <select className="neo-input h-9 px-3 text-xs md:text-sm">
            <option>迆ltimo mes</option>
            <option>迆ltimos 3 meses</option>
            <option>迆ltimos 12 meses</option>
          </select>
          <select className="neo-input h-9 px-3 text-xs md:text-sm">
            <option>Global (ES + USA)</option>
            <option>El Salvador</option>
            <option>USA</option>
          </select>
          <select className="neo-input h-9 px-3 text-xs md:text-sm">
            <option>Todos los activos</option>
            <option>Propiedades</option>
            <option>Restaurantes</option>
          </select>
        </div>
      </header>

      {/* FILA KPIs PRINCIPALES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="neo-card neu-strong p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] subtle">
              Flujo de caja neto (mes)
            </span>
            <span className="kpi-chip kpi-chip--up text-[10px]">+ Estable</span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">
            {formatoMoneda(MOCK_KPIS.flujoMes)}
          </div>
          <p className="text-xs subtle mt-1">
            Ingresos 每 egresos considerando propiedades y restaurantes.
          </p>
        </div>

        <div className="neo-card neu-strong p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] subtle">
              Ocupaci車n total
            </span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">
            {formatoPorcentaje(MOCK_KPIS.ocupacionTotal)}
          </div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="metric-row">
                <span className="dot dot--activos" />
                ES
              </span>
              <span className="tabular-nums">
                {formatoPorcentaje(MOCK_KPIS.ocupacionES)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="metric-row">
                <span className="dot dot--const" />
                USA
              </span>
              <span className="tabular-nums">
                {formatoPorcentaje(MOCK_KPIS.ocupacionUSA)}
              </span>
            </div>
          </div>
        </div>

        <div className="neo-card neu-strong p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] subtle">
              ROI promedio 每 Propiedades
            </span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">
            {formatoPorcentaje(MOCK_KPIS.roiProps)}
          </div>
          <p className="text-xs subtle mt-1">
            Considera flujo de renta y gastos directos asociados a las unidades.
          </p>
        </div>

        <div className="neo-card neu-strong p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] subtle">
              ROI promedio 每 Negocios
            </span>
          </div>
          <div className="text-2xl font-semibold tabular-nums">
            {formatoPorcentaje(MOCK_KPIS.roiNegocios)}
          </div>
          <p className="text-xs subtle mt-1">
            Incluye restaurantes (Chaparral) y otros negocios ligados a activos.
          </p>
        </div>
      </section>

      {/* FILA GR芍FICOS */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-4 items-stretch">
        {/* Ingresos 迆ltimos 6 meses */}
        <div className="neo-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold">
                Ingresos totales 迆ltimos 6 meses
              </h2>
              <p className="text-xs subtle">
                Vista r芍pida de tendencia global de ingresos.
              </p>
            </div>
          </div>

          <div className="mt-4 flex-1 flex items-end gap-2 md:gap-3">
            {MOCK_SERIES_MESES.map((p) => {
              const max = Math.max(...MOCK_SERIES_MESES.map((x) => x.ingreso)) || 1;
              const pct = (p.ingreso / max) * 100;

              return (
                <div
                  key={p.mes}
                  className="flex-1 flex flex-col items-center justify-end gap-1"
                >
                  <div className="w-full bg-border/60 rounded-full h-32 overflow-hidden flex items-end">
                    <div
                      className="w-full bank-bar rounded-full"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] subtle mt-1">{p.mes}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuci車n por 芍rea */}
        <div className="neo-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold">Distribuci車n por 芍rea</h2>
              <p className="text-xs subtle">
                Porcentaje del ingreso que proviene de cada zona.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {MOCK_BY_AREA.map((item) => {
              const pct = (item.valor / totalByArea) * 100;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{item.label}</span>
                    <span className="tabular-nums">
                      {pct.toFixed(1).replace(".", ",")}%
                    </span>
                  </div>
                  <div className="segbar">
                    <span
                      className="segbar__chunk segbar__activos"
                      style={{ width: `${pct}%` }}
                    />
                    <span
                      className="segbar__chunk segbar__rest"
                      style={{ width: `${100 - pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] subtle">
            Lourdes Col車n incluye apartamentos y locales; Chaparral agrupa los
            restaurantes; Los 芍ngeles concentra propiedades de renta en USA.
          </div>
        </div>
      </section>

      {/* FILA TOP ACTIVOS + ALERTAS */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4 items-start">
        {/* Top activos */}
        <div className="neo-card p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Top 5 activos por ingreso mensual</h2>
            <span className="text-[11px] subtle">Corte: mes actual</span>
          </div>
          <div className="mt-2 space-y-[4px]">
            {MOCK_TOP_ACTIVOS.map((a, idx) => (
              <div
                key={a.nombre}
                className="bank-row"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bank-chip text-[10px]">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {a.nombre}
                    </div>
                    <div className="text-[11px] subtle truncate">
                      {a.tipo} ﹞ {a.pais}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold tabular-nums">
                  {formatoMoneda(a.ingreso)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="neo-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Alertas r芍pidas</h2>
            <span className="kpi-chip text-[10px]">Riesgos</span>
          </div>
          <ul className="mt-2 space-y-2 text-xs">
            {MOCK_ALERTAS.map((msg, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg bg-[color-mix(in_oklab,var(--panel)_88%,#f97316_12%)] border border-[color-mix(in_oklab,var(--border)_75%,#f97316_25%)] px-3 py-2"
              >
                <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span>{msg}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] subtle mt-3">
            Estas alertas se alimentar芍n autom芍ticamente a partir de tus
            transacciones y configuraciones de propiedades/negocios.
          </p>
        </div>
      </section>
    </div>
  );
}
