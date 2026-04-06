// client/src/features/corporativo/access/users/store/accessUsers.store.js import {
create }
from "zustand " ;
import {
listUsers, getUserById, createUser, updateUser, deleteUser, }
from " @ /features/corporativo/access/api/users.api.js" ;
const asArray = (value)
= > (Array.isArray (value)
? value : [ ] )
;
function safeString(value)
{
if (value = = null)
return " " ;
if (typeof value = = = "string" )
return value.trim( )
;
if (typeof value = = = "number" | | typeof value = = = "boolean " )
return String(value)
.trim( )
;
return " " ;
}
/ * * * Extrae un texto legible desde distintos formatos posibles. * Evita mostrar " [object Object] " en pantalla. * / function textFromUnknown(value, fallback = " " )
{
if (value = = null)
return fallback;
if (typeof value = = = "string" )
{
const text = value.trim( )
;
return text | | fallback;
}
if (typeof value = = = "number" | | typeof value = = = "boolean " )
{
return String(value)
.trim( )
| | fallback;
}
if (Array.isArray (value)
)
{
for (const item of value)
{
const text = textFromUnknown(item, " " )
;
if (text)
return text;
}
return fallback;
}
if (typeof value = = = "object" )
{
const candidates = [ value.name, value.label, value.title, value.displayName, value.key, value.slug, value.descripcion, value.description, value.value, ] ;
for (const candidate of candidates)
{
const text = textFromUnknown(candidate, " " )
;
if (text)
return text;
}
return fallback;
}
return fallback;
}
function normalizeBooleanActivo(item = {
}
)
{
if (typeof item.activo = = = "boolean " )
return item.activo;
const normalized = safeString(item.estado)
.toLowerCase( )
;
if (normalized = = = "activo" )
return true;
if (normalized = = = "inactivo" )
return false;
return false;
}
function normalizeUser(item = {
}
)
{
const roleName = textFromUnknown(item.roleName, "Sin rol" )
;
const roleKey = textFromUnknown(item.roleKey , " " )
;
const tenantNombre = textFromUnknown(item.tenantNombre, "Sin tenant" )
;
const tenantKey = textFromUnknown(item.tenantKey, " " )
;
const tenantTipo = textFromUnknown(item.tenantTipo, " " )
;
const membershipStatus = textFromUnknown(item.membershipStatus, " " )
;
const nombre = textFromUnknown(item.nombre, " " )
;
const email = textFromUnknown(item.email, " " )
;
const activo = normalizeBooleanActivo(item)
;
return {
. . .item, id: safeString(item.id ? ? item. _id ? ? item.mongoId )
, nombre, email, activo, estado: safeString(item.estado | | (activo ? "Activo" : "Inactivo" )
)
, tenantId: safeString(item.tenantId)
, tenantKey, tenantNombre, tenantTipo, rolId: safeString(item.rolId)
, roleKey , roleName, ultimoAcceso: item.ultimoAcceso | | null, membershipStatus, }
;
}
export const useAccessUsersStore = create( (set, get)
= > ( {
items: [ ] , total: 0 , page: 1 , limit: 5 0 , loading : false, saving: false, error: null, loaded: false, currentItem: null, lastParams: {
q: " " , estado: " " , tenantKey: " " , roleKey : " " , page: 1 , limit: 5 0 , }
, async cargar(params = {
}
)
{
const nextParams = {
. . .get( )
.lastParams, . . .params, }
;
set( {
loading : true, error: null, lastParams: nextParams, }
)
;
try {
const data = await listUsers(nextParams)
;
const items = asArray (data? .items)
.map(normalizeUser)
;
set( {
items, total: Number(data? .total | | 0 )
, page: Number(data? .page | | nextParams.page | | 1 )
, limit: Number(data? .limit | | nextParams.limit | | 5 0 )
, loading : false, loaded: true, }
)
;
return items;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error cargando usuarios" , }
)
;
throw error;
}
}
, async obtenerPorId(id)
{
set( {
loading : true, error: null, currentItem: null }
)
;
try {
const data = await getUserById(id)
;
const item = normalizeUser(data? .item | | data)
;
set( {
loading : false, currentItem: item, }
)
;
return item;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error cargando usuario " , }
)
;
throw error;
}
}
, limpiarActual( )
{
set( {
currentItem: null }
)
;
}
, async crear(payload )
{
set( {
saving: true, error: null }
)
;
try {
const data = await createUser(payload )
;
const created = normalizeUser(data? .item | | data)
;
set( (state)
= > ( {
saving: false, items: [created , . . .state.items] , total: state.total + 1 , }
)
)
;
return created ;
}
catch (error)
{
set( {
saving: false, error: error? .message | | "Error creando usuario " , }
)
;
throw error;
}
}
, async actualizar(id, payload )
{
set( {
saving: true, error: null }
)
;
try {
const data = await updateUser(id, payload )
;
const updated = normalizeUser(data? .item | | data)
;
set( (state)
= > ( {
saving: false, currentItem: updated , items: state.items.map( (item)
= > (item.id = = = updated .id ? updated : item)
)
, }
)
)
;
return updated ;
}
catch (error)
{
set( {
saving: false, error: error? .message | | "Error actualizando usuario " , }
)
;
throw error;
}
}
, async eliminar(id)
{
set( {
saving: true, error: null }
)
;
try {
await deleteUser(id)
;
set( (state)
= > ( {
saving: false, items: state.items.filter( (item)
= > item.id ! = = String(id)
)
, total: Math.max( 0 , state.total 1 )
, }
)
)
;
return true;
}
catch (error)
{
set( {
saving: false, error: error? .message | | "Error eliminando usuario " , }
)
;
throw error;
}
}
, }
)
)
;