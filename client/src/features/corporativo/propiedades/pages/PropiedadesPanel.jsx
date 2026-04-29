// client/src/features/corporativo/Propiedades/PropiedadesPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/core/theme/ThemeProvider.jsx";

/* Stores modulares */
import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";

import { useNegociosStore } from "@/features/corporativo/negocios/store/negocios.store.js";
import { usePaisesStore } from "@/features/corporativo/catalogos/store/paises.store.js";

import {
  BarChart3,
  TrendingUp,
  Home as HomeIcon,
  Filter,
  X as XIcon,
  ListOrdered,
  EyeOff,
  PieChart as PieIcon,
  Globe,
  BadgeDollarSign,
  HandCoins,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

const cx = (...c) => c.filter(Boolean).join(" ");

const money = (n) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

const moneyShort = (n) => {
  const v = Number(n || 0);
  if (!Number.isFinite(v)) return "";
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return v.toFixed(1);
};

const formatPercent = (val) =>
  `${Number(val || 0).toLocaleString("es-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

/* ---------- helpers estado ---------- */
const isSoldEstado = (estado) => /vend/i.test(String(estado || ""));
const isActiveEstado = (estado) => {
  const e = String(estado || "").toLowerCase().trim();
  if (e.includes("vend")) return false;
  return /^act/.test(e);
};

/* ---------- helpers valores ---------- */
const getValorActual = (p) => {
  if (p?.valores?.valorActual !== "" && p?.valores?.valorActual != null) {
    return Number(p.valores.valorActual) || 0;
  }
  const hist = Array.isArray(p?.valorHistorico) ? p.valorHistorico : [];
  if (!hist.length) return 0;
  const last = [...hist].sort(
    (a, b) => new Date(b?.fecha || 0) - new Date(a?.fecha || 0)
  )[0];
  return last ? Number(last.valor || 0) || 0 : 0;
};

const getValorCompra = (p) => {
  const raw =
    p?.valores?.valorCompra ??
    p?.historia?.precioCompra ??
    p?.historia?.precio_compra ??
    p?.valorCompra ??
    p?.precioCompra ??
    p?.precio_compra;

  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * Valor de venta (si existe)
 * - No inventa datos: si no hay, retorna null.
 */
const getValorVenta = (p) => {
  const raw =
    p?.valores?.valorVenta ??
    p?.historia?.precioVenta ??
    p?.historia?.precio_venta ??
    p?.valorVenta ??
    p?.precioVenta ??
    p?.precio_venta;

  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const getFechaVenta = (p) => {
  const raw =
    p?.historia?.fechaVenta ??
    p?.historia?.fecha_venta ??
    p?.fechaVenta ??
    p?.fecha_venta ??
    p?.venta?.fecha;
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

const monthLabel = (d) =>
  d
    ? d.toLocaleString("es-US", { month: "short", year: "numeric" })
    : "??";

/* ---------- UI ---------- */
function KpiCard({ label, value, note, icon: Icon }) {
  return (
    <div
      className={cx(
        "neo-plate neo-plate--deep neo-plate--tinted raise neu-strong",
        "p-4 md:p-5 flex flex-col gap-2"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide opacity-70">{label}</div>
          <div className="mt-1 text-3xl font-semibold leading-none">{value}</div>
          {note ? <div className="mt-2 text-sm opacity-70">{note}</div> : null}
        </div>

        {Icon ? (
          <div className="shrink-0 h-9 w-9 rounded-full neo-chip flex items-center justify-center">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MiniKpi({ label, value, icon: Icon, title }) {
  return (
    <div
      className="neo-plate neo-plate--tinted px-3 py-2 rounded-xl flex items-center justify-between gap-2"
      title={title}
    >
      <div className="flex items-center gap-2 text-xs subtle min-w-0">
        {Icon && <Icon size={14} />}
        <span className="truncate">{label}</span>
      </div>
      <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}

/* ---------- Charts helpers ---------- */
const computeTop5Activas = (list = []) =>
  (Array.isArray(list) ? list : [])
    .filter((p) => isActiveEstado(p.estado))
    .map((p) => ({
      id: p.id ?? p.codigo ?? p._id,
      codigo: p.codigo,
      nombre: p.nombre || `Propiedad ${p.id ?? p.codigo ?? ""}`,
      valorActual: getValorActual(p),
      valorInvertido: getValorCompra(p) ?? 0,
    }))
    .sort((a, b) => b.valorActual - a.valorActual)
    .slice(0, 5);

const computeTop5VendidasGanancia = (list = []) =>
  (Array.isArray(list) ? list : [])
    .filter((p) => isSoldEstado(p.estado))
    .map((p) => {
      const compra = getValorCompra(p);
      const venta = getValorVenta(p);
      const gan = compra != null && venta != null ? venta - compra : null;
      return {
        id: p.id ?? p.codigo ?? p._id,
        codigo: p.codigo,
        nombre: p.nombre || `Propiedad ${p.id ?? p.codigo ?? ""}`,
        ganancia: gan ?? 0,
        venta: venta ?? 0,
      };
    })
    .sort((a, b) => b.ganancia - a.ganancia)
    .slice(0, 5);

function TopTooltip({ active, payload, label, lines = [] }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="neo-plate neo-plate--tinted px-3 py-2 rounded-xl text-[11px] space-y-1"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <div className="font-semibold truncate max-w-[220px]">{label}</div>
      {lines.map((ln) => (
        <div key={ln.key} className="flex items-center justify-between gap-4">
          <span className="subtle">{ln.label}</span>
          <span className="font-semibold">{ln.value(payload)}</span>
        </div>
      ))}
    </div>
  );
}

/* =====================
   FILTROS (jerarqu??a)
===================== */
const DEFAULT_FILTERS = {
  search: "",
  pais: "all", // por defecto: todos los pa??ses
  estado: "activos", // por defecto: activos (portafolio)
};

export default function PropiedadesPanel() {
  const { theme } = useTheme();

  /* STORES */
  const propiedades = usePropertiesStore((s) => s.propiedades) || [];
  const { kpis, cargar: cargarPropiedades, loading: loadingProps, loaded: propsLoaded } =
    usePropertiesStore((s) => ({
      kpis: s.kpis,
      cargar: s.cargar,
      loading: s.loading,
      loaded: s.loaded,
    }));

  const unidades = useUnitsStore((s) => s.unidades) || [];
  const { cargar: cargarUnidades, loading: loadingUnidades, loaded: unidadesLoaded } =
    useUnitsStore((s) => ({
      cargar: s.cargar,
      loading: s.loading,
      loaded: s.loaded,
    }));


  const negocios = useNegociosStore ? useNegociosStore((s) => s.negocios || []) : [];

  const paisesItems = usePaisesStore((s) => s.items) || [];
  const paisesLoading = usePaisesStore((s) => s.loading);
  const loadPaises = usePaisesStore((s) => s.load);

  /* LOAD */
  useEffect(() => {
    (async () => {
      try {
        if (!propsLoaded && !loadingProps) await cargarPropiedades?.({ force: false });
        if (!unidadesLoaded && !loadingUnidades) await cargarUnidades?.({ force: false });

        if (!paisesItems?.length && !paisesLoading) await loadPaises?.({ force: false });
      } catch {
        // Silencio intencional en panel.
      }
    })();
  }, [
    propsLoaded,
    loadingProps,
    cargarPropiedades,
    unidadesLoaded,
    loadingUnidades,
    cargarUnidades,

    paisesItems,
    paisesLoading,
    loadPaises,
  ]);

  const paisOptions = useMemo(() => {
    const list = Array.isArray(paisesItems) ? paisesItems : [];
    return [...list].sort((a, b) =>
      String(a?.nombre || "")
        .toLowerCase()
        .localeCompare(String(b?.nombre || "").toLowerCase(), "es")
    );
  }, [paisesItems]);

  /* =====================
     FILTROS UI
  ====================== */
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showListado, setShowListado] = useState(false);

  const hasFilters =
    filters.search.trim() !== DEFAULT_FILTERS.search ||
    filters.estado !== DEFAULT_FILTERS.estado ||
    filters.pais !== DEFAULT_FILTERS.pais;

  const handleChangeFilter = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const filterByPais = (p) => {
    if (filters.pais === "all") return true;
    return String(p?.ubicacion?.pais || "").toLowerCase() === String(filters.pais).toLowerCase();
  };

  const filterByEstado = (p) => {
    const e = String(p?.estado || "").toLowerCase().trim();
    if (filters.estado === "all") return true;
    if (filters.estado === "activos") return isActiveEstado(p?.estado);
    if (filters.estado === "vendidos") return e.includes("vend");
    if (filters.estado === "otros") return !isActiveEstado(p?.estado) && !e.includes("vend");
    return true;
  };

  const filterBySearch = (p) => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return true;

    const haystack = [
      p?.nombre,
      p?.codigo,
      p?.id,
      p?._id,
      p?.ubicacion?.pais,
      p?.ubicacion?.ciudad,
      p?.ubicacion?.municipio,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  };

  const sortedProps = useMemo(() => {
    const arr = Array.isArray(propiedades) ? [...propiedades] : [];
    return arr.sort((a, b) => {
      const aAct = isActiveEstado(a?.estado);
      const bAct = isActiveEstado(b?.estado);
      if (aAct !== bAct) return aAct ? -1 : 1;
      return String(a?.id ?? a?._id ?? "").localeCompare(String(b?.id ?? b?._id ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [propiedades]);

  // Fuente de verdad: TODO sale de aqu?? (pa??s + estado + search)
  const workingList = useMemo(
    () => sortedProps.filter((p) => filterByPais(p) && filterByEstado(p) && filterBySearch(p)),
    [sortedProps, filters.pais, filters.estado, filters.search]
  );

  /* =====================
     MODO: Activos vs Vendidos
  ====================== */
  const isVendidosMode = filters.estado === "vendidos";

  const scopeActivas = useMemo(() => workingList.filter((p) => isActiveEstado(p?.estado)), [workingList]);
  const scopeVendidas = useMemo(() => workingList.filter((p) => isSoldEstado(p?.estado)), [workingList]);

  /* =====================
     KPI MODO ACTIVOS
  ====================== */
  const activePropKeys = useMemo(() => {
    const s = new Set();
    for (const p of scopeActivas) {
      s.add(String(p?.id ?? p?._id ?? p?.codigo ?? ""));
    }
    return s;
  }, [scopeActivas]);

  const valorPortafolioActivas = useMemo(
    () => scopeActivas.reduce((acc, p) => acc + getValorActual(p), 0),
    [scopeActivas]
  );

  const totalCompraActivas = useMemo(
    () => scopeActivas.reduce((acc, p) => acc + (getValorCompra(p) || 0), 0),
    [scopeActivas]
  );

  // Unidades activas SOLO dentro del scope activo filtrado (pa??s + search + estado)
  const unidadesActivasEnScope = useMemo(() => {
    const arr = Array.isArray(unidades) ? unidades : [];
    let count = 0;
    for (const u of arr) {
      if (!/^act/i.test(String(u?.estado || ""))) continue;
      const pid = String(u?.propiedadId ?? u?.propertyId ?? u?.propiedad?.id ?? u?.propiedad?._id ?? "");
      if (pid && activePropKeys.has(pid)) count += 1;
    }
    return count;
  }, [unidades, activePropKeys]);

  const promedioPorUnidadActiva = unidadesActivasEnScope
    ? valorPortafolioActivas / unidadesActivasEnScope
    : 0;

  const negociosActivos = useMemo(() => {
    const arr = Array.isArray(negocios) ? negocios : [];
    return arr.filter((n) => isActiveEstado(n?.estado));
  }, [negocios]);

  // Producci??n mensual: si tus negocios ya est??n filtrados por pa??s en backend, perfecto.
  // Si no, se mantiene global de negocios activos. (Se puede filtrar por pa??s cuando tengamos la relaci??n exacta Negocio->Propiedad.)
  const produccionMensual = useMemo(
    () => negociosActivos.reduce((s, n) => s + Number(n?.produccionMensual || 0), 0),
    [negociosActivos]
  );

  const roiFallback =
    totalCompraActivas > 0
      ? ((valorPortafolioActivas - totalCompraActivas) / totalCompraActivas) * 100
      : null;

  const roiNum =
    typeof kpis?.roi === "number" && !Number.isNaN(kpis.roi) ? kpis.roi : roiFallback;

  const roiNote =
    roiNum != null && totalCompraActivas > 0
      ? `Basado en inversi??n estimada: ${money(kpis?.totalCompra || totalCompraActivas)}`
      : "Pendiente de transacciones para ROI real";

  /* =====================
     KPI MODO VENDIDOS
  ====================== */
  const vendidosCount = scopeVendidas.length;

  const totalVendido = useMemo(() => {
    let sum = 0;
    for (const p of scopeVendidas) {
      const v = getValorVenta(p);
      if (v != null) sum += v;
    }
    return sum;
  }, [scopeVendidas]);

  const gananciaRealizada = useMemo(() => {
    let sum = 0;
    let any = false;
    for (const p of scopeVendidas) {
      const compra = getValorCompra(p);
      const venta = getValorVenta(p);
      if (compra != null && venta != null) {
        sum += venta - compra;
        any = true;
      }
    }
    return any ? sum : null;
  }, [scopeVendidas]);

  const pctConGanancia = useMemo(() => {
    let base = 0;
    let win = 0;
    for (const p of scopeVendidas) {
      const compra = getValorCompra(p);
      const venta = getValorVenta(p);
      if (compra != null && venta != null) {
        base += 1;
        if (venta - compra > 0) win += 1;
      }
    }
    if (!base) return null;
    return (win / base) * 100;
  }, [scopeVendidas]);

  const promedioVenta = useMemo(() => {
    let base = 0;
    let sum = 0;
    for (const p of scopeVendidas) {
      const venta = getValorVenta(p);
      if (venta != null) {
        base += 1;
        sum += venta;
      }
    }
    if (!base) return null;
    return sum / base;
  }, [scopeVendidas]);

  const ultimaVenta = useMemo(() => {
    let last = null;
    for (const p of scopeVendidas) {
      const d = getFechaVenta(p);
      if (!d) continue;
      if (!last || d > last) last = d;
    }
    return last;
  }, [scopeVendidas]);

  const paisLeaderVentas = useMemo(() => {
    const map = new Map();
    let total = 0;

    for (const p of scopeVendidas) {
      const pais = String(p?.ubicacion?.pais || "").trim();
      if (!pais) continue;

      const venta = getValorVenta(p);
      const add = venta != null ? venta : 0;
      total += add;

      map.set(pais, (map.get(pais) || 0) + add);
    }

    const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
    if (!entries.length) return null;

    const [pais, sum] = entries[0];
    const pct = total > 0 ? (sum / total) * 100 : null;

    return { pais, pct };
  }, [scopeVendidas]);

  /* =====================
     CHARTS por modo
  ====================== */
  const top5Activas = useMemo(() => computeTop5Activas(workingList), [workingList]);
  const top5VendidasGanancia = useMemo(
    () => computeTop5VendidasGanancia(workingList),
    [workingList]
  );

  const isLoadingAny = loadingProps || loadingUnidades || paisesLoading;

  return (
    <div className="space-y-5" data-theme={theme}>
      {/* Encabezado */}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
            <HomeIcon size={18} />
            Portafolio de propiedades
          </h2>

          <p className="text-xs md:text-sm subtle">
            Contexto:{" "}
            <span className="font-semibold">
              {filters.pais === "all" ? "Todos los pa??ses" : filters.pais}
            </span>{" "}
            ?? Modo:{" "}
            <span className="font-semibold">
              {isVendidosMode ? "Vendidos (hist??rico)" : "Activos (portafolio)"}
            </span>
          </p>
        </div>

        {sortedProps.length > 0 && (
          <div className="text-[11px] md:text-xs subtle text-right">
            Mostrando{" "}
            <span className="font-semibold text-text" style={{ fontVariantNumeric: "tabular-nums" }}>
              {workingList.length}
            </span>{" "}
            de {sortedProps.length}
          </div>
        )}
      </header>

      {/* Filtros */}
      <section className="neo-plate neo-plate--tinted px-3 py-2.5 md:px-4 md:py-3 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-border bg-[color-mix(in_srgb,var(--panel)_80%,var(--accent)_20%)]">
            <Filter size={14} />
          </div>
          <span className="font-medium">Filtros del panel</span>
          {isLoadingAny && (<span className="text-[11px] subtle animate-pulse">Actualizando??</span>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 w-full md:w-auto">
          {/* Pa??s (filtro padre) */}
          <div>
            <select
              value={filters.pais}
              onChange={(e) => handleChangeFilter("pais", e.target.value)}
              className="w-full rounded-xl px-2 py-1.5 text-xs md:text-sm bg-[color-mix(in_srgb,var(--panel)_96%,var(--accent)_4%)] border border-border focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_70%,transparent)]"
            >
              <option value="all">Todos los pa??ses</option>
              {paisOptions.map((p) => (
                <option key={p?._id || p?.id || p?.codigo || p?.nombre} value={p?.nombre || p?.codigo}>
                  {p?.nombre || p?.codigo}
                </option>
              ))}
            </select>
          </div>

          {/* Estado (modo) */}
          <div>
            <select
              value={filters.estado}
              onChange={(e) => handleChangeFilter("estado", e.target.value)}
              className="w-full rounded-xl px-2 py-1.5 text-xs md:text-sm bg-[color-mix(in_srgb,var(--panel)_96%,var(--accent)_4%)] border border-border focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_70%,transparent)]"
            >
              <option value="activos">Activos</option>
              <option value="vendidos">Vendidos (hist??rico)</option>
              <option value="otros">Otros</option>
              <option value="all">Todos</option>
            </select>
          </div>

          {/* Search */}
          <div className="col-span-1 md:col-span-2 flex gap-2">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChangeFilter("search", e.target.value)}
              placeholder="Buscar por nombre, c??digo, ciudad??"
              className="flex-1 rounded-xl px-3 py-1.5 text-xs md:text-sm bg-[color-mix(in_srgb,var(--panel)_94%,var(--accent)_6%)] border border-border focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_70%,transparent)]"
            />

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-2 md:px-3 rounded-xl text-[11px] md:text-xs ring-1 ring-border bg-[color-mix(in_srgb,var(--panel)_90%,var(--accent)_10%)] hover:bg-[color-mix(in_srgb,var(--panel)_80%,var(--accent)_20%)] transition-colors"
                title="Limpiar filtros"
              >
                <XIcon size={12} className="mr-1" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Resumen ejecutivo (cambia por modo) */}
      <section className="neo-card neo-card--deep neo-card--tinted no-clip p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 size={18} />
            {isVendidosMode ? "Resumen hist??rico de vendidos" : "Resumen ejecutivo del portafolio"}
          </div>
        </div>

        {/* KPIs GRANDES */}
        {!isVendidosMode ? (
          <div className="grid gap-3 md:grid-cols-3">
            <KpiCard
              label="Valor del portafolio"
              value={money(valorPortafolioActivas)}
              note={`${scopeActivas.length} propiedad${scopeActivas.length === 1 ? "" : "es"} activas`}
              icon={PieIcon}
            />
            <KpiCard
              label="Producci??n mensual"
              value={money(produccionMensual)}
              note="Ingresos de negocios activos"
              icon={TrendingUp}
            />
            <KpiCard
              label="ROI global"
              value={roiNum != null ? formatPercent(roiNum) : "??"}
              note={roiNote}
              icon={TrendingUp}
            />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            <KpiCard
              label="Propiedades vendidas"
              value={vendidosCount}
              note="Hist??rico seg??n filtros"
              icon={HandCoins}
            />
            <KpiCard
              label="Total vendido"
              value={totalVendido > 0 ? money(totalVendido) : "??"}
              note={totalVendido > 0 ? "Suma de ventas registradas" : "Pendiente de datos de venta"}
              icon={BadgeDollarSign}
            />
            <KpiCard
              label="Ganancia realizada"
              value={gananciaRealizada != null ? money(gananciaRealizada) : "??"}
              note={
                gananciaRealizada != null
                  ? "Venta - Compra (solo con datos completos)"
                  : "Pendiente de compra + venta"
              }
              icon={TrendingUp}
            />
          </div>
        )}

        {/* KPIs PEQUE?OS */}
        {!isVendidosMode ? (
          <div className="mt-3 grid gap-3 md:grid-cols-4 text-[11px] md:text-xs">
            <MiniKpi
              label="Unidades activas"
              value={unidadesActivasEnScope}
              icon={Globe}
              title="Unidades activas dentro de propiedades activas del contexto filtrado"
            />
            <MiniKpi
              label="Propiedades activas"
              value={scopeActivas.length}
              title="Conteo de propiedades activas dentro del contexto filtrado"
            />
            <MiniKpi
              label="Promedio por unidad activa"
              value={money(promedioPorUnidadActiva)}
              title="Valor del portafolio activo / unidades activas (contexto filtrado)"
            />
            <MiniKpi
              label="Pa??s l??der (valor)"
              value={
                (() => {
                  const map = new Map();
                  for (const p of scopeActivas) {
                    const pais = String(p?.ubicacion?.pais || "").trim();
                    if (!pais) continue;
                    map.set(pais, (map.get(pais) || 0) + getValorActual(p));
                  }
                  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
                  if (!entries.length) return "??";
                  const [pais, sum] = entries[0];
                  const pct =
                    valorPortafolioActivas > 0 ? (sum / valorPortafolioActivas) * 100 : null;
                  return pct != null ? `${pais} (${pct.toFixed(0)}%)` : pais;
                })()
              }
              icon={Globe}
              title="Pa??s con mayor concentraci??n de valor dentro del contexto filtrado"
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-4 text-[11px] md:text-xs">
            <MiniKpi
              label="Pa??s l??der (ventas)"
              value={
                paisLeaderVentas
                  ? `${paisLeaderVentas.pais}${paisLeaderVentas.pct != null ? ` (${paisLeaderVentas.pct.toFixed(0)}%)` : ""
                  }`
                  : "??"}
              icon={Globe}
              title="Pa??s con mayor monto de ventas (seg??n datos disponibles)"
            />
            <MiniKpi
              label="Precio promedio de venta"
              value={promedioVenta != null ? money(promedioVenta) : "??"}
              icon={BadgeDollarSign}
              title="Promedio de venta (solo si existe valorVenta)"
            />
            <MiniKpi
              label="??ltima venta"
              value={ultimaVenta ? monthLabel(ultimaVenta) : "??"}
              icon={HandCoins}
              title="Fecha m??s reciente registrada"
            />
            <MiniKpi
              label="% con ganancia"
              value={pctConGanancia != null ? `${pctConGanancia.toFixed(0)}%` : "??"}
              icon={TrendingUp}
              title="Vendidas con ganancia (solo con compra+venta)"
            />
          </div>
        )}
      </section>

      {/* Gr??ficos (cambian por modo) */}
      {!isVendidosMode ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {/* Top 5 activas por valor */}
          <div className="neo-card neo-card--deep neo-card--tinted no-clip p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 size={18} />
                Top 5 activas por valor (contexto)
              </div>
            </div>

            {top5Activas.length === 0 ? (
              <p className="text-xs subtle py-4">
                No hay propiedades activas con valor registrado para mostrar.
              </p>
            ) : (
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5Activas} margin={{ top: 20, right: 20, left: 0, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey={(p) => p.codigo || p.nombre || p.id}
                      tick={{ fontSize: 11 }}
                      dy={8}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={
                        <TopTooltip
                          lines={[
                            {
                              key: "va",
                              label: "Valor actual",
                              value: (payload) => money(payload?.[0]?.value ?? 0),
                            },
                          ]}
                        />
                      }
                    />
                    <Bar dataKey="valorActual" radius={[12, 12, 4, 4]} fill="var(--accent)">
                      <LabelList
                        dataKey="valorActual"
                        position="top"
                        formatter={(v) => moneyShort(v)}
                        style={{
                          fontSize: 10,
                          fill: "color-mix(in srgb,var(--text) 88%,transparent)",
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Comparativo invertido vs actual (top 5) */}
          <div className="neo-card neo-card--deep neo-card--tinted no-clip p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 size={18} />
                Valor actual vs. valor invertido (Top 5)
              </div>
            </div>

            {top5Activas.length === 0 ? (
              <p className="text-xs subtle py-4">
                No hay datos suficientes para mostrar el comparativo.
              </p>
            ) : (
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5Activas} margin={{ top: 20, right: 20, left: 0, bottom: 24 }} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey={(p) => p.codigo || p.nombre || p.id}
                      tick={{ fontSize: 11 }}
                      dy={8}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => moneyShort(v)} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={
                        <TopTooltip
                          lines={[
                            {
                              key: "inv",
                              label: "Inversi??n",
                              value: (payload) => money(payload?.find((x) => x.dataKey === "valorInvertido")?.value ?? 0),
                            },
                            {
                              key: "act",
                              label: "Valor actual",
                              value: (payload) => money(payload?.find((x) => x.dataKey === "valorActual")?.value ?? 0),
                            },
                          ]}
                        />
                      }
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 11 }}
                      formatter={(value) => (value === "valorInvertido" ? "Inversi??n" : "Valor actual")}
                    />
                    <Bar dataKey="valorInvertido" radius={[10, 10, 4, 4]} fill="hsl(33 92% 70%)">
                      <LabelList
                        dataKey="valorInvertido"
                        position="top"
                        formatter={(v) => moneyShort(v)}
                        style={{ fontSize: 10, fill: "color-mix(in srgb,var(--text) 88%,transparent)" }}
                      />
                    </Bar>
                    <Bar dataKey="valorActual" radius={[10, 10, 4, 4]} fill="var(--accent)">
                      <LabelList
                        dataKey="valorActual"
                        position="top"
                        formatter={(v) => moneyShort(v)}
                        style={{ fontSize: 10, fill: "color-mix(in srgb,var(--text) 88%,transparent)" }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {/* Top 5 vendidas por ganancia */}
          <div className="neo-card neo-card--deep neo-card--tinted no-clip p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 size={18} />
                Top 5 vendidas por ganancia
              </div>
            </div>

            {top5VendidasGanancia.length === 0 ? (
              <p className="text-xs subtle py-4">
                No hay datos suficientes (se requiere valorCompra + valorVenta).
              </p>
            ) : (
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5VendidasGanancia} margin={{ top: 20, right: 20, left: 0, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey={(p) => p.codigo || p.nombre || p.id}
                      tick={{ fontSize: 11 }}
                      dy={8}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => moneyShort(v)} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={
                        <TopTooltip
                          lines={[
                            { key: "g", label: "Ganancia", value: (payload) => money(payload?.[0]?.value ?? 0) },
                          ]}
                        />
                      }
                    />
                    <Bar dataKey="ganancia" radius={[12, 12, 4, 4]} fill="var(--accent)">
                      <LabelList
                        dataKey="ganancia"
                        position="top"
                        formatter={(v) => moneyShort(v)}
                        style={{ fontSize: 10, fill: "color-mix(in srgb,var(--text) 88%,transparent)" }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top 5 vendidas por venta (si existe) */}
          <div className="neo-card neo-card--deep neo-card--tinted no-clip p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 size={18} />
                Top 5 vendidas por monto de venta
              </div>
            </div>

            {scopeVendidas.filter((p) => getValorVenta(p) != null).length === 0 ? (
              <p className="text-xs subtle py-4">No hay valores de venta registrados a??n.</p>
            ) : (
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...scopeVendidas]
                      .map((p) => ({
                        id: p.id ?? p.codigo ?? p._id,
                        codigo: p.codigo,
                        nombre: p.nombre || `Propiedad ${p.id ?? p.codigo ?? ""}`,
                        venta: getValorVenta(p) ?? 0,
                      }))
                      .sort((a, b) => b.venta - a.venta)
                      .slice(0, 5)}
                    margin={{ top: 20, right: 20, left: 0, bottom: 24 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey={(p) => p.codigo || p.nombre || p.id}
                      tick={{ fontSize: 11 }}
                      dy={8}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => moneyShort(v)} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={
                        <TopTooltip
                          lines={[
                            { key: "v", label: "Venta", value: (payload) => money(payload?.[0]?.value ?? 0) },
                          ]}
                        />
                      }
                    />
                    <Bar dataKey="venta" radius={[12, 12, 4, 4]} fill="hsl(33 92% 70%)">
                      <LabelList
                        dataKey="venta"
                        position="top"
                        formatter={(v) => moneyShort(v)}
                        style={{ fontSize: 10, fill: "color-mix(in srgb,var(--text) 88%,transparent)" }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Listado */}
      <section className="neo-card neo-card--deep neo-card--tinted no-clip p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ListOrdered size={16} />
            Propiedades en detalle
          </div>

          <button
            type="button"
            onClick={() => setShowListado((v) => !v)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-xl ring-1 ring-border text-[11px] bg-[color-mix(in_srgb,var(--panel)_93%,var(--accent)_7%)] hover:bg-[color-mix(in_srgb,var(--panel)_85%,var(--accent)_15%)] transition-colors"
          >
            <EyeOff size={12} />
            {showListado ? "Ocultar listado" : "Mostrar listado"}
          </button>
        </div>

        {!showListado ? (
          <p className="text-xs subtle">
            El listado est?? oculto para mantener la vista ejecutiva limpia.
          </p>
        ) : workingList.length === 0 ? (
          <p className="text-sm subtle py-4">No hay resultados con los filtros actuales.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workingList.map((p) => {
              const compra = getValorCompra(p);
              const actual = getValorActual(p);
              const venta = getValorVenta(p);
              const fechaV = getFechaVenta(p);

              return (
                <article
                  key={p.id || p._id || p.codigo}
                  className="neo-plate neo-plate--deep neo-plate--tinted raise p-3.5 md:p-4 rounded-2xl space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {p?.nombre || `Propiedad ${p?.id ?? p?.codigo ?? ""}`}
                      </h3>
                      <div className="text-[11px] subtle truncate">
                        {[
                          p?.codigo ? `C??digo: ${p.codigo}` : null,
                          p?.ubicacion?.pais,
                          p?.ubicacion?.ciudad || p?.ubicacion?.municipio,
                        ]
                          .filter(Boolean)
                          .join(" ?? ")}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold">
                      {String(p?.estado || "").toUpperCase() || "??"}
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 text-[11px]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {!isVendidosMode ? (
                      <>
                        <div className="space-y-0.5">
                          <div className="subtle uppercase">Valor actual</div>
                          <div className="font-semibold text-sm">{money(actual || 0)}</div>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <div className="subtle uppercase">Invertido (base)</div>
                          <div className="font-semibold text-sm">
                            {compra != null ? money(compra) : "No registrado"}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-0.5">
                          <div className="subtle uppercase">Venta</div>
                          <div className="font-semibold text-sm">
                            {venta != null ? money(venta) : "Pendiente"}
                          </div>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <div className="subtle uppercase">Compra</div>
                          <div className="font-semibold text-sm">
                            {compra != null ? money(compra) : "No registrado"}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <div className="subtle uppercase">Ganancia</div>
                          <div className="font-semibold">
                            {compra != null && venta != null ? money(venta - compra) : "??"}
                          </div>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <div className="subtle uppercase">Fecha venta</div>
                          <div className="font-semibold">{fechaV ? monthLabel(fechaV) : "??"}</div>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}



