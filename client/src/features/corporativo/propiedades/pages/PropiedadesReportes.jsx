// client/src/features/corporativo/Propiedades/PropiedadesReportes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/core/theme/ThemeProvider.jsx";

import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";
import { useIngresosStore } from "@/features/corporativo/propiedades/store/ingresos.store.js";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";

/* ---------------------- Helpers ---------------------- */
const cx = (...c) => c.filter(Boolean).join(" ");
const money = (n) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(Number(n || 0));
const moneyShort = (v) => `$${Math.round(Number(v || 0) / 1000)}k`;

const MILESTONES = new Set([0, 5, 10, 15]);
const YEARS = 15;
const INFLACION = 0.04;
const DASH = "??;

// Activa = empieza con "act" y NO contiene "vend"
const isActiveEstado = (estado) => {
  const e = String(estado || "").toLowerCase().trim();
  if (e.includes("vend")) return false;
  return /^act/.test(e);
};

// Valor actual: primero valores.valorActual, si no existe intenta valorHistorico último
const getValorActual = (p) => {
  const v = p?.valores?.valorActual;
  if (v !== "" && v != null) return Number(v) || 0;

  const last = [...(p?.valorHistorico || [])].sort(
    (a, b) => new Date(b?.fecha || 0) - new Date(a?.fecha || 0)
  )[0];

  return last ? Number(last.valor || 0) : 0;
};

// ID canónico (API): mongoId > _id > id > codigo
const getApiId = (x) => {
  const v = x?.mongoId ?? x?._id ?? x?.id ?? x?.codigo ?? null;
  return v ? String(v).trim() : "";
};

/* Labels del "Total" con ajuste en bordes */
function makeMilestoneLabel(serie, { fill = "#111827", stroke = "transparent" } = {}) {
  return function MilestoneLabelSafe(props) {
    const { x = 0, y = 0, value, index } = props || {};
    const yr = serie?.[index]?.year;
    if (yr == null || !MILESTONES.has(yr)) return null;

    const firstIdx = 0;
    const lastIdx = (serie?.length ?? 1) - 1;

    const dx = index === firstIdx ? 26 : index === lastIdx ? -14 : 0;
    const anchor = index === firstIdx ? "start" : index === lastIdx ? "end" : "middle";

    return (
      <text
        x={x + dx}
        y={y - 8}
        textAnchor={anchor}
        fontSize={11}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        paintOrder="stroke"
        style={{ mixBlendMode: "normal" }}
        pointerEvents="none"
        opacity={0.98}
      >
        {money(value)}
      </text>
    );
  };
}

/* ---------------------- Vista principal ---------------------- */
export default function PropiedadesReportes() {
  const { theme } = useTheme();

  // --- Tema (soporta múltiples "oscuros" Neo) ---
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const themeLower = (theme || "").toLowerCase();
  const DARK_KEYWORDS = [
    "dark",
    "royal",
    "dusk",
    "graphite",
    "ocean",
    "plum",
    "slate",
    "navy",
    "night",
    "midnight",
    "noir",
    "charcoal",
    "ink",
    "obsidian",
    "storm",
    "shadow",
  ];
  const LIGHT_OVERRIDES = ["stone"];

  const hasThemeName = themeLower.trim().length > 0;
  const isDarkByName = DARK_KEYWORDS.some((k) => themeLower.includes(k));
  const isLightOverride = LIGHT_OVERRIDES.some((k) => themeLower.includes(k));
  const isDark = hasThemeName ? isDarkByName && !isLightOverride : prefersDark;

  const axisColor = isDark ? "#E5E7EB" : "#374151";
  const gridAlpha = isDark ? 0.24 : 0.18;
  const gridColor = isDark ? `rgba(229,231,235,${gridAlpha})` : `rgba(55,65,81,${gridAlpha})`;
  const tooltipStyle = {
    backgroundColor: isDark ? "rgba(17,24,39,0.9)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
    borderRadius: 8,
    fontSize: 12,
  };
  const tickStroke = isDark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.45)";
  const tickProps = { fill: axisColor, stroke: tickStroke, strokeWidth: 0.5 };

  const totalStroke = isDark ? "#FFFFFF" : "#111827";
  const labelFill = isDark ? "#FFFFFF" : axisColor;
  const labelStroke = isDark ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.55)";

  // ===== Stores =====
  const propiedadesAll = usePropertiesStore((s) => s.propiedades) || [];
  const propsLoaded = usePropertiesStore((s) => s.loaded);
  const propsLoading = usePropertiesStore((s) => s.loading);
  const cargarProps = usePropertiesStore((s) => s.cargar);

  const unidadesAll = useUnitsStore((s) => s.items) || [];
  const unitsLoaded = useUnitsStore((s) => s.loaded);
  const unitsLoading = useUnitsStore((s) => s.loading);
  const cargarUnits = useUnitsStore((s) => s.cargar);

  const ingresosAll = useIngresosStore((s) => s.ingresos) || [];
  const ingLoaded = useIngresosStore((s) => s.loaded);
  const ingLoading = useIngresosStore((s) => s.loading);
  const cargarIngresos = useIngresosStore((s) => s.cargar);

  useEffect(() => {
    if (!propsLoaded && !propsLoading) cargarProps({ force: false });
    if (!unitsLoaded && !unitsLoading) cargarUnits({ force: false });
    if (!ingLoaded && !ingLoading) cargarIngresos({ force: false });
  }, [
    propsLoaded,
    propsLoading,
    cargarProps,
    unitsLoaded,
    unitsLoading,
    cargarUnits,
    ingLoaded,
    ingLoading,
    cargarIngresos,
  ]);

  // Solo propiedades ACTIVAS
  const propiedades = useMemo(
    () => (propiedadesAll || []).filter((p) => isActiveEstado(p?.estado)),
    [propiedadesAll]
  );

  // Columnas canónicas: pid (key) + label (UI)
  const propColumns = useMemo(() => {
    return (propiedades || [])
      .map((p) => {
        const pid = getApiId(p);
        if (!pid) return null;
        return {
          pid,
          label: p?.nombre || `Propiedad ${pid}`,
        };
      })
      .filter(Boolean);
  }, [propiedades]);

  // Set de ids activos (para filtrar unidades/ingresos)
  const activeIds = useMemo(() => new Set(propColumns.map((c) => c.pid)), [propColumns]);

  /* --------- Totales por país (solo activas) --------- */
  const { byCountry } = useMemo(() => {
    const map = new Map();
    for (const p of propiedades) {
      const pid = getApiId(p);
      const pais = p?.ubicacion?.pais || p?.pais || "??;
      const valor = getValorActual(p);

      if (!map.has(pais)) map.set(pais, { inversion: null, valor: 0, props: [] });
      const row = map.get(pais);
      row.valor += valor;
      row.props.push(p?.nombre || `Propiedad ${pid || ""}`);
    }
    return { byCountry: map };
  }, [propiedades]);

  /* --------- Inversión y valor actual (por propiedad) --------- */
  const costosValorPorProp = useMemo(() => {
    const rows = propColumns.map((c) => {
      const p = (propiedades || []).find((x) => getApiId(x) === c.pid);
      return {
        id: c.pid,
        nombre: c.label,
        inversion: null,
        valor: getValorActual(p),
      };
    });

    const totals = rows.reduce(
      (acc, r) => {
        acc.valor += r.valor || 0;
        return acc;
      },
      { inversion: null, valor: 0 }
    );

    return { rows, totals };
  }, [propColumns, propiedades]);

  /* --------- Proyección de valor 15 años --------- */
  const { serieValor, coloresProp, sinCrecimientoValor } = useMemo(() => {
    const bases = propColumns.map((c) => {
      const p = (propiedades || []).find((x) => getApiId(x) === c.pid);
      return {
        id: c.pid,
        nombre: c.label,
        base: getValorActual(p) || 0,
      };
    });

    const palette = ["#60A5FA", "#34D399", "#F59E0B", "#F87171", "#A78BFA", "#06B6D4", "#84CC16"];
    const colorMap = {};
    bases.forEach((b, i) => (colorMap[b.id] = palette[i % palette.length]));

    const serie = [];
    for (let year = 0; year <= YEARS; year++) {
      const row = { year };
      let tot = 0;

      for (const b of bases) {
        const val = b.base * Math.pow(1 + INFLACION, year);
        row[b.id] = val;
        tot += val;
      }

      row.total = tot;
      serie.push(row);
    }

    const sinCrecimiento = bases.filter((b) => b.base <= 0);
    return { serieValor: serie, coloresProp: colorMap, sinCrecimientoValor: sinCrecimiento };
  }, [propColumns, propiedades]);

  /* --------- Proyección ingresos acumulados 1..15 --------- */
  const projIngresos = useMemo(() => {
    const anualPorProp = new Map();

    (unidadesAll || []).forEach((u) => {
      const pid = String(u?.propiedadId ?? "").trim();
      if (!pid) return;
      if (!activeIds.has(pid)) return;

      // Si tu backend usa otro campo distinto a rentaMensual, aquí es donde se ajusta.
      const rentaMensual = Number(u?.rentaMensual ?? 0);
      const anual = rentaMensual * 12;

      anualPorProp.set(pid, (anualPorProp.get(pid) || 0) + anual);
    });

    const rows = Array.from({ length: YEARS }, (_, i) => i + 1).map((year) => {
      const row = { year, total: 0 };
      propColumns.forEach((c) => {
        const anual = anualPorProp.get(c.pid) || 0;
        const acumulado = anual * year;
        row[c.pid] = acumulado;
        row.total += acumulado;
      });
      return row;
    });

    const resumenAnual = propColumns.map((c) => ({
      pid: c.pid,
      nombre: c.label,
      ingresoAnual: anualPorProp.get(c.pid) || 0,
    }));

    const sinCrecIng = resumenAnual.filter((r) => (r.ingresoAnual || 0) <= 0);

    return { rows, resumenAnual, sinCrecIngresos: sinCrecIng };
  }, [unidadesAll, activeIds, propColumns]);

  /* --------- Histórico de ingresos (solo props activas) --------- */
  const historialIngresos = useMemo(() => {
    const out = [];

    for (const i of ingresosAll || []) {
      const pid = String(i?.propiedadId ?? i?.propiedad ?? i?.propId ?? "").trim();
      if (!pid) continue;
      if (!activeIds.has(pid)) continue;

      const ym = i?.mes || i?.periodo || "";
      const col = propColumns.find((c) => c.pid === pid);

      out.push({
        ym,
        week: i?.week ?? i?.semana ?? null,
        fecha: i?.fecha ? new Date(i.fecha) : null,
        propiedadId: pid,
        propiedad: col?.label || `Propiedad ${pid}`,
        unidad: i?.unidadId || i?.unidad || "??,
        ingreso: Number(i?.ingreso ?? i?.monto ?? 0),
      });
    }

    return out.sort((a, b) => String(a.ym).localeCompare(String(b.ym)));
  }, [ingresosAll, activeIds, propColumns]);

  // Altura dinámica del gráfico
  const chartHeight = Math.min(560, Math.max(340, 220 + propColumns.length * 28));

  /* ---------- Pivot ingresos ---------- */
  const [groupBy, setGroupBy] = useState("mes"); // "mes" | "ano" | "semana"
  const [selectedKey, setSelectedKey] = useState(null);

  const columnasPivot = useMemo(() => {
    // Columnas visibles por nombre (UI)
    const fromProps = propColumns.map((c) => c.label);
    const fromData = Array.from(new Set((historialIngresos || []).map((r) => r?.propiedad).filter(Boolean)));
    const uniq = [...fromProps, ...fromData].filter((v, i, a) => a.indexOf(v) === i);
    return uniq.map((n) => ({ id: n, nombre: n }));
  }, [propColumns, historialIngresos]);

  const buildPivot = useMemo(() => {
    return (mode) => {
      const map = new Map();

      (historialIngresos || []).forEach((r) => {
        const ym = String(r.ym || "");
        let key;

        if (mode === "ano") key = ym.slice(0, 4);
        else if (mode === "semana") key = r.week != null ? String(r.week) : "";
        else key = ym;

        if (!key) return;

        if (!map.has(key)) map.set(key, { key, label: key, byProp: {}, total: 0 });
        const row = map.get(key);

        const propName = r.propiedad || `Propiedad ${r.propiedadId || ""}`;
        const v = Number(r.ingreso || 0);

        row.byProp[propName] = (row.byProp[propName] || 0) + v;
        row.total += v;
      });

      const rows = Array.from(map.values()).sort((a, b) => String(a.key).localeCompare(String(b.key)));

      const totalsByProp = {};
      columnasPivot.forEach((c) => {
        totalsByProp[c.id] = rows.reduce((s, rr) => s + (rr.byProp[c.id] || 0), 0);
      });

      const total = rows.reduce((s, rr) => s + rr.total, 0);
      return { rows, totalsByProp, total };
    };
  }, [historialIngresos, columnasPivot]);

  const pivot = useMemo(() => buildPivot(groupBy), [buildPivot, groupBy]);
  const activeKey = selectedKey ?? (pivot.rows[pivot.rows.length - 1]?.key ?? null);

  const filteredDetalle = useMemo(() => {
    if (!activeKey) return [];
    return (historialIngresos || []).filter((r) => {
      const ym = String(r.ym || "");
      if (groupBy === "ano") return ym.slice(0, 4) === String(activeKey);
      if (groupBy === "semana") return String(r.week || "") === String(activeKey);
      return ym === String(activeKey);
    });
  }, [historialIngresos, groupBy, activeKey]);

  return (
    <section className="space-y-6" data-theme={theme}>
      <header>
        <p className="text-sm subtle">
          Inversión vs. valor actual por propiedad activa, proyección de valor a 15 años (4% anual) e ingresos (histórico y proyección).
        </p>
      </header>

      {/* ===== DIV 1 ===== */}
      <div className="neo-card neo-card--deep neo-card--tinted p-4 space-y-4">
        <h3 className="text-base font-semibold">Inversión, valor actual y proyección</h3>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <aside className="xl:col-span-4 space-y-4">
            <div className="neo-card neo-card--deep neo-card--tinted p-4">
              <div className="text-sm font-semibold mb-2">Por país</div>
              {[...byCountry.entries()].map(([pais, v]) => (
                <div key={pais} className="neo-plate neo-plate--tinted p-3 rounded-lg mb-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{pais}</div>
                    <div className="text-xs subtle">({v.props.length} propiedades activas)</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                      <div className="subtle text-xs">Inversión</div>
                      <div className="font-semibold">{DASH}</div>
                    </div>
                    <div>
                      <div className="subtle text-xs">Valor actual</div>
                      <div className="font-semibold">{money(v.valor)}</div>
                    </div>
                    <div>
                      <div className="subtle text-xs">Ganancia</div>
                      <div className="font-semibold">{DASH}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="neo-card neo-card--deep neo-card--tinted p-4">
              <div className="text-sm font-semibold mb-2">Inversión y valor actual (por propiedad)</div>
              <div className="overflow-auto rounded-lg ring-1 ring-border">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--chip)]">
                    <tr>
                      <th className="text-left px-3 py-2">Nombre</th>
                      <th className="text-right px-3 py-2">Inversión</th>
                      <th className="text-right px-3 py-2">Valor actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costosValorPorProp.rows.map((r) => (
                      <tr key={r.id} className="border-t border-[var(--border)]">
                        <td className="px-3 py-2">{r.nombre}</td>
                        <td className="px-3 py-2 text-right">{DASH}</td>
                        <td className="px-3 py-2 text-right">{money(r.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[var(--border)] font-semibold">
                      <td className="px-3 py-2">Totales</td>
                      <td className="px-3 py-2 text-right">{DASH}</td>
                      <td className="px-3 py-2 text-right">{money(costosValorPorProp.totals.valor)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </aside>

          <main className="xl:col-span-8 space-y-4">
            {!!sinCrecimientoValor.length && (
              <div className="neo-plate neo-plate--tinted p-3 rounded-lg">
                <div className="text-sm font-semibold mb-1">Atención</div>
                <div className="text-sm">
                  <span className="subtle">Sin crecimiento de valor (base = 0): </span>
                  {sinCrecimientoValor.map((p, i) => (
                    <span key={p.id} className="inline-block mr-2">
                      {p.nombre}{i < sinCrecimientoValor.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="neo-card neo-card--tinted neo-card--deep p-4">
              <div className="text-sm font-semibold">Proyección de valor (15 años, 4% anual)</div>
              <div className="text-xs subtle mb-2">Labels en años 0, 5, 10 y 15 (tooltip para el resto)</div>

              <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={serieValor} margin={{ top: 16, right: 48, left: 44, bottom: 20 }}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="year"
                      ticks={[0, 5, 10, 15]}
                      label={{ value: "A?o", position: "insideBottom", offset: -4, fill: axisColor }}
                      tick={tickProps}
                      axisLine={{ stroke: axisColor }}
                      tickLine={{ stroke: axisColor }}
                    />
                    <YAxis
                      tickFormatter={moneyShort}
                      width={70}
                      tick={tickProps}
                      axisLine={{ stroke: axisColor }}
                      tickLine={{ stroke: axisColor }}
                    />
                    <Tooltip
                      formatter={(v) => money(v)}
                      labelFormatter={(l) => `A?o ${l}`}
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: axisColor }}
                      labelStyle={{ color: axisColor }}
                    />
                    <Legend wrapperStyle={{ color: axisColor }} iconType="plainline" />

                    {propColumns.map((c) => (
                      <Line
                        key={c.pid}
                        type="monotone"
                        dataKey={c.pid}
                        dot={false}
                        stroke={coloresProp[c.pid]}
                        strokeWidth={2}
                        name={c.label}
                      />
                    ))}

                    <Line type="monotone" dataKey="total" dot={false} stroke={totalStroke} strokeWidth={3.25} name="Total">
                      <LabelList content={makeMilestoneLabel(serieValor, { fill: labelFill, stroke: labelStroke })} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ===== DIV 2 ===== */}
      <div className="neo-card neo-card--deep neo-card--tinted p-4 space-y-4">
        <h3 className="text-base font-semibold">Ingresos generados por propiedad</h3>

        <div className="flex flex-wrap gap-2">
          {projIngresos.resumenAnual.map((r) => (
            <span key={r.pid} className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md neo-plate text-xs">
              <b>{r.nombre}:</b> {money(r.ingresoAnual)}
            </span>
          ))}
          {!projIngresos.resumenAnual.length && <span className="text-sm subtle">No hay ingresos configurados.</span>}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <aside className="xl:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Resumen por periodo × propiedad</div>
              <div className="inline-flex gap-1 text-xs">
                {[
                  { k: "mes", label: "Mes" },
                  { k: "ano", label: "A?o" },
                  { k: "semana", label: "Semana" },
                ].map((opt) => (
                  <button
                    key={opt.k}
                    onClick={() => { setGroupBy(opt.k); setSelectedKey(null); }}
                    className={cx(
                      "px-2 py-1 rounded-md border",
                      groupBy === opt.k ? "neo-plate font-semibold" : "neo-plate--tinted subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-auto rounded-lg ring-1 ring-border">
              <table className="w-full text-sm">
                <thead className="bg-[var(--chip)]">
                  <tr>
                    <th className="text-left px-3 py-2 w-36">Periodo</th>
                    {columnasPivot.map((c) => (
                      <th key={c.id} className="text-right px-3 py-2">{c.nombre}</th>
                    ))}
                    <th className="text-right px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pivot.rows.map((r) => (
                    <tr
                      key={r.key}
                      className={cx(
                        "border-t border-[var(--border)] cursor-pointer hover:bg-[var(--chip)]/60",
                        activeKey === r.key ? "bg-[var(--chip)]/80" : ""
                      )}
                      onClick={() => setSelectedKey(r.key)}
                      title="Ver detalle a la derecha"
                    >
                      <td className="px-3 py-2">{r.label}</td>
                      {columnasPivot.map((c) => (
                        <td key={c.id} className="px-3 py-2 text-right">{money(r.byProp[c.id] || 0)}</td>
                      ))}
                      <td className="px-3 py-2 text-right font-semibold">{money(r.total)}</td>
                    </tr>
                  ))}

                  {!pivot.rows.length && (
                    <tr>
                      <td className="px-3 py-3 subtle" colSpan={columnasPivot.length + 2}>
                        {groupBy === "semana"
                          ? "No hay semanas disponibles (tu dataset no trae 'week/semana')."
                          : "Aún no hay registros para este agrupamiento."}
                      </td>
                    </tr>
                  )}
                </tbody>

                {!!pivot.rows.length && (
                  <tfoot>
                    <tr className="border-t border-[var(--border)] font-semibold">
                      <td className="px-3 py-2">Totales</td>
                      {columnasPivot.map((c) => (
                        <td key={c.id} className="px-3 py-2 text-right">
                          {money(pivot.totalsByProp[c.id] || 0)}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right">{money(pivot.total)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </aside>

          <main className="xl:col-span-7 space-y-3">
            <div className="text-sm font-semibold">
              Detalle {groupBy === "mes" ? "del mes" : groupBy === "ano" ? "del año" : "de la semana"}{" "}
              <span className="opacity-80">{activeKey || "??}</span>
            </div>

            <div className="overflow-auto rounded-lg ring-1 ring-border">
              <table className="w-full text-sm">
                <thead className="bg-[var(--chip)]">
                  <tr>
                    <th className="text-left px-3 py-2">Fecha</th>
                    <th className="text-left px-3 py-2">Propiedad</th>
                    <th className="text-left px-3 py-2">Unidad</th>
                    <th className="text-right px-3 py-2">Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDetalle.map((r, idx) => (
                    <tr key={`${r.ym}-${idx}`} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2">
                        {r.fecha
                          ? `${r.fecha.getFullYear()}-${String(r.fecha.getMonth() + 1).padStart(2, "0")}-${String(
                            r.fecha.getDate()
                          ).padStart(2, "0")}`
                          : r.ym || "??}
                      </td>
                      <td className="px-3 py-2">{r.propiedad}</td>
                      <td className="px-3 py-2">{r.unidad}</td>
                      <td className="px-3 py-2 text-right">{money(r.ingreso)}</td>
                    </tr>
                  ))}

                  {!filteredDetalle.length && (
                    <tr>
                      <td className="px-3 py-3 subtle" colSpan={4}>
                        No hay movimientos en el periodo seleccionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>

        <div className="neo-card neo-card--tinted neo-card--deep p-4">
          <div className="text-sm font-semibold mb-2">Histórico de ingresos (BD/Store)</div>
          {historialIngresos.length ? (
            <div className="overflow-auto rounded-lg ring-1 ring-border">
              <table className="w-full text-sm">
                <thead className="bg-[var(--chip)]">
                  <tr>
                    <th className="text-left px-3 py-2">A?o-Mes</th>
                    <th className="text-left px-3 py-2">Propiedad</th>
                    <th className="text-left px-3 py-2">Unidad</th>
                    <th className="text-right px-3 py-2">Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {historialIngresos.map((r, idx) => (
                    <tr key={`${r.ym}-${idx}`} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2">{r.ym}</td>
                      <td className="px-3 py-2">{r.propiedad}</td>
                      <td className="px-3 py-2">{r.unidad}</td>
                      <td className="px-3 py-2 text-right">{money(r.ingreso)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm subtle">Aún no hay registros.</div>
          )}
        </div>
      </div>

      {/* ===== DIV 3 ===== */}
      <div className="neo-card neo-card--deep neo-card--tinted p-4 space-y-4">
        <h3 className="text-base font-semibold">Proyección de ingresos por propiedad</h3>

        <div className="neo-card neo-card--tinted neo-card--deep p-4">
          <div className="text-sm font-semibold">Proyección de ingresos acumulados (1??5 años)</div>
          <div className="text-xs subtle mb-3">renta mensual × 12 × año</div>

          <div className="overflow-auto rounded-lg ring-1 ring-border">
            <table className="w-full text-sm">
              <thead className="bg-[var(--chip)]">
                <tr>
                  <th className="text-left px-3 py-2">A?o</th>

                  {/* ??FIX: mostrar nombre, NO el id */}
                  {propColumns.map((c) => (
                    <th key={c.pid} className="text-right px-3 py-2 whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}

                  <th className="text-right px-3 py-2">TOT</th>
                </tr>
              </thead>
              <tbody>
                {projIngresos.rows.map((row) => (
                  <tr key={row.year} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">{row.year}</td>

                    {propColumns.map((c) => (
                      <td key={c.pid} className="px-3 py-2 text-right">
                        {money(row[c.pid] || 0)}
                      </td>
                    ))}

                    <td className="px-3 py-2 text-right font-semibold">{money(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!!projIngresos.sinCrecIngresos.length && (
            <div className="neo-plate neo-plate--tinted p-3 rounded-lg mt-3">
              <div className="text-sm">
                <span className="subtle">Sin crecimiento de ingresos (ingreso anual = 0): </span>
                {projIngresos.sinCrecIngresos.map((p, i) => (
                  <span key={p.pid} className="inline-block mr-2">
                    {p.nombre}{i < projIngresos.sinCrecIngresos.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


