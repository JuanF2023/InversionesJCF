import React, {
useEffect, useState }
from "react" ;
import {
LogOut, XCircle }
from "lucide React" ;
const Turnos = ( )
= > {
const [horaActual, setHoraActual] = useState(new Date( )
)
;
const usuarioActual = {
id: "admin_ 0 0 1 " , nombre: "Luis Contreras" , rol: "gerente " , }
;
const [empleados, setEmpleados] = useState( [ {
id: "emp_ 0 0 1 " , nombre: "Juan P閼?rez" , rol: "mesero" , estado: "activo" , historial: [ {
accion: "Entrada " , fecha: " 2 0 2 5 0 7 1 2 " , hora: " 0 8 : 0 0 AM" }
, ] , }
, {
id: "emp_ 0 0 2 " , nombre: "Ana Mart?nez" , rol: "cocinera" , estado: "en_descanso" , historial: [ {
accion: "Entrada " , fecha: " 2 0 2 5 0 7 1 2 " , hora: " 0 8 : 3 0 AM" }
, {
accion: "Inicio descanso" , fecha: " 2 0 2 5 0 7 1 2 " , hora: " 1 0 : 1 5 AM" }
, ] , }
, {
id: "emp_ 0 0 3 " , nombre: "Carlos L?pez" , rol: "mesero" , estado: "terminado" , historial: [ {
accion: "Entrada " , fecha: " 2 0 2 5 0 7 1 1 " , hora: " 0 9 : 0 0 AM" }
, {
accion: "Salida" , fecha: " 2 0 2 5 0 7 1 1 " , hora: " 1 7 : 1 0 PM" }
, ] , }
, ] )
;
// Filtros const [filtroNombre, setFiltroNombre] = useState( " " )
;
const [filtroRol, setFiltroRol] = useState( " " )
;
const [filtroEstado, setFiltroEstado] = useState( " " )
;
useEffect( ( )
= > {
const interval = setInterval( ( )
= > setHoraActual(new Date( )
)
, 1 0 0 0 )
;
return ( )
= > clearInterval(interval)
;
}
, [ ] )
;
const handleForzarSalida = (idEmpleado)
= > {
const nuevos = empleados.map( (emp)
= > {
if (emp.id = = = idEmpleado & & emp.estado ! = = "terminado" )
{
return {
. . .emp, estado: "terminado" , historial: [ {
accion: "Forzado por gerente " , fecha: horaActual.toLocaleDateString( )
, hora: horaActual.toLocaleTimeString( )
, }
, . . .emp.historial, ] , }
;
}
return emp;
}
)
;
setEmpleados(nuevos)
;
console .log( "Salida forzada para: " , idEmpleado)
;
}
;
const obtenerEntrada = (historial)
= > historial.find( (h)
= > h.accion = = = "Entrada " )
;
const obtenerSalida = (historial)
= > historial.find( (h)
= > h.accion = = = "Salida" | | h.accion = = = "Forzado por gerente " )
;
const calcularHorasTrabajadas = (historial)
= > {
const entrada = obtenerEntrada (historial)
;
const salida = obtenerSalida(historial)
;
if ( !entrada | | !salida)
return "En curso. . . " ;
const fechaEntrada = new Date( ` $ {entrada .fecha}
$ {entrada .hora}
` )
;
const fechaSalida = new Date( ` $ {salida.fecha}
$ {salida.hora}
` )
;
const ms = fechaSalida fechaEntrada;
if (isNaN(ms)
)
return "Error" ;
const horas = Math.floor(ms / ( 1 0 0 0 * 6 0 * 6 0 )
)
;
const minutos = Math.floor( (ms % ( 1 0 0 0 * 6 0 * 6 0 )
)
/ ( 1 0 0 0 * 6 0 )
)
;
return ` $ {horas}h $ {minutos }m` ;
}
;
const limpiarFiltros = ( )
= > {
setFiltroNombre( " " )
;
setFiltroRol( " " )
;
setFiltroEstado( " " )
;
}
;
const empleadosFiltrados = empleados.filter( (emp)
= > {
const coincideNombre = emp.nombre .toLowerCase( )
.includes(filtroNombre.toLowerCase( )
)
;
const coincideRol = filtroRol ? emp.rol = = = filtroRol : true;
const coincideEstado = filtroEstado ? emp.estado = = = filtroEstado : true;
return coincideNombre & & coincideRol & & coincideEstado ;
}
)
;
return ( <div className= "maxw 7xl mx auto p 6 text white" > <div className= "bg [ # 0e1 3 2 0 ] border border yellow 4 0 0 rounded xl p 6 shadow" > <h2 className= "text 2xl font bold text yellow 4 0 0 mb 4 text center" > Control de Turnos Activos < /h2 > {
/ * FILTROS * / }
<div className= "flex flex wrap gap 4 mb 6 items center" > <input type= "text" placeholder= "Buscar por nombre" className= "px 3 py 2 rounded md bg white text black w 6 0 " value= {filtroNombre}
onChange= {
(e)
= > setFiltroNombre(e.target.value)
}
/ > <select value= {filtroRol}
onChange= {
(e)
= > setFiltroRol(e.target.value)
}
className= "px 3 py 2 rounded md bg white text black" > <option value= " " >Todos los roles< /option> <option value= "mesero" >Mesero< /option> <option value= "cocinera" >Cocinera< /option> < /select> <select value= {filtroEstado}
onChange= {
(e)
= > setFiltroEstado(e.target.value)
}
className= "px 3 py 2 rounded md bg white text black" > <option value= " " >Todos los estados < /option> <option value= "activo" >Activo< /option> <option value= "en_descanso" >En descanso< /option> <option value= "terminado" >Terminado< /option> < /select> <button onClick = {limpiarFiltros }
className= "flex items center gap 2 bg gray 6 0 0 hover:bg gray 7 0 0 text white px 4 py 2 rounded md" > <XCircle size= {
1 6 }
/ > Limpiar filtros < /button> < /div> {
/ * TABLA * / }
<div className= "overflowxauto" > <table className= "minwfull text sm border border gray 7 0 0 text left" > <thead className= "bg gray 8 0 0 text yellow 3 0 0 " > <tr> <th className= "px 4 py 2 " >Empleado< /th> <th className= "px 4 py 2 " >Rol< /th> <th className= "px 4 py 2 " >Estado< /th> <th className= "px 4 py 2 " >Entrada < /th> <th className= "px 4 py 2 " >Salida< /th> <th className= "px 4 py 2 " >Total< /th> <th className= "px 4 py 2 " >Acci?n < /th> < /tr> < /thead> <tbody> {empleadosFiltrados.map( (emp)
= > {
const entrada = obtenerEntrada (emp.historial)
;
const salida = obtenerSalida(emp.historial)
;
return ( <tr key= {emp.id}
className= "border t border gray 7 0 0 " > <td className= "px 4 py 2 font medium" > {emp.nombre}
< /td> <td className= "px 4 py 2 capitalize" > {emp.rol}
< /td> <td className= "px 4 py 2 capitalize" > {emp.estado = = = "activo" ? ( <span className= "text green 4 0 0 font semibold" >Activo< /span> )
: emp.estado = = = "en_descanso" ? ( <span className= "text yellow 4 0 0 font semibold" >En descanso< /span> )
: ( <span className= "text gray 4 0 0 " >Terminado< /span> )
}
< /td> <td className= "px 4 py 2 " > {entrada ? .hora | | " " }
< /td> <td className= "px 4 py 2 " > {salida? .hora | | " " }
< /td> <td className= "px 4 py 2 " > {calcularHorasTrabajadas(emp.historial)
}
< /td> <td className= "px 4 py 2 " > {usuarioActual.rol = = = "gerente " & & emp.estado ! = = "terminado" ? ( <button onClick = {
( )
= > handleForzarSalida(emp.id)
}
className= "bg red 5 0 0 hover:bg red 6 0 0 text white px 3 py 1 rounded md flex items center gap 1 " > <LogOut size= {
1 6 }
/ > Forzar salida < /button> )
: ( <span className= "text gray 5 0 0 text sm" >Turno cerrado < /span> )
}
< /td> < /tr> )
;
}
)
}
< /tbody> < /table> < /div> <div className= "mt 6 text sm text right text gray 4 0 0 " > 閼?ltima actualizaci?n : {horaActual.toLocaleTimeString( )
}
< /div> < /div> < /div> )
;
}
;
export default Turnos;