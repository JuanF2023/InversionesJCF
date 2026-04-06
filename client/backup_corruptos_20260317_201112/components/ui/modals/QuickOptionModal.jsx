import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
Lightbulb }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function QuickOptionModal( {
open, onClose , title = "Agregar opci?n " , label = "Opci?n " , placeholder = "Escribe aqu??? , existing = [ ] , // opciones existentes para evitar duplicados onAdd, // (valor: string)
helper = null, // JSX o texto opcional examples = [ ] , // [ 'Ejemplo A' , 'Ejemplo B' ] }
)
{
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
const [value, setValue] = useState( " " )
;
useEffect( ( )
= > {
if (open)
setValue( " " )
;
}
, [open] )
;
const trimmed = value.trim( )
;
const exists = useMemo ( ( )
= > {
const v = trimmed .toLowerCase( )
;
return (existing | | [ ] )
.some(e = > String(e)
.trim( )
.toLowerCase( )
= = = v)
;
}
, [existing, trimmed ] )
;
const canSave = trimmed .length > = 2 & & !exists;
const handleAdd = ( )
= > {
if ( !canSave )
return;
onAdd? . (trimmed )
;
onClose ? . ( )
;
}
;
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 3 0 0 ] " > <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div className= {cx( "absolute left 1 / 2 top 1 / 2 translatex 1 / 2 translatey 1 / 2 " , "w [min( 5 6 0px, 9 2vw)
] maxh [ 8 6vh] overflow auto p 4 md:p 5 " , isNeo ? "neo card" : "card" )
}
role= "dialog" aria modal= "true" aria labelledby= "addopt title" onKeyDown= {
(e)
= > {
if (e.key = = = "Escape" )
onClose ? . ( )
;
if (e.key = = = "Enter" )
handleAdd( )
;
}
}
> <h3 id= "addopt title" className= "text lg font semibold mb 3 " > {title}
< /h3 > {helper & & ( <div className= {cx( "mb 3 rounded xl p 3 text sm" , isNeo ? "neo plate" : "bg [var( chip)
] " )
}
> <div className= "flex items start gap 2 " > <Lightbulb size= {
1 8 }
className= "mt 0 . 5 opacity 8 0 " / > <div className= "leading relaxed " > {helper}
< /div> < /div> {Array.isArray (examples)
& & examples.length > 0 & & ( < > <div className= "mt 2 text xs subtle" >Sugerencias r?pidas: < /div> <div className= "mt 1 flex flex wrap gap 1 . 5 " > {examples.map( (ex)
= > ( <button key= {ex}
type= "button" onClick = {
( )
= > setValue(ex)
}
className= {cx( "px 2 py 1 rounded full text xs" , isNeo ? "neo plate" : "bg [var( panel)
] border border [var( border)
] " )
}
title= {
`Usar ?? {ex}
?濠?}
> {ex}
< /button> )
)
}
< /div> < / > )
}
< /div> )
}
<label className= "block text xs subtle mb 1 " > {label}
< /label> <input autoFocus className= "neo input w full px 3 py 2 " placeholder= {placeholder}
value= {value}
onChange= {
(e)
= > setValue(e.target.value)
}
/ > {exists & & <p className= "mt 1 text xs text amber 6 0 0 " >Ya existe una opci?n con ese nombre. < /p> }
{
!exists & & trimmed .length > 0 & & trimmed .length < 2 & & ( <p className= "mt 1 text xs subtle" >Escribe al menos 2 caracteres. < /p> )
}
<div className= "mt 4 flex items center justify end gap 2 " > <button onClick = {onClose }
className= {cx(isNeo ? "neo plate px 4 py 2 " : "rounded lg px 4 py 2 bg [var( chip)
] hover:bg [var( chip hover)
] " )
}
> Cancelar < /button> <button onClick = {handleAdd}
disabled= {
!canSave }
className= {cx( "btn gradient btn action" , !canSave & & "opacity 6 0 cursor not allowed " )
}
> Agregar < /button> < /div> < /div> < /div> )
;
}