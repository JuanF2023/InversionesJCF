// client/src/components/ui/forms/Field.jsx import React from "react" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
/ * * * Field * Wrapper consistente para label + control + hint + error. * No impone el tipo de control : t閻? pasas <input/ > / <select/ > / <textarea/ > . * / export default function Field( {
label, required = false, hint = " " , error = " " , className = " " , children, }
)
{
return ( <div className= {cx( "spacey 1 . 5 " , className)
}
> {label ? ( <label className= "form label" > {label}
{required ? <span className= "text red 5 0 0 " > * < /span> : null}
< /label> )
: null}
{children}
{error ? <p className= "form error" > {error}
< /p> : null}
{
!error & & hint ? <p className= "form hint" > {hint}
< /p> : null}
< /div> )
;
}
/ * * Helpers opcionales para estilo de input * / export function fieldControlClass( {
error, ok }
= {
}
)
{
return cx( "neo input w full" , error & & "ring 1 ring red 5 0 0 / 6 0 border red 5 0 0 / 5 0 focus:ring red 5 0 0 / 6 0 focus:border red 5 0 0 / 6 0 " , ok & & "ring 1 ring emerald 5 0 0 / 5 0 border emerald 5 0 0 / 4 0 focus:ring emerald 5 0 0 / 5 0 focus:border emerald 5 0 0 / 5 0 " )
;
}