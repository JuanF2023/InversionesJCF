// client/src/features/corporativo/propiedades/detalles/DetallesIngresosProp.jsx import React from "react" ;
import {
formatCurrency }
from " @ /lib/utils" ;
const FALLBACK = " " ;
const money = (n)
= > formatCurrency (n)
;
export function DetallesIngresosProp( {
property }
)
{
if ( !property | | !property.ingresos | | property.ingresos.length = = = 0 )
{
return ( <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text center text slate 5 0 0 " >No hay ingresos registrados< /p> < /div> )
;
}
const ingresos = property.ingresos | | [ ] ;
// Agrupar por mes const ingresosPorMes = {
}
;
ingresos.forEach (ingreso = > {
const fecha = new Date(ingreso .fecha)
;
const mesKey = ` $ {fecha.getFullYear( )
}
$ {String(fecha.getMonth( )
+ 1 )
.padStart( 2 , ' 0 ' )
}
` ;
const mesNombre = fecha.toLocaleDateString( 'es ES' , {
month: 'long' , year: 'numeric ' }
)
;
if ( !ingresosPorMes [mesKey] )
{
ingresosPorMes [mesKey] = {
mes: mesNombre, total: 0 , items: [ ] }
;
}
ingresosPorMes [mesKey] .total + = ingreso .monto | | 0 ;
ingresosPorMes [mesKey] .items.push(ingreso )
;
}
)
;
// Convertir a array y ordenar por mes descendente const meses = Object.values(ingresosPorMes )
.sort( (a, b)
= > new Date(b.items[ 0 ] .fecha)
new Date(a.items[ 0 ] .fecha)
)
;
const totalIngresos = ingresos.reduce( (sum, i)
= > sum + (i.monto | | 0 )
, 0 )
;
const promedioMensual = totalIngresos / (meses.length | | 1 )
;
const ultimoMes = meses[ 0 ] ? .total | | 0 ;
return ( <div className= "spacey 4 " > <div className= "grid grid cols 1 gap 4 md:grid cols 3 " > <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Total Ingresos< /p> <p className= "text 2xl font bold text green 6 0 0 " > {money(totalIngresos)
}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " >Promedio Mensual < /p> <p className= "text 2xl font bold text blue 6 0 0 " > {money(promedioMensual)
}
< /p> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <p className= "text sm text slate 5 0 0 " > 鐓?ltimo Mes< /p> <p className= "text 2xl font bold text purple 6 0 0 " > {money(ultimoMes)
}
< /p> < /div> < /div> <div className= "rounded lg border border slate 2 0 0 bg white p 4 dark:border slate 8 0 0 dark:bg slate 9 0 0 " > <h3 className= "mb 3 font semibold" >Ingresos por Mes< /h3 > <div className= "spacey 4 " > {meses.map( (mes, idx)
= > ( <div key= {idx}
className= "spacey 2 " > <div className= "flex items center justify between border b border slate 1 0 0 pb 1 dark:border slate 8 0 0 " > <p className= "font medium text slate 7 0 0 dark:text slate 3 0 0 " > {mes.mes}
< /p> <p className= "font bold text green 6 0 0 " > {money(mes.total)
}
< /p> < /div> <div className= "spacey 1 pl 2 " > {mes.items.map( (ingreso , i)
= > ( <div key= {i}
className= "flex items center justify between text sm" > <div> <span className= "text slate 6 0 0 dark:text slate 4 0 0 " > {new Date(ingreso .fecha)
.toLocaleDateString( 'es ES' )
}
< /span> <span className= "ml 2 text slate 5 0 0 " > {ingreso .concepto | | 'Sin concepto' }
< /span> < /div> <span className= "font medium" > {money(ingreso .monto | | 0 )
}
< /span> < /div> )
)
}
< /div> < /div> )
)
}
< /div> < /div> < /div> )
;
}
export default DetallesIngresosProp;