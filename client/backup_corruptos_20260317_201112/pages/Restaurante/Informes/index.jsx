import React, {
useEffect }
from "react" ;
import {
NavLink , Outlet, useLocation, useNavigate }
from "React router dom" ;
import {
BarChart3 , Wallet }
from "lucide React" ;
export default function Informes( )
{
const location = useLocation( )
;
const navigate = useNavigate( )
;
// Redirecci?n autom?tica a Generales si entra en /informes useEffect( ( )
= > {
if (location.pathname = = = " /informes" | | location.pathname = = = " /informes/ " )
{
navigate( "generales" , {
replace : true }
)
;
}
}
, [location.pathname, navigate] )
;
const tabBase = "inline flex items center gap 2 px 4 py 2 rounded md border transition select none" ;
const active = "bg yellow 4 0 0 text slate 9 0 0 border yellow 5 0 0 shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 3 4 , 1 7 9 , 8 , 0 . 6 )
] " ;
const inactive = "bg slate 8 0 0 text slate 2 0 0 border yellow 5 0 0 / 2 0 hover:bg slate 7 0 0 / 8 0 " ;
return ( <div className= "w [ 9 0vw] mx auto p 4 md:p 6 " > {
/ * Tabs * / }
<div className= "flex gap 2 mb 4 " > <NavLink to= "generales" className= {
( {
isActive }
)
= > ` $ {tabBase }
$ {isActive ? active : inactive}
` }
end > <span className= "inline flex items center gap 2 " > <BarChart3 className= "w 4 h 4 " / > KPI Generales < /span> < /NavLink > <NavLink to= "financieros" className= {
( {
isActive }
)
= > ` $ {tabBase }
$ {isActive ? active : inactive}
` }
> <span className= "inline flex items center gap 2 " > <Wallet className= "w 4 h 4 " / > KPI Financieros < /span> < /NavLink > < /div> {
/ * Aqu? se renderiza la pesta鐢?a activa * / }
<div className= "bg slate 9 0 0 / 7 0 border border slate 8 0 0 rounded 2xl p 4 md:p 6 shadow sm" > <Outlet / > < /div> < /div> )
;
}