// client/src/features/corporativo/Propiedades/Unidades/UnidadesLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Grid3X3, Percent, MapPin, Plus } from "lucide-react";
import RouteTabs from "@/components/ui/navigation/RouteTabs.jsx";

/**
 * Tabs del submódulo Unidades:
 * - Lista
 * - Ocupación
 * - Mapa
 *
 * (Rentas y Plantillas se eliminaron de la UX por ahora)
 */
const TABS = [
    { to: "lista", label: "Lista", icon: Grid3X3, index: true },
    { to: "ocupacion", label: "Ocupación", icon: Percent },
    { to: "mapa", label: "Mapa", icon: MapPin },
];

export default function UnidadesLayout() {
    return (
        <section className="w-full">
            <RouteTabs
                items={TABS}
                ariaLabel="Gestión de unidades"
                action={
                    <Link
                        to="nueva"
                        className="
              inline-flex items-center gap-1.5 rounded-full
              border border-[var(--border)]
              px-3.5 py-1.5 text-xs sm:text-sm font-medium
              bg-[color-mix(in_srgb,var(--panel)_90%,var(--bg)_10%)]
              text-[color-mix(in_srgb,var(--text)_92%,var(--bg)_8%)]
              shadow-sm
              hover:bg-[color-mix(in_srgb,var(--panel)_84%,var(--accent)_16%)]
              hover:shadow-md
              transition-all
            "
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Nueva unidad</span>
                        <span className="sm:hidden">Nueva</span>
                    </Link>
                }
            />

            <div className="pt-6">
                <Outlet />
            </div>
        </section>
    );
}
