import React, {
useState }
from "react" ;
import {
Pencil, Power, UserPlus, ShieldPlus }
from "lucide React" ;
import useRolActual from " . . / . . / . . /hooks/useRolActual" ;
const restaurantesDisponibles = [ "Restaurante 0 1 " , "Restaurante 0 2 " ] ;
export default function Usuarios( )
{
const rolActual = useRolActual( )
;
const [usuarios, setUsuarios] = useState( [ {
id: 1 , nombre: "Ana" , apellido: "L璐?pez" , pin: " 1 2 3 4 " , telefono: " 5 0 3 7 0 1 2 3 4 5 6 " , correo: "ana@restaurante.com" , rol: "Mesera" , restaurante: "Restaurante 0 1 " , activo: false, }
, {
id: 2 , nombre: "Juan Carlos Flores" , apellido: "Palacios" , pin: " 7 7 9 7 " , telefono: " 3 2 3 9 0 7 8 5 1 6 " , correo: "juanito 0 0 3 0 1 3 _ @hotmail .com" , rol: "Gerente " , restaurante: "Restaurante 0 1 " , activo: true, }
, ] )
;
const [roles, setRoles] = useState( [ "Mesera" , "Cocinero" , "Gerente " ] )
;
const [formulario, setFormulario] = useState( {
id: null, nombre: " " , apellido: " " , pin: " " , telefono: " " , correo: " " , rol: " " , restaurante: " " , }
)
;
const [modoEdicion, setModoEdicion ] = useState(false)
;
const [nuevoRol, setNuevoRol] = useState( " " )
;
const [busqueda, setBusqueda] = useState( " " )
;
const handleChange = (e)
= > {
setFormulario( {
. . .formulario, [e.target.name] : e.target.value }
)
;
}
;
const handleCancelar = ( )
= > {
setFormulario( {
id: null, nombre: " " , apellido: " " , pin: " " , telefono: " " , correo: " " , rol: " " , restaurante: " " , }
)
;
setModoEdicion (false)
;
}
;
const guardarUsuario = ( )
= > {
if ( !formulario.nombre | | !formulario.apellido | | !formulario.pin | | !formulario.rol | | !formulario.restaurante)
return;
if (modoEdicion)
{
setUsuarios( usuarios.map( (u)
= > u.id = = = formulario.id ? {
. . .formulario, activo: true }
: u )
)
;
setModoEdicion (false)
;
}
else {
const nuevo = {
. . .formulario, id: Date.now( )
, activo: true, }
;
setUsuarios( [ . . .usuarios, nuevo] )
;
}
setFormulario( {
id: null, nombre: " " , apellido: " " , pin: " " , telefono: " " , correo: " " , rol: " " , restaurante: " " , }
)
;
}
;
const toggleActivoUsuario = (id)
= > {
setUsuarios( usuarios.map( (u)
= > u.id = = = id ? {
. . .u, activo: !u.activo }
: u )
)
;
}
;
const editarUsuario = (usuario )
= > {
setFormulario(usuario )
;
setModoEdicion (true)
;
}
;
const agregarRol = ( )
= > {
if (nuevoRol & & !roles.includes(nuevoRol)
)
{
setRoles( [ . . .roles, nuevoRol] )
;
setNuevoRol( " " )
;
}
}
;
const usuariosFiltrados = usuarios.filter( (u)
= > u.nombre.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
| | u.apellido.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
| | u.correo.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
)
;
const camposRequeridosCompletos = formulario.nombre & & formulario.apellido & & formulario.pin & & formulario.rol & & formulario.restaurante;
return ( <div className= "p 6 " > <h2 className= "text 2xl font bold mb 4 text white" >Usuarios del Restaurante< /h2 > <div className= "flex flex col lg:flex row gap 6 " > {
/ * Formulario de usuario * / }
<div className= "w full lg:w 1 / 2 bg gradient to r from slate 8 0 0 to slate 7 0 0 border border yellow 4 0 0 rounded xl p 6 shadow text white" > <h3 className= "text lg font bold mb 3 text yellow 3 0 0 flex items center gap 2 " > <UserPlus size= {
2 0 }
/ > {modoEdicion ? "Editar usuario " : "Agregar usuario " }
< /h3 > <div className= "grid grid cols 1 gap 3 " > <input name= "nombre" value= {formulario.nombre}
onChange= {handleChange}
placeholder= "Nombre" className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > <input name= "apellido" value= {formulario.apellido}
onChange= {handleChange}
placeholder= "Apellidos" className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > <input name= "pin" value= {formulario.pin}
onChange= {handleChange}
placeholder= "PIN de ingreso " className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > <input name= "telefono" value= {formulario.telefono}
onChange= {handleChange}
placeholder= "Tel鑼?fono" className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > <input name= "correo" value= {formulario.correo}
onChange= {handleChange}
placeholder= "Correo electr璐?nico" className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > <select name= "rol" value= {formulario.rol}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " > <option value= " " >Seleccione rol< /option> {roles.map( (r)
= > <option key= {r}
> {r}
< /option> )
}
< /select> <select name= "restaurante" value= {formulario.restaurante}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " > <option value= " " >Seleccione restaurante< /option> {restaurantesDisponibles.map( (r)
= > <option key= {r}
> {r}
< /option> )
}
< /select> < /div> <div className= "mt 4 flex items center justify end gap 3 " > <button onClick = {handleCancelar }
type= "button" className= "px 4 py 2 rounded border border slate 6 0 0 text slate 2 0 0 bg slate 8 0 0 hover:bg slate 7 0 0 hover:border slate 5 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 / 5 0 transition all" > Cancelar < /button> <button onClick = {guardarUsuario }
type= "button" disabled= {
!camposRequeridosCompletos}
className= {
`font semibold px 4 py 2 rounded transition all $ {camposRequeridosCompletos ? "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black" : "bg yellow 4 0 0 / 5 0 text black/ 7 0 cursor not allowed " }
` }
> {modoEdicion ? "Guardar cambios " : "Guardar usuario " }
< /button> < /div> {
/ * Crear nuevo rol * / }
<div className= "mt 6 border t border yellow 4 0 0 pt 4 " > <h4 className= "text md font semibold text yellow 3 0 0 mb 2 flex items center gap 2 " > <ShieldPlus size= {
1 8 }
/ > Crear nuevo rol < /h4 > <div className= "flex gap 2 " > <input value= {nuevoRol}
onChange= {
(e)
= > setNuevoRol(e.target.value)
}
placeholder= "Ej. Cajero" className= "flex 1 rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > <button onClick = {agregarRol}
className= "bg green 6 0 0 hover:bg green 7 0 0 text white px 4 py 2 rounded " > Agregar < /button> < /div> <ul className= "list disc list inside mt 2 text white" > {roles.map( (r)
= > <li key= {r}
> {r}
< /li> )
}
< /ul> < /div> < /div> {
/ * Lista de usuarios * / }
<div className= "w full lg:w 1 / 2 rounded xl p 4 maxh [ 6 0 0px] overflowyauto bg gradient to br from slate 9 0 0 via slate 9 0 0 / 9 0 to slate 9 5 0 border border yellow 5 0 0 shadow inner" > <h3 className= "text lg font bold text yellow 3 0 0 mb 3 flex justify between items center" > Usuarios registrados <span className= "text sm font normal text slate 3 0 0 " > ( {usuarios.length}
)
< /span> < /h3 > {
/ * B鐓?squeda (oscura)
* / }
<input type= "text" placeholder= "Buscar usuario . . . " value= {busqueda}
onChange= {
(e)
= > setBusqueda(e.target.value)
}
className= "mb 3 w full px 3 py 2 rounded md bg slate 9 0 0 / 7 0 border border slate 7 0 0 text slate 1 0 0 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 / 6 0 focus:border yellow 4 0 0 / 6 0 " / > {usuariosFiltrados.map( (u)
= > ( <div key= {u.id}
className= {
[ "relative rounded xl p 4 mb 4 border transition all" , "bg gradient to br from slate 8 0 0 / 9 5 via slate 9 0 0 / 9 5 to slate 9 5 0 / 9 5 " , u.activo ? "border slate 7 0 0 hover:border yellow 4 0 0 / 6 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 5 0 , 2 0 4 , 2 1 , 0 . 3 5 )
] " : "border slate 8 0 0 opacity 7 5 grayscale [ 2 5 % ] " ] .join( " " )
}
> {
/ * Estado (badge)
* / }
<span className= {
[ "absolute top 3 right 3 text [ 1 1px] px 2 py 1 rounded full font semibold" , u.activo ? "bg emerald 4 0 0 / 1 5 text emerald 3 0 0 border border emerald 5 0 0 / 3 0 " : "bg rose 4 0 0 / 1 0 text rose 3 0 0 border border rose 5 0 0 / 3 0 " ] .join( " " )
}
> <span className= {
[ "inline block w 2 h 2 rounded full mr 1 align middle" , u.activo ? "bg emerald 4 0 0 " : "bg rose 4 0 0 " ] .join( " " )
}
/ > {u.activo ? "Activo" : "Inactivo" }
< /span> <p className= "font semibold text slate 1 0 0 text lg pr 2 8 " > {u.nombre}
{u.apellido}
< /p> <span className= "inline block text xs md:text sm mt 1 bg yellow 4 0 0 / 1 5 text yellow 3 0 0 border border yellow 5 0 0 / 3 0 px 2 py 0 . 5 rounded md font semibold" > {u.rol}
< /span> <div className= "mt 2 spacey 0 . 5 text sm" > <p className= "text slate 3 0 0 " > <span className= "text slate 4 0 0 " >Restaurante: < /span> {u.restaurante}
< /p> <p className= "text slate 3 0 0 " > <span className= "text slate 4 0 0 " >Tel鑼?fono: < /span> {u.telefono}
< /p> <p className= "text slate 3 0 0 " > <span className= "text slate 4 0 0 " >Correo: < /span> {u.correo}
< /p> < /div> {
/ * Acciones * / }
<div className= "absolute bottom 3 right 3 flex gap 3 " > <button onClick = {
( )
= > editarUsuario(u)
}
title= "Editar usuario " className= "p 2 rounded lg bg slate 8 0 0 / 7 0 border border slate 7 0 0 hover:border blue 4 0 0 / 5 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 5 9 , 1 3 0 , 2 4 6 , 0 . 2 5 )
] transition all" > <Pencil size= {
1 8 }
className= "text blue 3 0 0 " / > < /button> <button onClick = {
( )
= > toggleActivoUsuario(u.id)
}
title= {u.activo ? "Desactivar usuario " : "Activar usuario " }
className= {
`p 2 rounded lg bg slate 8 0 0 / 7 0 border border slate 7 0 0 transition all $ {u.activo ? "hover:border rose 4 0 0 / 5 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 2 4 4 , 6 3 , 9 4 , 0 . 2 5 )
] " : "hover:border emerald 4 0 0 / 5 0 hover:shadow [ 0 _ 0 _ 0 _ 1px_rgba( 1 6 , 1 8 5 , 1 2 9 , 0 . 2 5 )
] " }
` }
> <Power size= {
1 8 }
className= {u.activo ? "text rose 3 0 0 " : "text emerald 3 0 0 " }
/ > < /button> < /div> < /div> )
)
}
< /div> < /div> < /div> )
;
}