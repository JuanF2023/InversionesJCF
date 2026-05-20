// client/src/features/corporativo/layout/constants/corporate-navigation.constants.js

import {
    LayoutDashboard,
    KanbanSquare,
    Building2,
    FileSpreadsheet,
    ShieldCheck,
    ListChecks,
    Info,
    HomeIcon,
  } from "lucide-react";

  export const MAIN_TABS = [
    {
      to: "/corporativo/dashboards",
      label: "Dashboards",
      icon: LayoutDashboard,
      end: false,
    },
    {
      to: "/corporativo/negocios",
      label: "Negocios",
      icon: KanbanSquare,
    },
    {
      to: "/corporativo/propiedades",
      label: "Propiedades",
      icon: Building2,
    },
    {
      to: "/corporativo/proyectos",
      label: "Proyectos",
      icon: KanbanSquare,
    },
    {
      to: "/corporativo/transacciones",
      label: "Transacciones",
      icon: FileSpreadsheet,
    },
    {
      to: "/corporativo/admin/users",
      label: "Accesos",
      icon: ShieldCheck,
    },
    {
      to: "/corporativo/por-hacer",
      label: "Por hacer",
      icon: ListChecks,
    },
    {
      to: "/corporativo/acerca-de",
      label: "Acerca de",
      icon: Info,
    },
    {
      to: "/corporativo/filosofia-de-dar",
      label: "Filosofía de Dar",
      icon: HomeIcon,
    },
  ];

  export default MAIN_TABS;
