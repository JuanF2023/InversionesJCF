import React, {
useState }
from "react" ;
const ConfigForm = ( )
= > {
const [nombre, setNombre] = useState( "Restaurante 0 1 " )
;
const [sucursal, setSucursal] = useState( "Sucursal Central " )
;
const [mesas, setMesas] = useState( 1 0 )
;
const [moneda, setMoneda] = useState( "USD" )
;
const [formatoHora, setFormatoHora ] = useState( " 2 4h" )
;
const [tiempoEspera, setTiempoEspera] = useState( 1 5 )
;
const [mostrarImpuestos, setMostrarImpuestos] = useState(true)
;
const [editarOrdenes, setEditarOrdenes] = useState(true)
;
const [configActual, setConfigActual] = useState(null)
;
const handleSubmit = (e)
= > {
e.preventdefault ( )
;
const nuevaConfig = {
nombre, sucursal, mesas, moneda, formatoHora, tiempoEspera, mostrarImpuestos, editarOrdenes, creadoPor: "sistema " , fechaCreacion: new Date( )
.toISOString( )
, }
;
setConfigActual(nuevaConfig)
;
}
;
return ( <div className= "grid grid cols 1 lg:grid cols 2 gap 6 mt 6 " > {
/ * Formulario de configuraci璐?n * / }
<div className= "bg [ # 0e1 3 2 0 ] p 4 rounded xl shadow md border border yellow 4 0 0 " > <h2 className= "text 2xl font bold text yellow 4 0 0 mb 2 flex items center gap 2 " > 閳?娆?绗? Configuraci璐?n del Restaurante < /h2 > <p className= "text white mb 2 " >Establece los par璋?metros generales del sistema . < /p> <form onSubmit= {handleSubmit}
className= "spacey 2 " > {
/ * Nombre * / }
<div> <label className= "block text sm font semibold text yellow 3 0 0 mb 1 " > Nombre del restaurante < /label> <input type= "text" value= {nombre}
onChange= {
(e)
= > setNombre(e.target.value)
}
className= "w full px 4 py 1 bg green 1 0 0 text black rounded md focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " required / > < /div> {
/ * Sucursal * / }
<div> <label className= "block text sm font semibold text yellow 3 0 0 mb 1 " > Sucursal < /label> <input type= "text" value= {sucursal}
onChange= {
(e)
= > setSucursal(e.target.value)
}
className= "w full px 4 py 1 bg green 1 0 0 text black rounded md focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " required / > < /div> {
/ * Mesas * / }
<div> <label className= "block text sm font semibold text yellow 3 0 0 mb 1 " > N鐓?mero total de mesas < /label> <input type= "number" min= {
1 }
value= {mesas}
onChange= {
(e)
= > setMesas(e.target.value)
}
className= "w full px 4 py 1 bg green 1 0 0 text black rounded md focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " required / > < /div> {
/ * Moneda * / }
<div> <label className= "block text sm font semibold text yellow 3 0 0 mb 1 " > Moneda < /label> <select value= {moneda}
onChange= {
(e)
= > setMoneda(e.target.value)
}
className= "w full px 4 py 1 bg green 1 0 0 text black rounded md focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " > <option value= "USD" >USD ( $ )
< /option> <option value= "EUR" >EUR ( 閳?? < /option> <option value= "MXN" >MXN ( $ )
< /option> < /select> < /div> {
/ * Formato hora * / }
<div> <label className= "block text sm font semibold text yellow 3 0 0 mb 1 " > Formato de hora < /label> <select value= {formatoHora}
onChange= {
(e)
= > setFormatoHora (e.target.value)
}
className= "w full px 4 py 1 bg green 1 0 0 text black rounded md focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " > <option value= " 1 2h" > 1 2 horas< /option> <option value= " 2 4h" > 2 4 horas< /option> < /select> < /div> {
/ * Tiempo de espera * / }
<div> <label className= "block text sm font semibold text yellow 3 0 0 mb 1 " > Tiempo promedio de espera (minutos )
< /label> <input type= "number" min= {
1 }
value= {tiempoEspera}
onChange= {
(e)
= > setTiempoEspera(e.target.value)
}
className= "w full px 4 py 1 bg green 1 0 0 text black rounded md focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " / > < /div> {
/ * Switches * / }
<div className= "flex items center gap 2 " > <input type= "checkbox" checked = {mostrarImpuestos}
onChange= {
(e)
= > setMostrarImpuestos(e.target.checked )
}
className= "accent yellow 4 0 0 " / > <label className= "text sm font semibold text yellow 3 0 0 " > Mostrar precios con impuestos < /label> < /div> <div className= "flex items center gap 2 " > <input type= "checkbox" checked = {editarOrdenes}
onChange= {
(e)
= > setEditarOrdenes(e.target.checked )
}
className= "accent yellow 4 0 0 " / > <label className= "text sm font semibold text yellow 3 0 0 " > Permitir edici璐?n de 璐?rdenes < /label> < /div> {
/ * Bot璐?n * / }
<div className= "pt 2 " > <button type= "submit" className= "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 6 py 1 rounded md transition duration 2 0 0 " > Guardar configuraci璐?n < /button> < /div> < /form> < /div> {
/ * Panel de vista previa * / }
<div className= "bg [ # 0e1 3 2 0 ] p 4 rounded xl border border yellow 4 0 0 text white" > <h3 className= "text xl font bold text yellow 3 0 0 mb 2 " > Configuraci璐?n actual < /h3 > {configActual ? ( <ul className= "text sm spacey 1 " > <li> <strong>Restaurante: < /strong> {configActual.nombre}
< /li> <li> <strong>Sucursal: < /strong> {configActual.sucursal}
< /li> <li> <strong>Mesas: < /strong> {configActual.mesas}
< /li> <li> <strong>Moneda: < /strong> {configActual.moneda}
< /li> <li> <strong>Formato de hora: < /strong> {configActual.formatoHora}
< /li> <li> <strong>Espera promedio: < /strong> {configActual.tiempoEspera}
min< /li> <li> <strong>Mostrar impuestos: < /strong> {configActual.mostrarImpuestos ? "S閾?" : "No" }
< /li> <li> <strong>Editar 璐?rdenes: < /strong> {configActual.editarOrdenes ? "S閾?" : "No" }
< /li> < /ul> )
: ( <p className= "text sm text white" >A鐓?n no se ha configurado. < /p> )
}
< /div> < /div> )
;
}
;
export default ConfigForm;