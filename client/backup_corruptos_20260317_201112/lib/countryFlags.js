// client/src/lib/countryFlags.js / * * Sanitiza texto b?sico * / function cleanUiText(v)
{
if (v = = null)
return " " ;
return String(v)
.replace ( / \uFEFF/g, " " )
.replace ( / [ \u2 0 0B \u2 0 0D\u2 0 6 0 ] /g, " " )
.replace ( / [ \u0 0 0 0 \u0 0 1F\u0 0 7F \u0 0 9F] /g, " " )
.replace ( / \uFFFD/g, " " )
.trim( )
;
}
function normalizeCountryCode(v)
{
const s = cleanUiText(v)
.toUpperCase( )
;
return / ^ [A Z] {
2 }
$ / .test(s)
? s : " " ;
}
function inferCountryCodeFromName(pais)
{
const s = cleanUiText(pais)
.toLowerCase( )
;
if ( !s)
return " " ;
const map = new Map( [ [ "el salvador" , "SV" ] , [ "elsalvador" , "SV" ] , [ "guatemala" , "GT" ] , [ "honduras" , "HN" ] , [ "nicaragua" , "NI" ] , [ "costa rica" , "CR" ] , [ "costarica" , "CR" ] , [ "panam?" , "PA" ] , [ "panama" , "PA" ] , [ "m閼?xico" , "MX" ] , [ "mexico" , "MX" ] , // EEUU / USA [ "estados unidos" , "US" ] , [ "united states" , "US" ] , [ "usa" , "US" ] , [ "u.s.a" , "US" ] , [ "u.s. " , "US" ] , [ "eeuu" , "US" ] , [ "e.e.u.u" , "US" ] , ] )
;
for (const [k, code] of map.entries ( )
)
{
if (s.includes(k)
)
return code;
}
return " " ;
}
/ * * * Obtiene c?digo de pa?s robusto desde ubicacion. * Acepta ubicacion.paisCode / countryCode / codigoPais / pais (si viene "SV" )
/ pais (si viene nombre)
* / export function getCountryCodeFromUbicacion(ubicacion)
{
if ( !ubicacion | | typeof ubicacion ! = = "object" )
return " " ;
return ( normalizeCountryCode(ubicacion.paisCode)
| | normalizeCountryCode(ubicacion.countryCode)
| | normalizeCountryCode(ubicacion.codigoPais)
| | normalizeCountryCode(ubicacion.pais)
| | // si pais ya viene "SV" o "US" inferCountryCodeFromName(ubicacion.pais)
// si pais viene "El Salvador" , etc. )
;
}
/ * * Convierte "US" > 妫?閸?妫?閸? * / export function flagEmojiFromCode(code)
{
const cc = normalizeCountryCode(code)
;
if ( !cc)
return " " ;
const OFFSET = 0x1f1e6 ;
// regional indicator A const A = 6 5 ;
return cc .split( " " )
.map( (c)
= > String.fromCodePoint(OFFSET + (c.charCodeAt( 0 )
A)
)
)
.join( " " )
;
}
/ * * Devuelve /flags/ {size}
/ {cc}
.png si el cc es v?lido (local first)
* / export function flagLocalFromCode(code, size = "w4 0 " )
{
const cc = String(code | | " " )
.trim( )
.toLowerCase( )
;
if ( ! / ^ [a z] {
2 }
$ / .test(cc)
)
return " " ;
return ` /flags/ $ {size}
/ $ {cc}
.png` ;
}
/ * * Fallback externo opcional (si lo quieres )
. * / export function flagCdnFromCode(code, size = "w4 0 " )
{
const cc = String(code | | " " )
.trim( )
.toLowerCase( )
;
if ( ! / ^ [a z] {
2 }
$ / .test(cc)
)
return " " ;
return `https://flagcdn.com/ $ {size}
/ $ {cc}
.png` ;
}