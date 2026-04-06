// client/src/features/corporativo/access/pages/PermissionsPage.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
Search, KeyRound, ShieldCheck, FolderTree }
from "lucide React" ;
const PERMISSIONS = [ "users.manage" , "roles.manage" , "permissions.manage" , "memberships.manage" , "properties.read" , "properties.write" , "transactions.read" , "transactions.write" , "projects.read" , "projects.write" , "businesses.read" , "businesses.write" , ] ;
const cx = ( . . .classes )
= > classes .filter(Boolean )
.join( " " )
;
function groupPermissions(list = [ ] )
{
return list.reduce( (acc, permission)
= > {
const [group = "general " ] = String(permission)
.split( " . " )
;
if ( !acc[group] )
acc[group] = [ ] ;
acc[group] .push(permission)
;
return acc;
}
, {
}
)
;
}
function PermissionCard ( {
permission }
)
{
const isManage = permission.includes( "manage" )
;
return ( <article className= "rounded [ 2 4px] border border [var( border)
] bg [var( panel)
] p 4 shadow sm transition hover:shadow md" > <div className= "flex items start gap 3 " > <div className= "rounded 2xl border border [var( border)
] bg [var( chip)
] p 3 opacity 8 0 " > {isManage ? <ShieldCheck size= {
1 6 }
/ > : <KeyRound size= {
1 6 }
/ > }
< /div> <div className= "minw 0 " > <p className= "text xs font semibold uppercase tracking [ 0 . 1 6em] opacity 5 5 " > Permission < /p> <p className= "mt 1 break all text sm font semibold" > {permission}
< /p> <p className= "mt 2 text xs opacity 6 0 " > {isManage ? "Permiso de administraci?n " : "Permiso operativo o de consulta" }
< /p> < /div> < /div> < /article > )
;
}
export default function PermissionsPage( )
{
const [search, setSearch] = useState( " " )
;
const filtered = useMemo ( ( )
= > {
const q = search.trim( )
.toLowerCase( )
;
if ( !q)
return PERMISSIONS;
return PERMISSIONS.filter( (permission)
= > permission.toLowerCase( )
.includes(q)
)
;
}
, [search] )
;
const grouped = useMemo ( ( )
= > groupPermissions(filtered)
, [filtered] )
;
useEffect( ( )
= > {
document.title = "Permisos | Accesos " ;
}
, [ ] )
;
return ( <section className= "spacey 6 " > <section className= "rounded [ 2 8px] border border [var( border)
] bg [var( panel)
] p 5 shadow sm md:p 6 " > <div className= "flex flex col gap 4 lg:flex row lg:items end lg:justify between " > <div className= "maxw 2xl" > <p className= "text xs font semibold uppercase tracking [ 0 . 1 8em] opacity 5 5 " > Permisos del sistema < /p> <h2 className= "mt 2 text 2xl font semibold tracking tight" > Matriz base de acciones < /h2 > <p className= "mt 2 text sm leading 6 opacity 7 5 " > Cat?logo operativo de capacidades disponibles para roles, memberships y control de acceso por m?dulo. < /p> < /div> <div className= "relative minw [ 2 6 0px] lg:minw [ 3 2 0px] " > <Search size= {
1 6 }
className= "pointer events none absolute left 3 top 1 / 2 translatey 1 / 2 opacity 5 5 " / > <input type= "text" value= {search}
onChange= {
(e)
= > setSearch(e.target.value)
}
placeholder= "Buscar permiso . . . " className= "w full rounded 2xl border border [var( border)
] bg [var( bg)
] py 3 pl 1 0 pr 3 text sm outline none transition focus:border [var( accent, # 7c3aed)
] " / > < /div> < /div> < /section > {Object.entries (grouped )
.map( ( [group, permissions] )
= > ( <section key= {group}
className= "rounded [ 2 8px] border border [var( border)
] bg [var( panel)
] p 5 shadow sm md:p 6 " > <div className= "flex items center gap 3 border b border [var( border)
] pb 4 " > <div className= "rounded 2xl border border [var( border)
] bg [var( chip)
] p 3 " > <FolderTree size= {
1 6 }
/ > < /div> <div> <p className= "text xs font semibold uppercase tracking [ 0 . 1 8em] opacity 5 5 " > Grupo < /p> <h3 className= "mt 1 text lg font semibold tracking tight capitalize" > {group}
< /h3 > < /div> <div className= "ml auto" > <span className= "inline flex rounded full border border [var( border)
] bg [var( chip)
] px 3 py 1 . 5 text xs font semibold" > {permissions.length}
permiso {permissions.length = = = 1 ? " " : "s" }
< /span> < /div> < /div> <div className= "mt 5 grid gap 4 md:grid cols 2 xl:grid cols 3 " > {permissions.map( (permission)
= > ( <PermissionCard key= {permission}
permission= {permission}
/ > )
)
}
< /div> < /section > )
)
}
{filtered.length = = = 0 & & ( <div className= "rounded [ 2 8px] border border dashed border [var( border)
] bg [var( panel)
] p 1 0 text center" > <p className= "text base font semibold" >No se encontraron permisos< /p> <p className= "mt 2 text sm opacity 7 0 " > Prueba con otro criterio de b閻?squeda. < /p> < /div> )
}
< /section > )
;
}