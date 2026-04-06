// client/src/utils/media.js const API_BASE = (import.meta.env.VITE_API_URL | | " " )
.replace ( / \ / + $ / , " " )
;
/ * * * Normaliza cualquier ?濞?ath / url / key??de media a una URL utilizable en <img src> . * Acepta: * URL absoluta: https://. . . * Path relativo: /uploads /xxx.jpg * Key/filename: xxx.jpg (se arma con /uploads )
* / export function mediaUrl(input)
{
if ( !input)
return " " ;
const s = String(input)
.trim( )
;
if ( !s)
return " " ;
// Ya es URL absoluta if ( / ^https? : \ / \//i .test(s)
)
return s;
// Path relativo ya con slash if (s.startsWith( " / " )
)
{
// Si API_BASE existe, sirve media desde backend . Si no, devuelve path. return API_BASE ? ` $ {API_BASE}
$ {s}
` : s;
}
// Key suelta > asumir /uploads / <key> return API_BASE ? ` $ {API_BASE}
/uploads / $ {encodeURIComponent(s)
}
` : ` /uploads / $ {encodeURIComponent(s)
}
` ;
}
/ * * * Alias sem?ntico para usar directamente en <img src> . * Mantengo ambos nombres para evitar futuros errores por imports inconsistentes . * / export function mediaSrc(input)
{
return mediaUrl(input)
;
}
export default {
mediaUrl, mediaSrc }
;