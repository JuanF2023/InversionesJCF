// src/features/corporativo/components/modals/AddBusinessModal.jsx / * * * Modal para crear/editar negocios. * Versi?n A (Est?ndar)
: resumen claro + bloque financiero (suma mensual , promedio, proyecci?n )
. * / import React, {
useMemo , useState, useEffect }
from "react" ;
import BaseModal from " . /BaseModal.jsx" ;
import BusinessTypePicker from " . /BusinessTypePicker.jsx" ;
import {
createBusiness , updateBusiness }
from " @ /features/corporativo/api" ;
import {
Plus, Trash2 }
from "lucide React" ;
/ * = = = = = = = = = = = = = = = = = = = = = = = = = Utilidades / constantes = = = = = = = = = = = = = = = = = = = = = = = = = * / const FORM_DEFAULTS = {
codigo: " " , nombre: " " , descripcion: " " , tipoId: " " , tipoNombre: " " , categoriaId: " " , categoriaNombre: " " , estado: "activo" , fechaInicioOperacion: " " , // "YYYY MM DD" propiedadId: " " , // importante: como string para select }
;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const fieldClass = (valid)
= > valid ? "neo input h 1 2 px 3 text [ 1 5px] " : "neo input h 1 2 px 3 text [ 1 5px] ring 2 ring red 4 0 0 bg red 5 0 " ;
/ * = = = = = = = = = = = = = = = = = = = = = = = = = Componente = = = = = = = = = = = = = = = = = = = = = = = = = * / export default function AddBusinessModal( {
open, onClose , onSaved , properties = [ ] , initialData, mode = "create" , ensureProperties, }
)
{
// form principal const [form, setForm ] = useState(FORM_DEFAULTS)
;
// unidades const [units, setUnits] = useState( [ ] )
;
const [addingUnits, setAddingUnits ] = useState(false)
;
// ui const [showTypePicker , setShowTypePicker] = useState(false)
;
const [saving, setSaving] = useState(false)
;
const [showConfirm, setShowConfirm ] = useState(false)
;
const [errors, setErrors] = useState( [ ] )
;
const [touched , setTouched] = useState(false)
;
/ * Hidratar al abrir / editar * / useEffect( ( )
= > {
if ( !open)
return;
if (mode = = = "edit" & & initialData)
{
const norm = {
codigo: initialData.codigo ? ? initialData.code ? ? " " , nombre: initialData.nombre ? ? initialData.name ? ? " " , tipoId: initialData.tipoId ? ? initialData.typeId ? ? " " , tipoNombre: initialData.tipoNombre ? ? initialData.typeName ? ? " " , categoriaId: initialData.categoriaId ? ? initialData.categoryId ? ? " " , categoriaNombre: initialData.categoriaNombre ? ? initialData.categoryName ? ? " " , estado: initialData.estado ? ? initialData.status ? ? "activo" , propiedadId: String(initialData.propiedadId ? ? initialData.propertyId ? ? " " )
, descripcion: initialData.descripcion ? ? initialData.description ? ? " " , fechaInicioOperacion: initialData.fechaInicioOperacion ? String(initialData.fechaInicioOperacion)
.slice( 0 , 1 0 )
: " " , }
;
setForm (norm)
;
const u = Array.isArray (initialData.unidades ? ? initialData.units)
? (initialData.unidades ? ? initialData.units)
: [ ] ;
setUnits( u.map( (x)
= > ( {
codigo: x.codigo ? ? x.code ? ? " " , rentaMensual: x.rentaMensual ? ? x.monthlyRent ? ? " " , estadoUnidad: x.estadoUnidad ? ? x.unitStatus ? ? "disponible" , descripcion: x.descripcion ? ? x.description ? ? " " , fechaProgramadaPago: x.fechaProgramadaPago ? ? x.scheduledPayDay ? ? " " , }
)
)
)
;
setAddingUnits (u.length > 0 )
;
setErrors( [ ] )
;
setTouched(false)
;
}
else {
setForm (FORM_DEFAULTS)
;
setUnits( [ ] )
;
setAddingUnits (false)
;
setErrors( [ ] )
;
setTouched(false)
;
}
}
, [open, mode, initialData] )
;
// Carga perezosa de propiedades useEffect( ( )
= > {
if (open & & ensureProperties & & ( !properties | | properties.length = = = 0 )
)
ensureProperties( )
;
}
, [open, ensureProperties, properties? .length] )
;
const up = (k, v)
= > setForm ( (s)
= > ( {
. . .s, [k] : v }
)
)
;
/ * Validaciones * / const businessValid = useMemo ( ( )
= > form.codigo.trim( )
& & form.nombre.trim( )
& & (form.tipoId | | form.tipoNombre)
& & form.propiedadId & & form.estado, [form] )
;
const unitsValid = useMemo ( ( )
= > {
if ( !addingUnits)
return true;
if (units.length = = = 0 )
return false;
for (const u of units)
{
if ( !u.codigo? .trim( )
)
return false;
if (u.rentaMensual = = = " " | | isNaN(Number(u.rentaMensual)
)
)
return false;
if ( !u.estadoUnidad)
return false;
const d = Number(u.fechaProgramadaPago)
;
if ( !Number.isInteger(d)
| | d < 1 | | d > 3 1 )
return false;
}
return true;
}
, [addingUnits, units] )
;
const markError = (cond)
= > (touched & & !cond ? "ring 2 ring red 4 0 0 bg red 5 0 " : " " )
;
/ * Unidades helpers * / const addUnitRow = ( )
= > setUnits( (list)
= > [ . . .list, {
codigo: " " , rentaMensual: " " , estadoUnidad: "disponible" , descripcion: " " , fechaProgramadaPago: " " }
, ] )
;
const setUnit = (i, k, v)
= > setUnits( (list)
= > {
const next = [ . . .list] ;
next[i] = {
. . .next[i] , [k] : v }
;
return next;
}
)
;
const removeUnit = (i)
= > setUnits( (list)
= > list.filter( ( _ , idx)
= > idx ! = = i)
)
;
/ * Resumen financiero (derivados)
* / const sumUnidades = useMemo ( ( )
= > units.reduce( (acc, u)
= > acc + (Number(u.rentaMensual)
| | 0 )
, 0 )
, [units] )
;
const avgUnidad = useMemo ( ( )
= > (units.length ? sumUnidades / units.length : 0 )
, [sumUnidades, units.length] )
;
const anual = useMemo ( ( )
= > sumUnidades * 1 2 , [sumUnidades] )
;
/ * Confirmaci?n * / const validateAndExplain = ( )
= > {
const errs = [ ] ;
if ( !form.codigo.trim( )
)
errs.push( " ??Falta el c?digo del negocio . " )
;
if ( !form.nombre.trim( )
)
errs.push( " ??Falta el nombre del negocio . " )
;
if ( ! (form.tipoId | | form.tipoNombre)
)
errs.push( " ??Selecciona el tipo de negocio . " )
;
if ( !form.propiedadId)
errs.push( " ??Selecciona la propiedad. " )
;
if ( !form.estado)
errs.push( " ??Selecciona el estado. " )
;
if (addingUnits)
{
if (units.length = = = 0 )
errs.push( " ??Agrega al menos una unidad o desactiva el modo unidades. " )
;
units.forEach ( (u, idx)
= > {
const base = `Unidad # $ {idx + 1 }
: ` ;
if ( !u.codigo? .trim( )
)
errs.push( ` $ {base}falta c?digo. ` )
;
if (u.rentaMensual = = = " " | | isNaN(Number(u.rentaMensual)
)
)
errs.push( ` $ {base}renta mensual inv?lida. ` )
;
const d = Number(u.fechaProgramadaPago)
;
if ( !Number.isInteger(d)
| | d < 1 | | d > 3 1 )
errs.push( ` $ {base}d?a de pago debe ser 1 ?? 1 . ` )
;
}
)
;
}
setErrors(errs)
;
setTouched(true)
;
return errs.length = = = 0 ;
}
;
async function doSave( )
{
setSaving(true)
;
try {
const isObjectId = (v)
= > / ^ [ 0 9a fA F] {
2 4 }
$ / .test(String(v | | " " )
)
;
const payload = {
code: (form.codigo | | " " )
.trim( )
.toUpperCase( )
, name: (form.nombre | | " " )
.trim( )
, typeId: isObjectId(form.tipoId)
? form.tipoId : undefined, typeName: form.tipoNombre | | undefined, categoryId: isObjectId(form.categoriaId)
? form.categoriaId : undefined, categoryName: form.categoriaNombre | | undefined, propertyId: isObjectId(form.propiedadId)
? form.propiedadId : undefined, status: form.estado, description: form.descripcion? .trim( )
| | undefined, fechaInicioOperacion: form.fechaInicioOperacion ? new Date(form.fechaInicioOperacion)
: undefined, units: addingUnits ? units.map( (u)
= > ( {
code: (u.codigo | | " " )
.trim( )
, monthlyRent: Number(u.rentaMensual | | 0 )
, unitStatus: u.estadoUnidad, scheduledPayDay: String(u.fechaProgramadaPago | | " " )
, description: (u.descripcion | | " " )
.trim( )
| | undefined, }
)
)
: [ ] , createdBy: window. _ _user? .id | | "system" , updatedBy: window. _ _user? .id | | "system" , }
;
const resp = mode = = = "edit" & & (initialData? .id | | initialData? . _id)
? await updateBusiness (String(initialData.id ? ? initialData. _id)
, payload )
: await createBusiness (payload )
;
onSaved ? . (resp? .data ? ? resp)
;
onClose ? . ( )
;
}
catch (err)
{
const status = err? .status | | err? .response? .status;
const msg = err? .data? .error | | err? .response? .data? .error | | (status = = = 4 0 9 ? "El c?digo de negocio ya existe. " : "No se pudo guardar . Revisa la consola . " )
;
alert(msg)
;
console .error( "Error al guardar negocio : " , err)
;
}
finally {
setSaving(false)
;
setShowConfirm (false)
;
}
}
const preSave = ( )
= > {
if (validateAndExplain( )
& & businessValid & & unitsValid)
setShowConfirm (true)
;
}
;
if ( !open)
return null;
const dayOptions = Array.from( {
length: 3 1 }
, ( _ , i)
= > i + 1 )
;
const propiedadNombre = properties.find( (p)
= > String(p. _id ? ? p.id)
= = = String(form.propiedadId)
)
? .nombre | | properties.find( (p)
= > String(p.id ? ? p. _id)
= = = String(form.propiedadId)
)
? .name | | " ?? ;
/ * Render * / return ( <BaseModal open= {open}
onClose = {onClose }
title= {mode = = = "edit" ? "Editar negocio " : "Nuevo negocio " }
className= "w [min( 8 8 0px, 9 2vw)
] lg:w [min( 9 8 0px, 9 2vw)
] xl:w [min( 1 1 0 0px, 9 2vw)
] " footer= {
< > <button className= "btn outline " onClick = {onClose }
>Cancelar< /button> <button className= "btn gradient" onClick = {preSave }
disabled= {saving}
> {saving ? "Guardando?? : "Guardar " }
< /button> < / > }
> {
/ * errores del formulario * / }
{errors.length > 0 & & ( <div className= "mb 3 rounded xl bg red 5 0 0 / 1 0 text red 6 0 0 ring 1 ring red 4 0 0 px 3 py 2 text sm" > <div className= "font semibold mb 1 " >Revisa estos puntos: < /div> <ul className= "list disc pl 5 spacey 0 . 5 " > {errors.map( (e, i)
= > <li key= {i}
> {e}
< /li> )
}
< /ul> < /div> )
}
{
/ * formulario * / }
<div className= "maxh [ 7 6vh] overflowyauto pr 1 " > {
/ * fila 1 * / }
<div className= "grid grid cols 1 md:grid cols [ 2 2 0px_minmax( 2 6 0px, 1fr)
_minmax( 2 6 0px, 1fr)
] gap 3 " > <label className= "text sm md:maxw [ 2 2 0px] " > C?digo <input className= {
` $ {fieldClass(form.codigo.trim( )
)
}
$ {markError(form.codigo.trim( )
)
}
w full` }
placeholder= "Ej. APTOS 0 4 " value= {form.codigo}
onChange= {
(e)
= > up( "codigo" , e.target.value)
}
/ > < /label> <label className= "text sm md:maxw [ 5 2 0px] " > Nombre <input className= {
` $ {fieldClass(form.nombre.trim( )
)
}
$ {markError(form.nombre.trim( )
)
}
w full` }
placeholder= "Ej. Apartamentos 0 4 " value= {form.nombre}
onChange= {
(e)
= > up( "nombre" , e.target.value)
}
/ > < /label> <label className= "text sm md:maxw [ 4 2 0px] " > Tipo de negocio <div className= "flex gap 2 " > <input className= {
`neo input flex 1 h 1 2 px 3 text [ 1 5px] $ {markError(form.tipoNombre)
}
` }
placeholder= "Ej. Apartamentos" value= {form.tipoNombre}
readOnly / > <button className= "btn tonal hover:bg [var( chip)
] / 4 0 transition colors" type= "button" onClick = {
( )
= > setShowTypePicker(true)
}
title= "Elegir tipo" > <Plus className= "btn icon" / > < /button> < /div> <div className= "text xs subtle mt 1 " > Categor ?a : <span className= "font medium" > {form.categoriaNombre | | " ?? }
< /span> < /div> < /label> < /div> {
/ * fila 2 * / }
<div className= "mt 3 grid grid cols 1 md:grid cols [minmax( 2 6 0px, 1fr)
_minmax( 2 4 0px, 1fr)
_minmax( 3 0 0px, 1fr)
] gap 3 " > <label className= "text sm md:maxw [ 4 2 0px] " > Propiedad <select className= "neo input h 1 2 px 3 text [ 1 5px] w full" value= {String(form.propiedadId | | " " )
}
onChange= {
(e)
= > up( "propiedadId" , e.target.value)
}
> <option value= " " > ??Seleccione propiedad ?? /option> {
(properties | | [ ] )
.map( (p)
= > ( <option key= {String(p. _id | | p.id)
}
value= {String(p. _id | | p.id)
}
> {p.nombre ? ? p.name ? ? p.codigo ? ? p.id}
< /option> )
)
}
< /select> < /label> <label className= "text sm md:maxw [ 3 0 0px] " > Estado <select className= "neo input w full h 1 2 px 3 text [ 1 5px] " value= {form.estado}
onChange= {
(e)
= > up( "estado" , e.target.value)
}
> <option value= " " > ??Seleccione estado ?? /option> <option value= "idea" >En idea< /option> <option value= "en_construccion" >En construcci?n < /option> <option value= "activo" >Activo< /option> <option value= "pausado " >Pausado < /option> <option value= "cerrado " >Cerrado < /option> < /select> < /label> <label className= "text sm md:maxw [ 2 8 0px] " > Fecha inicio de operaci ?n <input type= "date" className= "neo input w full h 1 2 px 3 text [ 1 5px] " value= {form.fechaInicioOperacion}
onChange= {
(e)
= > up( "fechaInicioOperacion" , e.target.value)
}
/ > < /label> <label className= "text sm md:maxw [ 5 2 0px] " > Descripci?n <span className= "text xs subtle" > (opcional)
< /span> <input className= "neo input h 1 2 px 3 text [ 1 5px] w full" placeholder= "Detalle breve" value= {form.descripcion}
onChange= {
(e)
= > up( "descripcion" , e.target.value)
}
/ > < /label> < /div> {
/ * unidades * / }
<div className= "mt 5 " > <div className= "flex justify between mb 2 " > <div className= "text sm font semibold" >Unidades (opcional)
< /div> <div className= "flex items center gap 2 " > <label className= "text xs flex items center gap 2 " > <input type= "checkbox" checked = {addingUnits}
onChange= {
(e)
= > setAddingUnits (e.target.checked )
}
/ > Agregar unidades ahora < /label> <button className= "btn tonal hover:bg [var( chip)
] / 4 0 transition colors" type= "button" onClick = {addUnitRow}
disabled= {
!addingUnits}
> <Plus className= "btn icon" / > Unidad < /button> < /div> < /div> {addingUnits & & units.map( (u, i)
= > ( <div key= {u. _uid | | i}
className= "grid grid cols 1 md:grid cols [minmax( 1 2 0px, 1fr)
_ 1 3 0px_minmax( 1 6 0px, 1fr)
_ 1 3 0px_minmax( 2 2 0px, 1 . 4fr)
_auto] gap 2 items end mb 2 " > <label className= "text sm" > C?digo <input className= {
`neo input w full h 1 1 px 3 text [ 1 5px] $ {markError(u.codigo)
}
` }
value= {u.codigo}
onChange= {
(e)
= > setUnit (i, "codigo" , e.target.value)
}
/ > < /label> <label className= "text sm" > Alquiler mensual <input type= "number" min= " 0 " step= " 0 . 0 1 " className= {
`neo input w full h 1 1 px 3 text [ 1 5px] $ {markError(u.rentaMensual)
}
` }
value= {u.rentaMensual}
onChange= {
(e)
= > setUnit (i, "rentaMensual" , e.target.value)
}
/ > < /label> <label className= "text sm" > Estado <select className= "neo input w full h 1 1 px 3 text [ 1 5px] " value= {u.estadoUnidad}
onChange= {
(e)
= > setUnit (i, "estadoUnidad" , e.target.value)
}
> <option value= "disponible" >Disponible< /option> <option value= "ocupada " >Ocupada < /option> <option value= "mantenimiento" >Mantenimiento< /option> <option value= "disponible" >Inactivo< /option> < /select> < /label> <label className= "text sm" > D?a de pago <select className= {
`neo input w full h 1 1 px 3 text [ 1 5px] $ {markError(u.fechaProgramadaPago)
}
` }
value= {u.fechaProgramadaPago}
onChange= {
(e)
= > setUnit (i, "fechaProgramadaPago" , e.target.value)
}
> <option value= " " >Seleccione d?a < /option> {dayOptions.map( (d)
= > ( <option key= {d}
value= {d}
> {d}
< /option> )
)
}
< /select> < /label> <label className= "text sm" > Descripci?n <span className= "text xs subtle" > (opcional)
< /span> <input className= "neo input w full h 1 1 px 3 text [ 1 5px] " value= {u.descripcion | | " " }
onChange= {
(e)
= > setUnit (i, "descripcion" , e.target.value)
}
/ > < /label> <div className= "flex items end h full" > <button className= "icon btn ring 1 ring border hover:bg [var( chip)
] / 3 0 transition colors" type= "button" title= "Quitar" onClick = {
( )
= > removeUnit(i)
}
> <Trash2 size= {
1 6 }
/ > < /button> < /div> < /div> )
)
}
< /div> < /div> {
/ * Picker de tipos * / }
<BusinessTypePicker open= {showTypePicker }
onClose = {
( )
= > setShowTypePicker(false)
}
onPick= {
(it)
= > {
setForm ( (s)
= > ( {
. . .s, tipoId: it? . _id ? ? it? .id ? ? " " , tipoNombre: it? .nombre ? ? " " , categoriaId: it? .categoriaId ? ? " " , categoriaNombre: it? .categoriaNombre ? ? " " , }
)
)
;
}
}
/ > {
/ * Confirmaci?n : resumen ejecutivo * / }
{showConfirm & & ( <div className= "fixed inset 0 z [ 1 0 0 0 ] grid place items center bg black/ 4 5 " > <div className= "bg [var( panel)
] rounded 2xl p 6 ring 1 ring border w [min( 1 0 0 0px, 9 6vw)
] shadow xl animate fadeIn" > <h3 className= "font semibold mb 4 " >Resumen del negocio < /h3 > <div className= "grid grid cols 1 md:grid cols 2 gap 3 text sm mb 4 " > <div> <b>C?digo: < /b> {form.codigo | | " ?? }
< /div> <div> <b>Nombre: < /b> {form.nombre | | " ?? }
< /div> <div> <b>Tipo: < /b> {form.tipoNombre | | " ?? }
< /div> <div> <b>Categor ?a : < /b> {form.categoriaNombre | | " ?? }
< /div> <div> <b>Propiedad: < /b> {propiedadNombre}
< /div> <div> <b>Estado: < /b> {form.estado | | " ?? }
< /div> <div> <b>Inicio operaci ?n : < /b> {form.fechaInicioOperacion | | " ?? }
< /div> <div> <b>Creado por: < /b> {window. _ _user? .name | | "Usuario actual" }
< /div> <div> <b>Fecha creaci?n : < /b> {new Date( )
.toLocaleDateString( )
}
< /div> < /div> {form.descripcion & & ( <div className= "text sm mb 4 " > <b>Descripci?n : < /b> {form.descripcion}
< /div> )
}
<div className= "mb 4 " > <h4 className= "text sm font semibold mb 1 " >Resumen financiero< /h4 > <div className= "grid grid cols 2 md:grid cols 4 text sm" > <div> <b>Unidades: < /b> {units.length}
< /div> <div> <b>Suma mensual : < /b> $ {sumUnidades.toFixed ( 2 )
}
< /div> <div> <b>Promedio unidad: < /b> $ {avgUnidad.toFixed ( 2 )
}
< /div> <div> <b>Proyecci?n anual: < /b> $ {anual.toFixed ( 2 )
}
< /div> < /div> < /div> {addingUnits & & units.length > 0 & & ( < > <div className= "text sm font semibold mb 2 " >Unidades ( {units.length}
)
< /div> <div className= "overflow auto rounded xl ring 1 ring border" > <table className= "w full border collapse text sm" > <thead className= "bg [var( chip)
] / 4 0 text left" > <tr className= "text [ 1 3px] text text/ 8 0 " > <th className= "px 3 py 2 font semibold" >C?digo< /th> <th className= "px 3 py 2 font semibold" >Alquiler< /th> <th className= "px 3 py 2 font semibold" >Estado< /th> <th className= "px 3 py 2 font semibold" >D?a pago< /th> <th className= "px 3 py 2 font semibold" >Descripci?n < /th> < /tr> < /thead> <tbody className= "divide y divide gray 1 0 0 " > {units.map( (u, i)
= > ( <tr key= {
` $ {u.codigo | | "row" }
_ $ {i}
` }
className= "hover:bg [var( chip)
] / 2 0 transition colors" > <td className= "px 3 py 2 " > {u.codigo}
< /td> <td className= "px 3 py 2 " > $ {Number(u.rentaMensual | | 0 )
.toFixed ( 2 )
}
< /td> <td className= "px 3 py 2 capitalize" > {u.estadoUnidad}
< /td> <td className= "px 3 py 2 " > {u.fechaProgramadaPago | | " ?? }
< /td> <td className= "px 3 py 2 text gray 6 0 0 " > {u.descripcion | | " ?? }
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> < / > )
}
<div className= "mt 5 flex justify end gap 2 " > <button className= "btn outline hover:bg [var( chip)
] / 3 0 " onClick = {
( )
= > setShowConfirm (false)
}
>Volver< /button> <button className= "btn gradient hover:brightness 1 1 0 " onClick = {doSave}
disabled= {saving}
> {saving ? "Guardando?? : "Confirmar y guardar " }
< /button> < /div> < /div> < /div> )
}
< /BaseModal> )
;
}