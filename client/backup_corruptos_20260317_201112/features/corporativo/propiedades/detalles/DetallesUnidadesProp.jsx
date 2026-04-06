// client/src/features/corporativo/propiedades/detalles/DetallesUnidadesProp.jsx import React from "react" ;
import {
formatCurrency }
from " @ /lib/utils" ;
const money = (n)
= > formatCurrency (n)
;
export function DetallesUnidadesProp( {
property }
)
{
if ( !property)
{
return ( <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text center text slate 5 0 0 " >No hay informaci璐?n de unidades disponible< /p> < /div> )
;
}
const unidades = property.unidades | | [ ] ;
const totalUnidades = unidades.length;
const unidadesOcupadas = unidades.filter(u = > u.estado = = = "ocupada " )
.length;
const unidadesDisponibles = unidades.filter(u = > u.estado = = = "disponible" )
.length;
const unidadesMantenimiento = unidades.filter(u = > u.estado = = = "mantenimiento" )
.length;
const ingresosMensuales = unidades.reduce( (sum, u)
= > sum + (u.renta_mensual | | 0 )
, 0 )
;
return ( <div className= "spacey 4 " > <div className= "grid grid cols 1 gap 4 md:grid cols 4 " > <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Total Unidades< /p> <p className= "text 2xl font bold" > {totalUnidades}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Ocupadas< /p> <p className= "text 2xl font bold text green 6 0 0 " > {unidadesOcupadas}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Disponibles< /p> <p className= "text 2xl font bold text blue 6 0 0 " > {unidadesDisponibles}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Mantenimiento< /p> <p className= "text 2xl font bold text yellow 6 0 0 " > {unidadesMantenimiento }
< /p> < /div> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Ingresos Mensuales Proyectados< /p> <p className= "text 2xl font bold text green 6 0 0 " > {money(ingresosMensuales)
}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <h3 className= "mb 3 font semibold" >Listado de Unidades< /h3 > <div className= "spacey 2 " > {unidades.map( (unidad, idx)
= > ( <div key= {idx}
className= "flex items center justify between rounded lg border border slate 1 0 0 p 3 dark:border slate 8 0 0 " > <div> <p className= "font medium" > {unidad.nombre | | `Unidad $ {idx + 1 }
` }
< /p> <p className= "text sm text slate 5 0 0 " > {unidad.tipo | | "No especificado" }
璺? {unidad.superficie | | " ? " }
m2 < /p> < /div> <div className= "text right" > <p className= "font medium" > {money(unidad.renta_mensual | | 0 )
}
< /p> <p className= "text sm text slate 5 0 0 " > {unidad.estado = = = "ocupada " & & " ? ? Ocupada " }
{unidad.estado = = = "disponible" & & " ? ? Disponible" }
{unidad.estado = = = "mantenimiento" & & " ? ? Mantenimiento" }
{
!unidad.estado & & " ? Sin estado" }
< /p> < /div> < /div> )
)
}
< /div> < /div> < /div> )
;
}
export default DetallesUnidadesProp;