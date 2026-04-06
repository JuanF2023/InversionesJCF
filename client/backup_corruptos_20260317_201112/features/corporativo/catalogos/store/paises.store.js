// client/src/store/core/paises.store.js import {
create }
from "zustand " ;
import {
extractItems }
from " @ /utils/api" ;
import {
listPaises }
from " @ /features/corporativo/catalogos/api/paises.api.js" ;
/ * * * Normaliza los pa?ses a un shape est?ndar: * {
* id, * codigoIso, // ej. "SV" , "US" * nombre, // ej. "El Salvador" * banderaUrl, // URL de la bandera (opcional)
* }
* / function normalizePaises(rawItems = [ ] )
{
const items = Array.isArray (rawItems)
? rawItems : [ ] ;
return items .map( (p)
= > {
const id = p.id ? ? p. _id ? ? p.codigoIso ? ? p.codigo ? ? p.code;
const codigoIso = p.codigoIso ? ? p.code ? ? p.iso ? ? p.iso2 ? ? p.codigo ? ? null;
const nombre = p.nombre ? ? p.name ? ? p.descripcion ? ? p.descripcionLarga ? ? "Pa?s sin nombre" ;
const banderaUrl = p.banderaUrl ? ? p.flagUrl ? ? p.flag ? ? p.icono ? ? p.icon ? ? p.bandera ? ? null;
return {
id, codigoIso, nombre, banderaUrl, raw: p, }
;
}
)
.filter( (p)
= > p.id ! = null)
;
}
export const usePaisesStore = create( (set, get)
= > ( {
paisesCatalogo : [ ] , loading : false, loaded: false, error: null, / * * * Carga cat?logo de pa?ses desde el API. * Se puede forzar con {
force: true }
. * / async cargar( {
force = false }
= {
}
)
{
const {
loading , loaded }
= get( )
;
if (loading | | (loaded & & !force)
)
return;
set( {
loading : true, error: null }
)
;
try {
const resp = await listPaises( )
;
const rawData = resp? .data ? ? resp;
const itemsRaw = normalizePaises(extractItems(rawData )
? ? rawData )
;
const ordenados = [ . . .itemsRaw] .sort( (a, b)
= > String(a.nombre)
.localeCompare(String(b.nombre)
, "es" , {
sensitivity: "base" , }
)
)
;
set( {
paisesCatalogo : ordenados, loaded: true, }
)
;
return ordenados;
}
catch (err)
{
console .error( " [paises.store] error al cargar pa?ses: " , err)
;
set( {
error: err? .message | | "No se pudo cargar el cat?logo de pa?ses" , loaded: true, }
)
;
return [ ] ;
}
finally {
set( {
loading : false }
)
;
}
}
, / * * Prefetch silencioso (por ejemplo , desde layouts )
* / prefetch( )
{
const {
loading , loaded }
= get( )
;
if ( !loading & & !loaded)
{
get( )
.cargar( )
;
}
}
, / * * Reset del m?dulo de pa?ses * / reset( )
{
set( {
paisesCatalogo : [ ] , loading : false, loaded: false, error: null, }
)
;
}
, }
)
)
;
// Debug opcional en ventana if (typeof window ! = = "undefined" )
{
window. _ _paisesStore = usePaisesStore ;
}