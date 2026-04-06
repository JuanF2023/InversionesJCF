// client/src/features/corporativo/Proyectos/ProyectosListPage.jsx import React, {
useMemo , useState }
from "react" ;
/ * * * Datos mock para desarrollo. * En el futuro se reemplaza por datos desde la API (REST /proyectos)
. * / const MOCK_PROJECTS = [ {
id: "PRJ REST COCINA 2 0 2 5 " , codigo: "PRJ 2 0 2 5 REST0 1 COCINA" , nombre: "Remodelaci?n cocina restaurante Chaparral" , negocio : "REST0 1 ? Chaparral / Restaurantes" , ubicacion: "El Salvador ? Lourdes Col?n ? Chaparral" , tipo: "Remodelaci?n " , estado: "En ejecuci ?n " , presupuesto: 1 2 0 0 0 , ejecutado: 5 4 0 0 , moneda: "USD" , fechaInicioPlan: " 2 0 2 5 0 1 1 0 " , fechaFinPlan: " 2 0 2 5 0 3 3 0 " , }
, {
id: "PRJ APT LOUREDES 2 0 2 5 " , codigo: "PRJ 2 0 2 5 APT0 4 INTERIOR" , nombre: "Mejora interior apartamento APT0 4 " , negocio : "APT0 4 ? Lourdes Col?n " , ubicacion: "El Salvador ? Lourdes Col?n " , tipo: "Remodelaci?n " , estado: "Planeado" , presupuesto: 4 5 0 0 , ejecutado: 0 , moneda: "USD" , fechaInicioPlan: " 2 0 2 5 0 4 0 1 " , fechaFinPlan: " 2 0 2 5 0 5 1 5 " , }
, {
id: "PRJ SYS REST 2 0 2 5 " , codigo: "PRJ 2 0 2 5 REST0 1 SISTEMA " , nombre: "Implementaci?n sistema restaurante Inversiones JCF" , negocio : "REST0 1 ? Chaparral / Restaurantes" , ubicacion: "El Salvador ? Lourdes Col?n ? Chaparral" , tipo: "Sistema / Tecnolog?a " , estado: "En ejecuci ?n " , presupuesto: 8 0 0 0 , ejecutado: 3 2 0 0 , moneda: "USD" , fechaInicioPlan: " 2 0 2 5 0 2 0 1 " , fechaFinPlan: " 2 0 2 5 0 6 3 0 " , }
, {
id: "PRJ LA PROP 2 0 2 5 " , codigo: "PRJ 2 0 2 5 LA REFORMA " , nombre: "Acondicionamiento propiedad en Los 閼?ngeles" , negocio : "LA0 1 ? Los 閼?ngeles" , ubicacion: "USA ? Los 閼?ngeles" , tipo: "Remodelaci?n " , estado: "Planeado" , presupuesto: 1 5 0 0 0 , ejecutado: 0 , moneda: "USD" , fechaInicioPlan: " 2 0 2 5 0 7 0 1 " , fechaFinPlan: " 2 0 2 5 0 9 3 0 " , }
, {
id: "PRJ VEH 2 0 2 5 " , codigo: "PRJ 2 0 2 5 FLOTA VEH" , nombre: "Adquisici?n veh?culos para renta / log?stica" , negocio : "FLOTA0 1 ? Veh?culos" , ubicacion: "El Salvador ? Lourdes Col?n " , tipo: "Equipamiento / Flota" , estado: "En ejecuci ?n " , presupuesto: 2 1 0 0 0 , ejecutado: 1 0 5 0 0 , moneda: "USD" , fechaInicioPlan: " 2 0 2 5 0 3 0 1 " , fechaFinPlan: " 2 0 2 5 0 8 3 1 " , }
, ] ;
const ESTADOS = [ "Todos" , "Planeado" , "En ejecuci ?n " , "Pausado " , "Cerrado " , "Cancelado" ] ;
const TIPOS = [ "Todos" , "Construcci?n nueva" , "Remodelaci?n " , "Equipamiento / Flota" , "Sistema / Tecnolog?a " , ] ;
const NEGOCIOS = [ "Todos" , "REST0 1 ? Chaparral / Restaurantes" , "APT0 4 ? Lourdes Col?n " , "LA0 1 ? Los 閼?ngeles" , "FLOTA0 1 ? Veh?culos" , ] ;
function formatCurrency (value, currency = "USD" )
{
if (value = = null | | Number.isNaN(value)
)
return " ?? ;
try {
return new Intl.NumberFormat( "es SV" , {
style: "currency" , currency, maximumFractionDigits : 2 , minimumFractionDigits : 2 , }
)
.format(value)
;
}
catch {
return ` $ {value.toFixed ( 2 )
}
$ {currency}
` ;
}
}
function calcProgress(presupuesto, ejecutado)
{
if ( !presupuesto | | presupuesto < = 0 )
return 0 ;
return Math.min( 1 0 0 , Math.round( (ejecutado / presupuesto)
* 1 0 0 )
)
;
}
export default function ProyectosListPage( )
{
const [estadoFilter, setEstadoFilter] = useState( "Todos" )
;
const [tipoFilter, setTipoFilter] = useState( "Todos" )
;
const [negocioFilter, setNegocioFilter] = useState( "Todos" )
;
const [monthFilter, setMonthFilter ] = useState( " " )
;
// yyyy MM const filtered = useMemo ( ( )
= > {
return MOCK_PROJECTS.filter( (p)
= > {
if (estadoFilter ! = = "Todos" & & p.estado ! = = estadoFilter)
return false;
if (tipoFilter ! = = "Todos" & & p.tipo ! = = tipoFilter)
return false;
if (negocioFilter ! = = "Todos" & & p.negocio ! = = negocioFilter)
return false;
if (monthFilter)
{
const monthStr = (p.fechaInicioPlan | | " " )
.slice( 0 , 7 )
;
if (monthStr ! = = monthFilter)
return false;
}
return true;
}
)
;
}
, [estadoFilter, tipoFilter, negocioFilter, monthFilter] )
;
const summary = useMemo ( ( )
= > {
if (filtered.length = = = 0 )
{
return {
total: 0 , activos : 0 , presupuestoTotal: 0 , ejecutadoTotal : 0 , avgProgress: 0 , }
;
}
const total = filtered.length;
const activos = filtered.filter( (p)
= > [ "Planeado" , "En ejecuci ?n " ] .includes(p.estado)
)
.length;
const presupuestoTotal = filtered.reduce( (acc, p)
= > acc + (p.presupuesto | | 0 )
, 0 )
;
const ejecutadoTotal = filtered.reduce( (acc, p)
= > acc + (p.ejecutado | | 0 )
, 0 )
;
const avgProgress = filtered.reduce( (acc, p)
= > acc + calcProgress(p.presupuesto, p.ejecutado)
, 0 )
/ total;
return {
total, activos , presupuestoTotal, ejecutadoTotal , avgProgress: Math.round(avgProgress)
, }
;
}
, [filtered] )
;
const topByBudget = useMemo ( ( )
= > {
return [ . . .filtered] .sort( (a, b)
= > (b.presupuesto | | 0 )
(a.presupuesto | | 0 )
)
.slice( 0 , 5 )
;
}
, [filtered] )
;
return ( <section className= "w full spacey 6 " > {
/ * Header * / }
<div className= "flex flex col gap 2 md:flex row md:items end md:justify between " > <div> <h1 className= "text xl md:text 2xl font semibold tracking tight" > Proyectos < /h1 > <p className= "text xs md:text sm opacity 8 0 mt 1 " > Seguimiento de inversiones, remodelaciones , sistemas y flota vinculadas a cada negocio y propiedad. < /p> < /div> <div className= "flex gap 2 text xs md:text sm" > <button type= "button" className= "px 3 py 1 . 5 rounded xl border border [var( border)
] bg [var( panel)
] hover:bg [color mix(in_srgb,var( panel)
_ 8 5 % ,var( accent)
_ 1 5 % )
] transition colors" > Nuevo proyecto < /button> <button type= "button" className= "px 3 py 1 . 5 rounded xl border border dashed border [var( border)
] bg transparent hover:bg [var( panel)
] transition colors" > Importar desde Excel < /button> < /div> < /div> {
/ * Resumen superior * / }
<div className= "grid grid cols 2 md:grid cols 4 gap 3 md:gap 4 " > <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Total proyectos < /div> <div className= "mt 1 text 2xl font semibold tabular nums" > {summary .total}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > Activos : {summary .activos }
< /div> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Presupuesto total < /div> <div className= "mt 1 text lg md:text xl font semibold tabular nums" > {formatCurrency (summary .presupuestoTotal)
}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > En todos los proyectos filtrados < /div> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Ejecutado < /div> <div className= "mt 1 text lg md:text xl font semibold tabular nums" > {formatCurrency (summary .ejecutadoTotal )
}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > {summary .presupuestoTotal > 0 ? ` $ {calcProgress( summary .presupuestoTotal, summary .ejecutadoTotal )
}
% del presupuesto` : "Sin presupuesto definido" }
< /div> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Avance promedio < /div> <div className= "mt 1 text 2xl font semibold tabular nums" > {summary .avgProgress}
% < /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > Seg閻?n proyectos filtrados < /div> < /div> < /div> {
/ * Filtros * / }
<div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 md:p 5 shadow sm" > <div className= "flex flex col md:flex row md:items center md:justify between gap 4 mb 3 " > <div className= "text sm font medium" >Filtros < /div> <button type= "button" className= "text xs underline opacity 7 0 hover:opacity 1 0 0 " onClick = {
( )
= > {
setEstadoFilter( "Todos" )
;
setTipoFilter( "Todos" )
;
setNegocioFilter( "Todos" )
;
setMonthFilter ( " " )
;
}
}
> Limpiar filtros < /button> < /div> <div className= "grid grid cols 1 md:grid cols 4 gap 3 md:gap 4 text xs md:text sm" > <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Estado< /label> <select className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {estadoFilter}
onChange= {
(e)
= > setEstadoFilter(e.target.value)
}
> {ESTADOS .map( (e)
= > ( <option key= {e}
value= {e}
> {e}
< /option> )
)
}
< /select> < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Tipo de proyecto< /label> <select className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {tipoFilter}
onChange= {
(e)
= > setTipoFilter(e.target.value)
}
> {TIPOS.map( (t)
= > ( <option key= {t}
value= {t}
> {t}
< /option> )
)
}
< /select> < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Negocio < /label> <select className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {negocioFilter}
onChange= {
(e)
= > setNegocioFilter(e.target.value)
}
> {NEGOCIOS.map( (n)
= > ( <option key= {n}
value= {n}
> {n}
< /option> )
)
}
< /select> < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Mes de inicio (planificado)
< /label> <input type= "month" className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {monthFilter}
onChange= {
(e)
= > setMonthFilter (e.target.value)
}
/ > < /div> < /div> < /div> {
/ * Top proyectos por presupuesto * / }
<div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 md:p 5 shadow sm" > <div className= "flex items center justify between mb 3 " > <div className= "text sm font medium" > Top proyectos por presupuesto (vista r?pida)
< /div> <div className= "text [ 1 1px] opacity 7 0 " > Mostrando {topByBudget.length}
de {filtered.length}
proyectos filtrados < /div> < /div> <div className= "spacey 2 text xs md:text sm" > {topByBudget.length = = = 0 & & ( <div className= "text [ 1 2px] opacity 7 0 " > No hay proyectos que coincidan con los filtros seleccionados. < /div> )
}
{topByBudget.map( (p)
= > {
const progress = calcProgress(p.presupuesto, p.ejecutado)
;
return ( <div key= {p.id}
className= "flex flex col md:flex row md:items center gap 2 md:gap 3 rounded xl border border [color mix(in_srgb,var( border)
_ 8 0 % ,var( accent)
_ 2 0 % )
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( accent)
_ 8 % )
] px 3 py 2 . 5 " > <div className= "flex 1 minw 0 " > <div className= "font medium truncate" > {p.nombre}
< /div> <div className= "text [ 1 1px] opacity 7 0 flex flex wrap gapx 2 mt 0 . 5 " > <span> {p.codigo}
< /span> <span> ? {p.negocio }
< /span> <span> ? {p.tipo}
< /span> < /div> < /div> <div className= "flex flex col items start md:items end gap 1 " > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Presupuesto / Ejecutado < /div> <div className= "text xs tabular nums" > {formatCurrency (p.ejecutado, p.moneda)
}
{
" " }
<span className= "opacity 6 0 " > / < /span> {
" " }
{formatCurrency (p.presupuesto, p.moneda)
}
< /div> <div className= "w 4 0 h 1 . 5 rounded full bg black/ 3 0 overflow hidden" > <div className= "h full rounded full bg [color mix(in_srgb,var( accent)
_ 8 0 % ,white_ 2 0 % )
] " style= {
{
width: ` $ {progress}
% ` }
}
/ > < /div> <div className= "text [ 1 1px] opacity 7 0 tabular nums" > {progress}
% avance ? {p.estado}
< /div> < /div> < /div> )
;
}
)
}
< /div> < /div> {
/ * Tabla detalle proyectos * / }
<div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] shadow sm overflow hidden" > <div className= "px 4 py 3 border b border [var( border)
] flex items center justify between " > <div className= "text sm font medium" >Detalle de proyectos< /div> <div className= "text [ 1 1px] opacity 7 0 " > {filtered.length}
proyecto(s)
encontrado(s)
< /div> < /div> <div className= "overflowxauto" > <table className= "minwfull text xs md:text sm" > <thead> <tr className= "border b border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 4 % ,black_ 6 % )
] " > <th className= "px 3 py 2 text left font semibold" >Proyecto< /th> <th className= "px 3 py 2 text left font semibold" >Negocio / Ubicaci ?n < /th> <th className= "px 3 py 2 text left font semibold" >Tipo< /th> <th className= "px 3 py 2 text left font semibold" >Estado< /th> <th className= "px 3 py 2 text right font semibold" >Presupuesto< /th> <th className= "px 3 py 2 text right font semibold" >Ejecutado< /th> <th className= "px 3 py 2 text right font semibold" > % Avance< /th> <th className= "px 3 py 2 text left font semibold" >Fechas (plan)
< /th> < /tr> < /thead> <tbody> {filtered.length = = = 0 & & ( <tr> <td colSpan = {
8 }
className= "px 3 py 6 text center text [ 1 2px] opacity 7 0 " > No hay proyectos para mostrar con los filtros actuales. < /td> < /tr> )
}
{filtered.map( (p)
= > {
const progress = calcProgress(p.presupuesto, p.ejecutado)
;
return ( <tr key= {p.id}
className= "border b border [color mix(in_srgb,var( border)
_ 7 0 % ,transparent_ 3 0 % )
] hover:bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] transition colors" > <td className= "px 3 py 2 align top" > <div className= "font medium leading snug" > {p.nombre}
< /div> <div className= "text [ 1 1px] opacity 7 0 " > {p.codigo}
< /div> < /td> <td className= "px 3 py 2 align top" > <div className= "leading snug" > {p.negocio }
< /div> <div className= "text [ 1 1px] opacity 7 0 " > {p.ubicacion}
< /div> < /td> <td className= "px 3 py 2 align top" > <div className= "text [ 1 2px] " > {p.tipo}
< /div> < /td> <td className= "px 3 py 2 align top" > <span className= {
`inline flex items center rounded full px 2 py [ 2px] text [ 1 1px] font semibold $ {p.estado = = = "En ejecuci ?n " ? "bg emerald 5 0 0 / 1 5 text emerald 3 0 0 " : p.estado = = = "Planeado" ? "bg sky 5 0 0 / 1 5 text sky 3 0 0 " : p.estado = = = "Cerrado " ? "bg slate 5 0 0 / 2 0 text slate 2 0 0 " : "bg amber 5 0 0 / 1 5 text amber 2 0 0 " }
` }
> {p.estado}
< /span> < /td> <td className= "px 3 py 2 align top text right tabular nums" > {formatCurrency (p.presupuesto, p.moneda)
}
< /td> <td className= "px 3 py 2 align top text right tabular nums" > {formatCurrency (p.ejecutado, p.moneda)
}
< /td> <td className= "px 3 py 2 align top text right tabular nums" > {progress}
% < /td> <td className= "px 3 py 2 align top text [ 1 1px] leading snug" > <div> Inicio: {
" " }
<span className= "opacity 8 0 " > {p.fechaInicioPlan | | " ?? }
< /span> < /div> <div> Fin: {
" " }
<span className= "opacity 8 0 " > {p.fechaFinPlan | | " ?? }
< /span> < /div> < /td> < /tr> )
;
}
)
}
< /tbody> < /table> < /div> {
/ * Resumen inferior * / }
<div className= "px 4 py 3 border t border [var( border)
] text [ 1 1px] md:text xs flex flex col md:flex row md:items center md:justify between gap 2 " > <div className= "opacity 7 5 " > <span className= "font semibold" >Resumen filtros ? < /span> {summary .total}
proyecto(s)
, inversi ?n total{
" " }
<span className= "tabular nums" > {formatCurrency (summary .presupuestoTotal)
}
< /span> , ejecutado{
" " }
<span className= "tabular nums" > {formatCurrency (summary .ejecutadoTotal )
}
< /span> . < /div> <div className= "opacity 7 5 " > Avance promedio: {
" " }
<span className= "font semibold tabular nums" > {summary .avgProgress}
% < /span> < /div> < /div> < /div> < /section > )
;
}