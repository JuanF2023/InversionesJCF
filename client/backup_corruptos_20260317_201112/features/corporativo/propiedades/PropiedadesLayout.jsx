// client/src/features/corporativo/Propiedades/PropiedadesLayout.jsx import React from "react" ;
import {
Outlet }
from "React router dom" ;
import {
LayoutDashboard, Layers, FileSpreadsheet, Grid3X3 , }
from "lucide React" ;
import RouteTabs from " @ /components/ui/navigation/RouteTabs.jsx" ;
import AddAction from " @ /components/ui/primitives/AddAction.jsx" ;
/ * * * Layout del m?dulo Propiedades. * Tabs principales: Panel, Detalles, Unidades, Reportes. * El index redirige a "panel" desde el router. * / const TABS = [ {
to: "panel" , label: "Panel" , icon: LayoutDashboard, index: true }
, {
to: "detalles" , label: "Detalles" , icon: Layers }
, {
to: "unidades" , label: "Unidades" , icon: Grid3X3 }
, {
to: "reportes" , label: "Reportes" , icon: FileSpreadsheet }
, ] ;
export default function PropiedadesLayout( )
{
return ( <section className= "w full" > <RouteTabs items= {TABS}
ariaLabel= "Secciones de propiedades" action= {
<AddAction // ??Ruta RELATIVA a /corporativo/propiedades // Resultado: /corporativo/propiedades/crear to= "crear" > Agregar propiedad < /AddAction> }
/ > <div className= "pt 6 " > <Outlet / > < /div> < /section > )
;
}