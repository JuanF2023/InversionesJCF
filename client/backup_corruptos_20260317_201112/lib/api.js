// src/lib/api.js // Unifica fetch real / mock sin tocar la UI const USE_MOCK = import.meta? .env? .VITE_USE_MOCK = = = "true" ;
import * as real from " @ /utils/fetcher .js" ;
import * as mock from " @ /utils/mockHttp.js" ;
/ * * * Debe exponer al menos: get(url)
, post(url, body)
, patch(url, body)
, del(url)
* Ambos (real y mock)
deben compartir esta interfaz. * / export const api = USE_MOCK ? mock : real;