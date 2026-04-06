import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import ConfirmDialog from " @ /features/corporativo/components/modals/ConfirmModal.jsx" ;
import {
X, Plus }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function AddProjectModal( {
open = false, onClose , apiBase = " " , onSaved , defaultCountryId, defaultPropertyId, defaultBusinessId, }
)
{
const {
theme }
= useTheme( )
;
const [form, setForm ] = useState( {
code: " " , name: " " , status: "en_progreso" , countryId: defaultCountryId | | " " , propertyId: defaultPropertyId | | " " , businessId: defaultBusinessId | | " " , notes: " " }
)
;
const [busy, setBusy ] = useState(false)
;
const [ask, setAsk] = useState(false)
;
useEffect( ( )
= > {
if ( !open)
setForm (f = > ( {
. . .f, code: " " , name: " " , notes: " " }
)
)
;
}
, [open] )
;
if ( !open)
return null;
async function save( )
{
setBusy (true)
;
try {
const r = await fetch( ` $ {apiBase }
/api/projects` , {
method: "POST" , headers : {
"Content Type" : "application/json" }
, body: JSON.stringify(form)
, }
)
;
const data = await r.json( )
.catch( ( )
= > ( {
}
)
)
;
if ( !r.ok | | !data? .ok)
throw new Error(data.error | | `HTTP $ {r.status}
` )
;
onSaved ? . (data.item)
;
onClose ? . ( )
;
}
catch (e)
{
alert(e.message | | "Error creando proyecto" )
;
}
finally {
setBusy (false)
;
setAsk(false)
;
}
}
return ( <div className= "fixed inset 0 z [ 4 0 0 ] " data theme= {theme}
> <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div className= "absolute left 1 / 2 top 1 / 2 translatex 1 / 2 translatey 1 / 2 w [min( 6 8 0px, 9 2vw)
] rounded 2xl p 4 neo card neo card deep neo card tinted" > <div className= "flex items center justify between mb 2 " > <h3 className= "text lg font semibold" >Nuevo proyecto< /h3 > <button onClick = {onClose }
className= "h 9 px 3 rounded xl neo plate hover:scale 9 5 transition all" title= "Cerrar" > <X size= {
1 6 }
/ > <span className= "ml 1 text sm" >Cerrar< /span> < /button> < /div> <div className= "grid md:grid cols 2 gap 3 " > <div> <label className= "label" >C璐?digo< /label> <input className= "neo input w full uppercase" value= {form.code}
onChange= {
(e)
= >setForm (s= > ( {
. . .s,code:e.target.value}
)
)
}
placeholder= "OBRA 0 4 CALLE" / > < /div> <div> <label className= "label" >Nombre< /label> <input className= "neo input w full" value= {form.name}
onChange= {
(e)
= >setForm (s= > ( {
. . .s,name:e.target.value}
)
)
}
placeholder= "Construcci璐?n de calle interna en lote 0 4 " / > < /div> <div> <label className= "label" >Estado< /label> <select className= "neo input w full" value= {form.status}
onChange= {
(e)
= >setForm (s= > ( {
. . .s,status:e.target.value}
)
)
}
> <option value= "plan" >Plan< /option> <option value= "en_progreso" >En progreso< /option> <option value= "pausado " >Pausado < /option> <option value= "cerrado " >Cerrado < /option> < /select> < /div> <div className= "md:col span 2 " > <label className= "label" >Notas< /label> <textarea className= "neo input w full" rows= {
3 }
value= {form.notes}
onChange= {
(e)
= >setForm (s= > ( {
. . .s,notes:e.target.value}
)
)
}
/ > < /div> < /div> <div className= "mt 4 flex items center justify end gap 2 " > <button className= "neo plate px 4 py 2 " onClick = {onClose }
>Cancelar< /button> <button className= "btn gradient btn action px 5 py 2 " disabled= {busy | | !form.code | | !form.name}
onClick = {
( )
= >setAsk(true)
}
title= "Guardar proyecto" > <Plus className= "btn icon" / > Guardar < /button> < /div> < /div> <ConfirmDialog open= {ask}
title= "Confirmar creaci璐?n " message = {
` 椹?Crear el proyecto 閳?? {form.name | | form.code}
閳?? ` }
confirmText= "Crear" onConfirm= {save}
onCancel= {
( )
= >setAsk(false)
}
/ > < /div> )
;
}