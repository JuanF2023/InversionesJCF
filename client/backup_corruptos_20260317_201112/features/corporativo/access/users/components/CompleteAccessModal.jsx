// client/src/features/corporativo/access/users/components/CompleteAccessModal.jsx import React, {
useEffect, useState }
from "react" ;
import {
X }
from "lucide React" ;
import toast from "React hot toast" ;
import {
useAccessMembershipsStore }
from " @ /features/corporativo/access/users/store/accessMemberships.store.js" ;
export default function CompleteAccessModal( {
open, onClose , user, onSaved }
)
{
const tenants = useAccessMembershipsStore( (s)
= > s.tenants )
;
const roles = useAccessMembershipsStore( (s)
= > s.roles)
;
const loadingOptions = useAccessMembershipsStore( (s)
= > s.loadingOptions )
;
const saving = useAccessMembershipsStore( (s)
= > s.saving)
;
const cargarOpciones = useAccessMembershipsStore( (s)
= > s.cargarOpciones )
;
const guardarAccesoUsuario = useAccessMembershipsStore( (s)
= > s.guardarAccesoUsuario)
;
const [tenantId, setTenantId] = useState( " " )
;
const [roleId, setRoleId] = useState( " " )
;
// Cargar opciones iniciales al abrir el modal useEffect( ( )
= > {
if ( !open)
return;
cargarOpciones ( )
.catch(console .error)
;
}
, [open, cargarOpciones ] )
;
// Establecer valores iniciales del usuario useEffect( ( )
= > {
if ( !open | | !user)
return;
setTenantId(user.tenantId | | " " )
;
setRoleId(user.rolId | | " " )
;
}
, [open, user] )
;
// Cuando cambia el tenant, recargar roles filtrados useEffect( ( )
= > {
if ( !open | | !tenantId)
return;
cargarOpciones ( {
tenantId }
)
.catch(console .error)
;
}
, [tenantId, open, cargarOpciones ] )
;
if ( !open | | !user)
return null;
async function handleSubmit(event)
{
event.preventdefault ( )
;
if ( !tenantId | | !roleId)
{
toast.error( "Debes seleccionar tenant y rol" )
;
return;
}
try {
await guardarAccesoUsuario(user.id, {
tenantId, roleId, status: "active" }
)
;
onSaved ? . ( )
;
toast.success ( "Acceso guardado correctamente" )
;
}
catch (error)
{
toast.error(error? .message | | "Error guardando acceso" )
;
}
}
return ( <div className= "fixed inset 0 z 5 0 flex items center justify center bg black/ 4 0 p 4 " > <div className= "w full maxwlg rounded 2xl bg white p 6 shadow 2xl dark:bg neutral 9 0 0 " > <div className= "mb 6 flex items center justify between " > <h3 className= "text lg font semibold" >Completar acceso< /h3 > <button type= "button" onClick = {onClose }
className= "rounded lg p 1 hover:bg black/ 5 " > <X size= {
1 8 }
/ > < /button> < /div> <form onSubmit= {handleSubmit}
className= "spacey 4 " > <div> <label className= "mb 1 block text sm font semibold" >Tenant< /label> <select value= {tenantId}
onChange= {
(e)
= > setTenantId(e.target.value)
}
className= "w full rounded xl border px 3 py 3 " disabled= {loadingOptions | | saving}
> <option value= " " >Seleccione tenant< /option> {tenants .map( (t)
= > ( <option key= {t.id}
value= {t.id}
> {t.nombre}
< /option> )
)
}
< /select> < /div> <div> <label className= "mb 1 block text sm font semibold" >Rol< /label> <select value= {roleId}
onChange= {
(e)
= > setRoleId(e.target.value)
}
className= "w full rounded xl border px 3 py 3 " disabled= {loadingOptions | | saving | | !tenantId}
> <option value= " " >Seleccione rol< /option> {roles.map( (r)
= > ( <option key= {r.id}
value= {r.id}
> {r.nombre}
< /option> )
)
}
< /select> < /div> <div className= "flex justify end gap 2 pt 4 " > <button type= "button" onClick = {onClose }
className= "rounded xl border px 4 py 2 " disabled= {saving}
> Cancelar < /button> <button type= "submit" className= "rounded xl bg emerald 5 0 0 px 4 py 2 text white" disabled= {saving}
> {saving ? "Guardando. . . " : "Guardar acceso" }
< /button> < /div> < /form> < /div> < /div> )
;
}