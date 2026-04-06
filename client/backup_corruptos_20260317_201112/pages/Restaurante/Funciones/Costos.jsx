import React, {
useMemo , useState }
from "react" ;
import {
useCostos }
from " . . / . . / . . /context /CostosContext.jsx" ;
import {
PlusCircle, Save, X, Filter, Pencil, CheckCircle2 , Clock, Calendar, DollarSign, Building2 , FileUp, FileSpreadsheet, Tags, Wallet, Hash, }
from "lucide React" ;
import * as XLSX from "xlsx" ;
// helpers const fmtMoney = (n)
= > (n ? ? 0 )
.toLocaleString ( "es SV" , {
style: "currency" , currency: "USD" , minimumFractionDigits : 2 }
)
;
const startOfMonth = (d = new Date( )
)
= > new Date(d.getFullYear( )
, d.getMonth( )
, 1 )
;
const endOfMonth = (d = new Date( )
)
= > new Date(d.getFullYear( )
, d.getMonth( )
+ 1 , 0 , 2 3 , 5 9 , 5 9 , 9 9 9 )
;
const inRange = (date, from, to)
= > {
const t = new Date(date)
.getTime ( )
;
return ( !from | | t > = new Date(from)
.getTime ( )
)
& & ( !to | | t < = new Date(to)
.getTime ( )
)
;
}
;
// Compra = categor ?as donde tiene sentido pedir factura const esCompra = (categoria)
= > [ "Insumos " , "Compras " ] .includes(categoria | | " " )
;
// componente export default function Costos( )
{
// Cat?logos base (puedes convertirlos a API luego)
const [categorias, setCategorias] = useState( [ "Renta" , "Servicios (agua/luz/internet)
" , "Insumos " , "N?mina" , "Impuestos" , "Mantenimiento" , "Marketing" , "Compras " , "Otros" , ] )
;
const [proveedores] = useState( [ "Alquiladora XYZ" , "Distribuidora ABC" , "Empleado" , "Gobierno" , "Otro" ] )
;
const metodos = [ "Efectivo" , "Transferencia" , "Tarjeta " , "Cheque" , "Mixto" ] ;
// Datos const [costos, setCostos] = useState( [ {
id: 1 , fecha: new Date( )
.toISOString( )
.slice( 0 , 1 0 )
, categoria: "Servicios (agua/luz/internet)
" , proveedor: "AES" , descripcion: "Factura de energ?a julio" , metodo: "Transferencia" , subTotal: 8 5 , impuestoPct: 1 3 , total: 9 6 . 0 5 , pagado: true, vence: new Date( )
.toISOString( )
.slice( 0 , 1 0 )
, adjunto : " " , notas: " " , tieneFactura: true, numeroFactura: "E 2 0 2 5 0 7 8 2 1 " , }
, {
id: 2 , fecha: new Date( )
.toISOString( )
.slice( 0 , 1 0 )
, categoria: "Insumos " , proveedor: "Distribuidora ABC" , descripcion: "Aceite + desechables" , metodo: "Efectivo" , subTotal: 1 2 0 , impuestoPct: 0 , total: 1 2 0 , pagado: false, vence: new Date(Date.now( )
+ 4 * 8 6 4 0 0 0 0 0 )
.toISOString( )
.slice( 0 , 1 0 )
, adjunto : " " , notas: "Entrega parcial " , tieneFactura: false, numeroFactura: " " , }
, ] )
;
// Formulario const initialForm = {
id: null, fecha: new Date( )
.toISOString( )
.slice( 0 , 1 0 )
, categoria: " " , proveedor: " " , descripcion: " " , metodo: "Efectivo" , subTotal: " " , impuestoPct: 0 , total: 0 , pagado: false, vence: " " , adjunto : " " , notas: " " , tieneFactura: false, numeroFactura: " " , }
;
const [form, setForm ] = useState(initialForm)
;
const [editando, setEditando] = useState(false)
;
// Filtros const [q, setQ] = useState( " " )
;
const [fEstado , setFEstado] = useState( "Todos" )
;
// Todos | Pagado | Pendiente const [fCategoria, setFCategoria] = useState( "Todas" )
;
const [fDesde, setFDesde] = useState(startOfMonth( )
.toISOString( )
.slice( 0 , 1 0 )
)
;
const [fHasta, setFHasta] = useState(endOfMonth( )
.toISOString( )
.slice( 0 , 1 0 )
)
;
// Derivados const costosFiltrados = useMemo ( ( )
= > {
return costos .filter( (c)
= > inRange (c.fecha, fDesde, fHasta)
)
.filter( (c)
= > (fEstado = = = "Todos" ? true : fEstado = = = "Pagado" ? c.pagado : !c.pagado)
)
.filter( (c)
= > (fCategoria = = = "Todas" ? true : c.categoria = = = fCategoria)
)
.filter( (c)
= > {
const s = q.trim( )
.toLowerCase( )
;
if ( !s)
return true;
return ( c.descripcion.toLowerCase( )
.includes(s)
| | (c.proveedor | | " " )
.toLowerCase( )
.includes(s)
| | (c.categoria | | " " )
.toLowerCase( )
.includes(s)
| | (c.numeroFactura | | " " )
.toLowerCase( )
.includes(s)
)
;
}
)
;
}
, [costos, q, fEstado , fCategoria, fDesde, fHasta] )
;
const kpis = useMemo ( ( )
= > {
const hoy = new Date( )
;
const delMes = costos.filter( (c)
= > inRange (c.fecha, startOfMonth(hoy)
, endOfMonth(hoy)
)
)
.reduce( (a, c)
= > a + (c.total | | 0 )
, 0 )
;
const pendientes = costos.filter( (c)
= > !c.pagado)
;
const porVencer = pendientes.filter( (c)
= > c.vence & & new Date(c.vence)
new Date( )
< = 7 * 8 6 4 0 0 0 0 0 )
;
return {
gastoMes: delMes, pendientes: pendientes.length, porVencer: porVencer.length, }
;
}
, [costos] )
;
// Handlers const calcTotal = (st, pct)
= > {
const sub = Number(st | | 0 )
;
const imp = Number(pct | | 0 )
;
return + (sub + (sub * imp)
/ 1 0 0 )
.toFixed ( 2 )
;
}
;
const handleChange = (e)
= > {
const {
name, value, type, checked , files }
= e.target;
if (name = = = "subTotal" | | name = = = "impuestoPct" )
{
const next = {
. . .form, [name] : value }
;
next.total = calcTotal(next.subTotal, next.impuestoPct)
;
setForm (next)
;
}
else if (name = = = "adjunto " )
{
setForm ( {
. . .form, adjunto : files? . [ 0 ] ? .name | | " " }
)
;
}
else if (type = = = "checkbox" )
{
setForm ( {
. . .form, [name] : checked }
)
;
}
else {
setForm ( {
. . .form, [name] : value }
)
;
}
}
;
const guardar = ( )
= > {
if ( !form.fecha | | !form.categoria | | !form.descripcion | | !form.subTotal)
return;
// Si marc? factura , exigir n閻?mero if (form.tieneFactura & & !String(form.numeroFactura | | " " )
.trim( )
)
{
alert( "Ingresa el n閻?mero de factura . " )
;
return;
}
const payload = {
. . .form, subTotal: +form.subTotal, impuestoPct: +form.impuestoPct, total: calcTotal(form.subTotal, form.impuestoPct)
, }
;
if (editando)
{
setCostos( (prev)
= > prev.map( (c)
= > (c.id = = = form.id ? payload : c)
)
)
;
}
else {
setCostos( (prev)
= > [ {
. . .payload , id: Date.now( )
}
, . . .prev] )
;
}
cancelar( )
;
}
;
const cancelar = ( )
= > {
setForm (initialForm)
;
setEditando(false)
;
}
;
const editar = (row)
= > {
setForm ( {
. . .row }
)
;
setEditando(true)
;
}
;
const togglePagado = (id)
= > setCostos( (p)
= > p.map( (c)
= > (c.id = = = id ? {
. . .c, pagado: !c.pagado }
: c)
)
)
;
const exportarExcel = ( )
= > {
const data = costosFiltrados.map( (c)
= > ( {
Fecha: c.fecha, Categor ?a : c.categoria, Proveedor: c.proveedor, Descripci?n : c.descripcion, M閼?todo: c.metodo, Subtotal: c.subTotal, "Impuesto % " : c.impuestoPct, Total: c.total, Estado: c.pagado ? "Pagado" : "Pendiente" , Vence: c.vence | | " " , "Tiene factura " : c.tieneFactura ? "S?" : "No" , "N閹? factura " : c.numeroFactura | | " " , Adjunto : c.adjunto | | " " , Notas: c.notas | | " " , }
)
)
;
const wb = XLSX.utils.book_new( )
;
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data)
, "Costos" )
;
XLSX.writeFile(wb, `Costos_ $ {fDesde}
_ $ {fHasta}
.xlsx` )
;
}
;
const agregarCategoriaRapido = (nombre)
= > {
const n = (nombre | | " " )
.trim( )
;
if ( !n)
return;
if ( !categorias.includes(n)
)
setCategorias( (p)
= > [ . . .p, n] )
;
setForm ( (f)
= > ( {
. . .f, categoria: n }
)
)
;
}
;
// UI return ( <div className= "p 6 spacey 6 " > {
/ * Header * / }
<div className= "flex items center justify between flex wrap gap 3 " > <div> <h2 className= "text 2xl font bold text white" >Registro de costos< /h2 > <p className= "text slate 4 0 0 text sm" >Captura y controla todos los costos del restaurante< /p> < /div> <button onClick = {exportarExcel}
className= "inline flex items center gap 2 px 3 py 2 rounded lg border border slate 7 0 0 bg slate 9 0 0 text slate 1 0 0 hover:border yellow 4 0 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 5 0 , 2 0 4 , 2 1 , 0 . 3 5 )
] " > <FileSpreadsheet size= {
1 6 }
/ > Exportar Excel < /button> < /div> {
/ * KPI cards * / }
<div className= "grid grid cols 1 sm:grid cols 3 gap 4 " > <div className= "rounded 2xl p 4 bg gradient to br from yellow 4 0 0 to yellow 5 0 0 text black ring 1 ring black/ 1 0 " > <p className= "text [ 1 1px] uppercase tracking wide" >Gasto del mes< /p> <p className= "text 2xl font extrabold mt 1 " > {fmtMoney(kpis.gastoMes)
}
< /p> < /div> <div className= "rounded 2xl p 4 bg gradient to br from rose 6 0 0 to rose 7 0 0 text white ring 1 ring white/ 1 0 " > <p className= "text [ 1 1px] uppercase tracking wide" >Pendientes< /p> <p className= "text 2xl font extrabold mt 1 " > {kpis.pendientes}
< /p> < /div> <div className= "rounded 2xl p 4 bg gradient to br from amber 6 0 0 to amber 7 0 0 text white ring 1 ring white/ 1 0 " > <p className= "text [ 1 1px] uppercase tracking wide" >Por vencer ( 7 d?as)
< /p> <p className= "text 2xl font extrabold mt 1 " > {kpis.porVencer}
< /p> < /div> < /div> <div className= "grid grid cols 1 xl:grid cols 2 gap 6 " > {
/ * Formulario * / }
<section className= "rounded 2xl border border slate 7 0 0 bg gradient to br from slate 9 0 0 / 9 0 to slate 9 5 0 p 4 " > <div className= "flex items center justify between mb 3 " > <h3 className= "text yellow 3 0 0 font semibold flex items center gap 2 " > <PlusCircle size= {
1 8 }
/ > {editando ? "Editar costo" : "Agregar costo" }
< /h3 > < /div> <div className= "grid grid cols 1 md:grid cols 2 gap 3 " > <label className= "text sm text slate 3 0 0 " > Fecha <div className= "flex items center gap 2 mt 1 " > <Calendar size= {
1 6 }
className= "text slate 4 0 0 " / > <input type= "date" name= "fecha" value= {form.fecha}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /div> < /label> <label className= "text sm text slate 3 0 0 " > Categor ?a <div className= "flex gap 2 mt 1 " > <select name= "categoria" value= {form.categoria}
onChange= {handleChange}
className= "flex 1 rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " > <option value= " " >Selecciona< /option> {categorias.map( (c)
= > ( <option key= {c}
value= {c}
> {c}
< /option> )
)
}
< /select> {
/ * Add r?pido * / }
<button type= "button" onClick = {
( )
= > {
const n = prompt( "Nueva categor ?a : " )
;
if (n)
agregarCategoriaRapido(n)
;
}
}
className= "px 3 rounded md border border slate 7 0 0 text slate 1 0 0 bg slate 9 0 0 hover:border yellow 4 0 0 " title= "Agregar categor ?a " > <Tags size= {
1 6 }
/ > < /button> < /div> < /label> <label className= "text sm text slate 3 0 0 " > Proveedor <div className= "flex items center gap 2 mt 1 " > <Building2 size= {
1 6 }
className= "text slate 4 0 0 " / > <input list= "proveedores" name= "proveedor" value= {form.proveedor}
onChange= {handleChange}
placeholder= "Proveedor" className= "w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 placeholder slate 5 0 0 " / > <datalist id= "proveedores" > {proveedores.map( (p)
= > ( <option key= {p}
value= {p}
/ > )
)
}
< /datalist> < /div> < /label> <label className= "text sm text slate 3 0 0 " > M閼?todo de pago <div className= "flex items center gap 2 mt 1 " > <Wallet size= {
1 6 }
className= "text slate 4 0 0 " / > <select name= "metodo" value= {form.metodo}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " > {metodos .map( (m)
= > ( <option key= {m}
value= {m}
> {m}
< /option> )
)
}
< /select> < /div> < /label> <label className= "text sm text slate 3 0 0 md:col span 2 " > Descripci?n <input name= "descripcion" value= {form.descripcion}
onChange= {handleChange}
placeholder= "Ej. compra de verduras, factura energ?a , etc. " className= "mt 1 w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 placeholder slate 5 0 0 " / > < /label> <label className= "text sm text slate 3 0 0 " > Subtotal <div className= "flex items center gap 2 mt 1 " > <DollarSign size= {
1 6 }
className= "text slate 4 0 0 " / > <input name= "subTotal" value= {form.subTotal}
onChange= {handleChange}
placeholder= " 0 . 0 0 " inputMode= "decimal " className= "w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /div> < /label> <label className= "text sm text slate 3 0 0 " > Impuesto ( % )
<input name= "impuestoPct" value= {form.impuestoPct}
onChange= {handleChange}
placeholder= " 0 " inputMode= "decimal " className= "mt 1 w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /label> <div className= "md:col span 2 grid grid cols 2 gap 3 " > <label className= "text sm text slate 3 0 0 " > Total <div className= "mt 1 w full rounded md bg slate 8 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " > {fmtMoney(form.total | | 0 )
}
< /div> < /label> <label className= "text sm text slate 3 0 0 " > Vence <input type= "date" name= "vence" value= {form.vence}
onChange= {handleChange}
className= "mt 1 w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /label> < /div> {
/ * Factura (solo cuando es compra)
* / }
{esCompra(form.categoria)
& & ( <div className= "md:col span 2 grid grid cols 1 md:grid cols 3 gap 3 " > <label className= "flex items center gap 2 text slate 2 0 0 " > <input type= "checkbox" name= "tieneFactura" checked = {form.tieneFactura}
onChange= {handleChange}
/ > ?Tiene factura ? < /label> {form.tieneFactura & & ( <label className= "text sm text slate 3 0 0 md:col span 2 " > N閻?mero de factura <div className= "flex items center gap 2 mt 1 " > <Hash size= {
1 6 }
className= "text slate 4 0 0 " / > <input name= "numeroFactura" value= {form.numeroFactura}
onChange= {handleChange}
placeholder= "Ej. A 0 0 1 2 3 4 5 6 " className= "w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /div> < /label> )
}
< /div> )
}
<label className= "text sm text slate 3 0 0 " > Adjunto (opcional)
<div className= "flex items center gap 2 mt 1 " > <FileUp size= {
1 6 }
className= "text slate 4 0 0 " / > <input type= "file" name= "adjunto " onChange= {handleChange}
className= "w full text slate 2 0 0 " / > < /div> {form.adjunto & & <p className= "text xs text slate 4 0 0 mt 1 " >Archivo : {form.adjunto }
< /p> }
< /label> <label className= "text sm text slate 3 0 0 md:col span 2 " > Notas <textarea name= "notas" value= {form.notas}
onChange= {handleChange}
rows= {
2 }
className= "mt 1 w full rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /label> <label className= "flex items center gap 2 text slate 2 0 0 md:col span 2 " > <input type= "checkbox" name= "pagado" checked = {form.pagado}
onChange= {handleChange}
/ > ?Marcado como pagado? < /label> < /div> <div className= "mt 4 flex gap 2 " > <button onClick = {guardar }
className= "inline flex items center gap 2 bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 4 py 2 rounded transition all" > <Save size= {
1 8 }
/ > {editando ? "Guardar cambios " : "Guardar costo" }
< /button> <button onClick = {cancelar}
className= "inline flex items center gap 2 bg slate 8 0 0 border border slate 7 0 0 text slate 1 0 0 px 4 py 2 rounded hover:border yellow 4 0 0 " > <X size= {
1 8 }
/ > Cancelar < /button> < /div> < /section > {
/ * Filtros + Lista * / }
<section className= "rounded 2xl border border slate 7 0 0 bg gradient to br from slate 9 0 0 / 9 0 to slate 9 5 0 p 4 " > {
/ * Filtros * / }
<div className= "flex items center justify between mb 3 " > <h3 className= "text yellow 3 0 0 font semibold flex items center gap 2 " > <Filter size= {
1 8 }
/ > Filtros < /h3 > < /div> <div className= "grid grid cols 1 md:grid cols 5 gap 2 mb 4 " > <input value= {q}
onChange= {
(e)
= > setQ(e.target.value)
}
placeholder= "Buscar?? className= "rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 placeholder slate 5 0 0 " / > <select value= {fEstado }
onChange= {
(e)
= > setFEstado(e.target.value)
}
className= "rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " > {
[ "Todos" , "Pagado" , "Pendiente" ] .map( (s)
= > ( <option key= {s}
> {s}
< /option> )
)
}
< /select> <select value= {fCategoria}
onChange= {
(e)
= > setFCategoria(e.target.value)
}
className= "rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " > <option>Todas< /option> {categorias.map( (c)
= > ( <option key= {c}
> {c}
< /option> )
)
}
< /select> <input type= "date" value= {fDesde}
onChange= {
(e)
= > setFDesde(e.target.value)
}
className= "rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > <input type= "date" value= {fHasta}
onChange= {
(e)
= > setFHasta(e.target.value)
}
className= "rounded md bg slate 9 0 0 border border slate 7 0 0 text slate 1 0 0 px 3 py 2 " / > < /div> {
/ * Lista * / }
<div className= "overflowxauto" > <table className= "w full text left" > <thead> <tr className= "text slate 3 0 0 text xs uppercase" > <th className= "py 2 border b border slate 7 0 0 " >Fecha< /th> <th className= "py 2 border b border slate 7 0 0 " >Categor ?a < /th> <th className= "py 2 border b border slate 7 0 0 " >Proveedor< /th> <th className= "py 2 border b border slate 7 0 0 " >Descripci?n < /th> <th className= "py 2 border b border slate 7 0 0 " >M閼?todo< /th> <th className= "py 2 border b border slate 7 0 0 text right" >Total< /th> <th className= "py 2 border b border slate 7 0 0 " >Estado< /th> <th className= "py 2 border b border slate 7 0 0 " >Vence< /th> <th className= "py 2 border b border slate 7 0 0 " >Factura < /th> <th className= "py 2 border b border slate 7 0 0 " >Adj. < /th> <th className= "py 2 border b border slate 7 0 0 text right" >Acciones< /th> < /tr> < /thead> <tbody> {costosFiltrados.map( (c)
= > ( <tr key= {c.id}
className= "text slate 1 0 0 " > <td className= "py 2 border b border slate 8 0 0 " > {c.fecha}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.categoria}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.proveedor}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.descripcion}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.metodo}
< /td> <td className= "py 2 border b border slate 8 0 0 text right" > {fmtMoney(c.total)
}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.pagado ? ( <span className= "inline flex items center gap 1 text emerald 3 0 0 bg emerald 4 0 0 / 1 0 border border emerald 5 0 0 / 3 0 px 2 py 0 . 5 rounded " > <CheckCircle2 size= {
1 4 }
/ > Pagado < /span> )
: ( <span className= "inline flex items center gap 1 text amber 3 0 0 bg amber 4 0 0 / 1 0 border border amber 5 0 0 / 3 0 px 2 py 0 . 5 rounded " > <Clock size= {
1 4 }
/ > Pendiente < /span> )
}
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.vence | | " " }
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.tieneFactura ? (c.numeroFactura | | " ?? )
: " ?? }
< /td> <td className= "py 2 border b border slate 8 0 0 " > {c.adjunto ? "S?" : " ?? }
< /td> <td className= "py 2 border b border slate 8 0 0 text right" > <div className= "flex justify end gap 2 " > <button onClick = {
( )
= > editar(c)
}
className= "p 1 . 5 rounded bg slate 8 0 0 / 7 0 border border slate 7 0 0 hover:border blue 4 0 0 / 5 0 " title= "Editar" > <Pencil size= {
1 6 }
className= "text blue 3 0 0 " / > < /button> <button onClick = {
( )
= > togglePagado(c.id)
}
className= "p 1 . 5 rounded bg slate 8 0 0 / 7 0 border border slate 7 0 0 hover:border emerald 4 0 0 / 5 0 " title= "Alternar pagado" > <CheckCircle2 size= {
1 6 }
className= "text emerald 3 0 0 " / > < /button> < /div> < /td> < /tr> )
)
}
{costosFiltrados.length = = = 0 & & ( <tr> <td colSpan = {
1 1 }
className= "py 6 text center text slate 4 0 0 " > No hay registros con los filtros actuales. < /td> < /tr> )
}
< /tbody> < /table> < /div> < /section > < /div> < /div> )
;
}