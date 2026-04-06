// client/src/features/corporativo/Negocios/pages/NegociosResumenPage.jsx
import React, { useMemo } from "react";
import { Building2, Activity, TrendingUp } from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

function Card({ title, subtitle, children, className }) {
    return (
        <section
            className={cx(
                "rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm",
                className
            )}
        >
            <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-semibold">{title}</h3>
                        {subtitle ? (
                            <p className="text-sm opacity-75 mt-0.5">{subtitle}</p>
                        ) : null}
                    </div>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </section>
    );
}

function Kpi({ icon: Icon, label, value, hint }) {
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] p-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)]">
                    <Icon size={18} className="opacity-80" />
                </div>
                <div className="min-w-0">
                    <div className="text-sm opacity-75">{label}</div>
                    <div className="text-xl font-semibold leading-tight">{value}</div>
                    {hint ? <div className="text-xs opacity-70 mt-0.5">{hint}</div> : null}
                </div>
            </div>
        </div>
    );
}

export default function NegociosResumenPage() {
    const kpis = useMemo(
        () => [
            { icon: Building2, label: "Negocios activos", value: "〞", hint: "Desde cat芍logo/BD" },
            { icon: TrendingUp, label: "Producci車n mensual", value: "〞", hint: "Sumatoria (activos)" },
            { icon: Activity, label: "Alertas", value: "〞", hint: "Reglas/umbrales" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Resumen</h2>
                <p className="text-sm opacity-75">
                    Vista general del m車dulo: KPIs, actividad y alertas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.map((k) => (
                    <Kpi key={k.label} {...k} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="Actividad reciente" subtitle="Eventos y movimientos recientes del m車dulo.">
                    <div className="text-sm opacity-75">
                        Sin datos a迆n. Aqu赤 ir芍n eventos como: negocio creado, unidad asignada, banco agregado, etc.
                    </div>
                    <div className="mt-4 rounded-xl border border-[var(--border)] p-3 text-sm opacity-75">
                        Tip: conecta esto al store (Zustand) y a tu API cuando est谷 listo.
                    </div>
                </Card>

                <Card title="Alertas" subtitle="Reglas enterprise (umbrales) y pendientes.">
                    <div className="text-sm opacity-75">
                        Sin alertas configuradas. Ejemplos: producci車n &lt; m赤nimo, unidades sin negocio, cuentas sin banco, etc.
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[var(--border)] p-3 text-sm">
                            <div className="font-semibold">Regla sugerida</div>
                            <div className="opacity-75">Unidades ※ACTIVAS§ sin businessId.</div>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] p-3 text-sm">
                            <div className="font-semibold">Regla sugerida</div>
                            <div className="opacity-75">Negocios activos sin cuentas.</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
