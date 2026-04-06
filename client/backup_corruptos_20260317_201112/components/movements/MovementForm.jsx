// client/src/components/movements/MovementForm.jsx import React, {
useMemo , useState }
from "react" ;
import {
Plus, Save }
from "lucide React" ;
import FieldPickerModal from " . /FieldPickerModal.jsx" ;
import DynamicFields from " . /DynamicFields.jsx" ;
import {
createMovement }
from " @ /features/corporativo/movements/api/movements.api.js" ;
export default function MovementForm( {
defaultKind = "expense " , // "income" | "expense " typeId, // BusinessType scope = "business" , // "global" | "property" | "business" | "unit" tenantId, propertyId, businessId, unitId, onSaved , }
)
{
// base const [kind, setKind ] = useState(defaultKind)
;
const [date, setDate ] = useState( ( )
= > new Date( )
.toISOString( )
.slice( 0 , 1 0 )
)
;
const [amount, setAmount] = useState( " " )
;
const [currency, setCurrency] = useState( "USD" )
;
const [concept , setConcept] = useState( " " )
;
const [notes, setNotes] = useState( " " )
;
// din?micos const [fields, setFields] = useState( [ ] )
;
// [ {
key,label,type,unit }
] const [payload , setPayload] = useState( {
}
)
;
// {
key: value }
const selectedKeys = useMemo ( ( )
= > fields.map( (f)
= > f.key)
, [fields] )
;
const [pickerOpen, setPickerOpen] = useState(false)
;
function handleAddFields(newFields)
{
// evita duplicados const next = [ . . .fields] ;
for (const f of newFields)
{
if ( !next.some( (x)
= > x.key = = = f.key)
)
next.push(f)
;
}
setFields(next)
;
}
const [saving, setSaving] = useState(false)
;
async function handleSubmit(e)
{
e? .preventdefault ( )
;
setSaving(true)
;
try {
// separar ad hoc para el backend (opcional)
const customFields = fields.filter( (f)
= > f. _adhoc)
.map( (f)
= > ( {
name: f.label, type: f.type, unit: f.unit, value: payload [f.key] ? ? null }
)
)
;
// payload usando keys ??el backend puede mapear keys?閹?ieldId o guardarlos directos const res = await createMovement ( {
kind, date, amount: Number(amount | | 0 )
, currency, concept , notes, scope, tenantId, propertyId, businessId, unitId, typeId, payload , customFields, }
)
;
onSaved ? . (res)
;
// reset m?nimo setAmount( " " )
;
setConcept( " " )
;
setNotes( " " )
;
setPayload( {
}
)
;
}
catch (err)
{
console .error( "Error al guardar movimiento" , err)
;
alert( "No se pudo guardar . " )
;
}
finally {
setSaving(false)
;
}
}
return ( <form onSubmit= {handleSubmit}
className= "neo card neo card deep neo card tinted p 4 md:p 6 rounded 2xl spacey 4 " > {
/ * Base com閻?n * / }
<div className= "grid grid cols 1 md:grid cols 4 gap 3 " > <div> <label className= "text xs subtle" >Tipo< /label> <select className= "input control md w full" value= {kind}
onChange= {
(e)
= > setKind (e.target.value)
}
> <option value= "income" >Ingreso < /option> <option value= "expense " >Costo< /option> < /select> < /div> <div> <label className= "text xs subtle" >Fecha< /label> <input type= "date" className= "input control md w full" value= {date}
onChange= {
(e)
= > setDate (e.target.value)
}
/ > < /div> <div> <label className= "text xs subtle" >Monto< /label> <input type= "number" step= "any" className= "input control md w full" value= {amount}
onChange= {
(e)
= > setAmount(e.target.value)
}
/ > < /div> <div> <label className= "text xs subtle" >Moneda< /label> <input className= "input control md w full" value= {currency}
onChange= {
(e)
= > setCurrency(e.target.value)
}
/ > < /div> < /div> <div className= "grid grid cols 1 md:grid cols 2 gap 3 " > <div> <label className= "text xs subtle" >Concepto< /label> <input className= "input control md w full" value= {concept }
onChange= {
(e)
= > setConcept(e.target.value)
}
/ > < /div> <div> <label className= "text xs subtle" >Notas< /label> <input className= "input control md w full" value= {notes}
onChange= {
(e)
= > setNotes(e.target.value)
}
/ > < /div> < /div> {
/ * Din?micos * / }
<div className= "flex items center justify between " > <div className= "text sm font semibold" >Campos adicionales< /div> <button type= "button" className= "btn tonal btn shimmer control md" onClick = {
( )
= > setPickerOpen(true)
}
> <Plus className= "btn icon" / > Agregar campos < /button> < /div> {fields.length = = = 0 & & <div className= "text sm subtle" >A閻?n no hay campos adicionales. < /div> }
{fields.length > 0 & & ( <DynamicFields fields= {fields}
values= {payload }
onChange= {setPayload}
/ > )
}
<div className= "pt 2 " > <button type= "submit" disabled= {saving}
className= "btn gradient btn action control md btn shimmer " > <Save className= "btn icon" / > {saving ? "Guardando?? : "Guardar " }
< /button> < /div> <FieldPickerModal open= {pickerOpen}
onClose = {
( )
= > setPickerOpen(false)
}
typeId= {typeId}
kind= {kind}
selectedKeys= {selectedKeys}
onAddFields= {
(fs)
= > {
handleAddFields(fs)
;
setPickerOpen(false)
;
}
}
/ > < /form> )
;
}