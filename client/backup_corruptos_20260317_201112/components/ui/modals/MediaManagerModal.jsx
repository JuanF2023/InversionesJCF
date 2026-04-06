import React, {
useEffect, useMemo , useRef, useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
X, Trash2 , Upload }
from "lucide React" ;
import {
mediaSrc }
from " /src/utils/media.js" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function MediaManagerModal( {
open, onClose , propiedadId = null, // si es null = > modo "staging " (creaci?n )
initialItems = [ ] , // [ {
id, url, kind: 'image' | 'video' , name? , posterUrl? }
, . . . ] onSaved , // (items)
= > void (modo edici?n )
onPendingChange, // (File[ ] )
= > void (modo creaci?n )
}
)
{
const {
theme }
= useTheme( )
;
const fileRef = useRef(null)
;
// edici?n const [items, setItems] = useState( [ ] )
;
const [loading , setLoading] = useState(false)
;
// staging (creaci?n )
const [pending , setPending] = useState( [ ] )
;
// File[ ] const isEdit = Boolean (propiedadId)
;
useEffect( ( )
= > {
if ( !open)
return;
setItems(Array.isArray (initialItems)
? initialItems : [ ] )
;
setPending( [ ] )
;
}
, [open, initialItems] )
;
const thumbs = useMemo ( ( )
= > {
if (isEdit)
return items;
return pending .map( (f)
= > ( {
url: URL.createObjectURL(f)
, kind: f.type? .startsWith( "video" )
? "video" : "image" , name: f.name, }
)
)
;
}
, [isEdit, items, pending ] )
;
const pickFiles = ( )
= > fileRef .current ? .click( )
;
const onChooseFiles = async (e)
= > {
const files = Array.from(e.target.files | | [ ] )
;
if (files.length = = = 0 )
return;
if ( !isEdit)
{
const next = [ . . .pending , . . .files] ;
setPending(next)
;
onPendingChange? . (next)
;
return;
}
// Subir a servidor en modo edici?n setLoading(true)
;
try {
const fd = new FormData( )
;
files.forEach ( (f)
= > fd.append( "files" , f)
)
;
const r = await fetch( ` /api/properties/ $ {propiedadId}
/media` , {
method: "POST" , body: fd, }
)
;
const data = await r.json( )
.catch( ( )
= > ( {
}
)
)
;
if (r.ok & & (data.items | | data.ok)
)
{
setItems( (prev)
= > [ . . .prev, . . . (data.items | | [ ] )
] )
;
onSaved ? . ( (prevItems)
= > [ . . .prevItems, . . . (data.items | | [ ] )
] )
;
}
else {
alert(data.error | | "No se pudo subir la multimedia. " )
;
}
}
catch (err)
{
console .error(err)
;
alert( "Error al subir multimedia. " )
;
}
finally {
setLoading(false)
;
// limpia input para permitir re seleccionar el mismo archivo if (fileRef .current )
fileRef .current .value = " " ;
}
}
;
const removeItem = async (idx)
= > {
if ( !isEdit)
{
const next = [ . . .pending ] ;
next.splice(idx, 1 )
;
setPending(next)
;
onPendingChange? . (next)
;
return;
}
const item = items[idx] ;
if ( !item)
return;
setLoading(true)
;
try {
const r = await fetch( ` /api/properties/ $ {propiedadId}
/media/ $ {item.id | | item. _id}
` , {
method: "DELETE" , }
)
;
const data = await r.json( )
.catch( ( )
= > ( {
}
)
)
;
if (r.ok & & (data.items | | data.ok)
)
{
setItems(data.items | | [ ] )
;
onSaved ? . (data.items | | [ ] )
;
}
else {
// si el backend no devuelve items, retirar localmente const next = [ . . .items] ;
next.splice(idx, 1 )
;
setItems(next)
;
onSaved ? . (next)
;
}
}
catch (e)
{
console .error(e)
;
alert( "Error eliminando el archivo . " )
;
}
finally {
setLoading(false)
;
}
}
;
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 4 8 0 ] " data theme= {theme}
> <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div role= "dialog" aria modal= "true" className= {cx( "absolute left 1 / 2 top 1 0 translatex 1 / 2 w [min( 9 8 0px, 9 5vw)
] maxh [ 9 0vh] overflow auto" , "neo card neo card deep neo card tinted p 4 md:p 6 " )
}
> <div className= "flex items center justify between mb 3 " > <h3 className= "text lg font semibold" >Multimedia de la propiedad< /h3 > <button className= "neo plate px 3 py 1 . 5 " onClick = {onClose }
> <X size= {
1 6 }
/ > Cerrar < /button> < /div> <div className= "flex items center gap 2 mb 3 " > <input ref= {fileRef }
className= "hidden" type= "file" accept= "image/ * ,video/ * " multiple onChange= {onChooseFiles}
/ > <button type= "button" onClick = {pickFiles}
className= "btn gradient btn action control md" disabled= {loading }
title= "Agregar fotos o videos" > <Upload className= "btn icon" / > {isEdit ? "Subir archivos" : "A鐢?adir archivos" }
< /button> {loading & & <span className= "text xs subtle" >Procesando?? /span> }
< /div> {thumbs.length = = = 0 ? ( <div className= "text sm subtle" >A閻?n no hay archivos. < /div> )
: ( <div className= "grid grid cols 2 md:grid cols 4 gap 3 " > {thumbs.map( (m, i)
= > ( <div key= {i}
className= "relative rounded lg overflow hidden ring 1 ring border" > {m.kind = = = "video" ? ( <video src= {mediaSrc(m.url)
}
className= "w full h 3 2 object cover" poster= {m.posterUrl | | undefined}
muted preload = "metadata" / > )
: ( <img src= {mediaSrc(m.url)
}
className= "w full h 3 2 object cover" alt= {m.name | | `m $ {i}
` }
loading = "lazy" decoding= "async" onError = {
(e)
= > {
e.currentTarget.style.opacity = 0 . 4 ;
}
}
/ > )
}
<button type= "button" className= "absolute right 2 top 2 rounded full bg black/ 5 0 text white p 1 " title= "Eliminar" onClick = {
( )
= > removeItem(i)
}
> <Trash2 size= {
1 4 }
/ > < /button> < /div> )
)
}
< /div> )
}
<div className= "mt 4 flex items center justify end" > <button className= "neo plate px 4 py 2 " onClick = {
( )
= > {
if (isEdit)
onSaved ? . (items)
;
onClose ? . ( )
;
}
}
> Hecho < /button> < /div> < /div> < /div> )
;
}