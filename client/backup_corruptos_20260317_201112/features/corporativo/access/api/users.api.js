// client/src/features/corporativo/access/api/users.api.js import http from " @ /services/api/HttpClient.js" ;
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
export async function listUsers(params = {
}
)
{
try {
const res = await http.get( " /corporativo/users" , {
params }
)
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando usuarios" )
;
}
}
export async function getUserById(id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.get( ` /corporativo/users/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando usuario " )
;
}
}
export async function createUser(payload )
{
try {
const res = await http.post( " /corporativo/users" , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error creando usuario " )
;
}
}
export async function updateUser(id, payload )
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.patch( ` /corporativo/users/ $ {safeId}
` , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error actualizando usuario " )
;
}
}
export async function deleteUser(id)
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.delete( ` /corporativo/users/ $ {safeId}
` )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error eliminando usuario " )
;
}
}
export async function getUserAccessOptions( )
{
try {
const res = await http.get( " /corporativo/users/access/options " )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error cargando opciones de acceso" )
;
}
}
export async function updateUserAccess(id, payload )
{
try {
const safeId = String(id | | " " )
.trim( )
;
const res = await http.patch( ` /corporativo/users/ $ {safeId}
/access` , payload )
;
return res.data;
}
catch (error)
{
normalizeError (error, "Error actualizando acceso del usuario " )
;
}
}