// client/src/features/corporativo/access/users/components/UsersTable.jsx import React from "react" ;
import {
Mail, Eye, Pencil, KeyRound, AlertCircle, Building2 , Users, Store, Briefcase }
from "lucide React" ;
import {
Link }
from "React router dom" ;
const cx = ( . . .classes )
= > classes .filter(Boolean )
.join( " " )
;
function initialsFromName(name)
{
return String(name | | " " )
.split( " " )
.filter(Boolean )
.slice( 0 , 2 )
.map( (part)
= > part[ 0 ] ? .toUpperCase( )
)
.join( " " )
;
}
function UserAvatar( {
name, user }
)
{
// Determinar si el usuario tiene m閻?ltiples accesos const hasMultipleAccesses = user? .memberships & & user.memberships.length > 1 ;
return ( <div className= "relative" > <div className= "grid h 1 0 w 1 0 place items center rounded xl border border [var( border)
] bg gradient to br from slate 1 0 0 to slate 2 0 0 text sm font bold dark:from slate 8 0 0 dark:to slate 7 0 0 " > {initialsFromName(name)
| | "U" }
< /div> {hasMultipleAccesses & & ( <div className= "absolute bottom 1 right 1 flex h 4 w 4 items center justify center rounded full border 2 border white bg blue 5 0 0 text [ 8px] font bold text white dark:border slate 9 0 0 " > {user.memberships.length}
< /div> )
}
< /div> )
;
}
function StatusBadge( {
activo }
)
{
return ( <span className= {cx( "inline flex minw [ 8 0px] justify center rounded full border px 2 py 0 . 5 text xs font semibold" , activo ? "border emerald 5 0 0 / 3 5 bg emerald 5 0 0 / 1 0 text emerald 7 0 0 dark:bg emerald 5 0 0 / 2 0 dark:text emerald 3 0 0 " : "border slate 5 0 0 / 3 5 bg slate 5 0 0 / 1 0 text slate 7 0 0 dark:bg slate 5 0 0 / 2 0 dark:text slate 3 0 0 " )
}
> {activo ? "Activo" : "Inactivo" }
< /span> )
;
}
// Funci?n para aplanar los datos: crear una fila por cada membership function flattenUsersWithMemberships(users)
{
const flatRows = [ ] ;
users.forEach (user = > {
if (user.memberships & & user.memberships.length > 0 )
{
// Una fila por cada membership user.memberships.forEach ( (membership, index)
= > {
flatRows.push( {
id: ` $ {user.id}
$ {index}
` , originalUserId : user.id, user: user, membership: membership, isFirst : index = = = 0 , isLast: index = = = user.memberships.length 1 }
)
;
}
)
;
}
else {
// Usuario sin memberships (una fila)
flatRows.push( {
id: ` $ {user.id}
no membership` , originalUserId : user.id, user: user, membership: null, isFirst : true, isLast: true }
)
;
}
}
)
;
return flatRows;
}
export default function UsersTable( {
users = [ ] , onAccess }
)
{
const flatRows = flattenUsersWithMemberships(users)
;
if ( !users.length)
{
return ( <div className= "flex flex col items center justify center py 1 6 text center" > <div className= "mb 3 rounded full bg slate 1 0 0 p 4 dark:bg slate 8 0 0 " > <Users size= {
2 4 }
className= "opacity 5 0 " / > < /div> <p className= "text lg font semibold" >No hay usuarios< /p> <p className= "text sm opacity 6 0 " >Los usuarios aparecer?n aqu? cuando sean creados < /p> < /div> )
;
}
return ( <div className= "overflowxauto" > <table className= "minwfull border collapse text sm" > <thead> <tr className= "border b border [var( border)
] text left" > <th className= "w [ 2 8 0px] py 3 pl 2 font medium opacity 7 0 " >Usuario < /th> <th className= "w [ 1 8 0px] py 3 font medium opacity 7 0 " >Tenant< /th> <th className= "w [ 1 8 0px] py 3 font medium opacity 7 0 " >Rol< /th> <th className= "w [ 1 0 0px] py 3 font medium opacity 7 0 " >Estado< /th> <th className= "w [ 2 0 0px] py 3 pr 2 text right font medium opacity 7 0 " >Acciones< /th> < /tr> < /thead> <tbody> {flatRows.map( (row)
= > {
const {
user, membership }
= row;
// Determinar si este acceso est? incompleto const missingAccess = !membership | | !membership.tenantNombre | | !membership.roleName | | membership.tenantNombre = = = "Sin tenant" | | membership.roleName = = = "Sin rol" ;
return ( <tr key= {row.id}
className= {cx( "border b border [var( border)
] transition colors hover:bg [var( hover bg)
] " , !row.isLast & & "borderb 0 " // Sin borde entre filas del mismo usuario )
}
> <td className= "py 3 pl 2 " > <div className= "flex items center gap 3 " > <UserAvatar name= {user.nombre}
user= {user}
/ > <div className= "flex flex col" > <Link to= {
` /corporativo/admin/users/ $ {user.id}
` }
className= "font semibold hover:underline" > {user.nombre}
< /Link> <div className= "flex items center gap 1 text xs opacity 7 0 " > <Mail size= {
1 1 }
/ > {user.email}
< /div> < /div> < /div> < /td> <td className= "py 3 " > {membership ? ( <div className= "flex items center gap 1 . 5 " > {membership.tenantTipo = = = "restaurante" ? ( <Store size= {
1 4 }
className= "text sky 6 0 0 " / > )
: ( <Briefcase size= {
1 4 }
className= "text violet 6 0 0 " / > )
}
<span className= "font medium text sky 7 0 0 dark:text sky 3 0 0 " > {membership.tenantNombre}
< /span> {membership.membershipStatus & & membership.membershipStatus ! = = "active" & & ( <span className= "ml 1 rounded full bg amber 1 0 0 px 1 . 5 py 0 . 5 text [ 9px] font medium text amber 7 0 0 dark:bg amber 9 0 0 / 3 0 dark:text amber 4 0 0 " > {membership.membershipStatus}
< /span> )
}
< /div> )
: ( <span className= "text sm text slate 4 0 0 " > ?? /span> )
}
< /td> <td className= "py 3 " > {membership ? ( <span className= "text violet 7 0 0 dark:text violet 3 0 0 " > {membership.roleName}
< /span> )
: ( <span className= "text sm text slate 4 0 0 " > ?? /span> )
}
< /td> <td className= "py 3 " > <StatusBadge activo= {user.activo}
/ > < /td> <td className= "py 3 pr 2 " > <div className= "flex justify end gap 2 " > <Link to= {
` /corporativo/admin/users/ $ {user.id}
` }
className= "inline flex h 8 items center gap 1 rounded lg border border transparent px 2 . 5 text xs font medium text gray 6 0 0 transition colors hover:border slate 2 0 0 hover:bg slate 5 0 dark:text gray 3 0 0 dark:hover:border slate 7 0 0 dark:hover:bg slate 8 0 0 / 5 0 " > <Eye size= {
1 4 }
/ > Ver < /Link> <Link to= {
` /corporativo/admin/users/ $ {user.id}
/editar` }
className= "inline flex h 8 items center gap 1 rounded lg border border transparent px 2 . 5 text xs font medium text gray 6 0 0 transition colors hover:border slate 2 0 0 hover:bg slate 5 0 dark:text gray 3 0 0 dark:hover:border slate 7 0 0 dark:hover:bg slate 8 0 0 / 5 0 " > <Pencil size= {
1 4 }
/ > Editar < /Link> <button onClick = {
( )
= > onAccess(user)
}
className= {cx( "inline flex h 8 items center gap 1 rounded lg px 2 . 5 text xs font medium transition colors" , missingAccess ? "border border amber 2 0 0 bg amber 5 0 0 text white hover:bg amber 6 0 0 dark:border amber 8 0 0 / 3 0 dark:bg amber 6 0 0 dark:hover:bg amber 7 0 0 " : "border border slate 2 0 0 bg transparent text gray 6 0 0 hover:bg slate 5 0 dark:border slate 7 0 0 dark:text gray 3 0 0 dark:hover:bg slate 8 0 0 / 5 0 " )
}
> <KeyRound size= {
1 4 }
/ > Acceso < /button> < /div> < /td> < /tr> )
;
}
)
}
< /tbody> < /table> {
/ * Leyenda * / }
{flatRows.length > 0 & & ( <div className= "mt 4 flex items center gap 4 border t border [var( border)
] pt 3 text xs text slate 5 0 0 " > <div className= "flex items center gap 1 " > <div className= "h 3 w 3 rounded full bg blue 5 0 0 " > < /div> <span>N閻?mero en avatar = cantidad de accesos del usuario < /span> < /div> <div className= "flex items center gap 1 " > <Store size= {
1 2 }
className= "text sky 6 0 0 " / > <span>Restaurante< /span> < /div> <div className= "flex items center gap 1 " > <Briefcase size= {
1 2 }
className= "text violet 6 0 0 " / > <span>Corporativo< /span> < /div> < /div> )
}
< /div> )
;
}