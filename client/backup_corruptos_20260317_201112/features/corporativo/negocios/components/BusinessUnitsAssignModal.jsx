// client/src/features/corporativo/Negocios/components/BusinessUnitsAssignModal.jsx import React, {
useMemo , useState }
from "react" ;
import {
X, Search, CheckSquare, Square }
from "lucide React" ;
import Field, {
fieldControlClass }
from " @ /components/ui/forms/Field.jsx" ;
import {
usePropertiesStore }
from " @ /features/corporativo/propiedades/store/properties.store.js" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function BusinessUnitsAssignModal( {
open, onClose , businessId, businessLabel, units = [ ] , onAssign, }
)
{
const propiedades = usePropertiesStore( (s)
= > (Array.isArray (s.propiedades)
? s.propiedades : [ ] )
)
;
const [propertyId, setPropertyId] = useState( " " )
;
const [q, setQ] = useState( " " )
;
const [selected, setSelected] = useState( ( )
= > new Set( )
)
;
const propOptions = useMemo ( ( )
= > {
return propiedades .map( (p)
= > {
const idOpt = String(p? .id ? ? p? . _id ? ? " " )
.trim( )
;
if ( !idOpt)
return null;
const codigo = String(p? .codigo ? ? " " )
.trim( )
;
const nombre = String(p? .nombre ? ? "Propiedad" )
.trim( )
;
return {
id: idOpt, label: ` $ {codigo ? ` $ {codigo}
? ` : " " }
$ {nombre}
` }
;
}
)
.filter(Boolean )
;
}
, [propiedades] )
;
const filtered = useMemo ( ( )
= > {
const text = String(q | | " " )
.trim( )
.toLowerCase( )
;
return (Array.isArray (units)
? units : [ ] )
.filter( (u)
= > {
if (propertyId & & String(u.propertyId ? ? " " )
! = = String(propertyId)
)
return false;
if ( !text)
return true;
const name = String(u.name ? ? u.nombre ? ? " " )
.toLowerCase( )
;
const code = String(u.code ? ? u.codigo ? ? " " )
.toLowerCase( )
;
return name.includes(text)
| | code.includes(text)
;
}
)
// solo unidades NO asignadas o asignadas a este negocio (para permitir ?濞?e asignar ??sin ruido)
.filter( (u)
= > {
const b = String(u.businessId ? ? u.negocioId ? ? " " )
;
return !b | | b = = = String(businessId)
;
}
)
;
}
, [units, propertyId, q, businessId] )
;
const selectedCount = selected.size;
const toggle = (id)
= > {
setSelected( (prev)
= > {
const next = new Set(prev)
;
if (next.has(id)
)
next.delete(id)
;
else next.add(id)
;
return next;
}
)
;
}
;
const toggleAll = ( )
= > {
const ids = filtered.map( (u)
= > String(u.id ? ? u. _id ? ? u.code ? ? " " )
)
;
setSelected( (prev)
= > {
const next = new Set(prev)
;
const allSelected = ids.every( (x)
= > next.has(x)
)
;
if (allSelected)
ids.forEach ( (x)
= > next.delete(x)
)
;
else ids.forEach ( (x)
= > next.add(x)
)
;
return next;
}
)
;
}
;
const handleAssign = async ( )
= > {
const ids = Array.from(selected)
;
if (ids.length = = = 0 )
return;
await onAssign? . (ids)
;
setSelected(new Set( )
)
;
onClose ? . ( )
;
}
;
if ( !open)
return null;
return ( <div className= "fixed inset 0 z [ 1 0 0 0 ] " > <div className= "absolute inset 0 bg black/ 3 0 " onClick = {onClose }
/ > <div className= "absolute insetx 0 top 8 mx auto w [min( 9 8 0px, 9 2vw)
] " > <div className= "neo card neo card deep neo card tinted rounded 2xl p 4 md:p 6 " > <div className= "flex items start justify between gap 3 " > <div> <div className= "text lg font semibold" >Asignar unidades< /div> <div className= "text xs subtle" > Negocio : <span className= "font medium" > {businessLabel | | businessId}
< /span> < /div> < /div> <button type= "button" onClick = {onClose }
className= "h 9 w 9 rounded full grid place items center neo btn" title= "Cerrar" > <X className= "w 4 h 4 " / > < /button> < /div> <div className= "mt 4 grid grid cols 1 md:grid cols 3 gap 4 " > <Field label= "Propiedad" > <select value= {propertyId}
onChange= {
(e)
= > setPropertyId(e.target.value)
}
className= {cx( "neo select w full" , fieldControlClass( )
)
}
> <option value= " " >Todas< /option> {propOptions.map( (p)
= > ( <option key= {p.id}
value= {p.id}
> {p.label}
< /option> )
)
}
< /select> < /Field> <div className= "md:col span 2 " > <Field label= "Buscar" > <div className= "flex items center gap 2 " > <span className= "opacity 7 0 " > <Search className= "w 4 h 4 " / > < /span> <input value= {q}
onChange= {
(e)
= > setQ(e.target.value)
}
placeholder= "Nombre o c?digo?? className= {fieldControlClass( )
}
/ > < /div> < /Field> < /div> < /div> <div className= "mt 4 neo plate neo plate soft rounded xl p 3 " > <div className= "flex items center justify between gap 2 text xs opacity 8 0 mb 2 " > <div> {filtered.length}
unidades encontradas< /div> <button type= "button" onClick = {toggleAll}
className= "neo btn px 3 py 1 rounded lg text xs" > {filtered.every( (u)
= > selected.has(String(u.id ? ? u. _id ? ? u.code ? ? " " )
)
)
? ( <span className= "inline flex items center gap 2 " > <CheckSquare className= "w 4 h 4 " / > Quitar selecci ?n < /span> )
: ( <span className= "inline flex items center gap 2 " > <Square className= "w 4 h 4 " / > Seleccionar todo < /span> )
}
< /button> < /div> <div className= "maxh [ 4 6vh] overflow auto rounded lg" > <table className= "w full text sm" > <thead className= "sticky top 0 bg [color mix(in_srgb,var( panel)
_ 9 2 % ,transparent)
] " > <tr className= "text left opacity 8 0 " > <th className= "p 2 w [ 4 8px] " >Sel< /th> <th className= "p 2 " >Unidad< /th> <th className= "p 2 w [ 1 8 0px] " >C?digo< /th> <th className= "p 2 w [ 1 4 0px] " >Estado< /th> < /tr> < /thead> <tbody> {filtered.map( (u)
= > {
const uid = String(u.id ? ? u. _id ? ? u.code ? ? " " )
;
const checked = selected.has(uid)
;
return ( <tr key= {uid}
className= "border t border [var( border)
] / 6 0 hover:bg white/ 5 " > <td className= "p 2 " > <input type= "checkbox" checked = {checked }
onChange= {
( )
= > toggle(uid)
}
/ > < /td> <td className= "p 2 " > <div className= "font medium" > {u.name ? ? u.nombre ? ? "Unidad" }
< /div> <div className= "text xs opacity 7 0 " > {u.unitType ? ? u.tipo ? ? " " }
< /div> < /td> <td className= "p 2 font mono opacity 8 5 " > {u.code ? ? u.codigo ? ? " " }
< /td> <td className= "p 2 " > {u.state ? ? u.estado ? ? " " }
< /td> < /tr> )
;
}
)
}
{filtered.length = = = 0 ? ( <tr> <td className= "p 3 text xs opacity 7 0 " colSpan = {
4 }
> No hay unidades disponibles para asignar con esos filtros . < /td> < /tr> )
: null}
< /tbody> < /table> < /div> < /div> <div className= "mt 4 flex items center justify between gap 2 " > <div className= "text xs subtle" > Seleccionadas: <span className= "font medium" > {selectedCount}
< /span> < /div> <div className= "flex items center gap 2 " > <button type= "button" onClick = {onClose }
className= "neo btn px 4 py 2 rounded xl" > Cancelar < /button> <button type= "button" onClick = {handleAssign}
disabled= {selectedCount = = = 0 }
className= {cx( "btn gradient btn action control md btn shimmer px 4 py 2 rounded xl" , selectedCount = = = 0 ? "opacity 5 0 pointer events none" : " " )
}
> Asignar < /button> < /div> < /div> < /div> < /div> < /div> )
;
}