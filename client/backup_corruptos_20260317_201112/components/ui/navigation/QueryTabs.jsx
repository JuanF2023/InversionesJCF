// client/src/components/ui/navigation/QueryTabs.jsx import React from "react" ;
import {
useSearchParams }
from "React router dom" ;
import cx from "clsx" ;
/ * * * QueryTabs * items: [ {
key, label, disabled, icon: Icon }
] * param: nombre del query param que controla la pesta鐢?a (p. ej. "sub" )
* defaultKey: clave por defecto si no hay query * appearance: "tabline " | "pill" (default : "tabline " )
* level: "l1 " | "l2 " | "l3 " (peso tipogr?fico / jerarqu ?a )
* / export default function QueryTabs( {
items = [ ] , param = "tab" , defaultKey, ariaLabel = "Subsecciones" , appearance = "tabline " , level = "l2 " , className, }
)
{
const [params, setParams] = useSearchParams( )
;
const current = (params.get(param)
| | defaultKey | | items[ 0 ] ? .key | | " " )
.toString( )
;
const onSelect = (key)
= > {
const next = new URLSearchParams(params)
;
if ( !key)
next.delete(param)
;
else next.set(param, key)
;
setParams(next, {
replace : true }
)
;
}
;
const isTabline = appearance = = = "tabline " ;
return ( <nav aria label= {ariaLabel}
className= {cx( "flex items center gap 1 " , className)
}
> {items.map( ( {
key, label, disabled, icon: Icon }
)
= > {
const active = String(key)
= = = current ;
return ( <button key= {key}
type= "button" role= "tab" aria current = {active ? "page" : undefined}
aria disabled= {disabled | | undefined}
disabled= {disabled}
onClick = {
( )
= > !disabled & & onSelect(key)
}
className= {cx( isTabline ? "tabline text sm" : "px 3 py 1 . 5 rounded md text sm" , isTabline & & `tabline $ {level}
` , isTabline ? (active ? " " : "tabline muted" )
: " " , "inline flex items center gap 2 " )
}
> {Icon ? <Icon size= {
1 5 }
className= "opacity 8 0 " / > : null}
<span> {label}
< /span> < /button> )
;
}
)
}
< /nav> )
;
}