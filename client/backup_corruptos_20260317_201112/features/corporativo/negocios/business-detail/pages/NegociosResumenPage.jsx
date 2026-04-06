// client/src/features/corporativo/Negocios/pages/NegociosResumenPage.jsx import React, {
useMemo }
from "react" ;
import {
useNavigate }
from "React router dom" ;
import {
Activity, ArrowUpRight, Building2 , CircleDollarSign, ListChecks, Plus, }
from "lucide React" ;
import KPIStripGlobal from " @ /features/corporativo/negocios/components/kpi/KPIStripGlobal .jsx" ;
import BusinessSelectBar from " @ /features/corporativo/negocios/components/BusinessSelectBar.jsx" ;
import {
useNegociosStore }
from " @ /features/corporativo/negocios/store/negocios.store.js" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
function SectionCard( {
title, icon: Icon, right, children, className }
)
{
return ( <section className= {cx( "rounded 2xl border border [var( border)
] bg [var( panel)
] shadow sm" , className )
}
> <div className= "px 5 py 4 flex items center gap 3 border b border [var( border)
] " > {Icon ? <Icon size= {
1 8 }
className= "opacity 8 0 " / > : null}
<h2 className= "font semibold" > {title}
< /h2 > <div className= "ml auto" > {right}
< /div> < /div> <div className= "p 5 " > {children}
< /div> < /section > )
;
}
function StatPill( {
label, value, hint }
)
{
return ( <div className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 8 8 % ,var( text)
_ 6 % )
] p 4 " > <div className= "text xs opacity 7 0 " > {label}
< /div> <div className= "text 2xl font semibold leading tight mt 1 " > {value}
< /div> {hint ? <div className= "text xs opacity 7 0 mt 1 " > {hint}
< /div> : null}
< /div> )
;
}
export default function NegociosResumenPage( )
{
const nav = useNavigate( )
;
const items = useNegociosStore( (s)
= > s.items)
;
const metrics = useMemo ( ( )
= > {
const list = Array.isArray (items)
? items : [ ] ;
const total = list.length;
const isActivo = (n)
= > String(n? .estadoOperacion ? ? n? .estado ? ? n? .status ? ? " " )
.toUpperCase( )
.trim( )
= = = "ACTIVO" ;
const activos = list.filter(isActivo)
.length;
const produccionMensual = list .filter(isActivo)
.reduce( (sum, n)
= > sum + (Number(n? .produccionMensual ? ? 0 )
| | 0 )
, 0 )
;
return {
total, activos , produccionMensual, pctActivos: total ? Math.round( (activos / total)
* 1 0 0 )
: 0 , }
;
}
, [items] )
;
return ( <div className= "spacey 5 " > {
/ * Selector + acci?n r?pida * / }
<div className= "flex flex col gap 3 md:flex row md:items center" > <div className= "flex 1 " > <BusinessSelectBar / > < /div> <button type= "button" onClick = {
( )
= > nav( " /corporativo/negocios/nuevo" )
}
className= {cx( "inline flex items center justify center gap 2 " , "px 4 py 2 rounded xl border border [var( border)
] " , "bg [color mix(in_srgb,var( panel)
_ 7 0 % ,var( accent)
_ 1 2 % )
] " , "hover:bg [color mix(in_srgb,var( panel)
_ 6 2 % ,var( accent)
_ 1 6 % )
] transition" )
}
> <Plus size= {
1 6 }
/ > Crear negocio < /button> < /div> {
/ * KPI strip (si tu componente ya trae KPIs globales)
* / }
<div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 2 " > <KPIStripGlobal / > < /div> {
/ * Resumen r?pido * / }
<div className= "grid grid cols 1 md:grid cols 4 gap 4 " > <StatPill label= "Negocios" value= {metrics .total}
hint= "Total registrados" / > <StatPill label= "Activos " value= {metrics .activos }
hint= {
` $ {metrics .pctActivos}
% del total` }
/ > <StatPill label= "Producci?n mensual " value= {
` $ $ {Math.round(metrics .produccionMensual)
.toLocaleString ( )
}
` }
hint= "Solo activos (si aplica)
" / > <StatPill label= "Salud operativa" value= "OK" hint= "Alertas cr?ticas: 0 " / > < /div> {
/ * Secciones * / }
<div className= "grid grid cols 1 lg:grid cols 2 gap 4 " > <SectionCard title= "Actividad reciente" icon= {Activity}
right= {
<button type= "button" onClick = {
( )
= > nav( " /corporativo/negocios/operacion" )
}
className= "text sm inline flex items center gap 2 opacity 8 0 hover:opacity 1 0 0 transition" > Ver operaci ?n <ArrowUpRight size= {
1 6 }
/ > < /button> }
> <div className= "text sm opacity 8 0 " > Aqu? van eventos tipo: ?濞?egocio creado?? ?濞?nidad asignada?? ?濞?ago registrado?? etc. < /div> <div className= "mt 4 grid gap 2 " > {
[ "Sin eventos cr?ticos hoy" , " 閼?ltima actualizaci?n : " , "Pendientes: " ] .map( (t)
= > ( <div key= {t}
className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( text)
_ 4 % )
] p 3 text sm" > {t}
< /div> )
)
}
< /div> < /SectionCard> <SectionCard title= "Accesos r?pidos" icon= {ListChecks}
right= {
<button type= "button" onClick = {
( )
= > nav( " /corporativo/negocios/finanzas" )
}
className= "text sm inline flex items center gap 2 opacity 8 0 hover:opacity 1 0 0 transition" > Ir a finanzas <ArrowUpRight size= {
1 6 }
/ > < /button> }
> <div className= "grid grid cols 1 md:grid cols 2 gap 3 " > <button type= "button" onClick = {
( )
= > nav( " /corporativo/negocios/finanzas" )
}
className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 7 8 % ,var( text)
_ 6 % )
] p 4 text left hover:opacity 9 5 transition" > <div className= "flex items center gap 2 " > <CircleDollarSign size= {
1 8 }
className= "opacity 8 0 " / > <div className= "font semibold" >Finanzas< /div> < /div> <div className= "text sm opacity 7 5 mt 1 " >Bancos, cuentas , transacciones, reportes. < /div> < /button> <button type= "button" onClick = {
( )
= > nav( " /corporativo/negocios/unidades" )
}
className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 7 8 % ,var( text)
_ 6 % )
] p 4 text left hover:opacity 9 5 transition" > <div className= "flex items center gap 2 " > <Building2 size= {
1 8 }
className= "opacity 8 0 " / > <div className= "font semibold" >Unidades< /div> < /div> <div className= "text sm opacity 7 5 mt 1 " >Asignaci?n y lista de unidades por negocio . < /div> < /button> < /div> < /SectionCard> < /div> < /div> )
;
}