// src/pages/Corporativo/Propiedades/Detalles/DetallesNegociosProp.jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import DataTable from " @ /components/ui/table/DataTable.jsx" ;
import {
apiFetch, extractItems }
from " @ /utils/api" ;
import {
usePropertiesStore }
from " @ /features/corporativo/propiedades/store/properties.store.js" ;
async function fetchFirstOK(urls, opt)
{
for (const u of urls)
{
const res = await apiFetch(u, opt)
;
if (res? .ok)
return res;
if (res? .status ! = = 4 0 4 )
continue;
}
return {
ok: false, data: null }
;
}
const SectionCard = ( {
title, right, children }
)
= > ( <section className= "neo card neo card deep neo card tinted p 4 rounded 2xl spacey 3 " > <div className= "flex items center justify between " > <h3 className= "text sm font semibold tracking wide" > {title}
< /h3 > {right | | null}
< /div> {children}
< /section > )
;
export default function DetallesNegociosProp( {
propiedadId: propIdProp }
)
{
const selectedPropId = usePropertiesStore( (s)
= > s.selectedPropId )
;
const propiedadId = String(propIdProp ? ? selectedPropId ? ? " " )
;
const [loading , setLoading] = useState(false)
;
const [rowsApi , setRowsApi] = useState( [ ] )
;
useEffect( ( )
= > {
let alive = true;
(async ( )
= > {
setLoading(true)
;
try {
const qs = propiedadId ? ` ?propiedadId= $ {encodeURIComponent(propiedadId)
}
` : " " ;
const {
ok, data }
= await fetchFirstOK( [ ` /api/businesses$ {qs}
` ] , {
method: "GET" , errorMessage: "No se pudo cargar negocios" }
)
;
if ( !alive)
return;
setRowsApi(ok ? extractItems(data)
: [ ] )
;
}
finally {
if (alive)
setLoading(false)
;
}
}
)
( )
;
return ( )
= > {
alive = false;
}
;
}
, [propiedadId] )
;
const rows = useMemo ( ( )
= > (rowsApi | | [ ] )
.map( (n, i)
= > ( {
id: n. _id | | n.id | | `row $ {i}
` , codigo: n.codigo | | n.code | | " ?? " , nombre: n.nombre | | n.name | | " ?? " , tipo: n.tipo | | n.type | | " ?? " , estado: n.estado | | n.status | | " ?? " , unidades: Number(n.unidades | | n.units | | 0 )
, }
)
)
, [rowsApi ] )
;
const cols = useMemo ( ( )
= > [ {
key: "codigo" , header: "C?digo" , width: 1 2 0 , render: (r)
= > r.codigo }
, {
key: "nombre" , header: "Nombre" , className: "maxw [ 3 2 0px] truncate" , render: (r)
= > r.nombre, }
, {
key: "tipo" , header: "Tipo" , width: 1 6 0 , render: (r)
= > r.tipo | | " ?? " }
, {
key: "estado" , header: "Estado" , width: 1 4 0 , render: (r)
= > r.estado | | " ?? " }
, {
key: "unidades" , header: "Unidades" , align: "right" , width: 1 1 0 , className: " [font variant numeric :tabular nums] " , render: (r)
= > r.unidades, sort: (a, b)
= > a.unidades b.unidades, }
, ] , [ ] )
;
return ( <SectionCard title= "Negocios" > <DataTable columns = {cols}
data= {rows}
loading = {loading }
striped dense searchable searchPlaceholder= "Buscar??c?digo, nombre, tipo" pageSize= {
1 0 }
rowKey= {
(r)
= > r.id}
footerLeft= {
<span> Negocios: <b className= "text text" > {rows.length}
< /b> < /span> }
/ > < /SectionCard> )
;
}