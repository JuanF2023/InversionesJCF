// client/src/features/corporativo/Indicadores/IndicadoresLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, BarChart2, TrendingUp } from "lucide-react";
import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";

const TABS = [
  { to: "panel", label: "Panel", icon: LayoutDashboard, index: true },
  { to: "comparativos", label: "Comparativos", icon: BarChart2 },
  { to: "proyecciones", label: "Proyecciones", icon: TrendingUp },
];

export default function IndicadoresLayout() {
  return (
    <section className="w-full">
      <RouteTabs
        items={TABS}
        ariaLabel="Indicadores corporativos"
      />
      <div className="pt-6">
        <Outlet />
      </div>
    </section>
  );
}


