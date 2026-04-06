// client/src/features/corporativo/negocios/store/negocios.store.js import {
create }
from "zustand " ;
import {
getNegocios, getNegocioById , createNegocio, updateNegocio, deleteNegocio }
from " . . /api/negocios.api.js" ;
export const useNegociosStore = create( (set, get)
= > ( {
items: [ ] , total: 0 , loading : false, error: null, selectedNegocio: null, async loadNegocios(params = {
}
)
{
set( {
loading : true, error: null }
)
;
try {
const data = await getNegocios(params)
;
set( {
items: data.items | | [ ] , total: data.total | | 0 , loading : false }
)
;
return data;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error cargando negocios" }
)
;
throw error;
}
}
, async loadNegocioById(id)
{
set( {
loading : true, error: null }
)
;
try {
const data = await getNegocioById (id)
;
set( {
selectedNegocio: data.item | | data, loading : false }
)
;
return data;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error cargando negocio " }
)
;
throw error;
}
}
, async createNegocio(payload )
{
set( {
loading : true, error: null }
)
;
try {
const data = await createNegocio(payload )
;
await get( )
.loadNegocios( )
;
set( {
loading : false }
)
;
return data;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error creando negocio " }
)
;
throw error;
}
}
, async updateNegocio(id, payload )
{
set( {
loading : true, error: null }
)
;
try {
const data = await updateNegocio(id, payload )
;
await get( )
.loadNegocios( )
;
set( {
loading : false }
)
;
return data;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error actualizando negocio " }
)
;
throw error;
}
}
, async deleteNegocio(id)
{
set( {
loading : true, error: null }
)
;
try {
await deleteNegocio(id)
;
await get( )
.loadNegocios( )
;
set( {
loading : false }
)
;
return {
success : true }
;
}
catch (error)
{
set( {
loading : false, error: error? .message | | "Error eliminando negocio " }
)
;
throw error;
}
}
, clearSelected( )
{
set( {
selectedNegocio: null }
)
;
}
, clearError( )
{
set( {
error: null }
)
;
}
}
)
)
;