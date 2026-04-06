// client/src/features/corporativo/Propiedades/Unidades/UnidadesListPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Building2, Percent, DollarSign, MapPin, Edit3, Loader2, RefreshCw } from "lucide-react";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";

const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

export default function UnidadesListPage() {
    const items = useUnitsStore((s) => s.items);
    const loading = useUnitsStore((s) => s.loading);
    const error = useUnitsStore((s) => s.error);
    const load = useUnitsStore((s) => s.load);
    const fetchUnits = useUnitsStore((s) => s.fetchUnits);

    const [q, setQ] = useState("");

    useEffect(() => {
        load();
    }, [load]);

    const rows = useMemo(() => {
        const term = q.trim().toLowerCase();
        const filtered = !term
            ? items
            : (items || []).filter((u) => {
                const nombre = String(u.nombre || u.name || "").toLowerCase();
                const codigo = String(u.codigo || u.code || "").toLowerCase();
                const propiedad = String(
                    u?.propiedad?.nombre || u?.property?.nombre || u?.propiedadNombre || ""
                ).toLowerCase();
                return nombre.includes(term) || codigo.includes(term) || propiedad.includes(term);
            });

        return (filtered || []).map((u) => ({
            id: u._id || u.id,
            nombre: u.nombre || u.name || "??,
            codigo: u.codigo || u.code || "??,
            propiedad: u?.propiedad?.nombre || u?.property?.nombre || u?.propiedadNombre || "??,
            tipo: u.tipo || u.unitType || "??,
            estado: u.estado || u.state || "??,
            renta: Number(u?.baseRent?.amount ?? u?.rentaMensual ?? u?.renta ?? 0) || 0,
            moneda: u?.baseRent?.currency || u?.moneda || "USD",
            ubicacion: u.nivel || u.levelLabel || u.ubicacionEtiqueta || "??,
        }));
    }, [items, q]);

    const totalUnidades = rows.length;
    const ocupadas = rows.filter((u) => String(u.estado).toLowerCase() === "ocupada").length;
    const ocupacion = totalUnidades ? Math.round((ocupadas / totalUnidades) * 100) : 0;
    const rentaTotal = rows.reduce((acc, u) => acc + (u.renta || 0), 0);

    return (
        <div className="space-y-6">
            {/* ENCABEZADO */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Unidades</h1>
                    <p className="text-sm text-[color-mix(in_srgb,var(--text)_70%,transparent)]">
                        Gesti車n centralizada de unidades de todas las propiedades.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchUnits()}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium
                     bg-[color-mix(in_srgb,var(--panel)_92%,var(--bg)_8%)]
                     hover:bg-[color-mix(in_srgb,var(--panel)_88%,var(--accent)_12%)]
                     transition-colors"
                >
                    <RefreshCw className={["w-3.5 h-3.5", loading ? "animate-spin" : ""].join(" ")} />
                    Actualizar
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Unidades registradas</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : totalUnidades}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon">
                        <Percent className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Ocupaci車n</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : `${ocupacion}%`}</div>
                    </div>
                </div>

                <div className="neo-plate neo-plate--soft flex items-center gap-3">
                    <div className="neo-chip neo-chip--icon">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase">Renta mensual</div>
                        <div className="text-2xl font-semibold">{loading ? "?? : money(rentaTotal)}</div>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="neo-plate neo-plate--raised overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-sm font-semibold">Listado de unidades</h2>
                        <p className="text-xs opacity-70">Vista consolidada para todas las propiedades.</p>
                    </div>

                    <div className="w-full md:w-72">
                        <input
                            type="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar por unidad, c車digo o propiedad??
                            className="w-full rounded-full border border-[var(--border)]
                         bg-[color-mix(in_srgb,var(--panel)_92%,var(--bg)_8%)]
                         px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-4 text-sm opacity-80 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin opacity-70" />
                        Cargando unidades??
                    </div>
                ) : error ? (
                    <div className="p-4 text-sm opacity-80">
                        <span className="font-medium">No se pudieron cargar las unidades.</span>
                        <div className="text-xs opacity-70 mt-1">{String(error)}</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wide opacity-70 border-b border-[var(--border)]">
                                    <th className="px-4 py-2">Unidad</th>
                                    <th className="px-4 py-2">Propiedad</th>
                                    <th className="px-4 py-2">Tipo</th>
                                    <th className="px-4 py-2">Estado</th>
                                    <th className="px-4 py-2">Renta</th>
                                    <th className="px-4 py-2">Ubicaci車n</th>
                                    <th className="px-4 py-2 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-b border-[color-mix(in_srgb,var(--border)_70%,transparent)] last:border-none
                               hover:bg-[color-mix(in_srgb,var(--panel)_96%,var(--accent)_4%)] transition-colors"
                                    >
                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium flex items-center gap-1.5">
                                                    <Home className="w-3.5 h-3.5 opacity-70" /> {u.nombre}
                                                </span>
                                                <span className="text-[11px] opacity-70">{u.codigo}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 opacity-70" />
                                                {u.propiedad}
                                            </div>
                                        </td>

                                        <td className="px-4 py-2 align-middle">{u.tipo}</td>

                                        <td className="px-4 py-2 align-middle">
                                            <span
                                                className={[
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                    String(u.estado).toLowerCase() === "disponible"
                                                        ? "bg-emerald-50/70 text-emerald-700 border-emerald-200/70"
                                                        : String(u.estado).toLowerCase() === "ocupada"
                                                            ? "bg-sky-50/70 text-sky-700 border-sky-200/70"
                                                            : "bg-zinc-50/70 text-zinc-700 border-zinc-200/70",
                                                ].join(" ")}
                                            >
                                                {u.estado}
                                            </span>
                                        </td>

                                        <td className="px-4 py-2 align-middle">{money(u.renta)}</td>

                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 opacity-70" /> {u.ubicacion}
                                            </div>
                                        </td>

                                        <td className="px-4 py-2 align-middle text-right">
                                            <Link
                                                to={`/corporativo/propiedades/unidades/${u.id}/editar`}
                                                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)]
                                   px-3 py-1 text-xs font-medium
                                   hover:bg-[color-mix(in_srgb,var(--panel)_92%,var(--accent)_8%)]
                                   transition-colors"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {rows.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-6 text-sm opacity-70" colSpan={7}>
                                            No hay unidades registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

