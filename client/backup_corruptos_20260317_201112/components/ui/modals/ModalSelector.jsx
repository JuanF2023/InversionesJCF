import React, {
useState, useMemo }
from "react" ;
import {
X }
from "lucide React" ;
const ModalSelector = ( {
visible , porciones = [ ] , seleccionActual, onClose , onSeleccionar, modo = "single" , // 'single' o 'multi' }
)
= > {
const [busqueda, setBusqueda] = useState( " " )
;
const [seleccionTemporal, setSeleccionTemporal] = useState( modo = = = "multi" ? [ . . . (seleccionActual | | [ ] )
] : seleccionActual | | " " )
;
const filtradas = useMemo ( ( )
= > {
return porciones.filter( (p)
= > p.nombre.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
)
;
}
, [busqueda, porciones] )
;
const toggleSeleccion = (id)
= > {
if (modo = = = "multi" )
{
if (seleccionTemporal.includes(id)
)
{
setSeleccionTemporal(seleccionTemporal.filter( (x)
= > x ! = = id)
)
;
}
else {
setSeleccionTemporal( [ . . .seleccionTemporal, id] )
;
}
}
else {
setSeleccionTemporal(id)
;
onSeleccionar(id)
;
onClose ( )
;
}
}
;
const aplicarSeleccion = ( )
= > {
onSeleccionar(seleccionTemporal)
;
onClose ( )
;
}
;
if ( !visible )
return null;
return ( <div className= "fixed inset 0 bg black bg opacity 6 0 z 5 0 flex items center justify center px 4 " > <div className= "bg [ # 1a2 2 3 8 ] w full maxw 2xl rounded lg shadow xl border border yellow 5 0 0 p 6 relative" > <button onClick = {onClose }
className= "absolute top 4 right 4 text white hover:text yellow 3 0 0 " > <X size= {
2 0 }
/ > < /button> <h2 className= "text lg font bold text yellow 3 0 0 mb 4 " > Seleccionar porciones < /h2 > <input type= "text" value= {busqueda}
onChange= {
(e)
= > setBusqueda(e.target.value)
}
placeholder= "Buscar porci?n . . . " className= "w full px 4 py 2 mb 4 rounded bg slate 7 0 0 text white" / > <div className= "grid grid cols 1 sm:grid cols 2 gap 3 maxh [ 3 0 0px] overflowyauto" > {filtradas.length = = = 0 & & ( <div className= "text center text slate 3 0 0 col span 2 " > No se encontraron porciones. < /div> )
}
{filtradas.map( (p)
= > {
const isSelected = modo = = = "multi" ? seleccionTemporal.includes(p.id)
: seleccionTemporal = = = p.id;
return ( <div key= {p.id}
onClick = {
( )
= > toggleSeleccion(p.id)
}
className= {
`cursor pointer p 3 rounded border $ {
isSelected ? "bg yellow 3 0 0 text black font semibold" : "bg slate 7 0 0 text white" }
hover:border yellow 4 0 0 transition` }
> <p> {p.nombre}
< /p> <p className= {
`text xs mt 1 $ {
isSelected ? "text slate 8 0 0 " : "text slate 3 0 0 " }
` }
> {p.tipoPreparacion}
?? $ {p.costoBase.toFixed ( 2 )
}
< /p> < /div> )
;
}
)
}
< /div> {modo = = = "multi" & & ( <div className= "mt 6 text right" > <button onClick = {aplicarSeleccion}
className= "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 6 py 2 rounded md" > Aplicar selecci ?n < /button> < /div> )
}
< /div> < /div> )
;
}
;
export default ModalSelector;