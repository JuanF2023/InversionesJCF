// client/src/features/auth/pages/LoginPage.jsx import React, {
useState, useEffect, useCallback, useRef }
from "react" ;
import {
Trash2 , ArrowRight, LogIn, Coffee, LogOut, Building2 , CheckCircle2 }
from "lucide React" ;
import {
useNavigate, useLocation }
from "React router dom" ;
import {
formatDurationSince, formatTimeLeft }
from " @ /lib/timefmt " ;
import {
loadSession, clearSession, isTokenValid, resolveHomePath }
from " @ /lib/authSession" ;
import {
useAuthStore }
from " @ /features/auth/store/auth.store.js" ;
import {
startBreak, stopBreak }
from " @ /features/auth/api/auth.api.js" ;
import {
ConfirmModal }
from " @ /components/ui" ;
import {
getLoginModalOverride }
from " @ /styles/modals/loginModalStyles" ;
const ALLOWED _PIN_LENGTHS = [ 4 , 6 ] ;
const MAX_PIN = 6 ;
const LAST_TENANT_KEY = "jcf_last_tenant_id" ;
function safeStr (v)
{
return String(v ? ? " " )
.trim( )
;
}
function normalizeTenantOptions(list)
{
const arr = Array.isArray (list)
? list : [ ] ;
return arr .map( (t)
= > ( {
tenantId: safeStr (t.tenantId | | t. _id)
, key: safeStr (t.key)
, name: safeStr (t.name)
, type: safeStr (t.type)
, slug: safeStr (t.slug)
, }
)
)
.filter( (t)
= > t.tenantId)
;
}
function getLastTenantId( )
{
try {
return safeStr (window.localStorage.getItem (LAST_TENANT_KEY)
)
| | null;
}
catch {
return null;
}
}
function setLastTenantId(tenantId)
{
try {
const v = safeStr (tenantId)
;
if ( !v)
return;
window.localStorage.setItem (LAST_TENANT_KEY, v)
;
}
catch {
// ignore }
}
function TenantPickerModal( {
open, title, tenants , selectedTenantId, onSelect, onCancel }
)
{
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 8 0 ] flex items center justify center p 4 " > <div className= "absolute inset 0 bg black/ 6 0 " onClick = {onCancel}
/ > <div className= "relative w [ 7 2 0px] maxw [ 9 5vw] rounded 2xl border border white/ 1 0 bg slate 9 0 0 shadow 2xl" > <div className= "p 5 md:p 6 border b border white/ 1 0 " > <div className= "flex items center gap 3 " > <div className= "h 1 0 w 1 0 rounded xl bg emerald 5 0 0 / 1 5 border border emerald 5 0 0 / 2 0 flex items center justify center" > <Building2 className= "text emerald 3 0 0 " size= {
2 0 }
/ > < /div> <div className= "minw 0 " > <div className= "text lg font bold" > {title}
< /div> <div className= "text sm text slate 3 0 0 mt 0 . 5 " > Selecciona el tenant con el que deseas iniciar sesi?n . La sesi?n quedar? asociada a ese tenant. < /div> < /div> < /div> < /div> <div className= "p 5 md:p 6 " > <div className= "grid gap 3 " > {tenants .map( (t)
= > {
const active = t.tenantId = = = selectedTenantId;
return ( <button key= {t.tenantId}
onClick = {
( )
= > onSelect(t.tenantId)
}
className= {
[ "w full text left rounded 2xl border px 4 py 4 flex items center justify between gap 4 " , "transition all" , active ? "border emerald 5 0 0 / 4 0 bg emerald 5 0 0 / 1 0 " : "border white/ 1 0 bg white/ 5 hover:bg white/ 8 hover:border white/ 2 0 " , ] .join( " " )
}
> <div className= "minw 0 " > <div className= "flex items center gap 2 " > <div className= "font semibold truncate" > {t.name | | t.key | | "Tenant" }
< /div> {t.type ? ( <span className= "text [ 1 1px] px 2 py [ 2px] rounded full bg white/ 1 0 text slate 2 0 0 / 9 0 border border white/ 1 0 " > {t.type}
< /span> )
: null}
< /div> <div className= "text xs text slate 3 0 0 mt 1 " > {t.key ? <span className= "opacity 9 0 " >Key: {t.key}
< /span> : null}
{t.slug ? ( <span className= "opacity 7 0 " > {
" " }
{t.key ? " ?" : " " }
{t.slug}
< /span> )
: null}
< /div> < /div> {active ? ( <div className= "shrink 0 flex items center gap 2 text emerald 3 0 0 font semibold" > <CheckCircle2 size= {
1 8 }
/ > Seleccionado < /div> )
: ( <div className= "shrink 0 text xs text slate 3 0 0 " >Elegir< /div> )
}
< /button> )
;
}
)
}
< /div> <div className= "mt 5 flex items center justify end gap 3 " > <button className= "px 4 py 2 rounded xl bg white/ 5 hover:bg white/ 1 0 border border white/ 1 0 text slate 2 0 0 font semibold" onClick = {onCancel}
> Cancelar < /button> < /div> < /div> < /div> < /div> )
;
}
export default function LoginPage( )
{
const [pin, setPin] = useState( " " )
;
const [loadingUi, setLoadingUi] = useState(false)
;
const [onbreak , setOnBreak] = useState(false)
;
const [logoutModalOpen, setLogoutModalOpen] = useState(false)
;
const [logoutLoading, setLogoutLoading] = useState(false)
;
// = = = = = Tenant selection (enterprise)
= = = = = const [tenantModalOpen, setTenantModalOpen] = useState(false)
;
const [tenantOptions, setTenantOptions] = useState( [ ] )
;
const [selectedTenantId, setSelectedTenantId] = useState(getLastTenantId( )
)
;
const [pendingLogin, setPendingLogin] = useState(null)
;
// {
pin, intent }
// Evita loops de auto retry const autoTriedRef = useRef(new Set( )
)
;
// key = ` $ {pin}
: $ {intent}
` const navigate = useNavigate( )
;
const location = useLocation( )
;
const from = location.state? .from? .pathname | | " /corporativo" ;
const login = useAuthStore( (s)
= > s.login)
;
const verify = useAuthStore( (s)
= > s.verify)
;
const logout = useAuthStore( (s)
= > s.logout)
;
const refreshActiveSessions = useAuthStore( (s)
= > s.refreshActiveSessions )
;
const active = useAuthStore( (s)
= > s.active)
;
const pushDigit = (d)
= > !loadingUi & & pin.length < MAX_PIN & & setPin( (p)
= > p + String(d)
)
;
const handleClear = ( )
= > !loadingUi & & setPin( " " )
;
const handleBackspace = ( )
= > !loadingUi & & setPin( (p)
= > p.slice( 0 , 1 )
)
;
const canAttempt = ALLOWED _PIN_LENGTHS .includes(pin.length)
;
const showAlert = useCallback( (msg, ok = true, {
duration = 4 5 0 0 , sticky = false }
= {
}
)
= > {
try {
const container = document.getElementById ( "toast container" )
;
if ( !container)
return;
const toastEl = document.createElement( "div" )
;
toastEl .className = ` px 4 py 3 rounded lg shadow lg text white font semibold flex items center gap 3 transform transition all duration 3 0 0 $ {ok ? "bg green 6 0 0 " : "bg red 6 0 0 " }
` ;
toastEl .style.minWidth = " 2 6 0px" ;
toastEl .style.maxWidth = " 3 6 0px" ;
toastEl .style.boxSizing = "border box" ;
toastEl .style.whiteSpace = "pre line" ;
toastEl .style.opacity = " 0 " ;
toastEl .style.transform = "translateX( 2 0px)
" ;
toastEl .style.pointerEvents = "auto" ;
toastEl .textContent = msg;
container.appendChild(toastEl )
;
requestAnimationFrame ( ( )
= > {
toastEl .style.opacity = " 1 " ;
toastEl .style.transform = "translateX( 0 )
" ;
}
)
;
toastEl .addEventListener( "click" , ( )
= > {
toastEl .style.opacity = " 0 " ;
toastEl .style.transform = "translateX( 2 0px)
" ;
setTimeout( ( )
= > toastEl .remove( )
, 3 0 0 )
;
}
)
;
if ( !sticky)
{
setTimeout( ( )
= > {
toastEl .style.opacity = " 0 " ;
toastEl .style.transform = "translateX( 2 0px)
" ;
setTimeout( ( )
= > toastEl .remove( )
, 3 0 0 )
;
}
, duration)
;
}
}
catch (err)
{
console .error( "showAlert error: " , err, msg)
;
}
}
, [ ] )
;
const getLocalSession = useCallback( ( )
= > {
const session = loadSession( )
| | {
}
;
const {
token, user }
= session ;
const valid = token & & user & & isTokenValid(token)
;
return {
. . .session , valid: ! !valid }
;
}
, [ ] )
;
const getPreferredTenantId = useCallback( ( )
= > {
const t = safeStr (selectedTenantId)
;
return t ? t : null;
}
, [selectedTenantId] )
;
const syncBreakState = useCallback(async ( )
= > {
const {
token }
= loadSession( )
| | {
}
;
if ( !token | | !isTokenValid(token)
)
{
setOnBreak(false)
;
return;
}
try {
const out = await verify( )
;
const state = out? .data? .state | | out? .data? .data? .state | | out? .data? .session ? .state | | out? .data? .state;
setOnBreak(String(state | | " " )
.toLowerCase( )
= = = "break" )
;
}
catch {
setOnBreak(false)
;
}
}
, [verify] )
;
useEffect( ( )
= > {
syncBreakState ( )
;
}
, [syncBreakState ] )
;
const attemptLogin = useCallback( async ( {
pinValue, intent, tenantId = null }
)
= > {
try {
const out = await login(pinValue, intent, tenantId)
;
const tId = out? .tenantId | | out? .session ? .tenantId | | out? .raw? .tenantId | | out? .raw? .session ? .tenantId | | tenantId | | null;
if (tId)
{
setLastTenantId(tId)
;
setSelectedTenantId(tId)
;
}
const home = out? .homePath | | resolveHomePath(out? .session ? .user)
| | from;
navigate(home, {
replace : true }
)
;
return {
ok: true }
;
}
catch (e)
{
const status = e? .status | | e? .response? .status;
const server = e? .serverData | | e? .response? .data | | {
}
;
const code = server? .code | | server? .errorCode | | null;
if (status = = = 4 0 9 & & code = = = "TENANT_AMBIGUOUS" )
{
const options = normalizeTenantOptions(server? .data? .tenants | | server? .tenants | | [ ] )
;
if ( !options .length)
{
showAlert( "No se recibieron tenants para seleccionar. " , false, {
duration: 6 5 0 0 }
)
;
return {
ok: false }
;
}
setTenantOptions(options )
;
setPendingLogin( {
pin: pinValue, intent }
)
;
const last = getLastTenantId( )
;
const lastIsValid = last & & options .some( (t)
= > t.tenantId = = = last)
;
if (lastIsValid)
setSelectedTenantId(last)
;
const key = ` $ {safeStr (pinValue)
}
: $ {safeStr (intent)
}
` ;
const alreadyAutoTried = autoTriedRef.current .has(key)
;
if (lastIsValid & & !alreadyAutoTried)
{
autoTriedRef.current .add(key)
;
try {
await login(pinValue, intent, last)
;
setLastTenantId(last)
;
setSelectedTenantId(last)
;
const home = resolveHomePath(loadSession( )
? .user)
| | from;
navigate(home, {
replace : true }
)
;
return {
ok: true }
;
}
catch (e2 )
{
console .error( "Auto tenant retry failed: " , e2 )
;
}
}
setTenantModalOpen(true)
;
showAlert( "Selecciona un tenant para continuar. " , false, {
duration: 5 5 0 0 }
)
;
return {
ok: false, needsTenant: true }
;
}
if (status = = = 4 0 9 & & code = = = "SESSION _EXISTS" )
{
showAlert( 'Ya existe una sesi?n activa para este usuario . \n\nUsa el bot?n "Continuar" para entrar a esa sesi?n . ' , false, {
duration: 8 0 0 0 }
)
;
return {
ok: false }
;
}
if (status = = = 4 0 9 & & code = = = "SESSION _TENANT_MISMATCH" )
{
showAlert( "Ya existe una sesi?n activa en otro tenant. \nCierra esa sesi?n o usa el mismo tenant. " , false, {
duration: 8 0 0 0 , }
)
;
return {
ok: false }
;
}
showAlert(e? .message | | "No se pudo iniciar sesi?n . " , false, {
duration: 6 5 0 0 , sticky: true }
)
;
return {
ok: false }
;
}
}
, [login, navigate, from, showAlert] )
;
const closeTenantModal = useCallback( ( )
= > {
setTenantModalOpen(false)
;
setTenantOptions( [ ] )
;
setPendingLogin(null)
;
}
, [ ] )
;
const onPickTenant = useCallback( async (tenantId)
= > {
const tId = safeStr (tenantId)
;
if ( !tId)
return;
setSelectedTenantId(tId)
;
const pending = pendingLogin;
if ( !pending ? .pin | | !pending ? .intent)
{
closeTenantModal( )
;
showAlert( "No hay intento pendiente para continuar. " , false)
;
return;
}
setLoadingUi(true)
;
try {
closeTenantModal( )
;
setLastTenantId(tId)
;
await attemptLogin( {
pinValue: pending .pin, intent: pending .intent, tenantId: tId }
)
;
}
finally {
setLoadingUi(false)
;
}
}
, [pendingLogin, attemptLogin, closeTenantModal, showAlert] )
;
const handleEntrar = useCallback(async ( )
= > {
if (onbreak )
{
showAlert( "No puedes entrar mientras est?s en receso. Finaliza el receso primero . " , false)
;
return;
}
if ( !canAttempt)
{
showAlert( `El PIN debe tener $ {ALLOWED _PIN_LENGTHS .join( " o " )
}
d?gitos. ` , false)
;
return;
}
const {
valid }
= getLocalSession( )
;
if (valid)
{
showAlert( 'Ya tienes una sesi?n activa en este dispositivo. Usa el bot?n "Continuar" . ' , false, {
duration: 5 0 0 0 , }
)
;
return;
}
setLoadingUi(true)
;
try {
// Enterprise: no auto inyectar tenant en "enter" . // Si hay m閻?ltiples tenants , el backend debe responder TENANT_AMBIGUOUS y abrimos modal. await attemptLogin( {
pinValue: pin, intent: "enter" , tenantId: null }
)
;
}
finally {
setLoadingUi(false)
;
}
}
, [pin, canAttempt, onbreak , showAlert, attemptLogin, getLocalSession, getPreferredTenantId] )
;
const handlecontinue = useCallback(async ( )
= > {
if (loadingUi)
return;
const {
valid: hasLocal }
= getLocalSession( )
;
const hasAnyActiveSessions = Array.isArray (active.items)
& & active.items.length > 0 & & active.status ! = = "loading " & & active.status ! = = "offline " & & active.status ! = = "error" ;
if ( !hasLocal)
{
if ( !canAttempt)
{
showAlert( `El PIN debe tener $ {ALLOWED _PIN_LENGTHS .join( " o " )
}
d?gitos. ` , false)
;
return;
}
if ( !hasAnyActiveSessions)
{
showAlert( 'No hay sesi?n abierta . Presione "Entrar" para iniciar sesi?n . ' , false, {
duration: 6 5 0 0 }
)
;
return;
}
}
setLoadingUi(true)
;
try {
// Enterprise: continuar tampoco debe "inventar" tenant. // Si hay sesi?n activa, el backend debe resolverlo;
si es ambiguo , que pida selecci ?n . await attemptLogin( {
pinValue: pin, intent: "continue" , tenantId: null }
)
;
}
finally {
setLoadingUi(false)
;
}
}
, [pin, canAttempt, loadingUi, active, showAlert, attemptLogin, getLocalSession, getPreferredTenantId] )
;
const isNonCorporateEmployee = useCallback( ( )
= > {
const {
user }
= loadSession( )
| | {
}
;
if ( !user)
return false;
const roleSlugs = (user.roles | | [ ] )
.map( (r)
= > String(r.slug | | " " )
.toLowerCase( )
)
.filter(Boolean )
;
const corporateRoles = [ "owner" , "legal_representative " , "corporate_manager " ] ;
return !roleSlugs.some( (r)
= > corporateRoles .includes(r)
)
;
}
, [ ] )
;
const handleReceso = useCallback(async ( )
= > {
const {
token, user }
= loadSession( )
| | {
}
;
if ( !token | | !user)
{
showAlert( "Inicie sesi?n antes de usar receso. " , false)
;
return;
}
if ( !isNonCorporateEmployee( )
)
{
showAlert( "El receso s?lo aplica para empleados operativos, no para usuarios corporativos. " , false)
;
return;
}
try {
if ( !onbreak )
{
await startBreak( )
;
setOnBreak(true)
;
showAlert( "Receso iniciado. " )
;
}
else {
await stopBreak( )
;
setOnBreak(false)
;
showAlert( "Receso finalizado. " )
;
}
}
catch {
showAlert( "No se pudo registrar el receso. " , false)
;
}
}
, [onbreak , showAlert, isNonCorporateEmployee] )
;
const performLogout = useCallback(async ( )
= > {
setLogoutLoading(true)
;
try {
await logout( {
callBackend: true }
)
;
}
finally {
clearSession( )
;
window. _ _user = null;
setOnBreak(false)
;
showAlert( "Sesi?n cerrada . " )
;
navigate( " /login" , {
replace : true }
)
;
setLogoutLoading(false)
;
}
}
, [logout, showAlert, navigate] )
;
useEffect( ( )
= > {
let timerId = null;
let alive = true;
const load = async ( )
= > {
try {
await refreshActiveSessions ( )
;
}
catch (e)
{
if ( !alive)
return;
console .error( "refreshActiveSessions error: " , e)
;
}
}
;
load( )
;
timerId = setInterval(load, 2 0 0 0 0 )
;
return ( )
= > {
alive = false;
if (timerId )
clearInterval(timerId )
;
}
;
}
, [refreshActiveSessions ] )
;
useEffect( ( )
= > {
const onKey = (e)
= > {
if (onbreak )
{
if (e.key = = = "Enter" | | (e.key.length = = = 1 & & / \d/ .test(e.key)
)
)
{
e.preventdefault ( )
;
showAlert( "Est?s en receso. Final?zalo para continuar. " , false)
;
}
return;
}
const isDigitKey = (e.key? .length = = = 1 & & / \d/ .test(e.key)
)
| | / ^Digit[ 0 9 ] $ / .test(e.code | | " " )
| | / ^Numpad[ 0 9 ] $ / .test(e.code | | " " )
;
if (isDigitKey)
{
e.preventdefault ( )
;
if ( !loadingUi & & pin.length < MAX_PIN)
{
const d = e.key & & / \d/ .test(e.key)
? e.key : (e.code | | " " )
.replace ( / [ ^ \d] /g, " " )
;
if (d)
setPin( (p)
= > p + String(d)
.slice( 1 )
)
;
}
return;
}
if (e.key = = = "Backspace" )
{
e.preventdefault ( )
;
if ( !loadingUi)
setPin( (p)
= > p.slice( 0 , 1 )
)
;
return;
}
if (e.key = = = "Delete" | | e.key = = = "Escape" )
{
e.preventdefault ( )
;
if ( !loadingUi)
setPin( " " )
;
return;
}
if (e.key = = = "Enter" )
{
e.preventdefault ( )
;
if (ALLOWED _PIN_LENGTHS .includes(pin.length)
)
{
handleEntrar( )
;
}
else {
showAlert( `El PIN debe tener $ {ALLOWED _PIN_LENGTHS .join( " o " )
}
d?gitos. ` , false)
;
}
}
}
;
window.addEventListener( "keydown " , onKey)
;
return ( )
= > window.removeEventListener( "keydown " , onKey)
;
}
, [pin, onbreak , loadingUi, handleEntrar, showAlert] )
;
const dt = new Date( )
;
const monthShort = dt.toLocaleString ( "es ES" , {
month: "short" }
)
;
const todayText = ` $ {dt.getDate ( )
}
$ {monthShort.charAt( 0 )
.toUpperCase( )
+ monthShort.slice( 1 )
}
$ {dt.getFullYear( )
}
` ;
const local = getLocalSession( )
;
const hasLocalSession = ! !local.valid;
const hasAnyActiveSessions = Array.isArray (active.items)
& & active.items.length > 0 & & active.status ! = = "loading " & & active.status ! = = "offline " & & active.status ! = = "error" ;
const canContinue = !onbreak & & !loadingUi & & (hasLocalSession | | (hasAnyActiveSessions & & canAttempt)
)
;
const cardWidth = "w [ 1 0 0 0px] maxw [ 9 5vw] " ;
return ( <div className= "minhscreen bg gradient to r from slate 9 0 0 to gray 8 0 0 flex items center justify center text white" > <div className= {
`p 8 md:p 1 0 bg slate 8 0 0 grid gap 1 0 md:gap 1 2 $ {cardWidth}
md:grid cols [minmax( 0 , 1fr)
_ 4 2 0px] items start` }
> {
/ * IZQUIERDA * / }
<div className= "flex 1 " > <div className= "flex justify between items start" > <div> <h1 className= "text 3xl font bold" >Inversiones JCF< /h1 > <div className= "text sm text gray 3 0 0 mt 1 " > {todayText}
< /div> < /div> < /div> {onbreak & & ( <div className= "mt 4 mb 2 rounded lg bg amber 5 0 0 / 1 5 text amber 3 0 0 border border amber 5 0 0 / 3 0 px 4 py 2 text sm font semibold" > Est?s en <b>receso< /b> . Final?zalo para poder continuar o entrar. < /div> )
}
<div className= "flex justify center gap 3 mt 6 mb 3 md:mb 4 minh 5 " > {Array.from( {
length: MAX_PIN }
)
.map( ( _ , idx)
= > ( <span key= {idx}
className= {
`inline block w 1 2 h 4 rounded full $ {idx < pin.length ? "bg green 4 0 0 " : "bg gray 5 0 0 " }
transition all` }
/ > )
)
}
< /div> <div className= "text center text xs text gray 3 0 0 mt 2 mb 3 " > PIN de {ALLOWED _PIN_LENGTHS .join( " o " )
}
d?gitos < /div> <div className= "grid grid cols 3 gap 4 mt 3 mb 6 w full maxw [ 4 2 0px] mx auto" > {
[ 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 ] .map( (n)
= > ( <button key= {n}
className= "bg blue 6 0 0 hover:bg blue 7 0 0 text white font bold text 2xl rounded lg py 4 shadow disabled:opacity 6 0 " onClick = {
( )
= > pushDigit(n)
}
disabled= {loadingUi}
> {n}
< /button> )
)
}
<button className= "bg blue 6 0 0 hover:bg blue 7 0 0 text white font bold text lg rounded lg py 4 flex items center justify center gap 2 shadow disabled:opacity 6 0 " onClick = {handleClear}
disabled= {loadingUi}
> <Trash2 size= {
2 2 }
/ > Limpiar < /button> <button className= "bg blue 6 0 0 hover:bg blue 7 0 0 text white font bold text 2xl rounded lg py 4 shadow disabled:opacity 6 0 " onClick = {
( )
= > pushDigit( 0 )
}
disabled= {loadingUi}
> 0 < /button> <button className= "bg blue 6 0 0 hover:bg blue 7 0 0 text white font bold text 2xl rounded lg py 4 flex items center justify center shadow disabled:opacity 6 0 " onClick = {handleBackspace}
disabled= {loadingUi}
> ?? < /button> < /div> <button className= "w full bg green 6 0 0 hover:bg green 7 0 0 transition colors text white font bold rounded lg text lg py 4 flex items center justify center gap 2 shadow disabled:opacity 6 0 " onClick = {handlecontinue }
disabled= {
!canContinue}
> <ArrowRight size= {
2 4 }
/ > {loadingUi ? "Verificando. . . " : "Continuar" }
< /button> < /div> {
/ * DERECHA * / }
<div className= "flex flex col gap 8 " > <div className= "w full" > <div className= "flex items baseline justify between " > <div className= "font bold text lg" >Usuarios activos < /div> <div className= "text [ 1 1px] opacity 6 0 " > {active.refreshedAt ? new Date(active.refreshedAt)
.toLocaleTimeString( )
: " " }
< /div> < /div> <div className= "mt 1 border t border white/ 1 0 " / > <div className= "mt 3 spacey [ 6px] text [ 1 3px] text slate 2 0 0 / 9 0 w full maxwsm maxh 5 6 overflow auto pr 1 " > {active.status = = = "loading " & & <div className= "opacity 7 0 " >Cargando. . . < /div> }
{
(active.status = = = "online" | | active.status = = = "orphan" | | active.status = = = "empty" )
& & Array.isArray (active.items)
& & active.items.map( (u, i)
= > {
const displayName = String(u? .nombre | | " " )
.trim( )
| | "Usuario " ;
const rol = String(u? .rol | | " " )
.trim( )
;
const TWELVE_HOURS_MS = 1 2 * 6 0 * 6 0 * 1 0 0 0 ;
const startedAtMs = typeof u? .startedAt = = = "number" ? u.startedAt : u? .startedAt ? new Date(u.startedAt)
.getTime ( )
: null;
const expiresAtMsRaw = typeof u? .expiresAt = = = "number" ? u.expiresAt : u? .expiresAt ? new Date(u.expiresAt)
.getTime ( )
: null;
const effectiveExpiresAtMs = Number.isFinite(expiresAtMsRaw )
? expiresAtMsRaw : startedAtMs ? startedAtMs + TWELVE_HOURS_MS : null;
const tiempoActiva = startedAtMs ? formatDurationSince(startedAtMs)
: " " ;
const tiempoRestante = effectiveExpiresAtMs ? formatTimeLeft (effectiveExpiresAtMs)
: " " ;
const getStateInfo = ( )
= > {
if (u? .orphan)
return {
label: "Hu閼?rfano" , class: "bg amber 5 0 0 / 2 0 text amber 3 0 0 " }
;
const s = String(u? .state | | " " )
.toUpperCase( )
;
if (s = = = "BREAK" )
return {
label: "Receso" , class: "bg yellow 5 0 0 / 2 0 text yellow 3 0 0 " }
;
if (s = = = "ACTIVE" )
return {
label: "Activo" , class: "bg emerald 5 0 0 / 2 0 text emerald 3 0 0 " }
;
return {
label: "Cerr?" , class: "bg slate 5 0 0 / 2 0 text slate 3 0 0 " }
;
}
;
const stateInfo = getStateInfo( )
;
return ( <div key= {
` $ {u? .userId | | "u" }
$ {i}
` }
className= "flex items center justify between text [ 1 3px] leading tight" > <div className= "flex 1 truncate" > <span className= "font semibold" > {displayName}
< /span> {rol ? ( < > <span className= "mx 1 opacity 6 0 " > ?< /span> <span className= "opacity 8 0 text [ 1 2px] " > {rol}
< /span> < / > )
: null}
<span className= "mx 1 opacity 6 0 " > ?< /span> <span className= "opacity 8 0 text [ 1 2px] " >Activo {tiempoActiva}
< /span> <span className= "mx 1 opacity 6 0 " > ?< /span> <span className= "opacity 8 0 text [ 1 2px] " >Vence en {tiempoRestante }
< /span> < /div> <span className= {
`shrink 0 ml 2 px 2 py [ 2px] rounded full text [ 1 1px] font semibold $ {stateInfo.class}
` }
> {stateInfo.label}
< /span> < /div> )
;
}
)
}
< /div> <div className= "text xs text gray 3 0 0 mt 2 " >Ingrese su PIN para acceder < /div> < /div> <div className= "flex flex col gap 4 mt 2 items center" > <button className= "w [ 5 0 % ] bg green 6 0 0 hover:bg green 7 0 0 text white font bold py 3 rounded lg flex items center justify center gap 2 text lg shadow disabled:opacity 6 0 " onClick = {handleEntrar}
disabled= {loadingUi | | !canAttempt | | onbreak }
> <LogIn size= {
2 2 }
/ > Entrar < /button> <button className= {
`w [ 5 0 % ] $ {onbreak ? "bg amber 5 0 0 hover:bg amber 6 0 0 text black" : "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black" }
font bold py 3 rounded lg flex items center justify center gap 2 text lg shadow disabled:opacity 6 0 ` }
onClick = {handleReceso}
disabled= {loadingUi}
> <Coffee size= {
2 2 }
/ > {onbreak ? "Terminar receso" : "Receso" }
< /button> <button className= "w [ 5 0 % ] bg red 6 0 0 hover:bg red 7 0 0 text white font bold py 3 rounded lg flex items center justify center gap 2 text lg shadow disabled:opacity 6 0 " onClick = {
( )
= > setLogoutModalOpen(true)
}
disabled= {loadingUi}
> <LogOut size= {
2 2 }
/ > Salir < /button> < /div> < /div> < /div> <TenantPickerModal open= {tenantModalOpen}
title= "Selecciona un tenant" tenants = {tenantOptions}
selectedTenantId= {selectedTenantId}
onSelect= {onPickTenant}
onCancel= {closeTenantModal}
/ > <ConfirmModal open= {logoutModalOpen}
title= "Cerrar sesi?n " message = " ?Seguro que deseas cerrar la sesi?n actual? Tendr?s que ingresar tu PIN nuevamente para volver a entrar. " confirmText= "S?, cerrar sesi?n " cancelText= "Cancelar" tone= "danger" loading = {logoutLoading}
onCancel= {
( )
= > setLogoutModalOpen(false)
}
onConfirm= {async ( )
= > {
await performLogout( )
;
setLogoutModalOpen(false)
;
}
}
{
. . .getLoginModalOverride ( )
}
/ > < /div> )
;
}