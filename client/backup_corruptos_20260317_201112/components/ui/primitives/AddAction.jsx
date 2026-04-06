// client/src/components/ui/Primitives/AddAction.jsx import React from "react" ;
import {
Link }
from "React router dom" ;
import {
Plus }
from "lucide React" ;
/ * * * Bot?n de acci?n principal (aplica tema)
. * * Uso: * <AddAction to= " /corporativo/negocios/nuevo" >Agregar negocio < /AddAction> * <AddAction to= "nuevo" >Agregar negocio < /AddAction> ??relativo a la ruta actual * <AddAction onClick = {openModal}
>Agregar proyecto< /AddAction> * * Icono " + " siempre del mismo color que el texto (hereda currentColor)
. * No antepongas " + " en el children;
ya se renderiza el ?cono. * / export default function AddAction( {
to, onClick , children, className = " " , size = "control md" , disabled = false, ariaLabel, title, iconSize = 1 8 , }
)
{
const classes = [ "btn gradient btn action btn shimmer inline flex items center gap 2 rounded full" , // texto adaptable a tema, con fallback verdoso oscuro "text [var( btn primary fg, # 0 2 2c2 2 )
] " , size, disabled ? "opacity 6 0 pointer events none" : " " , className, ] .join( " " )
;
const label = ariaLabel | | title | | (typeof children = = = "string" ? children : "Agregar " )
;
const content = ( < > <Plus size= {iconSize}
className= "btn icon" / > <span className= "hidden sm:inline font semibold tracking tight" > {children}
< /span> < / > )
;
if (to)
{
return ( <Link to= {to}
relative= "path" className= {classes }
title= {label}
aria label= {label}
> {content }
< /Link> )
;
}
return ( <button type= "button" onClick = {onClick }
className= {classes }
title= {label}
aria label= {label}
disabled= {disabled}
> {content }
< /button> )
;
}