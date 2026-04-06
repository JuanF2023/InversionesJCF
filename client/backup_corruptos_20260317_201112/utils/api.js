// client/src/utils/api.js import http from " @ /services/api/HttpClient.js" ;
/ * * * Normaliza paths para evitar /api/api * HttpClient baseURL ya incluye /api * Si caller manda " /api/ . . . " lo convertimos a " / . . . " * / export function normalizePath(path)
{
const p = String(path | | " " )
.trim( )
;
if ( !p)
return " / " ;
const withSlash = p.startsWith( " / " )
? p : ` / $ {p}
` ;
if (withSlash = = = " /api" )
return " / " ;
if (withSlash.startsWith( " /api/ " )
)
return withSlash.replace ( / ^ \ /api/ , " " )
;
return withSlash;
}
/ * * * Standard: si backend no env?a {ok}
, lo envolvemos * / export function toOkShape(data)
{
if (data & & typeof data = = = "object" & & "ok" in data)
return data;
return {
ok: true, data }
;
}
/ * * * apiFetch (canon)
* Wrapper sobre Axios HttpClient. * / export async function apiFetch(path, opts = {
}
)
{
const {
method = "GET" , headers = {
}
, params = undefined, body = undefined, signal = undefined, }
= opts;
const url = normalizePath(path)
;
try {
const res = await http.request ( {
url, method, params, data: body, headers , signal, }
)
;
return toOkShape(res? .data)
;
}
catch (e)
{
// eslint disable next line no console console .error( " [apiFetch] request error: " , {
url, method, status: e? .response? .status, message : e? .message , }
)
;
return {
ok: false, status: e? .response? .status, message : e? .response? .data? .message | | e? .message | | "Request failed" , data: e? .response? .data, }
;
}
}
/ * * * extractItems (legacy)
* Compatibilidad con stores antiguos. * / export function extractItems(res)
{
if ( !res)
return [ ] ;
if (Array.isArray (res)
)
return res;
// {
ok, data }
o {
items: [ ] }
o {
data: {
items: [ ] }
}
etc. if (Array.isArray (res.items)
)
return res.items;
if (Array.isArray (res.data)
)
return res.data;
if (Array.isArray (res.data? .items)
)
return res.data.items;
// {
ok:true, data: {
data: [ . . . ] }
}
o {
ok:true, data: {
data: {
items: [ ] }
}
}
if (Array.isArray (res? .data? .data)
)
return res.data.data;
if (Array.isArray (res? .data? .data? .items)
)
return res.data.data.items;
return [ ] ;
}
/ * * * Intenta resolver un ObjectId en distintos formatos comunes : * " _id" : " 6 5f. . . " * " _id" : {
" $oid" : " 6 5f. . . " }
* " _id" : {
"id" : " 6 5f. . . " }
(algunos wrappers)
* / function pickMongoId(p)
{
const raw = p? . _id ? ? p? .mongoId ? ? p? .refId ? ? null;
if ( !raw)
return null;
if (typeof raw = = = "string" )
return raw;
// Mongo Extended JSON if (typeof raw = = = "object" & & typeof raw. $oid = = = "string" )
return raw. $oid;
// wrappers raros if (typeof raw = = = "object" & & typeof raw.id = = = "string" )
return raw.id;
return null;
}
/ * * * normalizeProps (legacy pero enterprise safe)
* Mantiene "id" como id de negocio (si viene)
* Asegura un id can?nico para API: "mongoId " * Preserva " _id" como string cuando sea posible * / export function normalizeProps (res)
{
const list = extractItems(res)
;
return list.map( (p)
= > {
const mongoId = pickMongoId(p)
;
// id de negocio (ej. " 0 1 " )
si existe;
si no existe, fallback a codigo const businessId = p? .id ! = null & & String(p.id)
.trim( )
! = = " " ? p.id : p? .codigo ? ? p? .code ? ? null;
return {
. . .p, // ??id can?nico para API mongoId : mongoId | | null, // ??normalizamos _id a string si ven?a en objeto ( $oid)
_id: mongoId | | p? . _id | | null, // ??id visible /negocio (NO lo reemplazamos con _id)
id: businessId, codigo: p? .codigo ? ? p? .code ? ? " " , nombre: p? .nombre ? ? p? .name ? ? " " , estado: p? .estado ? ? p? .status ? ? " " , ubicacion: p? .ubicacion ? ? {
}
, valores : p? .valores ? ? {
}
, }
;
}
)
;
}