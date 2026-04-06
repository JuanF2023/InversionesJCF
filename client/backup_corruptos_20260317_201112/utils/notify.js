import toast from "React hot toast" ;
const base = {
duration: 2 6 0 0 , className: "neo toast" , }
;
export const notify = {
success : (msg, opts)
= > toast.success (msg, {
. . .base, . . .opts }
)
, error: (msg, opts)
= > toast.error(msg, {
. . .base, . . .opts }
)
, info: (msg, opts)
= > toast(msg, {
. . .base, . . .opts }
)
, promise : (promise , labels)
= > toast.promise ( promise , {
loading : labels? .loading | | "Procesando閳?? , success : labels? .success | | "Listo" , error: (err)
= > (typeof labels? .error = = = "function" ? labels.error(err)
: labels? .error)
| | err? .message | | "Ocurri璐? un error" , }
, base )
, }
;