// client/src/components/movements/DynamicFields.jsx import React from "react" ;
export default function DynamicFields( {
fields = [ ] , values = {
}
, onChange }
)
{
function setVal(key, v)
{
onChange? . ( {
. . .values, [key] : v }
)
;
}
return ( <div className= "grid gap 3 " > {fields.map( (f)
= > {
const val = values[f.key] ? ? " " ;
const id = `fld $ {f.key}
` ;
if (f.type = = = "boolean " )
{
return ( <label key= {f.key}
className= "flex items center gap 2 " > <input type= "checkbox" checked = {
! !val}
onChange= {
(e)
= > setVal(f.key, e.target.checked )
}
/ > <span> {f.label}
< /span> < /label> )
;
}
if (f.type = = = "date" )
{
return ( <div key= {f.key}
> <label htmlfor = {id}
className= "text xs subtle" > {f.label}
< /label> <input id= {id}
type= "date" className= "input control md w full" value= {val ? String(val)
.slice( 0 , 1 0 )
: " " }
onChange= {
(e)
= > setVal(f.key, e.target.value)
}
/ > < /div> )
;
}
if (f.type = = = "money" | | f.type = = = "number" )
{
return ( <div key= {f.key}
> <label htmlfor = {id}
className= "text xs subtle" > {f.label}
{f.unit ? ` ( $ {f.unit}
)
` : " " }
< /label> <input id= {id}
type= "number" step= "any" className= "input control md w full" value= {val}
onChange= {
(e)
= > setVal(f.key, e.target.value)
}
/ > < /div> )
;
}
if (f.type = = = "select" & & Array.isArray (f.options )
& & f.options .length)
{
return ( <div key= {f.key}
> <label htmlfor = {id}
className= "text xs subtle" > {f.label}
< /label> <select id= {id}
className= "input control md w full" value= {val ? ? " " }
onChange= {
(e)
= > setVal(f.key, e.target.value)
}
> <option value= " " > ??Seleccione ?? /option> {f.options .map( (op)
= > <option key= {op.value}
value= {op.value}
> {op.label}
< /option> )
}
< /select> < /div> )
;
}
return ( <div key= {f.key}
> <label htmlfor = {id}
className= "text xs subtle" > {f.label}
< /label> <input id= {id}
className= "input control md w full" value= {val}
onChange= {
(e)
= > setVal(f.key, e.target.value)
}
/ > < /div> )
;
}
)
}
< /div> )
;
}