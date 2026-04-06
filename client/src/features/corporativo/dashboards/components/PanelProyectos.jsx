// client/src/features/corporativo/Proyectos/ProyectosListPage.jsx
import React, { useMemo, useState } from "react";

/**
 * Datos mock para desarrollo.
 * En el futuro se reemplaza por datos desde la API (REST /proyectos).
 */
const MOCK_PROJECTS = [
    {
        id: "PRJ-REST-COCINA-2025",
        codigo: "PRJ-2025-REST01-COCINA",
        nombre: "Remodelaci車n cocina restaurante Chaparral",
        negocio: "REST01 ﹞ Chaparral / Restaurantes",
        ubicacion: "El Salvador ﹞ Lourdes Col車n ﹞ Chaparral",
        tipo: "Remodelaci車n",
        estado: "En ejecuci車n",
        presupuesto: 12000,
        ejecutado: 5400,
        moneda: "USD",
        fechaInicioPlan: "2025-01-10",
        fechaFinPlan: "2025-03-30",
    },
    {
        id: "PRJ-APT-LOUREDES-2025",
        codigo: "PRJ-2025-APT04-INTERIOR",
        nombre: "Mejora interior apartamento APT04",
        negocio: "APT04 ﹞ Lourdes Col車n",
        ubicacion: "El Salvador ﹞ Lourdes Col車n",
        tipo: "Remodelaci車n",
        estado: "Planeado",
        presupuesto: 4500,
        ejecutado: 0,
        moneda: "USD",
        fechaInicioPlan: "2025-04-01",
        fechaFinPlan: "2025-05-15",
    },
    {
        id: "PRJ-SYS-REST-2025",
        codigo: "PRJ-2025-REST01-SISTEMA",
        nombre: "Implementaci車n sistema restaurante Inversiones JCF",
        negocio: "REST01 ﹞ Chaparral / Restaurantes",
        ubicacion: "El Salvador ﹞ Lourdes Col車n ﹞ Chaparral",
        tipo: "Sistema / Tecnolog赤a",
        estado: "En ejecuci車n",
        presupuesto: 8000,
        ejecutado: 3200,
        moneda: "USD",
        fechaInicioPlan: "2025-02-01",
        fechaFinPlan: "2025-06-30",
    },
    {
        id: "PRJ-LA-PROP-2025",
        codigo: "PRJ-2025-LA-REFORMA",
        nombre: "Acondicionamiento propiedad en Los 芍ngeles",
        negocio: "LA01 ﹞ Los 芍ngeles",
        ubicacion: "USA ﹞ Los 芍ngeles",
        tipo: "Remodelaci車n",
        estado: "Planeado",
        presupuesto: 15000,
        ejecutado: 0,
        moneda: "USD",
        fechaInicioPlan: "2025-07-01",
        fechaFinPlan: "2025-09-30",
    },
    {
        id: "PRJ-VEH-2025",
        codigo: "PRJ-2025-FLOTA-VEH",
        nombre: "Adquisici車n veh赤culos para renta / log赤stica",
        negocio: "FLOTA01 ﹞ Veh赤culos",
        ubicacion: "El Salvador ﹞ Lourdes Col車n",
        tipo: "Equipamiento / Flota",
        estado: "En ejecuci車n",
        presupuesto: 21000,
        ejecutado: 10500,
        moneda: "USD",
        fechaInicioPlan: "2025-03-01",
        fechaFinPlan: "2025-08-31",
    },
];

const ESTADOS = ["Todos", "Planeado", "En ejecuci車n", "Pausado", "Cerrado", "Cancelado"];

const TIPOS = [
    "Todos",
    "Construcci車n nueva",
    "Remodelaci車n",
    "Equipamiento / Flota",
    "Sistema / Tecnolog赤a",
];

const NEGOCIOS = [
    "Todos",
    "REST01 ﹞ Chaparral / Restaurantes",
    "APT04 ﹞ Lourdes Col車n",
    "LA01 ﹞ Los 芍ngeles",
    "FLOTA01 ﹞ Veh赤culos",
];

function formatCurrency(value, currency = "USD") {
    if (value == null || Number.isNaN(value)) return "〞";
    try {
        return new Intl.NumberFormat("es-SV", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(value);
    } catch {
        return `${value.toFixed(2)} ${currency}`;
    }
}

function calcProgress(presupuesto, ejecutado) {
    if (!presupuesto || presupuesto <= 0) return 0;
    return Math.min(100, Math.round((ejecutado / presupuesto) * 100));
}

export default function ProyectosListPage() {
    const [estadoFilter, setEstadoFilter] = useState("Todos");
    const [tipoFilter, setTipoFilter] = useState("Todos");
    const [negocioFilter, setNegocioFilter] = useState("Todos");
    const [monthFilter, setMonthFilter] = useState(""); // yyyy-MM

    const filtered = useMemo(() => {
        return MOCK_PROJECTS.filter((p) => {
            if (estadoFilter !== "Todos" && p.estado !== estadoFilter) return false;
            if (tipoFilter !== "Todos" && p.tipo !== tipoFilter) return false;
            if (negocioFilter !== "Todos" && p.negocio !== negocioFilter) return false;

            if (monthFilter) {
                const monthStr = (p.fechaInicioPlan || "").slice(0, 7);
                if (monthStr !== monthFilter) return false;
            }

            return true;
        });
    }, [estadoFilter, tipoFilter, negocioFilter, monthFilter]);

    const summary = useMemo(() => {
        if (filtered.length === 0) {
            return {
                total: 0,
                activos: 0,
                presupuestoTotal: 0,
                ejecutadoTotal: 0,
                avgProgress: 0,
            };
        }

        const total = filtered.length;
        const activos = filtered.filter((p) =>
            ["Planeado", "En ejecuci車n"].includes(p.estado)
        ).length;

        const presupuestoTotal = filtered.reduce(
            (acc, p) => acc + (p.presupuesto || 0),
            0
        );
        const ejecutadoTotal = filtered.reduce(
            (acc, p) => acc + (p.ejecutado || 0),
            0
        );
        const avgProgress =
            filtered.reduce(
                (acc, p) => acc + calcProgress(p.presupuesto, p.ejecutado),
                0
            ) / total;

        return {
            total,
            activos,
            presupuestoTotal,
            ejecutadoTotal,
            avgProgress: Math.round(avgProgress),
        };
    }, [filtered]);

    const topByBudget = useMemo(() => {
        return [...filtered]
            .sort((a, b) => (b.presupuesto || 0) - (a.presupuesto || 0))
            .slice(0, 5);
    }, [filtered]);

    return (
        <section className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        Proyectos
                    </h1>
                    <p className="text-xs md:text-sm opacity-80 mt-1">
                        Seguimiento de inversiones, remodelaciones, sistemas y flota
                        vinculadas a cada negocio y propiedad.
                    </p>
                </div>
                <div className="flex gap-2 text-xs md:text-sm">
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[color-mix(in_srgb,var(--panel)_85%,var(--accent)_15%)] transition-colors"
                    >
                        Nuevo proyecto
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl border border-dashed border-[var(--border)] bg-transparent hover:bg-[var(--panel)] transition-colors"
                    >
                        Importar desde Excel
                    </button>
                </div>
            </div>

            {/* Resumen superior */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Total proyectos
                    </div>
                    <div className="mt-1 text-2xl font-semibold tabular-nums">
                        {summary.total}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        Activos: {summary.activos}
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Presupuesto total
                    </div>
                    <div className="mt-1 text-lg md:text-xl font-semibold tabular-nums">
                        {formatCurrency(summary.presupuestoTotal)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        En todos los proyectos filtrados
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Ejecutado
                    </div>
                    <div className="mt-1 text-lg md:text-xl font-semibold tabular-nums">
                        {formatCurrency(summary.ejecutadoTotal)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        {summary.presupuestoTotal > 0
                            ? `${calcProgress(
                                summary.presupuestoTotal,
                                summary.ejecutadoTotal
                            )}% del presupuesto`
                            : "Sin presupuesto definido"}
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Avance promedio
                    </div>
                    <div className="mt-1 text-2xl font-semibold tabular-nums">
                        {summary.avgProgress}%
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        Seg迆n proyectos filtrados
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 md:p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                    <div className="text-sm font-medium">Filtros</div>
                    <button
                        type="button"
                        className="text-xs underline opacity-70 hover:opacity-100"
                        onClick={() => {
                            setEstadoFilter("Todos");
                            setTipoFilter("Todos");
                            setNegocioFilter("Todos");
                            setMonthFilter("");
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Estado</label>
                        <select
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                        >
                            {ESTADOS.map((e) => (
                                <option key={e} value={e}>
                                    {e}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Tipo de proyecto</label>
                        <select
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                        >
                            {TIPOS.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Negocio</label>
                        <select
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={negocioFilter}
                            onChange={(e) => setNegocioFilter(e.target.value)}
                        >
                            {NEGOCIOS.map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Mes de inicio (planificado)</label>
                        <input
                            type="month"
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Top proyectos por presupuesto */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">
                        Top proyectos por presupuesto (vista r芍pida)
                    </div>
                    <div className="text-[11px] opacity-70">
                        Mostrando {topByBudget.length} de {filtered.length} proyectos filtrados
                    </div>
                </div>
                <div className="space-y-2 text-xs md:text-sm">
                    {topByBudget.length === 0 && (
                        <div className="text-[12px] opacity-70">
                            No hay proyectos que coincidan con los filtros seleccionados.
                        </div>
                    )}
                    {topByBudget.map((p) => {
                        const progress = calcProgress(p.presupuesto, p.ejecutado);
                        return (
                            <div
                                key={p.id}
                                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 rounded-xl border border-[color-mix(in_srgb,var(--border)_80%,var(--accent)_20%)] bg-[color-mix(in_srgb,var(--panel)_92%,var(--accent)_8%)] px-3 py-2.5"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{p.nombre}</div>
                                    <div className="text-[11px] opacity-70 flex flex-wrap gap-x-2 mt-0.5">
                                        <span>{p.codigo}</span>
                                        <span>﹞ {p.negocio}</span>
                                        <span>﹞ {p.tipo}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end gap-1">
                                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                                        Presupuesto / Ejecutado
                                    </div>
                                    <div className="text-xs tabular-nums">
                                        {formatCurrency(p.ejecutado, p.moneda)}{" "}
                                        <span className="opacity-60">/</span>{" "}
                                        {formatCurrency(p.presupuesto, p.moneda)}
                                    </div>
                                    <div className="w-40 h-1.5 rounded-full bg-black/30 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[color-mix(in_srgb,var(--accent)_80%,white_20%)]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-[11px] opacity-70 tabular-nums">
                                        {progress}% avance ﹞ {p.estado}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tabla detalle proyectos */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="text-sm font-medium">Detalle de proyectos</div>
                    <div className="text-[11px] opacity-70">
                        {filtered.length} proyecto(s) encontrado(s)
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs md:text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_94%,black_6%)]">
                                <th className="px-3 py-2 text-left font-semibold">Proyecto</th>
                                <th className="px-3 py-2 text-left font-semibold">Negocio / Ubicaci車n</th>
                                <th className="px-3 py-2 text-left font-semibold">Tipo</th>
                                <th className="px-3 py-2 text-left font-semibold">Estado</th>
                                <th className="px-3 py-2 text-right font-semibold">Presupuesto</th>
                                <th className="px-3 py-2 text-right font-semibold">Ejecutado</th>
                                <th className="px-3 py-2 text-right font-semibold">% Avance</th>
                                <th className="px-3 py-2 text-left font-semibold">Fechas (plan)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-3 py-6 text-center text-[12px] opacity-70"
                                    >
                                        No hay proyectos para mostrar con los filtros actuales.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((p) => {
                                const progress = calcProgress(p.presupuesto, p.ejecutado);
                                return (
                                    <tr
                                        key={p.id}
                                        className="border-b border-[color-mix(in_srgb,var(--border)_70%,transparent_30%)] hover:bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] transition-colors"
                                    >
                                        <td className="px-3 py-2 align-top">
                                            <div className="font-medium leading-snug">{p.nombre}</div>
                                            <div className="text-[11px] opacity-70">{p.codigo}</div>
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            <div className="leading-snug">{p.negocio}</div>
                                            <div className="text-[11px] opacity-70">{p.ubicacion}</div>
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            <div className="text-[12px]">{p.tipo}</div>
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${p.estado === "En ejecuci車n"
                                                        ? "bg-emerald-500/15 text-emerald-300"
                                                        : p.estado === "Planeado"
                                                            ? "bg-sky-500/15 text-sky-300"
                                                            : p.estado === "Cerrado"
                                                                ? "bg-slate-500/20 text-slate-200"
                                                                : "bg-amber-500/15 text-amber-200"
                                                    }`}
                                            >
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 align-top text-right tabular-nums">
                                            {formatCurrency(p.presupuesto, p.moneda)}
                                        </td>
                                        <td className="px-3 py-2 align-top text-right tabular-nums">
                                            {formatCurrency(p.ejecutado, p.moneda)}
                                        </td>
                                        <td className="px-3 py-2 align-top text-right tabular-nums">
                                            {progress}%
                                        </td>
                                        <td className="px-3 py-2 align-top text-[11px] leading-snug">
                                            <div>
                                                Inicio:{" "}
                                                <span className="opacity-80">
                                                    {p.fechaInicioPlan || "〞"}
                                                </span>
                                            </div>
                                            <div>
                                                Fin:{" "}
                                                <span className="opacity-80">
                                                    {p.fechaFinPlan || "〞"}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Resumen inferior */}
                <div className="px-4 py-3 border-t border-[var(--border)] text-[11px] md:text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="opacity-75">
                        <span className="font-semibold">Resumen filtros ﹞ </span>
                        {summary.total} proyecto(s), inversi車n total{" "}
                        <span className="tabular-nums">
                            {formatCurrency(summary.presupuestoTotal)}
                        </span>
                        , ejecutado{" "}
                        <span className="tabular-nums">
                            {formatCurrency(summary.ejecutadoTotal)}
                        </span>
                        .
                    </div>
                    <div className="opacity-75">
                        Avance promedio:{" "}
                        <span className="font-semibold tabular-nums">
                            {summary.avgProgress}%
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
