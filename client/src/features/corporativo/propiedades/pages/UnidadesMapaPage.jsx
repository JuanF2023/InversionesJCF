// client/src/features/corporativo/Propiedades/Unidades/UnidadesMapaPage.jsx
import React, { useEffect, useMemo } from "react";
import { MapPin, Globe2, Building2, Loader2 } from "lucide-react";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";

export default function UnidadesMapaPage() {
    const { load, loading, selectGeoSummary } = useUnitsStore((s) => ({
        load: s.load,
        loading: s.loading,
        selectGeoSummary: s.selectGeoSummary,
    }));

    useEffect(() => {
        load();
    }, [load]);

    const geo = useMemo(() => selectGeoSummary(), [selectGeoSummary]);

    const total = geo.reduce((acc, r) => acc + r.unidades, 0);
    const paises = new Set(geo.map((r) => r.pais)).size;
    const municipios = new Set(geo.map((r) => r.municipio)).size;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">Distribuci¨®n geogr¨¢fica</h1>
                <p className="text-sm text-[color-mix(in_srgb,var(--text)_70%,transparent)]">
                    Resumen por pa¨ªs, departamento y municipio de las unidades registradas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><Globe2 className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Pa¨ªses</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : paises}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><MapPin className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Municipios</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : municipios}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon"><Building2 className="w-4 h-4" /></div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Unidades</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : total}</div>
                    </div>
                </div>
            </div>

            <div className="neo-plate neo-plate--raised overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-semibold">Detalle por municipio</h2>
                        <p className="text-xs opacity-70">
                            Luego podemos conectar esto con un mapa real o con capas por propiedad.
                        </p>
                    </div>

                    {loading && (
                        <div className="text-xs opacity-70 flex items-center gap-2 pr-2">
                            <Loader2 className="w-4 h-4 animate-spin opacity-70" />
                            Cargando??
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide opacity-70 border-b border-[var(--border)]">
                                <th className="px-4 py-2">Pa¨ªs</th>
                                <th className="px-4 py-2">Departamento</th>
                                <th className="px-4 py-2">Municipio</th>
                                <th className="px-4 py-2 text-right">Unidades</th>
                            </tr>
                        </thead>
                        <tbody>
                            {geo.map((row, idx) => (
                                <tr
                                    key={`${row.pais}-${row.departamento}-${row.municipio}-${idx}`}
                                    className="border-b border-[color-mix(in_srgb,var(--border)_70%,transparent)] last:border-none hover:bg-[color-mix(in_srgb,var(--panel)_96%,var(--accent)_4%)] transition-colors"
                                >
                                    <td className="px-4 py-2 align-middle">{row.pais}</td>
                                    <td className="px-4 py-2 align-middle">{row.departamento}</td>
                                    <td className="px-4 py-2 align-middle">{row.municipio}</td>
                                    <td className="px-4 py-2 align-middle text-right">{row.unidades}</td>
                                </tr>
                            ))}

                            {!loading && geo.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-sm opacity-70" colSpan={4}>
                                        No hay datos geogr¨¢ficos a¨²n (faltan ubicaciones en propiedades/unidades).
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

