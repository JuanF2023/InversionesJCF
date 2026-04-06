// client/src/features/corporativo/access/api/catalogo negocios.api.js import http from " @ /services/api/HttpClient.js" ;
/ * * * Cat?logo de negocios (Corporativo)
??API client (enterprise)
* * Contrato esperado: * GET /catalogos/negocios * POST /catalogos/negocios * PATCH /catalogos/negocios/ :key * * Ajusta BASE si tu backend monta en otra ruta. * / const BASE = " /catalogos/negocios" ;
export async function fetchcatalogo negocios(params = {
}
)
{
const res = await http.get(BASE, {
params }
)
;
return res? .data ? ? res;
}
export async function createCatalogoItem(payload )
{
const res = await http.post(BASE, payload )
;
return res? .data ? ? res;
}
export async function updateCatalogoItem(key, payload )
{
const id = String(key ? ? " " )
.trim( )
;
if ( !id)
throw new Error( "updateCatalogoItem: key requerido" )
;
const res = await http.patch( ` $ {BASE}
/ $ {encodeURIComponent(id)
}
` , payload )
;
return res? .data ? ? res;
}