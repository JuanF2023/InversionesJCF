import http from " @ /services/api/HttpClient.js" ;
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
export async function listBusinessTypes(params = {
}
)
{
try {
const res = await http.get( " /business types" , {
params }
)
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error listando tipos de negocio " )
;
}
}
export async function createBusinessType(payload )
{
try {
const res = await http.post( " /business types" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error creando tipo de negocio " )
;
}
}
export async function ensureBusinessType(payload )
{
try {
const res = await http.post( " /business types/ensure" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error asegurando tipo de negocio " )
;
}
}