import React, {
useState }
from "react" ;
import {
Pencil, Info }
from "lucide React" ;
const ImpuestosForm = ( )
= > {
const [editando, setEditando] = useState(false)
;
const [mostrarGuardado, setMostrarGuardado] = useState(false)
;
const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
;
const [config, setConfig] = useState( {
propina : 0 , activarImpuesto: false, impuesto: 1 3 , }
)
;
const [valoresActuales, setValoresActuales] = useState( {
propina : 0 , activarImpuesto: true, impuesto: 1 3 , }
)
;
const handleChange = (field, value)
= > {
setConfig( (prev)
= > ( {
. . .prev, [field] : value }
)
)
;
}
;
const handleGuardar = ( )
= > {
setMostrarConfirmacion(true)
;
}
;
const confirmarGuardar = ( )
= > {
setValoresActuales(config)
;
setMostrarGuardado(true)
;
setEditando(false)
;
setMostrarConfirmacion(false)
;
setTimeout( ( )
= > setMostrarGuardado(false)
, 3 0 0 0 )
;
}
;
const cancelarGuardar = ( )
= > {
setMostrarConfirmacion(false)
;
}
;
const cancelarCambios = ( )
= > {
setConfig(valoresActuales)
;
setEditando(false)
;
}
;
const cambiosPendientes = JSON.stringify(config)
! = = JSON.stringify(valoresActuales)
;
return ( <div className= "grid grid cols 1 md:grid cols 2 gap 6 mt 8 " > {
/ * Panel de configuraci璐?n * / }
<div className= "maxwmd mx auto bg [ # 0e1 3 2 0 ] p 6 border border yellow 4 0 0 rounded xl text white shadow md" > <h2 className= "text 2xl font bold text yellow 4 0 0 mb 4 flex items center gap 2 " > <span> 棣?鎸?< /span> Propinas e Impuestos < /h2 > {
/ * BLOQUE AGRUPADO: PROPINA * / }
<div className= "bg [ # 1 1 1 8 2 7 ] p 4 rounded lg border border yellow 4 0 0 spacey 4 mb 6 " > <div className= "flex justify between items center" > <label className= "font medium flex items center gap 1 " > Seleccionar propina sugerida <Info size= {
1 4 }
title= "Esta propina se sugiere en el recibo, no se aplica autom璋?ticamente" / > < /label> {
!editando & & ( <button onClick = {
( )
= > setEditando(true)
}
className= "text yellow 4 0 0 hover:text yellow 3 0 0 " > <Pencil size= {
1 8 }
/ > < /button> )
}
< /div> <div> <label className= "text sm font semibold block mb 1 " >Porcentaje: < /label> <div className= "flex flex wrap gap 2 " > {
[ 1 0 , 1 5 , 2 0 ] .map( (percent )
= > ( <button key= {percent }
disabled= {
!editando}
onClick = {
( )
= > handleChange( "propina " , percent )
}
className= {
`px 4 py 2 rounded xl font semibold transition border shadow sm $ {
config.propina = = = percent ? "bg yellow 4 0 0 text black border yellow 5 0 0 ring 2 ring yellow 3 0 0 " : "bg white text black border gray 3 0 0 hover:bg yellow 1 0 0 " }
` }
> {percent }
% < /button> )
)
}
< /div> < /div> <div> <label className= "text sm font semibold block mb 1 " >Monto r璋?pido: < /label> <div className= "flex flex wrap gap 2 " > {
[ 0 . 5 , 1 , 2 , 3 ] .map( (valor)
= > ( <button key= {valor}
disabled= {
!editando}
onClick = {
( )
= > handleChange( "propina " , valor)
}
className= {
`px 4 py 2 rounded xl font semibold transition border shadow sm $ {
config.propina = = = valor ? "bg yellow 4 0 0 text black border yellow 5 0 0 ring 2 ring yellow 3 0 0 " : "bg white text black border gray 3 0 0 hover:bg yellow 1 0 0 " }
` }
> $ {valor.toFixed ( 2 )
}
< /button> )
)
}
< /div> < /div> <div className= "text center mt 2 " > <button disabled= {
!editando}
onClick = {
( )
= > handleChange( "propina " , 0 )
}
className= {
`px 6 py 2 rounded xl font semibold transition border shadow sm $ {
config.propina = = = 0 ? "bg yellow 4 0 0 text black border yellow 5 0 0 ring 2 ring yellow 3 0 0 " : "bg white text black border gray 3 0 0 hover:bg yellow 1 0 0 " }
` }
> Sin propina < /button> < /div> < /div> {
/ * BLOQUE AGRUPADO: IMPUESTO * / }
<div className= "bg [ # 1 1 1 8 2 7 ] p 4 rounded lg border border yellow 4 0 0 spacey 4 mb 6 " > <div className= "flex justify between items center" > <label className= "font medium flex items center gap 1 " > Configuraci璐?n de impuesto por servicio <Info size= {
1 4 }
title= "El impuesto se aplicar 璋? sobre el total de la orden. " / > < /label> {
!editando & & ( <button onClick = {
( )
= > setEditando(true)
}
className= "text yellow 4 0 0 hover:text yellow 3 0 0 " > <Pencil size= {
1 8 }
/ > < /button> )
}
< /div> <div className= "flex items center gap 2 " > <input type= "checkbox" checked = {config.activarImpuesto}
disabled= {
!editando}
onChange= {
(e)
= > handleChange( "activarImpuesto" , e.target.checked )
}
className= "form checkbox h 4 w 4 text yellow 5 0 0 " / > <input type= "number" disabled= {
!editando | | !config.activarImpuesto}
value= {config.impuesto}
onChange= {
(e)
= > handleChange( "impuesto" , e.target.value)
}
className= "px 3 py 1 bg green 1 0 0 text black rounded md w 2 4 " / > <span> % < /span> < /div> <div className= "text center mt 2 " > <button disabled= {
!editando}
onClick = {
( )
= > setConfig( (prev)
= > ( {
. . .prev, activarImpuesto: false, impuesto: 0 , }
)
)
}
className= {
`px 6 py 2 rounded xl font semibold transition border shadow sm $ {
!config.activarImpuesto ? "bg yellow 4 0 0 text black border yellow 5 0 0 ring 2 ring yellow 3 0 0 " : "bg white text black border gray 3 0 0 hover:bg yellow 1 0 0 " }
` }
> Sin impuesto < /button> < /div> < /div> {
/ * GUARDAR + CANCELAR * / }
{editando & & !mostrarConfirmacion & & ( <div className= "flex gap 3 mt 6 " > <button onClick = {handleGuardar}
disabled= {
!cambiosPendientes}
className= {
`px 6 py 2 font semibold rounded md transition $ {
cambiosPendientes ? "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black" : "bg gray 3 0 0 text gray 5 0 0 cursor not allowed " }
` }
> Guardar configuraci璐?n < /button> <button onClick = {cancelarCambios}
className= "px 6 py 2 font semibold rounded md bg gray 5 0 0 hover:bg gray 6 0 0 text white transition" > Cancelar < /button> < /div> )
}
{
/ * CONFIRMACI鑴?N * / }
{mostrarConfirmacion & & ( <div className= "bg yellow 1 0 0 text yellow 9 0 0 border border yellow 4 0 0 p 3 rounded md mt 4 " > <p className= "font medium" > 椹?Est璋?s seguro de que deseas guardar esta configuraci璐?n ? < /p> <p className= "text sm mt 1 " >Esto modificar璋? los c璋?lculos de las facturas en el sistema . < /p> <div className= "mt 3 flex gap 3 " > <button onClick = {confirmarGuardar}
className= "bg green 5 0 0 hover:bg green 6 0 0 text white px 4 py 1 rounded md" > Confirmar < /button> <button onClick = {cancelarGuardar}
className= "bg red 5 0 0 hover:bg red 6 0 0 text white px 4 py 1 rounded md" > Cancelar < /button> < /div> < /div> )
}
{mostrarGuardado & & ( <p className= "mt 2 text green 4 0 0 text sm font medium" > 閴??Cambios guardados correctamente < /p> )
}
< /div> {
/ * PANEL VALORES ACTUALES * / }
<div className= "bg [ # 0e1 3 2 0 ] p 6 border border yellow 4 0 0 rounded xl text white shadow md" > <h3 className= "text xl font bold text yellow 3 0 0 mb 4 " >Valores actuales< /h3 > <p className= "mb 2 " > Propina seleccionada: {
" " }
{valoresActuales.propina > 0 ? ( valoresActuales.propina < = 1 ? ( ` $ $ {valoresActuales.propina .toFixed ( 2 )
}
` )
: ( ` $ {valoresActuales.propina }
% ` )
)
: ( <span className= "text red 4 0 0 " > 閴??No< /span> )
}
< /p> <p> Impuesto por servicio: {
" " }
{valoresActuales.activarImpuesto ? ( <span className= "text green 4 0 0 " > 閴??S閾? ( {valoresActuales.impuesto}
% )
< /span> )
: ( <span className= "text red 4 0 0 " > 閴??No< /span> )
}
< /p> < /div> < /div> )
;
}
;
export default ImpuestosForm;