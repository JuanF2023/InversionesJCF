// src/pages/Restaurante/forms/ComboForm.jsx import React, {
useState, useEffect }
from "react" ;
import ModalSelector from " @ /features/corporativo/components/modals/ModalSelector" ;
import {
Pencil, Power, X }
from "lucide React" ;
const ComboForm = ( )
= > {
const [nombreCombo, setNombreCombo ] = useState( " " )
;
const [categoria, setCategoria] = useState( " " )
;
const [imagen, setImagen] = useState(null)
;
const [preview , setPreview] = useState(null)
;
const [confirmado, setConfirmado] = useState(false)
;
const [precioVenta, setPrecioVenta ] = useState( " " )
;
const [porcionPrincipal, setPorcionPrincipal] = useState( " " )
;
const [sidesPermitidos, setSidesPermitidos] = useState( [ ] )
;
const [cantidadSides, setCantidadSides] = useState( 2 )
;
const [modalTipo, setModalTipo] = useState( " " )
;
const [mostrarModal, setMostrarModal] = useState(false)
;
const [porcionesDisponibles, setPorcionesDisponibles] = useState( [ ] )
;
const [combosGuardados, setCombosGuardados] = useState( [ ] )
;
const [modoEdicion, setModoEdicion ] = useState(false)
;
const [comboEnEdicion , setComboEnEdicion] = useState(null)
;
const [feedbackGuardado, setFeedbackGuardado] = useState( " " )
;
const [busquedaCombo, setBusquedaCombo] = useState( " " )
;
// Margenes por tipo const margenesPorTipo = {
produccion: 0 . 4 5 , reventa : 0 . 2 , ensamblado: 0 . 3 5 , combo: 0 . 2 5 , }
;
useEffect( ( )
= > {
setPorcionesDisponibles( [ {
id: "por_ 1 " , nombre: "Papas fritas" , costoBase: 1 . 5 , tipoPreparacion: "produccion" }
, {
id: "por_ 2 " , nombre: "Pollo frito" , costoBase: 3 . 0 , tipoPreparacion: "produccion" }
, {
id: "por_ 3 " , nombre: "Soda 1 2oz" , costoBase: 0 . 8 , tipoPreparacion: "reventa " }
, {
id: "por_ 4 " , nombre: "Hamburguesa" , costoBase: 2 . 8 , tipoPreparacion: "produccion" }
, ] )
;
}
, [ ] )
;
const calcularResumen = ( )
= > {
const sides = porcionesDisponibles.filter( (p)
= > sidesPermitidos.includes(p.id)
)
;
const porcion = porcionesDisponibles.find( (p)
= > p.id = = = porcionPrincipal)
;
const todas = [ . . .sides, porcion ] .filter(Boolean )
;
let costo = 0 ;
let margen = 0 ;
if (todas.length > 0 )
{
const maxCosto = Math.max( . . .todas.map( (p)
= > p.costoBase)
)
;
const itemMayorCosto = todas.find( (p)
= > p.costoBase = = = maxCosto)
;
costo = itemMayorCosto .costoBase;
margen = costo * (margenesPorTipo[itemMayorCosto .tipoPreparacion] | | 0 )
;
}
const precioSugerido = (costo + margen)
.toFixed ( 2 )
;
const margenTotal = precioVenta & & costo ? ( ( (parseFloat(precioVenta)
costo)
/ costo)
* 1 0 0 )
.toFixed ( 2 )
: 0 ;
return {
costo: costo.toFixed ( 2 )
, precioSugerido , margenTotal }
;
}
;
const resumen = calcularResumen( )
;
// Variables para el comparativo const precioSugerido = parseFloat(resumen .precioSugerido )
| | 0 ;
const margenSugerido = parseFloat(resumen .costo)
? ( ( (precioSugerido parseFloat(resumen .costo)
)
/ parseFloat(resumen .costo)
)
* 1 0 0 )
.toFixed ( 2 )
: 0 ;
const precioReal = parseFloat(precioVenta)
| | 0 ;
const margenReal = parseFloat(resumen .costo)
? ( ( (precioReal parseFloat(resumen .costo)
)
/ parseFloat(resumen .costo)
)
* 1 0 0 )
.toFixed ( 2 )
: 0 ;
const formularioLleno = nombreCombo & & categoria & & porcionPrincipal & & precioVenta;
const mostrarResumen = formularioLleno;
const esMenor = parseFloat(precioVenta)
< precioSugerido ;
const esIgual = parseFloat(precioVenta)
= = = precioSugerido ;
const esMayor = parseFloat(precioVenta)
> precioSugerido ;
let recomendacion = " " ;
if (precioReal < precioSugerido )
{
recomendacion = " ?閻?缁? Precio menor al sugerido. Considera aumentarlo. " ;
}
else if (precioReal = = = precioSugerido )
{
recomendacion = " ??Precio igual al sugerido. Configuraci?n aceptable. " ;
}
else {
recomendacion = " ??Precio mayor al sugerido. Configuraci?n ?ptima. " ;
}
const handleSeleccion = (seleccion)
= > {
if (modalTipo = = = "principal" )
{
setPorcionPrincipal(seleccion | | " " )
;
}
else {
setSidesPermitidos(Array.isArray (seleccion)
? seleccion.filter(Boolean )
: [ ] )
;
}
setMostrarModal(false)
;
}
;
const quitarSide = (id)
= > {
setSidesPermitidos(sidesPermitidos.filter( (sideId)
= > sideId ! = = id)
)
;
}
;
const resetFormulario = ( )
= > {
setNombreCombo ( " " )
;
setCategoria( " " )
;
setImagen(null)
;
setPreview(null)
;
setPrecioVenta ( " " )
;
setConfirmado(false)
;
setSidesPermitidos( [ ] )
;
setPorcionPrincipal( " " )
;
setCantidadSides( 2 )
;
setModoEdicion (false)
;
setComboEnEdicion(null)
;
}
;
const handleSubmit = (e)
= > {
e.preventdefault ( )
;
if ( !confirmado | | !formularioLleno)
return;
const nuevoCombo = {
tipoVenta: "combo" , nombreCombo, categoria, porcionPrincipal, sidesPermitidos, cantidadSides, precioVenta: precioReal, costoTotal: parseFloat(resumen .costo)
, margenTotal: parseFloat(resumen .margenTotal)
, foto: preview , creadoPor: "sistema " , fechaCreacion: new Date( )
.toISOString( )
, activo: true, }
;
if (modoEdicion & & comboEnEdicion ! = = null)
{
const nuevosCombos = [ . . .combosGuardados] ;
nuevosCombos[comboEnEdicion ] = {
. . .nuevoCombo }
;
setCombosGuardados(nuevosCombos)
;
setFeedbackGuardado( " ??Combo actualizado" )
;
}
else {
setCombosGuardados( [nuevoCombo, . . .combosGuardados] )
;
setFeedbackGuardado( " ??Combo guardado" )
;
}
resetFormulario( )
;
}
;
const handleEditCombo = (index)
= > {
const combo = combosGuardados[index] ;
setNombreCombo (combo.nombreCombo)
;
setCategoria(combo.categoria)
;
setPrecioVenta (combo.precioVenta.toString( )
)
;
setPorcionPrincipal(combo.porcionPrincipal)
;
setSidesPermitidos(combo.sidesPermitidos | | [ ] )
;
setCantidadSides(combo.cantidadSides | | 2 )
;
setPreview(combo.foto | | null)
;
setModoEdicion (true)
;
setComboEnEdicion(index)
;
}
;
const toggleComboActivo = (index)
= > {
const nuevosCombos = [ . . .combosGuardados] ;
nuevosCombos[index] .activo = !nuevosCombos[index] .activo;
setCombosGuardados(nuevosCombos)
;
}
;
// Resumen para el panel derecho const totalCombos = combosGuardados.length;
const promedioPrecioCombos = totalCombos ? (combosGuardados.reduce( (sum, c)
= > sum + parseFloat(c.precioVenta | | 0 )
, 0 )
/ totalCombos)
.toFixed ( 2 )
: 0 ;
const categoriasUnicasCombos = [ . . .new Set(combosGuardados.map( (c)
= > c.categoria)
)
] ;
return ( < > <div className= "grid grid cols 1 lg:grid cols 2 gap 6 mt 6 text white" > <div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 " > <h2 className= "text xl font bold text yellow 3 0 0 mb 4 " > 妫?瀹? Crear Combo< /h2 > <form onSubmit= {handleSubmit}
className= "spacey 3 " > {
/ * Nombre y categor ?a * / }
<div className= "flex gap 3 " > <input value= {nombreCombo}
onChange= {
(e)
= > setNombreCombo (e.target.value)
}
placeholder= "Nombre del combo" className= "flex 1 px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required / > <select value= {categoria}
onChange= {
(e)
= > setCategoria(e.target.value)
}
className= "w 1 / 2 px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" required> <option value= " " disabled hidden>Seleccione categor ?a < /option> <option value= "comida" >Comida Casera< /option> <option value= "hamburguesa" >Hamburguesas< /option> <option value= "pollo" >Pollo Frito< /option> < /select> < /div> {
/ * Porci?n principal * / }
<label className= "block text yellow 3 0 0 font semibold" >Porci?n principal< /label> <button type= "button" onClick = {
( )
= > {
setModalTipo( "principal" )
;
setMostrarModal(true)
;
}
}
className= "w full px 4 py 3 text left bg [ # 2c3e5 0 ] text white rounded md hover:bg [ # 3 3 4 9 5e] cursor pointer active:scale [ 0 . 9 8 ] transition" > {porcionPrincipal ? porcionesDisponibles.find(p = > p.id = = = porcionPrincipal)
? .nombre : "Seleccionar porci?n principal" }
< /button> {porcionPrincipal & & ( <div className= "mt 2 flex items center gap 1 bg yellow 2 0 0 text black px 3 py 1 rounded full w max" > <span> {porcionesDisponibles.find(p = > p.id = = = porcionPrincipal)
? .nombre}
< /span> <button type= "button" onClick = {
( )
= > setPorcionPrincipal( " " )
}
> <X size= {
1 4 }
/ > < /button> < /div> )
}
{
/ * Sides * / }
<label className= "block text yellow 3 0 0 font semibold" >Sides permitidos< /label> <button type= "button" onClick = {
( )
= > {
setModalTipo( "sides" )
;
setMostrarModal(true)
;
}
}
className= "w full px 4 py 3 text left bg [ # 2c3e5 0 ] text white rounded md hover:bg [ # 3 3 4 9 5e] cursor pointer active:scale [ 0 . 9 8 ] transition" > {sidesPermitidos.length > 0 ? `Editar acompa鐢?amientos ( $ {sidesPermitidos.length}
seleccionados)
` : "Seleccionar acompa鐢?amientos " }
< /button> <div className= "flex flex wrap gap 2 mt 2 " > {sidesPermitidos.map(id = > porcionesDisponibles.find(p = > p.id = = = id)
)
.filter(Boolean )
.map(side = > ( <div key= {side.id}
className= "flex items center gap 1 bg yellow 2 0 0 text black px 3 py 1 rounded full" > <span> {side.nombre}
< /span> <button type= "button" onClick = {
( )
= > quitarSide(side.id)
}
> <X size= {
1 4 }
/ > < /button> < /div> )
)
}
< /div> {
/ * Cantidad de sides * / }
<div className= "flex items center gap 2 " > <label className= "text yellow 3 0 0 font semibold" >Cantidad de sides requeridos: < /label> <input type= "number" min= {
0 }
value= {cantidadSides}
onChange= {
(e)
= > setCantidadSides(Number(e.target.value)
)
}
className= "w 2 0 px 3 py 1 rounded bg [ # 2c3e5 0 ] text white" / > < /div> {
/ * Precio de venta * / }
<input type= "number" value= {precioVenta}
onChange= {
(e)
= > setPrecioVenta (e.target.value)
}
placeholder= "Establecer precio de venta" className= {
`w full px 4 py 2 rounded md $ {parseFloat(precioVenta)
< parseFloat(resumen .costo)
? "bg red 1 0 0 text red 6 0 0 " : "bg [ # 2c3e5 0 ] text white" }
` }
required / > {
/ * Resumen visual de comparaci?n * / }
{mostrarResumen & & ( <div className= {
`p 3 rounded md text sm mt 3 $ {esMenor ? "bg yellow 1 0 0 border border yellow 4 0 0 text yellow 8 0 0 " : esIgual ? "bg blue 1 0 0 border border blue 4 0 0 text blue 8 0 0 " : "bg green 1 0 0 border border green 4 0 0 text green 8 0 0 " }
` }
> <p className= "font bold mb 1 " > 妫?闉? Resumen < /p> <p> {recomendacion}
< /p> < /div> )
}
{
/ * Valores calculados * / }
<div className= "mb 2 " > <input readOnly value= {
`Costo: $ $ {resumen .costo}
` }
className= "w full px 3 py 2 rounded bg slate 8 0 0 text slate 3 0 0 " / > < /div> {
/ * Precio sugerido y margen sugerido * / }
<div className= "grid grid cols 1 sm:grid cols 2 gap 2 " > <input type= "text" value= {
`Precio sugerido: $ $ {precioSugerido }
` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > <input type= "text" value= {
`Margen sugerido: $ {margenSugerido }
% ` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > < /div> {
/ * Precio real y margen real * / }
<div className= "grid grid cols 1 sm:grid cols 2 gap 2 " > <input type= "text" value= {
`Precio real: $ $ {precioVenta}
` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > <input type= "text" value= {
`Margen real: $ {margenReal}
% ` }
readOnly className= "w full px 4 py 2 bg slate 8 0 0 text slate 3 0 0 rounded md" / > < /div> {
/ * Checkbox de confirmaci?n * / }
{formularioLleno & & ( <div className= "bg yellow 1 0 0 border border yellow 4 0 0 p 3 rounded md text yellow 8 0 0 text sm mt 3 " > <label className= "inline flex items center text sm" > <input type= "checkbox" checked = {confirmado}
onChange= {
(e)
= > setConfirmado(e.target.checked )
}
className= "form checkbox h 4 w 4 text yellow 5 0 0 " / > <span className= "ml 2 " >Confirmo que deseo registrar este combo< /span> < /label> < /div> )
}
{
/ * Botones * / }
<div className= "flex gap 3 " > <button type= "submit" className= "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 6 py 2 rounded md" disabled= {
!confirmado | | !formularioLleno}
>Guardar < /button> <button type= "button" onClick = {resetFormulario}
className= "bg slate 6 0 0 hover:bg slate 7 0 0 text white font semibold px 6 py 2 rounded md" >Cancelar< /button> < /div> < /form> < /div> {
/ * Panel derecho * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 text white" > <h3 className= "text lg font bold text yellow 3 0 0 mb 2 " >Combos registrados< /h3 > <input type= "text" placeholder= "Buscar combo. . . " value= {busquedaCombo}
onChange= {
(e)
= > setBusquedaCombo(e.target.value)
}
className= "px 4 py 2 mb 3 rounded bg [ # 2c3e5 0 ] text white w full" / > <div className= "overflowyauto maxh [ 4 0 0px] spacey 2 pr 2 " > {combosGuardados.filter( (c)
= > c.nombreCombo.toLowerCase( )
.includes(busquedaCombo.toLowerCase( )
)
)
.map( (combo, index)
= > ( <div key= {index}
className= "bg slate 1 0 0 text black p 3 rounded shadow relative group hover:bg slate 2 0 0 transition" > <p className= "font semibold" > {combo.nombreCombo}
< /p> <p className= "text sm text gray 7 0 0 " > {combo.categoria}
< /p> <p className= "text sm font semibold" >Precio: $ {combo.precioVenta}
< /p> <p className= {
`text xs mt 1 $ {combo.activo ? "text green 6 0 0 " : "text red 6 0 0 " }
` }
> {combo.activo ? "Activo" : "Inactivo" }
< /p> <div className= "flex flex col items end gap 2 absolute top 2 right 2 " > <button title= "Editar combo" onClick = {
( )
= > handleEditCombo(index)
}
className= "p 2 rounded full text blue 6 0 0 hover:text blue 8 0 0 transition transform transform hover:scale 1 1 0 focus:outline none active:scale 9 5 " > <Pencil size= {
2 0 }
/ > < /button> <button title= {combo.activo ? "Desactivar combo" : "Activar combo" }
onClick = {
( )
= > toggleComboActivo(index)
}
className= {
`p 2 rounded full transition transform transform hover:scale 1 1 0 focus:outline none active:scale 9 5 $ {combo.activo ? "text red 5 0 0 hover:text red 7 0 0 " : "text green 6 0 0 hover:text green 8 0 0 " }
` }
> <Power size= {
2 0 }
/ > < /button> < /div> < /div> )
)
}
< /div> <div className= "border t border yellow 5 0 0 pt 3 mt 3 text sm text slate 4 0 0 " > <p>Total: {totalCombos}
combos< /p> <p>Precio promedio: $ {promedioPrecioCombos}
< /p> <p>Categor ?as: {categoriasUnicasCombos.length}
< /p> < /div> < /div> < /div> <ModalSelector visible = {mostrarModal}
modo= {modalTipo = = = "principal" ? "single" : "multi" }
porciones= {porcionesDisponibles}
seleccionActual= {modalTipo = = = "principal" ? porcionPrincipal : sidesPermitidos}
onSeleccionar= {handleSeleccion}
onClose = {
( )
= > setMostrarModal(false)
}
/ > < / > )
;
}
;
export default ComboForm;