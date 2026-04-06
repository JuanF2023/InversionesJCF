// src/utils/format.js const MONTHS_SHORT_ES = [ "Ene" , "Feb" , "Mar" , "Abr" , "May" , "Jun" , "Jul" , "Ago" , "Sep" , "Oct" , "Nov" , "Dic" ] ;
/ * * $ formateado * / export function money(n, currency = "USD" , locale = "es US" )
{
return new Intl.NumberFormat(locale, {
style: "currency" , currency }
)
.format(Number(n | | 0 )
)
;
}
/ * * " 2 0 2 5 0 9 " > "Sep 2 0 2 5 " * / export function ymHuman (ym)
{
if ( !ym)
return " ?? ;
const [y, m] = String(ym)
.split( " " )
;
const idx = Math.max( 0 , Math.min( 1 1 , Number(m)
1 )
)
;
return ` $ {MONTHS_SHORT_ES[idx] }
$ {y}
` ;
}
/ * * Diferencia en a鐢?os/meses (enteros , ignorando d?as)
entre fechas * / export function diffAniosMeses (a, b)
{
const d1 = new Date(a)
;
const d2 = new Date(b)
;
if (isNaN(d1 )
| | isNaN(d2 )
)
return {
anios: 0 , meses: 0 }
;
let y = d2 .getFullYear( )
d1 .getFullYear( )
;
let m = d2 .getMonth( )
d1 .getMonth( )
;
if (m < 0 )
{
y = 1 ;
m + = 1 2 ;
}
return {
anios: Math.max( 0 , y)
, meses: Math.max( 0 , m)
}
;
}
/ * * " 2 a鐢?os 3 meses" a partir de dos fechas * / export function humanizeYM(a, b)
{
const {
anios, meses }
= diffAniosMeses (a, b)
;
const pa = anios ? ` $ {anios}
a鐢?o $ {anios > 1 ? "s" : " " }
` : " " ;
const pm = meses ? ` $ {meses}
mes$ {meses > 1 ? "es" : " " }
` : " " ;
return [pa, pm] .filter(Boolean )
.join( " " )
;
}
/ * * yyyy mm dd (padded)
* / export function formatFechaCortaISO(dateLike)
{
const d = dateLike ? new Date(dateLike)
: new Date( )
;
if (isNaN(d)
)
return " " ;
const y = d.getFullYear( )
;
const m = String(d.getMonth( )
+ 1 )
.padStart( 2 , " 0 " )
;
const day = String(d.getDate ( )
)
.padStart( 2 , " 0 " )
;
return ` $ {y}
$ {m}
$ {day}
` ;
}
/ * = = = = = Alias para imports existentes = = = = = * / // Evita cambios en el resto del c?digo export const formatMoney = money;
export const formatMesYYYY = ymHuman ;
// "Sep 2 0 2 5 " export const monthLabel = ymHuman ;
// alias adicional