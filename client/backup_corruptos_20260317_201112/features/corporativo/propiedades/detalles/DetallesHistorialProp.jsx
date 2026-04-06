// src/pages/Corporativo/Propiedades/Detalles/DetallesHistorialProp .jsx import React, {
useEffect, useMemo , useState }
from "react" ;
import DataTable from " @ /components/ui/table/DataTable.jsx" ;
import {
apiFetch, extractItems }
from " @ /utils/api" ;
import {
usePropertiesStore }
from " @ /store/properties.store.js" ;
const money = (n)
= > new Intl.NumberFormat( "es US" , {
style: "currency" , currency: "USD" }
)
.format(Number(n | | 0 )
)
;
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
function ymKey(iso)
{
const d = new Date(iso)
;
if (isNaN(d)
)
return " ?? ;
return ` $ {d.getFullYear( )
}
$ {String(d.getMonth( )
+ 1 )
.padStart( 2 , " 0 " )
}
` ;
}
function ymLabel (key)
{
if ( ! / ^ \d{
4 }
\d{
2 }
$ / .test(key)
)
return " ?? ;
const [y, m] = key.split( " " )
.map(Number)
;
const f = new Date(y, m 1 , 1 )
;
return f.toLocaleDateString( "es SV" , {
month: "long" , year: "numeric " }
)
;
}
export default function DetallesHistorialProp ( {
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
= await fetchFirstOK( [ ` /api/corporativo/incomes $ {qs}
` ] , {
method: "GET" , errorMessage: "No se pudo cargar el historial" }
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
= > {
const agg = new Map( )
;
for (const it of rowsApi | | [ ] )
{
const key = ymKey(it.fecha | | it.date)
;
if (key = = = " ?? )
continue;
const prev = agg.get(key)
| | {
key, total: 0 }
;
prev.total + = Number(it.monto | | it.amount | | 0 )
;
agg.set(key, prev)
;
}
return [ . . .agg.values( )
] .sort( (a, b)
= > (a.key < b.key ? 1 : 1 )
)
.map( (x, i)
= > ( {
id: i, key: x.key, label: ymLabel (x.key)
, total: x.total }
)
)
;
}
, [rowsApi ] )
;
const cols = useMemo ( ( )
= > [ {
key: "label" , header: "Mes / Per?odo" , render: (r)
= > r.label }
, {
key: "total" , header: "Ingreso " , align: "right" , width: 1 4 0 , className: " [font variant numeric :tabular nums] " , render: (r)
= > money(r.total)
, sort: (a, b)
= > a.total b.total, }
, ] , [ ] )
;
return ( <SectionCard title= "Historial (ingresos por mes)
" > <DataTable columns = {cols}
data= {rows}
loading = {loading }
striped dense pageSize= {
1 0 }
rowKey= {
(r)
= > r.id}
footerLeft= {
<span> Meses mostrados: <b className= "text text" > {rows.length}
< /b> < /span> }
/ > < /SectionCard> )
;
}