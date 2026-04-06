// client/src/features/corporativo/catalogos/components/ClasificacionCards.jsx import React, {
useMemo }
from "react" ;
import {
Plus, Pencil, RefreshCcw, AlertTriangle, Loader2 }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function ClasificacionCards( {
loading = false, error = null, empty = false, onReload, categoryId = " " , subcategoryId = " " , typeId = " " , categorias = [ ] , subcategorias = [ ] , tipos = [ ] , errors = {
}
, disabled = false, onChangeCategory, onChangeSubcategory, onChangeType, onCreateCategory, onEditCategory , onCreateSubcategory, onEditSubcategory, onCreateType, onEditType, }
)
{
const hasCategorias = Array.isArray (categorias)
& & categorias.length > 0 ;
const step1State = useMemo ( ( )
= > {
if (categoryId)
return {
label: "Seleccionada" , tone: "ok" }
;
return {
label: "Requerida" , tone: "warn" }
;
}
, [categoryId] )
;
const step2State = useMemo ( ( )
= > {
if ( !categoryId)
return {
label: "Bloqueada" , tone: "muted" }
;
if (subcategoryId)
return {
label: "Seleccionada" , tone: "ok" }
;
return {
label: "Requerida" , tone: "warn" }
;
}
, [categoryId, subcategoryId] )
;
const step3State = useMemo ( ( )
= > {
if ( !subcategoryId)
return {
label: "Bloqueada" , tone: "muted" }
;
if (typeId)
return {
label: "Seleccionado" , tone: "ok" }
;
return {
label: "Requerido" , tone: "warn" }
;
}
, [subcategoryId, typeId] )
;
const tonePill = (tone)
= > {
if (tone = = = "ok" )
return "ring 1 ring emerald 4 0 0 / 4 0 bg emerald 4 0 0 / 1 0 text [color:var( text)
] " ;
if (tone = = = "warn" )
return "ring 1 ring amber 4 0 0 / 4 0 bg amber 4 0 0 / 1 0 text [color:var( text)
] " ;
return "ring 1 ring [color:var( border)
] / 7 0 bg [color:var( panel)
] / 6 0 text [color:var( muted)
] " ;
}
;
const sectionBaseText = "text [color:var( text)
] " ;
const subtleText = "text [color:var( muted)
] " ;
const cardBase = "neo plate neo plate soft p 3 rounded 2xl" ;
const disabledCard = "opacity 7 0 " ;
const CardHeader = ( {
step, title, state, actions }
)
= > ( <div className= "grid grid cols [ 1fr_auto] items start gap 2 mb 2 " > <div className= "minw 0 " > <div className= "flex flex wrap items center gap 2 " > <span className= "inline flex items center justify center w 6 h 6 rounded full neo strong text xs font semibold" > {step}
< /span> <div className= "font semibold text sm" > {title}
< /div> <span className= {cx( "text [ 1 1px] px 2 py 0 . 5 rounded full whitespace nowrap" , tonePill(state.tone)
)
}
> {state.label}
< /span> < /div> < /div> <div className= "flex items center gap 1 justify self end" > {actions }
< /div> < /div> )
;
return ( <div className= {cx(sectionBaseText)
}
> {
/ * Estado superior * / }
<div className= "mb 4 " > {loading ? ( <div className= {cx( "neo plate neo plate soft p 3 rounded xl text xs flex items center gap 2 " , sectionBaseText)
}
> <Loader2 className= "w 4 h 4 animate spin opacity 8 0 " / > <span className= {subtleText}
>Cargando cat?logo?? /span> < /div> )
: error ? ( <div className= {cx( "neo plate neo plate soft p 3 rounded xl text xs" , sectionBaseText)
}
> <div className= "font medium inline flex items center gap 2 " > <AlertTriangle className= "w 4 h 4 " / > No se pudo cargar el cat?logo < /div> <div className= {cx( "mt 1 " , subtleText)
}
> {String(error)
}
< /div> <div className= "mt 2 " > <button type= "button" className= "neo btn px 3 py 2 rounded xl inline flex items center gap 2 text xs" onClick = {onReload}
disabled= {disabled}
> <RefreshCcw className= "w 4 h 4 " / > Reintentar < /button> < /div> < /div> )
: empty ? ( <div className= {cx( "neo plate neo plate soft p 3 rounded xl text xs" , sectionBaseText)
}
> <div className= "font medium inline flex items center gap 2 " > <AlertTriangle className= "w 4 h 4 " / > Cat?logo vac?o < /div> <div className= {cx( "mt 1 " , subtleText)
}
> El endpoint respondi? pero no hay registros. Revisa seed y forma del payload ( <span className= "font mono" >key/label/level/parentKey< /span> )
o auth. < /div> <div className= "mt 2 " > <button type= "button" className= "neo btn px 3 py 2 rounded xl inline flex items center gap 2 text xs" onClick = {onReload}
disabled= {disabled}
> <RefreshCcw className= "w 4 h 4 " / > Recargar cat?logo < /button> < /div> < /div> )
: null}
< /div> {
/ * 3 pasos * / }
<div className= "grid grid cols 1 lg:grid cols 3 gap 3 " > {
/ * Paso 1 * / }
<section className= {cx(cardBase, sectionBaseText)
}
> <CardHeader step= {
1 }
title= "Categor ?a " state= {step1State}
actions = {
< > <button type= "button" className= "neo btn px 2 py 2 rounded xl" onClick = {onCreateCategory}
disabled= {disabled}
title= "Agregar categor ?a " > <Plus className= "w 4 h 4 " / > < /button> <button type= "button" className= "neo btn px 2 py 2 rounded xl" onClick = {onEditCategory }
disabled= {disabled | | !categoryId}
title= "Editar categor ?a " > <Pencil className= "w 4 h 4 " / > < /button> < / > }
/ > <div className= {cx( "text xs mt 1 " , subtleText)
}
>Define el rubro principal del negocio . < /div> <select value= {categoryId}
onChange= {
(e)
= > onChangeCategory? . (e.target.value)
}
className= {cx( "neo select w full mt 2 " , errors? .categoryId ? "ring 1 ring rose 4 0 0 / 6 0 " : " " )
}
disabled= {disabled}
> <option value= " " > {hasCategorias ? "Seleccione categor ?a " : "Sin datos" }
< /option> {categorias.map( (c)
= > ( <option key= {c.id ? ? c.key}
value= {c.id ? ? c.key}
> {c.label}
< /option> )
)
}
< /select> {errors? .categoryId ? ( <div className= "text xs text rose 5 0 0 mt 1 " > {errors.categoryId}
< /div> )
: ( <div className= {cx( "text xs mt 2 " , subtleText)
}
>Puedes editar/seleccionar desde el cat?logo. < /div> )
}
< /section > {
/ * Paso 2 * / }
<section className= {cx(cardBase, sectionBaseText, !categoryId ? disabledCard : " " )
}
> <CardHeader step= {
2 }
title= "Subcategor?a " state= {step2State}
actions = {
< > <button type= "button" className= "neo btn px 2 py 2 rounded xl" onClick = {onCreateSubcategory}
disabled= {disabled | | !categoryId}
title= "Agregar subcategor?a " > <Plus className= "w 4 h 4 " / > < /button> <button type= "button" className= "neo btn px 2 py 2 rounded xl" onClick = {onEditSubcategory}
disabled= {disabled | | !subcategoryId}
title= "Editar subcategor?a " > <Pencil className= "w 4 h 4 " / > < /button> < / > }
/ > <div className= {cx( "text xs mt 1 " , subtleText)
}
> {categoryId ? "Afina el rubro dentro de la categor ?a . " : "Selecciona una categor ?a primero . " }
< /div> <select value= {subcategoryId}
onChange= {
(e)
= > onChangeSubcategory? . (e.target.value)
}
className= {cx( "neo select w full mt 2 " , errors? .subcategoryId ? "ring 1 ring rose 4 0 0 / 6 0 " : " " )
}
disabled= {disabled | | !categoryId}
> <option value= " " > {
!categoryId ? "Seleccione categor ?a primero " : subcategorias.length ? "Seleccione subcategor?a " : "Sin datos" }
< /option> {subcategorias.map( (s)
= > ( <option key= {s.id ? ? s.key}
value= {s.id ? ? s.key}
> {s.label}
< /option> )
)
}
< /select> {errors? .subcategoryId ? ( <div className= "text xs text rose 5 0 0 mt 1 " > {errors.subcategoryId}
< /div> )
: ( <div className= {cx( "text xs mt 2 " , subtleText)
}
>Selecciona el nivel anterior para desbloquear. < /div> )
}
< /section > {
/ * Paso 3 * / }
<section className= {cx(cardBase, sectionBaseText, !subcategoryId ? disabledCard : " " )
}
> <CardHeader step= {
3 }
title= "Tipo" state= {step3State}
actions = {
< > <button type= "button" className= "neo btn px 2 py 2 rounded xl" onClick = {onCreateType}
disabled= {disabled | | !subcategoryId}
title= "Agregar tipo" > <Plus className= "w 4 h 4 " / > < /button> <button type= "button" className= "neo btn px 2 py 2 rounded xl" onClick = {onEditType}
disabled= {disabled | | !typeId}
title= "Editar tipo" > <Pencil className= "w 4 h 4 " / > < /button> < / > }
/ > <div className= {cx( "text xs mt 1 " , subtleText)
}
> {subcategoryId ? "Define el tipo exacto para reglas y reportes. " : "Selecciona una subcategor?a primero . " }
< /div> <select value= {typeId}
onChange= {
(e)
= > onChangeType? . (e.target.value)
}
className= {cx( "neo select w full mt 2 " , errors? .typeId ? "ring 1 ring rose 4 0 0 / 6 0 " : " " )
}
disabled= {disabled | | !subcategoryId}
> <option value= " " > {
!subcategoryId ? "Seleccione subcategor?a primero " : tipos.length ? "Seleccione tipo" : "Sin datos" }
< /option> {tipos.map( (t)
= > ( <option key= {t.id ? ? t.key}
value= {t.id ? ? t.key}
> {t.label}
< /option> )
)
}
< /select> {errors? .typeId ? ( <div className= "text xs text rose 5 0 0 mt 1 " > {errors.typeId}
< /div> )
: ( <div className= {cx( "text xs mt 2 " , subtleText)
}
>Selecciona el nivel anterior para desbloquear. < /div> )
}
< /section > < /div> {
/ * Footer * / }
<div className= {cx( "mt 4 flex items center justify between gap 2 text xs" , subtleText)
}
> <div> Fuente: <span className= "font mono text [color:var( text)
] " >catalogos_negocios< /span> < /div> <button type= "button" className= "neo btn px 3 py 2 rounded xl inline flex items center gap 2 text xs" onClick = {onReload}
disabled= {disabled | | loading }
> <RefreshCcw className= {cx( "w 4 h 4 " , loading ? "animate spin" : " " )
}
/ > Recargar < /button> < /div> < /div> )
;
}