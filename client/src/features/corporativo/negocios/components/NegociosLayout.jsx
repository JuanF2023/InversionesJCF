// client/src/features/corporativo/negocios/components/NegociosLayout.jsx
import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Briefcase, Layers, LayoutDashboard, Settings, Wallet } from "lucide-react";

import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";
import AddAction from "@/core/ui/primitives/AddAction.jsx";

/**
 * Negocios - Layout nivel 1.
 * - Un clic por sección, sin profundidad innecesaria.
 * - Cada vista debe funcionar como overview completo del tema.
 *
 * Reglas UX:
 * - En /negocios/nuevo y /negocios/:businessId/* se mantiene "Resumen" activo.
 */
const BASE_TABS = [
  { to: "resumen", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "operacion", label: "Operación", icon: Briefcase },
  { to: "finanzas", label: "Finanzas", icon: Wallet },
  { to: "unidades", label: "Unidades", icon: Layers },
  { to: "configuracion", label: "Configuración", icon: Settings },
];

function shouldForceResumen(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "");

  if (p.endsWith("/corporativo/negocios/resumen")) return false;
  if (p.endsWith("/corporativo/negocios/operacion")) return false;
  if (p.endsWith("/corporativo/negocios/finanzas")) return false;
  if (p.endsWith("/corporativo/negocios/unidades")) return false;
  if (p.endsWith("/corporativo/negocios/configuracion")) return false;

  return p.includes("/corporativo/negocios/");
}

export default function NegociosLayout() {
  const { pathname } = useLocation();

  const tabs = useMemo(() => {
    const forceResumen = shouldForceResumen(pathname);

    return BASE_TABS.map((tab) => ({
      ...tab,
      end: tab.end !== undefined ? tab.end : true,
      forceActive: tab.to === "resumen" ? forceResumen : false,
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
