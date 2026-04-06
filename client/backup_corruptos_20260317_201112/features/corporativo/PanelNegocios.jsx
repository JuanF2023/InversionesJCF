// client/src/pages/corporativo/PanelNegocios.jsx import React, {
useMemo , useState, useEffect }
from "react" ;
import {
useNavigate }
from "React router dom" ;
import {
Plus, Pencil, Trash2 , X }
from "lucide React" ;
import {
useTheme }
from " . . / . . /context /ThemeContext.jsx" ;
import {
useCorporativo }
from " . /store/corporativoStore.js" ;
import {
AddBusinessModal, ConfirmModal, IdeasModal }
from " . . / . . /components/ui" ;
import {
formatFechaCortaISO, diffAniosMeses , humanizeYM }
from " . . / . . /utils/format.js" ;
import {
listBanks }
from " @ /features/corporativo/banks/api/banks.api.js" ;
// 閻?閸?缁? import preciso import {
createIdea, updateIdea, deleteIdea }
from " @ /features/corporativo/ideas/api/ideas.api.js" ;
/ * = = = = = = = = = = = = = = = = = = utils = = = = = = = = = = = = = = = = = = * / const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const money = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format(Number(n ? ? 0 )
)
;
/ * * Etiqueta de etapa a partir del estado crudo * / const etapaFromEstado = (estado)
= > {
const s = String(estado | | " " )
.toLowerCase( )
;
if (s = = = "activo" )
return "Activo" ;
if (s.includes( "constru " )
)
return "En construcci?n " ;
if (s = = = "idea" )
return "En idea" ;
return estado | | " ?? ;
}
;
// helper para filtrar negocios activos const isActivo = (n)
= > String(n? .estado ? ? n? .status ? ? n? .etapa ? ? " " )
.toLowerCase( )
= = = "activo" ;
/ * = = = = = = = = = = = = = = = = = = UI bits = = = = = = = = = = = = = = = = = = * / const EtapaBadge = ( {
etapa }
)
= > ( <span className= {cx( "status badge" , etapa = = = "Activo" ? "text emerald 7 0 0 dark:text emerald 3 0 0 " : etapa = = = "En construcci?n " ? "text amber 7 0 0 dark:text amber 3 0 0 " : "text sky 7 0 0 dark:text sky 3 0 0 " )
}
> {etapa}
< /span> )
;
const Donut = ( {
percent = 1 0 0 , size = 1 6 0 , label }
)
= > ( <div className= "donut relative" style= {
{
[ " size" ] : ` $ {size}px` , [ " value" ] : ` $ {percent }
% ` }
}
role= "img" aria label= {
`Avance $ {percent }
% ` }
> <span className= "donut_ _label" > {label ? ? ` $ {percent }
% ` }
< /span> < /div> )
;
/ * * Sub bloque compacto para las leyendas + barra * / function Legend( {
label, percent = 0 , dot = " # 1 0b9 8 1 " , bar = " # 1 0b9 8 1 " }
)
{
const pct = Math.max( 0 , Math.min( 1 0 0 , Number(percent )
| | 0 )
)
;
return ( <div> <div className= "flex items center justify between text sm mb 1 " > <span className= "inline flex items center gap 2 minw 0 " > <span aria hidden className= "inline block w 2 h 2 rounded full" style= {
{
background: dot }
}
/ > <span className= "truncate" > {label}
< /span> < /span> <span className= "font semibold shrink 0 " > {pct}
% < /span> < /div> <div className= "h 2 rounded full bg border overflow hidden" > <div className= "h full transition [width] duration 5 0 0 ease out" style= {
{
width: ` $ {pct}
% ` , background: bar }
}
/ > < /div> < /div> )
;
}
/ * * Tarjeta KPI ??Producci?n mensual (redise鐢?ada)
* / function ProductionCard ( {
total, pctActivos = 0 , pctConstruccion = 0 , Donut, className }
)
{
return ( <section className= {cx( "neo card neo card deep neo card tinted p 5 md:p 6 flex flex col justify between h full" , className )
}
aria labelledby= "kpi produccion title" > <div className= "flex flex col md:flex row md:items center md:justify between gap 6 " > <div className= "minw 0 " > <h3 id= "kpi produccion title" className= "text sm font semibold" > Producci?n mensual < /h3 > <div className= "mt 1 leading none" > <span className= "text [ 3 4px] md:text [ 3 8px] font extrabold tracking tight align baseline" > {money(total)
}
< /span> <span className= "ml 1 text [ 1 1px] font semibold subtle align top" >USD< /span> < /div> <div className= "text xs subtle mt 1 " > 閼?ltima actualizaci?n : hoy< /div> < /div> <div className= "flex items center justify center md:justify end" > <div className= "relative" > <Donut percent = {
1 0 0 }
size= {
1 8 0 }
label= " 1 0 0 % " / > < /div> < /div> < /div> <div className= "mt 6 grid grid cols 1 sm:grid cols 2 gap 4 " > <Legend label= "Activos " percent = {pctActivos}
dot= " # 1 0b9 8 1 " bar= " # 3 4d3 9 9 " / > <Legend label= "En construcci?n " percent = {pctConstruccion}
dot= " #f5 9e0b" bar= " #fbbf2 4 " / > < /div> < /section > )
;
}
/ * = = = = = = = = = = = = = = = = = = P?gina = = = = = = = = = = = = = = = = = = * / export default function PanelNegocios( )
{
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
const navigate = useNavigate( )
;
// Store (lecturas)
const production = useCorporativo ( (s)
= > s.monthlyProduction)
| | 0 ;
const base = useCorporativo ( (s)
= > s.base)
| | {
}
;
const bancosStore = useCorporativo ( (s)
= > s.bancos)
? ? [ ] ;
const negocios = useCorporativo ( (s)
= > s.negocios)
? ? [ ] ;
const ideas = useCorporativo ( (s)
= > s.ideas)
? ? [ ] ;
const propiedades = useCorporativo ( (s)
= > s.propiedades)
? ? [ ] ;
const cargarPropiedades = useCorporativo ( (s)
= > s.cargarPropiedades)
;
const loadingProps = useCorporativo ( (s)
= > s.loadingProps)
;
const propsLoaded = useCorporativo ( (s)
= > s.propsLoaded)
;
const bancosTotalFromStore = useCorporativo ( (s)
= > s.bancosTotal)
? ? 0 ;
// Store (acciones)
const loadDashboard = useCorporativo ( (s)
= > s.loadDashboard)
;
const setIdeasStore = useCorporativo ( (s)
= > s.setIdeas)
;
const upsertNegocio = useCorporativo ( (s)
= > s.upsertNegocio)
;
const setBancos = useCorporativo ( (s)
= > s.setBancos)
;
const addBank = useCorporativo ( (s)
= > s.addBank )
;
// Estado UI const [isAddBizOpen, setIsAddBizOpen] = useState(false)
;
const [openIdeas, setOpenIdeas] = useState(false)
;
const [editBiz , setEditBiz] = useState(null)
;
const [confirmDelIdeaOpen, setConfirmDelIdeaOpen ] = useState(false)
;
const [ideaToDelete, setIdeaToDelete] = useState(null)
;
const askDeleteIdea = (idea)
= > {
setIdeaToDelete(idea)
;
setConfirmDelIdeaOpen (true)
;
}
;
const [openIdeasList, setOpenIdeasList] = useState(false)
;
const [editingIdea, setEditingIdea ] = useState(null)
;
// KPIs de negocios (desde API con fallback)
const [kpisNegocios, setKpisNegocios] = useState(null)
;
// Toasts function useToasts(timeout = 2 5 0 0 )
{
const [toasts, setToasts] = useState( [ ] )
;
const show = (text)
= > {
const id = Math.random( )
.toString( 3 6 )
.slice( 1 )
;
setToasts( (prev)
= > [ . . .prev, {
id, text }
] )
;
setTimeout( ( )
= > setToasts( (prev)
= > prev.filter( (t)
= > t.id ! = = id)
)
, timeout )
;
}
;
const close = (id)
= > setToasts( (prev)
= > prev.filter( (t)
= > t.id ! = = id)
)
;
return {
toasts, show, close }
;
}
const {
toasts, show, close }
= useToasts( 2 5 0 0 )
;
/ * efectos * / useEffect( ( )
= > {
loadDashboard? . ( )
;
}
, [loadDashboard] )
;
useEffect( ( )
= > {
const ac = new AbortController( )
;
(async ( )
= > {
try {
const banks = await listBanks( {
signal: ac.signal }
)
.catch( ( )
= > [ ] )
;
setBancos? . (banks | | [ ] )
;
}
catch (e)
{
if (e? .name ! = = "CanceledError" & & e? .message ! = = "canceled" )
{
console .error( "Error listando bancos: " , e)
;
}
}
}
)
( )
;
return ( )
= > ac.abort( )
;
}
, [setBancos] )
;
useEffect( ( )
= > {
if (isAddBizOpen & & !propsLoaded & & !loadingProps)
cargarPropiedades? . ( )
;
}
, [isAddBizOpen, propsLoaded, loadingProps, cargarPropiedades] )
;
/ * KPIs derivados * / const activosCount = useMemo ( ( )
= > negocios.filter( (n)
= > String(n.estado ? ? n.status ? ? " " )
.toLowerCase( )
= = = "activo" )
.length, [negocios] )
;
const enConstruccionCount = useMemo ( ( )
= > negocios.filter( (n)
= > String(n.estado ? ? n.status ? ? " " )
.toLowerCase( )
= = = "en_construccion" )
.length, [negocios] )
;
// = = = Producci?n total (segura)
= = = const productionTotal = useMemo ( ( )
= > {
const baseVal = Number(base? .produccionMensual)
| | 0 ;
if (baseVal > 0 )
return baseVal ;
if (Number(production)
> 0 )
return Number(production)
;
const sum = (negocios | | [ ] )
.filter(isActivo)
.reduce( (acc, n)
= > {
const direct = Number(n? .produccionMensual ? ? n? .monthlyProduction ? ? 0 )
| | 0 ;
if (direct)
return acc + direct;
const arr = Array.isArray (n? .unidades ? ? n? .units)
? n? .unidades ? ? n? .units : [ ] ;
const subtotal = arr.reduce( (s, u)
= > s + (Number(u? .rentaMensual ? ? u? .monthlyRent)
| | 0 )
, 0 )
;
return acc + subtotal;
}
, 0 )
;
return sum;
}
, [production, base? .produccionMensual, negocios] )
;
const pctActivos = base? .activosPct ? ? (productionTotal > 0 ? 1 0 0 : 0 )
;
const pctConstruccion = base? .enConstruccionPct ? ? 0 ;
// = = = Bancos (seguros )
= = = const bancos = Array.isArray (bancosStore)
? bancosStore : [ ] ;
const bancosTotal = bancosTotalFromStore & & bancosTotalFromStore > 0 ? Number(bancosTotalFromStore)
: bancos.reduce( (acc, b)
= > acc + Number(b.currentBalance ? ? b.saldo ? ? 0 )
, 0 )
;
const topBank = bancos.length ? [ . . .bancos] .sort( (a, b)
= > Number(b.currentBalance ? ? b.saldo ? ? 0 )
Number(a.currentBalance ? ? a.saldo ? ? 0 )
)
[ 0 ] : null;
const avgBalance = bancos.length ? bancosTotal / bancos.length : 0 ;
/ * Helpers de render * / const bizName = (n)
= > n? .nombre ? ? n? .name ? ? n? .codigo ? ? n? .code ? ? `Negocio $ {n? .id ? ? " " }
` ;
const bizType = (n)
= > n? .tipoNombre ? ? n? .typeName ? ? " " ;
const bizCategory = (n)
= > n? .categoriaNombre ? ? n? .categoryName ? ? " " ;
const bizEstado = (n)
= > n? .estado ? ? n? .status ? ? " " ;
const bizPropertyId = (n)
= > String(n? .propiedadId ? ? n? .propertyId ? ? " " )
;
const bizMonthly = (n)
= > {
const direct = Number(n? .produccionMensual ? ? n? .monthlyProduction ? ? 0 )
| | 0 ;
if (direct)
return direct;
const arr = Array.isArray (n? .unidades ? ? n? .units)
? n? .unidades ? ? n? .units : [ ] ;
return arr.reduce( (s, u)
= > s + (Number(u? .rentaMensual ? ? u? .monthlyRent)
| | 0 )
, 0 )
;
}
;
const propNameById = useMemo ( ( )
= > {
const map = new Map( )
;
(propiedades | | [ ] )
.forEach ( (p)
= > map.set(String(p. _id ? ? p.id)
, p.nombre ? ? p.name ? ? " " )
)
;
return map;
}
, [propiedades] )
;
/ * KPI card local * / const KPI = ( {
label, value, pct, delta, extra }
)
= > {
const up = delta > 0 , down = delta < 0 ;
return ( <div className= {cx( isNeo ? "neo plate neo plate deep neo plate tinted strong raise neu strong" : "card neo card tinted raise neu strong" , "p 4 h full flex flex col" )
}
> <div className= "flex items center justify between " > <div className= "text xs subtle" > {label}
< /div> {delta ! = null & & ( <span className= {cx( "text [ 1 1px] font semibold rounded full px 2 py 0 . 5 ring 1 " , up & & "text emerald 6 0 0 dark:text emerald 3 0 0 ring emerald 3 0 0 / 4 0 " , down & & "text amber 6 0 0 dark:text amber 3 0 0 ring amber 3 0 0 / 4 0 " )
}
> {delta > 0 ? ` + $ {delta}
` : delta}
< /span> )
}
< /div> <div className= "mt 1 text 3xl font bold" > {value}
< /div> {pct ! = null & & ( < > <div className= "mt 3 h 2 rounded full overflow hidden bg border" role= "img" aria label= {
`Progreso $ {pct}
% ` }
> <div className= "h full" style= {
{
width: ` $ {pct}
% ` , background: "var( accent)
" }
}
/ > < /div> <div className= "mt 1 text xs subtle" > {pct}
% < /div> < / > )
}
{extra}
< /div> )
;
}
;
/ * render * / return ( <div data theme= {theme}
className= "bg bg text text p 4 md:p 6 rounded 2xl" > {
/ * Toasts * / }
<div className= "toast stack" aria live= "polite" aria atomic= "true" > {toasts.map( (t)
= > ( <div key= {t.id}
className= "toast neu" > <span className= "toast neu_ _accent" / > <span> {t.text}
< /span> <button className= "toast neu_ _close" onClick = {
( )
= > close(t.id)
}
aria label= "Cerrar toast" > <X size= {
1 6 }
/ > < /button> < /div> )
)
}
< /div> <div className= "w full spacey 6 " > <div> <h2 className= "h title" >Panel de Negocios< /h2 > <p className= "text sm subtle" >Estado global de tus negocios y administraci?n . < /p> < /div> {
/ * = = = LAYOUT PRINCIPAL = = = * / }
<div className= "grid gap 6 lg:grid cols 1 2 auto rows [minmax( 1 4 0px, _auto)
] " > {
/ * PRODUCCI閼?N * / }
<div className= "lg:col span 4 xl:col span 4 row span 2 " > <ProductionCard total= {productionTotal}
pctActivos= {pctActivos}
pctConstruccion= {pctConstruccion}
Donut= {Donut}
className= "h full" / > < /div> {
/ * NEGOCIOS * / }
<div className= "lg:col span 7 xl:col span 8 " > <div className= "neo card neo card deep neo card tinted p 4 md:p 5 h full flex flex col" > <div className= "mb 3 text sm font semibold" >Negocios< /div> <div className= "grid gap 3 md:gap 4 grid cols 1 sm:grid cols 2 xl:grid cols 4 auto rows fr" > <KPI label= "Negocios totales " value= {kpisNegocios? .total ? ? negocios.length}
/ > <KPI label= "Activos " value= {kpisNegocios? .activos ? ? activosCount}
pct= {base? .activosPct ? ? 0 }
/ > <KPI label= "En construcci?n " value= {kpisNegocios? .en_construccion ? ? enConstruccionCount}
pct= {base? .enConstruccionPct ? ? 0 }
/ > {
/ * En idea * / }
<div className= {cx( isNeo ? "neo plate neo plate deep neo plate tinted strong raise neu strong" : "card neo card tinted raise neu strong" , "kpi ideas card p 4 relative overflow hidden h full flex flex col" )
}
> <button onClick = {
( )
= > {
setEditingIdea (null)
;
setOpenIdeas(true)
;
}
}
className= "btn gradient btn action control md btn shimmer focus:outline none focus:ring 2 focus:ring accent/ 4 0 rounded full" title= "Agregar idea" aria label= "Agregar idea" style= {
{
position: "absolute" , top: 8 , right: 8 , zIndex: 2 0 }
}
> <Plus className= "btn icon" / > <span className= "hidden sm:inline ml 1 " >Idea< /span> < /button> <div className= "content block w full maxwnone minw 0 pt 1 2 md:pt 0 " > <div className= "text xs subtle" >En idea< /div> <div className= "mt 1 text 3xl font bold" > {ideas? .length ? ? 0 }
< /div> {Array.isArray (ideas)
& & ideas.length > 0 & & ( <div className= "mt 2 spacey 1 . 5 " > {
[ . . .ideas] .sort( (a, b)
= > new Date(a.createdAt | | 0 )
new Date(b.createdAt | | 0 )
)
.slice( 0 , 1 )
.map( (it, idx)
= > {
const titulo = it.titulo | | it.title | | " " ;
const detalle = it.detalle | | it.descripcion | | it.description | | " " ;
return ( <div key= {it.id | | it. _id | | idx}
className= "flex items center justify between gap 2 minw 0 group" > <div className= "minw 0 flex 1 " > <div className= "font semibold text sm truncate" title= {titulo}
> {titulo | | " ?? }
< /div> <div className= "text [ 1 2px] subtle truncate" style= {
{
whiteSpace: "nowrap" , overflow: "hidden" , textOverflow: "ellipsis" }
}
title= {detalle }
> {detalle }
< /div> < /div> <div className= "flex items center gap 1 opacity 0 group hover:opacity 1 0 0 transition opacity " > <button onClick = {
( )
= > {
setEditingIdea (it)
;
setOpenIdeas(true)
;
}
}
className= "text [ 1 2px] text emerald 6 0 0 hover:text emerald 7 0 0 focus:outline none" title= "Editar idea" aria label= "Editar idea" > <Pencil size= {
1 4 }
/ > < /button> <button onClick = {
( )
= > askDeleteIdea(it)
}
className= "text [ 1 2px] text rose 5 0 0 hover:text rose 6 0 0 focus:outline none" title= "Eliminar idea" aria label= "Eliminar idea" > <Trash2 size= {
1 4 }
/ > < /button> < /div> < /div> )
;
}
)
}
{ideas.length > 1 & & ( <button onClick = {
( )
= > setOpenIdeasList(true)
}
className= "text [ 1 2px] text accent hover:underline focus:outline none focus:ring 1 focus:ring accent/ 3 0 rounded px 1 " aria label= {
`Ver todas las $ {ideas.length}
ideas` }
title= {
`Ver todas las $ {ideas.length}
ideas` }
> + {ideas.length 1 }
m?s < /button> )
}
< /div> )
}
< /div> < /div> < /div> < /div> < /div> {
/ * Bancos * / }
<div className= "lg:col span 7 xl:col span 8 " > <div className= "neo card neo card deep neo card tinted p 4 h full flex flex col gap 3 " > <div className= "flex items start justify between gap 4 " > <div> <div className= "text sm subtle mb 1 " >Bancos< /div> <div className= "text 3xl md:text 4xl font extrabold" > {money(bancosTotal)
}
<span className= "text xs align middle" >USD< /span> < /div> <div className= "text xs subtle mt 1 " >Saldo total< /div> < /div> <div className= "flex flex col items end justify center text right gap 1 . 5 shrink 0 maxw [ 2 2 0px] " > <div> <div className= "text [ 1 1px] subtle" >Banco con mayor saldo< /div> <div className= "text base font semibold text text truncate" > {topBank ? ` $ {topBank .name | | topBank .bankName | | " ?? }
? $ {money(topBank .currentBalance | | topBank .saldo | | 0 )
}
` : " ?? }
< /div> < /div> <div> <div className= "text [ 1 1px] subtle" >Saldo promedio< /div> <div className= "text base font semibold text text" > {bancos.length > 0 ? money(avgBalance)
: " $ 0 . 0 0 " }
< /div> < /div> < /div> < /div> {bancos.length = = = 0 ? ( <div className= "rounded xl border border border bg white/ 4 0 dark:bg white/ 5 p 3 text sm subtle" > <div className= "font semibold text text mb 1 " >Sin cuentas registradas< /div> <div>Conecta un banco o agrega una cuenta manual. < /div> <div className= "mt 2 " > <button className= "btn tonal btn shimmer control md" onClick = {async ( )
= > {
const name = prompt( "Nombre del banco: " )
;
if ( !name)
return;
const country = prompt( "Pa?s (ISO 2 , ej. SV)
: " , "SV" )
| | "SV" ;
const balanceStr = prompt( "Saldo inicial (USD)
: " , " 0 " )
| | " 0 " ;
const balance = Number(balanceStr.replace ( / , /g, " " )
)
| | 0 ;
try {
const doc = await addBank ( {
name, country , balance }
)
;
show( `Banco " $ {doc.name}
" agregado con $ {money(doc.currentBalance )
}
?閸?)
;
}
catch (e)
{
console .error(e)
;
show( "No se pudo agregar el banco ?? )
;
}
}
}
> <span className= "text lg leading none mr 1 " > + < /span> Agregar cuenta < /button> < /div> < /div> )
: ( <div className= "spacey 2 overflow auto pr 1 maxh 4 0 md:maxh 4 4 " > {bancos.map( (b)
= > {
const bal = Number(b.currentBalance ? ? b.saldo ? ? 0 )
;
const pct = bancosTotal > 0 ? Math.round( (bal / bancosTotal)
* 1 0 0 )
: 0 ;
return ( <div key= {b. _id | | b.id | | b.name}
className= "group" > <div className= "flex items center justify between text xs mb 1 " > <span className= "truncate" > {b.name | | b.bankName | | " ?? }
< /span> <span className= "font medium" > {money(bal)
}
< /span> < /div> <div className= "h 1 . 5 rounded full bg border overflow hidden" > <div className= "h full" style= {
{
width: ` $ {Math.min( 1 0 0 , Math.max( 0 , pct)
)
}
% ` , background: "linear gradient( 9 0deg, var( accent)
, color mix(in srgb, var( accent)
6 0 % , transparent)
)
" , }
}
/ > < /div> < /div> )
;
}
)
}
< /div> )
}
<div className= "flex items center justify between text [ 1 1px] subtle" > <span>Distribuci?n por banco< /span> <span>Actualizado: hoy< /span> < /div> < /div> < /div> < /div> {
/ * Resumen de negocios * / }
<div className= "neo card neo card deep neo card tinted no clip p 4 md:p 5 " > <div className= "flex items center justify between mb 3 " > <div className= "text sm font semibold" >Resumen de negocios< /div> <button type= "button" onClick = {
( )
= > {
setEditBiz(null)
;
setIsAddBizOpen(true)
;
}
}
className= "btn gradient btn action control md btn shimmer " title= "Agregar negocio " > <Plus className= "btn icon" / > Agregar negocio < /button> < /div> <div className= "divide y divide border" > {negocios.map( (n)
= > {
const nombre = bizName (n)
;
const tipo = bizType (n)
;
const cat = bizCategory(n)
;
const etapa = etapaFromEstado(bizEstado(n)
)
;
const monthly = bizMonthly(n)
;
const propId = bizPropertyId(n)
;
const propName = propNameById.get(propId)
| | " ?? ;
return ( <div key= {n.id ? ? n. _id ? ? nombre}
className= "flex items center justify between py 3 " > <div className= "minw 0 flex items center gap 3 " > {n.bandera & & <img src= {n.bandera }
alt= {n.pais}
className= "w 6 h 4 rounded sm ring 1 ring border" / > }
<div className= "minw 0 " > <div className= "font medium truncate" > {nombre}
< /div> <div className= "text xs subtle truncate" > {tipo | | " ?? }
{cat ? ` ? $ {cat}
` : " " }
{propName ? ` ? $ {propName}
` : " " }
< /div> < /div> < /div> <div className= "hidden md:flex items center gap 6 " > <div className= "text sm subtle" > Prod. mensual : <span className= "font semibold text text" > {money(monthly )
}
< /span> < /div> {Number(n.produccionPotencial)
> 0 & & ( <div className= "text xs subtle" > Potencial: <span className= "font semibold text text" > {money(n.produccionPotencial)
}
< /span> < /div> )
}
<div className= "flex items center gap 2 " > <EtapaBadge etapa= {etapa}
/ > {etapa = = = "Activo" & & n.activoDesde & & ( ( )
= > {
const ym = diffAniosMeses (n.activoDesde)
;
return ( <span className= "text xs subtle" > {
" " }
desde <span className= "font semibold text text" > {formatFechaCortaISO(n.activoDesde)
}
< /span> {
" " }
<span className= "font semibold text text" > {humanizeYM(ym)
}
< /span> < /span> )
;
}
)
( )
}
< /div> < /div> <div className= "ml 4 flex items center gap 2 " > <button className= {cx( "icon btn ring 1 ring border" , isNeo ? "neo plate" : " " )
}
title= "Editar negocio " onClick = {
( )
= > {
setEditBiz(n)
;
setIsAddBizOpen(true)
;
}
}
aria label= {
`Editar negocio $ {nombre}
` }
> <Pencil size= {
1 6 }
/ > < /button> <button className= "btn tonal btn shimmer text sm" onClick = {
( )
= > {
if ( !propId)
return;
navigate( ` /corporativo/propiedades/ $ {propId}
/ingresos?negocioId= $ {n.id ? ? n. _id}
` )
;
}
}
title= "Abrir ingresos de la propiedad" > Abrir <svg width= " 1 6 " height= " 1 6 " viewBox = " 0 0 2 4 2 4 " className= "opacity 8 0 ml 1 " > <path d= "M9 5l7 7 7 7 " fill= "none" stroke= "currentColor" strokeWidth= " 2 " strokeLinecap= "round" strokeLinejoin = "round" / > < /svg> < /button> < /div> < /div> )
;
}
)
}
< /div> < /div> < /div> {
/ * Modales * / }
<IdeasModal open= {openIdeas}
onClose = {
( )
= > {
setOpenIdeas(false)
;
setEditingIdea (null)
;
}
}
initialData= {editingIdea ? ? undefined}
mode= {editingIdea ? "edit" : "create" }
onSave= {async (payload )
= > {
try {
if (editingIdea? .id | | editingIdea? . _id)
{
const saved = await updateIdea(editingIdea.id | | editingIdea. _id, payload )
;
setIdeasStore? . ( (prev = [ ] )
= > prev.map( (i)
= > ( (i.id | | i. _id)
= = = (saved.id | | saved. _id)
? saved : i)
)
)
;
show( "Idea actualizada ?? )
;
}
else {
const saved = await createIdea(payload )
;
setIdeasStore? . ( (prev = [ ] )
= > [ . . .prev, saved] )
;
show( "Idea guardada ?? )
;
}
}
catch (e)
{
console .error( "Error guardando idea" , e)
;
show( "No se pudo guardar la idea ?? )
;
}
finally {
setEditingIdea (null)
;
setOpenIdeas(false)
;
}
}
}
/ > <AddBusinessModal open= {isAddBizOpen}
onClose = {
( )
= > setIsAddBizOpen(false)
}
mode= {editBiz ? "edit" : "create" }
initialData= {editBiz ? ? undefined}
properties= {propiedades ? ? [ ] }
ensureProperties= {
( )
= > {
if ( !propsLoaded & & !loadingProps)
cargarPropiedades? . ( )
;
}
}
onSaved = {
(created )
= > {
upsertNegocio(created )
;
}
}
/ > <ConfirmModal open= {confirmDelIdeaOpen}
title= "Eliminar idea" message = {ideaToDelete ? ` ?Seguro que deseas eliminar la idea ?? {ideaToDelete.titulo}
?? ` : " ?Seguro que deseas eliminar esta idea? " }
onCancel= {
( )
= > {
setConfirmDelIdeaOpen (false)
;
setIdeaToDelete(null)
;
}
}
onConfirm= {async ( )
= > {
if ( !ideaToDelete)
return;
try {
await deleteIdea(ideaToDelete.id | | ideaToDelete. _id)
;
setIdeasStore? . ( (prev = [ ] )
= > prev.filter( (i)
= > (i.id | | i. _id)
! = = (ideaToDelete.id | | ideaToDelete. _id)
)
)
;
show( "Idea eliminada 妫?濡??? )
;
}
catch (err)
{
console .error( "Error al eliminar idea" , err)
;
show( "Error al eliminar idea ?? )
;
}
finally {
setIdeaToDelete(null)
;
setConfirmDelIdeaOpen (false)
;
}
}
}
/ > {openIdeasList & & ( <div className= "fixed inset 0 z [ 6 0 ] flex items center justify center" > <div className= "absolute inset 0 bg black/ 5 0 " onClick = {
( )
= > setOpenIdeasList(false)
}
aria hidden / > <div className= "relative neo card neo card deep neo card tinted p 4 md:p 6 w [ 9 2vw] maxw [ 7 0 0px] maxh [ 8 0vh] overflow hidden" > <div className= "flex items center justify between mb 2 " > <h3 className= "text lg font semibold" >Ideas ( {ideas? .length ? ? 0 }
)
< /h3 > <button className= "icon btn ring 1 ring border" onClick = {
( )
= > setOpenIdeasList(false)
}
aria label= "Cerrar" title= "Cerrar" > <X size= {
1 6 }
/ > < /button> < /div> <div className= "mt 2 overflowyauto pr 1 " style= {
{
maxHeight: " 6 0vh" }
}
> {
(ideas ? ? [ ] )
.slice( )
.sort( (b, a)
= > new Date(b.createdAt | | 0 )
new Date(a.createdAt | | 0 )
)
.map( (it)
= > {
const id = it.id | | it. _id;
const titulo = it.titulo | | it.title | | " " ;
const detalle = it.detalle | | it.descripcion | | it.description | | " " ;
const fecha = it.createdAt ? new Date(it.createdAt)
.toLocaleDateString( )
: " " ;
return ( <div key= {id}
className= "py 2 border b border border last:border none" > <div className= "flex items center justify between gap 3 " > <div className= "minw 0 flex 1 " > <div className= "font medium truncate" title= {titulo}
> {titulo | | " ?? }
< /div> <div className= "text [ 1 2px] subtle truncate" title= {detalle }
style= {
{
whiteSpace: "nowrap" , overflow: "hidden" , textOverflow: "ellipsis" }
}
> {detalle }
< /div> {fecha & & <div className= "text [ 1 1px] subtle mt 0 . 5 " > {fecha}
< /div> }
< /div> <div className= "flex items center gap 2 " > <button className= "btn tonal text [ 1 2px] " onClick = {
( )
= > {
setEditingIdea (it)
;
setOpenIdeasList(false)
;
setOpenIdeas(true)
;
}
}
title= "Editar idea" > Editar < /button> <button onClick = {
( )
= > askDeleteIdea(it)
}
className= "text rose 5 0 0 hover:text rose 6 0 0 " title= "Eliminar idea" > <Trash2 size= {
1 6 }
/ > < /button> < /div> < /div> < /div> )
;
}
)
}
< /div> <div className= "mt 4 flex items center justify end gap 2 " > <button className= "btn tonal" onClick = {
( )
= > setOpenIdeasList(false)
}
> Cerrar < /button> <button className= "btn gradient btn action" onClick = {
( )
= > {
setEditingIdea (null)
;
setOpenIdeasList(false)
;
setOpenIdeas(true)
;
}
}
> + Idea < /button> < /div> < /div> < /div> )
}
< /div> )
;
}