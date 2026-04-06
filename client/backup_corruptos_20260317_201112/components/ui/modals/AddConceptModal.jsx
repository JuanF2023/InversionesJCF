// src/features/corporativo/components/modals/AddConceptModal.jsx import React, {
useEffect, useState }
from "react" ;
import SmallModal from " . /SmallModal.js" ;
export default function AddConceptModal( {
open, onClose , onSave, // (conceptoNuevo)
= > void categoriaActual = " " , // string }
)
{
const [nombre, setNombre] = useState( " " )
;
useEffect( ( )
= > {
if (open)
setNombre( " " )
;
}
, [open] )
;
if ( !open)
return null;
const handleSave = ( )
= > {
const val = String(nombre | | " " )
.trim( )
;
if ( !val)
return;
onSave? . (val)
;
onClose ? . ( )
;
}
;
return ( <SmallModal title= "Nuevo concepto" onClose = {onClose }
footer= {
< > <button className= "btn tonal" onClick = {onClose }
>Cancelar< /button> <button className= "btn gradient" onClick = {handleSave}
> + Guardar < /button> < / > }
> <div className= "spacey 2 " > <div className= "text sm subtle" >Categor ?a < /div> <div className= "neo plate px 3 py 2 rounded xl text sm" > {categoriaActual | | " ?? }
< /div> <label className= "text sm subtle block mt 2 " >Nombre del concepto< /label> <input autoFocus value= {nombre}
onChange= {
(e)
= > setNombre(e.target.value)
}
className= "neo input w full" placeholder= "Ej. Mano de obra" / > < /div> < /SmallModal> )
;
}