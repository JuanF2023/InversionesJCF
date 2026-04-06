// src/pages/Restaurante/forms/PortionForm.jsx import React, {
useState, useEffect }
from "react" ;
import {
Pencil, Power }
from "lucide React" ;
const PortionForm = ( )
= > {
const [tipoPreparacion, setTipoPreparacion] = useState( " " )
;
const [nombre, setNombre] = useState( " " )
;
const [categoria, setCategoria] = useState( " " )
;
const [tamano, setTamano] = useState( " " )
;
const [unidad, setUnidad] = useState( " " )
;
const [costo, setCosto] = useState( " " )
;
const [precioVenta, setPrecioVenta ] = useState( " " )
;
const [confirmado, setConfirmado] = useState(false)
;
const [busqueda, setBusqueda] = useState( " " )
;
const [porciones, setPorciones] = useState( [ ] )
;
const [editandoIndex, setEditandoIndex] = useState(null)
;
const [imagen, setImagen] = useState(null)
;
const [preview , setPreview] = useState(null)
;
// M?rgenes por tipo de preparaci?n const margenesPorTipo = {
produccion: 0 . 4 5 , reventa : 0 . 2 , ensamblado: 0 . 3 5 , combo: 0 . 2 5 , }
;
useEffect( ( )
= > {
const dataGuardada = localStorage.getItem ( "porciones" )
;
if (dataGuardada)
setPorciones(JSON.parse(dataGuardada)
)
;
}
, [ ] )
;
useEffect( ( )
= > {
localStorage.setItem ( "porciones" , JSON.stringify(porciones)
)
;
}
, [porciones] )
;
// C?lculos de precios y m?rgenes const costoBase = parseFloat(costo)
| | 0 ;
const margenSugeridoValor = tipoPreparacion ? costoBase * (margenesPorTipo[tipoPreparacion] | | 0 )
: 0 ;
const precioSugerido = costoBase ? (costoBase + margenSugeridoValor)
.toFixed ( 2 )
: " 0 . 0 0 " ;
const precioReal = parseFloat(precioVenta)
| | 0 ;
const margenSugerido = costoBase ? ( (margenSugeridoValor / costoBase)
* 1 0 0 )
.toFixed ( 2 )
: " 0 " ;
const margenReal = costoBase ? ( ( (precioReal costoBase)
/ costoBase)
* 1 0 0 )
.toFixed ( 2 )
: " 0 " ;
// Recomendaci?n let recomendacion = " " ;
if (precioReal < parseFloat(precioSugerido )
)
{
recomendacion = " ?閻?缁? Precio menor al sugerido. Considera aumentarlo. " ;
}
else if (precioReal = = = parseFloat(precioSugerido )
)
{
recomendacion = " ??Precio igual al sugerido. Configuraci?n aceptable. " ;
}
else {
recomendacion = " ??Precio mayor al sugerido. Configuraci?n ?ptima. " ;
}
const resetFormulario = ( )
= > {
setNombre( " " )
;
setCategoria( " " )
;
setTamano( " " )
;
setUnidad( " " )
;
setCosto( " " )
;
setPrecioVenta ( " " )
;
setTipoPreparacion( " " )
;
setConfirmado(false)
;
setImagen(null)
;
setPreview(null)
;
setEditandoIndex(null)
;
}
;
const formularioLleno = nombre & & categoria & & tipoPreparacion & & tamano & & unidad & & costo & & precioVenta;
const handleSubmit = (e)
= > {
e.preventdefault ( )
;
if ( !confirmado | | !formularioLleno)
return;
const nuevaPorcion = {
nombre, categoria, tipoPreparacion, tamano: parseFloat(tamano)
, unidad, costo: costoBase, margen: parseFloat(margenSugerido )
, precioSugerido : parseFloat(precioSugerido )
, precioVenta: precioReal, imagen: preview , creadoPor: "sistema " , fechaCreacion: new Date( )
.toISOString( )
, activo: true, }
;
if (editandoIndex ! = = null)
{
const nuevasPorciones = [ . . .porciones] ;
nuevasPorciones[editandoIndex] = nuevaPorcion;
setPorciones(nuevasPorciones)
;
}
else {
setPorciones( [nuevaPorcion, . . .porciones] )
;
}
resetFormulario( )
;
}
;
const handleEdit = (index)
= > {
const porcion = porciones[index] ;
setNombre(porcion .nombre)
;
setCategoria(porcion .categoria)
;
setTamano(porcion .tamano)
;
setUnidad(porcion .unidad)
;
setCosto(porcion .costo)
;
setPrecioVenta (porcion .precioVenta)
;
setTipoPreparacion(porcion .tipoPreparacion | | " " )
;
setPreview(porcion .imagen | | null)
;
setEditandoIndex(index)
;
setConfirmado(false)
;
}
;
const toggleActivo = (index)
= > {
const nuevasPorciones = [ . . .porciones] ;
nuevasPorciones[index] .activo = !nuevasPorciones[index] .activo;
setPorciones(nuevasPorciones)
;
}
;
const iconoPorCategoria = {
entrada : " 妫?瀹?" , principal: " 妫?瀹??? , postre: " 妫?瀹?" , bebida: " 妫?閵?" , }
;
const categoriasUnicas = [ . . .new Set(porciones.map( (p)
= > p.categoria)
)
] ;
const total = porciones.length;
const promedioPrecio = total ? ( porciones.reduce( (sum, p)
= > sum + parseFloat(p.precioVenta | | 0 )
, 0 )
/ total )
.toFixed ( 2 )
: 0 ;
return ( <div className= "grid grid cols 1 lg:grid cols 2 gap 6 mt 6 text white" > {
/ * Panel izquierdo * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 " > <h2 className= "text xl font bold text yellow 3 0 0 mb 1 " > 妫?瀹???Porciones< /h2 > <p className= "text sm text slate 3 0 0 mb 4 " > Registrar nueva porci?n para el men閻?. < /p> <form onSubmit= {handleSubmit}
className= "spacey 3 " > <input type= "text" value= {nombre}
onChange= {
(e)
= > setNombre(e.target.value)
}
placeholder= "Nombre" className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required / > <input type= "number" value= {costo}
onChange= {
(e)
= > setCosto(e.target.value)
}
placeholder= "Costo base" className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required / > <input type= "number" value= {precioVenta}
onChange= {
(e)
= > setPrecioVenta (e.target.value)
}
placeholder= "Precio de venta" className= {
`w full px 4 py 2 rounded md $ {precioVenta < precioSugerido | | precioVenta < costo ? "bg red 1 0 0 text red 7 0 0 " : "bg [ # 2c3e5 0 ] text white" }
` }
required / > <select value= {categoria}
onChange= {
(e)
= > setCategoria(e.target.value)
}
className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required > <option value= " " disabled hidden> Seleccione categor ?a < /option> <option value= "entrada " >Entrada < /option> <option value= "principal" >Plato principal< /option> <option value= "postre" >Postre< /option> <option value= "bebida" >Bebida< /option> < /select> <select value= {tipoPreparacion}
onChange= {
(e)
= > setTipoPreparacion(e.target.value)
}
className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required > <option value= " " disabled hidden> Seleccione tipo de preparaci?n < /option> <option value= "produccion" >Producci?n < /option> <option value= "reventa " >Reventa < /option> <option value= "ensamblado" >Ensamblado< /option> <option value= "combo" >Combo< /option> < /select> <div className= "grid grid cols 1 sm:grid cols 2 gap 4 " > <input type= "number" value= {tamano}
onChange= {
(e)
= > setTamano(e.target.value)
}
placeholder= "Tama鐢?o " className= "px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required / > <select value= {unidad}
onChange= {
(e)
= > setUnidad(e.target.value)
}
className= "px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required > <option value= " " disabled hidden> Unidad < /option> <option value= "oz" >oz< /option> <option value= "piezas" >piezas< /option> <option value= "rodajas " >rodajas < /option> <option value= "unidades" >unidades< /option> < /select> < /div> {
/ * Valores calculados * / }
{
/ * Precio sugerido y precio real * / }
<div className= "grid grid cols 1 sm:grid cols 2 gap 2 " > <input type= "text" value= {
`Precio sugerido: $ $ {precioSugerido }
` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > <input type= "text" value= {
`Margen sugerido: $ {margenSugerido }
% ` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > < /div> {
/ * Margen sugerido y margen real * / }
<div className= "grid grid cols 1 sm:grid cols 2 gap 2 " > <input type= "text" value= {
`Precio real: $ $ {precioVenta}
` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > <input type= "text" value= {
`Margen real: $ {margenReal}
% ` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > < /div> {
/ * Resumen din?mico * / }
{formularioLleno & & ( <div className= {
`p 3 rounded md text sm mt 3 $ {precioVenta < precioSugerido ? "bg yellow 1 0 0 border border yellow 4 0 0 text yellow 8 0 0 " : precioVenta = = precioSugerido ? "bg blue 1 0 0 border border blue 4 0 0 text blue 8 0 0 " : "bg green 1 0 0 border border green 4 0 0 text green 8 0 0 " }
` }
> <p className= "font bold mb 1 " > 妫?闉? Resumen < /p> <p> {recomendacion}
< /p> <p>Costo base: $ {costoBase.toFixed ( 2 )
}
< /p> <p>Precio sugerido: $ {precioSugerido }
< /p> <p>Margen sugerido: {margenSugerido }
% < /p> <p>Margen real: {margenReal}
% < /p> < /div> )
}
{
/ * Confirmaci?n * / }
{formularioLleno & & ( <div className= "bg yellow 1 0 0 border border yellow 4 0 0 p 3 rounded md text yellow 8 0 0 text sm mt 3 " > <label className= "inline flex items center text sm" > <input type= "checkbox" checked = {confirmado}
onChange= {
(e)
= > setConfirmado(e.target.checked )
}
className= "form checkbox h 4 w 4 text yellow 5 0 0 " / > <span className= "ml 2 " > Confirmo que deseo registrar esta porci?n < /span> < /label> < /div> )
}
{
/ * Botones * / }
<div className= "flex gap 3 " > <button type= "submit" className= "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 6 py 2 rounded md" disabled= {
!confirmado | | !formularioLleno}
> Guardar < /button> <button type= "button" onClick = {resetFormulario}
className= "bg slate 6 0 0 hover:bg slate 7 0 0 text white font semibold px 6 py 2 rounded md" > Cancelar < /button> < /div> < /form> < /div> {
/ * Panel derecho * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 " > <h3 className= "text lg font bold text yellow 3 0 0 mb 2 " > Porciones registradas < /h3 > <input type= "text" placeholder= "Buscar. . . " value= {busqueda}
onChange= {
(e)
= > setBusqueda(e.target.value)
}
className= "px 4 py 2 mb 3 rounded bg [ # 2c3e5 0 ] text white w full" / > <div className= "overflowyauto maxh [ 4 0 0px] spacey 2 pr 2 " > {porciones .filter( (p)
= > p.nombre.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
| | p.categoria.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
)
.map( (p, i)
= > ( <div key= {i}
className= "p 3 rounded shadow bg slate 1 0 0 text black relative group hover:bg slate 2 0 0 transition" > <div> <p className= "font semibold" > {iconoPorCategoria[p.categoria] | | " 妫?瀹?" }
{p.nombre}
< /p> <p className= "text sm" > {p.categoria}
?? {p.tamano}
{p.unidad}
< /p> <p className= "text sm font semibold" > Precio: $ {p.precioVenta}
< /p> <p className= {
`text xs mt 1 $ {p.activo ? "text green 6 0 0 " : "text red 6 0 0 " }
` }
> {p.activo ? "Activo" : "Inactivo" }
< /p> < /div> <div className= "flex flex col items end gap 2 absolute top 2 right 2 " > <button title= "Editar porci?n " onClick = {
( )
= > handleEdit(i)
}
className= "p 2 rounded full text blue 6 0 0 hover:text blue 8 0 0 transition transform transform hover:scale 1 1 0 focus:outline none active:scale 9 5 " > <Pencil size= {
2 0 }
/ > < /button> <button title= {p.activo ? "Desactivar porci?n " : "Activar porci?n " }
onClick = {
( )
= > toggleActivo(i)
}
className= {
`p 2 rounded full transition transform transform hover:scale 1 1 0 focus:outline none active:scale 9 5 $ {p.activo ? "text red 5 0 0 hover:text red 7 0 0 " : "text green 6 0 0 hover:text green 8 0 0 " }
` }
> <Power size= {
2 0 }
/ > < /button> < /div> < /div> )
)
}
< /div> <div className= "border t border yellow 5 0 0 pt 3 mt 3 text sm text slate 4 0 0 " > <p>Total: {total}
porciones< /p> <p>Precio promedio: $ {promedioPrecio }
< /p> <p>Categor ?as: {categoriasUnicas.length}
< /p> < /div> < /div> < /div> )
;
}
;
export default PortionForm;