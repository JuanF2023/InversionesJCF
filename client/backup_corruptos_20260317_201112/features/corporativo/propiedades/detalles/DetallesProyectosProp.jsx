// client/src/features/corporativo/propiedades/detalles/DetallesProyectosProp .jsx import React from "react" ;
import {
formatCurrency , formatDate }
from " @ /lib/utils" ;
const fmtDate = (iso)
= > {
if ( !iso)
return " " ;
const d = new Date(iso)
;
return Number.isNaN(d.getTime ( )
)
? " " : d.toLocaleDateString( "es SV" )
;
}
;
export function DetallesProyectosProp ( {
property }
)
{
if ( !property | | !property.proyectos | | property.proyectos.length = = = 0 )
{
return ( <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text center text slate 5 0 0 " >No hay proyectos asociados< /p> < /div> )
;
}
const proyectos = property.proyectos | | [ ] ;
const totalProyectos = proyectos.length;
const proyectosActivos = proyectos.filter(p = > p.estado = = = "activo" )
.length;
const proyectosCompletados = proyectos.filter(p = > p.estado = = = "completado" )
.length;
const proyectosPausados = proyectos.filter(p = > p.estado = = = "pausado " )
.length;
const presupuestoTotal = proyectos.reduce( (sum, p)
= > sum + (p.presupuesto | | 0 )
, 0 )
;
const gastoTotal = proyectos.reduce( (sum, p)
= > sum + (p.gasto | | 0 )
, 0 )
;
const progresoPromedio = proyectos.reduce( (sum, p)
= > sum + (p.progreso | | 0 )
, 0 )
/ totalProyectos ;
return ( <div className= "spacey 4 " > <div className= "grid grid cols 1 gap 4 md:grid cols 4 " > <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Total Proyectos< /p> <p className= "text 2xl font bold" > {totalProyectos }
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Activos < /p> <p className= "text 2xl font bold text green 6 0 0 " > {proyectosActivos}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Completados< /p> <p className= "text 2xl font bold text blue 6 0 0 " > {proyectosCompletados}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Pausados< /p> <p className= "text 2xl font bold text yellow 6 0 0 " > {proyectosPausados}
< /p> < /div> < /div> <div className= "grid grid cols 1 gap 4 md:grid cols 3 " > <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Presupuesto Total< /p> <p className= "text 2xl font bold text green 6 0 0 " > {formatCurrency (presupuestoTotal)
}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Gasto Total< /p> <p className= "text 2xl font bold text orange 6 0 0 " > {formatCurrency (gastoTotal)
}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Progreso Promedio< /p> <p className= "text 2xl font bold text blue 6 0 0 " > {Math.round(progresoPromedio)
}
% < /p> < /div> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <h3 className= "mb 3 font semibold" >Listado de Proyectos< /h3 > <div className= "spacey 2 " > {proyectos.map( (proyecto, idx)
= > ( <div key= {idx}
className= "flex items center justify between rounded lg border border slate 1 0 0 p 3 dark:border slate 8 0 0 " > <div className= "flex 1 " > <p className= "font medium" > {proyecto.nombre | | `Proyecto $ {idx + 1 }
` }
< /p> <div className= "flex gap 4 text sm text slate 5 0 0 " > <span>Inicio: {fmtDate (proyecto.fecha_inicio)
}
< /span> <span>Fin: {fmtDate (proyecto.fecha_fin)
}
< /span> < /div> < /div> <div className= "text right" > <p className= "font medium" > {formatCurrency (proyecto.presupuesto | | 0 )
}
< /p> <div className= "flex items center gap 2 " > <div className= "h 2 w 2 4 rounded full bg slate 2 0 0 dark:bg slate 7 0 0 " > <div className= "h 2 rounded full bg blue 6 0 0 " style= {
{
width: ` $ {proyecto.progreso | | 0 }
% ` }
}
/ > < /div> <span className= "text sm" > {proyecto.progreso | | 0 }
% < /span> < /div> < /div> < /div> )
)
}
< /div> < /div> < /div> )
;
}
export default DetallesProyectosProp ;