// client/src/components/ui/layout/FormPageHeader .jsx import React from "react" ;
import {
useNavigate, useLocation }
from "React router dom" ;
import {
ChevronLeft }
from "lucide React" ;
/ * * * Encabezado est?ndar para formularios (crear/editar)
. * * Props: * title: string (requerido)
* subtitle? : string * onBack? : ( )
= > void ??si existe, se usa esta funci?n para volver * backLabel? : string ??texto del bot?n (defecto : "Volver" )
* rightSlot? : ReactNode ??acciones a la derecha (botones , etc. )
* / export default function FormPageHeader ( {
title, subtitle, onBack, backLabel = "Volver" , rightSlot, }
)
{
const navigate = useNavigate( )
;
const location = useLocation( )
;
const handleBackClick = ( )
= > {
// 1 )
Si el padre pasa una funci?n , la respetamos (caso negocios, propiedades, etc. )
if (typeof onBack = = = "function" )
{
onBack( )
;
return;
}
// 2 )
Si la ruta fue abierta con state.from, regresamos ah? const from = location.state? .from;
if (typeof from = = = "string" )
{
navigate(from, {
replace : true }
)
;
return;
}
// 3 )
Fallback: historial del navegador navigate( 1 )
;
}
;
return ( <header className= "neo plate neo plate tinted px 3 py 2 md:px 4 md:py 3 rounded 2xl flex flex col gap 2 md:flex row md:items center md:justify between " > {
/ * Izquierda: bot?n volver + t?tulos * / }
<div className= "flex items center gap 3 minw 0 " > <button type= "button" onClick = {handleBackClick}
className= " inline flex items center gap 1 . 5 rounded full px 3 py 1 . 5 text xs md:text sm font medium / * 妫?鐢? Degradado estilo glass premium * / bg [linear gradient( 1 3 5deg, color mix(in_srgb,var( panel)
_ 8 8 % ,var( accent)
_ 1 2 % )
0 % , color mix(in_srgb,var( panel)
_ 9 2 % ,var( accent)
_ 8 % )
1 0 0 % )
] / * Borde glass * / border border [color mix(in_srgb,var( border)
_ 6 5 % ,var( accent)
_ 1 5 % )
] / * Sombras suaves tipo card * / shadow sm backdrop blur [ 3px] / * Texto suave * / text [color mix(in_srgb,var( text)
_ 9 2 % ,var( accent)
_ 8 % )
] / * Hover * / hover:bg [linear gradient( 1 3 5deg, color mix(in_srgb,var( panel)
_ 7 5 % ,var( accent)
_ 2 5 % )
0 % , color mix(in_srgb,var( panel)
_ 8 0 % ,var( accent)
_ 2 0 % )
1 0 0 % )
] hover:border [color mix(in_srgb,var( accent)
_ 3 0 % ,var( border)
_ 7 0 % )
] hover:shadow md transition all duration 2 0 0 active:scale [ 0 . 9 7 ] " > <ChevronLeft className= "w 4 h 4 opacity 9 0 " / > <span className= "hidden sm:inline" > {backLabel}
< /span> < /button> <div className= "minw 0 " > <h1 className= "text sm md:text base font semibold text [color mix(in_srgb,var( text)
_ 9 5 % ,var( accent)
_ 5 % )
] truncate" > {title}
< /h1 > {subtitle & & ( <p className= "text [ 1 1px] md:text xs opacity 7 5 truncate" > {subtitle}
< /p> )
}
< /div> < /div> {
/ * Derecha : acciones opcionales * / }
{rightSlot & & ( <div className= "mt 1 md:mt 0 flex items center gap 2 " > {rightSlot}
< /div> )
}
< /header> )
;
}