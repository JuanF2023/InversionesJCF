// client/src/features/corporativo/dashboards/components/PanelPropiedades.jsx
import React from "react";
import {
    Home,
    Building2,
    BedDouble,
    MapPin,
    Wrench,
    AlertTriangle,
    DollarSign,
    LineChart,
    CalendarClock,
} from "lucide-react";

const RESUMEN_PROP = {
    totalPropiedades: 8,
    totalUnidades: 24,
    ocupadas: 20,
    rentaMensualEsperada: 5650,
    rentaCobradaMes: 4980,
};

const OCUPACION = [
    { etiqueta: "Apartamentos", codigo: "APT", unidades: 12, ocupadas: 11 },
    { etiqueta: "Locales comerciales", codigo: "LOC", unidades: 6, ocupadas: 5 },
    { etiqueta: "Bodegas / Parqueos", codigo: "BOD", unidades: 4, ocupadas: 3 },
    { etiqueta: "Otros", codigo: "OTR", unidades: 2, ocupadas: 1 },
];

const RENTAS = [
    { etiqueta: "Lourdes Col車n", renta: 2950 },
    { etiqueta: "Chaparral / Restaurantes", renta: 1800 },
    { etiqueta: "Los 芍ngeles (USA)", renta: 900 },
];

const RIESGOS = [
    {
        tipo: "Renta vencida",
        detalle: "APT-04 每 15 d赤as de atraso.",
        severidad: "alta",
    },
    {
        tipo: "Contrato pr車ximo",
        detalle: "Local #3 Pol赤gono 33-B vence en 30 d赤as.",
        severidad: "media",
    },
    {
        tipo: "Mantenimiento",
        detalle: "Revisi車n de techo en APT-02 pendiente.",
        severidad: "media",
    },
    {
        tipo: "Vacancia",
        detalle: "Parqueo BOD-02 lleva 60 d赤as vac赤o.",
        severidad: "baja",
    },
];

const CALENDARIO = [
    {
        fecha: "05",
        mes: "dic",
        tipo: "Cobro renta",
        detalle: "Renta mensual apartamentos APT-01/02/03.",
    },
    {
        fecha: "10",
        mes: "dic",
        tipo: "Renovaci車n",
        detalle: "Revisi車n de contrato Local #2 每 Pol赤gono 33-B.",
    },
    {
        fecha: "18",
        mes: "dic",
        tipo: "Mantenimiento",
        detalle: "Servicio de plomer赤a programado en APT-04.",
    },
];

function formatCurrency(v) {
    return v.toLocaleString("es-SV", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });
}

export default function PanelPropiedades() {
    const ocupacionTotal =
        RESUMEN_PROP.totalUnidades === 0
            ? 0
            : (RESUMEN_PROP.ocupadas / RESUMEN_PROP.totalUnidades) * 100;

    const rentaCobertura =
        RESUMEN_PROP.rentaMensualEsperada === 0
            ? 0
            : (RESUMEN_PROP.rentaCobradaMes /
                RESUMEN_PROP.rentaMensualEsperada) *
            100;

    const rentaEsperadaTotal = RENTAS.reduce((acc, r) => acc + r.renta, 0);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
                        <Home className="w-6 h-6 text-[var(--accent)]" />
                        Dashboard de propiedades
                    </h1>
                    <p className="text-sm subtle mt-1">
                        Vista consolidada de ocupaci車n, rentas y riesgos de tus propiedades
                        (apartamentos, locales, bodegas y otros).
                    </p>
                </div>
                <div className="text-right text-xs sm:text-sm subtle">
                    <div className="font-semibold text-[var(--text)]">
                        M車dulo: Gesti車n inmobiliaria
                    </div>
                    <div>
                        Soporta El Salvador y USA, integrado con transacciones y proyectos.
                    </div>
                </div>
            </header>

            {/* KPIs PRINCIPALES */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* Total propiedades */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Propiedades registradas
                        </span>
                        <Building2 className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="text-2xl font-semibold tabular-nums">
                        {RESUMEN_PROP.totalPropiedades}
                    </div>
                    <p className="text-xs subtle">
                        Incluye apartamentos, locales, bodegas y cualquier unidad de renta
                        asociada.
                    </p>
                </div>

                {/* Unidades y ocupaci車n */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Unidades de renta
                        </span>
                        <BedDouble className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {RESUMEN_PROP.totalUnidades}
                            </div>
                            <p className="text-xs subtle">
                                {RESUMEN_PROP.ocupadas} ocupadas /{" "}
                                {RESUMEN_PROP.totalUnidades - RESUMEN_PROP.ocupadas} vacantes.
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] subtle mb-1">Ocupaci車n total</div>
                            <div className="text-sm font-semibold tabular-nums">
                                {ocupacionTotal.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Renta esperada */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Renta mensual esperada
                        </span>
                        <DollarSign className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="text-2xl font-semibold tabular-nums">
                        {formatCurrency(RESUMEN_PROP.rentaMensualEsperada)}
                    </div>
                    <p className="text-xs subtle">
                        Calculado con contratos vigentes y tarifas de cada unidad de renta.
                    </p>
                </div>

                {/* Renta cobrada */}
                <div className="neo-card p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide subtle">
                            Renta cobrada / mes
                        </span>
                        <LineChart className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {formatCurrency(RESUMEN_PROP.rentaCobradaMes)}
                            </div>
                            <p className="text-xs subtle">Ingresos registrados en el m車dulo de transacciones.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] subtle mb-1">Cobertura</div>
                            <div
                                className={`text-sm font-semibold tabular-nums ${rentaCobertura >= 95
                                        ? "text-emerald-500"
                                        : rentaCobertura >= 80
                                            ? "text-amber-400"
                                            : "text-rose-500"
                                    }`}
                            >
                                {rentaCobertura.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OCUPACI車N POR TIPO & RENTAS POR ZONA */}
            <section className="kpi-split gap-4">
                {/* Ocupaci車n por tipo */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <Home className="w-4 h-4 text-[var(--accent)]" />
                                Ocupaci車n por tipo de unidad
                            </h2>
                            <p className="text-xs subtle">
                                Distribuci車n de ocupaci車n entre apartamentos, locales y otras
                                unidades.
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 space-y-1.5">
                        {OCUPACION.map((t) => {
                            const pct =
                                t.unidades === 0
                                    ? 0
                                    : (t.ocupadas / t.unidades) * 100;

                            return (
                                <div key={t.codigo} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[color-mix(in_oklab,var(--panel)_85%,var(--accent)_15%)] text-[11px] font-semibold">
                                        {t.codigo}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="font-semibold truncate">
                                                {t.etiqueta}
                                            </span>
                                            <span className="tabular-nums subtle">
                                                {t.ocupadas}/{t.unidades} ({pct.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-[color-mix(in_oklab,var(--panel)_80%,var(--border)_20%)] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                                style={{ width: `${pct.toFixed(1)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-2 text-[11px] subtle">
                        Idealmente, las unidades de mayor demanda (apartamentos y locales)
                        deben mantenerse por arriba del 90% de ocupaci車n.
                    </p>
                </div>

                {/* Rentas por zona */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                                Rentas por zona / pa赤s
                            </h2>
                            <p className="text-xs subtle">
                                Suma de rentas esperadas por ubicaci車n (El Salvador / USA).
                            </p>
                        </div>
                        <div className="text-xs subtle text-right">
                            Total esperado
                            <div className="tabular-nums font-semibold">
                                {formatCurrency(rentaEsperadaTotal)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 mt-1">
                        {RENTAS.map((r) => {
                            const pct =
                                rentaEsperadaTotal === 0
                                    ? 0
                                    : (r.renta / rentaEsperadaTotal) * 100;

                            return (
                                <div
                                    key={r.etiqueta}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="font-semibold truncate">
                                                {r.etiqueta}
                                            </span>
                                            <span className="tabular-nums subtle">
                                                {pct.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-[color-mix(in_oklab,var(--panel)_80%,var(--border)_20%)] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[color-mix(in_oklab,var(--accent)_40%,#000_10%)] to-[var(--accent)]"
                                                style={{ width: `${pct.toFixed(1)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold tabular-nums ml-2">
                                        {formatCurrency(r.renta)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-2 text-[11px] subtle">
                        Luego puedes separar por moneda, tipo de contrato o negocio
                        asociado (REST01, LOC01, APT04, etc.).
                    </p>
                </div>
            </section>

            {/* RIESGOS + CALENDARIO */}
            <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                {/* Riesgos y pendientes */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Riesgos y pendientes en propiedades
                        </h2>
                        <span className="text-[11px] subtle">
                            Cobros, contratos y mantenimientos clave.
                        </span>
                    </div>

                    <div className="space-y-2 text-[13px]">
                        {RIESGOS.map((r, idx) => {
                            let colorClasses = "border-slate-500/40 bg-slate-700/10";
                            if (r.severidad === "alta") {
                                colorClasses = "border-rose-500/50 bg-rose-500/10";
                            } else if (r.severidad === "media") {
                                colorClasses = "border-amber-500/50 bg-amber-500/10";
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`border rounded-lg px-3 py-2 flex items-start gap-2 ${colorClasses}`}
                                >
                                    <div className="pt-[2px]">
                                        <Wrench className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-semibold uppercase tracking-wide">
                                            {r.tipo}
                                        </div>
                                        <div className="text-[13px] leading-snug">
                                            {r.detalle}
                                        </div>
                                    </div>
                                    <span className="text-[10px] subtle capitalize">
                                        {r.severidad}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-1 text-[11px] subtle">
                        Este bloque se alimentar芍 de contratos, bit芍coras de mantenimiento,
                        車rdenes del restaurante y transacciones relacionadas a propiedades.
                    </p>
                </div>

                {/* Calendario de eventos */}
                <div className="neo-card p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-[var(--accent)]" />
                            Calendario de rentas y mantenimientos
                        </h2>
                        <span className="text-[11px] subtle">Pr車ximos 30 d赤as</span>
                    </div>

                    <div className="space-y-2">
                        {CALENDARIO.map((c, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 rounded-lg border border-[color-mix(in_oklab,var(--border)_70%,var(--accent)_30%)] bg-[color-mix(in_oklab,var(--panel)_92%,var(--accent)_8%)] px-3 py-2"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[var(--panel)] flex flex-col items-center justify-center text-[11px] font-semibold">
                                    <span>{c.fecha}</span>
                                    <span className="uppercase subtle">{c.mes}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide">
                                        {c.tipo}
                                    </div>
                                    <div className="text-[13px] leading-snug truncate">
                                        {c.detalle}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-1 text-[11px] subtle">
                        M芍s adelante podr芍s sincronizar esto con recordatorios por WhatsApp
                        o correo a inquilinos y proveedores.
                    </p>
                </div>
            </section>
        </div>
    );
}
