// client/src/features/corporativo/access/users/store/accessMemberships.store.js import {
create }
from "zustand " ;
import {
getUserAccessOptions, updateUserAccess, }
from " @ /features/corporativo/access/api/users.api.js" ;
const asArray = (value)
= > (Array.isArray (value)
? value : [ ] )
;
function text(value)
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
function normalizeOption(item = {
}
)
{
return {
id: text(item.id ? ? item. _id)
, key: text(item.key)
, slug: text(item.slug)
, nombre: text(item.nombre ? ? item.name ? ? item.label)
, tenantType: text(item.tenantType)
, tipo: text(item.tipo ? ? item.type)
, status: text(item.status)
, }
;
}
export const useAccessMembershipsStore = create( (set)
= > ( {
tenants : [ ] , roles: [ ] , loadingOptions : false, saving: false, error: null, loaded: false, async cargarOpciones ( )
{
set( {
loadingOptions : true, error: null }
)
;
try {
const data = await getUserAccessOptions( )
;
set( {
tenants : asArray (data? .tenants )
.map(normalizeOption)
, roles: asArray (data? .roles)
.map(normalizeOption)
, loadingOptions : false, loaded: true, }
)
;
}
catch (error)
{
set( {
loadingOptions : false, error: error? .message | | "Error cargando opciones de acceso" , }
)
;
throw error;
}
}
, async guardarAccesoUsuario(userId, payload = {
}
)
{
set( {
saving: true, error: null }
)
;
try {
const data = await updateUserAccess(userId, payload )
;
set( {
saving: false }
)
;
return data? .item | | data;
}
catch (error)
{
set( {
saving: false, error: error? .message | | "Error guardando acceso del usuario " , }
)
;
throw error;
}
}
, limpiar ( )
{
set( {
error: null }
)
;
}
, }
)
)
;