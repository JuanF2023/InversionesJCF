// client/src/features/corporativo/Propiedades/PropiedadesReportes.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
usePropertiesStore }
from " @ /features/corporativo/propiedades/store/properties.store.js" ;
import {
useUnitsStore }
from " @ /features/corporativo/propiedades/store/units.store.js" ;
import {
useIngresosStore }
from " @ /features/corporativo/indicadores/store/ingresos.store.js" ;
import {
ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip , Legend, CartesianGrid, LabelList, }
from "recharts" ;
/ * Helpers * / const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const money = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format(Number(n | | 0 )
)
;
const moneyShort = (v)
= > ` $ $ {Math.round(Number(v | | 0 )
/ 1 0 0 0 )
}k` ;
const MILESTONES = new Set( [ 0 , 5 , 1 0 , 1 5 ] )
;
const YEARS = 1 5 ;
const INFLACION = 0 . 0 4 ;
const DASH = " ?? ;
// Activa = empieza con "act" y NO contiene "vend" const isActiveEstado = (estado)
= > {
const e = String(estado | | " " )
.toLowerCase( )
.trim( )
;
if (e.includes( "vend" )
)
return false;
return / ^act/ .test(e)
;
}
;
// Valor actual: primero valores .valorActual, si no existe intenta valorHistorico 閻?ltimo const getValorActual = (p)
= > {
const v = p? .valores ? .valorActual;
if (v ! = = " " & & v ! = null)
return Number(v)
| | 0 ;
const last = [ . . . (p? .valorHistorico | | [ ] )
] .sort( (a, b)
= > new Date(b? .fecha | | 0 )
new Date(a? .fecha | | 0 )
)
[ 0 ] ;
return last ? Number(last.valor | | 0 )
: 0 ;
}
;
// ID can?nico (API)
: mongoId > _id > id > codigo const getApiId = (x)
= > {
const v = x? .mongoId ? ? x? . _id ? ? x? .id ? ? x? .codigo ? ? null;
return v ? String(v)
.trim( )
: " " ;
}
;
/ * Labels del "Total" con ajuste en bordes * / function makeMilestoneLabel(serie, {
fill = " # 1 1 1 8 2 7 " , stroke = "transparent" }
= {
}
)
{
return function MilestoneLabelSafe(props)
{
const {
x = 0 , y = 0 , value, index }
= props | | {
}
;
const yr = serie? . [index] ? .year;
if (yr = = null | | !MILESTONES.has(yr)
)
return null;
const firstIdx = 0 ;
const lastIdx = (serie? .length ? ? 1 )
1 ;
const dx = index = = = firstIdx ? 2 6 : index = = = lastIdx ? 1 4 : 0 ;
const anchor = index = = = firstIdx ? "start" : index = = = lastIdx ? "end" : "middle" ;
return ( <text x= {x + dx}
y= {y 8 }
textAnchor= {anchor}
fontSize= {
1 1 }
fill= {fill}
stroke= {stroke}
strokeWidth= {
2 }
paintOrder= "stroke" style= {
{
mixBlendMode: "normal" }
}
pointerEvents= "none" opacity = {
0 . 9 8 }
> {money(value)
}
< /text> )
;
}
;
}
/ * Vista principal * / export default function PropiedadesReportes( )
{
const {
theme }
= useTheme( )
;
// Tema (soporta m閻?ltiples "oscuros " Neo)
const prefersDark = typeof window ! = = "undefined" & & window.matchMedia? . ( " (prefers color scheme: dark)
" )
.matches ;
const themeLower = (theme | | " " )
.toLowerCase( )
;
const DARK_KEYWORDS = [ "dark" , "royal" , "dusk" , "graphite" , "ocean" , "plum" , "slate" , "navy" , "night" , "midnight" , "noir" , "charcoal" , "ink" , "obsidian" , "storm" , "shadow" , ] ;
const LIGHT_OVERRIDES = [ "stone" ] ;
const hasThemeName = themeLower.trim( )
.length > 0 ;
const isDarkByName = DARK_KEYWORDS.some( (k)
= > themeLower.includes(k)
)
;
const isLightOverride = LIGHT_OVERRIDES.some( (k)
= > themeLower.includes(k)
)
;
const isDark = hasThemeName ? isDarkByName & & !isLightOverride : prefersDark;
const axisColor = isDark ? " #E5E7EB" : " # 3 7 4 1 5 1 " ;
const gridAlpha = isDark ? 0 . 2 4 : 0 . 1 8 ;
const gridColor = isDark ? `rgba( 2 2 9 , 2 3 1 , 2 3 5 , $ {gridAlpha}
)
` : `rgba( 5 5 , 6 5 , 8 1 , $ {gridAlpha}
)
` ;
const tooltipStyle = {
backgroundColor: isDark ? "rgba( 1 7 , 2 4 , 3 9 , 0 . 9 )
" : "rgba( 2 5 5 , 2 5 5 , 2 5 5 , 0 . 9 5 )
" , border: ` 1px solid $ {isDark ? " # 3 7 4 1 5 1 " : " #E5E7EB" }
` , borderRadius: 8 , fontSize: 1 2 , }
;
const tickStroke = isDark ? "rgba( 0 , 0 , 0 , . 4 5 )
" : "rgba( 2 5 5 , 2 5 5 , 2 5 5 , . 4 5 )
" ;
const tickProps = {
fill: axisColor, stroke: tickStroke, strokeWidth: 0 . 5 }
;
const totalStroke = isDark ? " #FFFFFF" : " # 1 1 1 8 2 7 " ;
const labelFill = isDark ? " #FFFFFF" : axisColor;
const labelStroke = isDark ? "rgba( 0 , 0 , 0 , . 5 5 )
" : "rgba( 2 5 5 , 2 5 5 , 2 5 5 , . 5 5 )
" ;
// = = = = = Stores = = = = = const propiedadesAll = usePropertiesStore( (s)
= > s.propiedades)
| | [ ] ;
const propsLoaded = usePropertiesStore( (s)
= > s.loaded)
;
const propsLoading = usePropertiesStore( (s)
= > s.loading )
;
const cargarProps = usePropertiesStore( (s)
= > s.cargar)
;
const unidadesAll = useUnitsStore( (s)
= > s.items)
| | [ ] ;
const unitsLoaded = useUnitsStore( (s)
= > s.loaded)
;
const unitsLoading = useUnitsStore( (s)
= > s.loading )
;
const cargarUnits = useUnitsStore( (s)
= > s.cargar)
;
const ingresosAll = useIngresosStore( (s)
= > s.ingresos)
| | [ ] ;
const ingLoaded = useIngresosStore( (s)
= > s.loaded)
;
const ingLoading = useIngresosStore( (s)
= > s.loading )
;
const cargarIngresos = useIngresosStore( (s)
= > s.cargar)
;
useEffect( ( )
= > {
if ( !propsLoaded & & !propsLoading)
cargarProps( {
force: false }
)
;
if ( !unitsLoaded & & !unitsLoading)
cargarUnits( {
force: false }
)
;
if ( !ingLoaded & & !ingLoading)
cargarIngresos ( {
force: false }
)
;
}
, [ propsLoaded, propsLoading, cargarProps, unitsLoaded, unitsLoading, cargarUnits, ingLoaded, ingLoading, cargarIngresos , ] )
;
// Solo propiedades ACTIVAS const propiedades = useMemo ( ( )
= > (propiedadesAll | | [ ] )
.filter( (p)
= > isActiveEstado (p? .estado)
)
, [propiedadesAll ] )
;
// Columnas can?nicas: pid (key)
+ label (UI)
const propColumns = useMemo ( ( )
= > {
return (propiedades | | [ ] )
.map( (p)
= > {
const pid = getApiId(p)
;
if ( !pid)
return null;
return {
pid, label: p? .nombre | | `Propiedad $ {pid}
` , }
;
}
)
.filter(Boolean )
;
}
, [propiedades] )
;
// Set de ids activos (para filtrar unidades/ingresos)
const activeIds = useMemo ( ( )
= > new Set(propColumns.map( (c)
= > c.pid)
)
, [propColumns] )
;
/ * Totales por pa?s (solo activas )
* / const {
byCountry }
= useMemo ( ( )
= > {
const map = new Map( )
;
for (const p of propiedades)
{
const pid = getApiId(p)
;
const pais = p? .ubicacion? .pais | | p? .pais | | " ?? ;
const valor = getValorActual (p)
;
if ( !map.has(pais)
)
map.set(pais, {
inversion: null, valor: 0 , props: [ ] }
)
;
const row = map.get(pais)
;
row.valor + = valor;
row.props.push(p? .nombre | | `Propiedad $ {pid | | " " }
` )
;
}
return {
byCountry: map }
;
}
, [propiedades] )
;
/ * Inversi ?n y valor actual (por propiedad)
* / const costosValorPorProp = useMemo ( ( )
= > {
const rows = propColumns.map( (c)
= > {
const p = (propiedades | | [ ] )
.find( (x)
= > getApiId(x)
= = = c.pid)
;
return {
id: c.pid, nombre: c.label, inversion: null, valor: getValorActual (p)
, }
;
}
)
;
const totals = rows.reduce( (acc, r)
= > {
acc.valor + = r.valor | | 0 ;
return acc;
}
, {
inversion: null, valor: 0 }
)
;
return {
rows, totals }
;
}
, [propColumns, propiedades] )
;
/ * Proyecci?n de valor 1 5 a鐢?os * / const {
serieValor, coloresProp, sinCrecimientoValor }
= useMemo ( ( )
= > {
const bases = propColumns.map( (c)
= > {
const p = (propiedades | | [ ] )
.find( (x)
= > getApiId(x)
= = = c.pid)
;
return {
id: c.pid, nombre: c.label, base: getValorActual (p)
| | 0 , }
;
}
)
;
const palette = [ " # 6 0A5FA" , " # 3 4D3 9 9 " , " #F5 9E0B" , " #F8 7 1 7 1 " , " #A7 8BFA" , " # 0 6B6D4 " , " # 8 4CC1 6 " ] ;
const colorMap = {
}
;
bases.forEach ( (b, i)
= > (colorMap[b.id] = palette [i % palette .length] )
)
;
const serie = [ ] ;
for (let year = 0 ;
year < = YEARS;
year+ + )
{
const row = {
year }
;
let tot = 0 ;
for (const b of bases)
{
const val = b.base * Math.pow( 1 + INFLACION, year)
;
row[b.id] = val;
tot + = val;
}
row.total = tot;
serie.push(row)
;
}
const sinCrecimiento = bases.filter( (b)
= > b.base < = 0 )
;
return {
serieValor: serie, coloresProp: colorMap, sinCrecimientoValor: sinCrecimiento }
;
}
, [propColumns, propiedades] )
;
/ * Proyecci?n ingresos acumulados 1 . . 1 5 * / const projIngresos = useMemo ( ( )
= > {
const anualPorProp = new Map( )
;
(unidadesAll | | [ ] )
.forEach ( (u)
= > {
const pid = String(u? .propiedadId ? ? " " )
.trim( )
;
if ( !pid)
return;
if ( !activeIds.has(pid)
)
return;
// Si tu backend usa otro campo distinto a rentaMensual, aqu? es donde se ajusta. const rentaMensual = Number(u? .rentaMensual ? ? 0 )
;
const anual = rentaMensual * 1 2 ;
anualPorProp.set(pid, (anualPorProp.get(pid)
| | 0 )
+ anual)
;
}
)
;
const rows = Array.from( {
length: YEARS }
, ( _ , i)
= > i + 1 )
.map( (year)
= > {
const row = {
year, total: 0 }
;
propColumns.forEach ( (c)
= > {
const anual = anualPorProp.get(c.pid)
| | 0 ;
const acumulado = anual * year;
row[c.pid] = acumulado;
row.total + = acumulado;
}
)
;
return row;
}
)
;
const resumenAnual = propColumns.map( (c)
= > ( {
pid: c.pid, nombre: c.label, ingresoAnual: anualPorProp.get(c.pid)
| | 0 , }
)
)
;
const sinCrecIng = resumenAnual.filter( (r)
= > (r.ingresoAnual | | 0 )
< = 0 )
;
return {
rows, resumenAnual, sinCrecIngresos: sinCrecIng }
;
}
, [unidadesAll, activeIds, propColumns] )
;
/ * Hist?rico de ingresos (solo props activas )
* / const historialIngresos = useMemo ( ( )
= > {
const out = [ ] ;
for (const i of ingresosAll | | [ ] )
{
const pid = String(i? .propiedadId ? ? i? .propiedad ? ? i? .propId ? ? " " )
.trim( )
;
if ( !pid)
continue;
if ( !activeIds.has(pid)
)
continue;
const ym = i? .mes | | i? .periodo | | " " ;
const col = propColumns.find( (c)
= > c.pid = = = pid)
;
out.push( {
ym, week: i? .week ? ? i? .semana ? ? null, fecha: i? .fecha ? new Date(i.fecha)
: null, propiedadId: pid, propiedad: col? .label | | `Propiedad $ {pid}
` , unidad: i? .unidadId | | i? .unidad | | " ?? , ingreso : Number(i? .ingreso ? ? i? .monto ? ? 0 )
, }
)
;
}
return out.sort( (a, b)
= > String(a.ym)
.localeCompare(String(b.ym)
)
)
;
}
, [ingresosAll, activeIds, propColumns] )
;
// Altura din?mica del gr?fico const chartHeight = Math.min( 5 6 0 , Math.max( 3 4 0 , 2 2 0 + propColumns.length * 2 8 )
)
;
/ * Pivot ingresos * / const [groupBy , setGroupBy] = useState( "mes" )
;
// "mes" | "ano" | "semana" const [selectedKey, setSelectedKey ] = useState(null)
;
const columnasPivot = useMemo ( ( )
= > {
// Columnas visibles por nombre (UI)
const fromProps = propColumns.map( (c)
= > c.label)
;
const fromData = Array.from(new Set( (historialIngresos | | [ ] )
.map( (r)
= > r? .propiedad)
.filter(Boolean )
)
)
;
const uniq = [ . . .fromProps, . . .fromData] .filter( (v, i, a)
= > a.indexOf (v)
= = = i)
;
return uniq.map( (n)
= > ( {
id: n, nombre: n }
)
)
;
}
, [propColumns, historialIngresos] )
;
const buildPivot = useMemo ( ( )
= > {
return (mode)
= > {
const map = new Map( )
;
(historialIngresos | | [ ] )
.forEach ( (r)
= > {
const ym = String(r.ym | | " " )
;
let key;
if (mode = = = "ano" )
key = ym.slice( 0 , 4 )
;
else if (mode = = = "semana" )
key = r.week ! = null ? String(r.week)
: " " ;
else key = ym;
if ( !key)
return;
if ( !map.has(key)
)
map.set(key, {
key, label: key, byProp: {
}
, total: 0 }
)
;
const row = map.get(key)
;
const propName = r.propiedad | | `Propiedad $ {r.propiedadId | | " " }
` ;
const v = Number(r.ingreso | | 0 )
;
row.byProp[propName] = (row.byProp[propName] | | 0 )
+ v;
row.total + = v;
}
)
;
const rows = Array.from(map.values( )
)
.sort( (a, b)
= > String(a.key)
.localeCompare(String(b.key)
)
)
;
const totalsByProp = {
}
;
columnasPivot.forEach ( (c)
= > {
totalsByProp[c.id] = rows.reduce( (s, rr)
= > s + (rr.byProp[c.id] | | 0 )
, 0 )
;
}
)
;
const total = rows.reduce( (s, rr)
= > s + rr.total, 0 )
;
return {
rows, totalsByProp, total }
;
}
;
}
, [historialIngresos, columnasPivot] )
;
const pivot = useMemo ( ( )
= > buildPivot(groupBy )
, [buildPivot, groupBy ] )
;
const activeKey = selectedKey ? ? (pivot.rows[pivot.rows.length 1 ] ? .key ? ? null)
;
const filteredDetalle = useMemo ( ( )
= > {
if ( !activeKey)
return [ ] ;
return (historialIngresos | | [ ] )
.filter( (r)
= > {
const ym = String(r.ym | | " " )
;
if (groupBy = = = "ano" )
return ym.slice( 0 , 4 )
= = = String(activeKey)
;
if (groupBy = = = "semana" )
return String(r.week | | " " )
= = = String(activeKey)
;
return ym = = = String(activeKey)
;
}
)
;
}
, [historialIngresos, groupBy , activeKey] )
;
return ( <section className= "spacey 6 " data theme= {theme}
> <header> <p className= "text sm subtle" > Inversi ?n vs. valor actual por propiedad activa, proyecci?n de valor a 1 5 a鐢?os ( 4 % anual)
e ingresos (hist?rico y proyecci?n )
. < /p> < /header> {
/ * = = = = = DIV 1 = = = = = * / }
<div className= "neo card neo card deep neo card tinted p 4 spacey 4 " > <h3 className= "text base font semibold" >Inversi ?n , valor actual y proyecci?n < /h3 > <div className= "grid grid cols 1 xl:grid cols 1 2 gap 4 " > <aside className= "xl:col span 4 spacey 4 " > <div className= "neo card neo card deep neo card tinted p 4 " > <div className= "text sm font semibold mb 2 " >Por pa?s < /div> {
[ . . .byCountry.entries ( )
] .map( ( [pais, v] )
= > ( <div key= {pais}
className= "neo plate neo plate tinted p 3 rounded lg mb 2 " > <div className= "flex items center justify between " > <div className= "font semibold" > {pais}
< /div> <div className= "text xs subtle" > ( {v.props.length}
propiedades activas )
< /div> < /div> <div className= "grid grid cols 3 gap 2 mt 2 text sm" > <div> <div className= "subtle text xs" >Inversi ?n < /div> <div className= "font semibold" > {DASH}
< /div> < /div> <div> <div className= "subtle text xs" >Valor actual< /div> <div className= "font semibold" > {money(v.valor)
}
< /div> < /div> <div> <div className= "subtle text xs" >Ganancia< /div> <div className= "font semibold" > {DASH}
< /div> < /div> < /div> < /div> )
)
}
< /div> <div className= "neo card neo card deep neo card tinted p 4 " > <div className= "text sm font semibold mb 2 " >Inversi ?n y valor actual (por propiedad)
< /div> <div className= "overflow auto rounded lg ring 1 ring border" > <table className= "w full text sm" > <thead className= "bg [var( chip)
] " > <tr> <th className= "text left px 3 py 2 " >Nombre< /th> <th className= "text right px 3 py 2 " >Inversi ?n < /th> <th className= "text right px 3 py 2 " >Valor actual< /th> < /tr> < /thead> <tbody> {costosValorPorProp.rows.map( (r)
= > ( <tr key= {r.id}
className= "border t border [var( border)
] " > <td className= "px 3 py 2 " > {r.nombre}
< /td> <td className= "px 3 py 2 text right" > {DASH}
< /td> <td className= "px 3 py 2 text right" > {money(r.valor)
}
< /td> < /tr> )
)
}
< /tbody> <tfoot> <tr className= "border t border [var( border)
] font semibold" > <td className= "px 3 py 2 " >Totales < /td> <td className= "px 3 py 2 text right" > {DASH}
< /td> <td className= "px 3 py 2 text right" > {money(costosValorPorProp.totals.valor)
}
< /td> < /tr> < /tfoot> < /table> < /div> < /div> < /aside> <main className= "xl:col span 8 spacey 4 " > {
! !sinCrecimientoValor.length & & ( <div className= "neo plate neo plate tinted p 3 rounded lg" > <div className= "text sm font semibold mb 1 " >Atenci?n < /div> <div className= "text sm" > <span className= "subtle" >Sin crecimiento de valor (base = 0 )
: < /span> {sinCrecimientoValor.map( (p, i)
= > ( <span key= {p.id}
className= "inline block mr 2 " > {p.nombre}
{i < sinCrecimientoValor.length 1 ? " , " : " " }
< /span> )
)
}
< /div> < /div> )
}
<div className= "neo card neo card tinted neo card deep p 4 " > <div className= "text sm font semibold" >Proyecci?n de valor ( 1 5 a鐢?os, 4 % anual)
< /div> <div className= "text xs subtle mb 2 " >Labels en a鐢?os 0 , 5 , 1 0 y 1 5 (tooltip para el resto)
< /div> <div style= {
{
height: chartHeight }
}
> <ResponsiveContainer width= " 1 0 0 % " height= " 1 0 0 % " > <LineChart data= {serieValor}
margin= {
{
top: 1 6 , right: 4 8 , left: 4 4 , bottom: 2 0 }
}
> <CartesianGrid stroke= {gridColor}
strokeDasharray= " 3 3 " / > <XAxis dataKey = "year" ticks= {
[ 0 , 5 , 1 0 , 1 5 ] }
label= {
{
value: "A鐢?o " , position: "insideBottom" , offset: 4 , fill: axisColor }
}
tick= {tickProps}
axisLine= {
{
stroke: axisColor }
}
tickLine= {
{
stroke: axisColor }
}
/ > <YAxis tickFormatter= {moneyShort}
width= {
7 0 }
tick= {tickProps}
axisLine= {
{
stroke: axisColor }
}
tickLine= {
{
stroke: axisColor }
}
/ > <Tooltip formatter= {
(v)
= > money(v)
}
labelFormatter = {
(l)
= > `A鐢?o $ {l}
` }
contentStyle= {tooltipStyle}
itemStyle= {
{
color: axisColor }
}
labelStyle= {
{
color: axisColor }
}
/ > <Legend wrapperStyle= {
{
color: axisColor }
}
iconType= "plainline" / > {propColumns.map( (c)
= > ( <Line key= {c.pid}
type= "monotone" dataKey = {c.pid}
dot= {false}
stroke= {coloresProp[c.pid] }
strokeWidth= {
2 }
name= {c.label}
/ > )
)
}
<Line type= "monotone" dataKey = "total" dot= {false}
stroke= {totalStroke}
strokeWidth= {
3 . 2 5 }
name= "Total" > <LabelList content = {makeMilestoneLabel(serieValor, {
fill: labelFill, stroke: labelStroke }
)
}
/ > < /Line> < /LineChart> < /ResponsiveContainer> < /div> < /div> < /main> < /div> < /div> {
/ * = = = = = DIV 2 = = = = = * / }
<div className= "neo card neo card deep neo card tinted p 4 spacey 4 " > <h3 className= "text base font semibold" >Ingresos generados por propiedad< /h3 > <div className= "flex flex wrap gap 2 " > {projIngresos.resumenAnual.map( (r)
= > ( <span key= {r.pid}
className= "inline flex items center gap 2 px 2 py 0 . 5 rounded md neo plate text xs" > <b> {r.nombre}
: < /b> {money(r.ingresoAnual)
}
< /span> )
)
}
{
!projIngresos.resumenAnual.length & & <span className= "text sm subtle" >No hay ingresos configurados. < /span> }
< /div> <div className= "grid grid cols 1 xl:grid cols 1 2 gap 4 " > <aside className= "xl:col span 5 spacey 3 " > <div className= "flex items center justify between " > <div className= "text sm font semibold" >Resumen por periodo 閼? propiedad< /div> <div className= "inline flex gap 1 text xs" > {
[ {
k: "mes" , label: "Mes" }
, {
k: "ano" , label: "A鐢?o " }
, {
k: "semana" , label: "Semana" }
, ] .map( (opt)
= > ( <button key= {opt.k}
onClick = {
( )
= > {
setGroupBy(opt.k)
;
setSelectedKey (null)
;
}
}
className= {cx( "px 2 py 1 rounded md border" , groupBy = = = opt.k ? "neo plate font semibold" : "neo plate tinted subtle" )
}
> {opt.label}
< /button> )
)
}
< /div> < /div> <div className= "overflow auto rounded lg ring 1 ring border" > <table className= "w full text sm" > <thead className= "bg [var( chip)
] " > <tr> <th className= "text left px 3 py 2 w 3 6 " >Periodo < /th> {columnasPivot.map( (c)
= > ( <th key= {c.id}
className= "text right px 3 py 2 " > {c.nombre}
< /th> )
)
}
<th className= "text right px 3 py 2 " >Total< /th> < /tr> < /thead> <tbody> {pivot.rows.map( (r)
= > ( <tr key= {r.key}
className= {cx( "border t border [var( border)
] cursor pointer hover:bg [var( chip)
] / 6 0 " , activeKey = = = r.key ? "bg [var( chip)
] / 8 0 " : " " )
}
onClick = {
( )
= > setSelectedKey (r.key)
}
title= "Ver detalle a la derecha " > <td className= "px 3 py 2 " > {r.label}
< /td> {columnasPivot.map( (c)
= > ( <td key= {c.id}
className= "px 3 py 2 text right" > {money(r.byProp[c.id] | | 0 )
}
< /td> )
)
}
<td className= "px 3 py 2 text right font semibold" > {money(r.total)
}
< /td> < /tr> )
)
}
{
!pivot.rows.length & & ( <tr> <td className= "px 3 py 3 subtle" colSpan = {columnasPivot.length + 2 }
> {groupBy = = = "semana" ? "No hay semanas disponibles (tu dataset no trae 'week/semana' )
. " : "A閻?n no hay registros para este agrupamiento. " }
< /td> < /tr> )
}
< /tbody> {
! !pivot.rows.length & & ( <tfoot> <tr className= "border t border [var( border)
] font semibold" > <td className= "px 3 py 2 " >Totales < /td> {columnasPivot.map( (c)
= > ( <td key= {c.id}
className= "px 3 py 2 text right" > {money(pivot.totalsByProp[c.id] | | 0 )
}
< /td> )
)
}
<td className= "px 3 py 2 text right" > {money(pivot.total)
}
< /td> < /tr> < /tfoot> )
}
< /table> < /div> < /aside> <main className= "xl:col span 7 spacey 3 " > <div className= "text sm font semibold" > Detalle {groupBy = = = "mes" ? "del mes" : groupBy = = = "ano" ? "del a鐢?o " : "de la semana" }
{
" " }
<span className= "opacity 8 0 " > {activeKey | | " ?? }
< /span> < /div> <div className= "overflow auto rounded lg ring 1 ring border" > <table className= "w full text sm" > <thead className= "bg [var( chip)
] " > <tr> <th className= "text left px 3 py 2 " >Fecha< /th> <th className= "text left px 3 py 2 " >Propiedad< /th> <th className= "text left px 3 py 2 " >Unidad< /th> <th className= "text right px 3 py 2 " >Ingreso < /th> < /tr> < /thead> <tbody> {filteredDetalle.map( (r, idx)
= > ( <tr key= {
` $ {r.ym}
$ {idx}
` }
className= "border t border [var( border)
] " > <td className= "px 3 py 2 " > {r.fecha ? ` $ {r.fecha.getFullYear( )
}
$ {String(r.fecha.getMonth( )
+ 1 )
.padStart( 2 , " 0 " )
}
$ {String( r.fecha.getDate ( )
)
.padStart( 2 , " 0 " )
}
` : r.ym | | " ?? }
< /td> <td className= "px 3 py 2 " > {r.propiedad}
< /td> <td className= "px 3 py 2 " > {r.unidad}
< /td> <td className= "px 3 py 2 text right" > {money(r.ingreso )
}
< /td> < /tr> )
)
}
{
!filteredDetalle.length & & ( <tr> <td className= "px 3 py 3 subtle" colSpan = {
4 }
> No hay movimientos en el periodo seleccionado. < /td> < /tr> )
}
< /tbody> < /table> < /div> < /main> < /div> <div className= "neo card neo card tinted neo card deep p 4 " > <div className= "text sm font semibold mb 2 " >Hist?rico de ingresos (BD/Store)
< /div> {historialIngresos.length ? ( <div className= "overflow auto rounded lg ring 1 ring border" > <table className= "w full text sm" > <thead className= "bg [var( chip)
] " > <tr> <th className= "text left px 3 py 2 " >A鐢?o Mes< /th> <th className= "text left px 3 py 2 " >Propiedad< /th> <th className= "text left px 3 py 2 " >Unidad< /th> <th className= "text right px 3 py 2 " >Ingreso < /th> < /tr> < /thead> <tbody> {historialIngresos.map( (r, idx)
= > ( <tr key= {
` $ {r.ym}
$ {idx}
` }
className= "border t border [var( border)
] " > <td className= "px 3 py 2 " > {r.ym}
< /td> <td className= "px 3 py 2 " > {r.propiedad}
< /td> <td className= "px 3 py 2 " > {r.unidad}
< /td> <td className= "px 3 py 2 text right" > {money(r.ingreso )
}
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> )
: ( <div className= "text sm subtle" >A閻?n no hay registros. < /div> )
}
< /div> < /div> {
/ * = = = = = DIV 3 = = = = = * / }
<div className= "neo card neo card deep neo card tinted p 4 spacey 4 " > <h3 className= "text base font semibold" >Proyecci?n de ingresos por propiedad< /h3 > <div className= "neo card neo card tinted neo card deep p 4 " > <div className= "text sm font semibold" >Proyecci?n de ingresos acumulados ( 1 ?? 5 a鐢?os)
< /div> <div className= "text xs subtle mb 3 " >renta mensual 閼? 1 2 閼? a鐢?o < /div> <div className= "overflow auto rounded lg ring 1 ring border" > <table className= "w full text sm" > <thead className= "bg [var( chip)
] " > <tr> <th className= "text left px 3 py 2 " >A鐢?o < /th> {
/ * ??FIX: mostrar nombre, NO el id * / }
{propColumns.map( (c)
= > ( <th key= {c.pid}
className= "text right px 3 py 2 whitespace nowrap" > {c.label}
< /th> )
)
}
<th className= "text right px 3 py 2 " >TOT< /th> < /tr> < /thead> <tbody> {projIngresos.rows.map( (row)
= > ( <tr key= {row.year}
className= "border t border [var( border)
] " > <td className= "px 3 py 2 " > {row.year}
< /td> {propColumns.map( (c)
= > ( <td key= {c.pid}
className= "px 3 py 2 text right" > {money(row[c.pid] | | 0 )
}
< /td> )
)
}
<td className= "px 3 py 2 text right font semibold" > {money(row.total)
}
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> {
! !projIngresos.sinCrecIngresos.length & & ( <div className= "neo plate neo plate tinted p 3 rounded lg mt 3 " > <div className= "text sm" > <span className= "subtle" >Sin crecimiento de ingresos (ingreso anual = 0 )
: < /span> {projIngresos.sinCrecIngresos.map( (p, i)
= > ( <span key= {p.pid}
className= "inline block mr 2 " > {p.nombre}
{i < projIngresos.sinCrecIngresos.length 1 ? " , " : " " }
< /span> )
)
}
< /div> < /div> )
}
< /div> < /div> < /section > )
;
}