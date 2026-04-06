// client/src/pages/Corporativo/Negocios/components/BusinessSelectBar.jsx import React, {
useMemo }
from "react" ;
export default function BusinessSelectBar( {
items = [ ] , selectedIds = [ ] , onChange = ( )
= > {
}
, }
)
{
const allIds = useMemo ( ( )
= > (Array.isArray (items)
? items : [ ] )
.map( (x)
= > String(x? . _id ? ? x? .id ? ? " " )
)
. filter(Boolean )
, [items] )
;
const selectedSet = useMemo ( ( )
= > new Set( (Array.isArray (selectedIds)
? selectedIds : [ ] )
.map(String)
)
, [selectedIds] )
;
const allSelected = allIds.length > 0 & & allIds.every( (id)
= > selectedSet.has(id)
)
;
const emit = (next)
= > {
if (typeof onChange = = = "function" )
onChange(next)
;
}
;
const toggleAll = ( )
= > emit(allSelected ? [ ] : allIds)
;
const toggleOne = (id)
= > {
const sid = String(id | | " " )
.trim( )
;
if ( !sid)
return;
const next = selectedSet.has(sid)
? allIds.filter( (x)
= > x ! = = sid)
// asegura que no metas ids que ya no existen : Array.from(new Set( [ . . .Array.from(selectedSet)
, sid] )
)
.filter( (x)
= > allIds.includes(x)
)
;
emit(next)
;
}
;
return ( <div className= "rounded xl border border [var( border)
] bg [var( panel)
] p 3 flex items center gap 3 flex wrap" > <label className= "inline flex items center gap 2 cursor pointer select none" > <input type= "checkbox" checked = {allSelected}
onChange= {toggleAll}
/ > <span className= "text sm font medium" >Seleccionar todos< /span> < /label> <span className= "text xs opacity 7 0 " > {selectedSet.size}
/ {allIds.length}
seleccionados < /span> <div className= "flex gap 2 flex wrap ml auto" > {items.map( (b)
= > {
const id = String(b? . _id ? ? b? .id ? ? " " )
.trim( )
;
if ( !id)
return null;
return ( <label key= {id}
className= "inline flex items center gap 1 px 2 py 1 rounded lg bg [var( chip)
] ring 1 ring [var( border)
] select none" > <input type= "checkbox" checked = {selectedSet.has(id)
}
onChange= {
( )
= > toggleOne(id)
}
/ > <span className= "text xs" > {b? .nombre ? ? "Negocio " }
< /span> < /label> )
;
}
)
}
< /div> < /div> )
;
}