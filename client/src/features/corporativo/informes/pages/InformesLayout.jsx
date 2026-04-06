// client/src/features/corporativo/Informes/InformesLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { FileText, Table2, Share2 } from "lucide-react";
import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";

const TABS = [
  { to: "resumen", label: "Resumen", icon: FileText, index: true },
  { to: "tablas", label: "Tablas", icon: Table2 },
  { to: "exportar", label: "Exportar", icon: Share2 },
];

export default function InformesLayout() {
  return (
    <section className="w-full">
      <RouteTabs
        items={TABS}
        ariaLabel="Informes corporativos"
      />
      <div className="pt-6">
        <Outlet />
      </div>
    </section>
  );
}


