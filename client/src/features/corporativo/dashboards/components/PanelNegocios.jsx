// client/src/features/corporativo/dashboards/components/PanelNegocios.jsx
import React from "react";
import {
    Building2,
    LineChart,
    Wallet,
    Banknote,
    AlertTriangle,
    Factory,
    Home,
    Store,
} from "lucide-react";

/** Datos mock para el dashboard corporativo (puedes luego conectarlo a la API) */
const SUMMARY_KPIS = {
    ingresosDia: 1820.5,
    ingresosMes: 42890.75,
    margenMes: 0.34, // 34%
    negociosActivos: 6,
    flujoDisponible: 15230.12,
};

const VARIACIONES = {
    ingresosDiaVsAyer: 0.12, // +12%
    ingresosMesVsAnterior: 0.08,
    margenVsAnterior: -0.03,
};

const INGRESOS_7_DIAS = [
    { label: "L", total: 1650 },
    { label: "M", total: 1720 },
    { label: "X", total: 1580 },
    { label: "J", total: 1810 },
    { label: "V", total: 1940 },
    { label: "S", total: 2100 },
    { label: "D", total: 1820 },
];

const BANCOS = [
    { nombre: "Banco Agr赤cola", saldo: 6200.5 },
    { nombre: "Banco Cuscatl芍n", saldo: 4800.0 },
    { nombre: "Banco de Am谷rica Central", saldo: 3450.25 },
    { nombre: "Efectivo caja chica", saldo: 780.0 },
];

const NEGOCIOS_TOP = [
    {
        nombre: "Restaurante Chaparral",
        tipo: "Restaurante",
        codigo: "REST01",
        ingresoDia: 620.0,
        ingresoMes: 12450.0,
        variacion: 0.12,
        estado: "Abierto",
    },
    {
        nombre: "Locales Pol赤gono 33-B",
        tipo: "Propiedades",
        codigo: "LOC01",
        ingresoDia: 300.0,
        ingresoMes: 8200.0,
        variacion: 0.03,
        estado: "Ocupado",
    },
    {
        nombre: "Food Truck #1",
        tipo: "Restaurante",
        codigo: "FOOD01",
        ingresoDia: 450.0,
        ingresoMes: 9100.0,
        variacion: -0.04,
        estado: "Operando",
    },
    {
        nombre: "Apartamentos APT-04",
        tipo: "Propiedades",
        codigo: "APT04",
        ingresoDia: 220.0,
        ingresoMes: 6400.0,
        variacion: 0.02,
        estado: "Ocupado",
    },
];

const ALERTAS = [
    {
        tipo: "contrato",
        mensaje: "Contrato de alquiler APT-04 vence en 12 d赤as.",
        severidad: "media",
    },
    {
        tipo: "mantenimiento",
        mensaje: "Revisi車n de gas propano en Restaurante Chaparral pendiente.",
        severidad: "alta",
    },
    {
        tipo: "cobro",
        mensaje: "Hay 2 rentas vencidas en Pol赤gono 33-B.",
        severidad: "alta",
    },
    {
        tipo: "proyecto",
        mensaje: "Proyecto de ampliaci車n de locales en El Salvador est芍 al 65%.",
        severidad: "baja",
    },
];

function formatCurrency(v) {
    return v.toLocaleString("es-SV", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });
}

function formatPercent(v) {
    return `${(v * 100).toFixed(1)}%`;
}

export default function PanelNegocios() {
    const dt = new Date();
    const monthShort = dt.toLocaleString("es-ES", { month: "short" });
    const todayText = `${dt.getDate()} ${monthShort.charAt(0).toUpperCase() + monthShort.slice(1)
        } ${dt.getFullYear()}`;

    const totalIngresosReferencia = Math.max(
        ...INGRESOS_7_DIAS.map((d) => d.total)
    );

    const totalBancos = BANCOS.reduce((acc, b) => acc + b.saldo, 0);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-[var(--accent)]" />
                        Dashboard corporativo de negocios
                    </h1>
                    <p className="text-sm subtle mt-1">
                        Visi車n consolidada de Inversiones JCF (restaurantes, propiedades,
                        locales y proyectos).
                    </p>
                </div>
                <div className="text-right text-xs sm:text-sm subtle">
                    <div className="font-semibold text-[var(--text)]">
                        Resumen al {todayText}
                    </div>
                    <div>Sesiones, transacciones y producci車n actualizadas en tiempo real.</div>
                </div>
            </header>

            {/* KPIs PRINCIPALES */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* Ingresos d赤a */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Ingresos del d赤a (corporativo)
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold kpi-chip kpi-chip--up">
                            <LineChart className="w-3 h-3" />
                            {formatPercent(VARIACIONES.ingresosDiaVsAyer)}
                        </span>
                    </div>
                    <div className="text-2xl font-semibold tabular-nums">
                        {formatCurrency(SUMMARY_KPIS.ingresosDia)}
                    </div>
                    <p className="text-xs subtle">
                        Comparado con ayer, la producci車n global muestra una variaci車n
                        positiva.
                    </p>
                </div>

                {/* Ingresos mes */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Ingresos del mes
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold kpi-chip kpi-chip--up">
                            <LineChart className="w-3 h-3" />
                            {formatPercent(VARIACIONES.ingresosMesVsAnterior)}
                        </span>
                    </div>
                    <div className="text-2xl font-semibold tabular-nums">
                        {formatCurrency(SUMMARY_KPIS.ingresosMes)}
                    </div>
                    <p className="text-xs subtle">
                        Incluye restaurantes, alquileres de propiedades y otros negocios
                        activos.
                    </p>
                </div>

                {/* Margen mensual */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Margen de rentabilidad del mes
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold kpi-chip ${VARIACIONES.margenVsAnterior >= 0
                                    ? "kpi-chip--up"
                                    : "kpi-chip--down"
                                }`}
                        >
                            <LineChart className="w-3 h-3" />
                            {formatPercent(VARIACIONES.margenVsAnterior)}
                        </span>
                    </div>
                    <div className="text-2xl font-semibold tabular-nums">
                        {formatPercent(SUMMARY_KPIS.margenMes)}
                    </div>
                    <p className="text-xs subtle">
                        Margen estimado usando transacciones de ingresos y gastos
                        registrados.
                    </p>
                </div>

                {/* Negocios activos + caja */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Negocios activos
                        </span>
                        <Wallet className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {SUMMARY_KPIS.negociosActivos}
                            </div>
                            <p className="text-xs subtle">
                                Restaurantes, propiedades y otras unidades operando hoy.
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] subtle mb-1">Flujo disponible</div>
                            <div className="text-sm font-semibold tabular-nums">
                                {formatCurrency(SUMMARY_KPIS.flujoDisponible)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOQUE: TENDENCIA + FLUJO DE CAJA */}
            <section className="kpi-split gap-4">
                {/* Tendencia 迆ltimos 7 d赤as */}
                <div className="neo-card production-card p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <LineChart className="w-4 h-4 text-[var(--accent)]" />
                                Ingresos 迆ltimos 7 d赤as
                            </h2>
                            <p className="text-xs subtle">
                                Vista consolidada de la producci車n diaria por todos los
                                negocios.
                            </p>
                        </div>
                        <div className="text-xs subtle text-right">
                            Base de referencia:{" "}
                            <span className="tabular-nums font-semibold">
                                {formatCurrency(totalIngresosReferencia)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-2 items-end">
                        {INGRESOS_7_DIAS.map((d) => {
                            const heightPct =
                                (d.total / (totalIngresosReferencia || 1)) * 100;
                            return (
                                <div
                                    key={d.label}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className="w-full flex-1 flex items-end">
                                        <div
                                            className="w-full rounded-full bg-gradient-to-t from-[color-mix(in_oklab,var(--accent)_40%,#000_15%)] to-[var(--accent)] shadow-sm"
                                            style={{ height: `${Math.max(heightPct, 8)}%` }}
                                        />
                                    </div>
                                    <div className="text-[11px] subtle font-medium">
                                        {d.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                        <div className="metric-row">
                            <span className="dot dot--activos" />
                            <span>
                                Barra m芍s alta = d赤a con mayor ingreso consolidado en la
                                semana.
                            </span>
                        </div>
                        <div className="metric-row">
                            <span className="dot dot--const" />
                            <span>
                                Puedes conectar este gr芍fico a tus transacciones reales cuando
                                la API est谷 lista.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Flujo de caja por banco */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-[var(--accent)]" />
                                Flujo de caja por banco
                            </h2>
                            <p className="text-xs subtle">
                                Saldos agregados por cuenta bancaria y efectivo.
                            </p>
                        </div>
                        <div className="text-xs subtle text-right">
                            Total en bancos
                            <div className="tabular-nums font-semibold">
                                {formatCurrency(totalBancos)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 mt-1">
                        {BANCOS.map((b) => {
                            const pct = (b.saldo / (totalBancos || 1)) * 100;
                            const siglas = b.nombre
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 3)
                                .toUpperCase();

                            return (
                                <div key={b.nombre} className="bank-row">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="bank-chip">{siglas}</div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold truncate">
                                                {b.nombre}
                                            </div>
                                            <div className="mt-1 h-1.5 w-full rounded-full bg-[color-mix(in_oklab,var(--panel)_80%,var(--border)_20%)] overflow-hidden">
                                                <div
                                                    className="h-full bank-bar"
                                                    style={{ width: `${pct.toFixed(1)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tabular-nums text-xs font-semibold text-right ml-2">
                                        {formatCurrency(b.saldo)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* RANKING NEGOCIOS + ALERTAS */}
            <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                {/* TOP NEGOCIOS */}
                <div className="neo-card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <Store className="w-4 h-4 text-[var(--accent)]" />
                            Negocios con mayor producci車n hoy
                        </h2>
                        <span className="text-[11px] subtle">
                            Basado en ingresos diarios estimados.
                        </span>
                    </div>

                    <div className="overflow-x-auto -mx-2 px-2">
                        <table className="w-full text-xs table-auto text-left table-lined">
                            <thead className="bg-[color-mix(in_oklab,var(--panel)_94%,var(--accent)_6%)]">
                                <tr>
                                    <th className="px-2 py-2 font-semibold">Negocio</th>
                                    <th className="px-2 py-2 font-semibold">Tipo</th>
                                    <th className="px-2 py-2 font-semibold text-right">
                                        Ingreso d赤a
                                    </th>
                                    <th className="px-2 py-2 font-semibold text-right">
                                        Ingreso mes
                                    </th>
                                    <th className="px-2 py-2 font-semibold text-right">
                                        Var.
                                    </th>
                                    <th className="px-2 py-2 font-semibold text-center">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {NEGOCIOS_TOP.map((n, idx) => {
                                    const positive = n.variacion >= 0;
                                    return (
                                        <tr key={n.codigo || idx}>
                                            <td className="px-2 py-1.5">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-[13px]">
                                                        {n.nombre}
                                                    </span>
                                                    <span className="text-[11px] subtle">
                                                        C車digo {n.codigo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <div className="flex items-center gap-1 text-[11px]">
                                                    {n.tipo === "Propiedades" ? (
                                                        <Home className="w-3 h-3 subtle" />
                                                    ) : (
                                                        <Factory className="w-3 h-3 subtle" />
                                                    )}
                                                    <span>{n.tipo}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1.5 text-right tabular-nums">
                                                {formatCurrency(n.ingresoDia)}
                                            </td>
                                            <td className="px-2 py-1.5 text-right tabular-nums">
                                                {formatCurrency(n.ingresoMes)}
                                            </td>
                                            <td
                                                className={`px-2 py-1.5 text-right tabular-nums ${positive ? "text-emerald-600" : "text-rose-600"
                                                    }`}
                                            >
                                                {positive ? "↖" : "��"} {formatPercent(Math.abs(n.variacion))}
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                <span
                                                    className={`inline-flex items-center justify-center px-2 py-[2px] rounded-full text-[11px] font-semibold ${n.estado === "Abierto" || n.estado === "Operando"
                                                            ? "bg-emerald-500/15 text-emerald-400"
                                                            : "bg-slate-500/20 text-slate-200"
                                                        }`}
                                                >
                                                    {n.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-2 text-[11px] subtle">
                        M芍s adelante puedes filtrar por tipo de negocio, pa赤s (El Salvador /
                        USA) o por m車dulo (restaurante, propiedades, veh赤culos, etc.).
                    </p>
                </div>

                {/* ALERTAS Y PR車XIMOS EVENTOS */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Alertas y pr車ximos eventos
                        </h2>
                        <span className="text-[11px] subtle">
                            Contratos, mantenimientos, cobros y proyectos.
                        </span>
                    </div>

                    <div className="space-y-2 text-[13px]">
                        {ALERTAS.map((a, idx) => {
                            let colorClasses = "border-slate-500/40 bg-slate-700/10";
                            if (a.severidad === "alta") {
                                colorClasses = "border-rose-500/50 bg-rose-500/10";
                            } else if (a.severidad === "media") {
                                colorClasses = "border-amber-500/50 bg-amber-500/10";
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`border rounded-lg px-3 py-2 flex items-start gap-2 ${colorClasses}`}
                                >
                                    <div className="pt-[2px]">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-semibold uppercase tracking-wide">
                                            {a.tipo}
                                        </div>
                                        <div className="text-[13px] leading-snug">
                                            {a.mensaje}
                                        </div>
                                    </div>
                                    <span className="text-[10px] subtle capitalize">
                                        {a.severidad}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-1 text-[11px] subtle">
                        Estas alertas pueden alimentarse de tus transacciones, contratos,
                        proyectos y m車dulo de restaurante (車rdenes abiertas, tickets sin
                        cobrar, etc.).
                    </p>
                </div>
            </section>
        </div>
    );
}
