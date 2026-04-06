import {
useMemo }
from "react" ;
import {
useTheme }
from " . . / . . / . . /context /ThemeContext.jsx" ;
export const THEMES = [ // Claros {
id: "neo ice" , label: "Neo Ice" , group: "Claros" }
, {
id: "neo mint" , label: "Neo Mint" , group: "Claros" }
, {
id: "neo dawn" , label: "Neo Dawn" , group: "Claros" }
, {
id: "neo stone" , label: "Neo Stone" , group: "Claros" }
, // Oscuros {
id: "neo ocean" , label: "Neo Ocean" , group: "Oscuros " }
, {
id: "neo plum" , label: "Neo Plum" , group: "Oscuros " }
, {
id: "neo dusk" , label: "Neo Dusk" , group: "Oscuros " }
, {
id: "neo graphite" , label: "Neo Graphite" , group: "Oscuros " }
, {
id: "neo dark" , label: "Neo Dark" , group: "Oscuros " }
, ] ;
export default function ThemeSwitcher( {
className = " " }
)
{
const {
theme, setTheme }
= useTheme( )
;
const grouped = useMemo ( ( )
= > THEMES.reduce( (acc, t)
= > ( (acc[t.group] ? ? = [ ] )
.push(t)
, acc)
, {
}
)
, [ ] )
;
const value = THEMES.some(t = > t.id = = = theme)
? theme : "neo ice" ;
return ( <label className= {
`inline flex items center gap 2 $ {className}
` }
> <span id= "lbl theme" className= "sr only" >Cambiar tema< /span> <select aria describedby= "lbl theme" value= {value}
onChange= {
(e)
= > setTheme(e.target.value | | "neo ice" )
}
className= "neo card text sm px 3 py 1 . 5 focus:outline none focus:ring 2 focus:ring [var( accent)
] " title= "Cambiar tema" aria label= "Cambiar tema" > {Object.entries (grouped )
.map( ( [group, items] )
= > ( <optgroup key= {group}
label= {group}
> {items.map( (t)
= > ( <option key= {t.id}
value= {t.id}
> {t.label}
< /option> )
)
}
< /optgroup> )
)
}
< /select> < /label> )
;
}