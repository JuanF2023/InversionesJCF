// client/src/features/corporativo/access/api/businesses.api.js import http from " @ /services/api/HttpClient.js" ;
function buildApiError(error, fallbackMsg)
{
const status = error? .response? .status;
const data = error? .response? .data | | {
}
;
const rawMsg = data? .message | | data? .error | | fallbackMsg | | "Error inesperado" ;
// Mensajes UX correctos (enterprise multi tenant)
let message = rawMsg;
const isTenantMissing = status = = = 4 0 0 & & (String(rawMsg)
.toLowerCase( )
.includes( "tenantid" )
| | String(rawMsg)
.toLowerCase( )
.includes( "tenant id" )
| | String(rawMsg)
.toLowerCase( )
.includes( "tenant" )
)
;
if (isTenantMissing)
{
message = "No se pudo cargar la informaci璐?n : falta el Tenant (multi tenant)
. Revisa tu sesi璐?n activa. " ;
}
else if (status = = = 4 0 1 | | status = = = 4 0 3 )
{
message = "No autorizado. Verifica tu sesi璐?n y permisos. " ;
}
else if (status = = = 4 0 4 )
{
message = "Recurso no encontrado. " ;
}
else if (status > = 5 0 0 )
{
message = "Error del servidor. Intenta m璋?s tarde. " ;
}
const err = new Error(message )
;
err.status = status;
err.serverData = data;
err.originalMessage = rawMsg;
err.isTenantMissing = Boolean (isTenantMissing)
;
return err;
}
function throwApiError(error, fallbackMsg)
{
throw buildApiError(error, fallbackMsg)
;
}
/ * * * API Negocios (Corporativo)
閳? CRUD real * * Backend : * /api/corporativo/businesses * / const BASE = " /corporativo/businesses" ;
/ * * * Lista negocios. * GET /api/corporativo/businesses * / export async function listBusinesses (params = {
}
)
{
try {
const res = await http.get(BASE, {
params }
)
;
return res.data;
}
catch (error)
{
throwApiError(error, "Error cargando negocios" )
;
}
}
/ * * * Obtiene negocio por id. * GET /api/corporativo/businesses/ :id * / export async function getBusinessById(id)
{
try {
const res = await http.get( ` $ {BASE}
/ $ {id}
` )
;
return res.data;
}
catch (error)
{
throwApiError(error, "Error cargando negocio " )
;
}
}
/ * * * Crea negocio . * POST /api/corporativo/businesses * / export async function createBusiness (payload )
{
try {
const res = await http.post(BASE, payload )
;
return res.data;
}
catch (error)
{
throwApiError(error, "Error creando negocio " )
;
}
}
/ * * * Actualiza negocio . * PUT /api/corporativo/businesses/ :id * / export async function updateBusiness (id, payload )
{
try {
const res = await http.put( ` $ {BASE}
/ $ {id}
` , payload )
;
return res.data;
}
catch (error)
{
throwApiError(error, "Error actualizando negocio " )
;
}
}
/ * * * Elimina negocio (soft delete)
. * DELETE /api/corporativo/businesses/ :id * / export async function removeBusiness (id)
{
try {
const res = await http.delete( ` $ {BASE}
/ $ {id}
` )
;
return res.data;
}
catch (error)
{
throwApiError(error, "Error eliminando negocio " )
;
}
}
/ * * Alias por compatibilidad * / export const deleteBusiness = removeBusiness ;
/ * * Export opcional por si alg鐓?n caller necesita mapear mensajes sin lanzar * / export {
buildApiError }
;