export default function useRolActual( )
{
const user = JSON.parse(localStorage.getItem ( "usuarioLogeado " )
)
;
return user? .rol | | null;
}