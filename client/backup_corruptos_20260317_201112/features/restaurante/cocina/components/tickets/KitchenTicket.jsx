import React, {
useMemo }
from "react" ;
import {
buildKitchenSummary }
from " . . / . . / . . /utils/aggregateKitchen.js" ;
export default function KitchenTicket( {
orden = [ ] , meta = {
restaurante: "Mi Restaurante" , mesero: " ?? , tipoOrden: "comerAqui" , mesa: null, orderNumber: null }
, onClose = ( )
= > {
}
, compact = true, // puedes cambiar a false si prefieres tipograf?a normal }
)
{
// Fecha/hora local const now = useMemo ( ( )
= > new Date( )
, [ ] )
;
const fecha = now.toLocaleDateString( )
;
const hora = now.toLocaleTimeString( [ ] , {
hour: " 2 digit" , minute: " 2 digit" }
)
;
// Res閻?menes (platos + componentes)
const {
resumenPlatos, resumenComponentes }
= buildKitchenSummary(orden)
;
// Detalle por persona const porPersona = useMemo ( ( )
= > {
const res = {
}
;
orden.forEach ( (item)
= > {
const p = item.persona | | 1 ;
if ( !res[p] )
res[p] = [ ] ;
res[p] .push(item)
;
}
)
;
return Object.entries (res)
.sort( ( [a] , [b] )
= > Number(a)
Number(b)
)
;
}
, [orden] )
;
const handlePrint = ( )
= > window.print( )
;
return ( < > {
/ * Regla: imprimir solo el ticket * / }
<style> {
` @media print {
body * {
visibility: hidden;
}
#kitchen ticket, #kitchen ticket * {
visibility: visible ;
}
#kitchen ticket {
position: absolute;
left: 0 ;
top: 0 ;
width: 1 0 0 % ;
}
.person block {
break inside: avoid;
page break inside: avoid;
}
.ticket compact {
font size: 1 2px;
line height: 1 . 2 5 ;
}
}
` }
< /style> <div className= {compact ? "ticket compact spacey 3 " : "spacey 3 " }
> {
/ * Encabezado * / }
<div className= "flex items start justify between " > <div> <div className= "text white text lg font semibold" > {meta.restaurante}
< /div> {meta.orderNumber ? ( <div className= "text white font bold" >Orden # {meta.orderNumber}
< /div> )
: null}
<div className= "text slate 3 0 0 text xs" > {fecha}
? {hora}
??Mesero: <span className= "font medium" > {meta.mesero}
< /span> < /div> <div className= "text slate 3 0 0 text xs" > Tipo: {meta.tipoOrden}
{meta.tipoOrden = = = "comerAqui" & & meta.mesa ? ` ? Mesa $ {meta.mesa}
` : " " }
< /div> < /div> <div className= "text right text slate 3 0 0 text xs" > <div>Ticket de cocina< /div> <div>Items: {orden.length}
< /div> < /div> < /div> {
/ * Resumen global (para arrancar cocina)
* / }
<div className= "rounded lg border border slate 7 0 0 bg slate 8 0 0 p 3 " > <div className= "text yellow 4 0 0 font semibold text sm mb 2 " >Resumen (totales )
< /div> {resumenPlatos.length = = = 0 ? ( <div className= "text slate 4 0 0 text sm" >Sin productos. < /div> )
: ( <ul className= "spacey 1 " > {resumenPlatos.map( (r, idx)
= > ( <li key= {idx}
className= "text slate 1 0 0 text sm flex" > <span className= "w 1 0 font bold text green 4 0 0 " > {r.count}
閼?< /span> <div> <div className= "font medium" > {r.nombre}
< /div> {r.mods & & <div className= "text xs text slate 3 0 0 " > {r.mods}
< /div> }
< /div> < /li> )
)
}
< /ul> )
}
< /div> {
/ * Sumatoria de componentes / porciones * / }
{resumenComponentes.length > 0 & & ( <div className= "rounded lg border border slate 7 0 0 bg slate 8 0 0 p 3 " > <div className= "text yellow 4 0 0 font semibold text sm mb 2 " >Sumatoria de componentes< /div> <ul className= "grid grid cols 2 gapy 1 text slate 1 0 0 text sm" > {resumenComponentes.map( (c, i)
= > ( <li key= {i}
className= "flex justify between " > <span> {c.nombre}
< /span> <span className= "font bold" > {c.count}
< /span> < /li> )
)
}
< /ul> < /div> )
}
{
/ * Detalle por persona * / }
<div className= "rounded lg border border slate 7 0 0 bg slate 8 0 0 p 3 " > <div className= "text yellow 4 0 0 font semibold text sm mb 2 " >Detalle por persona < /div> <div className= "spacey 2 " > {porPersona.map( ( [persona , items] )
= > ( <div key= {persona }
className= "person block bg slate 9 0 0 / 6 0 rounded p 2 border border slate 7 0 0 " > <div className= "text sky 3 0 0 text xs font semibold mb 1 " >Persona {persona }
< /div> <ul className= "spacey 1 " > {items.map( (it, i)
= > ( <li key= {i}
className= "text slate 1 0 0 text sm" > <div className= "flex justify between " > <span className= "font medium" > {it.cantidad & & it.cantidad > 1 ? ` $ {it.cantidad}
閼? ` : " " }
{it.nombre}
< /span> < /div> {
/ * Si m?s adelante quieres mostrar un resumen corto por persona , puedes traer una l?nea con sus mods aqu? * / }
< /li> )
)
}
< /ul> < /div> )
)
}
< /div> < /div> {
/ * Footer acciones (no se imprime )
* / }
<div className= "flex justify end gap 2 print:hidden" > <button onClick = {onClose }
className= "px 4 py 2 rounded lg border border slate 6 0 0 text slate 2 0 0 bg slate 8 0 0 " > Cerrar < /button> <button onClick = {handlePrint}
className= "px 4 py 2 rounded lg bg emerald 6 0 0 hover:bg emerald 7 0 0 text white" > Imprimir < /button> < /div> < /div> < / > )
;
}