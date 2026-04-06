// client/src/services/api/HttpClient.js import axios from "axios" ;
import * as authSession from " @ /lib/authSession" ;
import toast from "React hot toast" ;
const loadSession = authSession.loadSession;
const clearSession = authSession.clearSession | | authSession.clear | | authSession.clearAuthSession | | ( ( )
= > {
}
)
;
/ * * * HTTP Client (enterprise)
* baseURL CAN閼?NICO: debe incluir /api * Headers enterprise: * Authorization: Bearer <token> * x session token: <token> * x tenant id: <tenantId> (multi tenant REQUIRED)
* x device label: <ua> * x request id: <uuid> (trazabilidad)
* / function resolveBaseURL ( )
{
const raw = String(import.meta.env.VITE_API_URL | | "http://localhost: 4 0 0 0 /api" )
.trim( )
;
const noTrailing = raw.replace ( / \ / + $ / , " " )
;
if ( ! / \ /api$ /i.test(noTrailing)
)
return ` $ {noTrailing}
/api` ;
return noTrailing;
}
export const http = axios.create( {
baseURL : resolveBaseURL ( )
, timeout : 2 0 0 0 0 , withCredentials: false, }
)
;
/ * * Setter compatible con AxiosHeaders o headers plain object * / function setHeader(config, key, value)
{
// Axios 1 .x: config.headers puede ser AxiosHeaders if ( !config.headers )
config.headers = {
}
;
if (typeof config.headers .set = = = "function" )
{
config.headers .set(key, value)
;
return;
}
// Fallback plain object config.headers [key] = value;
// Hardening: si axios cre? sub objetos por m閼?todo, tambi閼?n lo reflejamos const m = String(config.method | | "get" )
.toLowerCase( )
;
if (config.headers ? .common & & typeof config.headers .common = = = "object" )
{
config.headers .common[key] = value;
}
if (config.headers ? . [m] & & typeof config.headers [m] = = = "object" )
{
config.headers [m] [key] = value;
}
}
function delHeader(config, key)
{
config.headers = config.headers | | {
}
;
if (typeof config.headers .delete = = = "function" )
{
config.headers .delete(key)
;
return;
}
delete config.headers [key] ;
}
/ * * UUID para request id (compat sin deps)
* / function uuid( )
{
try {
if (typeof crypto ! = = "undefined" & & typeof crypto.randomUUID = = = "function" )
{
return crypto.randomUUID( )
;
}
}
catch {
// ignore }
return `req_ $ {Date.now( )
}
_ $ {Math.random( )
.toString( 1 6 )
.slice( 2 )
}
` ;
}
/ * * * Resolver enterprise para tenantId: * soporta m閻?ltiples formas de sesi?n (root, session . * , user. * , context . * )
* / function resolveTenantIdFromSession(sess)
{
const t = sess? .tenantId ? ? sess? .tenant? .id ? ? sess? .tenant? . _id ? ? sess? .context ? .tenantId ? ? sess? .session ? .tenantId ? ? sess? .session ? .context ? .tenantId ? ? sess? .user? .tenantId ? ? sess? .user? .tenant? . _id ? ? sess? .session ? .user? .tenantId ? ? sess? .session ? .user? .tenant? . _id ? ? null;
const tenantId = typeof t = = = "string" ? t.trim( )
: " " ;
if (tenantId)
return tenantId;
const dev = String(import.meta.env.VITE_TENANT_ID_DEV | | " " )
.trim( )
;
return dev | | " " ;
}
/ * * Detecta si la request requiere tenant (corporativo/restaurante)
* / function requiresTenant (config)
{
const url = String(config? .url | | " " )
;
// Importante: config.url puede venir relativo ( " . . . " )
o absoluto // Solo activamos para rutas de negocio (evita ruido en auth/public)
return ( url.includes( " /corporativo/ " )
| | url.includes( " /restaurante/ " )
| | url.includes( " /tenants / " )
| | url.includes( " /catalogos/ " )
// si catalogos es multi tenant )
;
}
/ * * Lista de rutas que NO deben incluir el header x tenant id * / function shouldSkipTenantHeader(config)
{
const url = String(config? .url | | " " )
;
// Rutas espec?ficas que no requieren tenant const skipRoutes = [ ' /corporativo/users/access/options ' , // Esta ruta es la que da problemas ' /auth/login' , ' /auth/verify' , ' /auth/logout' , ' /public/ ' , ' /health' , ' /metrics ' ] ;
return skipRoutes.some(route = > url.includes(route)
)
;
}
// REQUEST INTERCEPTOR http.interceptors.request .use( (config)
= > {
const sess = loadSession? . ( )
| | {
}
;
setHeader(config, "x request id" , uuid( )
)
;
const tokenRaw = sess? .token;
const token = typeof tokenRaw = = = "string" ? tokenRaw.trim( )
: " " ;
if (token)
{
setHeader(config, "Authorization" , `Bearer $ {token}
` )
;
setHeader(config, "x session token" , token)
;
}
else {
delHeader(config, "Authorization" )
;
delHeader(config, "x session token" )
;
}
const tenantId = resolveTenantIdFromSession(sess)
;
// ??MEJORA: Verificar si debemos omitir el header de tenant const skipTenant = shouldSkipTenantHeader(config)
;
if ( !skipTenant & & tenantId)
{
setHeader(config, "x tenant id" , tenantId)
;
}
else {
delHeader(config, "x tenant id" )
;
if ( !skipTenant & & requiresTenant (config)
)
{
config. _ _missingTenant = true;
}
}
const deviceLabel = navigator.userAgent? .slice( 0 , 8 0 )
| | "web" ;
setHeader(config, "x device label" , deviceLabel)
;
console .log( " [HTTP OUT] " , {
method: config.method, url: config.baseURL ? ` $ {config.baseURL }
$ {config.url}
` : config.url, tenant: (config.headers ? .get? . ( "x tenant id" )
? ? config.headers ? . [ "x tenant id" ] )
| | null, hasAuth : Boolean (config.headers ? .get? . ( "Authorization" )
? ? config.headers ? .Authorization)
, skipTenant // Para debugging }
)
;
return config;
}
, (error)
= > Promise .reject(error)
)
;
// RESPONSE INTERCEPTOR http.interceptors.response.use( (response)
= > response, (error)
= > {
if (axios.isCancel? . (error)
)
return Promise .reject(error)
;
const status = error? .response? .status;
const url = error? .config? .url | | " " ;
const method = String(error? .config? .method | | "get" )
.toLowerCase( )
;
const data = error? .response? .data | | {
}
;
const code = data.code;
const serverMsg = data.message | | data.error;
const msg = serverMsg | | error? .message | | "Error de red" ;
const sess = loadSession? . ( )
| | {
}
;
const token = typeof sess? .token = = = "string" ? sess.token.trim( )
: " " ;
// ??Mensaje correcto para multi tenant faltante const missingTenant = Boolean (error? .config? . _ _missingTenant)
| | (status = = = 4 0 0 & & (String(msg)
.toLowerCase( )
.includes( "tenantid" )
| | String(msg)
.toLowerCase( )
.includes( "tenant id" )
| | String(msg)
.toLowerCase( )
.includes( "tenant" )
)
)
;
if (missingTenant)
{
toast.dismiss ( )
;
toast.error( "Tenant no identificado (multi tenant)
. Verifica la sesi?n activa. " , {
id: "http tenant" }
)
;
return Promise .reject(error)
;
}
if (status = = = 4 0 1 )
{
const isVerify = url.includes( " /auth/verify" )
;
if ( !token)
return Promise .reject(error)
;
const mustClear = code = = = "TOKEN_INVALID " | | code = = = "TOKEN_EXPIRED " | | code = = = "SESSION _NOT_FOUND" | | code = = = "SESSION _INVALID " ;
if (mustClear)
{
try {
clearSession? . ( )
;
window. _ _user = null;
}
catch {
// ignore }
}
if (isVerify)
return Promise .reject(error)
;
const toastMsg = code = = = "TOKEN_EXPIRED " ? "Tu sesi?n ha expirado. Ingresa tu PIN nuevamente. " : code = = = "TOKEN_INVALID " | | code = = = "SESSION _INVALID " ? "Sesi?n inv?lida. Vuelve a iniciar sesi?n . " : msg | | "No autorizado ( 4 0 1 )
" ;
toast.dismiss ( )
;
toast.error(toastMsg, {
id: "http 4 0 1 " }
)
;
return Promise .reject(error)
;
}
if (status = = = 4 0 3 )
{
toast.dismiss ( )
;
toast.error( "No tienes permisos para esta acci?n . " , {
id: "http 4 0 3 " }
)
;
return Promise .reject(error)
;
}
if (status = = = 4 0 4 & & method = = = "get" )
return Promise .reject(error)
;
if (typeof status = = = "number" & & status > = 5 0 0 )
{
toast.dismiss ( )
;
toast.error( "Error en el servidor. Intenta m?s tarde. " , {
id: "http 5xx" }
)
;
return Promise .reject(error)
;
}
if (msg)
{
toast.dismiss ( )
;
toast.error(msg, {
id: "http 4xx" }
)
;
}
return Promise .reject(error)
;
}
)
;
export default http;