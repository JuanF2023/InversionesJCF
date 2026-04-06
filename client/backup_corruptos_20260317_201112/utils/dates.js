// client/src/utils/dates.js export const diffAniosMeses = (fromIso )
= > {
if ( !fromIso )
return " ?? ;
const start = new Date(fromIso )
;
const now = new Date( )
;
let years = now.getFullYear( )
start.getFullYear( )
;
let months = now.getMonth( )
start.getMonth( )
;
if (months < 0 )
{
years ;
months + = 1 2 ;
}
return ` $ {years}
a鐢?o (s)
$ {months}
mes(es)
` ;
}
;