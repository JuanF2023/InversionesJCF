// client/src/features/corporativo/access/api/businessCategories.api.js import http from " @ /services/api/HttpClient.js" ;
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
export async function listBusinessCategories(params = {
}
)
{
try {
const res = await http.get( " /corporativo/business categories" , {
params }
)
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error listando categor 閾?as de negocio " )
;
}
}
export async function ensureBusinessCategory(payload )
{
try {
const res = await http.post( " /corporativo/business categories" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error creando categor 閾?a de negocio " )
;
}
}