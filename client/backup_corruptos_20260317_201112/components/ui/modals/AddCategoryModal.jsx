// src/features/corporativo/components/modals/AddCategoryModal.jsx import React, {
useState, useEffect }
from "react" ;
import SmallModal from " . /SmallModal.js" ;
export default function AddCategoryModal( {
open, onClose , onSave, initialValue = " " }
)
{
const [nombre, setNombre] = useState(initialValue)
;
useEffect( ( )
= > {
if (open)
setNombre(initialValue)
;
}
, [open, initialValue] )
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
return ( <SmallModal title= "Nueva categor ?a " onClose = {onClose }
footer= {
< > <button className= "btn tonal" onClick = {onClose }
>Cancelar< /button> <button className= "btn gradient" onClick = {handleSave}
> + Guardar < /button> < / > }
> <div className= "spacey 2 " > <label className= "text sm subtle" >Nombre< /label> <input autoFocus value= {nombre}
onChange= {
(e)
= > setNombre(e.target.value)
}
className= "neo input w full" placeholder= "Ej. Mtto/Mejoras " / > < /div> < /SmallModal> )
;
}