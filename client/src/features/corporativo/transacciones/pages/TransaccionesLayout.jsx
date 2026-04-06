// client/src/features/corporativo/Transacciones/TransaccionesLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { ListChecks, FileText, BarChart3 } from "lucide-react";
import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";
import AddAction from "@/core/ui/primitives/AddAction.jsx";

const TABS = [
  { to: "lista", label: "Lista", icon: ListChecks, index: true },
  // ?? la ruta debe coincidir con App.jsx => "nueva"
  { to: "nueva", label: "Nuevo registro", icon: FileText },
  { to: "reportes", label: "Reportes", icon: BarChart3 },
];

export default function TransaccionesLayout() {
  return (
    <section className="w-full">
      <RouteTabs
        items={TABS}
        ariaLabel="Secciones de transacciones"
        action={
          // ?? igual que la pesta?a: "nueva"
          <AddAction to="nueva">
            Agregar transacci¨®n
          </AddAction>
        }
      />
      <div className="pt-6">
        <Outlet />
      </div>
    </section>
  );
}



