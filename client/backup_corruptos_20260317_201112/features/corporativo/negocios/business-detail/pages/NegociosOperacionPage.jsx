// client/src/features/corporativo/Negocios/pages/NegociosOperacionPage .jsx import React, {
useMemo }
from "react" ;
import {
Briefcase, ClipboardList, TrendingUp }
from "lucide React" ;
import BusinessSelectBar from " @ /features/corporativo/negocios/components/BusinessSelectBar.jsx" ;
import {
useNegociosStore }
from " @ /features/corporativo/negocios/store/negocios.store.js" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
function Card( {
title, icon: Icon, children, className }
)
{
return ( <section className= {cx( "rounded 2xl border border [var( border)
] bg [var( panel)
] shadow sm" , className )
}
> <div className= "px 5 py 4 flex items center gap 3 border b border [var( border)
] " > {Icon ? <Icon size= {
1 8 }
className= "opacity 8 0 " / > : null}
<h2 className= "font semibold" > {title}
< /h2 > < /div> <div className= "p 5 " > {children}
< /div> < /section > )
;
}
function FieldRow( {
label, value }
)
{
return ( <div className= "flex items center justify between gap 4 py 2 border b border [color mix(in_srgb,var( border)
_ 7 0 % ,transparent)
] last:borderb 0 " > <div className= "text sm opacity 7 0 " > {label}
< /div> <div className= "text sm font medium" > {value}
< /div> < /div> )
;
}
export default function NegociosOperacionPage ( )
{
const items = useNegociosStore( (s)
= > s.items)
;
const stats = useMemo ( ( )
= > {
const list = Array.isArray (items)
? items : [ ] ;
const isActivo = (n)
= > String(n? .estadoOperacion ? ? n? .estado ? ? n? .status ? ? " " )
.toUpperCase( )
.trim( )
= = = "ACTIVO" ;
const activos = list.filter(isActivo)
.length;
return {
total: list.length, activos , inactivos: Math.max( 0 , list.length activos )
, }
;
}
, [items] )
;
return ( <div className= "spacey 5 " > <BusinessSelectBar / > <div className= "grid grid cols 1 lg:grid cols 2 gap 4 " > <Card title= "Datos operativos" icon= {Briefcase}
> <div className= "text sm opacity 8 0 mb 3 " > Esta secci?n debe mostrar la ?濞?oto operativa??del negocio seleccionado (o global si no hay selecci ?n )
. < /div> <div className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( text)
_ 4 % )
] p 4 " > <FieldRow label= "Estado" value= "ACTIVO" / > <FieldRow label= "Tipo / Clasificaci?n " value= " ?? / > <FieldRow label= "Ciudad / Zona" value= " ?? / > <FieldRow label= "Direcci ?n " value= " ?? / > < /div> < /Card> <Card title= "Indicadores operativos" icon= {TrendingUp}
> <div className= "grid grid cols 1 md:grid cols 3 gap 3 " > {
[ {
label: "Total" , value: stats.total }
, {
label: "Activos " , value: stats.activos }
, {
label: "Inactivos" , value: stats.inactivos }
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
< /div> <div className= "mt 4 text sm opacity 8 0 " > Aqu? luego metemos KPIs por rubro (ocupaci ?n , rotaci?n , tickets , entregas, etc. )
. < /div> < /Card> <Card title= "Checklist operativo" icon= {ClipboardList}
className= "lg:col span 2 " > <div className= "grid grid cols 1 md:grid cols 3 gap 3 " > {
[ {
t: "Cat?logo OK" , d: "Clasificaci?n / tipo correcto" }
, {
t: "Unidades OK" , d: "Asignaci?n consistente" }
, {
t: "Finanzas OK" , d: "Bancos / cuentas alineadas" }
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
< /div> < /Card> < /div> < /div> )
;
}