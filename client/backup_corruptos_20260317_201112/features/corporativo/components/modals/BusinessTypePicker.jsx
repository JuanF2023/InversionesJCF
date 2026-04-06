// client/src/features/corporativo/components/modals/BusinessTypePicker.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
Plus, ChevronDown }
from "lucide React" ;
import {
listBusinessTypes, createBusinessType as createTypeApi, listBusinessCategories, ensureBusinessCategory, const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const SUGERENCIAS = [ {
categoria: "Bienes ra?ces" , tipos: [ "Apartamentos" , "Casas" , "Cuartos en alquiler" , "Locales comerciales" , "Oficinas" , "Bodegas / Galeras " , "Naves industriales" , "Terrenos" ] }
, {
categoria: "Industria alimenticia" , tipos: [ "Panader ?a " , "Pasteler?a " , "Restaurante" , "Cafeter ?a " , "Helader ?a " , "Comida m?vil (pupuser ?a m?vil, ventas sobre ruedas)
" , "Cocina a puerta cerrada " , "Catering o banquetes" , "Pupuser ?a fija" , "Venta de almuerzos caseros " , "Comida r?pida salvadore鐢?a " , "Juguer?a o batidos naturales" ] }
, {
categoria: "Comercio minorista" , tipos: [ "Tienda de conveniencia (minimarket local)
" , "Tienda de ropa" , "Zapater ?a " , "Ferreter?a " , "Librer?a / Papeler ?a " , "Tienda de electr?nica" , "Tienda del hogar" , "Tienda de celulares y accesorios" , "Boutique de moda" , "Bazar o tienda miscel?nea" ] }
, {
categoria: "Servicios personales" , tipos: [ "Barber?a " , "Peluquer?a " , "Spa / Est閼?tica" , "Lavander?a " , "Sastrer ?a " , "Fotograf?a / Estudio fotogr?fico" , "Gimnasio / Box" , "Centro de u鐢?as" , "Masajes terap閼?uticos" , "Alquiler de vestidos o trajes" ] }
, {
categoria: "Servicios profesionales" , tipos: [ "Consultor?a empresarial" , "Contadur?a " , "Abogac?a " , "Arquitectura" , "Marketing digital " , "Desarrollo de software" , "Soporte t閼?cnico" , "Dise鐢?o gr?fico" , "Asesor?a financiera" , "Servicios de recursos humanos " ] }
, {
categoria: "Manufactura y talleres" , tipos: [ "Carpinter?a " , "Taller metalmec?nico" , "Taller automotriz" , "Fabricaci?n de muebles " , "Imprenta" , "Serigraf?a " , "Soldadura" , "Estructuras met?licas" , "Tapicer ?a " , "Cerrajer?a " ] }
, {
categoria: "Log?stica y transporte" , tipos: [ "Transporte de carga" , "Paqueter?a / Courier " , "Motomensajer?a " , "Alquiler de veh?culos" , "Operador log?stico" , "Bodegaje / almacenamiento " , "Transporte escolar " , "Transporte privado / tur?stico" ] }
, {
categoria: "Agro y acu?cola" , tipos: [ "Invernadero" , "Granja av?cola" , "Porcicultura" , "Apicultura (abejas y miel)
" , "Acuicultura (cr?a de peces o camarones)
" , "Cultivo de granos b?sicos" , "Beneficiado de caf閼?" , "Hortalizas o frutas locales " ] }
, {
categoria: "Turismo y hospedaje" , tipos: [ "Hotel" , "Hostal" , "Alquiler vacacional / Airbnb local" , "Tour operador" , "Agencia de viajes" , "Centro recreativo" , "Caba鐢?as familiares" , "Restaurante tur?stico" ] }
, {
categoria: "Entretenimiento y eventos " , tipos: [ "Sal?n de eventos " , "Organizaci?n de eventos " , "Alquiler de sonido / luces" , "Academia de m閻?sica o baile" , "Parque inflable o recreativo" , "Servicios de decoraci?n " , "Alquiler de mobiliario o carpas" ] }
, {
categoria: "Educaci ?n y formaci ?n " , tipos: [ "Academia de idiomas " , "Centro de capacitaci?n " , "Tutor?as" , "Preescolar / Guarder ?a " , "Cursos en l?nea" , "Talleres vocacionales" , "Academia de computaci?n " , "Clases de m閻?sica o arte" ] }
, {
categoria: "Salud" , tipos: [ "Cl?nica" , "Consultorio dental" , " 閼?ptica" , "Laboratorio cl?nico" , "Fisioterapia" , "Farmacia" , "Terapia psicol?gica" , "Servicios de enfermer?a " , "Centro de bienestar o nutrici ?n " ] }
, ] ;
export default function BusinessTypePicker( {
open, onClose , onPick }
)
{
const [loading , setLoading] = useState(false)
;
const [types, setTypes] = useState( [ ] )
;
const [cats, setCats ] = useState( [ ] )
;
const [search, setSearch] = useState( " " )
;
const [newName , setNewName] = useState( " " )
;
const [catId, setCatId] = useState( " " )
;
const [creating, setCreating] = useState(false)
;
const [showHelp, setShowHelp] = useState(false)
;
const [inlineCreate, setInlineCreate] = useState(null)
;
// {categoria, tipo}
// 妫?閻? feedback inline const [status, setStatus] = useState(null)
;
// {kind: 'success ' | 'error' | 'info' , msg:string}
useEffect( ( )
= > {
if ( !open)
return;
(async ( )
= > {
setLoading(true)
;
try {
const [t, c] = await Promise .all( [ listBusinessTypes( )
.catch( ( )
= > [ ] )
, listBusinessCategories( )
.catch( ( )
= > [ ] )
, ] )
;
setTypes(Array.isArray (t)
? t : [ ] )
;
setCats (Array.isArray (c)
? c : [ ] )
;
setStatus(null)
;
}
finally {
setLoading(false)
;
}
}
)
( )
;
}
, [open] )
;
const categoriesById = useMemo ( ( )
= > {
const m = new Map( )
;
cats.forEach ( (c)
= > m.set(String(c. _id ? ? c.id)
, c)
)
;
return m;
}
, [cats] )
;
const categoriesByName = useMemo ( ( )
= > {
const m = new Map( )
;
cats.forEach ( (c)
= > m.set( (c.nombre | | " " )
.trim( )
.toLowerCase( )
, c)
)
;
return m;
}
, [cats] )
;
// Agrupar + filtro const groupedExisting = useMemo ( ( )
= > {
const q = search.trim( )
.toLowerCase( )
;
const grouped = {
}
;
for (const t of types)
{
const id = String(t.categoriaId ? ? t.categoryId ? ? " " )
;
const catName = categoriesById .get(id)
? .nombre ? ? "Sin categor ?a " ;
const match = !q | | [t.nombre, catName ] .join( " " )
.toLowerCase( )
.includes(q)
;
if ( !match)
continue;
if ( !grouped [catName ] )
grouped [catName ] = [ ] ;
grouped [catName ] .push(t)
;
}
return Object.entries (grouped )
.sort( (a, b)
= > a[ 0 ] .localeCompare(b[ 0 ] , "es" )
)
;
}
, [types, search, categoriesById ] )
;
const pick = (t)
= > {
if ( !t)
return;
const cat = categoriesById .get(String(t.categoriaId ? ? t.categoryId ? ? " " )
)
| | null;
onPick? . ( {
. . .t, categoriaId: cat? . _id ? ? cat? .id ? ? null, categoriaNombre: cat? .nombre ? ? null, }
)
;
onClose ? . ( )
;
}
;
function onSuggestionClick(catName , tipoName)
{
const cat = categoriesByName.get(catName .trim( )
.toLowerCase( )
)
;
if ( !cat)
{
setNewName(tipoName)
;
setCatId( " " )
;
setShowHelp(false)
;
setInlineCreate( {
categoria: catName , tipo: tipoName }
)
;
setStatus( {
kind: "info" , msg: `Se crear? la categor ?a ?? {catName }
??y el tipo ?? {tipoName}
?? ` }
)
;
return;
}
const found = types.find( (t)
= > String(t.categoriaId ? ? t.categoryId)
= = = String(cat. _id ? ? cat.id)
& & String(t.nombre)
.trim( )
.toLowerCase( )
= = = tipoName.trim( )
.toLowerCase( )
)
;
if (found)
return pick(found)
;
setNewName(tipoName)
;
setCatId(String(cat. _id ? ? cat.id)
)
;
setShowHelp(false)
;
setInlineCreate(null)
;
setStatus( {
kind: "info" , msg: `La categor ?a ?? {cat.nombre}
??ya existe. Crea el tipo ?? {tipoName}
??y se seleccionar?. ` }
)
;
}
/ * * Crear categor ?a (si no existe)
y el tipo en 1 sola llamada * / async function createCategoryAndType ( )
{
if ( !inlineCreate)
return;
const categoriaNombre = (inlineCreate.categoria | | " " )
.trim( )
;
const tipoNombre = (inlineCreate.tipo | | " " )
.trim( )
;
if ( !categoriaNombre | | !tipoNombre)
return;
setCreating(true)
;
setStatus( {
kind: "info" , msg: "Creando categor ?a y tipo?? }
)
;
try {
const res = await createTypeApi(nombre, catId)
const categoria = res? .categoria ? ? null;
const tipo = res? .tipo ? ? null;
if (categoria)
setCats ( (p)
= > [ . . .p, categoria] )
;
if (tipo)
setTypes( (p)
= > [ . . .p, {
. . .tipo, categoriaId: categoria? . _id ? ? categoria? .id }
] )
;
if (tipo & & (categoria? . _id | | categoria? .id)
)
{
setStatus( {
kind: "success " , msg: ` ?? ?? {categoriaNombre}
?? / ?? {tipoNombre}
??creados y seleccionados. ` }
)
;
// seleccionar y cerrar con una peque鐢?a pausa para que se vea el mensaje setTimeout( ( )
= > pick( {
. . .tipo, categoriaId: String(categoria. _id ? ? categoria.id)
, nombre: tipo.nombre }
)
, 3 0 0 )
;
}
else {
setStatus( {
kind: "error" , msg: "No se pudo crear el tipo. Revisa la consola . " }
)
;
}
}
catch (e)
{
console .error( "createCategoryAndType error" , e)
;
setStatus( {
kind: "error" , msg: e? .response? .data? .error | | e? .message | | "Error creando categor ?a y tipo. " }
)
;
}
finally {
setCreating(false)
;
setInlineCreate(null)
;
}
}
/ * * Crear solo el tipo dentro de una categor ?a ya existente * / async function addTypeOnly( )
{
const nombre = newName .trim( )
;
if ( !nombre)
{
setStatus( {
kind: "error" , msg: "Escribe el nombre del nuevo tipo. " }
)
;
return;
}
if ( !catId)
{
setStatus( {
kind: "error" , msg: "Selecciona una categor ?a para el nuevo tipo. " }
)
;
return;
}
setCreating(true)
;
setStatus( {
kind: "info" , msg: "Creando tipo?? }
)
;
try {
const created = await createTypeApi(nombre, catId)
;
setTypes( (p)
= > [ . . .p, created ] )
;
setNewName( " " )
;
setCatId( " " )
;
setStatus( {
kind: "success " , msg: ` ??Tipo ?? {created ? .nombre | | nombre}
??creado y seleccionado. ` }
)
;
setTimeout( ( )
= > pick(created )
, 2 5 0 )
;
}
catch (e)
{
console .error( "addTypeOnly error" , e)
;
setStatus( {
kind: "error" , msg: e? .response? .data? .error | | e? .message | | "Error creando tipo. " }
)
;
}
finally {
setCreating(false)
;
}
}
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 9 9 9 ] grid place items center bg black/ 4 0 p 3 " > <div className= "w [min( 8 2 0px, 9 6vw)
] rounded 2xl bg [var( panel)
] p 4 ring 1 ring border shadow xl" > <div className= "flex items center justify between mb 3 " > <h3 className= "text sm font semibold" >Elegir tipo de negocio < /h3 > <button className= "icon btn" onClick = {onClose }
aria label= "Cerrar" > ?? /button> < /div> {
/ * 妫?閺? Feedback inline * / }
{status & & ( <div role= "status" className= {cx( "mb 3 px 3 py 2 rounded lg text [ 1 3px] ring 1 " , status.kind = = = "success " & & "bg emerald 5 0 text emerald 7 0 0 ring emerald 2 0 0 " , status.kind = = = "error" & & "bg rose 5 0 text rose 7 0 0 ring rose 2 0 0 " , status.kind = = = "info" & & "bg [var( chip)
] / 2 0 text text/ 8 0 ring border" )
}
> {status.msg}
< /div> )
}
{
/ * Buscador + ayuda * / }
<div className= "flex gap 2 mb 3 " > <input className= "neo input flex 1 h 1 1 px 3 text [ 1 5px] " placeholder= "Buscar tipo o categor ?a ?? value= {search}
onChange= {
(e)
= > setSearch(e.target.value)
}
/ > <button type= "button" className= "btn tonal h 1 1 px 3 flex items center gap 2 " aria expanded= {showHelp}
onClick = {
( )
= > setShowHelp( (v)
= > !v)
}
title= {showHelp ? "Ocultar ayuda" : "Ver ayuda" }
> <ChevronDown size= {
1 6 }
className= {cx( "transition transform" , showHelp ? "rotate 1 8 0 " : " " )
}
/ > {showHelp ? "Ocultar ayuda" : "Ver ayuda" }
< /button> < /div> {
/ * Ayuda * / }
<div className= {cx( "rounded lg transition all" , showHelp ? "maxh [ 3 4 0px] mb 3 p 3 ring 1 ring border bg [var( chip)
] / 1 5 overflowyauto" : "maxh 0 mb 0 p 0 overflow hidden" )
}
aria hidden= {
!showHelp}
> <div className= "text xs spacey 3 leading relaxed pr 1 " > {SUGERENCIAS.map( (s)
= > ( <div key= {s.categoria}
className= "spacey 1 " > <div className= "font semibold" > {s.categoria}
< /div> <div className= "flex flex wrap gap 1 . 5 " > {s.tipos.map( (tipo)
= > ( <button key= {tipo}
type= "button" className= "px 2 . 5 py 1 rounded full ring 1 ring border text [ 1 2 . 5px] hover:bg emerald 5 0 " onClick = {
( )
= > onSuggestionClick(s.categoria, tipo)
}
title= {
` $ {tipo}
?? $ {s.categoria}
` }
> {tipo}
< /button> )
)
}
< /div> < /div> )
)
}
< /div> < /div> {
/ * Tipos existentes * / }
<div className= "maxh [ 3 4vh] overflowyauto pr 1 spacey 3 " > {loading & & <div className= "text sm subtle" >Cargando?? /div> }
{
!loading & & groupedExisting.length = = = 0 & & ( <div className= "text xs subtle" >No hay tipos registrados. < /div> )
}
{
!loading & & groupedExisting.map( ( [catName , items] )
= > ( <div key= {catName }
className= "rounded xl ring 1 ring border overflow hidden" > <div className= "px 3 py 2 text xs font semibold bg [var( chip)
] / 4 0 " > {catName }
< /div> {items.map( (t)
= > {
const key = t. _id ? ? t.id ? ? t.slug ? ? t.nombre;
return ( <button key= {key}
className= "w full text left px 3 py 2 mt [ 1px] flex items center justify between hover:bg emerald 5 0 transition" onClick = {
( )
= > pick(t)
}
title= {
`Seleccionar: $ {t.nombre}
` }
> <span> {t.nombre}
< /span> <span className= "text [ 1 1px] px 2 py 0 . 5 rounded full ring 1 ring border" > {catName }
< /span> < /button> )
;
}
)
}
< /div> )
)
}
< /div> {
/ * Crear solo tipo * / }
<div className= "mt 4 grid grid cols 1 md:grid cols [ 1fr_ 2 4 0px_auto] gap 2 items center" > <input className= "neo input h 1 1 px 3 text [ 1 5px] " placeholder= "Nuevo tipo (ej. Pupuser ?a m?vil)
" value= {newName }
onChange= {
(e)
= > setNewName(e.target.value)
}
/ > <select className= "neo input h 1 1 px 3 text [ 1 5px] " value= {catId}
onChange= {
(e)
= > setCatId(e.target.value)
}
> <option value= " " > ??Seleccione categor ?a ?? /option> {cats.map( (c)
= > ( <option key= {c. _id ? ? c.id}
value= {c. _id ? ? c.id}
> {c.nombre}
< /option> )
)
}
< /select> <button className= {cx( "btn tonal h 1 1 " , ( !newName .trim( )
| | !catId)
& & "opacity 6 0 cursor not allowed " )
}
type= "button" onClick = {addTypeOnly}
disabled= {creating | | !newName .trim( )
| | !catId}
title= "Crear y seleccionar" > <Plus className= "btn icon" / > {creating ? "Creando ?? : "Crear y seleccionar" }
< /button> < /div> {inlineCreate & & ( <div className= "mt 3 p 3 rounded xl ring 1 ring border bg [color mix(in_oklab,var( panel)
,black_ 3 % )
] " > <div className= "text sm mb 2 " > Crear categor ?a ?濞?inlineCreate.categoria}
??y tipo ?濞?inlineCreate.tipo}
?? < /div> <div className= "flex gap 2 " > <button className= "btn tonal" type= "button" onClick = {createCategoryAndType }
disabled= {creating}
> {creating ? "Creando ?? : "Crear categor ?a y tipo" }
< /button> <button className= "btn outline " type= "button" onClick = {
( )
= > setInlineCreate(null)
}
> Cancelar < /button> < /div> < /div> )
}
< /div> < /div> )
;
}