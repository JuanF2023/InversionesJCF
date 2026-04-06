import React, {
useMemo , useState }
from "react" ;
import {
Table, THead, Th, TBody, Tr, Td, EmptyState }
from " . /TablePrimitives.jsx" ;
import {
ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown }
from "lucide React" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
/ * * * columns = [ {
key, header, width? , align? , render? (row)
, sort? (a,b)
}
] * data = array de objetos * / export default function DataTable( {
columns = [ ] , data = [ ] , loading = false, pageSize = 1 0 , dense = false, className, footerLeft, // componente opcional footerRight, // componente opcional }
)
{
const [page, setPage ] = useState( 0 )
;
const [sort, setSort ] = useState( {
key: null, dir: "asc" }
)
;
const sorted = useMemo ( ( )
= > {
if ( !sort.key)
return data;
const col = columns .find( (c)
= > c.key = = = sort.key)
;
const cmp = col? .sort | | ( (a, b)
= > {
const va = a[sort.key] ;
const vb = b[sort.key] ;
if (va = = null & & vb = = null)
return 0 ;
if (va = = null)
return 1 ;
if (vb = = null)
return 1 ;
return ( " " +va)
.localeCompare( " " +vb, undefined, {
numeric : true, sensitivity: "base" }
)
;
}
)
;
const arr = [ . . .data] .sort(cmp)
;
return sort.dir = = = "asc" ? arr : arr.reverse ( )
;
}
, [data, sort, columns ] )
;
const pages = Math.max( 1 , Math.ceil(sorted.length / pageSize)
)
;
const paged = sorted.slice(page * pageSize, page * pageSize + pageSize)
;
function toggleSort(key)
{
setPage ( 0 )
;
setSort ( (s)
= > s.key ! = = key ? {
key, dir: "asc" }
: {
key, dir: s.dir = = = "asc" ? "desc" : "asc" }
)
;
}
return ( <div className= {cx( "neo card neo card deep neo card tinted no clip p 0 " , className)
}
> <Table className= {dense ? "text [ 1 3px] " : "text sm" }
> <THead> {columns .map( (c)
= > ( <Th key= {c.key}
width= {c.width}
align= {c.align}
> <button type= "button" onClick = {
( )
= > toggleSort(c.key)
}
className= "inline flex items center gap 1 " title= "Ordenar " > <span> {c.header}
< /span> <ArrowUpDown size= {
1 4 }
className= "opacity 7 0 " / > < /button> < /Th> )
)
}
< /THead> {loading ? ( <tbody> <tr> <td colSpan = {columns .length}
> <EmptyState> Cargando?? < /EmptyState> < /td> < /tr> < /tbody> )
: paged.length = = = 0 ? ( <tbody> <tr> <td colSpan = {columns .length}
> <EmptyState>Sin registros. < /EmptyState> < /td> < /tr> < /tbody> )
: ( <TBody> {paged.map( (row, i)
= > ( <Tr key= {i}
> {columns .map( (c)
= > ( <Td key= {c.key}
align= {c.align}
> {c.render ? c.render(row)
: (row[c.key] ? ? " ?? )
}
< /Td> )
)
}
< /Tr> )
)
}
< /TBody> )
}
< /Table> {
/ * Footer / paginaci?n * / }
<div className= "flex items center justify between gap 2 px 3 py 2 " > <div className= "text xs subtle" > {footerLeft}
< /div> <div className= "flex items center gap 1 " > <button className= "icon btn" onClick = {
( )
= > setPage ( 0 )
}
disabled= {page= = = 0 }
title= "Primera " > <ChevronsLeft size= {
1 6 }
/ > < /button> <button className= "icon btn" onClick = {
( )
= > setPage ( (p)
= >Math.max( 0 ,p 1 )
)
}
disabled= {page= = = 0 }
title= "Anterior" > <ChevronLeft size= {
1 6 }
/ > < /button> <div className= "text xs subtle px 2 " > P?gina <b className= "text text" > {page+ 1 }
< /b> de <b className= "text text" > {pages}
< /b> < /div> <button className= "icon btn" onClick = {
( )
= > setPage ( (p)
= >Math.min(pages 1 ,p+ 1 )
)
}
disabled= {page> =pages 1 }
title= "Siguiente" > <ChevronRight size= {
1 6 }
/ > < /button> <button className= "icon btn" onClick = {
( )
= > setPage (pages 1 )
}
disabled= {page> =pages 1 }
title= " 閼?ltima" > <ChevronsRight size= {
1 6 }
/ > < /button> < /div> <div className= "text xs subtle" > {footerRight}
< /div> < /div> < /div> )
;
}