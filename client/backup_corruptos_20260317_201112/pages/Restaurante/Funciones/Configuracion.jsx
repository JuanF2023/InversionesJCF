import React, {
useState }
from 'react' ;
const Configuracion = ( )
= > {
const [form, setForm ] = useState( {
nombre: 'Restaurante 0 1 ' , sucursal: 'Chaparral' , direccion: 'Pol閾?gono 3 3B, Calle Nacional # 2 8 , Cant璐?n El Capul閾?n , Col璐?n , La Libertad' , mesas: 6 , idioma: 'Espa甯?ol' , zonaHoraria: 'America /El_Salvador' , apertura: ' 0 8 : 0 0 AM' , cierre: ' 0 9 : 0 0 PM' , margenGanancia : 3 0 , }
)
;
const handleChange = (e)
= > {
const {
name, value }
= e.target;
setForm ( (prev)
= > ( {
. . .prev, [name] : value }
)
)
;
}
;
const historial = [ {
fecha: ' 2 0 2 5 0 7 2 0 0 9 : 1 2 AM' , campo: 'Horario de cierre' , anterior: ' 0 8 : 0 0 PM' , nuevo: ' 0 9 : 0 0 PM' , }
, {
fecha: ' 2 0 2 5 0 7 1 8 0 5 : 3 1 PM' , campo: 'N鐓?mero de mesas' , anterior: ' 5 ' , nuevo: ' 6 ' , }
, {
fecha: ' 2 0 2 5 0 7 1 0 1 0 : 4 5 AM' , campo: 'Margen de ganancia' , anterior: ' 2 5 % ' , nuevo: ' 3 0 % ' , }
, ] ;
return ( <div className= "p 6 " > <div className= "grid grid cols 1 md:grid cols 2 gap 6 " > {
/ * Panel izquierdo * / }
<div className= "bg gradient to r from slate 8 0 0 to slate 7 0 0 border border yellow 4 0 0 rounded xl p 6 shadow text white" > <h2 className= "text xl font bold mb 2 flex items center gap 2 text yellow 3 0 0 " > <span className= "text 2xl" > 棣?鞋 < /span> Par璋?metros del Restaurante < /h2 > <p className= "text sm text slate 3 0 0 mb 6 " > Visualiza o modifica la configuraci璐?n general del sistema . < /p> <div className= "spacey 3 " > <div> <label className= "block text sm mb 1 " >Nombre del restaurante< /label> <input type= "text" name= "nombre" value= {form.nombre}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> <div> <label className= "block text sm mb 1 " >Sucursal< /label> <input type= "text" name= "sucursal" value= {form.sucursal}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> <div> <label className= "block text sm mb 1 " >Direcci 璐?n < /label> <input type= "text" name= "direccion" value= {form.direccion}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 placeholder slate 4 0 0 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> <div> <label className= "block text sm mb 1 " >N鐓?mero de mesas< /label> <input type= "number" name= "mesas" value= {form.mesas}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> <div className= "flex gap 4 " > <div className= "w 1 / 2 " > <label className= "block text sm mb 1 " >Idioma< /label> <select name= "idioma" value= {form.idioma}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled > <option value= "Espa甯?ol" >Espa甯?ol< /option> < /select> < /div> <div className= "w 1 / 2 " > <label className= "block text sm mb 1 " >Zona horaria < /label> <select name= "zonaHoraria" value= {form.zonaHoraria}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled > <option value= "America /El_Salvador" >America /El_Salvador< /option> < /select> < /div> < /div> <div className= "flex gap 4 " > <div className= "w 1 / 2 " > <label className= "block text sm mb 1 " >Horario de apertura< /label> <input type= "text" name= "apertura" value= {form.apertura}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> <div className= "w 1 / 2 " > <label className= "block text sm mb 1 " >Horario de cierre< /label> <input type= "text" name= "cierre" value= {form.cierre}
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> < /div> <div> <label className= "block text sm mb 1 " >Margen de ganancia general ( % )
< /label> <input type= "number" name= "margenGanancia " value= {form.margenGanancia }
onChange= {handleChange}
className= "w full rounded md bg slate 9 0 0 border border slate 6 0 0 text white px 3 py 2 focus:outline none focus:ring 2 focus:ring yellow 4 0 0 " disabled / > < /div> <button className= "mt 4 bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 4 py 2 rounded transition all" > Modificar par璋?metros < /button> < /div> < /div> {
/ * Panel derecho Historial * / }
<div className= "bg gradient to r from slate 8 0 0 to slate 7 0 0 border border yellow 4 0 0 rounded xl p 6 text white" > <h3 className= "text lg font semibold text yellow 3 0 0 mb 2 " > Historial de modificaciones < /h3 > {historial.length = = = 0 ? ( <p className= "text slate 4 0 0 text sm" >No hay registros recientes. < /p> )
: ( <ul className= "divide y divide slate 7 0 0 text sm maxh [ 4 0 0px] overflowyauto custom scrollbar" > {historial.map( (item, index)
= > ( <li key= {index}
className= "py 2 " > <p className= "text yellow 2 0 0 font medium" > {item.campo}
< /p> <p className= "text slate 3 0 0 " > <span className= "text slate 4 0 0 " >Anterior: < /span> {item.anterior}
< /p> <p className= "text slate 3 0 0 " > <span className= "text slate 4 0 0 " >Nuevo: < /span> {item.nuevo}
< /p> <p className= "text xs text slate 5 0 0 mt 1 " > {item.fecha}
< /p> < /li> )
)
}
< /ul> )
}
< /div> < /div> < /div> )
;
}
;
export default Configuracion;