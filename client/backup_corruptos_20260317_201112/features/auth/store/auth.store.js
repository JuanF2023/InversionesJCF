// client/src/features/auth/store/auth.store.js import {
create }
from "zustand " ;
import {
saveSession, loadSession, clearSession, isTokenValid, getTokenExpiration, resolveHomePath, }
from " @ /lib/authSession.js" ;
import {
loginByPin, verifySession, getActiveSessionsStatus, forceCloseSession, }
from " @ /features/auth/api/auth.api.js" ;
/ * * * Auth Store (enterprise)
* Vive en: features/auth (regla modular )
* Centraliza sesi?n /token y operaciones auth * / const safeStr = (v)
= > String(v ? ? " " )
.trim( )
;
function normalizeUser(user)
{
if ( !user)
return null;
const rolesArr = Array.isArray (user.roles)
? user.roles : [ ] ;
const primary = rolesArr[ 0 ] | | {
}
;
return {
. . .user, roleSlug: user.roleSlug | | primary .slug | | null, roleName: user.roleName | | primary .name | | null, roleLevel: user.roleLevel ? ? (typeof primary .level = = = "number" ? primary .level : null)
, }
;
}
function deriveExpiresAt(token, fallbackExpiresAt)
{
const exp = getTokenExpiration(token)
;
if (typeof exp = = = "number" & & Number.isFinite(exp)
)
return exp;
if (typeof fallbackExpiresAt = = = "number" & & Number.isFinite(fallbackExpiresAt)
)
return fallbackExpiresAt;
return null;
}
function normalizeAnyPayload(raw)
{
const payload = raw? .data & & typeof raw.data = = = "object" ? raw.data : raw;
return payload ? ? {
}
;
}
export const useAuthStore = create( (set, get)
= > ( {
session : loadSession( )
, status: "idle" , error: null, active: {
status: "idle" , items: [ ] , refreshedAt: null, stale: false, }
, get isAuthenticated( )
{
const s = get( )
.session | | {
}
;
return ! ! (s.token & & s.user & & isTokenValid(s.token)
)
;
}
, hydrateFromStorage( )
{
const sess = loadSession( )
;
set( {
session : sess }
)
;
const valid = sess? .token & & sess? .user & & isTokenValid(sess.token)
;
set( {
status: valid ? "authenticated" : "unauthenticated" }
)
;
return sess;
}
, / * * * Soporta tenantId (multi tenant)
* Persiste tenantId de forma redundante (root + context )
para compatibilidad enterprise * / async login(pin, intent = "enter" , tenantId = null)
{
const cleanPin = safeStr (pin)
;
const tId = tenantId ? safeStr (tenantId)
: null;
set( {
status: "loading " , error: null }
)
;
try {
const resp = await loginByPin(cleanPin, intent, tId)
;
const data = normalizeAnyPayload(resp)
;
if (data? .ok = = = false)
{
const err = new Error(data.message | | data.error | | "No se pudo iniciar sesi?n . " )
;
err.status = data.status | | 4 0 0 ;
err.serverData = data;
throw err;
}
const token = safeStr (data? .token)
;
const user = normalizeUser(data? .user)
;
const serverTenantId = safeStr (data? .tenantId | | data? .session ? .tenantId | | data? .context ? .tenantId | | " " )
| | null;
const effectiveTenantId = serverTenantId | | tId | | null;
if ( !token | | !user)
{
const err = new Error( "Respuesta incompleta del servidor (token/usuario faltante)
. " )
;
err.status = 5 0 0 ;
err.serverData = data;
throw err;
}
const expiresAt = deriveExpiresAt(token, data? .expiresAt)
;
const stored = saveSession( {
token, user, expiresAt, startedAt: data? .startedAt ? ? Date.now( )
, tenantId: effectiveTenantId | | undefined, context : {
. . . (data? .context | | {
}
)
, tenantId: effectiveTenantId | | undefined }
, permissions: data? .permissions ? ? user? .permissions ? ? undefined, }
)
;
const nextSession = stored | | loadSession( )
;
set( {
session : nextSession, status: "authenticated" , error: null }
)
;
window. _ _user = nextSession? .user | | user;
return {
session : nextSession, tenantId: effectiveTenantId, homePath: resolveHomePath(nextSession? .user | | user)
, raw: data, }
;
}
catch (e)
{
set( {
status: "error" , error: e? .message | | "Error en login" }
)
;
throw e;
}
}
, async verify( )
{
const sess = get( )
.session | | loadSession( )
;
const token = safeStr (sess? .token)
;
if ( !token | | !isTokenValid(token)
)
{
set( {
status: "unauthenticated" }
)
;
return {
ok: false, reason: "no_token_or_invalid " }
;
}
try {
const resp = await verifySession( )
;
const data = normalizeAnyPayload(resp)
;
set( {
status: "authenticated" , error: null, session : loadSession( )
}
)
;
return {
ok: true, data }
;
}
catch (e)
{
const after = loadSession( )
;
const stillValid = after? .token & & after? .user & & isTokenValid(after.token)
;
set( {
session : after, status: stillValid ? "authenticated" : "unauthenticated" }
)
;
throw e;
}
}
, async logout( {
callBackend = true }
= {
}
)
{
try {
if (callBackend)
{
const sess = loadSession( )
;
const token = safeStr (sess? .token)
;
await forceCloseSession(token ? {
token }
: {
}
)
;
}
}
catch {
// ignore }
finally {
clearSession( )
;
window. _ _user = null;
set( {
session : {
token: null, user: null, expiresAt: null, tenantId: null, context : {
}
}
, status: "unauthenticated" , error: null, }
)
;
}
}
, async refreshActiveSessions ( )
{
set( (prev)
= > ( {
active: {
. . .prev.active, status: "loading " , stale: false }
, }
)
)
;
try {
const resp = await getActiveSessionsStatus( )
;
const payload = normalizeAnyPayload(resp)
;
const items = Array.isArray (payload ? .data? .items)
? payload .data.items : Array.isArray (payload ? .items)
? payload .items : [ ] ;
const semantic = safeStr (payload ? .data? .state ? ? payload ? .state)
.toLowerCase( )
;
let status = "online" ;
if (semantic = = = "offline " )
status = "offline " ;
else if (semantic = = = "orphan" )
status = "orphan" ;
else if (semantic = = = "empty" )
status = "empty" ;
else status = items.length ? "online" : "empty" ;
set( {
active: {
status, items, refreshedAt: Date.now( )
, stale: ! !payload ? .data? .stale | | ! !payload ? .stale, }
, }
)
;
return {
status, items }
;
}
catch (e)
{
set( (prev)
= > ( {
active: {
. . .prev.active, status: "offline " , refreshedAt: Date.now( )
, stale: true, }
, }
)
)
;
throw e;
}
}
, async forceCloseOtherSession(token)
{
const t = safeStr (token)
;
if ( !t)
throw new Error( "forceCloseOtherSession: token requerido" )
;
await forceCloseSession( {
token: t }
)
;
return true;
}
, }
)
)
;