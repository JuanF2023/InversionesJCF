// client/src/features/corporativo/Negocios/pages/NegociosOperacionPage .jsx import React from "react" ;
import {
Briefcase, ClipboardList, Gauge, Wrench }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
function Card( {
title, subtitle, children, className }
)
{
return ( <section className= {cx( "rounded 2xl border border [var( border)
] bg [var( panel)
] shadow sm" , className)
}
> <div className= "p 4 md:p 5 " > <h3 className= "font semibold" > {title}
< /h3 > {subtitle ? <p className= "text sm opacity 7 5 mt 0 . 5 " > {subtitle}
< /p> : null}
<div className= "mt 4 " > {children}
< /div> < /div> < /section > )
;
}
function MiniKpi ( {
icon: Icon, label, value }
)
{
return ( <div className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 8 0 % ,transparent)
] p 4 " > <div className= "flex items center gap 3 " > <div className= "h 9 w 9 rounded xl grid place items center border border [var( border)
] " > <Icon size= {
1 6 }
className= "opacity 8 0 " / > < /div> <div className= "minw 0 " > <div className= "text sm opacity 7 5 " > {label}
< /div> <div className= "text lg font semibold" > {value}
< /div> < /div> < /div> < /div> )
;
}
export default function NegociosOperacionPage ( )
{
return ( <div className= "spacey 6 " > <div> <h2 className= "text xl font semibold" >Operaci ?n < /h2 > <p className= "text sm opacity 7 5 " > Datos operativos, clasificaci?n y m閼?tricas por rubro (seg閻?n negocio )
. < /p> < /div> <div className= "grid grid cols 1 md:grid cols 3 gap 4 " > <MiniKpi icon= {Briefcase}
label= "Estado operaci ?n " value= " ?? / > <MiniKpi icon= {Gauge}
label= "Ocupaci ?n / rotaci?n " value= " ?? / > <MiniKpi icon= {ClipboardList}
label= "Pendientes" value= " ?? / > < /div> <div className= "grid grid cols 1 lg:grid cols 2 gap 4 " > <Card title= "Clasificaci?n del negocio " subtitle= "Categor ?a ??Subcategor?a ??Tipo (desde cat?logo)
. " > <div className= "text sm opacity 7 5 " > Aqu? se mostrar ? el resumen de clasificaci?n para el negocio seleccionado (si usas selector global)
, o un resumen general del cat?logo si est?s en vista global. < /div> <div className= "mt 4 rounded xl border border [var( border)
] p 3 text sm opacity 7 5 " > Recomendaci?n : mantener la clasificaci?n en BD (catalogos_negocios)
y solo referenciar keys. < /div> < /Card> <Card title= "Procesos / Servicios (opcional)
" subtitle= "Si luego agregas workflows, cae aqu?. " > <div className= "text sm opacity 7 5 " > Placeholder para procesos: apertura/cierre, inventario, turnos, servicio, mantenimiento, etc. < /div> <div className= "mt 4 flex items center gap 2 text sm opacity 7 5 " > <Wrench size= {
1 6 }
className= "opacity 8 0 " / > Reglas enterprise y checklist por rubro. < /div> < /Card> < /div> < /div> )
;
}