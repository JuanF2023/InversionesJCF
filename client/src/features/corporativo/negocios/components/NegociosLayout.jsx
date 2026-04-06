// client/src/features/corporativo/Negocios/NegociosLayout.jsx
import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Wallet, Layers, Briefcase } from "lucide-react";

import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";
import AddAction from "@/core/ui/primitives/AddAction.jsx";

/**
 * Negocios - Layout (nivel 1)
 * - 1 click por secci¨®n (sin profundidad)
 * - Cada vista debe ser "overview" completo del tema
 *
 * Reglas UX:
 * - En /negocios/nuevo y /negocios/:businessId/* se mantiene "Resumen" activo.
 */
const BASE_TABS = [
  { to: "resumen", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "operacion", label: "Operaci¨®n", icon: Briefcase },
  { to: "finanzas", label: "Finanzas", icon: Wallet },
  { to: "unidades", label: "Unidades", icon: Layers },
  { to: "configuracion", label: "Configuraci¨®n", icon: Settings },
];

function shouldForceResumen(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "");

  // Si estoy exactamente en secciones L1, NO forzar Resumen
  if (p.endsWith("/corporativo/negocios/resumen")) return false;
  if (p.endsWith("/corporativo/negocios/operacion")) return false;
  if (p.endsWith("/corporativo/negocios/finanzas")) return false;
  if (p.endsWith("/corporativo/negocios/unidades")) return false;
  if (p.endsWith("/corporativo/negocios/configuracion")) return false;

  // Rutas hijas donde quieres mantener "Resumen" marcado
  // /corporativo/negocios
  // /corporativo/negocios/nuevo
  // /corporativo/negocios/:businessId
  // /corporativo/negocios/:businessId/editar
  // /corporativo/negocios/:businessId/*
  if (p.includes("/corporativo/negocios/")) return true;

  return false;
}

export default function NegociosLayout() {
  const { pathname } = useLocation();

  const tabs = useMemo(() => {
    const forceResumen = shouldForceResumen(pathname);

    return BASE_TABS.map((t) => ({
      ...t,
      // L1: exact-match por defecto
      end: t.end !== undefined ? t.end : true,
      // Forzamos "Resumen" activo en rutas hijas
      forceActive: t.to === "resumen" ? forceResumen : false,
    }));
  }, [pathname]);

  return (
    <section className="w-full">
      <RouteTabs
        items={tabs}
        ariaLabel="Secciones de negocios"
        level="l1"
        action={<AddAction to="nuevo">Agregar negocio</AddAction>}
      />

      <div className="pt-6">
        <Outlet />
      </div>
    </section>
  );
}



