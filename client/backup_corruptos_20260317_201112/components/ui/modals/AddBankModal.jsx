import React, {
useEffect, useMemo , useState }
from "react" ;
import {
X }
from "lucide React" ;
import {
useCorporativo }
from " @ /features/corporativo/store/corporativoStore.js" ;
const COUNTRIES = [ {
code: "SV" , name: "El Salvador" }
, {
code: "US" , name: "Estados Unidos" }
, {
code: "GT" , name: "Guatemala" }
, {
code: "HN" , name: "Honduras" }
, {
code: "NI" , name: "Nicaragua" }
, {
code: "CR" , name: "Costa Rica" }
, {
code: "PA" , name: "Panam?" }
, {
code: "MX" , name: "M閼?xico" }
, ] ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function AddBankModal( {
open, onClose }
)
{
const addBank = useCorporativo ( (s)
= > s.addBank )
;
const [name, setName ] = useState( " " )
;
const [country , setCountry] = useState( "SV" )
;
const [balance , setBalance] = useState( " " )
;
// reset al abrir/cerrar useEffect( ( )
= > {
if (open)
{
setName ( " " )
;
setCountry( "SV" )
;
setBalance( " " )
;
}
}
, [open] )
;
const canSave = useMemo ( ( )
= > name.trim( )
.length > 0 , [name] )
;
const onSubmit = async (e)
= > {
e? .preventdefault ? . ( )
;
if ( !canSave )
return;
const num = Number(balance )
;
const safeBalance = Number.isFinite(num)
? num : 0 ;
try {
await addBank ( {
name: name.trim( )
, country , balance : safeBalance }
)
;
onClose ? . ( )
;
}
catch (err)
{
console .error( "No se pudo crear banco" , err)
;
alert( "No se pudo crear banco" )
;
}
}
;
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 7 0 ] " > <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
aria hidden / > <div className= "relative neo card neo card deep neo card tinted p 4 md:p 6 w [ 9 2vw] maxw [ 5 2 0px] mx auto my [ 1 0vh] rounded 2xl" role= "dialog" aria modal= "true" aria labelledby= "add bank title" > <div className= "flex items center justify between mb 3 " > <h3 id= "add bank title" className= "text lg font semibold" >Agregar cuenta bancaria< /h3 > <button className= "icon btn ring 1 ring border" onClick = {onClose }
aria label= "Cerrar" > <X size= {
1 6 }
/ > < /button> < /div> <form className= "spacey 4 " onSubmit= {onSubmit}
> <div> <label className= "block text sm mb 1 " >Nombre del banco< /label> <input type= "text" className= "input" placeholder= "Banco Agr?cola, BAC, etc. " value= {name}
onChange= {
(e)
= > setName (e.target.value)
}
autoFocus required / > < /div> <div className= "grid grid cols 1 sm:grid cols 2 gap 3 " > <div> <label className= "block text sm mb 1 " >Pa?s < /label> <select className= "select" value= {country }
onChange= {
(e)
= > setCountry(e.target.value)
}
> {COUNTRIES.map( (c)
= > ( <option key= {c.code}
value= {c.code}
> {c.name}
< /option> )
)
}
< /select> < /div> <div> <label className= "block text sm mb 1 " >Saldo inicial (USD)
< /label> <input inputMode= "decimal " type= "number" step= " 0 . 0 1 " className= "input" placeholder= " 0 . 0 0 " value= {balance }
onChange= {
(e)
= > setBalance(e.target.value)
}
/ > < /div> < /div> <div className= "pt 2 flex items center justify end gap 2 " > <button type= "button" className= "btn tonal" onClick = {onClose }
>Cancelar< /button> <button type= "submit" className= {cx( "btn gradient btn action" , !canSave & & "opacity 7 0 pointer events none" )
}
disabled= {
!canSave }
> Guardar < /button> < /div> < /form> < /div> < /div> )
;
}