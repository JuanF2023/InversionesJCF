// client/src/components/movements/FieldPickerModal.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import {
X, Plus }
from "lucide React" ;
import {
listSuggestedFields, searchFieldLibrary }
from " @ /features/corporativo/access/api/fields.api" ;
export default function FieldPickerModal( {
open, onClose , typeId, // BusinessType seleccionado kind = "expense " , // "income" | "expense " selectedKeys = [ ] , // keys ya a鐢?adidas onAddFields, // (fields: [ {key,label,type,unit}
] )
= > void }
)
{
const [loading , setLoading] = useState(false)
;
const [suggested, setSuggested] = useState( [ ] )
;
const [query, setQuery] = useState( " " )
;
const [results , setResults] = useState( [ ] )
;
useEffect( ( )
= > {
if ( !open | | !typeId)
return;
setLoading(true)
;
listSuggestedFields( {
typeId, kind }
)
.then( (res)
= > setSuggested(Array.isArray (res)
? res : res? .items | | [ ] )
)
.finally ( ( )
= > setLoading(false)
)
;
}
, [open, typeId, kind] )
;
async function onSearch( )
{
if ( !query.trim( )
)
return setResults( [ ] )
;
const res = await searchFieldLibrary( {
q: query.trim( )
}
)
.catch( ( )
= > [ ] )
;
setResults(Array.isArray (res)
? res : res? .items | | [ ] )
;
}
function addField(f)
{
if (selectedKeys.includes(f.key)
)
return;
onAddFields? . ( [f] )
;
}
// Crear ad hoc (r?pido)
const [adhocName, setAdhocName] = useState( " " )
;
const [adhocType, setAdhocType] = useState( "text" )
;
const [adhocUnit, setAdhocUnit] = useState( " " )
;
function addAdhoc( )
{
const name = adhocName.trim( )
;
if ( !name)
return;
const key = name.toLowerCase( )
.normalize( "NFD" )
.replace ( / [ \u0 3 0 0 \u0 3 6f] /g, " " )
.replace ( / \s+ /g, " _ " )
;
onAddFields? . ( [ {
key, label: name, type: adhocType, unit: adhocUnit | | null, _adhoc: true }
] )
;
setAdhocName( " " )
;
setAdhocType( "text" )
;
setAdhocUnit( " " )
;
}
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 7 0 ] " > <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <div className= "absolute insetx 0 mx auto mt 1 6 w [ 9 2vw] maxw [ 7 2 0px] neo card neo card deep neo card tinted p 4 md:p 6 rounded 2xl" > <div className= "flex items center justify between " > <h3 className= "text lg font semibold" >Agregar campos< /h3 > <button className= "icon btn ring 1 ring border" onClick = {onClose }
> <X size= {
1 6 }
/ > < /button> < /div> {
/ * Sugeridos * / }
<div className= "mt 3 " > <div className= "text xs subtle mb 1 " >Sugeridos del tipo< /div> <div className= "flex flex wrap gap 2 " > {loading & & <div className= "text sm subtle" >Cargando?? /div> }
{
!loading & & suggested.map( (f)
= > ( <button key= {f.key}
className= "chip select none" disabled= {selectedKeys.includes(f.key)
}
onClick = {
( )
= > addField(f)
}
title= {
` $ {f.label}
( $ {f.type}
)
` }
> + {f.label}
< /button> )
)
}
{
!loading & & suggested.length = = = 0 & & ( <div className= "text sm subtle" >Sin sugeridos. < /div> )
}
< /div> < /div> {
/ * Buscar en biblioteca * / }
<div className= "mt 4 " > <div className= "text xs subtle mb 1 " >Buscar en biblioteca< /div> <div className= "flex gap 2 " > <input className= "control md input" placeholder= "Buscar campo?? value= {query}
onChange= {
(e)
= > setQuery(e.target.value)
}
onKeyDown= {
(e)
= > e.key = = = "Enter" & & onSearch( )
}
/ > <button className= "btn tonal" onClick = {onSearch}
>Buscar< /button> < /div> {results .length > 0 & & ( <div className= "mt 2 flex flex wrap gap 2 " > {results .map( (f)
= > ( <button key= {f.key | | f. _id}
className= "chip" disabled= {selectedKeys.includes(f.key)
}
onClick = {
( )
= > addField( {
key: f.key, label: f.name | | f.label, type: f.type, unit: f.unit }
)
}
> + {f.name | | f.label}
< /button> )
)
}
< /div> )
}
< /div> {
/ * Ad hoc r?pido * / }
<div className= "mt 5 " > <div className= "text xs subtle mb 1 " >Crear campo ad hoc (r?pido)
< /div> <div className= "grid grid cols 1 sm:grid cols 3 gap 2 " > <input className= "input control md" placeholder= "Nombre del campo" value= {adhocName}
onChange= {
(e)
= > setAdhocName(e.target.value)
}
/ > <select className= "input control md" value= {adhocType}
onChange= {
(e)
= > setAdhocType(e.target.value)
}
> <option value= "text" >Texto< /option> <option value= "number" >N閻?mero< /option> <option value= "money" >Dinero< /option> <option value= "date" >Fecha< /option> <option value= "boolean " >S?/No< /option> < /select> <input className= "input control md" placeholder= "Unidad (opcional)
" value= {adhocUnit}
onChange= {
(e)
= > setAdhocUnit(e.target.value)
}
/ > < /div> <div className= "mt 2 " > <button className= "btn gradient btn action control md btn shimmer " onClick = {addAdhoc}
> <Plus className= "btn icon" / > Agregar campo < /button> < /div> < /div> < /div> < /div> )
;
}