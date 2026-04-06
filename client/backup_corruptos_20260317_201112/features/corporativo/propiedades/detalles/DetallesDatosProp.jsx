// client/src/pages/Corporativo/Propiedades/Detalles/DetallesDatosProp.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useNavigate }
from "React router dom" ;
import {
listProperties , getPropertyById }
from " @ /services/api/properties.api.js" ;
import {
RefreshCw, Plus, FileDown, Pencil }
from "lucide React" ;
import {
usePropertiesStore }
from " @ /store/properties.store.js" ;
// UI import {
DataTable }
from " @ /components/ui/table" ;
import ConfirmModal from " @ /features/corporativo/components/modals/ConfirmModal.jsx" ;
import PropertyMediaLightbox from " @ /components/properties/PropertyMediaLightbox .jsx" ;
import AddPropertyModal from " @ /components/modals/AddPropertyModal.jsx" ;
import {
notify }
from " @ /utils/notify" ;
const API_BASE = (import.meta.env.VITE_API_URL & & import.meta.env.VITE_API_URL.replace ( / \ / + $ / , " " )
)
| | "http://localhost: 4 0 0 0 " ;
const DASH = " ?? ;
/ * helpers (enterprise)
* / const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const money = (n)
= > {
const x = Number(n ? ? 0 )
;
if ( !isFinite(x)
)
return " $ 0 . 0 0 " ;
return x.toLocaleString ( "es US" , {
style: "currency" , currency: "USD" , maximumFractionDigits : 2 , }
)
;
}
;
// ??ID can?nico: mongoId > _id > id > codigo > codigoProp const getApiId = (x)
= > {
const v = x? .mongoId ? ? x? . _id ? ? x? .id ? ? x? .codigo ? ? x? .codigoProp ? ? null;
return v ? String(v)
.trim( )
: " " ;
}
;
// ??Label amigable: nombre > Propiedad {codigo}
> fallback const getPropLabel = (p)
= > {
const nombre = String(p? .nombre | | " " )
.trim( )
;
if (nombre)
return nombre;
const codigo = String(p? .codigo ? ? p? .id ? ? " " )
.trim( )
;
if (codigo)
return `Propiedad $ {codigo}
` ;
const pid = getApiId(p)
;
return pid ? `Propiedad $ {pid.slice( 6 )
}
` : "Propiedad" ;
}
;
const ym = (iso)
= > {
if ( !iso)
return {
y: 0 , m: 0 , label: DASH }
;
const a = new Date( ` $ {String(iso)
.slice( 0 , 1 0 )
}T0 0 : 0 0 : 0 0 ` )
;
const b = new Date( )
;
if (isNaN(a)
)
return {
y: 0 , m: 0 , label: DASH }
;
let y = b.getFullYear( )
a.getFullYear( )
;
let m = b.getMonth( )
a.getMonth( )
;
if (m < 0 )
{
y = 1 ;
m + = 1 2 ;
}
return {
y, m, label: ` $ {y}
a鐢?os $ {m}
meses` }
;
}
;
const styleDetail = {
background: `linear gradient( 1 8 0deg, color mix(in oklab, var( card)
9 8 % , var( accent)
2 % )
, color mix(in oklab, var( card)
9 4 % , var( accent)
6 % )
)
` , }
;
function absMediaUrl(u = " " )
{
const s = String(u | | " " )
.trim( )
;
if ( !s)
return " " ;
// Absolutas o blob/data if ( / ^ (https? : |data: |blob: )
/i.test(s)
)
return s;
// Normaliza a path con slash const p = s.startsWith( " / " )
? s : ` / $ {s}
` ;
// Casos ya correctos if (p.startsWith( " /api/uploads / " )
)
return ` $ {API_BASE}
$ {p}
` ;
// Legacy: /uploads / . . . > /api/uploads / . . . if (p.startsWith( " /uploads / " )
)
return ` $ {API_BASE}
/api$ {p}
` ;
// Caso raro: " /api/ . . . " pero no es uploads if (p.startsWith( " /api/ " )
)
return ` $ {API_BASE}
$ {p}
` ;
// Fallback: asumimos uploads const clean = p.replace ( / ^ \ / ?uploads \ / ? /i, " " )
.replace ( / ^ \ / + / , " " )
;
return ` $ {API_BASE}
/api/uploads / $ {clean}
` ;
}
/ * vista * / export default function DetallesDatosProp( )
{
const navigate = useNavigate( )
;
const [items, setItems] = useState( [ ] )
;
const [prop, setProp ] = useState(null)
;
const [loading , setLoading] = useState(false)
;
const [err, setErr] = useState(null)
;
const [showAdd , setShowAdd] = useState(false)
;
const [viewerOpen, setViewerOpen] = useState(false)
;
const [viewerIndex, setViewerIndex ] = useState( 0 )
;
const [confirmDelete, setConfirmDelete] = useState(null)
;
const {
selectedPropId , setSelectedPropId }
= usePropertiesStore( (s)
= > ( {
selectedPropId : s.selectedPropId , setSelectedPropId: s.select, }
)
)
;
const selectedId = useMemo ( ( )
= > String(selectedPropId | | " " )
.trim( )
, [selectedPropId ] )
;
const colsKV = useMemo ( ( )
= > [ {
key: "k" , header: "Campo" , width: 2 2 0 }
, {
key: "v" , header: "Valor" }
, ] , [ ] )
;
/ * carga inicial (lista)
* / useEffect( ( )
= > {
let mounted = true;
(async ( )
= > {
try {
setLoading(true)
;
setErr(null)
;
const resp = await listProperties ( )
;
const raw = resp? .data ? ? resp;
const list = Array.isArray (raw? .items)
? raw.items : Array.isArray (raw)
? raw : raw? .items ? ? [ ] ;
const all = (list | | [ ] )
.map( (p)
= > ( {
. . .p, _ _pid: getApiId(p)
}
)
)
.filter( (p)
= > p. _ _pid)
.sort( (a, b)
= > String(a.codigo ? ? a.id ? ? a.nombre ? ? " " )
.localeCompare( String(b.codigo ? ? b.id ? ? b.nombre ? ? " " )
, undefined, {
numeric : true, sensitivity: "base" }
)
)
;
if ( !mounted )
return;
setItems(all)
;
if ( !selectedId & & all[ 0 ] ? . _ _pid)
{
setSelectedPropId(all[ 0 ] . _ _pid)
;
}
}
catch (e)
{
console .error(e)
;
if (mounted )
setErr( "No se pudo cargar la lista. " )
;
}
finally {
if (mounted )
setLoading(false)
;
}
}
)
( )
;
return ( )
= > {
mounted = false;
}
;
// eslint disable next line React hooks/exhaustive deps }
, [ ] )
;
/ * cargar detalle * / useEffect( ( )
= > {
if ( !selectedId)
{
setProp (null)
;
return;
}
const ctl = new AbortController( )
;
(async ( )
= > {
try {
setLoading(true)
;
setErr(null)
;
const resp = await getPropertyById(selectedId, {
signal: ctl.signal }
)
;
const payload = resp? .data ? ? resp;
const normalized = payload ? .property ? ? payload ? .data? .property ? ? payload ? .item ? ? payload ? .data? .item ? ? payload ;
setProp (normalized | | null)
;
}
catch (e)
{
if (e? .name ! = = "AbortError" )
{
console .error(e)
;
setErr( "No se pudo cargar la propiedad. " )
;
setProp (null)
;
}
}
finally {
setLoading(false)
;
}
}
)
( )
;
return ( )
= > ctl.abort( )
;
}
, [selectedId] )
;
/ * acciones * / const onReload = async ( )
= > {
try {
setLoading(true)
;
setErr(null)
;
const resp = await listProperties ( )
;
const raw = resp? .data ? ? resp;
const list = Array.isArray (raw? .items)
? raw.items : Array.isArray (raw)
? raw : raw? .items ? ? [ ] ;
const all = (list | | [ ] )
.map( (p)
= > ( {
. . .p, _ _pid: getApiId(p)
}
)
)
.filter( (p)
= > p. _ _pid)
.sort( (a, b)
= > String(a.codigo ? ? a.id ? ? a.nombre ? ? " " )
.localeCompare( String(b.codigo ? ? b.id ? ? b.nombre ? ? " " )
, undefined, {
numeric : true, sensitivity: "base" }
)
)
;
setItems(all)
;
if ( !all.length)
{
setSelectedPropId(null)
;
setProp (null)
;
return;
}
const still = all.find( (x)
= > String(x. _ _pid)
= = = String(selectedId)
)
;
const nextId = still? . _ _pid | | all[ 0 ] . _ _pid;
setSelectedPropId(nextId)
;
}
catch (e)
{
console .error(e)
;
setErr( "No se pudo recargar. " )
;
}
finally {
setLoading(false)
;
}
}
;
const onExport = ( )
= > {
try {
const blob = new Blob( [JSON.stringify(items, null, 2 )
] , {
type: "application/json" }
)
;
const url = URL.createObjectURL(blob)
;
const a = document.createElement( "a" )
;
a.href = url;
a.download = "propiedades.json" ;
a.click( )
;
URL.revokeObjectURL(url)
;
}
catch (e)
{
console .error(e)
;
notify.error( "No se pudo exportar. " )
;
}
}
;
const onEdit = ( )
= > {
const pid = getApiId(prop)
| | selectedId;
if ( !pid)
return notify.error( "No hay propiedad seleccionada. " )
;
navigate( ` /corporativo/propiedades/ $ {encodeURIComponent(pid)
}
/editar` )
;
}
;
const openViewer = (idx)
= > {
setViewerIndex (idx)
;
setViewerOpen(true)
;
}
;
const viewerPrev = ( )
= > setViewerIndex ( (i)
= > (i < = 0 ? (prop? .media? .length | | 1 )
1 : i 1 )
)
;
const viewerNext = ( )
= > setViewerIndex ( (i)
= > (i > = (prop? .media? .length | | 1 )
1 ? 0 : i + 1 )
)
;
/ * eliminar multimedia * / const doDeleteMedia = async (item)
= > {
if ( !prop | | !item? . _id)
return;
try {
const propId = getApiId(prop)
;
if ( !propId)
throw new Error( "Propiedad sin ID" )
;
const res = await fetch( ` $ {API_BASE}
/api/properties/ $ {encodeURIComponent(propId)
}
/media/ $ {encodeURIComponent(item. _id)
}
` , {
method: "DELETE" }
)
;
if ( !res.ok)
throw new Error( `HTTP $ {res.status}
` )
;
setProp ( (prev)
= > ( {
. . .prev, media: (prev? .media | | [ ] )
.filter( (m)
= > m. _id ! = = item. _id)
, }
)
)
;
setViewerIndex ( (i)
= > Math.max( 0 , Math.min(i, (prop? .media? .length | | 1 )
2 )
)
)
;
notify.success ( "Elemento eliminado" )
;
}
catch (e)
{
console .error(e)
;
notify.error( "No se pudo eliminar el multimedia" )
;
}
finally {
setConfirmDelete(null)
;
if ( (prop? .media? .length | | 0 )
< = 1 )
setViewerOpen(false)
;
}
}
;
/ * data (tablas)
* / const dataCompraValor = useMemo ( ( )
= > {
const fechaCompra = prop? .fechaCompra | | prop? .historia? .fechaCompra | | null;
return [ {
k: "Fecha de compra" , v: fechaCompra ? String(fechaCompra)
.slice( 0 , 1 0 )
: DASH }
, {
k: "Precio de compra" , v: money(Number(prop? .precioCompra ? ? prop? .historia? .precioCompra ? ? 0 )
)
, }
, {
k: "Valor actual" , v: money(Number(prop? .valorActual ? ? prop? .valores ? .valorActual ? ? 0 )
)
, }
, {
k: "Costo total actual" , v: money(Number(prop? .costoTotalActual ? ? prop? .valores ? .costoTotalActual ? ? prop? .costoTotal ? ? 0 )
)
, }
, {
k: "Antig閻?edad" , v: ym(fechaCompra)
.label, }
, ] ;
}
, [prop] )
;
const dataUbicacion = useMemo ( ( )
= > [ {
k: "Pa?s " , v: prop? .ubicacion? .pais | | prop? .pais | | DASH }
, {
k: "Departamento" , v: prop? .ubicacion? .departamento | | prop? .departamento | | DASH }
, {
k: "Municipio" , v: prop? .ubicacion? .municipio | | prop? .municipio | | DASH }
, {
k: "Ciudad" , v: prop? .ubicacion? .ciudad | | prop? .ciudad | | DASH }
, {
k: "Direcci ?n general " , v: prop? .ubicacionGeneral | | DASH }
, {
k: "Direcci ?n " , v: prop? .ubicacion? .direccion | | prop? .direccion | | DASH }
, {
k: "Calle de acceso" , v: prop? .calleAcceso | | prop? .dimensiones? .acceso | | DASH }
, {
k: "Notas" , v: prop? .notas | | DASH }
, ] , [prop] )
;
const dataAdmin = useMemo ( ( )
= > [ {
k: "ID" , v: getApiId(prop)
| | DASH }
, {
k: "C?digo" , v: prop? .codigo | | prop? .id | | DASH }
, {
k: "Nombre" , v: prop? .nombre | | DASH }
, {
k: "Tipo" , v: prop? .tipoPropiedad | | prop? .tipo | | DASH }
, {
k: "Dimensi ?n (mt)
" , v: prop? .dimension | | prop? .dimensiones? .medidasDeclaradas | | DASH }
, {
k: "Escritura" , v: prop? .escritura ? "S?" : "No" }
, {
k: " 閼?rboles" , v: prop? .arboles ? ? DASH }
, {
k: "Estado" , v: prop? .estado | | DASH }
, ] , [prop] )
;
/ * render * / return ( <div className= "container 9 0 py 4 " > <div className= "mb 4 flex flex wrap items center gap 2 " > <button className= "btn tonal btn action" onClick = {onReload}
disabled= {loading }
> <RefreshCw size= {
1 6 }
className= {loading ? "animate spin" : " " }
/ > Recargar < /button> <button className= "btn gradient btn shimmer " onClick = {
( )
= > setShowAdd(true)
}
> <Plus className= "btn icon" / > Agregar < /button> <button className= "btn tonal btn action" onClick = {onExport}
> <FileDown size= {
1 6 }
/ > Exportar < /button> <button className= "btn tonal btn action" onClick = {onEdit}
disabled= {
!selectedId | | !prop}
> <Pencil size= {
1 6 }
/ > Editar < /button> {err & & <span className= "text rose 5 0 0 ml 2 text sm" > {err}
< /span> }
< /div> <div className= "neo card p 4 " > {
!prop ? ( <div className= "subtle text sm" > {loading ? "Cargando propiedad?? : "Selecciona una propiedad para ver sus detalles. " }
< /div> )
: ( < > <div className= "mb 3 flex items center justify between gap 2 " > <div className= "minw 0 " > <div className= "text base font semibold truncate" > {getPropLabel(prop)
}
< /div> <div className= "text xs subtle truncate" >ID: {getApiId(prop)
| | DASH}
< /div> < /div> <button className= "btn tonal btn action shrink 0 " onClick = {onEdit}
> <Pencil size= {
1 6 }
/ > Editar propiedad < /button> < /div> <div className= "grid grid cols 1 lg:grid cols 3 gap 4 mb 4 " > <DetailCard title= "Multimedia" > {
!prop? .media? .length ? ( <div className= "neo plate h 3 6 grid place items center" > <span className= "subtle text xs" >Sin fotos / videos< /span> < /div> )
: ( <div className= "grid grid cols 2 sm:grid cols 3 gap 3 " > {prop.media.map( (m, i)
= > ( <div key= {
` $ {m? . _id | | " " }
$ {m? .url | | i}
` }
className= "relative rounded lg overflow hidden ring 1 ring border cursor zoom in" onClick = {
( )
= > openViewer(i)
}
title= "Ver" > {m? .kind = = = "video" ? ( <div className= "relative w full" style= {
{
aspectRatio: " 1 6 / 9 " }
}
> <video src= {absMediaUrl(m.url)
}
className= "absolute inset 0 w full h full object cover pointer events none" / > < /div> )
: ( <img src= {absMediaUrl(m.url)
}
alt= " " className= "w full h full object cover" style= {
{
aspectRatio: " 1 6 / 9 " }
}
/ > )
}
< /div> )
)
}
< /div> )
}
< /DetailCard> <DetailCard title= "Compra y valor" > <DataTable columns = {colsKV}
data= {dataCompraValor}
pageSize= {
6 }
dense / > < /DetailCard> <DetailCard title= "Relaci?n operativa" > <div className= "grid grid cols 2 gapy 1 text sm" > <div>Negocios en esta propiedad< /div> <div className= "text right" > {prop? .negociosEnPropiedad ? ? 0 }
< /div> <div>Unidades activas < /div> <div className= "text right" > {prop? .unidadesActivas ? ? 0 }
< /div> <div>Ingreso mensual actual< /div> <div className= "text right" > {money( Number( prop? .ingresoMensualActual ? ? prop? .valores ? .ingresoMensualActual ? ? prop? .valor? .ingresoMensualActual ? ? 0 )
)
}
< /div> <div>Ingreso acumulado< /div> <div className= "text right" > {money(Number(prop? .ingresoAcumulado ? ? 0 )
)
}
< /div> < /div> < /DetailCard> < /div> <div className= "grid grid cols 1 lg:grid cols 3 gap 4 " > <DetailCard title= "Ubicaci ?n " > <DataTable columns = {colsKV}
data= {dataUbicacion}
pageSize= {
7 }
dense / > < /DetailCard> <DetailCard title= "Dimensiones" > <div className= "grid grid cols 2 gapy 1 text sm" > <div>Dimensi ?n (mt)
< /div> <div className= "text right" > {prop? .dimensions? .medidasDeclaradas | | prop? .dimensionMt | | prop? .dimension | | DASH}
< /div> <div> 閼?rea (m閾?)
< /div> <div className= "text right" > {prop? .areaM2 ? ? prop? .dimensiones? .areaM2 ? ? DASH}
< /div> <div> 閼?rea (v閾?)
< /div> <div className= "text right" > {prop? .areaV2 ? ? prop? .dimensiones? .areaV2 ? ? DASH}
< /div> <div>Costo / m閾?< /div> <div className= "text right" > {money(Number(prop? .costoMetro2 ? ? 0 )
)
}
< /div> < /div> < /DetailCard> <DetailCard title= "Administraci?n " > <DataTable columns = {colsKV}
data= {dataAdmin}
pageSize= {
8 }
dense / > < /DetailCard> < /div> < / > )
}
< /div> {
/ * Modales * / }
{showAdd & & <AddPropertyModal open= {showAdd }
onClose = {
( )
= > setShowAdd(false)
}
/ > }
{
/ * Viewer * / }
<PropertyMediaLightbox open= {viewerOpen}
items= {prop? .media | | [ ] }
index= {viewerIndex}
onClose = {
( )
= > setViewerOpen(false)
}
onPrev= {viewerPrev}
onNext= {viewerNext}
onDelete= {
(item)
= > setConfirmDelete(item)
}
/ > {
/ * Confirmar eliminar * / }
<ConfirmModal open= {
! !confirmDelete}
tone= "danger" title= "Eliminar archivo " message = " ?Eliminar este elemento de multimedia? " confirmText= "Eliminar" cancelText= "Cancelar" onCancel= {
( )
= > setConfirmDelete(null)
}
onConfirm= {
( )
= > doDeleteMedia(confirmDelete)
}
/ > < /div> )
;
}
const DetailCard = ( {
title, children }
)
= > ( <div className= "neo card p 4 " style= {styleDetail}
> <div className= "text sm font semibold mb 2 " > {title}
< /div> {children}
< /div> )
;