import React from "react" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export function Table( {
className, children }
)
{
return ( <div className= "overflowxauto rounded xl ring 1 ring border bg [var( panel)
] / 4 0 " > <table className= {cx( "w full text sm" , className)
}
> {children}
< /table> < /div> )
;
}
export function THead( {
children, sticky = true }
)
{
return ( <thead className= "text [ 1 3px] " > <tr className= {cx( "bg [color mix(in_srgb,var( accent)
_ 1 0 % ,transparent)
] text [ muted] font semibold" , sticky & & "sticky top 0 z 1 0 " )
}
> {children}
< /tr> < /thead> )
;
}
export function Th( {
children, align = "left" , width, className }
)
{
return ( <th scope= "col" className= {cx( "px 3 py 2 border b border border/ 6 0 whitespace nowrap" , align = = = "right" & & "text right" , align = = = "center" & & "text center" , className )
}
style= {width ? {
width }
: undefined}
> {children}
< /th> )
;
}
export function TBody( {
children }
)
{
return <tbody> {children}
< /tbody> ;
}
export function Tr( {
children, className }
)
{
return ( <tr className= {cx( "hover:bg [color mix(in_srgb,var( accent)
_ 6 % ,transparent)
] / 5 0 transition colors" , className )
}
> {children}
< /tr> )
;
}
export function Td( {
children, align = "left" , className }
)
{
return ( <td className= {cx( "px 3 py 2 border b border border/ 6 0 " , align = = = "right" & & "text right" , align = = = "center" & & "text center" , className )
}
> {children}
< /td> )
;
}
export function EmptyState( {
children }
)
{
return ( <div className= "p 6 text center text sm subtle" > {children | | "Sin datos para mostrar . " }
< /div> )
;
}
export function SkeletonRows( {
rows = 5 , cols = 5 }
)
{
return ( <TBody> {Array.from( {
length: rows }
)
.map( ( _ , r)
= > ( <Tr key= {r}
> {Array.from( {
length: cols }
)
.map( ( _ _ , c)
= > ( <Td key= {c}
> <div className= "h 3 w full rounded bg [var( chip)
] / 7 0 animate pulse" / > < /Td> )
)
}
< /Tr> )
)
}
< /TBody> )
;
}