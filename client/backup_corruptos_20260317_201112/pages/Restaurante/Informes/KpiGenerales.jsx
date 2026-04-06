// src/pages/Restaurante/Informes/KpiGenerales.jsx import React, {
useMemo , useState, useRef }
from "react" ;
import {
useCostos }
from " @ /context /CostosContext.jsx" ;
import {
Banknote, Receipt , LineChart as LineChartIcon, Percent , CreditCard, CircleDollarSign, TrendingUp, FileSpreadsheet, FileText, Printer , }
from "lucide React" ;
import {
ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip , PieChart, Pie, Cell, Legend, }
from "recharts" ;
import * as XLSX from "xlsx" ;
import jsPDF from "jspdf" ;
import html2canvas from "html2canvas" ;
/ * * * KpiGenerales.jsx ??KPIs del gerente con selector de per?odo * / // Utilidades de fecha const startOf = {
day: (d)
= > new Date(d.getFullYear( )
, d.getMonth( )
, d.getDate ( )
, 0 , 0 , 0 , 0 )
, week: (d)
= > {
const x = new Date(d)
;
const day = (x.getDay( )
+ 6 )
% 7 ;
// Lunes= 0 x.setDate (x.getDate ( )
day)
;
return new Date(x.getFullYear( )
, x.getMonth( )
, x.getDate ( )
, 0 , 0 , 0 , 0 )
;
}
, month: (d)
= > new Date(d.getFullYear( )
, d.getMonth( )
, 1 )
, year: (d)
= > new Date(d.getFullYear( )
, 0 , 1 )
, }
;
const endOf = {
day: (d)
= > new Date(d.getFullYear( )
, d.getMonth( )
, d.getDate ( )
, 2 3 , 5 9 , 5 9 , 9 9 9 )
, week: (d)
= > {
const s = startOf .week(d)
;
const e = new Date(s)
;
e.setDate (s.getDate ( )
+ 6 )
;
return endOf.day(e)
;
}
, month: (d)
= > new Date(d.getFullYear( )
, d.getMonth( )
+ 1 , 0 , 2 3 , 5 9 , 5 9 , 9 9 9 )
, year: (d)
= > new Date(d.getFullYear( )
, 1 1 , 3 1 , 2 3 , 5 9 , 5 9 , 9 9 9 )
, }
;
function getRange(period, customStart, customEnd)
{
const now = new Date( )
;
if (period = = = "Hoy" )
return [startOf .day(now)
, endOf.day(now)
, "hour" , "hoy" ] ;
if (period = = = "Ayer" )
{
const y = new Date(now)
;
y.setDate (y.getDate ( )
1 )
;
return [startOf .day(y)
, endOf.day(y)
, "hour" , "ayer" ] ;
}
if (period = = = "Semana" )
return [startOf .week(now)
, endOf.week(now)
, "day" , "esta semana" ] ;
if (period = = = "Mes" )
return [startOf .month(now)
, endOf.month(now)
, "day" , "este mes" ] ;
if (period = = = "A鐢?o " )
return [startOf .year(now)
, endOf.year(now)
, "month" , "este a鐢?o " ] ;
const s = customStart ? new Date(customStart)
: startOf .day(now)
;
const e = customEnd ? new Date(customEnd)
: endOf.day(now)
;
const days = Math.max( 1 , Math.ceil( (e s)
/ ( 1 0 0 0 * 6 0 * 6 0 * 2 4 )
)
)
;
const granularity = days < = 2 ? "hour" : days < = 9 2 ? "day" : "month" ;
return [s, e, granularity, "rango" ] ;
}
// MOCK ORDERS (solo ventas;
costos vienen del Context )
const MOCK_ORDERS = [ {
id: "ORD 1 0 0 1 " , estado: "cerrada " , total: 1 8 . 7 5 , propina : 2 . 2 5 , metodoPago: "Efectivo" , fechaCierre:new Date( )
.setHours( 9 , 1 2 , 0 , 0 )
, items: [ {
producto: "Pupusa de queso" , categoria: "Porciones" , qty: 3 , precio: 0 . 7 5 }
, {
producto: "Caf閼?" , categoria: "Bebidas " , qty: 1 , precio: 1 . 5 }
] }
, {
id: "ORD 1 0 0 2 " , estado: "cerrada " , total: 4 2 . 1 , propina : 4 . 5 , metodoPago: "Tarjeta " , fechaCierre:new Date( )
.setHours( 1 1 , 5 , 0 , 0 )
, items: [ {
producto: "Combo desayuno" , categoria: "Combos" , qty: 2 , precio: 3 . 9 9 }
, {
producto: "Pupusa de queso" , categoria: "Porciones" , qty: 6 , precio: 0 . 7 5 }
] }
, {
id: "ORD 1 0 0 3 " , estado: "cerrada " , total: 2 7 . 0 , propina : 3 . 0 , metodoPago: "Tarjeta " , fechaCierre:new Date( )
.setHours( 1 3 , 4 7 , 0 , 0 )
, items: [ {
producto: "Combo almuerzo" , categoria: "Combos" , qty: 1 , precio: 5 . 9 9 }
, {
producto: "Coca Cola" , categoria: "Bebidas " , qty: 2 , precio: 1 . 5 }
] }
, {
id: "ORD 1 0 0 4 " , estado: "cerrada " , total: 1 2 . 4 , propina : 1 . 0 , metodoPago: "Efectivo" , fechaCierre:new Date( )
.setHours( 1 5 , 1 0 , 0 , 0 )
, items: [ {
producto: "Pupusa revuelta" , categoria: "Porciones" , qty: 4 , precio: 0 . 7 5 }
, {
producto: "Agua" , categoria: "Bebidas " , qty: 1 , precio: 1 . 0 }
] }
, {
id: "ORD 1 0 0 5 " , estado: "abierta " , total: 1 9 . 2 , propina : 0 , metodoPago:null, fechaCierre:null, items: [ {
producto: "Combo cena" , categoria: "Combos" , qty: 1 , precio: 5 . 9 9 }
] }
, {
id: "ORD 0 9 9 9 " , estado: "cerrada " , total: 3 1 . 5 , propina : 2 . 0 , metodoPago: "Tarjeta " , fechaCierre:new Date(Date.now( )
8 6 4 0 0 0 0 0 )
.setHours( 2 0 , 1 0 , 0 , 0 )
, items: [ {
producto: "Combo desayuno" , categoria: "Combos" , qty: 1 , precio: 3 . 9 9 }
] }
, ] ;
// Colores para gr?ficos const CHART_COLORS = [ " #FACC1 5 " , " # 2 2C5 5E" , " # 6 0A5FA" , " #F4 7 2B6 " , " #A7 8BFA" , " # 3 4D3 9 9 " ] ;
const COSTS_COLORS = [ " #F8 7 1 7 1 " , " #FB9 2 3C" , " #FBBF2 4 " , " # 3 4D3 9 9 " , " # 6 0A5FA" , " #A7 8BFA" ] ;
// Helpers const fmtMoney = (n)
= > ` $ $ {Number(n | | 0 )
.toFixed ( 2 )
}
` ;
const safe = (s)
= > String(s)
.replace ( / [ \ \ / : * ? " < > | ] /g, " " )
;
// Detalle por fecha + producto (ventas)
function detallePorFechaYProducto(ordersCerradas )
{
const map = new Map( )
;
for (const o of ordersCerradas )
{
const d = new Date(o.fechaCierre)
;
d.setHours( 0 , 0 , 0 , 0 )
;
const fecha = d.toLocaleDateString( )
;
for (const it of o.items | | [ ] )
{
const key = ` $ {fecha}
| | $ {it.producto}
` ;
const prev = map.get(key)
| | {
fecha, producto: it.producto, cantidad: 0 , total: 0 }
;
const qty = Number(it.qty | | 0 )
, precio = Number(it.precio | | 0 )
;
prev.cantidad + = qty;
prev.total + = qty * precio;
map.set(key, prev)
;
}
}
return Array.from(map.values( )
)
.sort( (a,b)
= > new Date(a.fecha)
new Date(b.fecha)
| | b.cantidad a.cantidad)
;
}
/ * UI auxiliares: KPI Card con degradados modernos * / function KPICard ( {
title, value, subtitle, icon: Icon, gradient, bright = false }
)
{
const titleCls = bright ? "text [ 1 1px] uppercase tracking wide text black/ 8 0 " : "text [ 1 1px] uppercase tracking wide text white/ 8 0 " ;
const valueCls = bright ? "mt 1 text 2xl font extrabold text black" : "mt 1 text 2xl font extrabold text white" ;
const subCls = bright ? "mt 1 text xs text black/ 7 0 " : "mt 1 text xs text white/ 7 0 " ;
const iconWrap = bright ? "p 3 rounded xl bg black/ 1 0 border border black/ 1 0 text black/ 8 0 " : "p 3 rounded xl bg white/ 1 5 border border white/ 1 0 text white" ;
const ringCls = bright ? "ring 1 ring black/ 1 0 " : "ring 1 ring white/ 1 0 " ;
return ( <div className= {
`rounded 2xl p 4 border border transparent shadow sm hover:shadow md transition $ {ringCls }
$ {gradient}
` }
> <div className= "flex items center justify between " > <div> <p className= {titleCls}
> {title}
< /p> <p className= {valueCls}
> {value}
< /p> {subtitle & & <p className= {subCls}
> {subtitle}
< /p> }
< /div> {Icon & & <div className= {iconWrap}
> <Icon size= {
2 2 }
/ > < /div> }
< /div> < /div> )
;
}
function Section ( {
title, children, right }
)
{
return ( <section className= "rounded 2xl border border slate 7 0 0 bg gradient to br from slate 9 0 0 / 9 0 to slate 9 5 0 p 4 " > <div className= "flex items center justify between mb 3 " > <h3 className= "text yellow 3 0 0 font semibold" > {title}
< /h3 > {right}
< /div> {children}
< /section > )
;
}
function bucketSales(orders, granularity, start, end)
{
const buckets = [ ] ;
if (granularity = = = "hour" )
{
for (let h = 0 ;
h < 2 4 ;
h+ + )
buckets .push( {
label: ` $ {h}
: 0 0 ` , total: 0 }
)
;
orders.forEach ( (o)
= > {
const h = new Date(o.fechaCierre)
.getHours( )
;
buckets [h] .total + = o.total | | 0 ;
}
)
;
}
else if (granularity = = = "day" )
{
const cur = new Date(start)
;
cur.setHours( 0 , 0 , 0 , 0 )
;
while (cur < = end)
{
buckets .push( {
label: cur.toLocaleDateString( )
, key: cur.toDateString( )
, total: 0 }
)
;
cur.setDate (cur.getDate ( )
+ 1 )
;
}
const map = new Map(buckets .map( (b)
= > [b.key,b] )
)
;
orders.forEach ( (o)
= > {
const d=new Date(o.fechaCierre)
;
d.setHours( 0 , 0 , 0 , 0 )
;
const k=d.toDateString( )
;
if(map.has(k)
)
map.get(k)
.total + = o.total| | 0 ;
}
)
;
}
else {
const sY=start.getFullYear( )
, sM=start.getMonth( )
, eY=end.getFullYear( )
, eM=end.getMonth( )
;
for(let y=sY;y< =eY;y+ + )
{
const from=y= = =sY?sM: 0 , to=y= = =eY?eM: 1 1 ;
for(let m=from;m< =to;m+ + )
buckets .push( {label: ` $ {m+ 1 }
/ $ {y}
` , key: ` $ {y}
$ {m}
` , total: 0 }
)
;
}
const map=new Map(buckets .map( (b)
= > [b.key,b] )
)
;
orders.forEach ( (o)
= > {
const d=new Date(o.fechaCierre)
;
const k= ` $ {d.getFullYear( )
}
$ {d.getMonth( )
}
` ;
if(map.has(k)
)
map.get(k)
.total+ =o.total| | 0 ;
}
)
;
}
return buckets ;
}
export default function KpiGenerales( )
{
const [orders] = useState(MOCK_ORDERS)
;
const {
costos }
= useCostos( )
;
// costos reales del contexto const [incluirPendientes, setIncluirPendientes] = useState(true)
;
const [filtroMetodo, setFiltroMetodo] = useState( "Todos" )
;
// Per?odo const [period, setPeriod] = useState( "Hoy" )
;
const [customStart, setCustomStart ] = useState( " " )
;
const [customEnd, setCustomEnd] = useState( " " )
;
const [rangeStart, rangeEnd, granularity, periodLabel] = useMemo ( ( )
= > getRange(period, customStart, customEnd)
, [period, customStart, customEnd] )
;
// Derivados const {
ventasTotal, ordenesCerradas, ticketPromedio , propinasTotal, abiertasCount, abiertasTotal, ventasSerie, pagosPie, topProductos, costosTotal, utilidad, margenPct, ventasVsCostos , costosPie }
= useMemo ( ( )
= > {
let cerradas = orders.filter( (o)
= > o.estado = = = "cerrada " & & o.fechaCierre & & new Date(o.fechaCierre)
> = rangeStart & & new Date(o.fechaCierre)
< = rangeEnd )
;
if (filtroMetodo ! = = "Todos" )
cerradas = cerradas.filter( (o)
= > o.metodoPago = = = filtroMetodo)
;
const ventasTotal = cerradas.reduce( (acc, o)
= > acc + (o.total | | 0 )
, 0 )
;
const propinasTotal = cerradas.reduce( (acc, o)
= > acc + (o.propina | | 0 )
, 0 )
;
const ordenesCerradas = cerradas.length;
const ticketPromedio = ordenesCerradas ? ventasTotal / ordenesCerradas : 0 ;
const abiertas = orders.filter( (o)
= > o.estado = = = "abierta " )
;
const abiertasTotal = abiertas.reduce( (acc, o)
= > acc + (o.total | | 0 )
, 0 )
;
const ventasSerie = bucketSales(cerradas, granularity, rangeStart, rangeEnd)
;
const metodosMap = new Map( )
;
cerradas.forEach ( (o)
= > {
const k = o.metodoPago | | "N/A" ;
metodosMap.set(k, (metodosMap.get(k)
| | 0 )
+ (o.total | | 0 )
)
;
}
)
;
const pagosPie = Array.from(metodosMap.entries ( )
)
.map( ( [name, value] )
= > ( {
name, value }
)
)
;
const productQty = new Map( )
;
cerradas.forEach ( (o)
= > (o.items | | [ ] )
.forEach ( (it)
= > {
const k = it.producto;
productQty.set(k, (productQty.get(k)
| | 0 )
+ (it.qty | | 0 )
)
;
}
)
)
;
const topProductos = Array.from(productQty.entries ( )
)
.map( ( [producto, qty] )
= > ( {
producto, qty }
)
)
.sort( (a, b)
= > b.qty a.qty)
.slice( 0 , 5 )
;
// COSTOS en rango (desde contexto)
let costosRango = (costos | | [ ] )
.filter( (c)
= > c.fecha & & new Date(c.fecha)
> = rangeStart & & new Date(c.fecha)
< = rangeEnd )
;
if ( !incluirPendientes)
costosRango = costosRango.filter( (c)
= > c.pagado)
;
const costosTotal = costosRango.reduce( (a, c)
= > a + (Number(c.total)
| | 0 )
, 0 )
;
const utilidad = ventasTotal costosTotal;
const margenPct = ventasTotal ? (utilidad / ventasTotal)
* 1 0 0 : 0 ;
// Serie Ventas vs Costos const labelFromDate = (date)
= > {
const d = new Date(date)
;
if (granularity = = = "day" )
return new Date(d.getFullYear( )
, d.getMonth( )
, d.getDate ( )
)
.toLocaleDateString( )
;
if (granularity = = = "month" )
return ` $ {d.getMonth( )
+ 1 }
/ $ {d.getFullYear( )
}
` ;
return ` $ {d.getHours( )
}
: 0 0 ` ;
}
;
const costMap = new Map( )
;
costosRango.forEach ( (c)
= > {
const lbl = labelFromDate(c.fecha)
;
costMap .set(lbl, (costMap .get(lbl)
| | 0 )
+ (Number(c.total)
| | 0 )
)
;
}
)
;
const ventasVsCostos = ventasSerie.map( (v)
= > ( {
label: v.label, ventas: v.total, costos: costMap .get(v.label)
| | 0 , }
)
)
;
// Costos por categor ?a const catMap = new Map( )
;
costosRango.forEach ( (c)
= > {
const k = c.categoria | | "Otros" ;
catMap.set(k, (catMap.get(k)
| | 0 )
+ (Number(c.total)
| | 0 )
)
;
}
)
;
const costosPie = Array.from(catMap.entries ( )
)
.map( ( [name, value] )
= > ( {
name, value }
)
)
;
return {
ventasTotal, ordenesCerradas, ticketPromedio , propinasTotal, abiertasCount: abiertas.length, abiertasTotal, ventasSerie, pagosPie, topProductos, costosTotal, utilidad, margenPct, ventasVsCostos , costosPie }
;
}
, [orders, costos, rangeStart, rangeEnd, granularity, filtroMetodo, incluirPendientes] )
;
const metodoOpts = [ "Todos" , . . .new Set(MOCK_ORDERS.map( (o)
= > o.metodoPago)
.filter(Boolean )
)
] ;
const subtitleFecha = period = = = "Rango" ? ` $ {rangeStart.toLocaleDateString( )
}
?? $ {rangeEnd.toLocaleDateString( )
}
` : new Date( )
.toLocaleDateString( )
;
const granLabel = granularity = = = "hour" ? "hora" : granularity = = = "day" ? "d?a " : "mes" ;
// Exportar const exportarExcel = ( )
= > {
let cerradas = orders.filter( (o)
= > o.estado = = = "cerrada " & & o.fechaCierre & & new Date(o.fechaCierre)
> = rangeStart & & new Date(o.fechaCierre)
< = rangeEnd )
;
if (filtroMetodo ! = = "Todos" )
cerradas = cerradas.filter( (o)
= > o.metodoPago = = = filtroMetodo)
;
let costosRango = (costos | | [ ] )
.filter( (c)
= > c.fecha & & new Date(c.fecha)
> = rangeStart & & new Date(c.fecha)
< = rangeEnd )
;
if ( !incluirPendientes)
costosRango = costosRango.filter( (c)
= > c.pagado)
;
const wb = XLSX.utils.book_new( )
;
const wsKPI = XLSX.utils.aoa_to_sheet( [ [ "Periodo " , periodLabel] , [ "Rango" , ` $ {rangeStart.toLocaleDateString( )
}
$ {rangeEnd.toLocaleDateString( )
}
` ] , [ "M閼?todo de pago (filtro)
" , filtroMetodo] , [ "Incluir pendientes (costos)
" , incluirPendientes ? "S?" : "No" ] , [ "Ventas" , ventasTotal] , [ " 閼?rdenes cerradas" , ordenesCerradas] , [ "Ticket promedio" , ticketPromedio ] , [ "Propinas" , propinasTotal] , [ "Costos" , costosTotal] , [ "Utilidad" , utilidad] , [ "Margen % " , margenPct] , ] )
;
XLSX.utils.book_append_sheet(wb, wsKPI, "KPIs" )
;
const wsSerie = XLSX.utils.aoa_to_sheet( [ [ "Etiqueta" , "Ventas" ] , . . .ventasSerie.map( (r)
= > [r.label, r.total] )
] )
;
XLSX.utils.book_append_sheet(wb, wsSerie , "VentasSerie" )
;
const wsVC = XLSX.utils.aoa_to_sheet( [ [ "Etiqueta" , "Ventas" , "Costos" ] , . . .ventasVsCostos .map(r= > [r.label, r.ventas, r.costos] )
] )
;
XLSX.utils.book_append_sheet(wb, wsVC, "VentasVsCostos " )
;
const wsPagos = XLSX.utils.aoa_to_sheet( [ [ "M閼?todo" , "Total" ] , . . .pagosPie.map( (p)
= > [p.name, p.value] )
] )
;
XLSX.utils.book_append_sheet(wb, wsPagos , "MetodosPago" )
;
const filename = `Reporte _ $ {periodLabel}
_ $ {rangeStart.toLocaleDateString( )
}
_ $ {rangeEnd.toLocaleDateString( )
}
.xlsx` ;
XLSX.writeFile(wb, filename)
;
}
;
// Captura exacta ??PDF / Imprimir const screenRef = useRef(null)
;
const exportarPDFExacto = async ( )
= > {
if ( !screenRef.current )
return;
const canvas = await html2canvas(screenRef.current , {
useCORS : true, scale: 2 }
)
;
const img = canvas.toDataURL( "image/png" )
;
const pdf = new jsPDF( "p" , "pt" , "a4 " )
;
const pageW = pdf.internal.pageSize.getWidth( )
;
const pageH = pdf.internal.pageSize.getHeight( )
;
const imgW = pageW;
const imgH = (canvas.height * imgW)
/ canvas.width;
if (imgH < = pageH)
{
pdf.addImage(img, "PNG" , 0 , 0 , imgW, imgH)
;
}
else {
let heightLeft = imgH;
let position = 0 ;
pdf.addImage(img, "PNG" , 0 , position, imgW, imgH)
;
heightLeft = pageH;
while (heightLeft > 0 )
{
pdf.addPage ( )
;
position = (imgH heightLeft)
;
pdf.addImage(img, "PNG" , 0 , position, imgW, imgH)
;
heightLeft = pageH;
}
}
const filename = `Reporte _EXACTO_ $ {periodLabel}
_ $ {rangeStart.toLocaleDateString( )
}
_ $ {rangeEnd.toLocaleDateString( )
}
.pdf` ;
pdf.save(filename)
;
}
;
const imprimirExacto = async ( )
= > {
if ( !screenRef.current )
return;
const canvas = await html2canvas(screenRef.current , {
useCORS : true, scale: 2 }
)
;
const dataUrl = canvas.toDataURL( "image/png" )
;
const w = window.open( " " , " _blank" )
;
if ( !w)
return;
w.document.write( ` < !doctype html> <html> <head> <meta charset = "utf 8 " / > <title>Imprimir< /title> <style> html,body{
margin: 0 ;
padding : 0 ;
}
@page {
size: auto;
margin: 0 ;
}
img{
width: 1 0 0vw;
height:auto;
display :block;
}
< /style> < /head> <body> <img src= " $ {dataUrl }
" / > <script>window.onload = ( )
= > setTimeout( ( )
= >window.print( )
, 1 5 0 )
;
< /script> < /body> < /html> ` )
;
w.document.close( )
;
}
;
return ( <div ref= {screenRef}
className= "p 6 spacey 6 " > {
/ * Header * / }
<div className= "flex items end justify between flex wrap gap 4 " > <div> <p className= "text slate 4 0 0 text sm" > Visi?n general {period = = = "Rango" ? "del rango" : `de $ {periodLabel}
` }
? {period = = = "Rango" ? ` $ {rangeStart.toLocaleDateString( )
}
?? $ {rangeEnd.toLocaleDateString( )
}
` : new Date( )
.toLocaleDateString( )
}
< /p> < /div> <div className= "flex items center gap 3 flex wrap" > <div className= "flex items center gap 2 " > <span className= "text slate 3 0 0 text sm" >Per?odo: < /span> <select className= "bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 rounded lg px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " value= {period}
onChange= {
(e)
= > setPeriod(e.target.value)
}
> {
[ "Hoy" , "Ayer" , "Semana" , "Mes" , "A鐢?o " , "Rango" ] .map( (p)
= > ( <option key= {p}
value= {p}
> {p}
< /option> )
)
}
< /select> {period = = = "Rango" & & ( < > <input type= "date" value= {customStart}
onChange= {
(e)
= > setCustomStart (e.target.value)
}
className= "bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 rounded lg px 3 py 2 " / > <input type= "date" value= {customEnd}
onChange= {
(e)
= > setCustomEnd(e.target.value)
}
className= "bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 rounded lg px 3 py 2 " / > < / > )
}
< /div> <div className= "flex items center gap 2 " > <span className= "text slate 3 0 0 text sm" >M閼?todo de pago: < /span> <select className= "bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 rounded lg px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " value= {filtroMetodo}
onChange= {
(e)
= > setFiltroMetodo(e.target.value)
}
> {metodoOpts.map( (m)
= > ( <option key= {m}
value= {m}
> {m}
< /option> )
)
}
< /select> < /div> {granularity ! = = "hour" & & ( <label className= "flex items center gap 2 text slate 3 0 0 text sm" > <input type= "checkbox" checked = {incluirPendientes}
onChange= {
(e)
= >setIncluirPendientes(e.target.checked )
}
/ > Incluir pendientes (costos)
< /label> )
}
<div className= "flex items center gap 2 " > <button onClick = {exportarExcel}
className= "inline flex items center gap 2 px 3 py 2 rounded lg border border slate 7 0 0 bg slate 9 0 0 text slate 1 0 0 hover:border yellow 4 0 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 5 0 , 2 0 4 , 2 1 , 0 . 3 5 )
] " title= "Exportar a Excel" > <FileSpreadsheet size= {
1 6 }
/ > Excel < /button> <button onClick = {exportarPDFExacto}
className= "inline flex items center gap 2 px 3 py 2 rounded lg border border slate 7 0 0 bg slate 9 0 0 text slate 1 0 0 hover:border yellow 4 0 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 5 0 , 2 0 4 , 2 1 , 0 . 3 5 )
] " title= "Exportar PDF (captura exacta)
" > <FileText size= {
1 6 }
/ > PDF < /button> <button onClick = {imprimirExacto }
className= "inline flex items center gap 2 px 3 py 2 rounded lg border border slate 7 0 0 bg slate 9 0 0 text slate 1 0 0 hover:border yellow 4 0 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 5 0 , 2 0 4 , 2 1 , 0 . 3 5 )
] " title= "Imprimir (captura exacta)
" > <Printer size= {
1 6 }
/ > Imprimir < /button> < /div> < /div> < /div> {
/ * KPI Ventas * / }
<div className= "grid grid cols 1 sm:grid cols 2 xl:grid cols 4 gap 4 " > <KPICard title= "VENTAS" value= {fmtMoney(ventasTotal)
}
subtitle= "Monto total de ?rdenes cerradas" icon= {Banknote}
gradient= "bg gradient to br from amber 3 0 0 via amber 4 0 0 to amber 5 0 0 " bright / > <KPICard title= " 閼?RDENES CERRADAS" value= {ordenesCerradas}
subtitle= "Acumulado" icon= {Receipt }
gradient= "bg gradient to br from emerald 6 0 0 to teal 7 0 0 " / > <KPICard title= "TICKET PROMEDIO" value= {fmtMoney(ticketPromedio )
}
subtitle= "Ventas / 閼?rdenes" icon= {TrendingUp}
gradient= "bg gradient to br from sky 6 0 0 to indigo 7 0 0 " / > <KPICard title= "PROPINAS" value= {fmtMoney(propinasTotal)
}
subtitle= "Solo ?rdenes cerradas" icon= {Percent }
gradient= "bg gradient to br from violet 6 0 0 to fuchsia 7 0 0 " / > < /div> {
/ * KPI Costos * / }
{granularity ! = = "hour" & & ( <div className= "grid grid cols 1 sm:grid cols 3 gap 4 " > <KPICard title= "COSTOS" value= {fmtMoney(costosTotal)
}
subtitle= {incluirPendientes ? "Base devengado" : "Base caja (pagados )
" }
icon= {Receipt }
gradient= "bg gradient to br from rose 6 0 0 to rose 7 0 0 " / > <KPICard title= "UTILIDAD" value= {fmtMoney(utilidad)
}
subtitle= "Ventas Costos" icon= {TrendingUp}
gradient= "bg gradient to br from emerald 6 0 0 to teal 7 0 0 " / > <KPICard title= "MARGEN % " value= {
` $ {margenPct.toFixed ( 1 )
}
% ` }
subtitle= "Utilidad / Ventas" icon= {LineChartIcon}
gradient= "bg gradient to br from indigo 6 0 0 to blue 7 0 0 " / > < /div> )
}
{
/ * Charts fila 1 * / }
<div className= "grid grid cols 1 xl:grid cols 3 gap 6 " > <Section title= {
`Ventas por $ {granLabel}
( $ {periodLabel}
)
` }
right= {
<LineChartIcon className= "text yellow 3 0 0 " size= {
1 8 }
/ > }
> <div className= "h 6 4 " > <ResponsiveContainer width= " 1 0 0 % " height= " 1 0 0 % " > <BarChart data= {ventasSerie}
margin= {
{
top: 8 , right: 8 , bottom: 8 , left: 8 }
}
> <XAxis dataKey = "label" stroke= " # 9 4a3b8 " tickLine= {false}
axisLine= {
{
stroke: " # 3 3 4 1 5 5 " }
}
/ > <YAxis stroke= " # 9 4a3b8 " tickLine= {false}
axisLine= {
{
stroke: " # 3 3 4 1 5 5 " }
}
tickFormatter= {
(v)
= > ` $ $ {v}
` }
/ > <Tooltip contentStyle= {
{
background: " # 0f1 7 2a" , border: " 1px solid # 3 3 4 1 5 5 " }
}
labelStyle= {
{
color: " #e2e8f0 " }
}
itemStyle= {
{
color: " #e2e8f0 " }
}
formatter= {
(v)
= > [ ` $ $ {Number(v)
.toFixed ( 2 )
}
` , "Ventas" ] }
/ > <Bar dataKey = "total" fill= " #FACC1 5 " radius= {
[ 6 , 6 , 0 , 0 ] }
/ > < /BarChart> < /ResponsiveContainer> < /div> < /Section > <Section title= {
`Ventas por m閼?todo de pago ( $ {periodLabel}
)
` }
right= {
<CreditCard className= "text yellow 3 0 0 " size= {
1 8 }
/ > }
> <div className= "h 6 4 " > <ResponsiveContainer width= " 1 0 0 % " height= " 1 0 0 % " > <PieChart> <Pie data= {pagosPie}
dataKey = "value" nameKey = "name" outerRadius= {
8 0 }
innerRadius= {
4 0 }
> {pagosPie.map( (entry, index)
= > ( <Cell key= {
`cell $ {index}
` }
fill= {CHART_COLORS[index % CHART_COLORS.length] }
/ > )
)
}
< /Pie> <Tooltip contentStyle= {
{
background: " # 0f1 7 2a" , border: " 1px solid # 3 3 4 1 5 5 " }
}
labelStyle= {
{
color: " #e2e8f0 " }
}
itemStyle= {
{
color: " #e2e8f0 " }
}
formatter= {
(v, n)
= > [ ` $ $ {Number(v)
.toFixed ( 2 )
}
` , n] }
/ > <Legend wrapperStyle= {
{
color: " #e2e8f0 " }
}
/ > < /PieChart> < /ResponsiveContainer> < /div> < /Section > <Section title= " 閼?rdenes abiertas ahora" right= {
<CircleDollarSign className= "text yellow 3 0 0 " size= {
1 8 }
/ > }
> <div className= "grid grid cols 2 gap 3 " > <div className= "rounded xl border border slate 7 0 0 p 3 bg slate 9 0 0 / 6 0 " > <p className= "text xs text slate 3 0 0 " >Cantidad< /p> <p className= "text xl font bold text white" > {abiertasCount}
< /p> < /div> <div className= "rounded 2xl border border slate 7 0 0 p 3 bg slate 9 0 0 / 6 0 " > <p className= "text xs text slate 3 0 0 " >Monto estimado< /p> <p className= "text xl font bold text white" > {fmtMoney(abiertasTotal)
}
< /p> < /div> < /div> <p className= "mt 2 text xs text slate 4 0 0 " > *No se suman a Ventas hasta cerrar/cobrar. < /p> < /Section > < /div> {
/ * Charts fila 2 * / }
{granularity ! = = "hour" & & ( <div className= "grid grid cols 1 xl:grid cols 2 gap 6 " > <Section title= {
`Ventas vs Costos por $ {granLabel}
( $ {periodLabel}
)
` }
> <div className= "h 6 4 " > <ResponsiveContainer width= " 1 0 0 % " height= " 1 0 0 % " > <BarChart data= {ventasVsCostos }
margin= {
{
top: 8 , right: 8 , bottom: 8 , left: 8 }
}
> <XAxis dataKey = "label" stroke= " # 9 4a3b8 " tickLine= {false}
axisLine= {
{
stroke: " # 3 3 4 1 5 5 " }
}
/ > <YAxis stroke= " # 9 4a3b8 " tickLine= {false}
axisLine= {
{
stroke: " # 3 3 4 1 5 5 " }
}
tickFormatter= {
(v)
= > ` $ $ {v}
` }
/ > <Tooltip contentStyle= {
{
background: " # 0f1 7 2a" , border: " 1px solid # 3 3 4 1 5 5 " }
}
labelStyle= {
{
color: " #e2e8f0 " }
}
itemStyle= {
{
color: " #e2e8f0 " }
}
formatter= {
(v, n)
= > [ ` $ $ {Number(v)
.toFixed ( 2 )
}
` , n] }
/ > <Legend wrapperStyle= {
{
color: " #e2e8f0 " }
}
/ > <Bar dataKey = "ventas" name= "Ventas" fill= " #FACC1 5 " radius= {
[ 6 , 6 , 0 , 0 ] }
/ > <Bar dataKey = "costos" name= "Costos" fill= " #F4 3F5E" radius= {
[ 6 , 6 , 0 , 0 ] }
/ > < /BarChart> < /ResponsiveContainer> < /div> < /Section > <Section title= {
`Costos por categor ?a ( $ {periodLabel}
)
` }
> <div className= "h 6 4 " > <ResponsiveContainer width= " 1 0 0 % " height= " 1 0 0 % " > <PieChart> <Pie data= {costosPie}
dataKey = "value" nameKey = "name" outerRadius= {
8 0 }
innerRadius= {
4 0 }
> {costosPie.map( (entry, index)
= > ( <Cell key= {
`cell cost $ {index}
` }
fill= {COSTS_COLORS[index % COSTS_COLORS.length] }
/ > )
)
}
< /Pie> <Tooltip contentStyle= {
{
background: " # 0f1 7 2a" , border: " 1px solid # 3 3 4 1 5 5 " }
}
labelStyle= {
{
color: " #e2e8f0 " }
}
itemStyle= {
{
color: " #e2e8f0 " }
}
formatter= {
(v, n)
= > [ ` $ $ {Number(v)
.toFixed ( 2 )
}
` , n] }
/ > <Legend wrapperStyle= {
{
color: " #e2e8f0 " }
}
/ > < /PieChart> < /ResponsiveContainer> < /div> < /Section > < /div> )
}
{
/ * Top productos * / }
<Section title= {
`Top productos ( $ {periodLabel}
)
` }
> <div className= "overflowxauto" > <table className= "w full text left" > <thead> <tr className= "text slate 3 0 0 text xs uppercase" > <th className= "py 2 border b border slate 7 0 0 " >Producto< /th> <th className= "py 2 border b border slate 7 0 0 " >Cantidad< /th> < /tr> < /thead> <tbody> {topProductos.map( (p)
= > ( <tr key= {p.producto}
className= "text slate 1 0 0 " > <td className= "py 2 border b border slate 8 0 0 " > {p.producto}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {p.qty}
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> < /Section > < /div> )
;
}