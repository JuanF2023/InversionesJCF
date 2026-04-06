// client/src/features/corporativo/propiedades/store/properties.store.js import {
create }
from "zustand " ;
import {
getProperties, getPropertyById, createProperty , updateProperty , deleteProperty }
from " . . /api/properties.api.js" ;
export const usePropertiesStore = create( (set, get)
= > ( {
items: [ ] , total: 0 , loading : false, error: null, selectedProperty: null, async loadProperties (params = {
}
)
{
set( {
loading : true, error: null }
)
;
try {
const data = await getProperties(params)
;
set( {
items: data.items | | [ ] , total: data.total | | 0 , loading : false }
)
;
}
catch (error)
{
set( {
loading : false, error: error? .message }
)
;
}
}
, async loadPropertyById(id)
{
set( {
loading : true, error: null }
)
;
try {
const data = await getPropertyById(id)
;
set( {
selectedProperty: data.item, loading : false }
)
;
}
catch (error)
{
set( {
loading : false, error: error? .message }
)
;
}
}
, async createProperty (payload )
{
set( {
loading : true, error: null }
)
;
try {
const data = await createProperty (payload )
;
await get( )
.loadProperties ( )
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
loading : false, error: error? .message }
)
;
throw error;
}
}
, async updateProperty (id, payload )
{
set( {
loading : true, error: null }
)
;
try {
const data = await updateProperty (id, payload )
;
await get( )
.loadProperties ( )
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
loading : false, error: error? .message }
)
;
throw error;
}
}
, async deleteProperty (id)
{
set( {
loading : true, error: null }
)
;
try {
await deleteProperty (id)
;
await get( )
.loadProperties ( )
;
set( {
loading : false }
)
;
}
catch (error)
{
set( {
loading : false, error: error? .message }
)
;
throw error;
}
}
, clearSelected( )
{
set( {
selectedProperty: null }
)
;
}
}
)
)
;