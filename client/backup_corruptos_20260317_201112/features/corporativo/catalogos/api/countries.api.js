import http from " @ /services/api/HttpClient.js" ;
export async function listCountries( )
{
const r = await http( " /api/countries" )
;
return r? .data ? ? r;
}
export async function getCountry(code)
{
if ( !code)
return null;
const r = await http( ` /api/countries/ $ {encodeURIComponent(code)
}
` )
;
return r? .data ? ? r;
}