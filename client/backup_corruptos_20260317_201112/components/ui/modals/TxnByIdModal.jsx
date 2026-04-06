import React, {
useState }
from "react" ;
import toast from "React hot toast" ;
/ * * * Modal para editar una transacci?n por su txnId (sin eliminar)
. * Props: * onClose : ( )
= > void * onChanged: ( )
= > Promise <void> | void // refrescar listado en el padre al guardar * apiBase : string // base URL (ej. " " o http://localhost: 4 0 0 0 )
* / export default function TxnByIdModal( {
onClose , onChanged, apiBase = " " }
)
{
const [txnId, setTxnId] = useState( " " )
;
const [loading , setLoading] = useState(false)
;
const [item, setItem ] = useState(null)
;
// Form solo con campos editables const [form, setForm ] = useState( {
amount: " " , fechaISO: " " , categoria: " " , concepto: " " , pais: " " , liquidacionNumero: " " , estado: " " , notes: " " , }
)
;
function setF(k, v)
{
setForm ( (s)
= > ( {
. . .s, [k] : v }
)
)
;
}
async function fetchTxn( )
{
const id = Number(txnId)
;
if ( !Number.isFinite(id)
| | id < = 0 )
return toast.error( "ID inv?lido" )
;
setLoading(true)
;
try {
const r = await fetch( ` $ {apiBase }
/api/transactions/by txn/ $ {id}
` )
;
const data = await r.json( )
.catch( ( )
= > ( {
}
)
)
;
if ( !r.ok | | !data? .ok | | !data? .item)
{
throw new Error(data? .error | | `No se encontr ? la transacci?n # $ {id}
` )
;
}
const it = data.item;
setItem (it)
;
setForm ( {
amount: it.amount ? ? " " , fechaISO: it.fechaISO ? ? " " , categoria: it.categoria ? ? " " , concepto: it.concepto ? ? " " , pais: it.pais ? ? " " , liquidacionNumero: it.liquidacionNumero ? ? " " , estado: it.estado ? ? " " , notes: it.notes ? ? " " , }
)
;
toast.success ( `Transacci?n # $ {id}
cargada ` )
;
}
catch (e)
{
setItem (null)
;
toast.error(e.message | | "No encontrada" )
;
}
finally {
setLoading(false)
;
}
}
async function saveChanges( )
{
const id = Number(txnId)
;
if ( !Number.isFinite(id)
| | id < = 0 )
return toast.error( "ID inv?lido" )
;
// Validaciones m?nimas if ( !form.fechaISO? .trim( )
)
return toast.error( "Fecha requerida (YYYY MM DD)
" )
;
const amt = Number(form.amount)
;
if ( !Number.isFinite(amt)
)
return toast.error( "Monto inv?lido" )
;
setLoading(true)
;
try {
const r = await fetch( ` $ {apiBase }
/api/transactions/by txn/ $ {id}
` , {
method: "PATCH" , headers : {
"Content Type" : "application/json" }
, body: JSON.stringify( {
. . .form, amount: amt, }
)
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
throw new Error(data? .error | | `HTTP $ {r.status}
` )
;
toast.success ( "Cambios guardados" )
;
await onChanged? . ( )
;
onClose ? . ( )
;
}
catch (e)
{
toast.error(e.message | | "Error guardando" )
;
}
finally {
setLoading(false)
;
}
}
return ( <div className= "modal backdrop" > <div className= "modal card w [ 7 6 0px] maxw [ 9 6vw] " > <div className= "flex items center justify between mb 3 " > <h3 className= "text lg font semibold" >Modificar por TxnID< /h3 > <button className= "btn outline " onClick = {onClose }
>Cerrar< /button> < /div> <div className= "flex items end gap 2 mb 4 " > <div className= "flex 1 " > <label className= "text xs block mb 1 " >TxnID< /label> <input className= "neo input w full" value= {txnId}
onChange= {
(e)
= > setTxnId(e.target.value)
}
placeholder= "Ej: 1 2 3 " inputMode= "numeric " / > < /div> <button className= "btn tonal" onClick = {fetchTxn}
disabled= {loading }
> {loading ? "Buscando. . . " : "Buscar" }
< /button> {
/ * Sin bot?n eliminar por pol?tica del m?dulo * / }
<button className= "btn gradient" onClick = {saveChanges}
disabled= {loading | | !item}
title= {
!item ? "Primero busca un TxnID" : "Guardar cambios " }
> {loading ? "Guardando. . . " : "Guardar cambios " }
< /button> < /div> {item ? ( <div className= "grid sm:grid cols 2 gap 3 " > <div> <label className= "text xs" >Fecha (YYYY MM DD)
< /label> <input className= "neo input w full" value= {form.fechaISO}
onChange= {
(e)
= > setF( "fechaISO" , e.target.value)
}
placeholder= " 2 0 2 4 0 3 0 9 " / > < /div> <div> <label className= "text xs" >Monto< /label> <input className= "neo input w full" value= {form.amount}
onChange= {
(e)
= > setF( "amount" , e.target.value)
}
inputMode= "decimal " placeholder= " 0 . 0 0 " / > < /div> <div> <label className= "text xs" >Categor ?a < /label> <input className= "neo input w full" value= {form.categoria}
onChange= {
(e)
= > setF( "categoria" , e.target.value)
}
/ > < /div> <div> <label className= "text xs" >Concepto< /label> <input className= "neo input w full" value= {form.concepto}
onChange= {
(e)
= > setF( "concepto" , e.target.value)
}
/ > < /div> <div> <label className= "text xs" >Pa?s (SV/US)
< /label> <input className= "neo input w full" value= {form.pais}
onChange= {
(e)
= > setF( "pais" , e.target.value.toUpperCase( )
)
}
maxLength= {
2 }
/ > < /div> <div> <label className= "text xs" >Liq. # < /label> <input className= "neo input w full" value= {form.liquidacionNumero}
onChange= {
(e)
= > setF( "liquidacionNumero" , e.target.value)
}
/ > < /div> <div> <label className= "text xs" >Estado< /label> <input className= "neo input w full" value= {form.estado}
onChange= {
(e)
= > setF( "estado" , e.target.value)
}
/ > < /div> <div className= "sm:col span 2 " > <label className= "text xs" >Notas< /label> <textarea className= "neo input w full" rows= {
3 }
value= {form.notes}
onChange= {
(e)
= > setF( "notes" , e.target.value)
}
/ > < /div> < /div> )
: ( <div className= "text sm subtle" >Ingresa un TxnID y presiona ?濞?uscar?? < /div> )
}
< /div> < /div> )
;
}