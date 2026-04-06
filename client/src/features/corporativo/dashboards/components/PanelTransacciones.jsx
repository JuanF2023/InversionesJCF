// client/src/features/corporativo/Transacciones/TransaccionesListPage.jsx
import React, { useMemo, useState } from "react";

/**
 * Datos mock de transacciones para desarrollo.
 * Más adelante se reemplaza por datos desde la API (REST /transacciones).
 *
 * Campos clave:
 * - tipo: "Ingreso" | "Egreso"
 * - categoria: renta, ventas, servicios, mantenimiento, nómina, etc.
 * - negocio: REST01, APT04, LA01, FLOTA01, etc.
 * - estado: Confirmada | Pendiente | Anulada
 * - metodoPago: Efectivo, Tarjeta, Transferencia, etc.
 */
const MOCK_TRANSACTIONS = [
    {
        id: "TX-REST-0001",
        fecha: "2025-03-01",
        negocio: "REST01 · Chaparral / Restaurantes",
        ubicacion: "El Salvador · Lourdes Colón · Chaparral",
        tipo: "Ingreso",
        categoria: "Ventas restaurante",
        descripcion: "Ventas del día · salón y para llevar",
        metodoPago: "Mixto",
        referencia: "Cierre caja #001",
        moneda: "USD",
        monto: 380.5,
        estado: "Confirmada",
    },
    {
        id: "TX-REST-0002",
        fecha: "2025-03-01",
        negocio: "REST01 · Chaparral / Restaurantes",
        ubicacion: "El Salvador · Lourdes Colón · Chaparral",
        tipo: "Egreso",
        categoria: "Compra insumos",
        descripcion: "Compra tomates, quesos y harina",
        metodoPago: "Efectivo",
        referencia: "FAC-REST-001",
        moneda: "USD",
        monto: 95.2,
        estado: "Confirmada",
    },
    {
        id: "TX-REST-0003",
        fecha: "2025-03-02",
        negocio: "REST01 · Chaparral / Restaurantes",
        ubicacion: "El Salvador · Lourdes Colón · Chaparral",
        tipo: "Egreso",
        categoria: "Nómina",
        descripcion: "Pago diario meseros y cocina",
        metodoPago: "Efectivo",
        referencia: "NOM-REST-2025-03-02",
        moneda: "USD",
        monto: 80,
        estado: "Confirmada",
    },
    {
        id: "TX-APT-0001",
        fecha: "2025-03-01",
        negocio: "APT04 · Lourdes Colón",
        ubicacion: "El Salvador · Lourdes Colón",
        tipo: "Ingreso",
        categoria: "Renta apartamentos",
        descripcion: "Renta mensual APT04",
        metodoPago: "Transferencia",
        referencia: "DEP-12345",
        moneda: "USD",
        monto: 300,
        estado: "Confirmada",
    },
    {
        id: "TX-APT-0002",
        fecha: "2025-03-05",
        negocio: "APT04 · Lourdes Colón",
        ubicacion: "El Salvador · Lourdes Colón",
        tipo: "Egreso",
        categoria: "Mantenimiento",
        descripcion: "Reparación plomería baño APT04",
        metodoPago: "Efectivo",
        referencia: "MANT-APT-005",
        moneda: "USD",
        monto: 45,
        estado: "Confirmada",
    },
    {
        id: "TX-LA-0001",
        fecha: "2025-03-01",
        negocio: "LA01 · Los ángeles",
        ubicacion: "USA · Los ángeles",
        tipo: "Ingreso",
        categoria: "Renta habitaciones",
        descripcion: "Renta mensual habitación LA01-01",
        metodoPago: "Transferencia",
        referencia: "ZELL-9988",
        moneda: "USD",
        monto: 950,
        estado: "Confirmada",
    },
    {
        id: "TX-LA-0002",
        fecha: "2025-03-03",
        negocio: "LA01 · Los ángeles",
        ubicacion: "USA · Los ángeles",
        tipo: "Egreso",
        categoria: "Servicios públicos",
        descripcion: "Factura electricidad y agua",
        metodoPago: "Tarjeta",
        referencia: "UTIL-LA-03-2025",
        moneda: "USD",
        monto: 210.75,
        estado: "Confirmada",
    },
    {
        id: "TX-FLOTA-0001",
        fecha: "2025-03-02",
        negocio: "FLOTA01 · Vehículos",
        ubicacion: "El Salvador · Lourdes Colón",
        tipo: "Ingreso",
        categoria: "Renta vehículos",
        descripcion: "Renta vehículo para Uber (semana 1)",
        metodoPago: "Transferencia",
        referencia: "RENT-VEH-001",
        moneda: "USD",
        monto: 180,
        estado: "Confirmada",
    },
    {
        id: "TX-FLOTA-0002",
        fecha: "2025-03-02",
        negocio: "FLOTA01 · Vehículos",
        ubicacion: "El Salvador · Lourdes Colón",
        tipo: "Egreso",
        categoria: "Combustible / Mantenimiento",
        descripcion: "Cambio de aceite flota",
        metodoPago: "Tarjeta",
        referencia: "WORKSHOP-0225",
        moneda: "USD",
        monto: 60,
        estado: "Pendiente",
    },
    {
        id: "TX-REST-0004",
        fecha: "2025-03-03",
        negocio: "REST01 · Chaparral / Restaurantes",
        ubicacion: "El Salvador · Lourdes Colón · Chaparral",
        tipo: "Ingreso",
        categoria: "Ventas restaurante",
        descripcion: "Ventas del día · salón y para llevar",
        metodoPago: "Mixto",
        referencia: "Cierre caja #002",
        moneda: "USD",
        monto: 420.75,
        estado: "Confirmada",
    },
];

const TIPO_OPTIONS = ["Todos", "Ingreso", "Egreso"];

const ESTADO_OPTIONS = ["Todos", "Confirmada", "Pendiente", "Anulada"];

const NEGOCIO_OPTIONS = [
    "Todos",
    "REST01 · Chaparral / Restaurantes",
    "APT04 · Lourdes Colón",
    "LA01 · Los ángeles",
    "FLOTA01 · Vehículos",
];

const METODO_PAGO_OPTIONS = ["Todos", "Efectivo", "Tarjeta", "Transferencia", "Mixto"];

function formatCurrency(value, currency = "USD") {
    if (value == null || Number.isNaN(value)) return "—";
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

export default function TransaccionesListPage() {
    const [tipoFilter, setTipoFilter] = useState("Todos");
    const [estadoFilter, setEstadoFilter] = useState("Todos");
    const [negocioFilter, setNegocioFilter] = useState("Todos");
    const [metodoFilter, setMetodoFilter] = useState("Todos");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return MOCK_TRANSACTIONS.filter((t) => {
            if (tipoFilter !== "Todos" && t.tipo !== tipoFilter) return false;
            if (estadoFilter !== "Todos" && t.estado !== estadoFilter) return false;
            if (negocioFilter !== "Todos" && t.negocio !== negocioFilter) return false;
            if (metodoFilter !== "Todos" && t.metodoPago !== metodoFilter) return false;

            if (fromDate && t.fecha < fromDate) return false;
            if (toDate && t.fecha > toDate) return false;

            if (search) {
                const q = search.toLowerCase();
                const hayMatch =
                    t.id.toLowerCase().includes(q) ||
                    (t.descripcion || "").toLowerCase().includes(q) ||
                    (t.referencia || "").toLowerCase().includes(q) ||
                    (t.categoria || "").toLowerCase().includes(q) ||
                    (t.negocio || "").toLowerCase().includes(q);
                if (!hayMatch) return false;
            }

            return true;
        });
    }, [tipoFilter, estadoFilter, negocioFilter, metodoFilter, fromDate, toDate, search]);

    const summary = useMemo(() => {
        if (filtered.length === 0) {
            return {
                totalCount: 0,
                ingresos: 0,
                egresos: 0,
                neto: 0,
                ticketPromedio: 0,
            };
        }

        const ingresos = filtered
            .filter((t) => t.tipo === "Ingreso" && t.estado === "Confirmada")
            .reduce((acc, t) => acc + (t.monto || 0), 0);

        const egresos = filtered
            .filter((t) => t.tipo === "Egreso" && t.estado === "Confirmada")
            .reduce((acc, t) => acc + (t.monto || 0), 0);

        const neto = ingresos - egresos;

        const confirmadas = filtered.filter((t) => t.estado === "Confirmada");
        const totalMontoConfirmadas = confirmadas.reduce(
            (acc, t) => acc + (t.monto || 0),
            0
        );
        const ticketPromedio =
            confirmadas.length > 0 ? totalMontoConfirmadas / confirmadas.length : 0;

        return {
            totalCount: filtered.length,
            ingresos,
            egresos,
            neto,
            ticketPromedio,
        };
    }, [filtered]);

    const pendingSummary = useMemo(() => {
        const pendientes = filtered.filter((t) => t.estado === "Pendiente");
        const totalPendiente = pendientes.reduce((acc, t) => acc + (t.monto || 0), 0);
        return {
            count: pendientes.length,
            totalPendiente,
        };
    }, [filtered]);

    return (
        <section className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        Transacciones
                    </h1>
                    <p className="text-xs md:text-sm opacity-80 mt-1">
                        Flujo de caja consolidado entre negocios, propiedades y vehículos. Base
                        para indicadores, impuestos y decisiones de inversión.
                    </p>
                </div>
                <div className="flex gap-2 text-xs md:text-sm">
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[color-mix(in_srgb,var(--panel)_85%,var(--accent)_15%)] transition-colors"
                    >
                        Nueva transacción
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl border border-dashed border-[var(--border)] bg-transparent hover:bg-[var(--panel)] transition-colors"
                    >
                        Importar desde Excel
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Ingresos confirmados
                    </div>
                    <div className="mt-1 text-lg md:text-xl font-semibold tabular-nums">
                        {formatCurrency(summary.ingresos)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        Solo transacciones tipo ingreso y estado confirmado
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Egresos confirmados
                    </div>
                    <div className="mt-1 text-lg md:text-xl font-semibold tabular-nums">
                        {formatCurrency(summary.egresos)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        Insumos, nómina, mantenimiento, servicios, etc.
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Flujo neto
                    </div>
                    <div
                        className={`mt-1 text-lg md:text-xl font-semibold tabular-nums ${summary.neto >= 0 ? "text-emerald-300" : "text-red-300"
                            }`}
                    >
                        {formatCurrency(summary.neto)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        Ingresos menos egresos confirmados
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-wide opacity-70">
                        Ticket promedio
                    </div>
                    <div className="mt-1 text-lg md:text-xl font-semibold tabular-nums">
                        {formatCurrency(summary.ticketPromedio)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-70">
                        Monto medio por transacción confirmada
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
                            setTipoFilter("Todos");
                            setEstadoFilter("Todos");
                            setNegocioFilter("Todos");
                            setMetodoFilter("Todos");
                            setFromDate("");
                            setToDate("");
                            setSearch("");
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Tipo</label>
                        <select
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                        >
                            {TIPO_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Estado</label>
                        <select
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                        >
                            {ESTADO_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
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
                            {NEGOCIO_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Método de pago</label>
                        <select
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={metodoFilter}
                            onChange={(e) => setMetodoFilter(e.target.value)}
                        >
                            {METODO_PAGO_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Desde</label>
                        <input
                            type="date"
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="opacity-80">Hasta</label>
                        <input
                            type="date"
                            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-2 py-1.5"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4 text-xs md:text-sm">
                    <label className="opacity-80 block mb-1">Búsqueda rápida</label>
                    <input
                        type="text"
                        placeholder="Buscar por descripción, referencia, categoría o ID…"
                        className="w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] px-3 py-1.5"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Resumen de pendientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm text-xs md:text-sm">
                    <div className="flex items-center justify-between">
                        <div className="font-medium">Transacciones pendientes</div>
                        <div className="text-[11px] opacity-70">
                            {pendingSummary.count} pendiente(s)
                        </div>
                    </div>
                    <div className="mt-2 text-[11px] opacity-80">
                        Monto pendiente:{" "}
                        <span className="font-semibold tabular-nums">
                            {formatCurrency(pendingSummary.totalPendiente)}
                        </span>
                    </div>
                    <p className="mt-1 text-[11px] opacity-70">
                        Estas transacciones afectan flujo de caja futuro. Idealmente, el
                        corporativo debería revisar y confirmar o anular.
                    </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm text-xs md:text-sm">
                    <div className="flex items-center justify-between">
                        <div className="font-medium">Resumen de registros</div>
                        <div className="text-[11px] opacity-70">
                            {summary.totalCount} transacción(es)
                        </div>
                    </div>
                    <p className="mt-2 text-[11px] opacity-80">
                        Este módulo se conecta con:
                    </p>
                    <ul className="mt-1 list-disc list-inside text-[11px] opacity-80 space-y-1">
                        <li>Dashboards corporativos (flujo de caja, márgenes, KPIs).</li>
                        <li>Propiedades y negocios para ver rentabilidad por activo.</li>
                        <li>Indicadores para proyecciones y escenarios.</li>
                    </ul>
                </div>
            </div>

            {/* Tabla de transacciones */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="text-sm font-medium">Detalle de transacciones</div>
                    <div className="text-[11px] opacity-70">
                        {filtered.length} registro(s) encontrado(s)
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs md:text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_94%,black_6%)]">
                                <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                                <th className="px-3 py-2 text-left font-semibold">Negocio / Ubicación</th>
                                <th className="px-3 py-2 text-left font-semibold">Tipo</th>
                                <th className="px-3 py-2 text-left font-semibold">Categoría</th>
                                <th className="px-3 py-2 text-left font-semibold">Descripción</th>
                                <th className="px-3 py-2 text-left font-semibold">Método</th>
                                <th className="px-3 py-2 text-right font-semibold">Monto</th>
                                <th className="px-3 py-2 text-left font-semibold">Estado</th>
                                <th className="px-3 py-2 text-left font-semibold">Ref / ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-3 py-6 text-center text-[12px] opacity-70"
                                    >
                                        No hay transacciones para mostrar con los filtros actuales.
                                    </td>
                                </tr>
                            )}

                            {filtered.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-[color-mix(in_srgb,var(--border)_70%,transparent_30%)] hover:bg-[color-mix(in_srgb,var(--panel)_90%,black_10%)] transition-colors"
                                >
                                    <td className="px-3 py-2 align-top whitespace-nowrap text-[12px] tabular-nums">
                                        {t.fecha}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        <div className="leading-snug">{t.negocio}</div>
                                        <div className="text-[11px] opacity-70">{t.ubicacion}</div>
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${t.tipo === "Ingreso"
                                                    ? "bg-emerald-500/15 text-emerald-300"
                                                    : "bg-red-500/15 text-red-300"
                                                }`}
                                        >
                                            {t.tipo}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 align-top text-[12px]">
                                        {t.categoria}
                                    </td>
                                    <td className="px-3 py-2 align-top text-[12px]">
                                        <div className="line-clamp-2">{t.descripcion}</div>
                                    </td>
                                    <td className="px-3 py-2 align-top text-[12px]">
                                        {t.metodoPago}
                                    </td>
                                    <td className="px-3 py-2 align-top text-right tabular-nums">
                                        {formatCurrency(t.monto, t.moneda)}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${t.estado === "Confirmada"
                                                    ? "bg-emerald-500/15 text-emerald-300"
                                                    : t.estado === "Pendiente"
                                                        ? "bg-amber-500/15 text-amber-200"
                                                        : "bg-slate-500/20 text-slate-200"
                                                }`}
                                        >
                                            {t.estado}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 align-top text-[11px]">
                                        <div className="tabular-nums">{t.id}</div>
                                        <div className="opacity-70">{t.referencia}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen inferior */}
                <div className="px-4 py-3 border-t border-[var(--border)] text-[11px] md:text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="opacity-75">
                        <span className="font-semibold">Resumen filtros · </span>
                        {summary.totalCount} transacción(es), ingresos{" "}
                        <span className="tabular-nums">
                            {formatCurrency(summary.ingresos)}
                        </span>
                        , egresos{" "}
                        <span className="tabular-nums">
                            {formatCurrency(summary.egresos)}
                        </span>
                        , flujo neto{" "}
                        <span
                            className={`tabular-nums font-semibold ${summary.neto >= 0 ? "text-emerald-300" : "text-red-300"
                                }`}
                        >
                            {formatCurrency(summary.neto)}
                        </span>
                        .
                    </div>
                    <div className="opacity-75">
                        Ticket promedio:{" "}
                        <span className="font-semibold tabular-nums">
                            {formatCurrency(summary.ticketPromedio)}
                        </span>
                        .
                    </div>
                </div>
            </div>
        </section>
    );
}
