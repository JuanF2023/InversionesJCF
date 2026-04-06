import React from "react" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function AcercaDe( )
{
const {
theme }
= useTheme( )
;
const isNeo = theme? .startsWith( "neo" )
;
return ( <section className= "spacey 3 " > <div className= {cx( "p 5 " , isNeo ? "neo card neo card deep neo card tinted" : "card" )
}
> <h3 className= "text lg font semibold text text" >Acerca de esta iniciativa< /h3 > <p className= "text sm subtle" > Aqu閾? ir璋? el contenido de la primera p璋?gina del PDF <i> 閳?娣?ndicadores de Inversi 璐?n JULIO 2 0 2 5 閳?? /i> . (Mock)
Agrega visi璐?n , misi璐?n , objetivos y estrategia general resumida. < /p> < /div> <div className= "text xs subtle" > * Cuando quieras , puedo extraer y dar formato al texto del PDF en este bloque. < /div> < /section > )
;
}