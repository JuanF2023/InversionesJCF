// client/src/features/corporativo/Negocios/pages/NegociosConfiguracionPage.jsx import React from "react" ;
import {
Settings, Shield, SlidersHorizontal }
from "lucide React" ;
import BusinessSelectBar from " @ /features/corporativo/negocios/components/BusinessSelectBar.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
function SectionCard( {
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
function ToggleRow( {
label, desc, value = false }
)
{
return ( <div className= "flex items start justify between gap 4 py 3 border b border [color mix(in_srgb,var( border)
_ 7 0 % ,transparent)
] last:borderb 0 " > <div> <div className= "font medium" > {label}
< /div> <div className= "text sm opacity 7 5 mt 0 . 5 " > {desc}
< /div> < /div> <div className= {cx( "w 1 2 h 7 rounded full border border [var( border)
] p 1 transition" , value ? "bg [color mix(in_srgb,var( accent)
_ 3 5 % ,var( panel)
_ 6 5 % )
] " : "bg [color mix(in_srgb,var( panel)
_ 8 0 % ,var( text)
_ 6 % )
] " )
}
aria hidden= "true" > <div className= {cx( "w 5 h 5 rounded full bg [var( text)
] transition" , value ? "translatex 5 " : "translatex 0 " )
}
/ > < /div> < /div> )
;
}
export default function NegociosConfiguracionPage( )
{
return ( <div className= "spacey 5 " > <BusinessSelectBar / > <div className= "grid grid cols 1 lg:grid cols 2 gap 4 " > <SectionCard title= "Par?metros del negocio " icon= {SlidersHorizontal}
> <div className= "text sm opacity 8 0 mb 3 " > Configuraci?n enfocada al negocio seleccionado (si no hay selecci ?n , muestra global/placeholder)
. < /div> <div className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( text)
_ 4 % )
] p 4 " > <div className= "text sm opacity 8 0 " > Aqu? conectas campos reales: nombre, alias, estado, tipo, ubicaci ?n , etc. < /div> < /div> < /SectionCard> <SectionCard title= "Acceso y permisos" icon= {Shield}
> <div className= "text sm opacity 8 0 mb 3 " > (Opcional)
Si habilitas RBAC por negocio , esta secci?n vive aqu?. < /div> <div className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 9 2 % ,var( text)
_ 4 % )
] p 4 " > <ToggleRow label= "Restringir visibilidad" desc= "Solo supervisor/gerente puede ver todos los negocios. " value= {false}
/ > <ToggleRow label= "Modo auditor ?a " desc= "Registrar cambios cr?ticos en bit?cora. " value= {true}
/ > < /div> < /SectionCard> <SectionCard title= "Preferencias" icon= {Settings}
className= "lg:col span 2 " > <div className= "grid grid cols 1 md:grid cols 3 gap 3 " > {
[ {
t: "Moneda" , v: "USD" }
, {
t: "Zona horaria " , v: "America /El_Salvador" }
, {
t: "Idioma" , v: "Espa鐢?ol" }
, ] .map( (x)
= > ( <div key= {x.t}
className= "rounded 2xl border border [var( border)
] bg [color mix(in_srgb,var( panel)
_ 8 8 % ,var( text)
_ 6 % )
] p 4 " > <div className= "text xs opacity 7 0 " > {x.t}
< /div> <div className= "text lg font semibold mt 1 " > {x.v}
< /div> < /div> )
)
}
< /div> < /SectionCard> < /div> < /div> )
;
}