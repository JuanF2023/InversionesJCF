// src/pages/Restaurante/Informes/KpiFinancieros .jsx import React, {
useEffect, useMemo , useRef, useState, useId }
from "react" ;
import {
TrendingUp, CalendarRange, CalendarDays, Calendar }
from "lucide React" ;
//import {
useId }
from "react" ;
/ * Helpers de formato * / const currency = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format(n)
;
const pct = (n)
= > ` $ {
(n * 1 0 0 )
.toFixed ( 1 )
}
% ` ;
/ * Export: Excel con fallback CSV * / function rowsToCSV(rows)
{
const headers = [ "Periodo " , "Ventas" , "Costos" , "Utilidad" , " %Margen" ] ;
const lines = rows.map( (r)
= > [ r.label, r.ventas, r.costos, r.utilidad, r.ventas ? (r.utilidad / r.ventas)
* 1 0 0 : 0 , ] )
;
const all = [headers , . . .lines] ;
return all .map( (line)
= > line.map( (v)
= > (typeof v = = = "string" ? ` " $ {v.replace ( / " /g, ' " " ' )
}
" ` : v)
)
.join( " , " )
)
.join( " \n" )
;
}
function downloadCSV(filename, csv)
{
const blob = new Blob( [csv] , {
type: "text/csv;charset =utf 8 ;
" }
)
;
const a = document.createElement( "a" )
;
a.href = URL.createObjectURL(blob)
;
a.download = filename;
document.body.appendChild(a)
;
a.click( )
;
document.body.removeChild(a)
;
}
async function exportExcelOrCsv(filenameSafe, rows)
{
try {
const mod = await import( "xlsx" )
;
const XLSX = mod.default | | mod;
const data = rows.map( (r)
= > ( {
Periodo : r.label, Ventas: r.ventas, Costos: r.costos, Utilidad: r.utilidad, " %Margen" : r.ventas ? r.utilidad / r.ventas : 0 , }
)
)
;
const ws = XLSX.utils.json_to_sheet(data)
;
const wb = XLSX.utils.book_new( )
;
XLSX.utils.book_append_sheet(wb, ws, "Datos" )
;
const bin = XLSX.write(wb, {
type: "array" , bookType: "xlsx" }
)
;
const blob = new Blob( [bin] , {
type: "application/vnd.openxmlformats officedocument .spreadsheetml.sheet" , }
)
;
const a = document.createElement( "a" )
;
a.href = URL.createObjectURL(blob)
;
a.download = ` $ {filenameSafe}
.xlsx` ;
document.body.appendChild(a)
;
a.click( )
;
document.body.removeChild(a)
;
}
catch (e)
{
const csv = rowsToCSV(rows)
;
downloadCSV( ` $ {filenameSafe}
.csv` , csv)
;
}
}
/ * Mock de datos * / function randBetween(min, max)
{
return Math.random( )
* (max min)
+ min;
}
function makeTotals(items)
{
const ventas = items.reduce( (a, b)
= > a + b.ventas, 0 )
;
const costos = items.reduce( (a, b)
= > a + b.costos, 0 )
;
const utilidad = ventas costos;
const margen = ventas > 0 ? utilidad / ventas : 0 ;
return {
ventas, costos, utilidad, margen }
;
}
function daysInMonth(year, monthIndex0 )
{
return new Date(year, monthIndex0 + 1 , 0 )
.getDate ( )
;
}
function getWeekNumber(date)
{
const tmp = new Date(Date.UTC(date.getFullYear( )
, date.getMonth( )
, date.getDate ( )
)
)
;
const dayNum = tmp.getUTCDay( )
| | 7 ;
tmp.setUTCDate(tmp.getUTCDate( )
+ 4 dayNum)
;
const yearStart = new Date(Date.UTC(tmp.getUTCFullYear ( )
, 0 , 1 )
)
;
return Math.ceil( ( (tmp yearStart)
/ 8 6 4 0 0 0 0 0 + 1 )
/ 7 )
;
}
function buildMock( {
year, branch }
)
{
const now = new Date( )
;
const isCurrentYear = year = = = now.getFullYear( )
;
const monthIndex = now.getMonth( )
;
// trabajamos sobre el mes actual const days = isCurrentYear ? now.getDate ( )
: daysInMonth(year, monthIndex)
;
const branchFactor = 1 + (branch? .length | | 5 )
/ 2 0 ;
// D?a (mes actual)
const byDay = Array.from( {
length: days }
, ( _ , i)
= > {
const base = 2 0 0 * branchFactor + randBetween( 3 0 , 6 0 )
;
const ventas = Math.max( 0 , base + i * randBetween( 1 , 5 )
)
;
const costos = Math.max( 0 , ventas * randBetween( 0 . 4 , 0 . 7 )
)
;
return {
key: i + 1 , label: String(i + 1 )
.padStart( 2 , " 0 " )
, ventas, costos, utilidad: ventas costos, margen: ventas ? (ventas costos)
/ ventas : 0 , }
;
}
)
;
// Semana (hasta actual)
const lastDayDate = new Date(year, monthIndex, days)
;
const currentWeek = isCurrentYear ? getWeekNumber(lastDayDate)
: 5 2 ;
const byWeek = Array.from( {
length: currentWeek }
, ( _ , i)
= > {
const ventas = Math.max( 0 , 1 6 0 0 * branchFactor + randBetween( 3 0 0 , 6 0 0 )
+ i * randBetween( 1 0 , 4 0 )
)
;
const costos = Math.max( 0 , ventas * randBetween( 0 . 4 5 , 0 . 6 8 )
)
;
return {
key: i + 1 , label: `Semana $ {i + 1 }
` , ventas, costos, utilidad: ventas costos, margen: ventas ? (ventas costos)
/ ventas : 0 , }
;
}
)
;
// Mes (enero ??mes actual)
const monthsCount = isCurrentYear ? monthIndex + 1 : 1 2 ;
const monthNames = [ "Ene" , "Feb" , "Mar" , "Abr" , "May" , "Jun" , "Jul" , "Ago" , "Sep" , "Oct" , "Nov" , "Dic" ] ;
const byMonth = Array.from( {
length: monthsCount }
, ( _ , i)
= > {
const ventas = Math.max( 0 , 6 5 0 0 * branchFactor + randBetween( 1 2 0 0 , 1 8 0 0 )
+ i * randBetween( 5 0 , 1 2 0 )
)
;
const costos = Math.max( 0 , ventas * randBetween( 0 . 4 6 , 0 . 6 6 )
)
;
return {
key: i + 1 , label: monthNames[i] , ventas, costos, utilidad: ventas costos, margen: ventas ? (ventas costos)
/ ventas : 0 , }
;
}
)
;
// A鐢?o ( 閻?ltimos 5 )
const byYear = Array.from( {
length: 5 }
, ( _ , i)
= > {
const y = year 4 + i;
const ventas = Math.max( 0 , 7 8 0 0 0 * branchFactor + (i 1 )
* 1 5 0 0 + randBetween( 6 0 0 0 , 9 0 0 0 )
)
;
const costos = Math.max( 0 , ventas * randBetween( 0 . 4 8 , 0 . 6 5 )
)
;
return {
key: y, label: String(y)
, ventas, costos, utilidad: ventas costos, margen: ventas ? (ventas costos)
/ ventas : 0 , }
;
}
)
;
return {
byDay, byWeek, byMonth , byYear }
;
}
// Sparkline function Sparkline( {
values, height = 4 4 , strokeWidth = 2 }
)
{
const gid = useId( )
;
const max = Math.max( . . .values, 1 )
;
const min = Math.min( . . .values, 0 )
;
const span = max min | | 1 ;
const pts = values.map( (v, i)
= > {
const x = (i / (values.length 1 | | 1 )
)
* 1 0 0 ;
const y = 1 0 0 ( (v min)
/ span)
* 1 0 0 ;
return ` $ {x}
, $ {y}
` ;
}
)
;
return ( <svg viewBox = " 0 0 1 0 0 1 0 0 " preserveAspectRatio= "none" className= "w full" style= {
{
height }
}
> <defs> <linearGradient id= {
`fill $ {gid}
` }
x1 = " 0 " y1 = " 0 " x2 = " 0 " y2 = " 1 " > <stop offset= " 0 % " stopColor= "currentColor" stopOpacity= " 0 . 3 5 " / > <stop offset= " 1 0 0 % " stopColor= "currentColor" stopOpacity= " 0 " / > < /linearGradient > < /defs> <polyline points= {
` 0 , 1 0 0 $ {pts.join( " " )
}
1 0 0 , 1 0 0 ` }
fill= {
`url( #fill $ {gid}
)
` }
/ > <polyline points= {pts.join( " " )
}
fill= "none" stroke= "currentColor" strokeWidth= {strokeWidth}
strokeLinecap= "round" vectorEffect= "non scaling stroke" / * mantiene el grosor constante * / / > < /svg> )
;
}
/ * Tabla reusable * / function TableCard( {
title, subtitle, rows, searchTerm = " " }
)
{
const [sortKey , setSortKey] = useState( "key" )
;
const [sortDir , setSortDir] = useState( "asc" )
;
const scrollRef = useRef(null)
;
const filtered = useMemo ( ( )
= > {
const q = searchTerm.trim( )
.toLowerCase( )
;
if ( !q)
return rows;
return rows.filter( (r)
= > r.label.toLowerCase( )
.includes(q)
)
;
}
, [rows, searchTerm] )
;
const sorted = useMemo ( ( )
= > {
const arr = [ . . .filtered] ;
arr.sort( (a, b)
= > {
if (sortKey = = = "label" )
{
return sortDir = = = "asc" ? String(a.label)
.localeCompare(String(b.label)
)
: String(b.label)
.localeCompare(String(a.label)
)
;
}
if ( [ "ventas" , "costos" , "utilidad" ] .includes(sortKey )
)
{
return sortDir = = = "asc" ? a[sortKey ] b[sortKey ] : b[sortKey ] a[sortKey ] ;
}
if (sortKey = = = "margen" )
{
const av = a.ventas ? a.utilidad / a.ventas : 0 ;
const bv = b.ventas ? b.utilidad / b.ventas : 0 ;
return sortDir = = = "asc" ? av bv : bv av;
}
return sortDir = = = "asc" ? a.key b.key : b.key a.key;
}
)
;
return arr;
}
, [filtered, sortKey , sortDir ] )
;
// Autoscroll al final para ver lo m?s reciente + totales useEffect( ( )
= > {
if (scrollRef.current )
{
scrollRef.current .scrollTop = scrollRef.current .scrollHeight;
}
}
, [sorted] )
;
const totals = useMemo ( ( )
= > makeTotals(sorted)
, [sorted] )
;
const trend = useMemo ( ( )
= > sorted.map( (r)
= > r.utilidad)
, [sorted] )
;
const indicator = (k)
= > (sortKey = = = k ? (sortDir = = = "asc" ? " ?? : " ?? )
: " " )
;
const setSort = (k)
= > {
setSortDir( (prev)
= > (sortKey = = = k ? (prev = = = "asc" ? "desc" : "asc" )
: "asc" )
)
;
setSortKey(k)
;
}
;
const handleExport = ( )
= > {
const safe = title.replace ( / [ ^a zA Z0 9 \ _ ] + /g, " _ " )
;
exportExcelOrCsv(safe, sorted)
;
}
;
return ( <div className= " rounded 2xl p [ 1px] bg gradient to br from slate 5 0 0 / 4 0 via slate 3 0 0 / 1 0 to slate 6 0 0 / 4 0 shadow [ 0 _ 8px_ 2 4px_ 1 2px_rgba( 0 , 0 , 0 , 0 . 5 )
] " > <div className= "bg slate 9 0 0 / 8 0 rounded 2xl border border slate 7 0 0 / 7 0 ring 1 ring slate 6 0 0 / 2 5 p 4 flex flex col" > <div className= "flex items center justify between mb 3 " > <div> <h3 className= "text slate 1 0 0 font semibold" > {title}
< /h3 > {subtitle & & <p className= "text slate 4 0 0 text sm" > {subtitle}
< /p> }
< /div> <div className= "flex 1 minw 0 flex items center gap 3 justify end" > <div className= "hidden md:flex items center gap 3 w full justify end text indigo 3 0 0 " > <TrendingUp className= "w 4 h 4 flex shrink 0 " / > <div className= "w [ 6 0 % ] " > <Sparkline values= {trend}
height= {
4 4 }
strokeWidth= {
2 . 2 5 }
/ > < /div> < /div> < /div> < /div> <div className= "relative" > {
/ * fondo igual al de la tarjeta para evitar el ?濞?oble color?? * / }
<div ref= {scrollRef}
className= "maxh 6 4 overflow auto rounded lg bg slate 9 0 0 / 8 0 " > <table className= "w full text sm" > {
/ * mismo color que el contenedor;
antes era 9 0 0 / 9 5 * / }
<thead className= "sticky top 0 bg slate 9 0 0 / 8 0 backdrop blur z 1 0 border b border slate 7 0 0 / 6 0 " > <tr className= "text slate 3 0 0 " > <th className= "text left p 2 w 2 4 cursor pointer " onClick = {
( )
= > setSort ( "label" )
}
> Per?odo{indicator( "label" )
}
< /th> <th className= "text right p 2 cursor pointer " onClick = {
( )
= > setSort ( "ventas" )
}
> Ventas{indicator( "ventas" )
}
< /th> <th className= "text right p 2 cursor pointer " onClick = {
( )
= > setSort ( "costos" )
}
> Costos{indicator( "costos" )
}
< /th> <th className= "text right p 2 cursor pointer " onClick = {
( )
= > setSort ( "utilidad" )
}
> Utilidad{indicator( "utilidad" )
}
< /th> <th className= "text right p 2 cursor pointer " onClick = {
( )
= > setSort ( "margen" )
}
> % Margen{indicator( "margen" )
}
< /th> < /tr> < /thead> <tbody> {sorted.map( (r)
= > ( <tr key= {r.key}
className= "border b border slate 8 0 0 / 6 0 last:border none hover:bg slate 8 0 0 / 4 0 " > <td className= "p 2 text slate 2 0 0 " > {r.label}
< /td> <td className= "p 2 text right font medium text slate 1 0 0 " > {currency(r.ventas)
}
< /td> <td className= "p 2 text right text slate 2 0 0 " > {currency(r.costos)
}
< /td> <td className= {
`p 2 text right font semibold $ {r.utilidad > = 0 ? "text emerald 4 0 0 " : "text rose 4 0 0 " }
` }
> {currency(r.utilidad)
}
< /td> <td className= "p 2 text right text slate 1 0 0 " > {pct(r.margen)
}
< /td> < /tr> )
)
}
< /tbody> <tfoot> <tr className= "bg slate 9 0 0 / 8 0 " > <td className= "p 2 font semibold text slate 2 0 0 " >Totales < /td> <td className= "p 2 text right font semibold text slate 1 0 0 " > {currency(totals.ventas)
}
< /td> <td className= "p 2 text right font semibold text slate 1 0 0 " > {currency(totals.costos)
}
< /td> <td className= {
`p 2 text right font semibold $ {totals.utilidad > = 0 ? "text emerald 4 0 0 " : "text rose 4 0 0 " }
` }
> {currency(totals.utilidad)
}
< /td> <td className= "p 2 text right font semibold text slate 1 0 0 " > {pct(totals.margen)
}
< /td> < /tr> < /tfoot> < /table> < /div> < /div> < /div> < /div> )
;
}
/ * Vista principal KPI Financieros * / export default function KpiFinancieros ( {
branch, year, dateFrom, dateTo, searchTerm }
)
{
const [data, setData ] = useState( ( )
= > buildMock( {
year, branch }
)
)
;
useEffect( ( )
= > {
setData (buildMock( {
year, branch }
)
)
;
}
, [year, branch] )
;
const now = new Date( )
;
const monthIndex = now.getMonth( )
;
// Por d?a filtrado por rango (si existe)
const byDayFiltered = dateFrom & & dateTo ? data.byDay.filter( (d)
= > {
const date = new Date(year, monthIndex, Number(d.label)
)
;
return date > = new Date(dateFrom)
& & date < = new Date(dateTo)
;
}
)
: data.byDay;
// KPIs const kpiHoy = useMemo ( ( )
= > {
const last = byDayFiltered[byDayFiltered.length 1 ] ;
if ( !last)
return {
ventas: 0 , costos: 0 , utilidad: 0 , margen: 0 }
;
const margen = last.ventas ? last.utilidad / last.ventas : 0 ;
return {
ventas: last.ventas, costos: last.costos, utilidad: last.utilidad, margen }
;
}
, [byDayFiltered] )
;
const kpiSemana = useMemo ( ( )
= > {
const lastWeek = data.byWeek[data.byWeek.length 1 ] ;
if ( !lastWeek)
return {
ventas: 0 , costos: 0 , utilidad: 0 , margen: 0 }
;
const margen = lastWeek.ventas ? lastWeek.utilidad / lastWeek.ventas : 0 ;
return {
ventas: lastWeek.ventas, costos: lastWeek.costos, utilidad: lastWeek.utilidad, margen }
;
}
, [data.byWeek] )
;
const kpiMes = useMemo ( ( )
= > makeTotals(data.byMonth )
, [data.byMonth ] )
;
const kpiAnio = useMemo ( ( )
= > makeTotals(data.byYear)
, [data.byYear] )
;
// Estilos por tarjeta ( 0 =Hoy, 1 =Semana, 2 =Mes, 3 =A鐢?o )
const cardStyles = [ // HOY > estilo amarillo tipo KPI Generales (texto oscuro)
{
wrap: "bg gradient to br from amber 3 0 0 via amber 4 0 0 to amber 5 0 0 border amber 4 0 0 / 5 0 " , title: "text slate 9 0 0 " , badge: "text slate 8 0 0 bg white/ 3 0 " , label: "text slate 8 0 0 " , amount: "text slate 9 0 0 " , util: "text emerald 7 0 0 " , pct: "text slate 9 0 0 " , }
, // SEMANA > azul moderno {
wrap: "bg gradient to br from sky 6 0 0 to indigo 7 0 0 border white/ 1 0 " , title: "text white" , badge: "text white/ 8 0 bg white/ 1 0 " , label: "text white/ 8 0 " , amount: "text white" , util: "text emerald 2 0 0 " , pct: "text white" , }
, // MES > esmeralda/teal {
wrap: "bg gradient to br from emerald 6 0 0 to teal 7 0 0 border white/ 1 0 " , title: "text white" , badge: "text white/ 8 0 bg white/ 1 0 " , label: "text white/ 8 0 " , amount: "text white" , util: "text emerald 2 0 0 " , pct: "text white" , }
, // A閼?O > violeta /fucsia {
wrap: "bg gradient to br from violet 6 0 0 to fuchsia 7 0 0 border white/ 1 0 " , title: "text white" , badge: "text white/ 8 0 bg white/ 1 0 " , label: "text white/ 8 0 " , amount: "text white" , util: "text emerald 2 0 0 " , pct: "text white" , }
, ] ;
return ( <div className= "spacey 6 w full" > {
/ * Tarjetas KPI con degradados elegantes * / }
<section className= " grid gap 4 w full grid cols 2 sm:grid cols 2 xl:grid cols 4 max [ 3 8 0px] :grid cols 1 " > {
[ {
title: "Hoy (acumulado)
" , icon: <CalendarDays className= "w 4 h 4 " / > , totals: kpiHoy }
, {
title: "Semana (acumulado)
" , icon: <CalendarRange className= "w 4 h 4 " / > , totals: kpiSemana }
, {
title: "Mes (acumulado)
" , icon: <Calendar className= "w 4 h 4 " / > , totals: kpiMes }
, {
title: "A鐢?o (acumulado)
" , icon: <TrendingUp className= "w 4 h 4 " / > , totals: kpiAnio }
, ] .map( (c, idx)
= > {
const s = cardStyles[idx] | | cardStyles[ 1 ] ;
return ( <div key= {idx}
className= {
`rounded 2xl border p 3 sm:p 4 shadow sm hover:shadow md transition $ {s.wrap}
` }
> {
/ * Header compacto * / }
<div className= "flex items center justify between mb 2 minw 0 " > <span className= {
`inline flex items center gap 2 $ {s.title}
font semibold text sm sm:text base truncate` }
> {c.icon}
<span className= "truncate" > {c.title}
< /span> < /span> {
/ * Ocultar el chip en pantallas muy peque鐢?as * / }
<span className= {
`hidden sm:inline flex text [ 1 0px] px 2 py 0 . 5 rounded $ {s.badge}
` }
>acum. < /span> < /div> {
/ * M閼?tricas: 1 col < 3 8 0px, 2 cols > = 3 8 0px, 3 cols > =sm * / }
<div className= "grid gap 2 sm:gap 4 grid cols 1 min [ 3 8 0px] :grid cols 2 sm:grid cols 3 " > {
/ * VENTAS * / }
<div className= "minw 0 " > <div className= {
`text [ 1 0px] sm:text [ 1 1px] uppercase tracking wide $ {s.label}
` }
>Ventas< /div> <div className= {
`font semibold tabular nums leading tight break words text base sm:text lg md:text xl $ {s.amount}
` }
title= {currency(c.totals.ventas)
}
> {Math.abs(c.totals.ventas)
> = 1 0 0 0 0 0 ? new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" , notation: "compact " , maximumFractionDigits : 1 , }
)
.format(c.totals.ventas)
: currency(c.totals.ventas)
}
< /div> < /div> {
/ * UTILIDAD * / }
<div className= "minw 0 " > <div className= {
`text [ 1 0px] sm:text [ 1 1px] uppercase tracking wide $ {s.label}
` }
>Utilidad< /div> <div className= {
`font semibold tabular nums leading tight break words text base sm:text lg md:text xl $ {s.util}
` }
title= {currency(c.totals.utilidad)
}
> {Math.abs(c.totals.utilidad)
> = 1 0 0 0 0 0 ? new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" , notation: "compact " , maximumFractionDigits : 1 , }
)
.format(c.totals.utilidad)
: currency(c.totals.utilidad)
}
< /div> < /div> {
/ * % MARGEN * / }
<div className= "minw 0 " > <div className= {
`text [ 1 0px] sm:text [ 1 1px] uppercase tracking wide $ {s.label}
` }
> % Margen< /div> <div className= {
`font semibold tabular nums leading tight break words text base sm:text lg md:text xl $ {s.pct}
` }
> {pct(c.totals.margen)
}
< /div> < /div> < /div> < /div> )
;
}
)
}
< /section > {
/ * Tablas: usan todo el ancho, autoscroll al final * / }
<section className= "grid grid cols 1 lg:grid cols 2 gap 5 w full" > <TableCard title= "Por D?a (mes actual)
" subtitle= "Listado de d?as transcurridos" rows= {byDayFiltered}
searchTerm= {searchTerm}
/ > <TableCard title= "Por Semana" subtitle= "Semanas 1 a la actual" rows= {data.byWeek}
searchTerm= {searchTerm}
/ > <TableCard title= "Por Mes (a鐢?o actual)
" subtitle= "Enero al mes actual" rows= {data.byMonth }
searchTerm= {searchTerm}
/ > <TableCard title= "Por A鐢?o " subtitle= "Hist?rico 閻?ltimos 5 a鐢?os" rows= {data.byYear}
searchTerm= {searchTerm}
/ > < /section > < /div> )
;
}