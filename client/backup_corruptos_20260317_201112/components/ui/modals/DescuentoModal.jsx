import React, {
useEffect, useState }
from "react" ;
import {
Scissors }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
const money = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format(Number(n | | 0 )
)
;
export default function DescuentoModal ( {
open, onClose , pendientes = [ ] , mapNeg, mapUnidad, mapPropCodigo, ymHuman , onSubmit, // (id, nuevoMonto, motivo)
= > void theme, }
)
{
const [selId, setSelId] = useState( " " )
;
const [modo, setModo ] = useState( "descuento" )
;
const [valor, setValor] = useState( " " )
;
const [motivo, setMotivo] = useState( " " )
;
useEffect( ( )
= > {
if (open)
{
setSelId(pendientes? . [ 0 ] ? .id ? ? " " )
;
setModo ( "descuento" )
;
setValor( " " )
;
setMotivo( " " )
;
}
}
, [open, pendientes] )
;
if ( !open)
return null;
const seleccionado = pendientes.find( (p)
= > p.id = = = selId)
;
const montoActual = Number(seleccionado? .ingreso | | 0 )
;
const num = Number(valor | | 0 )
;
const nuevo = modo = = = "descuento" ? Math.max( 0 , montoActual num)
: Math.max( 0 , num)
;
const renderLabel = (r)
= > {
const neg = mapNeg? .get(String(r.negocioId)
)
;
const u = mapUnidad? .get(String(r.unidadId)
)
;
const prop = mapPropCodigo? .get(String(r.propiedadId)
)
| | r.propiedadId | | " ?? ;
const per = ymHuman ? . (r.periodo | | r.mes)
| | (r.periodo | | r.mes)
;
const uni = (u? .nombre | | r.unidad | | r.unidadId | | " " )
.toString( )
;
const negN = neg? .nombre | | `Negocio $ {r.negocioId}
` ;
return ` $ {prop}
? $ {uni}
? $ {per}
?? $ {money(r.ingreso | | 0 )
}
( $ {negN}
)
` ;
}
;
return ( <div className= "fixed inset 0 z [ 2 2 0 ] " > <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div className= {cx( "absolute left 1 / 2 top 2 0 translatex 1 / 2 w [min( 6 2 0px, 9 4vw)
] p 4 md:p 5 spacey 3 " , theme? .startsWith( "neo" )
? "neo card neo card deep" : "card" )
}
> <h3 className= "text lg font semibold flex items center gap 2 " > <Scissors size= {
1 8 }
/ > Aplicar descuento < /h3 > <label className= "text sm" >Selecciona el registro pendiente< /label> <select className= "neo input h [ 3 6px] px 3 py 2 w full" value= {selId}
onChange= {
(e)
= > setSelId(e.target.value)
}
> {pendientes.map( (r)
= > ( <option key= {r.id}
value= {r.id}
> {renderLabel(r)
}
< /option> )
)
}
< /select> <div className= "text sm subtle" > Monto actual: <b> {money(montoActual)
}
< /b> < /div> <div className= "flex flex col sm:flex row gap 2 " > <select className= "neo input h [ 3 6px] px 3 py 2 sm:w [ 2 2 0px] " value= {modo}
onChange= {
(e)
= > setModo (e.target.value)
}
> <option value= "descuento" >Aplicar descuento< /option> <option value= "monto" >Fijar nuevo monto< /option> < /select> <input type= "number" className= "neo input h [ 3 6px] px 3 py 2 flex 1 " placeholder= {modo = = = "descuento" ? "Descuento" : "Nuevo monto" }
value= {valor}
onChange= {
(e)
= > setValor(e.target.value)
}
min= " 0 " step= " 0 . 0 1 " / > < /div> <input className= "neo input h [ 3 6px] px 3 py 2 w full" placeholder= "Motivo (opcional)
" value= {motivo}
onChange= {
(e)
= > setMotivo(e.target.value)
}
/ > <div className= "text sm subtle" > {modo = = = "descuento" ? "Monto final" : "Previsualizaci ?n " }
: {
" " }
<b> {money(nuevo)
}
< /b> < /div> <div className= "flex justify end gap 2 pt 2 " > <button className= "btn tonal h [ 3 6px] px 3 " onClick = {onClose }
> Cancelar < /button> <button className= "btn gradient btn action btn shimmer h [ 3 6px] px 3 " onClick = {
( )
= > onSubmit? . (selId, nuevo, motivo)
}
disabled= {
!selId | | Number.isNaN(num)
}
> Guardar < /button> < /div> < /div> < /div> )
;
}