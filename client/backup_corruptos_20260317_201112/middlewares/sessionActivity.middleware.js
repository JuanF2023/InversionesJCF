// server/src/middlewares/sessionActivity.middleware.js import {
verifyToken }
from " @ /modules /auth/services/auth.service .js" ;
import Sessions from " @ /modules /corporativo/models/sessions.model.js" ;
export async function touchActivity(req, res, next)
{
try {
// evita bucle en endpoints de auth if (req.path.startsWith( " /auth" )
)
return next( )
;
const auth = String(req.headers .authorization | | " " )
;
const token = auth.startsWith( "Bearer " )
? auth.substring( 7 )
: null;
if ( !token)
return next( )
;
const payload = verifyToken(token)
;
// lanza si no es v?lido req.user = payload ;
// registra actividad (no mueve expiresAt / hard limit)
await Sessions.updateOne( {
token, active: true }
, {
$set: {
lastActivityAt : new Date( )
}
}
)
;
return next( )
;
}
catch {
return res.status( 4 0 1 )
.json( {
ok: false, message : "Sesi?n expirada o inv?lida. " }
)
;
}
}