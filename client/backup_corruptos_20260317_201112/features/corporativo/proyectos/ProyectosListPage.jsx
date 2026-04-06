import React, {
useEffect, useMemo , useState }
from "react" ;
import DataTable from " @ /components/ui/table/DataTable.jsx" ;
const money = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" , }
)
.format(Number(n | | 0 )
)
;
const d = (x)
= > (x ? String(x)
.slice( 0 , 1 0 )
: " ?? )
;
export default function ProyectosListPage( )
{
// M?s adelante vas a remplazar esto con fetch real a /api/proyectos const [loading , setLoading] = useState(false)
;
const [rows, setRows ] = useState( [ {
id: "demo 1 " , codigo: "PRJ 0 0 0 1 " , nombre: "Proyecto demo" , estado: "en_idea" , inicio: " 2 0 2 5 0 1 1 5 " , fin: " 2 0 2 5 0 6 3 0 " , presupuesto: 1 0 0 0 0 , }
, ] )
;
const columns = useMemo ( ( )
= > [ {
key: "codigo" , header: "C?digo" , width: 1 2 0 }
, {
key: "nombre" , header: "Nombre" , className: "maxw [ 3 6 0px] truncate" , }
, {
key: "estado" , header: "Estado" , width: 1 4 0 }
, {
key: "inicio" , header: "Inicio" , width: 1 3 0 , render: (r)
= > d(r.inicio)
, }
, {
key: "fin" , header: "Fin" , width: 1 3 0 , render: (r)
= > d(r.fin)
, }
, {
key: "presupuesto" , header: "Presupuesto" , align: "right" , width: 1 5 0 , className: " [font variant numeric :tabular nums] " , render: (r)
= > money(r.presupuesto)
, sort: (a, b)
= > Number(a.presupuesto ? ? 0 )
Number(b.presupuesto ? ? 0 )
, }
, ] , [ ] )
;
return ( <section className= "neo card neo card deep neo card tinted p 4 rounded 2xl spacey 3 " > <div className= "text sm subtle" >Listado de proyectos< /div> <DataTable columns = {columns }
data= {rows}
loading = {loading }
striped dense searchable searchPlaceholder= "Buscar??c?digo, nombre, estado" pageSize= {
1 0 }
pageSizeOptions= {
[ 5 , 1 0 , 2 0 , 5 0 ] }
rowKey= {
(r)
= > r.id | | r.codigo}
footerLeft= {
<span> Proyectos totales : <b className= "text text" > {rows.length}
< /b> < /span> }
/ > < /section > )
;
}