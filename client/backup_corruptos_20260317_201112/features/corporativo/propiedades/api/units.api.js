// client/src/features/corporativo/propiedades/api/units.api.js import http from " @ /services/api/HttpClient.js" ;
function normalizeError (error, fallbackMsg)
{
const status = error? .response? .status;
const data = error? .response? .data | | {
}
;
const err = new Error(data? .message | | data? .error | | fallbackMsg)
;
err.status = status;
err.serverData = data;
throw err;
}
export async function getUnits(params = {
}
)
{
try {
const res = await http.get( " /corporativo/unidades" , {
params }
)
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando unidades" )
;
}
}
export async function getUnitById(id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.get( ` /corporativo/unidades/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando unidad" )
;
}
}
export async function createUnit(payload )
{
try {
const res = await http.post( " /corporativo/unidades" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error creando unidad" )
;
}
}
export async function updateUnit(id, payload )
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.patch( ` /corporativo/unidades/ $ {safeId}
` , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error actualizando unidad" )
;
}
}
export async function deleteUnit(id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.delete( ` /corporativo/unidades/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error eliminando unidad" )
;
}
}