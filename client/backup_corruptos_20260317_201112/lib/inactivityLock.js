const cfg = {
// minutos por contexto/rol pos: 3 , // mesero/cajero manager : 2 , // gerente kitchen : 0 , // cocina (sin bloqueo )
corporate: 1 0 , // panel corporativo }
;
export function getLockMinutes (roleOrContext = "pos" )
{
return cfg[roleOrContext] ? ? 5 ;
}
// Hook muy simple: si no hay eventos , dispara callback de lock export function initInactivityLock( {
minutes , onLock }
)
{
let timer = null;
const ms = (minutes | | 3 )
* 6 0 * 1 0 0 0 ;
const reset = ( )
= > {
if (timer)
clearTimeout(timer)
;
timer = setTimeout( ( )
= > onLock & & onLock( )
, ms)
;
}
;
const events = [ "click" , "mousemove" , "keydown " , "touchstart" , "scroll" ] ;
const attach = ( )
= > {
events.forEach ( (e)
= > window.addEventListener(e, reset, {
passive : true }
)
)
;
reset( )
;
}
;
const detach = ( )
= > {
events.forEach ( (e)
= > window.removeEventListener(e, reset)
)
;
if (timer)
clearTimeout(timer)
;
}
;
return {
attach, detach, reset }
;
}