// client/src/components/security/SessionWatcher .jsx import React, {
useEffect, useRef, useState }
from "react" ;
import {
useLocation, useNavigate }
from "React router dom" ;
import {
loadSession, clearSession, isTokenValid, getTokenExpiration }
from " @ /lib/authSession.js" ;
/ * * * SessionWatcher (enterprise)
* Observa expiraci?n del JWT (exp)
* Si expira o es inv?lido, limpia sesi?n y redirige a /login * No hace requests: solo control UI * * Nota importante: * NO hacemos logout por inactividad aqu? (eso es UI only y lo maneja useIdleLogout)
. * NO forzamos logout por "tenantId vac?o " porque el tenant puede resolverse por selecci ?n o por backend . * / export default function SessionWatcher ( )
{
const navigate = useNavigate( )
;
const {
pathname }
= useLocation( )
;
// Tick liviano para reevaluar sesi?n aunque no cambie la ruta (evita bug de depender de pathname)
. const [tick, setTick ] = useState( 0 )
;
const lastRedirectRef = useRef( 0 )
;
useEffect( ( )
= > {
const id = setInterval( ( )
= > setTick ( (t)
= > (t + 1 )
% 1 0 _ 0 0 0 )
, 1 0 0 0 )
;
return ( )
= > clearInterval(id)
;
}
, [ ] )
;
useEffect( ( )
= > {
// En /login no molestamos if (pathname.startsWith( " /login" )
)
return;
const s = loadSession( )
| | {
}
;
const token = typeof s? .token = = = "string" ? s.token.trim( )
: " " ;
const expiresAtLocal = typeof s? .expiresAt = = = "number" ? s.expiresAt : null;
// Sin token > fuera (pero SIN loops)
if ( !token)
{
try {
clearSession( )
;
}
finally {
navigate( " /login" , {
replace : true, state: {
from: {
pathname }
}
}
)
;
}
return;
}
// Token inv?lido > fuera if ( !isTokenValid(token)
)
{
try {
clearSession( )
;
}
finally {
navigate( " /login" , {
replace : true, state: {
from: {
pathname }
}
}
)
;
}
return;
}
// Expiraci?n efectiva: preferimos JWT exp;
si no existe, usamos expiresAt local si existe const expJwt = getTokenExpiration(token)
;
const effectiveExpiresAt = expJwt ? ? expiresAtLocal ;
// Si no hay exp, no inventamos logout (legacy tokens)
if ( !effectiveExpiresAt)
return;
const msLeft = effectiveExpiresAt Date.now( )
;
if (msLeft < = 0 )
{
// Evita doble redirect en el mismo segundo por re renders const now = Date.now( )
;
if (now lastRedirectRef.current < 8 0 0 )
return;
lastRedirectRef.current = now;
try {
clearSession( )
;
}
finally {
navigate( " /login" , {
replace : true, state: {
from: {
pathname }
}
}
)
;
}
return;
}
// Programar logout exacto en expiraci?n const timer = setTimeout( ( )
= > {
try {
clearSession( )
;
}
finally {
navigate( " /login" , {
replace : true, state: {
from: {
pathname }
}
}
)
;
}
}
, msLeft)
;
return ( )
= > clearTimeout(timer)
;
}
, [pathname, navigate, tick] )
;
return null;
}