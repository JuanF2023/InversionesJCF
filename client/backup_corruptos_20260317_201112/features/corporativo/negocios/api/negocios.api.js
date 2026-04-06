// client/src/features/corporativo/negocios/api/negocios.api.js import http from " @ /services/api/HttpClient.js" ;
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
export async function getNegocios(params = {
}
)
{
try {
const res = await http.get( " /corporativo/negocios" , {
params }
)
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando negocios" )
;
}
}
export async function getNegocioById (id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.get( ` /corporativo/negocios/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando negocio " )
;
}
}
export async function createNegocio(payload )
{
try {
const res = await http.post( " /corporativo/negocios" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error creando negocio " )
;
}
}
export async function updateNegocio(id, payload )
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.patch( ` /corporativo/negocios/ $ {safeId}
` , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error actualizando negocio " )
;
}
}
export async function deleteNegocio(id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.delete( ` /corporativo/negocios/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error eliminando negocio " )
;
}
}