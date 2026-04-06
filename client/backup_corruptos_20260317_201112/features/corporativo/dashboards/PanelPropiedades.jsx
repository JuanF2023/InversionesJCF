// client/src/features/corporativo/dashboards/PanelPropiedades.jsx import React from "react" ;
import {
Home, Building2 , BedDouble, MapPin, Wrench, AlertTriangle, DollarSign, LineChart, CalendarClock, }
from "lucide React" ;
const RESUMEN _PROP = {
totalPropiedades: 8 , totalUnidades: 2 4 , ocupadas: 2 0 , rentaMensualEsperada: 5 6 5 0 , rentaCobradaMes: 4 9 8 0 , }
;
const OCUPACION = [ {
etiqueta: "Apartamentos" , codigo: "APT" , unidades: 1 2 , ocupadas: 1 1 }
, {
etiqueta: "Locales comerciales" , codigo: "LOC" , unidades: 6 , ocupadas: 5 }
, {
etiqueta: "Bodegas / Parqueos" , codigo: "BOD" , unidades: 4 , ocupadas: 3 }
, {
etiqueta: "Otros" , codigo: "OTR" , unidades: 2 , ocupadas: 1 }
, ] ;
const RENTAS = [ {
etiqueta: "Lourdes Col?n " , renta: 2 9 5 0 }
, {
etiqueta: "Chaparral / Restaurantes" , renta: 1 8 0 0 }
, {
etiqueta: "Los 閼?ngeles (USA)
" , renta: 9 0 0 }
, ] ;
const RIESGOS = [ {
tipo: "Renta vencida " , detalle : "APT 0 4 ?? 1 5 d?as de atraso. " , severidad: "alta" , }
, {
tipo: "Contrato pr?ximo" , detalle : "Local # 3 Pol?gono 3 3 B vence en 3 0 d?as. " , severidad: "media" , }
, {
tipo: "Mantenimiento" , detalle : "Revisi?n de techo en APT 0 2 pendiente. " , severidad: "media" , }
, {
tipo: "Vacancia" , detalle : "Parqueo BOD 0 2 lleva 6 0 d?as vac?o . " , severidad: "baja" , }
, ] ;
const CALENDARIO = [ {
fecha: " 0 5 " , mes: "dic" , tipo: "Cobro renta" , detalle : "Renta mensual apartamentos APT 0 1 / 0 2 / 0 3 . " , }
, {
fecha: " 1 0 " , mes: "dic" , tipo: "Renovaci?n " , detalle : "Revisi?n de contrato Local # 2 ??Pol?gono 3 3 B. " , }
, {
fecha: " 1 8 " , mes: "dic" , tipo: "Mantenimiento" , detalle : "Servicio de plomer?a programado en APT 0 4 . " , }
, ] ;
function formatCurrency (v)
{
return v.toLocaleString ( "es SV" , {
style: "currency" , currency: "USD" , maximumFractionDigits : 2 , }
)
;
}
export default function PanelPropiedades( )
{
const ocupacionTotal = RESUMEN _PROP.totalUnidades = = = 0 ? 0 : (RESUMEN _PROP.ocupadas / RESUMEN _PROP.totalUnidades)
* 1 0 0 ;
const rentaCobertura = RESUMEN _PROP.rentaMensualEsperada = = = 0 ? 0 : (RESUMEN _PROP.rentaCobradaMes / RESUMEN _PROP.rentaMensualEsperada)
* 1 0 0 ;
const rentaEsperadaTotal = RENTAS.reduce( (acc, r)
= > acc + r.renta, 0 )
;
return ( <div className= "spacey 6 " > {
/ * HEADER * / }
<header className= "flex flex col gap 3 sm:flex row sm:items end sm:justify between " > <div> <h1 className= "text 2xl md:text 3xl font semibold flex items center gap 2 " > <Home className= "w 6 h 6 text [var( accent)
] " / > Dashboard de propiedades < /h1 > <p className= "text sm subtle mt 1 " > Vista consolidada de ocupaci ?n , rentas y riesgos de tus propiedades (apartamentos, locales , bodegas y otros)
. < /p> < /div> <div className= "text right text xs sm:text sm subtle" > <div className= "font semibold text [var( text)
] " > M?dulo: Gesti?n inmobiliaria < /div> <div> Soporta El Salvador y USA, integrado con transacciones y proyectos. < /div> < /div> < /header> {
/ * KPIs PRINCIPALES * / }
<section className= "grid gap 4 md:grid cols 2 xl:grid cols 4 " > {
/ * Total propiedades * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between gap 2 " > <span className= "text xs font semibold uppercase tracking wide subtle" > Propiedades registradas < /span> <Building2 className= "w 4 h 4 text [var( accent)
] " / > < /div> <div className= "text 2xl font semibold tabular nums" > {RESUMEN _PROP.totalPropiedades}
< /div> <p className= "text xs subtle" > Incluye apartamentos, locales , bodegas y cualquier unidad de renta asociada. < /p> < /div> {
/ * Unidades y ocupaci ?n * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between gap 2 " > <span className= "text xs font semibold uppercase tracking wide subtle" > Unidades de renta < /span> <BedDouble className= "w 4 h 4 text [var( accent)
] " / > < /div> <div className= "flex items end justify between gap 3 " > <div> <div className= "text 2xl font semibold tabular nums" > {RESUMEN _PROP.totalUnidades}
< /div> <p className= "text xs subtle" > {RESUMEN _PROP.ocupadas}
ocupadas / {
" " }
{RESUMEN _PROP.totalUnidades RESUMEN _PROP.ocupadas}
vacantes. < /p> < /div> <div className= "text right" > <div className= "text [ 1 1px] subtle mb 1 " >Ocupaci ?n total< /div> <div className= "text sm font semibold tabular nums" > {ocupacionTotal .toFixed ( 1 )
}
% < /div> < /div> < /div> < /div> {
/ * Renta esperada * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between gap 2 " > <span className= "text xs font semibold uppercase tracking wide subtle" > Renta mensual esperada < /span> <DollarSign className= "w 4 h 4 text [var( accent)
] " / > < /div> <div className= "text 2xl font semibold tabular nums" > {formatCurrency (RESUMEN _PROP.rentaMensualEsperada)
}
< /div> <p className= "text xs subtle" > Calculado con contratos vigentes y tarifas de cada unidad de renta. < /p> < /div> {
/ * Renta cobrada * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between gap 2 " > <span className= "text xs font semibold uppercase tracking wide subtle" > Renta cobrada / mes < /span> <LineChart className= "w 4 h 4 text [var( accent)
] " / > < /div> <div className= "flex items end justify between gap 3 " > <div> <div className= "text 2xl font semibold tabular nums" > {formatCurrency (RESUMEN _PROP.rentaCobradaMes)
}
< /div> <p className= "text xs subtle" >Ingresos registrados en el m?dulo de transacciones. < /p> < /div> <div className= "text right" > <div className= "text [ 1 1px] subtle mb 1 " >Cobertura< /div> <div className= {
`text sm font semibold tabular nums $ {rentaCobertura > = 9 5 ? "text emerald 5 0 0 " : rentaCobertura > = 8 0 ? "text amber 4 0 0 " : "text rose 5 0 0 " }
` }
> {rentaCobertura .toFixed ( 1 )
}
% < /div> < /div> < /div> < /div> < /section > {
/ * OCUPACI 閼?N POR TIPO & RENTAS POR ZONA * / }
<section className= "kpi split gap 4 " > {
/ * Ocupaci ?n por tipo * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between gap 2 " > <div> <h2 className= "text sm font semibold flex items center gap 2 " > <Home className= "w 4 h 4 text [var( accent)
] " / > Ocupaci ?n por tipo de unidad < /h2 > <p className= "text xs subtle" > Distribuci?n de ocupaci ?n entre apartamentos, locales y otras unidades. < /p> < /div> < /div> <div className= "mt 2 spacey 1 . 5 " > {OCUPACION.map( (t)
= > {
const pct = t.unidades = = = 0 ? 0 : (t.ocupadas / t.unidades)
* 1 0 0 ;
return ( <div key= {t.codigo}
className= "flex items center gap 3 " > <div className= "w 1 0 h 1 0 rounded full flex items center justify center bg [color mix(in_oklab,var( panel)
_ 8 5 % ,var( accent)
_ 1 5 % )
] text [ 1 1px] font semibold" > {t.codigo}
< /div> <div className= "flex 1 minw 0 " > <div className= "flex items center justify between text xs mb 1 " > <span className= "font semibold truncate" > {t.etiqueta}
< /span> <span className= "tabular nums subtle" > {t.ocupadas}
/ {t.unidades}
( {pct.toFixed ( 1 )
}
% )
< /span> < /div> <div className= "h 1 . 5 rounded full bg [color mix(in_oklab,var( panel)
_ 8 0 % ,var( border)
_ 2 0 % )
] overflow hidden" > <div className= "h full rounded full bg gradient to r from emerald 5 0 0 to emerald 4 0 0 " style= {
{
width: ` $ {pct.toFixed ( 1 )
}
% ` }
}
/ > < /div> < /div> < /div> )
;
}
)
}
< /div> <p className= "mt 2 text [ 1 1px] subtle" > Idealmente, las unidades de mayor demanda (apartamentos y locales )
deben mantenerse por arriba del 9 0 % de ocupaci ?n . < /p> < /div> {
/ * Rentas por zona * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between gap 2 " > <div> <h2 className= "text sm font semibold flex items center gap 2 " > <MapPin className= "w 4 h 4 text [var( accent)
] " / > Rentas por zona / pa?s < /h2 > <p className= "text xs subtle" > Suma de rentas esperadas por ubicaci ?n (El Salvador / USA)
. < /p> < /div> <div className= "text xs subtle text right" > Total esperado <div className= "tabular nums font semibold" > {formatCurrency (rentaEsperadaTotal)
}
< /div> < /div> < /div> <div className= "spacey 1 . 5 mt 1 " > {RENTAS.map( (r)
= > {
const pct = rentaEsperadaTotal = = = 0 ? 0 : (r.renta / rentaEsperadaTotal)
* 1 0 0 ;
return ( <div key= {r.etiqueta}
className= "flex items center justify between gap 2 " > <div className= "flex 1 minw 0 " > <div className= "flex items center justify between text xs mb 1 " > <span className= "font semibold truncate" > {r.etiqueta}
< /span> <span className= "tabular nums subtle" > {pct.toFixed ( 1 )
}
% < /span> < /div> <div className= "h 1 . 5 rounded full bg [color mix(in_oklab,var( panel)
_ 8 0 % ,var( border)
_ 2 0 % )
] overflow hidden" > <div className= "h full rounded full bg gradient to r from [color mix(in_oklab,var( accent)
_ 4 0 % , # 0 0 0 _ 1 0 % )
] to [var( accent)
] " style= {
{
width: ` $ {pct.toFixed ( 1 )
}
% ` }
}
/ > < /div> < /div> <div className= "text xs font semibold tabular nums ml 2 " > {formatCurrency (r.renta)
}
< /div> < /div> )
;
}
)
}
< /div> <p className= "mt 2 text [ 1 1px] subtle" > Luego puedes separar por moneda, tipo de contrato o negocio asociado (REST0 1 , LOC0 1 , APT0 4 , etc. )
. < /p> < /div> < /section > {
/ * RIESGOS + CALENDARIO * / }
<section className= "grid gap 4 lg:grid cols [minmax( 0 , 3fr)
_minmax( 0 , 2fr)
] " > {
/ * Riesgos y pendientes * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between gap 2 " > <h2 className= "text sm font semibold flex items center gap 2 " > <AlertTriangle className= "w 4 h 4 text amber 4 0 0 " / > Riesgos y pendientes en propiedades < /h2 > <span className= "text [ 1 1px] subtle" > Cobros, contratos y mantenimientos clave. < /span> < /div> <div className= "spacey 2 text [ 1 3px] " > {RIESGOS .map( (r, idx)
= > {
let colorClasses = "border slate 5 0 0 / 4 0 bg slate 7 0 0 / 1 0 " ;
if (r.severidad = = = "alta" )
{
colorClasses = "border rose 5 0 0 / 5 0 bg rose 5 0 0 / 1 0 " ;
}
else if (r.severidad = = = "media" )
{
colorClasses = "border amber 5 0 0 / 5 0 bg amber 5 0 0 / 1 0 " ;
}
return ( <div key= {idx}
className= {
`border rounded lg px 3 py 2 flex items start gap 2 $ {colorClasses}
` }
> <div className= "pt [ 2px] " > <Wrench className= "w 3 . 5 h 3 . 5 " / > < /div> <div className= "flex 1 " > <div className= "text [ 1 1px] font semibold uppercase tracking wide" > {r.tipo}
< /div> <div className= "text [ 1 3px] leading snug" > {r.detalle }
< /div> < /div> <span className= "text [ 1 0px] subtle capitalize" > {r.severidad}
< /span> < /div> )
;
}
)
}
< /div> <p className= "mt 1 text [ 1 1px] subtle" > Este bloque se alimentar? de contratos, bit?coras de mantenimiento, ?rdenes del restaurante y transacciones relacionadas a propiedades. < /p> < /div> {
/ * Calendario de eventos * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between " > <h2 className= "text sm font semibold flex items center gap 2 " > <CalendarClock className= "w 4 h 4 text [var( accent)
] " / > Calendario de rentas y mantenimientos < /h2 > <span className= "text [ 1 1px] subtle" >Pr?ximos 3 0 d?as< /span> < /div> <div className= "spacey 2 " > {CALENDARIO.map( (c, idx)
= > ( <div key= {idx}
className= "flex items center gap 3 rounded lg border border [color mix(in_oklab,var( border)
_ 7 0 % ,var( accent)
_ 3 0 % )
] bg [color mix(in_oklab,var( panel)
_ 9 2 % ,var( accent)
_ 8 % )
] px 3 py 2 " > <div className= "w 1 0 h 1 0 rounded lg bg [var( panel)
] flex flex col items center justify center text [ 1 1px] font semibold" > <span> {c.fecha}
< /span> <span className= "uppercase subtle" > {c.mes}
< /span> < /div> <div className= "flex 1 minw 0 " > <div className= "text [ 1 1px] font semibold uppercase tracking wide" > {c.tipo}
< /div> <div className= "text [ 1 3px] leading snug truncate" > {c.detalle }
< /div> < /div> < /div> )
)
}
< /div> <p className= "mt 1 text [ 1 1px] subtle" > M?s adelante podr?s sincronizar esto con recordatorios por WhatsApp o correo a inquilinos y proveedores. < /p> < /div> < /section > < /div> )
;
}