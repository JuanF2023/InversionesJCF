import React, {
useRef, useState, useEffect }
from "react" ;
import {
useLocation, useParams }
from "React router dom" ;
import {
ArrowLeft, Printer , Search, UserPlus, UserMinus, Trash2 , Plus, }
from "lucide React" ;
// IMPORTA el ticket (ajusta a tu alias si usas " @ " )
import KitchenTicket from " . . / . . /components/ui/feedback/KitchenTicket.jsx" ;
// Mock de categor ?as y productos (tus datos actuales)
const categorias = [ "Combos" , "Pupusas " ] ;
const productosPorCategoria = {
Combos: [ {
id: 1 , nombre: "Combo desayuno" , precio: 3 . 9 9 }
, {
id: 2 , nombre: "Combo almuerzo" , precio: 4 . 9 9 }
, {
id: 3 , nombre: "Combo cena" , precio: 5 . 9 9 }
, ] , Pupusas : [ {
id: 4 , nombre: "Pupusa de queso" , precio: 0 . 5 }
] , }
;
const OrderBuilder = ( )
= > {
const location = useLocation( )
;
const {
id }
= useParams( )
;
// Datos de navegaci?n const tipoOrden = location.state? .tipoOrden | | "comerAqui" ;
const mesa = location.state? .mesaId | | id | | null;
const cantidad = location.state? .personas | | 1 ;
// Estado const [orden, setOrden] = useState( [ ] )
;
const [categoriaActual, setCategoria] = useState( "Combos" )
;
const [personaActual, setPersona] = useState( 1 )
;
const [cantidadPersonas, setCantPer] = useState(cantidad)
;
const [search, setSearch] = useState( " " )
;
const productosEndRef = useRef(null)
;
const ordenEndRef = useRef(null)
;
const [eliminando, setEliminando] = useState(null)
;
// Ticket de cocina (modal)
const [showTicket, setShowTicket] = useState(false)
;
// Mock de restaurante/mesero (c?mbialos luego por datos reales de backend /auth)
const restaurante = {
nombre: "Restaurante Demo" }
;
const usuarioMesero = "Ana L?pez" ;
useEffect( ( )
= > {
if (tipoOrden ! = = "comerAqui" )
{
setCantPer( 1 )
;
setPersona( 1 )
;
}
}
, [tipoOrden] )
;
const agregarProducto = (producto)
= > {
// Suma l?nea;
si luego manejas cantidades o modificadores, agr閼?galas aqu? setOrden( (prev)
= > [ . . .prev, {
. . .producto, persona : personaActual, cantidad: 1 , // opcional: si luego soportas 2 del mismo plato en una l?nea // selectedMods: {
MULTI: {
grp_extras: [ "queso fresco" ] }
, QUANTITY: {
"huevos estrellados" : 2 }
}
}
, ] )
;
setTimeout( ( )
= > {
if (window.innerWidth > = 7 6 8 )
{
productosEndRef.current ? .scrollIntoView ( {
behavior: "smooth" }
)
;
}
}
, 1 0 0 )
;
}
;
const eliminarProducto = (idx)
= > {
setEliminando(idx)
;
setTimeout( ( )
= > {
setOrden( (prev)
= > prev.filter( ( _ , i)
= > i ! = = idx)
)
;
setEliminando(null)
;
}
, 3 0 0 )
;
}
;
const renderProductos = ( )
= > {
const productos = productosPorCategoria [categoriaActual] ? ? [ ] ;
return productos .filter( (p)
= > p.nombre.toLowerCase( )
.includes(search.toLowerCase( )
)
)
.map( (p)
= > ( <div key= {p.id}
onClick = {
( )
= > agregarProducto(p)
}
className= "bg slate 7 0 0 p 4 rounded text white flex justify between items center hover:bg slate 6 0 0 active:scale 9 5 transition all cursor pointer shadow md minh [ 6 0px] animate fadeIn" > <p className= "font semibold text sm" > {p.nombre}
< /p> <div className= "flex items center gap 2 " > <span className= "text slate 3 0 0 text xs" > $ {
(p.precio | | 0 )
.toFixed ( 2 )
}
< /span> <Plus size= {
2 0 }
className= "text [ # 0ea5e9 ] " / > < /div> < /div> )
)
;
}
;
const renderResumen = ( )
= > {
const porPersona = {
}
;
orden.forEach ( (item, idx)
= > {
if ( !porPersona[item.persona ] )
porPersona[item.persona ] = [ ] ;
porPersona[item.persona ] .push( {
. . .item, idx }
)
;
}
)
;
return Object.entries (porPersona)
.map( ( [persona , items] )
= > ( <div key= {persona }
className= "mb 2 bg slate 7 0 0 p 2 rounded " > <h3 className= "text green 4 0 0 font bold text sm mb 1 " > {tipoOrden = = = "comerAqui" ? `Persona $ {persona }
` : "Orden" }
< /h3 > {items.map( (item)
= > ( <div key= {item.idx}
className= {
`flex justify between items center text white text sm border b border slate 6 0 0 py 1 transition all duration 3 0 0 ease in out $ {
eliminando = = = item.idx ? "animate fadeOutDown opacity 0 " : " " }
` }
> <div className= "flex 1 " > <span> {item.nombre}
< /span> <span className= "text slate 4 0 0 ml 2 " > $ {item.precio.toFixed ( 2 )
}
< /span> < /div> <Trash2 size= {
1 4 }
className= "text red 4 0 0 cursor pointer hover:text red 6 0 0 " onClick = {
( )
= > eliminarProducto(item.idx)
}
/ > < /div> )
)
}
< /div> )
)
;
}
;
const agregarPersona = ( )
= > {
const nuevaCantidad = cantidadPersonas + 1 ;
setCantPer(nuevaCantidad)
;
setPersona(nuevaCantidad)
;
}
;
const subtotal = orden.reduce( (acc, item)
= > acc + item.precio, 0 )
;
const impuesto = subtotal * 0 . 1 3 ;
const total = subtotal + impuesto;
return ( <div className= "flex flex col h [ 8 0vh] minh 0 overflow hidden" > {
/ * Header * / }
<div className= "px 4 mt 4 flex justify between items center" > <h2 className= "text xl font semibold text white" > Nueva Orden {tipoOrden = = = "comerAqui" & & mesa ? ` Mesa $ {mesa}
` : " " }
< /h2 > <button onClick = {
( )
= > window.history .back( )
}
className= "flex items center bg transparent border border slate 5 0 0 hover:bg slate 6 0 0 text white px 3 py 1 . 5 rounded md text sm font medium gap 2 shadow sm transition all" > <ArrowLeft size= {
1 6 }
/ > Regresar < /button> < /div> <div className= "flex flex col md:flex row gap 4 px 4 mt 4 mb 4 flex 1 minh 0 overflowyauto" > {
/ * Panel izquierdo * / }
<div className= "order 3 md:order 1 w full md:w 1 / 3 flex flex col bg slate 8 0 0 rounded lg shadow md p 4 border border slate 7 0 0 maxh [ 5 0vh] md:maxhnone" > <div className= "flex flex col flex 1 overflow hidden" > <h2 className= "text white text lg font semibold mb 2 " > Detalle de la Orden ?閹?" " }
{tipoOrden = = = "comerAqui" ? `Mesa $ {mesa}
` : tipoOrden = = = "paraLlevar" ? "Para llevar" : "Empleado" }
< /h2 > {
/ * Lista de productos con scroll interno * / }
<div className= "flex 1 overflowyauto mb 3 border border slate 7 0 0 rounded p 2 bg slate 8 0 0 shadow inner custom scrollbar" > {renderResumen( )
}
<div ref= {ordenEndRef}
> < /div> < /div> {
/ * Totales * / }
<div className= "bg slate 7 0 0 text white text sm rounded p 3 mt 2 flex flex col gap 1 border border slate 6 0 0 " > <div className= "flex justify between " > <span>Total personas: < /span> <span> {cantidadPersonas}
< /span> < /div> <div className= "flex justify between " > <span>Subtotal: < /span> <span> $ {subtotal.toFixed ( 2 )
}
< /span> < /div> <div className= "flex justify between " > <span>Impuesto ( 1 3 % )
: < /span> <span> $ {impuesto.toFixed ( 2 )
}
< /span> < /div> <div className= "flex justify between font semibold text green 4 0 0 border t border slate 5 0 0 pt 1 " > <span>Total: < /span> <span> $ {total.toFixed ( 2 )
}
< /span> < /div> < /div> {
/ * Bot?n : Enviar a cocina (abre ticket)
* / }
<button disabled= {orden.length = = = 0 }
onClick = {
( )
= > setShowTicket(true)
}
className= "w full mt 3 bg green 6 0 0 hover:bg green 7 0 0 text white py 3 rounded font semibold flex items center justify center gap 2 disabled:opacity 5 0 text sm sm:text base" > <Printer size= {
1 8 }
/ > Enviar a cocina ( {tipoOrden}
)
< /button> < /div> < /div> {
/ * Panel central : personas * / }
{tipoOrden = = = "comerAqui" & & ( <div className= "order 1 w full md:w [ 7 0px] bg slate 7 0 0 rounded lg shadow md p 2 flex flex row md:flex col items center gap 2 " > <div className= "flex gap 2 md:flex col items center" > <button onClick = {agregarPersona }
className= "w 1 0 h 1 0 flex items center justify center bg slate 6 0 0 hover:bg slate 5 0 0 text white rounded full shadow md transition" title= "Agregar persona " > <UserPlus size= {
2 0 }
className= "text [ # 0ea5e9 ] " / > < /button> <button onClick = {
( )
= > setCantPer(Math.max( 1 , cantidadPersonas 1 )
)
}
className= "w 1 0 h 1 0 flex items center justify center bg slate 6 0 0 hover:bg slate 5 0 0 text white rounded full shadow md transition" title= "Quitar persona " > <UserMinus size= {
2 0 }
className= "text [ # 0ea5e9 ] " / > < /button> < /div> <div className= "flex 1 overflowyauto flex flex row md:flex col items center gap 3 w full custom scrollbar py 2 mt 2 " > {
[ . . .Array(cantidadPersonas)
] .map( ( _ , i)
= > ( <button key= {i}
onClick = {
( )
= > setPersona(i + 1 )
}
className= {
`w 1 0 h 1 0 rounded full border 2 text sm font bold shadow md transition colors duration 2 0 0 $ {
personaActual = = = i + 1 ? "bg green 6 0 0 text white border green 5 0 0 " : "bg slate 8 0 0 text white border slate 5 0 0 " }
` }
> {i + 1 }
< /button> )
)
}
< /div> < /div> )
}
{
/ * Panel derecho : men閻? * / }
<div className= "order 2 md:order 3 w full flex 1 overflowyauto minh [ 4 0vh] md:minh 0 bg slate 8 0 0 rounded lg shadow md p 4 border border slate 7 0 0 " > <h2 className= "text white text lg font semibold mb 2 " >Men閻? y Productos< /h2 > <div className= "border border slate 7 0 0 rounded p 4 bg slate 8 0 0 shadow inner mb 4 " > <div className= "grid grid cols 2 sm:grid cols 4 md:grid cols 5 gap 3 mb 4 " > {categorias.map( (cat)
= > ( <button key= {cat}
onClick = {
( )
= > setCategoria(cat)
}
className= {
`py 2 px 2 rounded text sm font semibold text white transition all duration 1 5 0 shadow md hover:scale 1 0 5 $ {
categoriaActual = = = cat ? "bg green 6 0 0 " : "bg slate 7 0 0 hover:bg slate 6 0 0 " }
` }
> {cat}
< /button> )
)
}
< /div> <div className= "flex items center gap 2 " > <Search size= {
1 8 }
className= "text [ # 0ea5e9 ] " / > <input type= "text" placeholder= "Buscar producto. . . " value= {search}
onChange= {
(e)
= > setSearch(e.target.value)
}
className= "w full px 3 py 2 rounded bg slate 6 0 0 text white border border slate 5 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > < /div> < /div> <div className= "flex 1 minh 0 overflowyauto border border slate 7 0 0 rounded p 4 bg slate 8 0 0 shadow inner custom scrollbar" > <h3 className= "text yellow 4 0 0 font semibold text sm mb 3 " > Productos: {categoriaActual}
< /h3 > <div className= "flex 1 minh 0 overflowyauto custom scrollbar" > <div className= "grid gap 4 grid cols 1 sm:grid cols 2 md:grid cols 3 lg:grid cols 4 xl:grid cols 5 " > {renderProductos( )
}
<div ref= {productosEndRef}
> < /div> < /div> < /div> < /div> < /div> < /div> {
/ * Modal: Ticket de cocina * / }
{showTicket & & ( <div className= "fixed inset 0 z 5 0 bg black/ 6 0 flex items end sm:items center justify center p 2 sm:p 4 " > <div className= "w full maxwmd bg slate 9 0 0 border border slate 7 0 0 rounded 2xl p 4 shadow xl" > {
/ * IMPORTANT: El ID delimita lo que se imprime * / }
<div id= "kitchen ticket" > <KitchenTicket orden= {orden}
meta= {
{
restaurante: restaurante.nombre, mesero: usuarioMesero, tipoOrden, mesa, // orderNumber: " 1 0 4 5 " , // ??cuando tengas backend , mu閼?stralo aqu? }
}
onClose = {
( )
= > setShowTicket(false)
}
/ > < /div> < /div> < /div> )
}
< /div> )
;
}
;
export default OrderBuilder;