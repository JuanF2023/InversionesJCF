import React from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function FilosofiaDeDar ( )
{
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
return ( <section className= "spacey 3 " > <div className= {cx( "p 5 " , isNeo ? "neo card neo card deep neo card tinted" : "card" )
}
> <h3 className= "text lg font semibold text text" >Filosof 閾?a de Dar< /h3 > <p className= "text sm subtle" > (Mock)
Informaci璐?n basada en las 鐓?ltimas dos p璋?ginas del PDF 閳?娣?ndicadores de Inversi 璐?n JULIO 2 0 2 5 閳?? < /p> <ul className= "mt 3 list disc pl 5 text sm spacey 1 text text" > <li>Principios y fundamentos< /li> <li>Beneficios y compromisos< /li> <li>Ejemplos pr璋?cticos de dar< /li> < /ul> < /div> <div className= "text xs subtle" > * Cuando me digas, lo llenamos con el contenido real del documento. < /div> < /section > )
;
}