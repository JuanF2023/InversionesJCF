import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
useCorporativo }
from " @ /features/corporativo/store/corporativoStore.js" ;
import ConfirmDialog from " @ /features/corporativo/components/modals/ConfirmModal.jsx" ;
import {
X, Plus }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function AddCountryModal( {
open = false, onClose , initial = {
code: " " , name: " " }
, onSaved , // callback opcional }
)
{
const {
theme }
= useTheme( )
;
const crearPais = useCorporativo ( (s)
= > s.crearPais)
;
const [form, setForm ] = useState( {
code: " " , name: " " }
)
;
const [saving, setSaving] = useState(false)
;
const [ask, setAsk] = useState(false)
;
useEffect( ( )
= > {
if (open)
setForm ( {
code: initial ? .code | | " " , name: initial ? .name | | " " }
)
;
}
, [open, initial ] )
;
const disabled = useMemo ( ( )
= > !form.code.trim( )
| | !form.name.trim( )
| | saving, [form, saving] )
;
const onBackdrop = (e)
= > {
// evita cerrar si se hace click dentro del cuadro if (e.target = = = e.currentTarget)
onClose ? . ( )
;
}
;
async function doSave( )
{
setSaving(true)
;
try {
const payload = {
code: form.code.trim( )
.toUpperCase( )
, name: form.name.trim( )
}
;
await crearPais(payload )
;
// ??usa tu store onSaved ? . (payload )
;
onClose ? . ( )
;
}
catch (e)
{
alert(e.message | | "Error al guardar pa?s " )
;
}
finally {
setSaving(false)
;
setAsk(false)
;
}
}
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 4 0 0 ] " onClick = {onBackdrop}
data theme= {theme}
> <div className= "absolute inset 0 bg black/ 5 0 " / > <div role= "dialog" aria modal= "true" className= "absolute left 1 / 2 top 1 / 2 translatex 1 / 2 translatey 1 / 2 w [min( 5 2 0px, 9 2vw)
] neo card neo card deep neo card tinted p 4 md:p 5 rounded 2xl" > {
/ * header * / }
<div className= "flex items center justify between mb 3 " > <h3 className= "text base md:text lg font semibold" >Agregar pa?s < /h3 > <button type= "button" className= "rounded xl h 9 px 3 ring 1 ring border hover:bg [var( chip)
] / 7 0 active:scale [ . 9 8 ] transition" onClick = {onClose }
title= "Cerrar" > <span className= "inline flex items center gap 1 " > <X size= {
1 6 }
/ > Cerrar< /span> < /button> < /div> <div className= "grid gap 3 " > <label className= "text sm" > <span className= "subtle block mb 1 " >C?digo ( 2 letras)
< /span> <input className= "neo input w full uppercase" maxLength= {
2 }
value= {form.code}
onChange= {
(e)
= > setForm ( (s)
= > ( {
. . .s, code: e.target.value }
)
)
}
placeholder= "SV" / > < /label> <label className= "text sm" > <span className= "subtle block mb 1 " >Nombre< /span> <input className= "neo input w full" value= {form.name}
onChange= {
(e)
= > setForm ( (s)
= > ( {
. . .s, name: e.target.value }
)
)
}
placeholder= "El Salvador" / > < /label> < /div> {
/ * footer * / }
<div className= "mt 4 flex items center justify end gap 2 " > <button type= "button" className= "neo plate px 4 py 2 rounded xl ring 1 ring border hover:bg [var( chip)
] / 7 0 active:scale [ . 9 8 ] transition" onClick = {onClose }
> Cancelar < /button> <button type= "button" className= {cx( "btn gradient btn action control md btn shimmer " , disabled & & "opacity 6 0 cursor not allowed " )
}
onClick = {
( )
= > !disabled & & setAsk(true)
}
disabled= {disabled}
title= "Guardar pa?s " > <Plus className= "btn icon" / > Guardar < /button> < /div> < /div> {
/ * confirmaci?n * / }
<ConfirmDialog open= {ask}
title= "Confirmar nuevo pa?s " message = {
` ?Agregar ?? {form.name | | " (sin nombre)
" }
??con c?digo $ {form.code | | " ?? }
? ` }
confirmText= {saving ? "Guardando. . . " : "S?, guardar " }
cancelText= "No, volver" onCancel= {
( )
= > setAsk(false)
}
onConfirm= {doSave}
/ > < /div> )
;
}