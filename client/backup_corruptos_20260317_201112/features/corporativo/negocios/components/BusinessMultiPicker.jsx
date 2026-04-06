import React from "react" ;
import {
useCorporativo }
from " @ /features/corporativo/store/corporativoStore.js" ;
export default function BusinessMultiPicker( )
{
const negocios = useCorporativo (s = > s.negocios)
| | [ ] ;
const selected = useCorporativo (s = > s.selectedBusinessIds)
| | [ ] ;
const setSel = useCorporativo (s = > s.setSelectedBusinessIds)
;
const toggle = (id)
= > {
const set = new Set(selected)
;
set.has(id)
? set.delete(id)
: set.add(id)
;
setSel(Array.from(set)
)
;
}
;
const all = selected.length = = = negocios.length & & negocios.length > 0 ;
return ( <div className= "neo card neo card tinted p 3 " > <div className= "flex items center justify between mb 2 " > <div className= "text sm font semibold" >Selecciona negocios< /div> <button className= "btn tonal text xs" onClick = {
( )
= > setSel(all ? [ ] : negocios.map(n = > String(n.id | | n. _id)
)
)
}
> {all ? "Limpiar " : "Seleccionar todos" }
< /button> < /div> <div className= "flex flex wrap gap 2 " > {negocios.map(n = > {
const id = String(n.id | | n. _id)
;
const active = selected.includes(id)
;
return ( <button key= {id}
onClick = {
( )
= > toggle(id)
}
className= {
`px 3 py 1 . 5 rounded full ring 1 text sm $ {active ? "ring [var( accent)
] bg [var( chip)
] " : "ring border" }
` }
> {n.nombre | | n.name | | n.code | | "Negocio " }
< /button> )
;
}
)
}
< /div> < /div> )
;
}