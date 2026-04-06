// client/src/services/api/ideas.api.js import http from " @ /services/api/HttpClient.js" ;
const BASE = " /ideas" ;
export async function listIdeas(params = {
}
)
{
const {
data }
= await http.get(BASE, {
params }
)
;
const items = data? .items ? ? data? .data ? ? data ? ? [ ] ;
return Array.isArray (items)
? items : [ ] ;
}
export async function createIdea(payload )
{
const {
data }
= await http.post(BASE, payload )
;
return data? .data ? ? data;
}
export async function updateIdea(id, payload )
{
const {
data }
= await http.put( ` $ {BASE}
/ $ {encodeURIComponent(id)
}
` , payload )
;
return data? .data ? ? data;
}
export async function deleteIdea(id)
{
const {
data }
= await http.delete( ` $ {BASE}
/ $ {encodeURIComponent(id)
}
` )
;
return data? .data ? ? true;
}