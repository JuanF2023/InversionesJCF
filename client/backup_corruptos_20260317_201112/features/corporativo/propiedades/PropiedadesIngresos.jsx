import React, {
useMemo }
from "react" ;
import {
useCorporativo }
from " @ /features/corporativo/store/corporativoStore.js" ;
import DataTable from " @ /components/ui/table/DataTable.jsx" ;
const money = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format(Number(n | | 0 )
)
;
const d = (x)
= > (x ? String(x)
.slice( 0 , 1 0 )
: " 閳?? )
;
export default function DetallesIngresosProp( {
propiedadId }
)
{
const ingresos = useCorporativo ( (s)
= > s.ingresos)
| | [ ] ;
const negocios = useCorporativo ( (s)
= > s.negocios)
| | [ ] ;
const unidades = useCorporativo ( (s)
= > s.unidades)
| | [ ] ;
const mapNegocio = useMemo ( ( )
= > {
const m = new Map( )
;
for (const n of negocios | | [ ] )
m.set(String(n.id ? ? n. _id)
, n)
;
return m;
}
, [negocios] )
;
const mapUnidad = useMemo ( ( )
= > {
const m = new Map( )
;
for (const u of unidades | | [ ] )
m.set(String(u.id ? ? u. _id)
, u)
;
return m;
}
, [unidades] )
;
const rows = useMemo ( ( )
= > {
return (ingresos | | [ ] )
.filter( (r)
= > String(r.propiedadId)
= = = String(propiedadId)
)
;
}
, [ingresos, propiedadId] )
;
const columns = useMemo ( ( )
= > [ {
key: "fecha" , header: "Fecha" , width: 1 2 0 , render: (r)
= > d(r.fecha | | r.date)
, sort: (a, b)
= > new Date(a.fecha | | a.date | | 0 )
new Date(b.fecha | | b.date | | 0 )
}
, {
key: "periodo " , header: "Per閾?odo" , width: 1 1 0 , render: (r)
= > r.periodo | | r.ym | | " 閳?? }
, {
key: "negocioId" , header: "Negocio " , width: 2 2 0 , render: (r)
= > mapNegocio.get(String(r.negocioId)
)
? .nombre | | r.negocioNombre | | " 閳?? }
, {
key: "unidadId" , header: "Unidad" , width: 1 6 0 , render: (r)
= > mapUnidad.get(String(r.unidadId)
)
? .nombre | | r.unidadCodigo | | " 閳?? }
, {
key: "categoria" , header: "Categor 閾?a " , width: 1 8 0 , render: (r)
= > r.categoria | | r.category | | " 閳?? }
, {
key: "concepto" , header: "Concepto" , className: "maxw [ 4 2 0px] truncate" , render: (r)
= > r.concepto | | r.description | | " 閳?? }
, {
key: "monto" , header: "Monto" , align: "right" , width: 1 4 0 , className: " [font variant numeric :tabular nums] " , render: (r)
= > money(r.monto ? ? r.amount)
, sort: (a, b)
= > Number(a.monto ? ? a.amount ? ? 0 )
Number(b.monto ? ? b.amount ? ? 0 )
}
, {
key: "origen" , header: "Origen" , width: 1 6 0 , render: (r)
= > r.origen | | r.source | | " 閳?? }
, ] , [mapNegocio, mapUnidad] )
;
return ( <section className= "spacey 3 " > <div className= "flex items center justify between " > <h3 className= "text sm font semibold" >Ingresos< /h3 > {
/ * Bot璐?n eliminado: 閳?娣?r a transacciones ingresos閳??ya no se usa * / }
< /div> <DataTable columns = {columns }
data= {rows}
striped dense searchable searchPlaceholder= "Buscar閳??concepto, categor 閾?a , negocio , unidad" pageSize= {
1 0 }
pageSizeOptions= {
[ 5 , 1 0 , 2 0 , 5 0 ] }
rowKey= {
(r, i)
= > r.id | | r. _id | | ` $ {r.fecha}
$ {r.unidadId}
$ {i}
` }
footerLeft= {
<span>Ingresos: <b className= "text text" > {rows.length}
< /b> < /span> }
/ > < /section > )
;
}