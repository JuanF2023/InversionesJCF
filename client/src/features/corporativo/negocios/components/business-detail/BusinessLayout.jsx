// client/src/features/corporativo/Negocios/BusinessLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Wallet, Layers, Briefcase } from "lucide-react";

import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";
import AddAction from "@/core/ui/primitives/AddAction.jsx";

/**
 * Negocios - Layout (nivel 1)
 * - Tabs L1 siempre visibles
 * - El tab activo se mantiene aun en rutas hijas (/nuevo, /:id, /:id/editar)
 * - No fuerza profundidad: cada tab es overview completo
 */

const TABS = [
  { to: "resumen", label: "Resumen", icon: LayoutDashboard },
  { to: "operacion", label: "Operaci贸n", icon: Briefcase },
  { to: "finanzas", label: "Finanzas", icon: Wallet },
  { to: "unidades", label: "Unidades", icon: Layers },
  { to: "configuracion", label: "Configuraci贸n", icon: Settings },
];

function pickActiveBaseTab(pathname) {
  // pathname esperado: /corporativo/negocios/<segmento>...
  const base = "/corporativo/negocios/";
  if (!pathname.startsWith(base)) return "resumen";

  const rest = pathname.slice(base.length); // e.g. "finanzas", "nuevo", "123/editar"
  const first = rest.split("/")[0]?.trim();

  // Si es una secci贸n conocida, la respetamos
  const known = new Set(["resumen", "operacion", "finanzas", "unidades", "configuracion"]);
  if (known.has(first)) return first;

  // Si est谩s en /nuevo o en /:businessId( /editar ), mantenemos "Resumen" como activo
  // (porque es el overview principal y evita 鈥渢abs apagados鈥?
  return "resumen";
}

export default function NegociosLayout() {
  const { pathname } = useLocation();
  const activeBase = pickActiveBaseTab(pathname);

  // RouteTabs usa NavLink, que marca activo por URL.
  // Para que el tab correcto se mantenga activo fuera de su ruta exacta,
  // usamos `end: true` en TODOS y renderizamos un "to" calculado para resaltar.
  // Soluci贸n enterprise: a帽adimos un wrapper visual: "active tab" por clase extra.
  // (No tocamos RouteTabs para no afectar otros m贸dulos.)

  return (
    <section className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <RouteTabs
          items={TABS.map((t) => ({
            ...t,
            end: true, // evita que "resumen" quede activo cuando est谩s en /operacion, etc.
          }))}
          ariaLabel="Secciones de negocios"
          level="l1"
          className="flex-1"
          action={<AddAction to="nuevo">Agregar negocio</AddAction>}
        />

        {/* Indicador visual del tab 鈥渂ase鈥?activo (cuando est谩s en /nuevo /:id/editar) */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs opacity-60">Secci贸n:</span>
          <span className="text-xs font-semibold px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--panel)]">
            {TABS.find((x) => x.to === activeBase)?.label ?? "Resumen"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6">
        <Outlet />
      </div>
    </section>
  );
}


