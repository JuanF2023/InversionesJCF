// client/src/components/ui/layout/FormSectionCard.jsx import React from "react" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function FormSectionCard( {
title, subtitle, description, right, children, className, }
)
{
const sub = subtitle | | description | | " " ;
return ( <section className= {cx( "w full rounded 2xl ring 1 ring border" , "bg [var( panel)
] / 4 0 p 3 md:p 4 spacey 3 " , className )
}
> {
(title | | sub | | right)
& & ( <div className= "flex items start justify between gap 2 " > <div> {title & & ( <h3 className= "text sm font semibold tracking wide" > {title}
< /h3 > )
}
{sub & & ( <p className= "text [ 1 1px] md:text xs subtle mt 0 . 5 " > {sub}
< /p> )
}
< /div> {right ? <div className= "shrink 0 " > {right}
< /div> : null}
< /div> )
}
<div className= "w full" > {children}
< /div> < /section > )
;
}