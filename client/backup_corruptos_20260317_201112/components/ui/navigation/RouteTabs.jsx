// client/src/components/ui/navigation/RouteTabs.jsx import React from "react" ;
import {
NavLink , useLocation }
from "React router dom" ;
import cx from "clsx" ;
/ * * * RouteTabs (Enterprise)
* items: [ {
to, label, icon, end, disabled, forceActive }
] * * appearance: "tabline " | "pill" (default : "tabline " )
* level: "l1 " | "l2 " | "l3 " * * Enterprise: * l1 : end=true por defecto (match exacto)
* l2 /l3 : end=false por defecto (match parcial )
* forceActive: fuerza estilos de "activo" aunque NavLink no est閼? activo * / export default function RouteTabs( {
items = [ ] , ariaLabel = "Secciones de navegaci?n " , appearance = "tabline " , level = "l1 " , className, action, }
)
{
const isTabline = appearance = = = "tabline " ;
const {
pathname }
= useLocation( )
;
return ( <nav aria label= {ariaLabel}
className= {cx( "flex items center gap 1 " , className)
}
> {items.map( ( {
to, label, icon: Icon, end, disabled, forceActive }
)
= > {
const computedEnd = end ! = = undefined ? end : level = = = "l1 " ;
return ( <NavLink key= {to}
to= {to}
end= {computedEnd}
aria disabled= {disabled | | undefined}
className= {
( {
isActive }
)
= > {
const active = Boolean (forceActive)
| | Boolean (isActive)
;
return cx( "inline flex items center gap 2 text sm select none transition all" , isTabline ? "tabline " : "px 3 py 1 . 5 rounded md" , isTabline & & `tabline $ {level}
` , active ? " " : "tabline muted" , disabled & & "opacity 6 0 pointer events none" , // Guard rail: evita warnings raros si alguien pasa un objeto accidental typeof to ! = = "string" & & "ring 2 ring red 5 0 0 " )
;
}
}
> {Icon ? <Icon size= {
1 5 }
className= "opacity 8 0 " / > : null}
<span> {label}
< /span> < /NavLink > )
;
}
)
}
{action ? <div className= "ml auto" > {action}
< /div> : null}
< /nav> )
;
}