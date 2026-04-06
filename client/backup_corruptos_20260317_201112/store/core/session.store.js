// client/src/store/core/session .store.js // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = // Store de sesi?n global ??Inversiones JCF (enterprise)
// Maneja token, usuario , expiraci?n , tenantId y revalidaci?n // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = import {
create }
from "zustand " ;
import {
saveSession, loadSession, clearSession, isTokenValid }
from " @ /lib/authSession.js" ;
import {
verifySession, forceCloseSession }
from " @ /features/auth/api/auth.api.js" ;
function str(v)
{
return typeof v = = = "string" ? v.trim( )
: " " ;
}
function toEpochMs(v)
{
if (typeof v = = = "number" & & Number.isFinite(v)
)
return v;
if (typeof v = = = "string" )
{
const ms = Date.parse(v)
;
return Number.isFinite(ms)
? ms : null;
}
return null;
}
export const useSession = create( (set, get)
= > ( {
token: null, user: null, expiresAt: null, // epoch ms tenantId: null, status: "idle" , // idle | ok | expired | no session loading : false, // // Cargar la sesi?n desde localStorage (App init)
// cargarSesionLocal( )
{
const data = loadSession( )
| | {
}
;
const token = str(data? .token)
| | null;
const tenantId = str(data? .tenantId)
| | null;
const expiresAt = toEpochMs(data? .expiresAt)
;
if ( !token)
{
set( {
token: null, user: null, expiresAt: null, tenantId: null, status: "no session " , }
)
;
return;
}
const ok = isTokenValid(token)
;
set( {
token, user: data? .user ? ? null, expiresAt, tenantId, status: ok ? "ok" : "expired " , }
)
;
}
, // // Guardar sesi?n despu閼?s de login // establecerSesion( {
token, user, expiresAt, tenantId }
)
{
const t = str(token)
| | null;
const tid = str(tenantId)
| | null;
const exp = toEpochMs(expiresAt)
;
saveSession( {
token: t, user: user ? ? null, expiresAt: exp, tenantId: tid }
)
;
set( {
token: t, user: user ? ? null, expiresAt: exp, tenantId: tid, status: t ? (isTokenValid(t)
? "ok" : "expired " )
: "no session " , }
)
;
}
, // // Cerrar sesi?n LOCAL (sin backend )
// limpiarSesion( )
{
try {
clearSession( )
;
}
catch {
// ignore }
set( {
token: null, user: null, expiresAt: null, tenantId: null, status: "no session " , }
)
;
}
, // // Cerrar sesi?n GLOBAL (revoca en backend y limpia local)
// async cerrarSesionGlobal( {
callBackend = true }
= {
}
)
{
set( {
loading : true }
)
;
try {
if (callBackend)
{
try {
// Best effort: el HttpClient debe enviar Authorization + x tenant id await forceCloseSession( )
;
}
catch {
// Si falla red/backend , igual limpiamos local (regla enterprise)
}
}
}
finally {
try {
clearSession( )
;
}
catch {
// ignore }
set( {
token: null, user: null, expiresAt: null, tenantId: null, status: "no session " , loading : false, }
)
;
}
}
, // // Revalidar token contra el backend // async revalidarSesion( )
{
const {
token }
= get( )
;
if ( !token)
{
set( {
status: "no session " }
)
;
return false;
}
set( {
loading : true }
)
;
try {
const resp = await verifySession( )
;
const ok = resp? .ok ? ? resp? .data? .ok ? ? false;
if ( !ok)
{
get( )
.limpiarSesion( )
;
return false;
}
const user = resp? .user ? ? resp? .data? .user ? ? null;
const expiresAt = resp? .expiresAt ? ? resp? .data? .expiresAt ? ? null;
const tenantId = resp? .tenantId ? ? resp? .data? .tenantId ? ? null;
get( )
.establecerSesion( {
token, user, expiresAt, tenantId }
)
;
return true;
}
catch {
get( )
.limpiarSesion( )
;
return false;
}
finally {
set( {
loading : false }
)
;
}
}
, }
)
)
;