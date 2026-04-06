// client/src/lib/sessionHeartbeat.js import {
useEffect, useRef }
from "react" ;
import {
verifySession }
from " @ /features/auth/api/auth.api" ;
import {
loadSession }
from " @ /lib/authSession" ;
/ * * * useSessionHeartbeat (enterprise)
* Pinga verifySession peri璐?dicamente. * Si el backend indica que el token es inv璋?lido, ejecuta onInvalid( )
. * * Reglas: * No navega ni muestra UI por s閾? mismo. * No revoca;
solo notifica (onInvalid)
para que la capa superior decida. * / export function useSessionHeartbeat(options = {
}
)
{
const {
everyMinutes = null, intervalMs = null, onInvalid = null, enabled = true, }
= options ;
const timerRef = useRef(null)
;
const resolvedIntervalMs = ( ( )
= > {
if (Number.isFinite(intervalMs)
& & intervalMs > 0 )
return intervalMs;
const m = Number(everyMinutes)
;
if (Number.isFinite(m)
& & m > 0 )
return m * 6 0 _ 0 0 0 ;
return 6 0 _ 0 0 0 ;
// default 6 0s }
)
( )
;
useEffect( ( )
= > {
if ( !enabled )
return undefined;
const {
token }
= loadSession( )
| | {
}
;
if ( !token)
return undefined;
let cancelled = false;
const doPing = async ( )
= > {
try {
// Enterprise: HttpClient debe adjuntar Authorization + x tenant id const resp = await verifySession( )
;
const ok = resp? .ok ? ? resp? .data? .ok;
if ( !ok & & !cancelled)
{
if (typeof onInvalid = = = "function" )
onInvalid( )
;
}
}
catch {
// Silencioso: errores de red no deben tumbar UX }
}
;
doPing( )
;
timerRef.current = setInterval(doPing, resolvedIntervalMs)
;
return ( )
= > {
cancelled = true;
if (timerRef.current )
{
clearInterval(timerRef.current )
;
timerRef.current = null;
}
}
;
}
, [enabled , resolvedIntervalMs, onInvalid] )
;
}
export default useSessionHeartbeat;