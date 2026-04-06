// client/src/components/ui/layout/FormFooter.jsx import React from "react" ;
import {
Loader2 , Save, Plus }
from "lucide React" ;
import SecondaryButton from " @ /components/ui/primitives/SecondaryButton.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
// Iconos permitidos (evita pasar componentes y romper consistencia)
const ICONS = {
save: Save, plus: Plus, }
;
export default function FormFooter( {
onCancel, isSubmitting = false, canSubmit = true, submitLabel = "Guardar " , submitIcon = "save" , // "save" | "plus" leftHint = " " , cancelLabel = "Cancelar" , }
)
{
const Icon = ICONS[submitIcon] | | Save;
const disabled = !canSubmit | | isSubmitting;
return ( <div className= "flex flex col md:flex row md:items center md:justify between gap 3 pt 3 border t border [var( border)
] / 7 0 " > <p className= "text [ 1 1px] opacity 7 0 minh [ 1 4px] " > {leftHint ? leftHint : " " }
< /p> <div className= "flex items center justify end gap 2 " > <SecondaryButton type= "button" onClick = {onCancel}
disabled= {isSubmitting}
> {cancelLabel}
< /SecondaryButton> <button type= "submit" disabled= {disabled}
className= {cx( "btn gradient btn action control md btn shimmer inline flex items center gap 2 text sm font semibold" , disabled & & "opacity 6 0 cursor not allowed " )
}
aria disabled= {disabled}
> {isSubmitting ? ( < > <Loader2 className= "w 4 h 4 animate spin" / > Guardando?? < / > )
: ( < > <Icon className= "w 4 h 4 " / > {submitLabel}
< / > )
}
< /button> < /div> < /div> )
;
}