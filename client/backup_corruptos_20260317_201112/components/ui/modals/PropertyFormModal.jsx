// src/features/corporativo/components/modals/PropertyFormModal.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
X, Plus }
from "lucide React" ;
const API_BASE = (import.meta.env.VITE_API_URL | | " " )
.replace ( / \ / + $ / , " " )
;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const todayISO = ( )
= > new Date( )
.toISOString( )
.slice( 0 , 1 0 )
;
/ * Submodal: agregar pa?s * / function AddCountryModal( {
open, onClose , onCreated, existing = [ ] }
)
{
const {
theme }
= useTheme( )
;
const [code, setCode ] = useState( " " )
;
const [name, setName ] = useState( " " )
;
useEffect( ( )
= > {
if (open)
{
setCode ( " " )
;
setName ( " " )
;
}
}
, [open] )
;
if ( !open)
return null;
const trimmedCode = code.trim( )
.toUpperCase( )
;
const trimmedName = name.trim( )
;
const exists = useMemo ( ( )
= > {
const c = trimmedCode;
const n = trimmedName.toLowerCase( )
;
return (existing | | [ ] )
.some(p = > (String(p.code | | " " )
.toUpperCase( )
= = = c)
| | (String(p.name | | " " )
.toLowerCase( )
= = = n)
)
;
}
, [existing, trimmedCode, trimmedName] )
;
const canSave = / ^ [A Z] {
2 }
$ / .test(trimmedCode)
& & trimmedName.length > = 3 & & !exists;
const save = async ( )
= > {
const payload = {
code: trimmedCode, name: trimmedName }
;
try {
// Si hay backend , intenta persistir const r = await fetch( ` $ {API_BASE}
/api/countries` , {
method: "POST" , headers : {
"Content Type" : "application/json" }
, body: JSON.stringify(payload )
, }
)
.catch( ( )
= > null)
;
if (r & & r.ok)
{
const data = await r.json( )
.catch( ( )
= > payload )
;
onCreated? . (data? .country | | payload )
;
}
else {
// Fallback: al menos agr閼?galo localmente onCreated? . (payload )
;
}
onClose ? . ( )
;
}
catch {
onCreated? . (payload )
;
onClose ? . ( )
;
}
}
;
return ( <div className= "fixed inset 0 z [ 5 2 0 ] " data theme= {theme}
> <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div className= "absolute left 1 / 2 top 1 / 2 translatex 1 / 2 translatey 1 / 2 w [min( 4 8 0px, 9 2vw)
] neo card p 4 md:p 5 " > <div className= "flex items center justify between mb 3 " > <h4 className= "text base font semibold" >Agregar pa?s < /h4 > <button className= "neo plate px 3 py 1 . 5 " onClick = {onClose }
> <X size= {
1 6 }
/ > Cerrar< /button> < /div> <div className= "grid grid cols 1 md:grid cols 3 gap 3 " > <label className= "block" > <span className= "block text xs subtle mb 1 " >C?digo (ISO 2 )
< /span> <input autoFocus className= "neo input w full px 3 py 2 uppercase" placeholder= "SV" value= {code}
onChange= {
(e)
= > setCode (e.target.value)
}
/ > < /label> <label className= "block md:col span 2 " > <span className= "block text xs subtle mb 1 " >Nombre< /span> <input className= "neo input w full px 3 py 2 " placeholder= "El Salvador" value= {name}
onChange= {
(e)
= > setName (e.target.value)
}
/ > < /label> < /div> {exists & & <p className= "mt 2 text xs text amber 6 0 0 " >Ya existe ese pa?s . < /p> }
<div className= "mt 4 flex items center justify end gap 2 " > <button className= "neo plate px 4 py 2 " onClick = {onClose }
>Cancelar< /button> <button className= {cx( "btn gradient btn action" , !canSave & & "opacity 6 0 cursor not allowed " )
}
onClick = {save}
disabled= {
!canSave }
> Guardar < /button> < /div> < /div> < /div> )
;
}
/ * Helpers locales * / function Field( {
label, children, className }
)
{
return ( <label className= {cx( "block" , className)
}
> <span className= "block text xs text [ muted] mb 1 " > {label}
< /span> {children}
< /label> )
;
}
/ * Modal principal * / export default function PropertyFormModal( {
open, onClose , onSave, // async (payload )
= > objeto guardado (deber?a devolver id)
initialData, // objeto propiedad si se edita mode = "create" , // "create" | "edit" }
)
{
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
// Cat?logo de pa?ses const [countries, setCountries] = useState( [ ] )
;
const [addCountryOpen , setAddCountryOpen] = useState(false)
;
// Form alineado con tu BD const [form, setForm ] = useState( {
id: " " , nombre: " " , estado: "activo" , descripcionActual: " " , notas: " " , ubicacion: {
pais: " " , departamento: " " , municipio: " " , ciudad: " " , direccion: " " , bandera : " " , }
, historia: {
fechaCompra: todayISO( )
, descripcionCompra: " " , precioCompra: " " , }
, valores : {
valorActual: " " , costoTotalActual: " " }
, dimensiones: {
medidasDeclaradas: " " , areaM2 : " " , areaV2 : " " , norte: " " , sur: " " , este: " " , oeste: " " , acceso: " " , }
, media: [ ] , }
)
;
// Carga/refresh del cat?logo de pa?ses const refreshCountries = async ( )
= > {
try {
const r = await fetch( ` $ {API_BASE}
/api/countries` )
;
const data = await r.json( )
.catch( ( )
= > null)
;
let list = [ ] ;
if (Array.isArray (data)
)
list = data;
else if (Array.isArray (data? .countries)
)
list = data.countries;
setCountries(list)
;
}
catch {
// fallback b?sico setCountries( [ {
code: "SV" , name: "El Salvador" }
, {
code: "US" , name: "Estados Unidos" }
] )
;
}
}
;
useEffect( ( )
= > {
if ( !open)
return;
refreshCountries( )
;
}
, [open] )
;
// Cargar data en edici?n useEffect( ( )
= > {
if ( !open)
return;
if (initialData & & mode = = = "edit" )
{
setForm ( (f)
= > ( {
. . .f, id: initialData.id ? ? " " , nombre: initialData.nombre ? ? " " , estado: initialData.estado ? ? "activo" , descripcionActual: initialData.descripcionActual ? ? " " , notas: initialData.notas ? ? " " , ubicacion: {
pais: initialData.ubicacion? .pais ? ? " " , departamento: initialData.ubicacion? .departamento ? ? " " , municipio: initialData.ubicacion? .municipio ? ? " " , ciudad: initialData.ubicacion? .ciudad ? ? " " , direccion: initialData.ubicacion? .direccion ? ? " " , bandera : initialData.ubicacion? .bandera ? ? " " , }
, historia: {
fechaCompra: (initialData.historia? .fechaCompra | | " " )
.slice? . ( 0 , 1 0 )
| | todayISO( )
, descripcionCompra: initialData.historia? .descripcionCompra ? ? " " , precioCompra: initialData.historia? .precioCompra ? ? " " , }
, valores : {
valorActual: initialData.valores ? .valorActual ? ? " " , costoTotalActual: initialData.valores ? .costoTotalActual ? ? " " , }
, dimensiones: {
medidasDeclaradas: initialData.dimensiones? .medidasDeclaradas ? ? " " , areaM2 : initialData.dimensiones? .areaM2 ? ? " " , areaV2 : initialData.dimensiones? .areaV2 ? ? " " , norte: initialData.dimensiones? .norte ? ? " " , sur: initialData.dimensiones? .sur ? ? " " , este: initialData.dimensiones? .este ? ? " " , oeste: initialData.dimensiones? .oeste ? ? " " , acceso: initialData.dimensiones? .acceso ? ? " " , }
, media: Array.isArray (initialData.media)
? initialData.media : [ ] , }
)
)
;
}
else if (mode = = = "create" )
{
setForm ( (f)
= > ( {
. . .f, id: " " , nombre: " " , estado: "activo" , historia: {
. . .f.historia, fechaCompra: todayISO( )
}
, }
)
)
;
}
}
, [open, initialData, mode] )
;
const set = (path, value)
= > {
setForm ( (prev)
= > {
const next = {
. . .prev }
;
const keys = path.split( " . " )
;
let cur = next;
for (let i = 0 ;
i < keys.length 1 ;
i+ + )
{
cur[keys[i] ] = {
. . . (cur[keys[i] ] ? ? {
}
)
}
;
cur = cur[keys[i] ] ;
}
cur[keys[keys.length 1 ] ] = value;
return next;
}
)
;
}
;
const canSave = useMemo ( ( )
= > {
const f = form;
return ( String(f.id)
.trim( )
.length > = 1 & & String(f.nombre)
.trim( )
.length > = 3 & & String(f.ubicacion.pais)
.trim( )
.length > = 2 & & String(f.ubicacion.direccion)
.trim( )
.length > = 3 & & String(f.dimensiones.areaM2 | | " " )
.length > 0 & & String(f.valores .valorActual | | " " )
.length > 0 )
;
}
, [form] )
;
const handleSave = async ( )
= > {
const payload = {
id: String(form.id)
.trim( )
, nombre: String(form.nombre)
.trim( )
, estado: form.estado, descripcionActual: String(form.descripcionActual | | " " )
.trim( )
, notas: String(form.notas | | " " )
.trim( )
, ubicacion: {
pais: form.ubicacion.pais, departamento: form.ubicacion.departamento, municipio: form.ubicacion.municipio, ciudad: form.ubicacion.ciudad, direccion: form.ubicacion.direccion, bandera : form.ubicacion.bandera , }
, historia: {
fechaCompra: form.historia.fechaCompra | | todayISO( )
, descripcionCompra: form.historia.descripcionCompra | | " " , precioCompra: Number(form.historia.precioCompra | | 0 )
, }
, valores : {
valorActual: Number(form.valores .valorActual | | 0 )
, costoTotalActual: Number(form.valores .costoTotalActual | | 0 )
, }
, dimensiones: {
medidasDeclaradas: form.dimensiones.medidasDeclaradas | | " " , areaM2 : Number(form.dimensiones.areaM2 | | 0 )
, areaV2 : Number(form.dimensiones.areaV2 | | 0 )
, norte: String(form.dimensiones.norte | | " " )
, sur: String(form.dimensiones.sur | | " " )
, este: String(form.dimensiones.este | | " " )
, oeste: String(form.dimensiones.oeste | | " " )
, acceso: String(form.dimensiones.acceso | | " " )
, }
, media: Array.isArray (form.media)
? form.media : [ ] , }
;
const saved = await onSave? . (payload )
;
if (saved)
onClose ? . ( )
;
}
;
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 5 0 0 ] " data theme= {theme}
> <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div className= {cx( "absolute left 1 / 2 top 1 0 translatex 1 / 2 w [min( 9 8 0px, 9 5vw)
] maxh [ 9 0vh] overflow auto p 4 md:p 6 " , isNeo ? "neo card" : "card" )
}
> <div className= "flex items center justify between mb 3 " > <h3 className= "text lg font semibold" > {mode = = = "edit" ? "Editar propiedad" : "Agregar propiedad" }
< /h3 > <button onClick = {onClose }
className= {cx(isNeo ? "neo plate px 3 py 1 . 5 " : "rounded md px 3 py 1 . 5 bg [var( chip)
] " )
}
> <X size= {
1 6 }
/ > Cerrar < /button> < /div> {
/ * Form * / }
<div className= "grid grid cols 1 md:grid cols 2 gap 3 " > <Field label= "ID (c?digo corto)
" > <input className= "neo input w full px 3 py 2 " value= {form.id}
onChange= {e = > set( "id" , e.target.value)
}
placeholder= " 0 1 " / > < /Field> <Field label= "Nombre" > <input className= "neo input w full px 3 py 2 " value= {form.nombre}
onChange= {e = > set( "nombre" , e.target.value)
}
placeholder= "Propiedad 0 1 " / > < /Field> <Field label= "Estado" > <select className= "neo input w full px 3 py 2 " value= {form.estado}
onChange= {e = > set( "estado" , e.target.value)
}
> <option value= "activo" >Activo< /option> <option value= "inactivo" >Inactivo< /option> <option value= "vendido " >Vendido < /option> <option value= "proyectado" >Proyectado< /option> < /select> < /Field> {
/ * Pa?s + bot?n " + Pa?s " * / }
<div className= "md:col span 1 " > <div className= "flex items center justify between mb 1 " > <label className= "text xs subtle" >Pa?s < /label> <button type= "button" onClick = {
( )
= > setAddCountryOpen(true)
}
className= "btn gradient inline flex items center gap 1 rounded md px 2 py 0 . 5 h [ 2 6px] text [ 1 1px] font semibold" title= "Agregar pa?s " > <Plus size= {
1 2 }
/ > Pa?s < /button> < /div> <select className= "neo input w full px 3 py 2 " value= {form.ubicacion.pais}
onChange= {
(e)
= > set( "ubicacion.pais" , e.target.value)
}
> <option value= " " >Selecciona?? /option> {countries.map( (c)
= > ( <option key= {
` $ {c.code}
$ {c.name}
` }
value= {c.name}
> {c.name}
{c.code ? ` ( $ {c.code}
)
` : " " }
< /option> )
)
}
< /select> < /div> <Field label= "Bandera (URL)
" > <input className= "neo input w full px 3 py 2 " value= {form.ubicacion.bandera }
onChange= {e = > set( "ubicacion.bandera " , e.target.value)
}
placeholder= "https://flagcdn.com/sv.svg" / > < /Field> <Field label= "Departamento / Estado" > <input className= "neo input w full px 3 py 2 " value= {form.ubicacion.departamento}
onChange= {e = > set( "ubicacion.departamento" , e.target.value)
}
/ > < /Field> <Field label= "Municipio / Condado " > <input className= "neo input w full px 3 py 2 " value= {form.ubicacion.municipio}
onChange= {e = > set( "ubicacion.municipio" , e.target.value)
}
/ > < /Field> <Field label= "Ciudad" > <input className= "neo input w full px 3 py 2 " value= {form.ubicacion.ciudad}
onChange= {e = > set( "ubicacion.ciudad" , e.target.value)
}
/ > < /Field> <Field label= "Direcci ?n " className= "md:col span 2 " > <input className= "neo input w full px 3 py 2 " value= {form.ubicacion.direccion}
onChange= {e = > set( "ubicacion.direccion" , e.target.value)
}
/ > < /Field> <Field label= "Fecha de compra" > <input type= "date" className= "neo input w full px 3 py 2 " value= {form.historia.fechaCompra | | " " }
onChange= {e = > set( "historia.fechaCompra" , e.target.value)
}
max= {todayISO( )
}
/ > < /Field> <Field label= "Descripci?n compra" > <input className= "neo input w full px 3 py 2 " value= {form.historia.descripcionCompra}
onChange= {e = > set( "historia.descripcionCompra" , e.target.value)
}
/ > < /Field> <Field label= "Precio compra (USD)
" > <input className= "neo input w full px 3 py 2 " inputMode= "decimal " value= {form.historia.precioCompra}
onChange= {e = > set( "historia.precioCompra" , e.target.value)
}
/ > < /Field> <Field label= "Valor actual (USD)
" > <input className= "neo input w full px 3 py 2 " inputMode= "decimal " value= {form.valores .valorActual}
onChange= {e = > set( "valores .valorActual" , e.target.value)
}
/ > < /Field> <Field label= "Costo total actual (USD)
" > <input className= "neo input w full px 3 py 2 " inputMode= "decimal " value= {form.valores .costoTotalActual}
onChange= {e = > set( "valores .costoTotalActual" , e.target.value)
}
/ > < /Field> <Field label= "Medidas declaradas" > <input className= "neo input w full px 3 py 2 " value= {form.dimensiones.medidasDeclaradas}
onChange= {e = > set( "dimensiones.medidasDeclaradas" , e.target.value)
}
placeholder= " 2 3 . 5x2 2 " / > < /Field> <Field label= " 閼?rea (m閾?)
" > <input className= "neo input w full px 3 py 2 " inputMode= "decimal " value= {form.dimensiones.areaM2 }
onChange= {e = > set( "dimensiones.areaM2 " , e.target.value)
}
/ > < /Field> <Field label= " 閼?rea (v閾?)
" > <input className= "neo input w full px 3 py 2 " inputMode= "decimal " value= {form.dimensiones.areaV2 }
onChange= {e = > set( "dimensiones.areaV2 " , e.target.value)
}
/ > < /Field> <Field label= "Norte" > <input className= "neo input w full px 3 py 2 " value= {form.dimensiones.norte}
onChange= {e = > set( "dimensiones.norte" , e.target.value)
}
/ > < /Field> <Field label= "Sur" > <input className= "neo input w full px 3 py 2 " value= {form.dimensiones.sur}
onChange= {e = > set( "dimensiones.sur" , e.target.value)
}
/ > < /Field> <Field label= "Este" > <input className= "neo input w full px 3 py 2 " value= {form.dimensiones.este}
onChange= {e = > set( "dimensiones.este" , e.target.value)
}
/ > < /Field> <Field label= "Oeste" > <input className= "neo input w full px 3 py 2 " value= {form.dimensiones.oeste}
onChange= {e = > set( "dimensiones.oeste" , e.target.value)
}
/ > < /Field> <Field label= "Acceso" className= "md:col span 2 " > <input className= "neo input w full px 3 py 2 " value= {form.dimensiones.acceso}
onChange= {e = > set( "dimensiones.acceso" , e.target.value)
}
/ > < /Field> <Field label= "Descripci?n actual" className= "md:col span 2 " > <textarea className= "neo input w full px 3 py 2 minh [ 8 4px] " value= {form.descripcionActual}
onChange= {e = > set( "descripcionActual" , e.target.value)
}
/ > < /Field> <Field label= "Notas" className= "md:col span 2 " > <textarea className= "neo input w full px 3 py 2 minh [ 6 4px] " value= {form.notas}
onChange= {e = > set( "notas" , e.target.value)
}
/ > < /Field> < /div> <div className= "mt 4 flex items center justify end gap 2 " > <button className= {cx(isNeo ? "neo plate px 4 py 2 " : "rounded lg px 4 py 2 bg [var( chip)
] " )
}
onClick = {onClose }
>Cancelar< /button> <button className= {cx( "btn gradient btn action" , !canSave & & "opacity 6 0 cursor not allowed " )
}
disabled= {
!canSave }
onClick = {handleSave}
> Guardar < /button> < /div> < /div> {
/ * Submodal agregar pa?s * / }
<AddCountryModal open= {addCountryOpen }
onClose = {
( )
= > setAddCountryOpen(false)
}
existing= {countries}
onCreated= {
(c)
= > {
setCountries( (list)
= > {
const exists = list.some(x = > x.code = = = c.code | | x.name = = = c.name)
;
const next = exists ? list : [ . . .list, c] ;
// Selecciona inmediatamente el pa?s creado por nombre set( "ubicacion.pais" , c.name)
;
return next.sort( (a, b)
= > String(a.name)
.localeCompare(String(b.name)
)
)
;
}
)
;
}
}
/ > < /div> )
;
}