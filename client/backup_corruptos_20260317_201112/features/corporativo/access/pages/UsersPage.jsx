// client/src/features/corporativo/access/pages/UsersPage.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
Search, Users, ShieldCheck, Mail, Building2 , RefreshCcw, AlertTriangle, KeyRound, }
from "lucide React" ;
import toast from "React hot toast" ;
import {
useAccessUsersStore }
from " @ /features/corporativo/access/users/store/accessUsers.store.js" ;
import UsersTable from " @ /features/corporativo/access/users/components/UsersTable.jsx" ;
import CompleteAccessModal from " @ /features/corporativo/access/users/components/CompleteAccessModal.jsx" ;
const cx = ( . . .classes )
= > classes .filter(Boolean )
.join( " " )
;
function StatCard( {
icon: Icon, label, value, helper, tone = "default " }
)
{
return ( <article className= "rounded [ 2 4px] border border [var( border)
] bg [var( panel)
] p 4 shadow sm transition hover:shadow md" > <div className= "flex items start justify between gap 3 " > <div className= "minw 0 " > <p className= "text [ 1 1px] font semibold uppercase tracking [ 0 . 1 8em] opacity 5 5 " > {label}
< /p> <p className= "mt 2 text 3xl font semibold tracking tight" > {value}
< /p> {helper ? <p className= "mt 1 text xs opacity 6 5 " > {helper}
< /p> : null}
< /div> <div className= {cx( "rounded 2xl border border [var( border)
] p 3 " , tone = = = "success " & & "bg emerald 5 0 0 / 1 0 " , tone = = = "warning " & & "bg amber 5 0 0 / 1 0 " , tone = = = "default " & & "bg [var( chip)
] " )
}
> <Icon size= {
1 8 }
className= "opacity 8 0 " / > < /div> < /div> < /article > )
;
}
function InfoBanner( {
missingTenant, missingRole }
)
{
if ( !missingTenant & & !missingRole)
return null;
return ( <section className= "rounded [ 2 4px] border border amber 5 0 0 / 2 5 bg amber 5 0 0 / 1 0 p 4 shadow sm" > <div className= "flex items start gap 3 " > <div className= "mt 0 . 5 " > <AlertTriangle size= {
1 8 }
className= "text amber 6 0 0 dark:text amber 3 0 0 " / > < /div> <div className= "minw 0 " > <p className= "text sm font semibold" >Avisos operativos del m?dulo de acceso< /p> <div className= "mt 2 flex flex wrap gap 2 " > {missingTenant ? ( <span className= "rounded full border border amber 5 0 0 / 2 5 bg white/ 5 0 px 3 py 1 text xs font medium dark:bg black/ 1 0 " > {missingTenant}
usuario (s)
sin tenant resuelto < /span> )
: null}
{missingRole ? ( <span className= "rounded full border border amber 5 0 0 / 2 5 bg white/ 5 0 px 3 py 1 text xs font medium dark:bg black/ 1 0 " > {missingRole}
usuario (s)
sin rol resuelto < /span> )
: null}
< /div> < /div> < /div> < /section > )
;
}
export default function UsersPage( )
{
const items = useAccessUsersStore( (s)
= > s.items)
;
const total = useAccessUsersStore( (s)
= > s.total)
;
const loading = useAccessUsersStore( (s)
= > s.loading )
;
const error = useAccessUsersStore( (s)
= > s.error)
;
const cargar = useAccessUsersStore( (s)
= > s.cargar)
;
const [search, setSearch] = useState( " " )
;
const [selectedUser, setSelectedUser] = useState(null)
;
const [accessModalOpen, setAccessModalOpen] = useState(false)
;
useEffect( ( )
= > {
cargar( {
page: 1 , limit: 5 0 }
)
.catch( ( )
= > {
toast.error( "Error cargando usuarios" )
;
}
)
;
}
, [cargar] )
;
const stats = useMemo ( ( )
= > {
const activos = items.filter( (u)
= > u.activo = = = true)
.length;
const inactivos = items.filter( (u)
= > u.activo ! = = true)
.length;
const missingTenant = items.filter( (u)
= > !u.tenantNombre | | u.tenantNombre = = = "Sin tenant" )
.length;
const missingRole = items.filter( (u)
= > !u.roleName | | u.roleName = = = "Sin rol" )
.length;
return {
total: Number(total | | items.length | | 0 )
, activos , inactivos, missingTenant, missingRole, }
;
}
, [items, total] )
;
const filteredUsers = useMemo ( ( )
= > {
if ( !search)
return items;
const term = search.toLowerCase( )
;
return items.filter( (u)
= > ` $ {u.nombre}
$ {u.email}
` .toLowerCase( )
.includes(term)
)
;
}
, [items, search] )
;
function reloadUsers( )
{
cargar( {
page: 1 , limit: 5 0 }
)
;
}
function openAccessModal(user)
{
setSelectedUser(user)
;
setAccessModalOpen(true)
;
}
function closeAccessModal( )
{
setAccessModalOpen(false)
;
setSelectedUser(null)
;
}
async function handleAccessSaved( )
{
await reloadUsers( )
;
closeAccessModal( )
;
toast.success ( "Acceso actualizado" )
;
}
return ( < > <section className= "spacey 6 " > <InfoBanner missingTenant= {stats.missingTenant}
missingRole= {stats.missingRole}
/ > <div className= "grid gap 4 md:grid cols 3 " > <StatCard icon= {Users}
label= "Usuarios" value= {stats.total}
/ > <StatCard icon= {ShieldCheck}
label= "Activos " value= {stats.activos }
tone= "success " / > <StatCard icon= {Mail}
label= "Inactivos" value= {stats.inactivos}
tone= "warning " / > < /div> <section className= "rounded [ 2 8px] border border [var( border)
] bg [var( panel)
] p 5 shadow sm" > <div className= "flex justify between items center mb 4 " > <div className= "relative w full maxwsm" > <Search size= {
1 6 }
className= "absolute left 3 top 1 / 2 translatey 1 / 2 opacity 5 5 " / > <input type= "text" placeholder= "Buscar usuario . . . " value= {search}
onChange= {
(e)
= > setSearch(e.target.value)
}
className= "w full rounded 2xl border border [var( border)
] bg [var( bg)
] py 3 pl 1 0 pr 3 text sm" / > < /div> <button onClick = {reloadUsers}
className= "inline flex items center gap 2 rounded 2xl border border [var( border)
] bg [var( bg)
] px 4 py 2 text sm font semibold" > <RefreshCcw size= {
1 5 }
/ > Actualizar < /button> < /div> <UsersTable users= {filteredUsers}
onAccess= {openAccessModal}
/ > < /section > < /section > <CompleteAccessModal open= {accessModalOpen}
user= {selectedUser}
onClose = {closeAccessModal}
onSaved = {handleAccessSaved}
/ > < / > )
;
}