// client/src/features/corporativo/components/modals/UserFormModal.jsx import React, {
useEffect, useState }
from "react" ;
import BaseModal from " . /BaseModal.jsx" ;
import {
createUser }
from " @ /features/corporativo/access/users/api/users.api.js" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function UserFormModal( {
open, onClose , onCreated }
)
{
const [form, setForm ] = useState( {
name: " " , email: " " , pin: " " , phone: " " , roleHint: "corporate_admin" , }
)
;
const [saving, setSaving] = useState(false)
;
const [err, setErr] = useState( " " )
;
useEffect( ( )
= > {
if ( !open)
return;
setForm ( {
name: " " , email: " " , pin: " " , phone: " " , roleHint: "corporate_admin" }
)
;
setErr( " " )
;
}
, [open] )
;
const up = (k, v)
= > setForm ( (s)
= > ( {
. . .s, [k] : v }
)
)
;
async function onSave( )
{
setSaving(true)
;
setErr( " " )
;
try {
if ( !form.name.trim( )
| | !form.email.trim( )
| | ! / ^ \d{
4 }
$ | ^ \d{
6 }
$ / .test(form.pin)
)
{
setErr( "Nombre, email y PIN ( 4 o 6 d?gitos)
son obligatorios. " )
;
setSaving(false)
;
return;
}
const payload = {
nombre: form.name.trim( )
, email: form.email.trim( )
.toLowerCase( )
, pin: form.pin.trim( )
, // el backend lo hashea a pinHash phone: form.phone? .trim( )
| | undefined, roleHint: form.roleHint | | undefined, }
;
const created = await createUser(payload )
;
onCreated? . (created )
;
onClose ? . ( )
;
}
catch (e)
{
setErr(e? .message | | "No se pudo crear el usuario " )
;
}
finally {
setSaving(false)
;
}
}
if ( !open)
return null;
return ( <BaseModal open= {open}
onClose = {onClose }
title= "Crear usuario " footer= {
< > <button className= "btn outline " onClick = {onClose }
>Cancelar< /button> <button className= "btn gradient" onClick = {onSave}
disabled= {saving}
> {saving ? "Guardando?? : "Guardar " }
< /button> < / > }
> {err & & <div className= "mb 2 rounded lg bg rose 5 0 text rose 7 0 0 text sm ring 1 ring rose 2 0 0 px 3 py 2 " > {err}
< /div> }
<div className= "grid grid cols 1 md:grid cols 2 gap 3 " > <label className= "text sm" > Nombre <input className= "neo input h 1 1 px 3 text [ 1 5px] w full" value= {form.name}
onChange= {
(e)
= > up( "name" , e.target.value)
}
placeholder= "Ej. Juan P閼?rez" / > < /label> <label className= "text sm" > Email <input className= "neo input h 1 1 px 3 text [ 1 5px] w full" type= "email" value= {form.email}
onChange= {
(e)
= > up( "email" , e.target.value)
}
placeholder= "owner@empresa .com" / > < /label> <label className= "text sm" > PIN ( 4 o 6 d?gitos)
<input className= "neo input h 1 1 px 3 text [ 1 5px] w full" inputMode= "numeric " pattern = " \d* " value= {form.pin}
onChange= {
(e)
= > up( "pin" , e.target.value.replace ( / \D/g, " " )
)
}
placeholder= " ?閳?閳?閳?閳?閳?閳??o ?閳?閳?閳?閳?閳?閳?閳?閳?閳?閳?? / > < /label> <label className= "text sm" > Tel閼?fono (opcional)
<input className= "neo input h 1 1 px 3 text [ 1 5px] w full" value= {form.phone}
onChange= {
(e)
= > up( "phone" , e.target.value)
}
placeholder= " + 5 0 3 7 7 7 7 7 7 7 7 " / > < /label> <label className= "text sm md:col span 2 " > Sugerir rol inicial (opcional)
<select className= "neo input h 1 1 px 3 text [ 1 5px] w full" value= {form.roleHint}
onChange= {
(e)
= > up( "roleHint" , e.target.value)
}
> <option value= "corporate_admin" >Administrador corporativo< /option> <option value= "legal_proxy" >Apoderado legal< /option> <option value= "business_manager " >Encargado de negocio < /option> <option value= "cashier " >Cajero< /option> <option value= "waiter" >Mesero< /option> <option value= "cook" >Cocinero< /option> < /select> <div className= "text [ 1 2px] subtle mt 1 " > Solo sugerencia;
la membres ?a real se asigna luego. < /div> < /label> < /div> < /BaseModal> )
;
}