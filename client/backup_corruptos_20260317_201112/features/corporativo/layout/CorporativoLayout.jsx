// client/src/features/corporativo/layout/CorporativoLayout.jsx import React, {
useState, useEffect, useCallback, useMemo }
from "react" ;
import {
Outlet, Link, NavLink , useLocation, useNavigate }
from "React router dom" ;
import clsx from "clsx" ;
import " @ /styles/corporativo/underline tabs.css" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
useCorporativo }
from " @ /features/corporativo/store/corporativoStore.js" ;
import {
loadSession }
from " @ /lib/authSession.js" ;
import {
useSession }
from " @ /store/core/session .store.js" ;
import {
money }
from " @ /utils/format.js" ;
// Auto logout & Heartbeat (solo UX / salud)
import {
useIdleLogout }
from " @ /lib/idleLogout" ;
import {
useSessionHeartbeat }
from " @ /lib/sessionHeartbeat" ;
// UI shared import {
ThemeSwitcher, ConfirmModal }
from " @ /components/ui" ;
// 閼?conos (lucide React)
import {
LayoutDashboard, KanbanSquare, Building2 , FileSpreadsheet, BarChart3 , ListChecks, Info, Home as HomeIcon, Wallet, Banknote, Users, ChevronDown, User as UserIcon, Palette , LogOut, Undo2 , Menu, ShieldCheck, }
from "lucide React" ;
/ * * * Tabs principales (todas bajo /corporativo/ * )
* / const MAIN_TABS = [ {
to: " /corporativo/dashboards" , label: "Dashboards" , icon: <LayoutDashboard size= {
1 6 }
/ > , end: false }
, {
to: " /corporativo/negocios" , label: "Negocios" , icon: <KanbanSquare size= {
1 6 }
/ > }
, {
to: " /corporativo/propiedades" , label: "Propiedades" , icon: <Building2 size= {
1 6 }
/ > }
, {
to: " /corporativo/proyectos" , label: "Proyectos" , icon: <KanbanSquare size= {
1 6 }
/ > }
, {
to: " /corporativo/transacciones" , label: "Transacciones" , icon: <FileSpreadsheet size= {
1 6 }
/ > }
, {
to: " /corporativo/admin/users" , label: "Accesos " , icon: <ShieldCheck size= {
1 6 }
/ > }
, {
to: " /corporativo/por hacer" , label: "Por hacer" , icon: <ListChecks size= {
1 6 }
/ > }
, {
to: " /corporativo/acerca de" , label: "Acerca de" , icon: <Info size= {
1 6 }
/ > }
, {
to: " /corporativo/filosofia de dar" , label: "Filosof ?a de Dar" , icon: <HomeIcon size= {
1 6 }
/ > }
, ] ;
// Hidrata el usuario en runtime si viene del login if ( !window. _ _user)
{
try {
const {
user }
= loadSession( )
| | {
}
;
if (user)
window. _ _user = user;
}
catch {
// ignore }
}
/ * * * Detecta rutas t?picas de formularios para UX (footer NO sticky)
* / function computeIsFormRoute(pathname)
{
return / \ / (nuevo|nueva|crear|editar|edit|new|form)
( \ / | $ )
/i.test(pathname)
;
}
export default function CorporativoLayout( )
{
const {
pathname }
= useLocation( )
;
const navigate = useNavigate( )
;
const [mobileOpen, setMobileOpen] = useState(false)
;
const [userMenuOpen, setUserMenuOpen] = useState(false)
;
const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
;
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
// Footer NO sticky solo en formularios const isFormRoute = useMemo ( ( )
= > computeIsFormRoute(pathname)
, [pathname] )
;
const mainBottomPadding = isFormRoute ? "pb 8 " : "pb 2 8 " ;
// Store sesi?n global (enterprise)
const cerrarSesionGlobal = useSession( (s)
= > s.cerrarSesionGlobal)
;
// = = = = = AUTO LOGOUT POR INACTIVIDAD (solo UI)
= = = = = useIdleLogout( {
timeoutMinutes : 1 0 , onTimeout: ( )
= > {
// Regla del proyecto: la inactividad NO mata token. // Solo manda al login. navigate( " /login" , {
replace : true, state: {
from: {
pathname }
}
}
)
;
}
, }
)
;
// = = = = = HEARTBEAT = = = = = useSessionHeartbeat( {
everyMinutes: 5 , onInvalid: ( )
= > {
// Token inv?lido seg閻?n backend = > aqu? s? cerramos global (best effort)
cerrarSesionGlobal( {
callBackend: true }
)
.catch( ( )
= > {
// ignore }
)
.finally ( ( )
= > {
window. _ _user = null;
navigate( " /login" , {
replace : true }
)
;
}
)
;
}
, }
)
;
// = = = = = Store corporativo: cargas iniciales = = = = = const fetchMonthlyProduction = useCorporativo ( (s)
= > s.fetchMonthlyProduction)
;
useEffect( ( )
= > {
fetchMonthlyProduction? . ( )
;
}
, [fetchMonthlyProduction] )
;
const cargarBasicos = useCorporativo ( (s)
= > s.cargarBasicos)
;
useEffect( ( )
= > {
cargarBasicos? . ( )
;
}
, [cargarBasicos] )
;
// Prefetch de propiedades al pasar el mouse por la pesta鐢?a const cargarPropiedades = useCorporativo ( (s)
= > s.cargarPropiedades)
;
const loadingProps = useCorporativo ( (s)
= > s.loadingProps)
;
const propsLoaded = useCorporativo ( (s)
= > s.propsLoaded)
;
const prefetchProps = useCallback( ( )
= > {
if ( !propsLoaded & & !loadingProps)
cargarPropiedades? . ( )
;
}
, [propsLoaded, loadingProps, cargarPropiedades] )
;
useEffect( ( )
= > {
prefetchProps( )
;
}
, [prefetchProps] )
;
// Cerrar men閻?s on route change useEffect( ( )
= > {
setMobileOpen(false)
;
setUserMenuOpen(false)
;
}
, [pathname] )
;
// Cerrar popover al hacer click fuera useEffect( ( )
= > {
if ( !userMenuOpen)
return;
const onDoc = (e)
= > {
const menu = document.getElementById ( "user menu popover " )
;
const btn = document.getElementById ( "user menu button" )
;
if ( !menu | | !btn)
return;
if ( !menu.contains(e.target)
& & !btn.contains(e.target)
)
{
setUserMenuOpen(false)
;
}
}
;
document.addEventListener( "mousedown" , onDoc)
;
return ( )
= > document.removeEventListener( "mousedown" , onDoc)
;
}
, [userMenuOpen] )
;
// Cerrar popover con Escape useEffect( ( )
= > {
if ( !userMenuOpen)
return;
const onKey = (e)
= > {
if (e.key = = = "Escape" )
setUserMenuOpen(false)
;
}
;
document.addEventListener( "keydown " , onKey)
;
return ( )
= > document.removeEventListener( "keydown " , onKey)
;
}
, [userMenuOpen] )
;
// Totales del footer const produccionTotal = useCorporativo ( (s)
= > s.base? .produccionMensual ? ? s.monthlyProduction ? ? 0 )
;
const bancosSaldo = useCorporativo ( (s)
= > s.bancosTotal ? ? 0 )
;
// = = = = = = = = USUARIO RUNTIME = = = = = = = = const runtimeUser = (window. _ _user ? ? {
}
)
| | {
}
;
const resolvedName = runtimeUser.nombre | | runtimeUser.displayName | | [runtimeUser.firstName, runtimeUser.lastName] .filter(Boolean )
.join( " " )
| | "Usuario " ;
const user = {
name: resolvedName, email: runtimeUser.email | | " " , photoUrl: runtimeUser.photoUrl | | " " , rol: runtimeUser.rol | | runtimeUser.role | | " " , }
;
// Normalizar roles: soporta strings y objetos {
slug, name, . . . }
const rolesFromArray = Array.isArray (runtimeUser.roles)
? runtimeUser.roles .map( (r)
= > {
if ( !r)
return null;
if (typeof r = = = "string" )
return r.toLowerCase( )
;
if (typeof r = = = "object" )
{
const slugOrName = r.slug | | r.roleSlug | | r.name | | r.roleName | | r.code | | r.id | | r. _id | | " " ;
return String(slugOrName)
.toLowerCase( )
;
}
return String(r)
.toLowerCase( )
;
}
)
.filter(Boolean )
: [ ] ;
const rolesFromFlatFields = [runtimeUser.rol, runtimeUser.role, runtimeUser.roleSlug, runtimeUser.roleName] .filter(Boolean )
.map( (r)
= > String(r)
.toLowerCase( )
)
;
const userRoles = Array.from(new Set( [ . . .rolesFromArray , . . .rolesFromFlatFields] )
)
;
const userPerms = (runtimeUser? .permissions | | [ ] )
.map( (p)
= > String(p)
.toLowerCase( )
)
;
// = = = = = = = = = SOLO CORPORATIVOS PUEDEN VER GESTI閼?N DE USUARIOS / ACCESOS = = = = = = = = = const rawTenant = runtimeUser.tenant | | runtimeUser.tenantSlug | | runtimeUser.corporateTenant | | runtimeUser.defaultTenant | | (Array.isArray (runtimeUser.tenants )
? runtimeUser.tenants [ 0 ] : null)
;
const tenant = rawTenant ? String(rawTenant)
.toLowerCase( )
: " " ;
const isCorpTenant = tenant = = = "corp" | | tenant = = = "corporativo" | | tenant = = = "corporate" | | tenant = = = "corporation" ;
const hasCorporateRole = userRoles.includes( "owner" )
| | userRoles.includes( "corporativo" )
| | userRoles.includes( "corporate_admin" )
| | userRoles.includes( "corp_admin" )
;
const hasUsersManagePerm = userPerms.includes( "users.manage" )
;
const canManageUsers = isCorpTenant | | hasCorporateRole | | hasUsersManagePerm;
const visibleMainTabs = useMemo ( ( )
= > {
return MAIN_TABS.filter( (item)
= > {
if (item.to = = = " /corporativo/admin/users" )
return canManageUsers ;
return true;
}
)
;
}
, [canManageUsers ] )
;
// = = = = = Logout enterprise (revoca + limpia)
= = = = = const doLogout = async ( )
= > {
try {
await cerrarSesionGlobal( {
callBackend: true }
)
;
}
finally {
window. _ _user = null;
navigate( " /login" , {
replace : true }
)
;
}
}
;
// Volver a login SIN cerrar sesi?n (mantiene token)
??regla del proyecto const goLoginKeepAlive = ( )
= > {
navigate( " /login" , {
replace : true, state: {
from: {
pathname }
}
}
)
;
}
;
return ( <div className= "minhdvh bg bg text text flex flex col" > <a href= " #contenido" className= "sr only focus:not sr only focus:absolute focus:top 2 focus:left 2 focus:z [ 1 0 0 ] bg bgElev border border border rounded md px 3 py 1 . 5 " > Saltar al contenido < /a> {
/ * HEADER * / }
<header role= "banner" className= "app header sticky top 0 z 4 0 bg bgElev/ 9 5 backdrop blur" > <div className= "container 9 0 " > <div className= "h 1 4 flex items center justify between " > <Link to= " /corporativo" className= "flex items center gap 2 " > <div className= {clsx( "inline flex h 8 w 8 items center justify center rounded lg ring 1 ring border" , isNeo ? "bg bgElev neu" : "bg [var( chip)
] " )
}
> <BarChart3 size= {
1 6 }
/ > < /div> <span className= "font semibold tracking tight" >Inversiones JCF< /span> < /Link> <div className= "flex items center gap 2 " > {
/ * Volver al login SIN cerrar sesi?n * / }
<button onClick = {goLoginKeepAlive}
className= {clsx( "hidden md:inline flex items center gap 2 h 9 px 3 rounded lg text sm ring 1 ring border" , isNeo ? "bg bgElev neu" : "bg [var( chip)
] hover:bg [var( chip hover)
] " )
}
title= "Cambiar usuario (mantiene sesi?n activa)
" > <Undo2 size= {
1 6 }
/ > Ir a Login < /button> {
/ * Desktop user pill * / }
<div className= "hidden md:flex items center" > <button id= "user menu button" aria haspopup= "menu" aria expanded= {userMenuOpen}
onClick = {
( )
= > setUserMenuOpen( (v)
= > !v)
}
className= "user pill" title= {user.email}
> <div className= "user pill_ _avatar flex items center justify center overflow hidden" > {user.photoUrl ? ( <img src= {user.photoUrl}
alt= {user.name}
className= "w full h full object cover" / > )
: ( <UserIcon size= {
1 8 }
className= "opacity 7 0 " / > )
}
< /div> <span className= "user pill_ _name" > {user.name}
< /span> <ChevronDown size= {
1 6 }
className= "caret opacity 7 0 " / > < /button> {userMenuOpen & & ( <div id= "user menu popover " role= "menu" aria label= "Men閻? de usuario " className= "user menu" style= {
{
marginTop: 8 }
}
tabIndex= {
1 }
> <div className= "user menu_ _item user menu_ _item static" role= "presentation" > <UserIcon size= {
1 6 }
/ > <div className= "text left" > <div className= "text sm font semibold leading 4 " > {user.name}
< /div> <div className= "text [ 1 1px] subtle leading 4 " > {user.email}
< /div> < /div> < /div> <div className= "user menu_ _sep" / > <div className= "user menu_ _item" role= "menuitem" > <Palette size= {
1 6 }
/ > <span className= "text sm" >Cambiar tema< /span> <div className= "ml auto" > <ThemeSwitcher / > < /div> < /div> <div className= "user menu_ _sep" / > <button className= "user menu_ _item user menu_ _item danger" role= "menuitem" onClick = {
( )
= > setConfirmLogoutOpen(true)
}
title= "Cerrar sesi?n " > <LogOut size= {
1 6 }
/ > <span>Cerrar sesi?n < /span> < /button> < /div> )
}
< /div> {
/ * Mobile * / }
<div className= "md:hidden flex items center gap 2 " > <ThemeSwitcher className= "px 2 py 1 text xs" / > <button aria label= "Abrir men閻?" aria expanded= {mobileOpen}
onClick = {
( )
= > setMobileOpen( (v)
= > !v)
}
className= {clsx( "inline flex items center justify center h 1 1 w 1 1 rounded xl ring 1 ring border" , isNeo ? "bg bgElev neu" : "bg [var( chip)
] hover:bg [var( chip hover)
] " )
}
> <Menu size= {
2 4 }
/ > < /button> < /div> < /div> < /div> < /div> <div className= "hidden md:block" > <div className= "container 9 0 " > <nav aria label= "Secciones corporativas" className= "relative flex items center gap 1 pt 2 pb 2 overflow visible " style= {
{
WebkitMaskImage: "linear gradient(to right, transparent 0 , black 1 2px, black calc( 1 0 0 % 1 2px)
, transparent 1 0 0 % )
" , maskImage: "linear gradient(to right, transparent 0 , black 1 2px, black calc( 1 0 0 % 1 2px)
, transparent 1 0 0 % )
" , }
}
> {visibleMainTabs.map( (item)
= > ( <NavLink key= {item.to}
to= {item.to}
className= {
( {
isActive }
)
= > clsx( "tabline text sm font semibold" , isActive ? "active" : "tabline muted" )
}
onMouseEnter= {item.to = = = " /corporativo/propiedades" ? prefetchProps : undefined}
end= {Boolean (item.end)
}
> <span className= "opacity 8 0 " > {item.icon}
< /span> {item.label}
< /NavLink > )
)
}
< /nav> < /div> < /div> < /header> {
/ * MAIN * / }
<main id= "contenido" tabIndex= {
1 }
className= "flex 1 focus:outline none overflowyauto overflowxhidden" > <div className= {clsx( "container 9 0 pt 6 " , mainBottomPadding)
}
> <Outlet / > < /div> < /main> {
/ * FOOTER * / }
<footer role= "contentinfo" className= {clsx( "app footer z 4 0 border t border border/ 6 0 bg [color mix(in_srgb,var( bgElev)
_ 9 2 % ,transparent)
] backdrop blur supports [backdrop filter] :backdrop blur md" , isFormRoute ? "relative" : "sticky bottom 0 " )
}
> <div className= "container 9 0 py 3 flex flex col sm:flex row sm:items center sm:justify between gap 3 " > <div className= "flex items center gap 4 text sm" > <span className= "inline flex items center gap 2 " > <Wallet size= {
1 6 }
className= "text pink 3 0 0 " / > Producci?n total: <strong className= "text text" > {money(produccionTotal)
}
< /strong> < /span> <span className= "inline flex items center gap 2 " > <Banknote size= {
1 6 }
className= "text cyan 3 0 0 " / > Bancos: <strong className= "text text" > {money(bancosSaldo)
}
< /strong> < /span> < /div> <div className= "flex items center gap 2 " > {
[ {
to: " /corporativo" , label: "Inicio" }
, {
to: " /corporativo/transacciones" , label: "Transacciones" }
, {
to: " /corporativo/dashboards/informes" , label: "Informes" }
, ] .map( (b)
= > ( <Link key= {b.to}
to= {b.to}
className= {clsx( "rounded md px 3 py 1 . 5 text sm text text" , isNeo ? "bg bgElev neu" : "bg [var( chip)
] hover:bg [var( chip hover)
] " )
}
> {b.label}
< /Link> )
)
}
< /div> < /div> < /footer> {
/ * Confirm cerrar sesi?n * / }
<ConfirmModal open= {confirmLogoutOpen}
title= "Cerrar sesi?n " message = " ?Seguro que deseas cerrar la sesi?n ? " onCancel= {
( )
= > setConfirmLogoutOpen(false)
}
onConfirm= {async ( )
= > {
setConfirmLogoutOpen(false)
;
await doLogout( )
;
}
}
/ > < /div> )
;
}