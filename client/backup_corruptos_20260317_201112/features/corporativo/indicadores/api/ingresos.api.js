// client/src/features/corporativo/indicadores/api/ingresos.api.js import http from " @ /services/api/HttpClient.js" ;
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
export async function getIngresos(params = {
}
)
{
try {
const res = await http.get( " /corporativo/indicadores/ingresos" , {
params }
)
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando ingresos" )
;
}
}
export async function getIngresoById (id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.get( ` /corporativo/indicadores/ingresos/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando ingreso " )
;
}
}
export async function createIngreso(payload )
{
try {
const res = await http.post( " /corporativo/indicadores/ingresos" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error creando ingreso " )
;
}
}
export async function updateIngreso(id, payload )
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.patch( ` /corporativo/indicadores/ingresos/ $ {safeId}
` , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error actualizando ingreso " )
;
}
}
export async function deleteIngreso(id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.delete( ` /corporativo/indicadores/ingresos/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error eliminando ingreso " )
;
}
}