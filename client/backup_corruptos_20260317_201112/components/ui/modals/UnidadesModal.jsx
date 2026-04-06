import React, {
useEffect, useMemo , useState }
from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import {
useCorporativo }
from " @ /features/corporativo/store/corporativoStore.js" ;
import {
X, Plus, PauseCircle, PlayCircle, Save }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
function UnidadesModal( {
open, onClose , propiedadId }
)
{
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
const propiedades = useCorporativo ( (s)
= > s.propiedades)
| | [ ] ;
const unidades = useCorporativo ( (s)
= > s.unidades)
| | [ ] ;
const negocios = useCorporativo ( (s)
= > s.negocios)
| | [ ] ;
const addUnidad = useCorporativo ( (s)
= > s.addUnidad)
;
const updateUnidad = useCorporativo ( (s)
= > s.updateUnidad)
;
const setUnidadVacante = useCorporativo ( (s)
= > s.setUnidadVacante)
;
const setUnidadActiva = useCorporativo ( (s)
= > s.setUnidadActiva)
;
const [localFilterProp, setLocalFilterProp] = useState(String(propiedadId | | " " )
)
;
useEffect( ( )
= > {
setLocalFilterProp(String(propiedadId | | " " )
)
;
}
, [propiedadId] )
;
const [form, setForm ] = useState( {
nombre: " " , tipo: "apartamento" , diaPago : 2 8 , rentaMensual: 0 , negocioId: " " }
)
;
const propiedad = useMemo ( ( )
= > propiedades.find( (p)
= > String(p.id)
= = = String(localFilterProp)
)
, [propiedades, localFilterProp] )
;
const unidadesAll = useMemo ( ( )
= > {
if (localFilterProp)
return unidades.filter( (u)
= > String(u.propiedadId)
= = = String(localFilterProp)
)
;
return unidades;
}
, [unidades, localFilterProp] )
;
const sorted = useMemo ( ( )
= > [ . . .unidadesAll] .sort( (a, b)
= > String(a.nombre | | " " )
.localeCompare(String(b.nombre | | " " )
)
)
, [unidadesAll] )
;
const negociosAlquileres = useMemo ( ( )
= > {
const pid = String(localFilterProp | | " " )
;
return negocios.filter( (n)
= > String(n.propiedadId)
= = = pid & & String(n.tipo)
.toLowerCase( )
= = = "alquileres" )
;
}
, [negocios, localFilterProp] )
;
const onAdd = ( )
= > {
const nombre = form.nombre.trim( )
;
if ( !nombre)
return;
const payload = {
propiedadId: Number(localFilterProp | | propiedadId | | propiedades[ 0 ] ? .id)
, nombre, tipo: form.tipo, diaPago : Number(form.diaPago | | 1 )
, rentaMensual: Number(form.rentaMensual | | 0 )
, estado: "activa" , . . . (form.negocioId ? {
negocioId: form.negocioId }
: {
}
)
}
;
addUnidad(payload )
;
setForm ( {
nombre: " " , tipo: "apartamento" , diaPago : 2 8 , rentaMensual: 0 , negocioId: " " }
)
;
}
;
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 4 2 0 ] " data theme= {theme}
> <div className= "absolute inset 0 bg black/ 5 0 " onClick = {onClose }
/ > <section className= {cx( "absolute left 1 / 2 top 6 translatex 1 / 2 w [min( 1 0 4 0px, 9 5vw)
] maxh [ 8 8vh] overflow auto rounded 2xl" , isNeo ? "neo card neo card deep" : "card" )
}
role= "dialog" aria modal= "true" aria labelledby= "unidades modal title" > <div className= "sticky top 0 z 1 0 bg [var( panel)
] / 8 5 backdrop blur border b border border" > <div className= "flex items center justify between gap 3 px 4 md:px 6 py 3 " > <div className= "minw 0 " > <h3 id= "unidades modal title" className= "text [ 1 8px] md:text lg font semibold leading 6 " > Unidades <span className= "text text/ 6 0 font normal" > 璺? {propiedad? .nombre | | propiedadId | | "Todas" }
< /span> < /h3 > <p className= "text [ 1 2px] subtle mt 0 . 5 " >Administra unidades, estados y valores mensuales. < /p> < /div> <div className= "flex items center gap 2 " > <select aria label= "Filtrar por propiedad" className= "neo input h 9 px 3 py 1 . 5 " value= {localFilterProp}
onChange= {
(e)
= > setLocalFilterProp(e.target.value)
}
> <option value= " " >Todas las propiedades< /option> {propiedades.map( (p)
= > ( <option key= {p.id}
value= {p.id}
> {p.id}
閳?? {p.nombre}
< /option> )
)
}
< /select> <button onClick = {onClose }
className= {cx( "inline flex items center gap 2 h 9 px 3 rounded lg" , isNeo ? "neo plate" : "bg [var( chip)
] hover:bg [var( chip hover)
] " )
}
> <X size= {
1 6 }
/ > Cerrar < /button> < /div> < /div> < /div> <div className= "px 4 md:px 6 py 3 " > <div className= {cx( "rounded xl p 3 md:p 4 " , isNeo ? "neo plate neo plate deep" : "bg [var( panel)
] ring 1 ring border" )
}
> <div className= "text xs subtle mb 2 " >Nueva unidad< /div> <div className= "grid grid cols 1 sm:grid cols [ 1fr_ 1 6 0px_ 1 1 0px_ 1 4 0px_ 1 6 0px] gap 2 " > <input className= "neo input px 3 py 2 " placeholder= "Nombre (ej. A0 1 / Local 2 )
" value= {form.nombre}
onChange= {
(e)
= > setForm ( (p)
= > ( {
. . .p, nombre: e.target.value }
)
)
}
/ > <select className= "neo input px 3 py 2 " value= {form.tipo}
onChange= {
(e)
= > setForm ( (p)
= > ( {
. . .p, tipo: e.target.value }
)
)
}
> <option value= "apartamento" >Apartamento< /option> <option value= "cuarto" >Cuarto< /option> <option value= "local" >Local< /option> <option value= "restaurante" >Restaurante< /option> <option value= "bodega" >Bodega< /option> <option value= "otro" >Otro< /option> < /select> <div className= "flex items center gap 2 " > <input className= "neo input px 3 py 2 w full" type= "number" min= " 1 " max= " 2 8 " value= {form.diaPago }
onChange= {
(e)
= > setForm ( (p)
= > ( {
. . .p, diaPago : e.target.value }
)
)
}
/ > <span className= "text [ 1 1px] subtle" >D閾?a < /span> < /div> <div className= "flex items center gap 2 " > <input className= "neo input px 3 py 2 w full" type= "number" min= " 0 " step= " 0 . 0 1 " value= {form.rentaMensual}
onChange= {
(e)
= > setForm ( (p)
= > ( {
. . .p, rentaMensual: e.target.value }
)
)
}
/ > <span className= "text [ 1 1px] subtle" > $ / mes< /span> < /div> <select className= "neo input px 3 py 2 " value= {form.negocioId}
onChange= {
(e)
= > setForm ( (p)
= > ( {
. . .p, negocioId: e.target.value }
)
)
}
title= "Asignar a negocio de Alquileres (opcional)
" > <option value= " " > (Sin negocio )
< /option> {negociosAlquileres.map( (n)
= > ( <option key= {n.id}
value= {n.id}
> {n.id}
閳?? {n.nombre}
< /option> )
)
}
< /select> <button onClick = {onAdd}
className= "btn gradient btn action btn shimmer h 1 0 rounded lg inline flex items center justify center gap 2 col span full sm:col span 1 " > <Plus size= {
1 6 }
/ > Agregar unidad < /button> < /div> < /div> < /div> <div className= "px 4 md:px 6 pb 5 spacey 2 " > {sorted.map( (u)
= > {
const activa = u.estado = = = "activa" ;
const occ = u.ocupaciones? . [u.ocupaciones.length 1 ] ;
return ( <article key= {
` $ {u.propiedadId}
$ {u.id}
` }
className= {cx( "rounded xl px 3 md:px 4 py 3 ring 1 ring border transition shadow" , "grid grid cols 1 md:grid cols 1 2 gap 2 items center" , "hover:shadow [ 0 _ 6px_ 2 2px_ 1 0px_var( shadow)
] " , isNeo ? "bg [var( panel)
] " : "bg [var( panel)
] / 9 0 " )
}
> <div className= "md:col span 3 minw 0 " > <div className= "text [ 1 5px] font semibold truncate" > {u.nombre}
< /div> <div className= "text [ 1 1px] subtle truncate" > Propiedad {u.propiedadId}
璺? {u.tipo}
{u.negocioId ? ` 璺? $ {u.negocioId}
` : " " }
< /div> < /div> <div className= "md:col span 2 " > <span className= {cx( "inline flex items center gap 2 px 3 py 1 rounded full text [ 1 2px] font medium" , activa ? "bg emerald 1 0 0 text emerald 7 0 0 dark:bg emerald 9 0 0 / 2 5 dark:text emerald 3 0 0 " : "bg amber 1 0 0 text amber 7 0 0 dark:bg amber 9 0 0 / 2 5 dark:text amber 3 0 0 " )
}
> <span className= {cx( "inline block w 2 h 2 rounded full" , activa ? "bg emerald 5 0 0 " : "bg amber 5 0 0 " )
}
/ > {activa ? "Activa" : "Vacante " }
< /span> < /div> <div className= "md:col span 3 text [ 1 2px] leading 5 " > {occ? .inicio ? ( <div className= "text text/ 9 0 " > {activa ? "Ocupada desde" : " 鑴?ltima ocupaci 璐?n " }
<b> {occ.inicio}
< /b> {occ? .fin & & < > 閳?? <b> {occ.fin}
< /b> < / > }
< /div> )
: <span className= "subtle" >Sin historial de ocupaci 璐?n < /span> }
< /div> <div className= "md:col span 3 grid grid cols 2 gap 2 items center" > <label className= "flex items center gap 2 " > <input className= "neo input px 3 py 2 w [ 1 1 0px] " type= "number" min= " 1 " max= " 2 8 " value= {u.diaPago ? ? 1 }
onChange= {
(e)
= > updateUnidad(u.id, {
diaPago : Number(e.target.value | | 1 )
, propiedadId: u.propiedadId }
)
}
/ > <span className= "text [ 1 1px] subtle" >D閾?a pago< /span> < /label> <label className= "flex items center gap 2 " > <input className= "neo input px 3 py 2 w [ 1 4 0px] " type= "number" min= " 0 " step= " 0 . 0 1 " value= {u.rentaMensual ? ? 0 }
onChange= {
(e)
= > updateUnidad(u.id, {
rentaMensual: Number(e.target.value | | 0 )
, propiedadId: u.propiedadId }
)
}
/ > <span className= "text [ 1 1px] subtle" > $ / mes< /span> < /label> < /div> <div className= "md:col span 1 flex md:justify end items center gap 2 " > {activa ? ( <button className= "btn tonal h 9 px 3 " onClick = {
( )
= > setUnidadVacante(u.propiedadId, u.id, "Vacante " )
}
> <PauseCircle size= {
1 6 }
/ > Vacante < /button> )
: ( <button className= "btn gradient btn action btn shimmer h 9 px 3 " onClick = {
( )
= > setUnidadActiva(u.propiedadId, u.id)
}
> <PlayCircle size= {
1 6 }
/ > Activar < /button> )
}
<button className= "icon btn h 9 w 9 ring 1 ring border" title= "Guardar cambios " onClick = {
( )
= > {
}
}
> <Save size= {
1 6 }
/ > < /button> < /div> < /article > )
;
}
)
}
{sorted.length = = = 0 & & ( <div className= "text sm subtle p 8 text center" > A鐓?n no hay unidades. Crea la primera con el formulario superior. < /div> )
}
< /div> < /section > < /div> )
;
}
export default React.memo(UnidadesModal)
;