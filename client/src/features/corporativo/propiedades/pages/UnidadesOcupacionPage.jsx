// client/src/features/corporativo/Propiedades/Unidades/UnidadesOcupacionPage.jsx
import React, { useEffect, useMemo } from "react";
import { Building2, CheckCircle2, Wrench, BedDouble, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";

export default function UnidadesOcupacionPage() {
    const { load, loading, selectStatusSummary } = useUnitsStore((s) => ({
        load: s.load,
        loading: s.loading,
        selectStatusSummary: s.selectStatusSummary,
    }));

    useEffect(() => {
        load();
    }, [load]);

    const rows = useMemo(() => selectStatusSummary(), [selectStatusSummary]);

    const total = rows.reduce((acc, r) => acc + r.count, 0);
    const ocupadas = rows.find((r) => String(r.estado).toLowerCase() === "ocupada")?.count ?? 0;
    const disponibles = rows.find((r) => String(r.estado).toLowerCase() === "disponible")?.count ?? 0;
    const mantenimiento = rows.find((r) => String(r.estado).toLowerCase() === "mantenimiento")?.count ?? 0;

    const ocupacion = total ? (ocupadas / total) * 100 : 0;
    const disponibilidad = total ? (disponibles / total) * 100 : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">Ocupaci¨®n de unidades</h1>
                <p className="text-sm text-[color-mix(in_srgb,var(--text)_70%,transparent)]">
                    Vista agregada del estado operativo de las unidades en todo el portafolio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><Building2 className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Unidades totales</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : total}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Ocupadas</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : ocupadas}</div>
                        <div className="text-[11px] opacity-70">{loading ? "" : `${ocupacion.toFixed(0)}% del portafolio`}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><BedDouble className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Disponibles</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : disponibles}</div>
                        <div className="text-[11px] opacity-70">{loading ? "" : `${disponibilidad.toFixed(0)}% libres para renta`}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><Wrench className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Mantenimiento</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : mantenimiento}</div>
                    </div>
                </div>
            </div>

            <div className="neo-plate neo-plate--raised h-[260px]">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold mb-1">Unidades por estado</h2>
                        <p className="text-xs opacity-70">Distribuci¨®n simple por estado operativo.</p>
                    </div>
                    {loading && (
                        <div className="text-xs opacity-70 flex items-center gap-2 pr-2">
                            <Loader2 className="w-4 h-4 animate-spin opacity-70" />
                            Cargando??
                        </div>
                    )}
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rows} margin={{ top: 10, right: 16, left: -20, bottom: 8 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-[color-mix(in_srgb,var(--border)_70%,transparent)]"
                            vertical={false}
                        />
                        <XAxis dataKey="estado" tick={{ fontSize: 11 }} tickMargin={8} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip
                            cursor={{ opacity: 0.06 }}
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid var(--border)",
                                backgroundColor: "color-mix(in srgb, var(--panel) 95%, var(--bg) 5%)",
                            }}
                        />
                        <Bar dataKey="count" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

