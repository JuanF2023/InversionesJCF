// client/src/features/corporativo/Negocios/pages/NegociosFinanzasPage.jsx import React from "react" ;
import {
useNavigate }
from "React router dom" ;
import {
Landmark, Wallet, ArrowUpRight, ReceiptText, BarChart3 }
from "lucide React" ;
import BusinessSelectBar from " @ /features/corporativo/negocios/components/BusinessSelectBar.jsx" ;
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
function ActionTile( {
icon: Icon, title, desc, onClick }
)
{
return ( <button type= "button" onClick = {onClick }
className= {cx( "w full text left rounded 2xl border border [var( border)
] p 4 " , "bg [color mix(in_srgb,var( panel)
_ 7 8 % ,var( text)
_ 6 % )
] " , "hover:bg [color mix(in_srgb,var( panel)
_ 7 2 % ,var( text)
_ 9 % )
] transition" )
}
> <div className= "flex items center gap 2 " > <Icon size= {
1 8 }
className= "opacity 8 0 " / > <div className= "font semibold" > {title}
< /div> <ArrowUpRight size= {
1 6 }
className= "ml auto opacity 7 0 " / > < /div> <div className= "text sm opacity 7 5 mt 1 " > {desc}
< /div> < /button> )
;
}
export default function NegociosFinanzasPage( )
{
const nav = useNavigate( )
;
return ( <div className= "spacey 5 " > <BusinessSelectBar / > <div className= "grid grid cols 1 lg:grid cols 2 gap 4 " > <SectionCard title= "Estructura financiera" icon= {Wallet}
> <div className= "text sm opacity 8 0 " > Regla enterprise: <b>Banco ??Cuenta ??Transacci?n < /b> . Esto evita deuda t閼?cnica. < /div> <div className= "mt 4 grid grid cols 1 md:grid cols 2 gap 3 " > <ActionTile icon= {Landmark}
title= "Bancos" desc= "Instituciones financieras (cat?logo)
. " onClick = {
( )
= > nav( " /corporativo/negocios/finanzas" )
}
/ > <ActionTile icon= {Wallet}
title= "Cuentas " desc= "Instrumentos: cuenta, caja, Stripe, etc. (por negocio )
. " onClick = {
( )
= > nav( " /corporativo/negocios/finanzas" )
}
/ > <ActionTile icon= {ReceiptText}
title= "Transacciones" desc= "Movimientos: ingresos, egresos , transferencias . " onClick = {
( )
= > nav( " /corporativo/transacciones/lista" )
}
/ > <ActionTile icon= {BarChart3 }
title= "Reportes" desc= "Cierres , mensual , comparativos. " onClick = {
( )
= > nav( " /corporativo/informes/resumen " )
}
/ > < /div> < /SectionCard> <SectionCard title= "Resumen r?pido" icon= {BarChart3 }
right= {
<button type= "button" onClick = {
( )
= > nav( " /corporativo/transacciones/lista" )
}
className= "text sm inline flex items center gap 2 opacity 8 0 hover:opacity 1 0 0 transition" > Ver transacciones <ArrowUpRight size= {
1 6 }
/ > < /button> }
> <div className= "grid grid cols 1 md:grid cols 3 gap 3 " > {
[ {
label: "Ingresos (mes)
" , value: " $ ?? }
, {
label: "Egresos (mes)
" , value: " $ ?? }
, {
label: "Neto (mes)
" , value: " $ ?? }
, ] .map( (x)
= > ( <div key= {x.label}
className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 8 8 % ,var( text)
_ 6 % )
] p 4 " > <div className= "text xs opacity 7 0 " > {x.label}
< /div> <div className= "text 2xl font semibold mt 1 " > {x.value}
< /div> < /div> )
)
}
< /div> <div className= "mt 4 text sm opacity 8 0 " > Aqu? luego conectamos datos reales (por negocio seleccionado)
con tu store/API. < /div> < /SectionCard> < /div> < /div> )
;
}