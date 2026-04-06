// client/src/services/api/businessSummary.api.js import {
apiFetch }
from " . /api" ;
/ * * * Obtiene resumen global de negocios. * Construye un querystring flexible: * ids: lista separada por comas * ym, year, range: filtros opcionales * / export async function getBusinessesSummary( {
ids = [ ] , ym, year, range }
= {
}
)
{
const params = new URLSearchParams( )
;
if (Array.isArray (ids)
& & ids.length)
{
params.set( "ids" , ids.join( " , " )
)
;
}
if (ym)
params.set( "ym" , ym)
;
if (year)
params.set( "year" , String(year)
)
;
if (range)
params.set( "range" , range)
;
const query = params.toString( )
? ` ? $ {params.toString( )
}
` : " " ;
// OJO: aqu? NO ponemos " /api" al inicio const {
ok, data }
= await apiFetch( ` /corporativo/businesses/summary $ {query}
` , {
method: "GET" , errorMessage: "No se pudo cargar resumen de negocios" , }
)
;
if ( !ok)
return {
data: null }
;
return {
data }
;
}
/ * * * Obtiene resumen de un negocio espec?fico. * / export async function getBusinessSummary(id, {
ym, year, range }
= {
}
)
{
const params = new URLSearchParams( )
;
if (ym)
params.set( "ym" , ym)
;
if (year)
params.set( "year" , String(year)
)
;
if (range)
params.set( "range" , range)
;
const query = params.toString( )
? ` ? $ {params.toString( )
}
` : " " ;
const {
ok, data }
= await apiFetch( ` /corporativo/businesses/ $ {id}
/summary $ {query}
` , {
method: "GET" , errorMessage: "No se pudo cargar resumen del negocio " , }
)
;
if ( !ok)
return {
data: null }
;
return {
data }
;
}