// client/src/features/corporativo/dashboards/components/DashboardsLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import {
    Landmark,
    Building2,
    FolderKanban,
    Receipt,
    BarChart3,
    FileText,
} from "lucide-react";
import RouteTabs from "@/core/ui/navigation/RouteTabs.jsx";

const TABS = [
    { to: "negocios", label: "Negocios", icon: Landmark, index: true },
    { to: "propiedades", label: "Propiedades", icon: Building2 },
    { to: "proyectos", label: "Proyectos", icon: FolderKanban },
    { to: "transacciones", label: "Transacciones", icon: Receipt },
    { to: "indicadores", label: "Indicadores", icon: BarChart3 },
    { to: "informes", label: "Informes", icon: FileText },
];

export default function DashboardsLayout() {
    return (
        <section className="w-full">
            <RouteTabs items={TABS} ariaLabel="Dashboards corporativos" />
            <div className="pt-6">
                <Outlet />
            </div>
        </section>
    );
}


