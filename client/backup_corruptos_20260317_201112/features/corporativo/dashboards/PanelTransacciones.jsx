// client/src/features/corporativo/Transacciones/TransaccionesListPage .jsx import React, {
useMemo , useState }
from "react" ;
/ * * * Datos mock de transacciones para desarrollo. * M?s adelante se reemplaza por datos desde la API (REST /transacciones)
. * * Campos clave: * tipo: "Ingreso " | "Egreso" * categoria: renta, ventas, servicios, mantenimiento, n?mina, etc. * negocio : REST0 1 , APT0 4 , LA0 1 , FLOTA0 1 , etc. * estado: Confirmada | Pendiente | Anulada * metodoPago: Efectivo, Tarjeta , Transferencia, etc. * / const MOCK_TRANSACTIONS = [ {
id: "TX REST 0 0 0 1 " , fecha: " 2 0 2 5 0 3 0 1 " , negocio : "REST0 1 ? Chaparral / Restaurantes" , ubicacion: "El Salvador ? Lourdes Col?n ? Chaparral" , tipo: "Ingreso " , categoria: "Ventas restaurante" , descripcion: "Ventas del d?a ? sal?n y para llevar" , metodoPago: "Mixto" , referencia: "Cierre caja # 0 0 1 " , moneda: "USD" , monto: 3 8 0 . 5 , estado: "Confirmada" , }
, {
id: "TX REST 0 0 0 2 " , fecha: " 2 0 2 5 0 3 0 1 " , negocio : "REST0 1 ? Chaparral / Restaurantes" , ubicacion: "El Salvador ? Lourdes Col?n ? Chaparral" , tipo: "Egreso" , categoria: "Compra insumos " , descripcion: "Compra tomates , quesos y harina" , metodoPago: "Efectivo" , referencia: "FAC REST 0 0 1 " , moneda: "USD" , monto: 9 5 . 2 , estado: "Confirmada" , }
, {
id: "TX REST 0 0 0 3 " , fecha: " 2 0 2 5 0 3 0 2 " , negocio : "REST0 1 ? Chaparral / Restaurantes" , ubicacion: "El Salvador ? Lourdes Col?n ? Chaparral" , tipo: "Egreso" , categoria: "N?mina" , descripcion: "Pago diario meseros y cocina" , metodoPago: "Efectivo" , referencia: "NOM REST 2 0 2 5 0 3 0 2 " , moneda: "USD" , monto: 8 0 , estado: "Confirmada" , }
, {
id: "TX APT 0 0 0 1 " , fecha: " 2 0 2 5 0 3 0 1 " , negocio : "APT0 4 ? Lourdes Col?n " , ubicacion: "El Salvador ? Lourdes Col?n " , tipo: "Ingreso " , categoria: "Renta apartamentos" , descripcion: "Renta mensual APT0 4 " , metodoPago: "Transferencia" , referencia: "DEP 1 2 3 4 5 " , moneda: "USD" , monto: 3 0 0 , estado: "Confirmada" , }
, {
id: "TX APT 0 0 0 2 " , fecha: " 2 0 2 5 0 3 0 5 " , negocio : "APT0 4 ? Lourdes Col?n " , ubicacion: "El Salvador ? Lourdes Col?n " , tipo: "Egreso" , categoria: "Mantenimiento" , descripcion: "Reparaci?n plomer?a ba鐢?o APT0 4 " , metodoPago: "Efectivo" , referencia: "MANT APT 0 0 5 " , moneda: "USD" , monto: 4 5 , estado: "Confirmada" , }
, {
id: "TX LA 0 0 0 1 " , fecha: " 2 0 2 5 0 3 0 1 " , negocio : "LA0 1 ? Los 閼?ngeles" , ubicacion: "USA ? Los 閼?ngeles" , tipo: "Ingreso " , categoria: "Renta habitaciones" , descripcion: "Renta mensual habitaci?n LA0 1 0 1 " , metodoPago: "Transferencia" , referencia: "ZELL 9 9 8 8 " , moneda: "USD" , monto: 9 5 0 , estado: "Confirmada" , }
, {
id: "TX LA 0 0 0 2 " , fecha: " 2 0 2 5 0 3 0 3 " , negocio : "LA0 1 ? Los 閼?ngeles" , ubicacion: "USA ? Los 閼?ngeles" , tipo: "Egreso" , categoria: "Servicios p閻?blicos" , descripcion: "Factura electricidad y agua" , metodoPago: "Tarjeta " , referencia: "UTIL LA 0 3 2 0 2 5 " , moneda: "USD" , monto: 2 1 0 . 7 5 , estado: "Confirmada" , }
, {
id: "TX FLOTA 0 0 0 1 " , fecha: " 2 0 2 5 0 3 0 2 " , negocio : "FLOTA0 1 ? Veh?culos" , ubicacion: "El Salvador ? Lourdes Col?n " , tipo: "Ingreso " , categoria: "Renta veh?culos" , descripcion: "Renta veh?culo para Uber (semana 1 )
" , metodoPago: "Transferencia" , referencia: "RENT VEH 0 0 1 " , moneda: "USD" , monto: 1 8 0 , estado: "Confirmada" , }
, {
id: "TX FLOTA 0 0 0 2 " , fecha: " 2 0 2 5 0 3 0 2 " , negocio : "FLOTA0 1 ? Veh?culos" , ubicacion: "El Salvador ? Lourdes Col?n " , tipo: "Egreso" , categoria: "Combustible / Mantenimiento" , descripcion: "Cambio de aceite flota" , metodoPago: "Tarjeta " , referencia: "WORKSHOP 0 2 2 5 " , moneda: "USD" , monto: 6 0 , estado: "Pendiente" , }
, {
id: "TX REST 0 0 0 4 " , fecha: " 2 0 2 5 0 3 0 3 " , negocio : "REST0 1 ? Chaparral / Restaurantes" , ubicacion: "El Salvador ? Lourdes Col?n ? Chaparral" , tipo: "Ingreso " , categoria: "Ventas restaurante" , descripcion: "Ventas del d?a ? sal?n y para llevar" , metodoPago: "Mixto" , referencia: "Cierre caja # 0 0 2 " , moneda: "USD" , monto: 4 2 0 . 7 5 , estado: "Confirmada" , }
, ] ;
const TIPO_OPTIONS = [ "Todos" , "Ingreso " , "Egreso" ] ;
const ESTADO_OPTIONS = [ "Todos" , "Confirmada" , "Pendiente" , "Anulada " ] ;
const NEGOCIO _OPTIONS = [ "Todos" , "REST0 1 ? Chaparral / Restaurantes" , "APT0 4 ? Lourdes Col?n " , "LA0 1 ? Los 閼?ngeles" , "FLOTA0 1 ? Veh?culos" , ] ;
const METODO_PAGO_OPTIONS = [ "Todos" , "Efectivo" , "Tarjeta " , "Transferencia" , "Mixto" ] ;
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
export default function TransaccionesListPage ( )
{
const [tipoFilter, setTipoFilter] = useState( "Todos" )
;
const [estadoFilter, setEstadoFilter] = useState( "Todos" )
;
const [negocioFilter, setNegocioFilter] = useState( "Todos" )
;
const [metodoFilter, setMetodoFilter] = useState( "Todos" )
;
const [fromDate, setFromDate] = useState( " " )
;
const [toDate, setToDate] = useState( " " )
;
const [search, setSearch] = useState( " " )
;
const filtered = useMemo ( ( )
= > {
return MOCK_TRANSACTIONS.filter( (t)
= > {
if (tipoFilter ! = = "Todos" & & t.tipo ! = = tipoFilter)
return false;
if (estadoFilter ! = = "Todos" & & t.estado ! = = estadoFilter)
return false;
if (negocioFilter ! = = "Todos" & & t.negocio ! = = negocioFilter)
return false;
if (metodoFilter ! = = "Todos" & & t.metodoPago ! = = metodoFilter)
return false;
if (fromDate & & t.fecha < fromDate)
return false;
if (toDate & & t.fecha > toDate)
return false;
if (search)
{
const q = search.toLowerCase( )
;
const hayMatch = t.id.toLowerCase( )
.includes(q)
| | (t.descripcion | | " " )
.toLowerCase( )
.includes(q)
| | (t.referencia | | " " )
.toLowerCase( )
.includes(q)
| | (t.categoria | | " " )
.toLowerCase( )
.includes(q)
| | (t.negocio | | " " )
.toLowerCase( )
.includes(q)
;
if ( !hayMatch)
return false;
}
return true;
}
)
;
}
, [tipoFilter, estadoFilter, negocioFilter, metodoFilter, fromDate, toDate, search] )
;
const summary = useMemo ( ( )
= > {
if (filtered.length = = = 0 )
{
return {
totalCount: 0 , ingresos: 0 , egresos : 0 , neto: 0 , ticketPromedio : 0 , }
;
}
const ingresos = filtered .filter( (t)
= > t.tipo = = = "Ingreso " & & t.estado = = = "Confirmada" )
.reduce( (acc, t)
= > acc + (t.monto | | 0 )
, 0 )
;
const egresos = filtered .filter( (t)
= > t.tipo = = = "Egreso" & & t.estado = = = "Confirmada" )
.reduce( (acc, t)
= > acc + (t.monto | | 0 )
, 0 )
;
const neto = ingresos egresos ;
const confirmadas = filtered.filter( (t)
= > t.estado = = = "Confirmada" )
;
const totalMontoConfirmadas = confirmadas.reduce( (acc, t)
= > acc + (t.monto | | 0 )
, 0 )
;
const ticketPromedio = confirmadas.length > 0 ? totalMontoConfirmadas / confirmadas.length : 0 ;
return {
totalCount: filtered.length, ingresos, egresos , neto, ticketPromedio , }
;
}
, [filtered] )
;
const pendingSummary = useMemo ( ( )
= > {
const pendientes = filtered.filter( (t)
= > t.estado = = = "Pendiente" )
;
const totalPendiente = pendientes.reduce( (acc, t)
= > acc + (t.monto | | 0 )
, 0 )
;
return {
count: pendientes.length, totalPendiente , }
;
}
, [filtered] )
;
return ( <section className= "w full spacey 6 " > {
/ * Header * / }
<div className= "flex flex col md:flex row md:items end md:justify between gap 2 " > <div> <h1 className= "text xl md:text 2xl font semibold tracking tight" > Transacciones < /h1 > <p className= "text xs md:text sm opacity 8 0 mt 1 " > Flujo de caja consolidado entre negocios, propiedades y veh?culos. Base para indicadores, impuestos y decisiones de inversi ?n . < /p> < /div> <div className= "flex gap 2 text xs md:text sm" > <button type= "button" className= "px 3 py 1 . 5 rounded xl border border [var( border)
] bg [var( panel)
] hover:bg [color mix(in_srgb,var( panel)
_ 8 5 % ,var( accent)
_ 1 5 % )
] transition colors" > Nueva transacci?n < /button> <button type= "button" className= "px 3 py 1 . 5 rounded xl border border dashed border [var( border)
] bg transparent hover:bg [var( panel)
] transition colors" > Importar desde Excel < /button> < /div> < /div> {
/ * KPIs * / }
<div className= "grid grid cols 2 md:grid cols 4 gap 3 md:gap 4 " > <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Ingresos confirmados < /div> <div className= "mt 1 text lg md:text xl font semibold tabular nums" > {formatCurrency (summary .ingresos)
}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > Solo transacciones tipo ingreso y estado confirmado < /div> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Egresos confirmados < /div> <div className= "mt 1 text lg md:text xl font semibold tabular nums" > {formatCurrency (summary .egresos )
}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > Insumos , n?mina, mantenimiento, servicios, etc. < /div> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Flujo neto < /div> <div className= {
`mt 1 text lg md:text xl font semibold tabular nums $ {summary .neto > = 0 ? "text emerald 3 0 0 " : "text red 3 0 0 " }
` }
> {formatCurrency (summary .neto)
}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > Ingresos menos egresos confirmados < /div> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm" > <div className= "text [ 1 1px] uppercase tracking wide opacity 7 0 " > Ticket promedio < /div> <div className= "mt 1 text lg md:text xl font semibold tabular nums" > {formatCurrency (summary .ticketPromedio )
}
< /div> <div className= "mt 1 text [ 1 1px] opacity 7 0 " > Monto medio por transacci?n confirmada < /div> < /div> < /div> {
/ * Filtros * / }
<div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 md:p 5 shadow sm" > <div className= "flex flex col md:flex row md:items center md:justify between gap 4 mb 3 " > <div className= "text sm font medium" >Filtros < /div> <button type= "button" className= "text xs underline opacity 7 0 hover:opacity 1 0 0 " onClick = {
( )
= > {
setTipoFilter( "Todos" )
;
setEstadoFilter( "Todos" )
;
setNegocioFilter( "Todos" )
;
setMetodoFilter( "Todos" )
;
setFromDate( " " )
;
setToDate( " " )
;
setSearch( " " )
;
}
}
> Limpiar filtros < /button> < /div> <div className= "grid grid cols 1 md:grid cols 6 gap 3 md:gap 4 text xs md:text sm" > <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Tipo< /label> <select className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {tipoFilter}
onChange= {
(e)
= > setTipoFilter(e.target.value)
}
> {TIPO_OPTIONS .map( (opt)
= > ( <option key= {opt}
value= {opt}
> {opt}
< /option> )
)
}
< /select> < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Estado< /label> <select className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {estadoFilter}
onChange= {
(e)
= > setEstadoFilter(e.target.value)
}
> {ESTADO_OPTIONS .map( (opt)
= > ( <option key= {opt}
value= {opt}
> {opt}
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
> {NEGOCIO _OPTIONS .map( (opt)
= > ( <option key= {opt}
value= {opt}
> {opt}
< /option> )
)
}
< /select> < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >M閼?todo de pago< /label> <select className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {metodoFilter}
onChange= {
(e)
= > setMetodoFilter(e.target.value)
}
> {METODO_PAGO_OPTIONS .map( (opt)
= > ( <option key= {opt}
value= {opt}
> {opt}
< /option> )
)
}
< /select> < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Desde< /label> <input type= "date" className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {fromDate}
onChange= {
(e)
= > setFromDate(e.target.value)
}
/ > < /div> <div className= "flex flex col gap 1 " > <label className= "opacity 8 0 " >Hasta< /label> <input type= "date" className= "rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 2 py 1 . 5 " value= {toDate}
onChange= {
(e)
= > setToDate(e.target.value)
}
/ > < /div> < /div> <div className= "mt 4 text xs md:text sm" > <label className= "opacity 8 0 block mb 1 " >B閻?squeda r?pida< /label> <input type= "text" placeholder= "Buscar por descripci?n , referencia, categor ?a o ID?? className= "w full rounded xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] px 3 py 1 . 5 " value= {search}
onChange= {
(e)
= > setSearch(e.target.value)
}
/ > < /div> < /div> {
/ * Resumen de pendientes * / }
<div className= "grid grid cols 1 md:grid cols 2 gap 3 md:gap 4 " > <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm text xs md:text sm" > <div className= "flex items center justify between " > <div className= "font medium" >Transacciones pendientes< /div> <div className= "text [ 1 1px] opacity 7 0 " > {pendingSummary .count}
pendiente(s)
< /div> < /div> <div className= "mt 2 text [ 1 1px] opacity 8 0 " > Monto pendiente: {
" " }
<span className= "font semibold tabular nums" > {formatCurrency (pendingSummary .totalPendiente )
}
< /span> < /div> <p className= "mt 1 text [ 1 1px] opacity 7 0 " > Estas transacciones afectan flujo de caja futuro. Idealmente, el corporativo deber?a revisar y confirmar o anular. < /p> < /div> <div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] p 4 shadow sm text xs md:text sm" > <div className= "flex items center justify between " > <div className= "font medium" >Resumen de registros< /div> <div className= "text [ 1 1px] opacity 7 0 " > {summary .totalCount}
transacci?n (es)
< /div> < /div> <p className= "mt 2 text [ 1 1px] opacity 8 0 " > Este m?dulo se conecta con: < /p> <ul className= "mt 1 list disc list inside text [ 1 1px] opacity 8 0 spacey 1 " > <li>Dashboards corporativos (flujo de caja, m?rgenes, KPIs)
. < /li> <li>Propiedades y negocios para ver rentabilidad por activo. < /li> <li>Indicadores para proyecciones y escenarios. < /li> < /ul> < /div> < /div> {
/ * Tabla de transacciones * / }
<div className= "rounded 2xl border border [var( border)
] bg [var( panel)
] shadow sm overflow hidden" > <div className= "px 4 py 3 border b border [var( border)
] flex items center justify between " > <div className= "text sm font medium" >Detalle de transacciones< /div> <div className= "text [ 1 1px] opacity 7 0 " > {filtered.length}
registro(s)
encontrado(s)
< /div> < /div> <div className= "overflowxauto" > <table className= "minwfull text xs md:text sm" > <thead> <tr className= "border b border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 4 % ,black_ 6 % )
] " > <th className= "px 3 py 2 text left font semibold" >Fecha< /th> <th className= "px 3 py 2 text left font semibold" >Negocio / Ubicaci ?n < /th> <th className= "px 3 py 2 text left font semibold" >Tipo< /th> <th className= "px 3 py 2 text left font semibold" >Categor ?a < /th> <th className= "px 3 py 2 text left font semibold" >Descripci?n < /th> <th className= "px 3 py 2 text left font semibold" >M閼?todo< /th> <th className= "px 3 py 2 text right font semibold" >Monto< /th> <th className= "px 3 py 2 text left font semibold" >Estado< /th> <th className= "px 3 py 2 text left font semibold" >Ref / ID< /th> < /tr> < /thead> <tbody> {filtered.length = = = 0 & & ( <tr> <td colSpan = {
9 }
className= "px 3 py 6 text center text [ 1 2px] opacity 7 0 " > No hay transacciones para mostrar con los filtros actuales. < /td> < /tr> )
}
{filtered.map( (t)
= > ( <tr key= {t.id}
className= "border b border [color mix(in_srgb,var( border)
_ 7 0 % ,transparent_ 3 0 % )
] hover:bg [color mix(in_srgb,var( panel)
_ 9 0 % ,black_ 1 0 % )
] transition colors" > <td className= "px 3 py 2 align top whitespace nowrap text [ 1 2px] tabular nums" > {t.fecha}
< /td> <td className= "px 3 py 2 align top" > <div className= "leading snug" > {t.negocio }
< /div> <div className= "text [ 1 1px] opacity 7 0 " > {t.ubicacion}
< /div> < /td> <td className= "px 3 py 2 align top" > <span className= {
`inline flex items center rounded full px 2 py [ 2px] text [ 1 1px] font semibold $ {t.tipo = = = "Ingreso " ? "bg emerald 5 0 0 / 1 5 text emerald 3 0 0 " : "bg red 5 0 0 / 1 5 text red 3 0 0 " }
` }
> {t.tipo}
< /span> < /td> <td className= "px 3 py 2 align top text [ 1 2px] " > {t.categoria}
< /td> <td className= "px 3 py 2 align top text [ 1 2px] " > <div className= "line clamp 2 " > {t.descripcion}
< /div> < /td> <td className= "px 3 py 2 align top text [ 1 2px] " > {t.metodoPago}
< /td> <td className= "px 3 py 2 align top text right tabular nums" > {formatCurrency (t.monto, t.moneda)
}
< /td> <td className= "px 3 py 2 align top" > <span className= {
`inline flex items center rounded full px 2 py [ 2px] text [ 1 1px] font semibold $ {t.estado = = = "Confirmada" ? "bg emerald 5 0 0 / 1 5 text emerald 3 0 0 " : t.estado = = = "Pendiente" ? "bg amber 5 0 0 / 1 5 text amber 2 0 0 " : "bg slate 5 0 0 / 2 0 text slate 2 0 0 " }
` }
> {t.estado}
< /span> < /td> <td className= "px 3 py 2 align top text [ 1 1px] " > <div className= "tabular nums" > {t.id}
< /div> <div className= "opacity 7 0 " > {t.referencia}
< /div> < /td> < /tr> )
)
}
< /tbody> < /table> < /div> {
/ * Resumen inferior * / }
<div className= "px 4 py 3 border t border [var( border)
] text [ 1 1px] md:text xs flex flex col md:flex row md:items center md:justify between gap 2 " > <div className= "opacity 7 5 " > <span className= "font semibold" >Resumen filtros ? < /span> {summary .totalCount}
transacci?n (es)
, ingresos{
" " }
<span className= "tabular nums" > {formatCurrency (summary .ingresos)
}
< /span> , egresos {
" " }
<span className= "tabular nums" > {formatCurrency (summary .egresos )
}
< /span> , flujo neto{
" " }
<span className= {
`tabular nums font semibold $ {summary .neto > = 0 ? "text emerald 3 0 0 " : "text red 3 0 0 " }
` }
> {formatCurrency (summary .neto)
}
< /span> . < /div> <div className= "opacity 7 5 " > Ticket promedio: {
" " }
<span className= "font semibold tabular nums" > {formatCurrency (summary .ticketPromedio )
}
< /span> . < /div> < /div> < /div> < /section > )
;
}