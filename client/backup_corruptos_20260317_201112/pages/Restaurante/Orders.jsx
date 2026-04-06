// Orders.jsx actualizado con estructura mock y l?gica completa import React, {
useState, useEffect }
from "react" ;
import {
Search, RefreshCcw, DoorOpen, Printer }
from "lucide React" ;
import {
useNavigate }
from "React router dom" ;
const Orders = ( )
= > {
const navigate = useNavigate( )
;
const [busqueda, setBusqueda] = useState( " " )
;
const [estadoFiltro, setEstadoFiltro] = useState( "abierta " )
;
const [ordenes , setOrdenes] = useState( [ ] )
;
// Mock estructurado para futura conexi?n con backend useEffect( ( )
= > {
const mockData = [ {
id: "ORD0 0 1 " , mesa: " 1 " , estado: "abierta " , pagada: false, total: 1 8 . 7 5 , fecha: " 2 0 2 5 0 7 1 2T0 9 : 4 5 : 0 0 " , usuario : "Juan P閼?rez" }
, {
id: "ORD0 0 2 " , mesa: " 2 " , estado: "cerrada " , pagada: true, total: 2 7 . 5 0 , fecha: " 2 0 2 5 0 7 1 1T1 7 : 1 0 : 0 0 " , usuario : "Ana Mart?nez" }
, {
id: "ORD0 0 3 " , mesa: " 3 " , estado: "abierta " , pagada: false, total: 1 3 . 9 0 , fecha: " 2 0 2 5 0 7 1 2T1 0 : 3 0 : 0 0 " , usuario : "Carlos L?pez" }
] ;
setOrdenes(mockData)
;
}
, [ ] )
;
const limpiarFiltros = ( )
= > {
setBusqueda( " " )
;
setEstadoFiltro( "abierta " )
;
}
;
const ordenesFiltradas = ordenes .filter( (orden)
= > {
const coincideBusqueda = orden.mesa.toLowerCase( )
.includes(busqueda.toLowerCase( )
)
;
const coincideEstado = estadoFiltro = = = "todas" | | orden.estado = = = estadoFiltro;
return coincideBusqueda & & coincideEstado ;
}
)
;
const handleEntrarOrden = (ordenId )
= > {
navigate( ` /orden/ $ {ordenId }
` )
;
// Esto apunta a OrderBuilder.jsx con ID }
;
const totalPendiente = ordenes .filter( (orden)
= > orden.estado = = = "abierta " & & orden.pagada = = = false)
.reduce( (acc, orden)
= > acc + orden.total, 0 )
;
return ( <div className= "flex 1 flex items start justify center px 4 pt 8 pb 6 " > <div className= "w full maxwscreen xl bg slate 8 0 0 / 9 0 rounded xl p 6 shadow 2xl border border yellow 4 0 0 " > {
/ * Encabezado * / }
<div className= "flex flex col sm:flex row sm:items center sm:justify between gap 4 mb 6 " > <h2 className= "text 2xl sm:text 3xl font bold text white pb 1 w fit" > 閼?rdenes < /h2 > <p className= "text sm text slate 3 0 0 mt 1 " > Gesti?n de ?rdenes abiertas y cerradas < /p> {
/ * Filtros * / }
<div className= "flex flex col sm:flex row gap 2 sm:gap 4 " > <input type= "text" placeholder= "Buscar por mesa" value= {busqueda}
onChange= {
(e)
= > setBusqueda(e.target.value)
}
className= "px 3 py 2 rounded text black w 4 0 text sm" / > <select value= {estadoFiltro}
onChange= {
(e)
= > setEstadoFiltro(e.target.value)
}
className= "px 3 py 2 rounded text black w 3 6 text sm" > <option value= "todas" >Todos los estados < /option> <option value= "abierta " >Abiertas< /option> <option value= "cerrada " >Cerradas< /option> < /select> <button onClick = {limpiarFiltros }
className= "bg gradient to r from slate 6 0 0 to slate 7 0 0 hover:from slate 7 0 0 hover:to slate 8 0 0 px 3 py 2 rounded text white text sm shadow flex items center gap 1 " > <RefreshCcw size= {
1 4 }
/ > Limpiar < /button> < /div> < /div> {
/ * Tabla de ?rdenes * / }
{
/ * Tabla de ?rdenes para pantallas medianas en adelante * / }
<div className= "hidden md:block overflowxauto border border yellow 4 0 0 rounded lg" > <table className= "minwfull text sm text left" > <thead className= "bg slate 9 0 0 text yellow 4 0 0 uppercase text xs" > <tr> <th className= "px 4 py 3 " >Orden< /th> <th className= "px 4 py 3 " >Mesa< /th> <th className= "px 4 py 3 " >Estado< /th> <th className= "px 4 py 3 " >Pago< /th> <th className= "px 4 py 3 " >Total< /th> <th className= "px 4 py 3 " >Fecha< /th> <th className= "px 4 py 3 " >Usuario < /th> <th className= "px 4 py 3 " >Acciones< /th> < /tr> < /thead> <tbody className= "text white bg slate 8 0 0 " > {ordenesFiltradas.map( (orden)
= > ( <tr key= {orden.id}
className= "border b border slate 7 0 0 hover:bg slate 7 0 0 / 4 0 " > <td className= "px 4 py 3 " > {orden.id}
< /td> <td className= "px 4 py 3 " > {orden.mesa}
< /td> <td className= "px 4 py 3 capitalize" > {orden.estado}
< /td> <td className= "px 4 py 3 " > {orden.pagada ? "Pagada" : "Pendiente" }
< /td> <td className= "px 4 py 3 " > $ {orden.total.toFixed ( 2 )
}
< /td> <td className= "px 4 py 3 " > {new Date(orden.fecha)
.toLocaleString ( )
}
< /td> <td className= "px 4 py 3 " > {orden.usuario }
< /td> <td className= "px 4 py 3 " > <div className= "flex gap 2 " > {orden.estado = = = "abierta " ? ( <button onClick = {
( )
= > handleEntrarOrden(orden.id)
}
className= "bg gradient to r from blue 6 0 0 to blue 5 0 0 hover:from blue 7 0 0 hover:to blue 6 0 0 text white px 3 py 1 rounded md text sm flex items center gap 1 shadow" > <DoorOpen size= {
1 4 }
/ > Entrar < /button> )
: ( <span className= "text gray 4 0 0 italic text sm" >Cerrada < /span> )
}
<button className= "bg gradient to r from yellow 4 0 0 to yellow 3 0 0 hover:from yellow 5 0 0 hover:to yellow 4 0 0 text black px 3 py 1 rounded md text sm flex items center gap 1 shadow" > <Printer size= {
1 4 }
/ > Recibo < /button> < /div> < /td> < /tr> )
)
}
< /tbody> < /table> < /div> {
/ * Vista tipo tarjeta para pantallas peque鐢?as * / }
<div className= "block md:hidden spacey 4 " > {ordenesFiltradas.map( (orden)
= > ( <div key= {orden.id}
className= "border border yellow 4 0 0 rounded lg p 4 bg slate 8 0 0 text white shadow" > <div className= "font bold text lg mb 1 " > {orden.id}
< /div> <div className= "text sm mb 1 " >Mesa: <span className= "font medium" > {orden.mesa}
< /span> < /div> <div className= "text sm mb 1 " >Estado: <span className= "capitalize" > {orden.estado}
< /span> < /div> <div className= "text sm mb 1 " >Pago: {orden.pagada ? "Pagada" : "Pendiente" }
< /div> <div className= "text sm mb 1 " >Total: $ {orden.total.toFixed ( 2 )
}
< /div> <div className= "text sm mb 1 " >Fecha: {new Date(orden.fecha)
.toLocaleString ( )
}
< /div> <div className= "text sm mb 3 " >Usuario : {orden.usuario }
< /div> <div className= "flex gap 2 flex wrap" > {orden.estado = = = "abierta " ? ( <button onClick = {
( )
= > handleEntrarOrden(orden.id)
}
className= "bg gradient to r from blue 6 0 0 to blue 5 0 0 hover:from blue 7 0 0 hover:to blue 6 0 0 text white px 3 py 1 rounded md text sm flex items center gap 1 shadow" > <DoorOpen size= {
1 4 }
/ > Entrar < /button> )
: ( <span className= "text gray 4 0 0 italic text sm" >Cerrada < /span> )
}
<button className= "bg gradient to r from yellow 4 0 0 to yellow 3 0 0 hover:from yellow 5 0 0 hover:to yellow 4 0 0 text black px 3 py 1 rounded md text sm flex items center gap 1 shadow" > <Printer size= {
1 4 }
/ > Recibo < /button> < /div> < /div> )
)
}
< /div> {
/ * Estad?sticas * / }
<div className= "mt 6 text sm text slate 3 0 0 " > <p>Total de ?rdenes: {ordenesFiltradas.length}
< /p> <p> <p>Total pendiente: $ {totalPendiente .toFixed ( 2 )
}
< /p> < /p> < /div> < /div> < /div> )
;
}
;
export default Orders;