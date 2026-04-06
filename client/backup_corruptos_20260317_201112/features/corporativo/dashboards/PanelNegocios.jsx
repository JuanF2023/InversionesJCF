// client/src/features/corporativo/dashboards/PanelNegocios.jsx import React from "react" ;
import {
Building2 , LineChart, Wallet, Banknote, AlertTriangle, Factory , Home, Store, }
from "lucide React" ;
/ * * Datos mock para el dashboard corporativo (puedes luego conectarlo a la API)
* / const SUMMARY _KPIS = {
ingresosDia: 1 8 2 0 . 5 , ingresosMes: 4 2 8 9 0 . 7 5 , margenMes: 0 . 3 4 , // 3 4 % negociosActivos: 6 , flujoDisponible: 1 5 2 3 0 . 1 2 , }
;
const VARIACIONES = {
ingresosDiaVsAyer: 0 . 1 2 , // + 1 2 % ingresosMesVsAnterior : 0 . 0 8 , margenVsAnterior: 0 . 0 3 , }
;
const INGRESOS_ 7 _DIAS = [ {
label: "L" , total: 1 6 5 0 }
, {
label: "M" , total: 1 7 2 0 }
, {
label: "X" , total: 1 5 8 0 }
, {
label: "J" , total: 1 8 1 0 }
, {
label: "V" , total: 1 9 4 0 }
, {
label: "S" , total: 2 1 0 0 }
, {
label: "D" , total: 1 8 2 0 }
, ] ;
const BANCOS = [ {
nombre: "Banco Agr?cola" , saldo: 6 2 0 0 . 5 }
, {
nombre: "Banco Cuscatl ?n " , saldo: 4 8 0 0 . 0 }
, {
nombre: "Banco de Am閼?rica Central " , saldo: 3 4 5 0 . 2 5 }
, {
nombre: "Efectivo caja chica" , saldo: 7 8 0 . 0 }
, ] ;
const NEGOCIOS_TOP = [ {
nombre: "Restaurante Chaparral" , tipo: "Restaurante" , codigo: "REST0 1 " , ingresoDia: 6 2 0 . 0 , ingresoMes: 1 2 4 5 0 . 0 , variacion: 0 . 1 2 , estado: "Abierto " , }
, {
nombre: "Locales Pol?gono 3 3 B" , tipo: "Propiedades" , codigo: "LOC0 1 " , ingresoDia: 3 0 0 . 0 , ingresoMes: 8 2 0 0 . 0 , variacion: 0 . 0 3 , estado: "Ocupado " , }
, {
nombre: "Food Truck # 1 " , tipo: "Restaurante" , codigo: "FOOD0 1 " , ingresoDia: 4 5 0 . 0 , ingresoMes: 9 1 0 0 . 0 , variacion: 0 . 0 4 , estado: "Operando" , }
, {
nombre: "Apartamentos APT 0 4 " , tipo: "Propiedades" , codigo: "APT0 4 " , ingresoDia: 2 2 0 . 0 , ingresoMes: 6 4 0 0 . 0 , variacion: 0 . 0 2 , estado: "Ocupado " , }
, ] ;
const ALERTAS = [ {
tipo: "contrato" , mensaje : "Contrato de alquiler APT 0 4 vence en 1 2 d?as. " , severidad: "media" , }
, {
tipo: "mantenimiento" , mensaje : "Revisi?n de gas propano en Restaurante Chaparral pendiente. " , severidad: "alta" , }
, {
tipo: "cobro" , mensaje : "Hay 2 rentas vencidas en Pol?gono 3 3 B. " , severidad: "alta" , }
, {
tipo: "proyecto" , mensaje : "Proyecto de ampliaci?n de locales en El Salvador est? al 6 5 % . " , severidad: "baja" , }
, ] ;
function formatCurrency (v)
{
return v.toLocaleString ( "es SV" , {
style: "currency" , currency: "USD" , maximumFractionDigits : 2 , }
)
;
}
function formatPercent(v)
{
return ` $ {
(v * 1 0 0 )
.toFixed ( 1 )
}
% ` ;
}
export default function PanelNegocios( )
{
const dt = new Date( )
;
const monthShort = dt.toLocaleString ( "es ES" , {
month: "short" }
)
;
const todayText = ` $ {dt.getDate ( )
}
$ {monthShort.charAt( 0 )
.toUpperCase( )
+ monthShort.slice( 1 )
}
$ {dt.getFullYear( )
}
` ;
const totalIngresosReferencia = Math.max( . . .INGRESOS_ 7 _DIAS.map( (d)
= > d.total)
)
;
const totalBancos = BANCOS.reduce( (acc, b)
= > acc + b.saldo, 0 )
;
return ( <div className= "spacey 6 " > {
/ * HEADER * / }
<header className= "flex flex col gap 3 sm:flex row sm:items end sm:justify between " > <div> <h1 className= "text 2xl md:text 3xl font semibold flex items center gap 2 " > <Building2 className= "w 6 h 6 text [var( accent)
] " / > Dashboard corporativo de negocios < /h1 > <p className= "text sm subtle mt 1 " > Visi?n consolidada de Inversiones JCF (restaurantes, propiedades, locales y proyectos)
. < /p> < /div> <div className= "text right text xs sm:text sm subtle" > <div className= "font semibold text [var( text)
] " > Resumen al {todayText}
< /div> <div>Sesiones, transacciones y producci?n actualizadas en tiempo real. < /div> < /div> < /header> {
/ * KPIs PRINCIPALES * / }
<section className= "grid gap 4 md:grid cols 2 xl:grid cols 4 " > {
/ * Ingresos d?a * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between " > <span className= "text xs font semibold uppercase tracking wide subtle" > Ingresos del d?a (corporativo)
< /span> <span className= "inline flex items center gap 1 text xs font semibold kpi chip kpi chip up" > <LineChart className= "w 3 h 3 " / > {formatPercent(VARIACIONES.ingresosDiaVsAyer)
}
< /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatCurrency (SUMMARY _KPIS.ingresosDia)
}
< /div> <p className= "text xs subtle" > Comparado con ayer, la producci?n global muestra una variaci ?n positiva. < /p> < /div> {
/ * Ingresos mes * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between " > <span className= "text xs font semibold uppercase tracking wide subtle" > Ingresos del mes < /span> <span className= "inline flex items center gap 1 text xs font semibold kpi chip kpi chip up" > <LineChart className= "w 3 h 3 " / > {formatPercent(VARIACIONES.ingresosMesVsAnterior )
}
< /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatCurrency (SUMMARY _KPIS.ingresosMes)
}
< /div> <p className= "text xs subtle" > Incluye restaurantes, alquileres de propiedades y otros negocios activos . < /p> < /div> {
/ * Margen mensual * / }
<div className= "neo card p 4 flex flex col gap 2 " > <div className= "flex items center justify between " > <span className= "text xs font semibold uppercase tracking wide subtle" > Margen de rentabilidad del mes < /span> <span className= {
`inline flex items center gap 1 text xs font semibold kpi chip $ {VARIACIONES.margenVsAnterior > = 0 ? "kpi chip up" : "kpi chip down" }
` }
> <LineChart className= "w 3 h 3 " / > {formatPercent(VARIACIONES.margenVsAnterior)
}
< /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatPercent(SUMMARY _KPIS.margenMes)
}
< /div> <p className= "text xs subtle" > Margen estimado usando transacciones de ingresos y gastos registrados. < /p> < /div> {
/ * Negocios activos + caja * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between " > <span className= "text xs font semibold uppercase tracking wide subtle" > Negocios activos < /span> <Wallet className= "w 4 h 4 text [var( accent)
] " / > < /div> <div className= "flex items end justify between gap 3 " > <div> <div className= "text 2xl font semibold tabular nums" > {SUMMARY _KPIS.negociosActivos}
< /div> <p className= "text xs subtle" > Restaurantes, propiedades y otras unidades operando hoy. < /p> < /div> <div className= "text right" > <div className= "text [ 1 1px] subtle mb 1 " >Flujo disponible< /div> <div className= "text sm font semibold tabular nums" > {formatCurrency (SUMMARY _KPIS.flujoDisponible)
}
< /div> < /div> < /div> < /div> < /section > {
/ * BLOQUE: TENDENCIA + FLUJO DE CAJA * / }
<section className= "kpi split gap 4 " > {
/ * Tendencia 閻?ltimos 7 d?as * / }
<div className= "neo card production card p 4 flex flex col gap 4 " > <div className= "flex items center justify between gap 2 " > <div> <h2 className= "text sm font semibold flex items center gap 2 " > <LineChart className= "w 4 h 4 text [var( accent)
] " / > Ingresos 閻?ltimos 7 d?as < /h2 > <p className= "text xs subtle" > Vista consolidada de la producci?n diaria por todos los negocios. < /p> < /div> <div className= "text xs subtle text right" > Base de referencia: {
" " }
<span className= "tabular nums font semibold" > {formatCurrency (totalIngresosReferencia)
}
< /span> < /div> < /div> <div className= "mt 2 grid grid cols 7 gap 2 items end" > {INGRESOS_ 7 _DIAS.map( (d)
= > {
const heightPct = (d.total / (totalIngresosReferencia | | 1 )
)
* 1 0 0 ;
return ( <div key= {d.label}
className= "flex flex col items center gap 1 " > <div className= "w full flex 1 flex items end" > <div className= "w full rounded full bg gradient to t from [color mix(in_oklab,var( accent)
_ 4 0 % , # 0 0 0 _ 1 5 % )
] to [var( accent)
] shadow sm" style= {
{
height: ` $ {Math.max(heightPct, 8 )
}
% ` }
}
/ > < /div> <div className= "text [ 1 1px] subtle font medium" > {d.label}
< /div> < /div> )
;
}
)
}
< /div> <div className= "mt 3 flex flex wrap items center justify between gap 3 text [ 1 1px] " > <div className= "metric row" > <span className= "dot dot activos " / > <span> Barra m?s alta = d?a con mayor ingreso consolidado en la semana. < /span> < /div> <div className= "metric row" > <span className= "dot dot const" / > <span> Puedes conectar este gr?fico a tus transacciones reales cuando la API est閼? lista. < /span> < /div> < /div> < /div> {
/ * Flujo de caja por banco * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between gap 2 " > <div> <h2 className= "text sm font semibold flex items center gap 2 " > <Banknote className= "w 4 h 4 text [var( accent)
] " / > Flujo de caja por banco < /h2 > <p className= "text xs subtle" > Saldos agregados por cuenta bancaria y efectivo. < /p> < /div> <div className= "text xs subtle text right" > Total en bancos <div className= "tabular nums font semibold" > {formatCurrency (totalBancos)
}
< /div> < /div> < /div> <div className= "spacey 1 . 5 mt 1 " > {BANCOS.map( (b)
= > {
const pct = (b.saldo / (totalBancos | | 1 )
)
* 1 0 0 ;
const siglas = b.nombre .split( " " )
.map( (w)
= > w[ 0 ] )
.join( " " )
.slice( 0 , 3 )
.toUpperCase( )
;
return ( <div key= {b.nombre}
className= "bank row" > <div className= "flex items center gap 3 flex 1 minw 0 " > <div className= "bank chip" > {siglas}
< /div> <div className= "minw 0 " > <div className= "text xs font semibold truncate" > {b.nombre}
< /div> <div className= "mt 1 h 1 . 5 w full rounded full bg [color mix(in_oklab,var( panel)
_ 8 0 % ,var( border)
_ 2 0 % )
] overflow hidden" > <div className= "h full bank bar" style= {
{
width: ` $ {pct.toFixed ( 1 )
}
% ` }
}
/ > < /div> < /div> < /div> <div className= "tabular nums text xs font semibold text right ml 2 " > {formatCurrency (b.saldo)
}
< /div> < /div> )
;
}
)
}
< /div> < /div> < /section > {
/ * RANKING NEGOCIOS + ALERTAS * / }
<section className= "grid gap 4 lg:grid cols [minmax( 0 , 3fr)
_minmax( 0 , 2fr)
] " > {
/ * TOP NEGOCIOS * / }
<div className= "neo card p 4 " > <div className= "flex items center justify between mb 3 " > <h2 className= "text sm font semibold flex items center gap 2 " > <Store className= "w 4 h 4 text [var( accent)
] " / > Negocios con mayor producci?n hoy < /h2 > <span className= "text [ 1 1px] subtle" > Basado en ingresos diarios estimados. < /span> < /div> <div className= "overflowxauto mx 2 px 2 " > <table className= "w full text xs table auto text left table lined" > <thead className= "bg [color mix(in_oklab,var( panel)
_ 9 4 % ,var( accent)
_ 6 % )
] " > <tr> <th className= "px 2 py 2 font semibold" >Negocio < /th> <th className= "px 2 py 2 font semibold" >Tipo< /th> <th className= "px 2 py 2 font semibold text right" > Ingreso d?a < /th> <th className= "px 2 py 2 font semibold text right" > Ingreso mes < /th> <th className= "px 2 py 2 font semibold text right" > Var. < /th> <th className= "px 2 py 2 font semibold text center" > Estado < /th> < /tr> < /thead> <tbody> {NEGOCIOS_TOP.map( (n, idx)
= > {
const positive = n.variacion > = 0 ;
return ( <tr key= {n.codigo | | idx}
> <td className= "px 2 py 1 . 5 " > <div className= "flex flex col" > <span className= "font semibold text [ 1 3px] " > {n.nombre}
< /span> <span className= "text [ 1 1px] subtle" > C?digo {n.codigo}
< /span> < /div> < /td> <td className= "px 2 py 1 . 5 " > <div className= "flex items center gap 1 text [ 1 1px] " > {n.tipo = = = "Propiedades" ? ( <Home className= "w 3 h 3 subtle" / > )
: ( <Factory className= "w 3 h 3 subtle" / > )
}
<span> {n.tipo}
< /span> < /div> < /td> <td className= "px 2 py 1 . 5 text right tabular nums" > {formatCurrency (n.ingresoDia)
}
< /td> <td className= "px 2 py 1 . 5 text right tabular nums" > {formatCurrency (n.ingresoMes)
}
< /td> <td className= {
`px 2 py 1 . 5 text right tabular nums $ {positive ? "text emerald 6 0 0 " : "text rose 6 0 0 " }
` }
> {positive ? " ?? : " ?? }
{formatPercent(Math.abs(n.variacion)
)
}
< /td> <td className= "px 2 py 1 . 5 text center" > <span className= {
`inline flex items center justify center px 2 py [ 2px] rounded full text [ 1 1px] font semibold $ {n.estado = = = "Abierto " | | n.estado = = = "Operando" ? "bg emerald 5 0 0 / 1 5 text emerald 4 0 0 " : "bg slate 5 0 0 / 2 0 text slate 2 0 0 " }
` }
> {n.estado}
< /span> < /td> < /tr> )
;
}
)
}
< /tbody> < /table> < /div> <p className= "mt 2 text [ 1 1px] subtle" > M?s adelante puedes filtrar por tipo de negocio , pa?s (El Salvador / USA)
o por m?dulo (restaurante, propiedades, veh?culos, etc. )
. < /p> < /div> {
/ * ALERTAS Y PR閼?XIMOS EVENTOS * / }
<div className= "neo card p 4 flex flex col gap 3 " > <div className= "flex items center justify between " > <h2 className= "text sm font semibold flex items center gap 2 " > <AlertTriangle className= "w 4 h 4 text amber 4 0 0 " / > Alertas y pr?ximos eventos < /h2 > <span className= "text [ 1 1px] subtle" > Contratos, mantenimientos , cobros y proyectos. < /span> < /div> <div className= "spacey 2 text [ 1 3px] " > {ALERTAS .map( (a, idx)
= > {
let colorClasses = "border slate 5 0 0 / 4 0 bg slate 7 0 0 / 1 0 " ;
if (a.severidad = = = "alta" )
{
colorClasses = "border rose 5 0 0 / 5 0 bg rose 5 0 0 / 1 0 " ;
}
else if (a.severidad = = = "media" )
{
colorClasses = "border amber 5 0 0 / 5 0 bg amber 5 0 0 / 1 0 " ;
}
return ( <div key= {idx}
className= {
`border rounded lg px 3 py 2 flex items start gap 2 $ {colorClasses}
` }
> <div className= "pt [ 2px] " > <AlertTriangle className= "w 3 . 5 h 3 . 5 " / > < /div> <div className= "flex 1 " > <div className= "text [ 1 1px] font semibold uppercase tracking wide" > {a.tipo}
< /div> <div className= "text [ 1 3px] leading snug" > {a.mensaje }
< /div> < /div> <span className= "text [ 1 0px] subtle capitalize" > {a.severidad}
< /span> < /div> )
;
}
)
}
< /div> <p className= "mt 1 text [ 1 1px] subtle" > Estas alertas pueden alimentarse de tus transacciones, contratos, proyectos y m?dulo de restaurante ( ?rdenes abiertas, tickets sin cobrar, etc. )
. < /p> < /div> < /section > < /div> )
;
}