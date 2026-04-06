import React from "react";
import { Outlet } from "react-router-dom";
import { List, PlusSquare } from "lucide-react";
import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";
import AddAction from "@/core/ui/primitives/AddAction.jsx";

const TABS = [
  { to: "lista", label: "Proyectos", icon: List, index: true },
  { to: "nuevo", label: "Nuevo", icon: PlusSquare },
];

export default function ProyectosLayout() {
  return (
    <section className="w-full">
      <RouteTabs
        items={TABS}
        ariaLabel="Secciones de proyectos"
        action={<AddAction to="/corporativo/proyectos/nuevo">Agregar proyecto</AddAction>}
      />
      <div className="pt-6">
        <Outlet />
      </div>
    </section>
  );
}



