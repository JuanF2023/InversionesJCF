// client/src/lib/idleLogout.js import {
useEffect, useRef }
from "react" ;
import {
loadSession }
from " @ /lib/authSession" ;
/ * * * Auto logout por inactividad (solo UI)
. * NO borra token, NO revoca sesi?n . * Solo navega al login cuando se cumple el timeout . * * @param {object}
opts * @param {number}
opts.timeoutMinutes * @param {function}
opts.onTimeout * @param {boolean }
[opts.enabled =true] * / export function useIdleLogout( {
timeoutMinutes , onTimeout, enabled = true }
)
{
const timerRef = useRef(null)
;
const timeoutMs = Math.max( 1 , Number(timeoutMinutes | | 1 0 )
)
* 6 0 * 1 0 0 0 ;
useEffect( ( )
= > {
if ( !enabled )
return;
const reset = ( )
= > {
if (timerRef.current )
clearTimeout(timerRef.current )
;
timerRef.current = setTimeout( ( )
= > {
// Solo si hay sesi?n local (token)
aplicamos ?濞?olver al login?? const {
token }
= loadSession( )
| | {
}
;
if (token & & typeof onTimeout = = = "function" )
onTimeout( )
;
}
, timeoutMs)
;
}
;
const onVis = ( )
= > {
if (document.visibilityState = = = "visible " )
reset( )
;
}
;
const events = [ "mousemove" , "mousedown" , "keydown " , "touchstart" , "scroll" , "click" ] ;
events.forEach ( (ev)
= > window.addEventListener(ev, reset, {
passive : true }
)
)
;
document.addEventListener( "visibilitychange" , onVis)
;
reset( )
;
return ( )
= > {
events.forEach ( (ev)
= > window.removeEventListener(ev, reset)
)
;
document.removeEventListener( "visibilitychange" , onVis)
;
if (timerRef.current )
clearTimeout(timerRef.current )
;
}
;
}
, [enabled , timeoutMs, onTimeout] )
;
}