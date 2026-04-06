// client/src/components/ui/modals/ConfirmModal.jsx import React, {
useEffect, useRef }
from "react" ;
import {
createPortal }
from "React dom" ;
import {
X }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
/ * * * ConfirmModal * * Props b?sicos: * open, title, message , confirmText, cancelText, tone, loading * onCancel, onConfirm * * Overrides de estilo: * backdropClassName * cardClassName * cancelButtonClassName * confirmButtonClassName * titleClassName * messageClassName * / export default function ConfirmModal( {
open, title = "Confirmar acci?n " , message = " ?Deseas continuar? " , confirmText = "Confirmar" , cancelText = "Cancelar" , tone = "default " , loading = false, onCancel, onConfirm, backdropClassName, cardClassName, cancelButtonClassName , confirmButtonClassName, titleClassName , messageClassName, closeButtonClassName, }
)
{
const backdropRef = useRef(null)
;
const firstBtnRef = useRef(null)
;
useEffect( ( )
= > {
if ( !open)
return;
const onKey = (e)
= > {
if (e.key = = = "Escape" )
onCancel? . ( )
;
}
;
window.addEventListener( "keydown " , onKey)
;
const t = setTimeout( ( )
= > firstBtnRef.current ? .focus( )
, 0 )
;
return ( )
= > {
window.removeEventListener( "keydown " , onKey)
;
clearTimeout(t)
;
}
;
}
, [open, onCancel] )
;
if ( !open)
return null;
// 妫?閺? Base: SIN tema;
el tema s?lo entra si no mandas cardClassName const backdropBase = "fixed inset 0 z [ 1 0 0 0 ] bg black/ 4 0 backdrop blur [ 2px] flex items center justify center p 3 " ;
const cardBase = "w full maxw [ 4 6 0px] rounded 2xl p 4 modal anim in" ;
const defaultCardTheme = "neo card neo card deep neo card tinted" ;
const confirmBase = cx( "control md rounded xl px 4 py 2 font medium shadow sm transition all active:scale [ . 9 8 ] " , tone = = = "danger" & & "bg red 6 0 0 text white hover:bg red 7 0 0 shadow lg" , tone = = = "success " & & "bg emerald 6 0 0 text white hover:bg emerald 7 0 0 shadow lg" , tone = = = "default " & & "btn gradient" )
;
return createPortal( <div ref= {backdropRef}
className= {cx(backdropBase, backdropClassName)
}
onMouseDown= {
(e)
= > {
if (e.target = = = backdropRef.current )
onCancel? . ( )
;
}
}
aria modal= "true" role= "dialog" aria labelledby= "confirm title" > <div className= {cx( cardBase, cardClassName ? cardClassName : defaultCardTheme )
}
> <div className= "flex items start justify between gap 3 mb 2 " > <h3 id= "confirm title" className= {cx( "text base font semibold" , titleClassName | | "text text" )
}
> {title}
< /h3 > <button type= "button" onClick = {onCancel}
aria label= "Cerrar" className= {cx( "rounded full p 1 . 5 flex items center justify center" , // Estado normal: sombra sutil y borde suave "bg white/ 1 0 border border white/ 2 0 text white shadow md" , "transition all duration 1 5 0 " , // 閻??Hover azul (tema del login)
"hover:bg [ # 1 3 3 8 5 8 ] hover:border [ # 1d4f7a] hover:shadow lg hover:scale 1 0 5 " , // Active "active:scale 9 5 active:bg [ # 0f2c4 5 ] " , closeButtonClassName )
}
> <X size= {
1 6 }
strokeWidth= {
2 . 4 }
/ > < /button> < /div> <div className= {cx( "text sm mb 4 " , messageClassName | | "text text/ 8 0 " )
}
> {message }
< /div> <div className= "flex items center justify end gap 2 " > <button ref= {firstBtnRef}
className= {cx( "btn outline control md" , cancelButtonClassName )
}
onClick = {onCancel}
disabled= {loading }
> {cancelText}
< /button> <button className= {cx(confirmBase, confirmButtonClassName)
}
onClick = {onConfirm}
disabled= {loading }
> {confirmText}
< /button> < /div> < /div> < /div> , document.body )
;
}