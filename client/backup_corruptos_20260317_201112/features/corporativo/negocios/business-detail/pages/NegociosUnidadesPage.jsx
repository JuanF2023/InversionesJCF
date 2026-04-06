// client/src/features/corporativo/Negocios/pages/NegociosUnidadesPage.jsx import React from "react" ;
import {
Layers, Link2 , ArrowUpRight }
from "lucide React" ;
import {
useNavigate }
from "React router dom" ;
import BusinessSelectBar from " @ /features/corporativo/negocios/components/BusinessSelectBar.jsx" ;
import BusinessUnitsAssignModal from " @ /features/corporativo/negocios/components/BusinessUnitsAssignModal.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
function SectionCard( {
title, icon: Icon, right, children }
)
{
return ( <section className= "rounded 2xl border border [var( border)
] bg [var( panel)
] shadow sm" > <div className= "px 5 py 4 flex items center gap 3 border b border [var( border)
] " > {Icon ? <Icon size= {
1 8 }
className= "opacity 8 0 " / > : null}
<h2 className= "font semibold" > {title}
< /h2 > <div className= "ml auto" > {right}
< /div> < /div> <div className= "p 5 " > {children}
< /div> < /section > )
;
}
export default function NegociosUnidadesPage( )
{
const nav = useNavigate( )
;
return ( <div className= "spacey 5 " > <BusinessSelectBar / > <div className= "grid grid cols 1 lg:grid cols 2 gap 4 " > <SectionCard title= "Unidades asociadas" icon= {Layers}
right= {
<button type= "button" onClick = {
( )
= > nav( " /corporativo/propiedades/unidades/lista" )
}
className= "text sm inline flex items center gap 2 opacity 8 0 hover:opacity 1 0 0 transition" > Ver m?dulo Unidades <ArrowUpRight size= {
1 6 }
/ > < /button> }
> <div className= "text sm opacity 8 0 " > La relaci?n vive en <code className= "px 1 rounded bg [color mix(in_srgb,var( panel)
_ 7 0 % ,var( text)
_ 1 0 % )
] " >unit.businessId< /code> . Aqu? debes poder ver y asignar /desasignar sin ir a pantallas profundas. < /div> <div className= "mt 4 rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( text)
_ 4 % )
] p 4 " > <div className= "text sm font semibold" >Estado< /div> <div className= "text sm opacity 7 5 mt 1 " > Selecciona un negocio arriba para listar unidades asociadas. < /div> < /div> <div className= "mt 4 flex flex col md:flex row gap 3 " > <div className= "flex 1 " > <div className= "text xs opacity 7 0 mb 1 " >Asignaci?n r?pida< /div> <div className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 8 8 % ,var( text)
_ 6 % )
] p 3 " > <div className= "text sm opacity 8 0 " > Usa el modal para asignar unidades al negocio seleccionado. < /div> < /div> < /div> <div className= "md:self end" > {
/ * Si tu modal requiere props, aj閻?stalo aqu?. Lo dejo ?濞?nline??para tu UI actual * / }
<BusinessUnitsAssignModal / > < /div> < /div> < /SectionCard> <SectionCard title= "Reglas de integridad" icon= {Link2 }
> <div className= "grid gap 3 " > {
[ {
t: " 1 negocio ??muchas unidades" , d: "Una unidad solo puede pertenecer a un negocio a la vez. " }
, {
t: "Desasignar ??borrar" , d: "Quitar businessId no debe eliminar la unidad. " }
, {
t: "Auditor ?a " , d: "Registrar creadoPor / fechaCreacion (y cambios )
donde aplique . " }
, ] .map( (x)
= > ( <div key= {x.t}
className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( text)
_ 4 % )
] p 4 " > <div className= "font semibold" > {x.t}
< /div> <div className= "text sm opacity 7 5 mt 1 " > {x.d}
< /div> < /div> )
)
}
< /div> < /SectionCard> < /div> < /div> )
;
}