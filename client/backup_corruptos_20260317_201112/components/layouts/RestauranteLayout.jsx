// src/components/layouts /RestauranteLayout.jsx import React, {
useEffect, useRef, useState }
from 'react' ;
import {
NavLink , Outlet }
from 'React router dom' ;
import {
Home, ListOrdered, FileBarChart, Settings, Menu as MenuIcon, X, TrendingUp, // < agregado }
from 'lucide React' ;
const RestauranteLayout = ( )
= > {
const [menuAbierto, setMenuAbierto ] = useState(false)
;
const [scrolled, setScrolled] = useState(false)
;
const mainRef = useRef(null)
;
useEffect( ( )
= > {
const el = mainRef .current ;
if ( !el)
return;
const onScroll = ( )
= > setScrolled(el.scrollTop > 0 )
;
el.addEventListener( 'scroll' , onScroll)
;
onScroll( )
;
return ( )
= > el.removeEventListener( 'scroll' , onScroll)
;
}
, [ ] )
;
useEffect( ( )
= > {
const onKey = (e)
= > e.key = = = 'Escape' & & setMenuAbierto (false)
;
window.addEventListener( 'keydown ' , onKey)
;
return ( )
= > window.removeEventListener( 'keydown ' , onKey)
;
}
, [ ] )
;
const fecha = new Intl.DateTimeFormat ( 'es ES' , {
day: ' 2 digit' , month: 'short' , year: 'numeric ' , }
)
.format(new Date( )
)
.toUpperCase( )
;
const navLinkClass = ( {
isActive }
)
= > `relative flex items center gap 2 px 4 py 2 . 5 rounded lg text base font bold border 2 transition all duration 2 0 0 ease in out $ {
isActive ? 'bg gradient to r from blue 7 0 0 to blue 6 0 0 text white border yellow 4 0 0 shadow lg scale 1 0 5 ' + 'after:absolute after: bottom 2 after:left 4 after:right 4 after:h 0 . 5 after:bg yellow 4 0 0 after:rounded full' : 'bg gradient to r from blue 6 0 0 to blue 5 0 0 text white border yellow 4 0 0 / 5 0 hover:scale 1 0 5 hover:shadow md' }
` ;
const cerrarMenu = ( )
= > setMenuAbierto (false)
;
return ( <div className= "flex flex col minhscreen bg slate 9 0 0 " > {
/ * NAVBAR SUPERIOR * / }
<header className= {
`sticky top 0 z 5 0 border b border yellow 4 0 0 / 7 0 bg slate 8 0 0 / 8 5 backdrop blur supports [backdrop filter] :bg slate 8 0 0 / 7 0 $ {scrolled ? 'shadow md' : 'shadow none' }
` }
> <div className= "maxwscreen 2xl mx auto px 4 py 3 md:px 6 " > <div className= "flex flex col md:flex row md:items center md:justify between " > {
/ * T閼?TULO + FECHA + HAMBURGUESA * / }
<div className= "flex items center justify between md:justify start w full" > <div> <h1 className= "text 3xl font bold text yellow 4 0 0 " >Sistema de Restaurante< /h1 > <p className= "text lg text blue 2 0 0 " >Sucursal Chaparral ? {fecha}
< /p> < /div> <button onClick = {
( )
= > setMenuAbierto ( (v)
= > !v)
}
className= "md:hidden text white p 2 " aria label= "Abrir men閻?" aria expanded= {menuAbierto}
aria controls= "main nav" > {menuAbierto ? <X size= {
2 8 }
/ > : <MenuIcon size= {
2 8 }
/ > }
< /button> < /div> {
/ * NAV ENLACES * / }
<nav id= "main nav" className= {
`flex flex col md:flex row gap 2 mt 3 md:mt 0 transition all duration 3 0 0 $ {menuAbierto ? 'flex' : 'hidden md:flex' }
` }
> <NavLink to= " /home" className= {navLinkClass}
onClick = {cerrarMenu}
> <Home size= {
2 0 }
/ > Inicio < /NavLink > <NavLink to= " /ordenes " className= {navLinkClass}
onClick = {cerrarMenu}
> <ListOrdered size= {
2 0 }
/ > 閼?rdenes < /NavLink > {
/ * Reportes (reemplaza al antiguo 'Men閻?' )
* / }
<NavLink to= " /reportes salida" className= {navLinkClass}
onClick = {cerrarMenu}
> <TrendingUp size= {
2 0 }
/ > Reportes < /NavLink > <NavLink to= " /funciones" className= {navLinkClass}
onClick = {cerrarMenu}
> <Settings size= {
2 0 }
/ > Funciones < /NavLink > {
/ * KPI/Informes generales * / }
<NavLink to= " /informes" className= {navLinkClass}
onClick = {cerrarMenu}
> <FileBarChart size= {
2 0 }
/ > Informes < /NavLink > < /nav> < /div> < /div> < /header> {
/ * CONTENIDO PRINCIPAL * / }
<main ref= {mainRef }
className= "flex 1 minh 0 overflowyauto px 3 md:px 6 py 4 pb 2 4 flex flex col" > <div className= "w [ 9 0 % ] mx auto" > <Outlet / > < /div> < /main> {
/ * FOOTER * / }
<footer className= "fixed bottom 0 insetx 0 z 5 0 bg black/ 8 5 backdrop blur border t border yellow 5 0 0 / 7 0 " > <div className= "maxwscreen 2xl mx auto px 4 md:px 8 py 3 text center text slate 2 0 0 text sm md:text base" > Restaurante 0 1 ? <span className= "text white" >Sucursal Chaparral< /span> ? Dispositivo{
' ' }
<span className= "text yellow 4 0 0 font semibold" > # 1 < /span> ?{
' ' }
<span className= "text yellow 4 0 0 " >v1 . 0 . 0 < /span> < /div> < /footer> < /div> )
;
}
;
export default RestauranteLayout;