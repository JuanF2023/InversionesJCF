import React, {
useMemo , useState }
from "react" ;
import {
CalendarDays, Printer , CheckCircle2 , HandCoins, ShieldCheck, Search, RefreshCcw, Info, ChevronLeft, Banknote, BadgeCheck, ReceiptText, }
from "lucide React" ;
import DepositoModal from " . . / . . /components/ui/modals/DepositoModal" ;
/ * = = = = = = = = = Identidad (multi restaurante)
= = = = = = = = = * / const BRAND = {
empresa : "Grupo Restaurante 0 1 " , restaurante: "Restaurante 0 1 " , sucursal: "Sucursal Chaparral" , dispositivo: " # 1 " , nit: " " , telefono: " " , }
;
/ * = = = = = = = = = = = = Utils = = = = = = = = = = = = * / const ahoraLegible = ( )
= > new Intl.DateTimeFormat ( "es ES" , {
dateStyle: "medium" , timeStyle: "short" }
)
.format( new Date( )
)
;
const currency = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format( +n | | 0 )
;
const hoyISO = ( )
= > new Date( )
.toISOString( )
.slice( 0 , 1 0 )
;
const addDays = (iso, delta)
= > {
const d = new Date(iso)
;
d.setDate (d.getDate ( )
+ delta)
;
return d.toISOString( )
.slice( 0 , 1 0 )
;
}
;
// Comparaci?n segura por string ISO const inRange = (d, start, end)
= > d > = start & & d < = end;
const eachDateInRange = (start, end)
= > {
const days = [ ] ;
let d = new Date(start)
;
const endD = new Date(end)
;
while (d < = endD)
{
days.push(d.toISOString( )
.slice( 0 , 1 0 )
)
;
d.setDate (d.getDate ( )
+ 1 )
;
}
return days;
}
;
const loadState = (k, fb)
= > {
try {
const s = localStorage.getItem (k)
;
return s ? JSON.parse(s)
: fb;
}
catch {
return fb;
}
}
;
const saveState = (k, v)
= > {
try {
localStorage.setItem (k, JSON.stringify(v)
)
;
}
catch {
}
}
;
/ * = = = = = = = = = = = = Mock = = = = = = = = = = = = * / const HOY = hoyISO( )
;
const AYER = addDays (HOY, 1 )
;
// Usuarios disponibles (para poder listar ?濞?in ventas?? const MOCK_USUARIOS = [ {
id: "u1 " , nombre: "Juan P閼?rez" }
, {
id: "u2 " , nombre: "Ana L?pez" }
, {
id: "u3 " , nombre: "Luis D?az" }
, {
id: "u4 " , nombre: "Mar?a G?mez" }
, {
id: "u5 " , nombre: "Pedro Ru?z " }
, ] ;
const USUARIOS_MAP = new Map(MOCK_USUARIOS.map( (u)
= > [u.id, u.nombre] )
)
;
// Turnos programados por d?a (para que la lista muestre tambi閼?n sin ventas)
const TURNOS_X_DIA = {
[HOY] : [ "u1 " , "u2 " , "u3 " , "u4 " , "u5 " ] , [AYER] : [ "u2 " , "u3 " , "u4 " ] , // ejemplo }
;
const MOCK_ORDENES = [ // Hoy {
id: "ORD0 0 1 " , fecha: HOY, hora: " 0 9 : 1 5 " , usuarioId: "u1 " , usuario : "Juan P閼?rez" , mesa: " 2 " , total: 1 8 . 7 5 , pago: "efectivo" , efectivo: 1 8 . 7 5 , tarjeta : 0 , status: "cerrada " , }
, {
id: "ORD0 0 2 " , fecha: HOY, hora: " 1 1 : 4 0 " , usuarioId: "u2 " , usuario : "Ana L?pez" , mesa: " 1 " , total: 2 6 . 5 , pago: "tarjeta " , efectivo: 0 , tarjeta : 2 6 . 5 , status: "cerrada " , }
, {
id: "ORD0 0 3 " , fecha: HOY, hora: " 1 3 : 0 5 " , usuarioId: "u1 " , usuario : "Juan P閼?rez" , mesa: " 4 " , total: 1 2 . 0 , pago: "mixto" , efectivo: 7 . 0 , tarjeta : 5 . 0 , status: "cerrada " , }
, {
id: "ORD0 0 4 " , fecha: HOY, hora: " 1 4 : 2 0 " , usuarioId: "u3 " , usuario : "Luis D?az" , mesa: " 3 " , total: 9 . 0 , pago: "efectivo" , efectivo: 9 . 0 , tarjeta : 0 , status: "abierta " , }
, // Ayer {
id: "ORD1 0 1 " , fecha: AYER, hora: " 1 0 : 1 0 " , usuarioId: "u2 " , usuario : "Ana L?pez" , mesa: " 1 " , total: 1 5 . 0 , pago: "efectivo" , efectivo: 1 5 . 0 , tarjeta : 0 , status: "cerrada " , }
, {
id: "ORD1 0 2 " , fecha: AYER, hora: " 1 2 : 3 0 " , usuarioId: "u3 " , usuario : "Luis D?az" , mesa: " 5 " , total: 3 2 . 0 , pago: "mixto" , efectivo: 1 0 . 0 , tarjeta : 2 2 . 0 , status: "cerrada " , }
, ] ;
/ * = = = = = = = = = = = = Componente = = = = = = = = = = = = * / export default function ReportesSalida ( )
{
const [desde, setDesde] = useState(HOY)
;
const [hasta, setHasta] = useState(HOY)
;
const [busqueda, setBusqueda] = useState( " " )
;
const [seleccion, setSeleccion] = useState( {
}
)
;
// {
usuarioId: true }
const [filtroEstado, setFiltroEstado] = useState( "pendientes" )
;
// 'todas' | 'pendientes' | 'liquidadas' const [incluirSinVentas, setIncluirSinVentas] = useState(true)
;
// "YYYY MM DD: :usuarioId" = > true const [estadoLiquidaciones, setEstadoLiquidaciones] = useState( ( )
= > loadState( "liq_usd" , {
}
)
)
;
// Caja del gerente const [managerLedger, setManagerLedger] = useState( ( )
= > loadState( "manager _ledger_v2 " , {
cashOnHand: 0 , deposits: [ ] }
)
)
;
const [confirmTipo, setConfirmTipo ] = useState(null)
;
// 'gerente ' | 'empleados' const [depositoOpen, setDepositoOpen] = useState(false)
;
const [depDesde, setDepDesde] = useState(addDays (HOY, 3 0 )
)
;
const [depHasta, setDepHasta] = useState(HOY)
;
/ * = = = = = = = = = Filtros = = = = = = = = = * / const ordenesFiltradas = useMemo ( ( )
= > {
const base = MOCK_ORDENES .filter( (o)
= > inRange (o.fecha, desde, hasta)
)
;
if ( !busqueda.trim( )
)
return base;
const q = busqueda.toLowerCase( )
;
return base.filter( (o)
= > o.usuario .toLowerCase( )
.includes(q)
| | o.id.toLowerCase( )
.includes(q)
| | o.mesa.toLowerCase( )
.includes(q)
| | o.pago.toLowerCase( )
.includes(q)
| | o.status.toLowerCase( )
.includes(q)
)
;
}
, [desde, hasta, busqueda] )
;
/ * = = = = = = = = = Agregaci?n (por usuario , por d?a )
= = = = = = = = = * / const {
porUsuario, porUsuarioFiltrado, byUserByDate }
= useMemo ( ( )
= > {
const byUD = new Map( )
;
// userId > date > dayAgg for (const o of ordenesFiltradas)
{
if ( !byUD.has(o.usuarioId)
)
byUD.set(o.usuarioId, new Map( )
)
;
const dmap = byUD.get(o.usuarioId)
;
if ( !dmap.has(o.fecha)
)
dmap.set(o.fecha, {
usuario : o.usuario , abiertas: 0 , cerradas: 0 , efectivo: 0 , tarjeta : 0 , total: 0 , }
)
;
const day = dmap.get(o.fecha)
;
if (o.status = = = "abierta " )
day.abiertas + = 1 ;
else {
day.cerradas + = 1 ;
day.efectivo + = o.efectivo | | 0 ;
day.tarjeta + = o.tarjeta | | 0 ;
day.total + = (o.efectivo | | 0 )
+ (o.tarjeta | | 0 )
;
}
}
// Base: solo usuarios con ?rdenes en el rango const list = [ ] ;
for (const [userId, dmap] of byUD.entries ( )
)
{
let abiertas = 0 , cerradas = 0 , efectivo = 0 , tarjeta = 0 , total = 0 , pendientesDias = 0 ;
let usuarioNombre = " " ;
for (const [date, day] of dmap.entries ( )
)
{
usuarioNombre = day.usuario | | usuarioNombre;
abiertas + = day.abiertas;
cerradas + = day.cerradas;
efectivo + = day.efectivo;
tarjeta + = day.tarjeta ;
total + = day.total;
const key = ` $ {date}
: : $ {userId}
` ;
if (day.cerradas > 0 & & !estadoLiquidaciones[key] )
pendientesDias + = 1 ;
}
list.push( {
usuarioId: userId, usuario : usuarioNombre, abiertas, cerradas, efectivo, tarjeta , total, noLiquidadas: pendientesDias , liquidado: pendientesDias = = = 0 , // incluye $ 0 }
)
;
}
// Extra: incluir usuarios programados en el rango aunque no vendan if (incluirSinVentas)
{
const dias = eachDateInRange(desde, hasta)
;
const programados = new Set( )
;
dias.forEach ( (d)
= > (TURNOS_X_DIA[d] | | [ ] )
.forEach ( (uid)
= > programados.add(uid)
)
)
;
const yaEnLista = new Set(list.map( (u)
= > u.usuarioId)
)
;
for (const uid of programados)
{
if (yaEnLista.has(uid)
)
continue;
list.push( {
usuarioId: uid, usuario : USUARIOS_MAP.get(uid)
| | uid, abiertas: 0 , cerradas: 0 , efectivo: 0 , tarjeta : 0 , total: 0 , noLiquidadas: 0 , liquidado: true, // Liquidado ( $ 0 )
}
)
;
}
}
const ordenados = list.sort( (a, b)
= > a.usuario .localeCompare(b.usuario )
)
;
// Filtro de estado para la tabla const filtrar = (arr)
= > {
if (filtroEstado = = = "pendientes" )
return arr.filter( (u)
= > u.noLiquidadas > 0 )
;
if (filtroEstado = = = "liquidadas" )
return arr.filter( (u)
= > u.liquidado)
;
return arr;
}
;
return {
porUsuario: ordenados, porUsuarioFiltrado: filtrar (ordenados)
, byUserByDate: byUD, }
;
}
, [ordenesFiltradas, estadoLiquidaciones, incluirSinVentas, desde, hasta, filtroEstado] )
;
/ * = = = = = = = = = Totales que SIGUEN la tabla = = = = = = = = = * / const totalesVista = useMemo ( ( )
= > {
const t = {
abiertas: 0 , cerradas: 0 , efectivo: 0 , tarjeta : 0 , total: 0 }
;
for (const u of porUsuarioFiltrado)
{
t.abiertas + = u.abiertas;
t.cerradas + = u.cerradas;
t.efectivo + = u.efectivo;
t.tarjeta + = u.tarjeta ;
t.total + = u.total;
}
return t;
}
, [porUsuarioFiltrado] )
;
const hayAbiertas = totalesVista.abiertas > 0 ;
// Usuarios elegibles visibles para "Liquidar con gerente " const elegiblesEnVista = useMemo ( ( )
= > porUsuarioFiltrado.filter( (u)
= > u.abiertas = = = 0 & & u.noLiquidadas > 0 )
, [porUsuarioFiltrado] )
;
/ * = = = = = = = = = Helpers = = = = = = = = = * / const setRangoAyer = ( )
= > {
setDesde(AYER)
;
setHasta(AYER)
;
setSeleccion( {
}
)
;
}
;
const setRangoHoy = ( )
= > {
setDesde(HOY)
;
setHasta(HOY)
;
setSeleccion( {
}
)
;
}
;
const toggleSeleccionTodos = ( )
= > {
const lista = porUsuarioFiltrado;
const allSelected = lista.every( (u)
= > u.liquidado | | u.abiertas > 0 | | ! !seleccion[u.usuarioId] )
;
if (allSelected)
setSeleccion( {
}
)
;
else {
const next = {
}
;
lista.forEach ( (u)
= > {
if (u.abiertas = = = 0 & & u.noLiquidadas > 0 )
next[u.usuarioId] = true;
}
)
;
setSeleccion(next)
;
}
}
;
const toggleSeleccion = (id)
= > setSeleccion( (p)
= > ( {
. . .p, [id] : !p[id] }
)
)
;
/ * = = = = = = = = = Liquidaciones = = = = = = = = = * / const liquidarUsuarios = (usuariosIds)
= > {
let sumaEfectivo = 0 ;
const next = {
. . .estadoLiquidaciones }
;
for (const userId of usuariosIds)
{
const dmap = byUserByDate.get(userId)
;
if ( !dmap)
continue;
for (const [date, day] of dmap.entries ( )
)
{
if ( !inRange (date, desde, hasta)
)
continue;
const key = ` $ {date}
: : $ {userId}
` ;
if (day.cerradas > 0 & & !next[key] )
{
next[key] = true;
// marcar liquidado ese d?a sumaEfectivo + = day.efectivo;
// sumar EFECTIVO de ese d?a }
}
}
setEstadoLiquidaciones(next)
;
saveState( "liq_usd" , next)
;
if (sumaEfectivo > 0 )
{
setManagerLedger( (prev)
= > {
const upd = {
. . .prev, cashOnHand: (prev.cashOnHand | | 0 )
+ sumaEfectivo }
;
saveState( "manager _ledger_v2 " , upd)
;
return upd;
}
)
;
}
}
;
const onLiquidarGerente = ( )
= > setConfirmTipo ( "gerente " )
;
const confirmarLiquidarGerente = ( )
= > {
const idsElegiblesVisibles = elegiblesEnVista.map( (u)
= > u.usuarioId)
;
if ( !idsElegiblesVisibles.length)
{
setConfirmTipo (null)
;
return;
}
liquidarUsuarios(idsElegiblesVisibles)
;
setSeleccion( {
}
)
;
setConfirmTipo (null)
;
setTimeout( ( )
= > window.print( )
, 5 0 )
;
}
;
const onLiquidarSeleccionados = ( )
= > setConfirmTipo ( "empleados" )
;
const confirmarLiquidarSeleccionados = ( )
= > {
const elegidos = Object.entries (seleccion)
.filter( ( [ _ , v] )
= > v)
.map( ( [id] )
= > id)
;
if ( !elegidos.length)
return setConfirmTipo (null)
;
liquidarUsuarios(elegidos)
;
setSeleccion( {
}
)
;
setConfirmTipo (null)
;
}
;
/ * = = = = = = = = = Print = = = = = = = = = * / const imprimirReporte = ( )
= > {
window.print( )
;
// imprime todo lo visible }
;
const imprimirTurnoUsuario = (u)
= > {
const dmap = byUserByDate.get(u.usuarioId)
| | new Map( )
;
let efectivoPend = 0 , cerradasPend = 0 ;
for (const [date, day] of dmap.entries ( )
)
{
const key = ` $ {date}
: : $ {u.usuarioId}
` ;
if (inRange (date, desde, hasta)
& & day.cerradas > 0 & & !estadoLiquidaciones[key] )
{
efectivoPend + = day.efectivo;
cerradasPend + = day.cerradas;
}
}
const logoTxt = (BRAND.restaurante | | "R" )
.split( / \s+ / )
.map( (s)
= > s[ 0 ] )
.slice( 0 , 2 )
.join( " " )
.toUpperCase( )
;
const reportId = "RS " + new Date( )
.toISOString( )
.replace ( / [ ^ \d] /g, " " )
.slice( 0 , 1 4 )
;
const emision = ahoraLegible( )
;
const html = ` < !doctype html> <html> <head> <meta charset = "utf 8 " / > <title>Resumen $ {u.usuario }
< /title> <style> :root {
amber: #f5 9e0b;
muted: # 6b7 2 8 0 ;
line: #e5e7eb;
}
* {box sizing:border box}
body{font family:ui sans serif,system ui, apple system,Segoe UI,Roboto;
color: # 0 0 0 ;
background: #fff;
padding : 2 4px;
}
.head{display :flex;
gap: 1 6px;
justify content :space between ;
align items:center;
border: 2px solid var( amber)
;
border radius: 1 4px;
padding : 1 4px 1 6px;
margin bottom: 1 4px;
}
.brand{display :flex;
gap: 1 2px;
align items:center;
}
.logo{width: 5 2px;height: 5 2px;border radius: 5 0 % ;
border: 2px solid var( amber)
;
display :flex;align items:center;justify content :center;
font weight: 8 0 0 ;
font size: 1 8px;
}
.ttls{line height: 1 . 1 5 }
.empresa {font size: 1 2px;
color:var( muted)
;
}
.rs{font size: 1 6px;
font weight: 8 0 0 ;
}
.suc{font size: 1 3px;
color:var( muted)
;
}
.meta{display :grid;
grid template columns :auto auto;
gap: 6px 1 4px;
align items:center;
}
.meta .k{color:var( muted)
;
font size: 1 2px;
}
.meta .v{font weight: 7 0 0 ;
font size: 1 3px;
}
hr.sep{border: 0 ;
border top: 1px dashed var( line)
;
margin: 1 4px 0 ;
}
h1 {margin: 0 0 6px;
font size: 1 8px;
}
.muted{color:var( muted)
}
.kpi{display :flex;
flex wrap:wrap;
gap: 1 4px;
margin: 1 2px 0 1 8px;
}
.card{border: 1px solid var( line)
;
border radius: 1 2px;
padding : 1 2px 1 4px;
min width: 1 8 0px;
}
.cash{border color: #f5 9e0b;
background: #fff8eb;
}
.big{font size: 2 2px;
font weight: 8 0 0 ;
}
.label{color:var( muted)
;
font size: 1 2px;
}
.row{display :flex;
justify content :space between ;
margin: 4px 0 ;
}
.strong{font weight: 7 0 0 ;
}
.footer{margin top: 2 8px;
display :flex;
gap: 2 4px;
flex wrap:wrap}
.sig{width: 2 4 0px;
border top: 1px solid #aaa;
text align:center;
padding top: 6px;
}
@media print {
body{padding : 0 . 6in;
}
}
< /style> < /head> <body> <header class= "head" > <div class= "brand" > <div class= "logo" > $ {logoTxt }
< /div> <div class= "ttls" > $ {BRAND.empresa ? ` <div class= "empresa " > $ {BRAND.empresa }
< /div> ` : " " }
<div class= "rs" > $ {BRAND.restaurante}
< /div> <div class= "suc" > $ {BRAND.sucursal}
< /div> < /div> < /div> <div class= "meta" > <div class= "k" >Reporte < /div> <div class= "v" > $ {reportId}
< /div> <div class= "k" >Emisi?n < /div> <div class= "v" > $ {emision }
< /div> <div class= "k" >Rango< /div> <div class= "v" > $ {desde}
?? $ {hasta}
< /div> <div class= "k" >Servidor(a)
< /div> <div class= "v" > $ {u.usuario }
$ {u.usuarioId ? " ( " + u.usuarioId + " )
" : " " }
< /div> <div class= "k" >Dispositivo< /div> <div class= "v" > $ {BRAND.dispositivo | | " " }
< /div> $ {BRAND.nit ? ` <div class= "k" >NIT< /div> <div class= "v" > $ {BRAND.nit}
< /div> ` : " " }
$ {BRAND.telefono ? ` <div class= "k" >Tel閼?fono< /div> <div class= "v" > $ {BRAND.telefono}
< /div> ` : " " }
< /div> < /header> <h1 >Resumen de ventas del turno< /h1 > <div class= "muted" >Este documento sirve para liquidaci?n de caja por turno. < /div> <hr class= "sep" / > <div class= "kpi" > <div class= "card cash" > <div class= "label" >Efectivo a liquidar< /div> <div class= "big" > $ $ {efectivoPend.toFixed ( 2 )
}
< /div> < /div> <div class= "card" > <div class= "label" >Tarjeta (total rango)
< /div> <div class= "big" > $ $ {u.tarjeta .toFixed ( 2 )
}
< /div> < /div> <div class= "card" > <div class= "label" >Total (rango)
< /div> <div class= "big" > $ $ {u.total.toFixed ( 2 )
}
< /div> < /div> < /div> <div class= "row" > <span class= "label" > 閼?rdenes cerradas pendientes en el rango< /span> <span class= "strong" > $ {cerradasPend}
< /span> < /div> <div class= "row" > <span class= "label" > 閼?rdenes abiertas (rango)
< /span> <span class= "strong" > $ {u.abiertas}
< /span> < /div> <div class= "footer" > <div class= "sig" >Servidor(a)
< /div> <div class= "sig" >Gerente < /div> <div class= "sig" >Cajero(a)
< /div> < /div> <script>window.print( )
;
< /script> < /body> < /html> ` ;
const w = window.open( " " , " _blank" , "width= 7 2 0 ,height= 9 0 0 " )
;
w.document.write(html)
;
w.document.close( )
;
}
;
/ * = = = = = = = = = Dep?sitos = = = = = = = = = * / const abrirDeposito = ( )
= > {
if ( (managerLedger.cashOnHand | | 0 )
< = 0 )
return;
setDepositoOpen(true)
;
}
;
const confirmarDeposito = (payload )
= > {
setManagerLedger( (prev)
= > {
const cash = Math.max( 0 , (prev.cashOnHand | | 0 )
Number(payload .monto | | 0 )
)
;
const deposits = [ . . . (prev.deposits | | [ ] )
, {
. . .payload }
] ;
const next = {
cashOnHand: cash, deposits }
;
saveState( "manager _ledger_v2 " , next)
;
return next;
}
)
;
setDepositoOpen(false)
;
}
;
const depositosFiltrados = useMemo ( ( )
= > {
const arr = [ . . . (managerLedger.deposits | | [ ] )
] .filter( (d)
= > inRange (d.fechaAbono, depDesde, depHasta)
)
.sort( (a, b)
= > new Date(b.fechaAbono)
new Date(a.fechaAbono)
)
;
return arr;
}
, [managerLedger, depDesde, depHasta] )
;
return ( <div className= "spacey 6 " > {
/ * Encabezado * / }
<div className= "flex flex col md:flex row md:items center md:justify between gap 3 " > <div> <h1 className= "text yellow 3 0 0 text 2xl font bold" >Reportes ??Liquidaci?n por rango< /h1 > < /div> <div className= "flex items center gap 2 " > <button onClick = {
( )
= > setBusqueda( " " )
}
className= "inline flex items center gap 2 px 4 py 2 rounded xl bg slate 8 0 0 border border slate 6 0 0 text slate 2 0 0 hover:bg slate 7 0 0 " > <RefreshCcw size= {
1 8 }
/ > Refrescar < /button> <button onClick = {imprimirReporte}
title= "Imprimir reporte (todo lo visible )
" className= "inline flex items center gap 2 px 4 py 2 rounded xl border bg blue 6 0 0 / 2 0 border blue 5 0 0 text blue 1 0 0 hover:bg blue 6 0 0 / 3 0 " > <Printer size= {
1 8 }
/ > Imprimir reporte < /button> < /div> < /div> {
/ * Filtros * / }
<div className= "bg [ # 1 2 1b2f] border border slate 7 0 0 rounded 2xl p 4 spacey 3 " > <div className= "flex flex wrap items center gap 2 " > <div className= "flex items center gap 2 bg slate 8 0 0 border border slate 6 0 0 rounded xl px 3 py 2 " > <CalendarDays size= {
1 6 }
className= "text slate 3 0 0 " / > <input type= "date" value= {desde}
onChange= {
(e)
= > {
setDesde(e.target.value)
;
setSeleccion( {
}
)
;
}
}
className= "bg transparent outline none text slate 1 0 0 " / > < /div> <div className= "flex items center gap 2 bg slate 8 0 0 border border slate 6 0 0 rounded xl px 3 py 2 " > <CalendarDays size= {
1 6 }
className= "text slate 3 0 0 " / > <input type= "date" value= {hasta}
onChange= {
(e)
= > {
setHasta(e.target.value)
;
setSeleccion( {
}
)
;
}
}
className= "bg transparent outline none text slate 1 0 0 " / > < /div> <div className= "ml auto flex items center gap 2 " > <button onClick = {setRangoAyer}
className= "inline flex items center gap 2 px 3 py 2 rounded xl bg slate 8 0 0 border border slate 6 0 0 text slate 2 0 0 hover:bg slate 7 0 0 " > <ChevronLeft size= {
1 6 }
/ > Ayer < /button> <button onClick = {setRangoHoy}
className= "inline flex items center gap 2 px 3 py 2 rounded xl bg slate 8 0 0 border border slate 6 0 0 text slate 2 0 0 hover:bg slate 7 0 0 " > Hoy < /button> < /div> < /div> <div className= "grid grid cols 1 md:grid cols 3 gap 2 " > <div className= "md:col span 2 flex items center gap 2 bg slate 8 0 0 border border slate 6 0 0 rounded xl px 3 py 2 " > <Search size= {
1 6 }
className= "text slate 3 0 0 " / > <input placeholder= "Usuario , ID de orden, mesa, tipo de pago o estado?? value= {busqueda}
onChange= {
(e)
= > {
setBusqueda(e.target.value)
;
setSeleccion( {
}
)
;
}
}
className= "bg transparent outline none text slate 1 0 0 flex 1 " / > < /div> {
/ * Estado + incluir sin ventas * / }
<div className= "flex items center gap 3 " > <div className= "flex items center gap 2 bg slate 8 0 0 border border slate 6 0 0 rounded xl px 3 py 2 flex 1 " > <span className= "text slate 3 0 0 text sm" >Estado< /span> <select value= {filtroEstado}
onChange= {
(e)
= > {
setFiltroEstado(e.target.value)
;
setSeleccion( {
}
)
;
}
}
className= "bg transparent text slate 1 0 0 outline none flex 1 " > {
/ * Forzamos contraste de las opciones * / }
<option className= "text slate 9 0 0 bg white" value= "todas" > Todas < /option> <option className= "text slate 9 0 0 bg white" value= "pendientes" > Pendientes < /option> <option className= "text slate 9 0 0 bg white" value= "liquidadas" > Liquidadas < /option> < /select> < /div> <label className= "inline flex items center gap 2 text slate 3 0 0 text sm" > <input type= "checkbox" className= "accent yellow 4 0 0 " checked = {incluirSinVentas}
onChange= {
(e)
= > {
setIncluirSinVentas(e.target.checked )
;
setSeleccion( {
}
)
;
}
}
/ > Incluir sin ventas < /label> < /div> < /div> < /div> {
/ * KPIs (siguen la tabla)
* / }
<div className= "grid grid cols 1 sm:grid cols 4 gap 3 " > <div className= {
`rounded 2xl p 4 border $ {hayAbiertas ? "bg [ # 2a1 3 2 0 ] border rose 6 0 0 / 6 0 " : "bg [ # 1 2 1b2f] border slate 7 0 0 " }
` }
> <div className= "flex items center gap 2 text slate 3 0 0 text sm" > <ReceiptText size= {
1 6 }
/ > 閼?rdenes (abiertas / cerradas)
< /div> <div className= "mt 1 flex items baseline gap 2 " > <span className= {
`text 2xl font extrabold tabular nums $ {hayAbiertas ? "text rose 3 0 0 " : "text slate 1 0 0 " }
` }
> {totalesVista.abiertas}
< /span> <span className= "text slate 4 0 0 text lg" > / {totalesVista.cerradas}
< /span> < /div> {hayAbiertas & & ( <p className= "mt 1 text rose 3 0 0 text xs" >Hay ?rdenes abiertas en el rango. < /p> )
}
< /div> <KpiCard label= "Total vendido " value= {currency(totalesVista.total)
}
/ > <KpiCard label= "Efectivo" value= {currency(totalesVista.efectivo)
}
/ > <KpiCard label= "Tarjeta " value= {currency(totalesVista.tarjeta )
}
/ > < /div> {
/ * Indicadores del gerente (acumulado real, no siguen la tabla)
* / }
<div className= "grid grid cols 1 sm:grid cols 2 gap 3 " > <IndicatorCard icon= {
<HandCoins size= {
1 8 }
/ > }
title= "Efectivo en caja del gerente " value= {currency(managerLedger.cashOnHand)
}
gradient= "from amber 6 0 0 / 2 0 to amber 4 0 0 / 1 0 " ring= "ring amber 5 0 0 / 3 0 " / > <IndicatorCard icon= {
<Banknote size= {
1 8 }
/ > }
title= "Abonos a banco (acumulado)
" value= {currency( (managerLedger.deposits | | [ ] )
.reduce( (a, d)
= > a + Number(d.monto | | 0 )
, 0 )
)
}
gradient= "from emerald 6 0 0 / 2 0 to emerald 4 0 0 / 1 0 " ring= "ring emerald 5 0 0 / 3 0 " / > < /div> {
/ * Acciones * / }
<div className= "flex flex wrap items center gap 2 " > <button onClick = {toggleSeleccionTodos}
className= "px 4 py 2 rounded xl bg slate 8 0 0 border border slate 6 0 0 text slate 2 0 0 hover:bg slate 7 0 0 " disabled= {porUsuarioFiltrado.length = = = 0 }
> Seleccionar / Limpiar < /button> <button onClick = {onLiquidarGerente}
className= "inline flex items center gap 2 px 4 py 2 rounded xl bg amber 6 0 0 / 2 0 border border amber 5 0 0 text amber 1 0 0 hover:bg amber 6 0 0 / 3 0 " disabled= {elegiblesEnVista.length = = = 0 | | hayAbiertas}
title= "Liquidar efectivo (de los usuarios elegibles visibles)
y pasarlo a caja del gerente " > <HandCoins size= {
1 8 }
/ > Liquidar con gerente (cash)
< /button> <button onClick = {onLiquidarSeleccionados}
className= {
`inline flex items center gap 2 px 4 py 2 rounded xl border $ {porUsuarioFiltrado.length = = = 0 | | Object.keys(seleccion)
.filter( (k)
= > seleccion[k] )
.length = = = 0 | | hayAbiertas ? "bg slate 7 0 0 border slate 6 0 0 text slate 4 0 0 cursor not allowed " : "bg green 6 0 0 / 2 0 border green 5 0 0 text green 1 0 0 hover:bg green 6 0 0 / 3 0 " }
` }
disabled= {
porUsuarioFiltrado.length = = = 0 | | Object.keys(seleccion)
.filter( (k)
= > seleccion[k] )
.length = = = 0 | | hayAbiertas }
title= {
hayAbiertas ? "No se puede liquidar: hay ?rdenes abiertas en el rango" : "Liquidar turno(s)
seleccionado(s)
" }
> <ShieldCheck size= {
1 8 }
/ > Liquidar turno(s)
seleccionado(s)
< /button> < /div> {
/ * Tabla * / }
<div className= "bg [ # 1 2 1b2f] border border slate 7 0 0 rounded 2xl p 4 overflowxauto print:bg white print:text black print:border 0 " > <div className= "mb 3 text slate 4 0 0 text sm flex items center gap 2 " > <Info size= {
1 6 }
/ > La tabla respeta el rango y el filtro de estado. ?濞?ncluir sin ventas??agrega filas programadas sin ventas. < /div> <table className= "minwfull text sm" > <thead className= "text slate 3 0 0 " > <tr> <th className= "text left py 2 border b border slate 7 0 0 w 1 0 print:w 6 " >Sel< /th> <th className= "text left py 2 border b border slate 7 0 0 " >Usuario < /th> <th className= "text right py 2 border b border slate 7 0 0 " >Abiertas< /th> <th className= "text right py 2 border b border slate 7 0 0 " >Cerradas< /th> <th className= "text right py 2 border b border slate 7 0 0 " >Efectivo< /th> <th className= "text right py 2 border b border slate 7 0 0 " >Tarjeta < /th> <th className= "text right py 2 border b border slate 7 0 0 " >Total< /th> <th className= "text center py 2 border b border slate 7 0 0 " >Imprimir< /th> <th className= "text center py 2 border b border slate 7 0 0 " >Estado< /th> < /tr> < /thead> <tbody className= "text slate 2 0 0 " > {porUsuarioFiltrado.map( (u)
= > {
const disabledCheck = u.abiertas > 0 | | u.noLiquidadas = = = 0 ;
const noPuedeImprimir = u.abiertas > 0 | | u.noLiquidadas > 0 | | u.liquidado;
const tooltip = u.abiertas > 0 ? "No se puede imprimir: ?rdenes abiertas" : u.noLiquidadas > 0 ? "No se puede imprimir: ventas pendientes de liquidar" : u.liquidado ? "No se puede imprimir: turno ya liquidado" : "Imprimir resumen de turno" ;
return ( <tr key= {u.usuarioId}
className= "hover:bg slate 8 0 0 / 5 0 " > <td className= "py 2 " > <input type= "checkbox" className= "scale 1 1 0 accent yellow 4 0 0 print:hidden" onChange= {
( )
= > toggleSeleccion(u.usuarioId)
}
checked = {
! !seleccion[u.usuarioId] }
disabled= {disabledCheck}
title= {
u.abiertas > 0 ? "Tiene ?rdenes abiertas" : u.noLiquidadas = = = 0 ? "Nada pendiente por liquidar en el rango" : " " }
/ > < /td> <td className= "py 2 " > {u.usuario }
< /td> <td className= {
`py 2 text right tabular nums $ {u.abiertas > 0 ? "text rose 3 0 0 font semibold" : " " }
` }
> {u.abiertas}
< /td> <td className= "py 2 text right tabular nums" > {u.cerradas}
< /td> <td className= "py 2 text right tabular nums" > {currency(u.efectivo)
}
< /td> <td className= "py 2 text right tabular nums" > {currency(u.tarjeta )
}
< /td> <td className= "py 2 text right font semibold tabular nums" > {currency(u.total)
}
< /td> <td className= "py 2 text center" > <button onClick = {
( )
= > imprimirTurnoUsuario(u)
}
disabled= {noPuedeImprimir}
title= {tooltip }
className= {
`inline flex items center gap 1 px 3 py 1 . 5 rounded lg border $ {noPuedeImprimir ? "bg slate 7 0 0 border slate 6 0 0 text slate 4 0 0 cursor not allowed " : "bg blue 6 0 0 / 2 0 border blue 5 0 0 text blue 1 0 0 hover:bg blue 6 0 0 / 3 0 " }
` }
> <Printer size= {
1 6 }
/ > Imprimir < /button> < /td> <td className= "py 2 text center" > {u.liquidado ? ( <span className= "inline flex items center gap 1 text green 3 0 0 " > <CheckCircle2 size= {
1 6 }
/ > {u.cerradas = = = 0 ? "Liquidado ( $ 0 )
" : "Liquidado" }
< /span> )
: ( <span className= "text amber 3 0 0 " >Pendiente ( {u.noLiquidadas}
)
< /span> )
}
< /td> < /tr> )
;
}
)
}
{
!porUsuarioFiltrado.length & & ( <tr> <td colSpan = {
9 }
className= "py 6 text center text slate 4 0 0 " > No hay datos para el filtro seleccionado. < /td> < /tr> )
}
< /tbody> < /table> < /div> {
/ * Caja del gerente / Dep?sitos * / }
<div className= "spacey 3 " > <div className= "flex items center justify between " > <h2 className= "text slate 2 0 0 text xl font semibold flex items center gap 2 " > <Banknote size= {
1 8 }
/ > Control de efectivo del gerente (acumulado)
< /h2 > <button onClick = {abrirDeposito}
disabled= {
(managerLedger.cashOnHand | | 0 )
< = 0 }
className= {
`inline flex items center gap 2 px 4 py 2 rounded xl border $ {
(managerLedger.cashOnHand | | 0 )
< = 0 ? "bg slate 8 0 0 border slate 6 0 0 text slate 4 0 0 cursor not allowed " : "bg emerald 6 0 0 / 2 0 border emerald 5 0 0 text emerald 1 0 0 hover:bg emerald 6 0 0 / 3 0 " }
` }
> <BadgeCheck size= {
1 8 }
/ > Registrar dep?sito < /button> < /div> <div className= "bg [ # 1 2 1b2f] border border slate 7 0 0 rounded 2xl p 4 " > <div className= "text slate 2 0 0 font semibold" >Dep?sitos a banco ( 閻?ltimos)
< /div> <ul className= "mt 3 divide y divide slate 7 0 0 " > {
(managerLedger.deposits | | [ ] )
.slice( 5 )
.reverse ( )
.map( (d, i)
= > ( <li key= {i}
className= "py 2 " > <div className= "text slate 3 0 0 " > <span className= "text slate 1 0 0 font semibold" > {currency(d.monto)
}
< /span> <span className= "ml 2 text slate 4 0 0 " > ( {d.fechaAbono}
)
< /span> <span className= "ml 2 text slate 4 0 0 " >Banco: {d.banco}
< /span> <span className= "ml 2 text slate 4 0 0 " >Remesa: {d.transaccion}
< /span> <span className= "ml 2 text slate 4 0 0 " >Abonado por: {d.abonadoPor}
< /span> < /div> < /li> )
)
}
{
! (managerLedger.deposits | | [ ] )
.length & & ( <li className= "py 2 text slate 4 0 0 " >Sin dep?sitos. < /li> )
}
< /ul> <details className= "mt 4 " > <summary className= "cursor pointer text slate 3 0 0 " >Ver todos (con rango)
< /summary > <div className= "mt 3 flex gap 2 " > <div className= "flex items center gap 2 bg slate 8 0 0 border border slate 6 0 0 rounded xl px 3 py 2 " > <CalendarDays size= {
1 6 }
className= "text slate 3 0 0 " / > <input type= "date" value= {depDesde}
onChange= {
(e)
= > setDepDesde(e.target.value)
}
className= "bg transparent outline none text slate 1 0 0 " / > < /div> <div className= "flex items center gap 2 bg slate 8 0 0 border border slate 6 0 0 rounded xl px 3 py 2 " > <CalendarDays size= {
1 6 }
className= "text slate 3 0 0 " / > <input type= "date" value= {depHasta}
onChange= {
(e)
= > setDepHasta(e.target.value)
}
className= "bg transparent outline none text slate 1 0 0 " / > < /div> < /div> <ul className= "mt 3 divide y divide slate 7 0 0 " > {depositosFiltrados.length ? ( depositosFiltrados.map( (d, i)
= > ( <li key= {i}
className= "py 2 " > <div className= "text slate 3 0 0 " > <span className= "text slate 1 0 0 font semibold" > {currency(d.monto)
}
< /span> <span className= "ml 2 text slate 4 0 0 " > ( {d.fechaAbono}
)
< /span> <span className= "ml 2 text slate 4 0 0 " >Banco: {d.banco}
< /span> <span className= "ml 2 text slate 4 0 0 " >Remesa: {d.transaccion}
< /span> <span className= "ml 2 text slate 4 0 0 " >Abonado por: {d.abonadoPor}
< /span> < /div> < /li> )
)
)
: ( <li className= "py 2 text slate 4 0 0 " >No hay dep?sitos en el rango. < /li> )
}
< /ul> < /details > < /div> < /div> {
/ * Confirmaciones * / }
{confirmTipo = = = "gerente " & & ( <ConfirmModal title= "Liquidar efectivo con gerente " subtitle= "Se marcar?n como liquidados los usuarios elegibles visibles (en todos los d?as del rango)
y el efectivo pasar? a caja del gerente . " acceptLabel= "S?, liquidar e imprimir" onAccept= {confirmarLiquidarGerente}
onCancel= {
( )
= > setConfirmTipo (null)
}
/ > )
}
{confirmTipo = = = "empleados" & & ( <ConfirmModal title= "Liquidar turno(s)
seleccionado(s)
" subtitle= "Se liquidar?n los usuarios seleccionados para todos los d?as del rango con ventas cerradas. " acceptLabel= "S?, liquidar" onAccept= {confirmarLiquidarSeleccionados}
onCancel= {
( )
= > setConfirmTipo (null)
}
/ > )
}
{
/ * Modal de dep?sito * / }
<DepositoModal open= {depositoOpen}
onClose = {
( )
= > setDepositoOpen(false)
}
onSubmit= {confirmarDeposito}
initialValues= {
{
fechaAbono: hoyISO( )
, banco: " " , transaccion: " " , abonadoPor: " " , monto: " " , }
}
maxMonto= {managerLedger.cashOnHand}
/ > < /div> )
;
}
/ * = = = = = = = = = = = = Subcomponentes = = = = = = = = = = = = * / function KpiCard ( {
label, value }
)
{
return ( <div className= "bg [ # 1 2 1b2f] border border slate 7 0 0 rounded 2xl p 4 " > <div className= "text slate 3 0 0 text sm" > {label}
< /div> <div className= "text 2xl font bold text slate 1 0 0 mt 1 " > {value}
< /div> < /div> )
;
}
function IndicatorCard( {
icon, title, value, gradient, ring }
)
{
return ( <div className= {
`rounded 2xl p 4 border border slate 7 0 0 bg gradient to br $ {gradient}
ring 1 $ {ring}
shadow md` }
> <div className= "flex items center justify between " > <div className= "flex items center gap 2 text slate 3 0 0 text sm" > {icon}
{title}
< /div> <div className= "text 2xl font extrabold text slate 1 0 0 " > {value}
< /div> < /div> < /div> )
;
}
function ConfirmModal( {
title, subtitle, acceptLabel = "Confirmar" , onAccept, onCancel }
)
{
return ( <div className= "fixed inset 0 z [ 6 0 ] flex items center justify center" > <div className= "absolute inset 0 bg black/ 6 0 " onClick = {onCancel}
aria hidden= "true" / > <div className= "relative z [ 6 1 ] w [ 9 2 % ] maxwmd rounded 2xl border border slate 7 0 0 bg [ # 1 2 1b2f] p 5 shadow xl" > <h3 className= "text lg font semibold text yellow 3 0 0 " > {title}
< /h3 > <p className= "mt 1 text slate 3 0 0 " > {subtitle}
< /p> <div className= "mt 4 flex items center justify end gap 2 " > <button onClick = {onCancel}
className= "px 4 py 2 rounded xl bg slate 8 0 0 border border slate 6 0 0 text slate 2 0 0 hover:bg slate 7 0 0 " > Cancelar < /button> <button onClick = {onAccept}
className= "inline flex items center gap 2 px 4 py 2 rounded xl bg green 6 0 0 / 2 0 border border green 5 0 0 text green 1 0 0 hover:bg green 6 0 0 / 3 0 " > <CheckCircle2 size= {
1 8 }
/ > {acceptLabel}
< /button> < /div> < /div> < /div> )
;
}