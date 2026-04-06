import React, {
useEffect }
from "react" ;
import {
createPortal }
from "React dom" ;
import {
X }
from "lucide React" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function BaseModal( {
open, onClose , title, children, footer, className, closeOnBackdrop = true, }
)
{
const {
theme }
= useTheme( )
;
useEffect( ( )
= > {
if ( !open)
return;
const onKey = (e)
= > {
if (e.key = = = "Escape" )
onClose ? . ( )
;
}
;
document.addEventListener( "keydown " , onKey)
;
const prev = document.documentElement.style.overflow;
document.documentElement.style.overflow = "hidden" ;
return ( )
= > {
document.removeEventListener( "keydown " , onKey)
;
document.documentElement.style.overflow = prev;
}
;
}
, [open, onClose ] )
;
if ( !open)
return null;
const content = ( <div className= "fixed inset 0 z [ 1 0 0 ] " data theme= {theme}
aria modal= "true" role= "dialog" > {
/ * Overlay : usar mouseDown para evitar que robe foco al primer click * / }
<div className= "absolute inset 0 bg black/ 5 5 backdrop blur sm" onMouseDown= {
( )
= > (closeOnBackdrop ? onClose ? . ( )
: null)
}
onClick = {
( )
= > {
}
}
/ > {
/ * Contenedor: bloquear propagaci璐?n en mouseDown/click * / }
<section className= {cx( "relative z [ 1 0 1 ] mx auto my 8 w [min( 7 8 0px, 9 6vw)
] " , "neo card neo card deep neo card tinted ring 1 ring border rounded 2xl" , "shadow [ 0 _ 3 0px_ 8 0px_rgba( 0 , 0 , 0 , . 3 5 )
] " , className )
}
onMouseDown= {
(e)
= > e.stopPropagation( )
}
onClick = {
(e)
= > e.stopPropagation( )
}
> {
/ * Header * / }
<header className= "flex items center justify between gap 3 p 3 md:p 4 border b border border/ 7 0 " > <h3 className= "text sm font semibold tracking wide truncate" > {title}
< /h3 > <button type= "button" onClick = {onClose }
className= "icon btn ring 1 ring border hover:bg [var( chip)
] / 6 0 " aria label= "Cerrar" title= "Cerrar" > <X size= {
1 6 }
/ > < /button> < /header> {
/ * Body * / }
<div className= "p 3 md:p 4 " > {children}
< /div> {
/ * Footer * / }
<footer className= "flex items center justify end gap 2 p 3 md:p 4 border t border border/ 7 0 " > {footer}
< /footer> < /section > < /div> )
;
return createPortal(content , document.body)
;
}