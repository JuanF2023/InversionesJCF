import React, {
useState }
from "react" ;
const PreparacionForm = ( )
= > {
const [proceso , setProceso] = useState( " " )
;
const [descripcion, setDescripcion ] = useState( " " )
;
const [margen, setMargen] = useState( " " )
;
const [configurado, setConfigurado ] = useState(true)
;
const [preparaciones, setPreparaciones] = useState( [ {
id: "prep_ 1 " , proceso : "Producci璐?n " , descripcion: "Preparaci璐?n desde ingredientes b璋?sicos en cocina" , margen: " 5 0 % " , configurado: true, }
, {
id: "prep_ 2 " , proceso : "Reventa " , descripcion: "Producto comprado para reventa directa " , margen: " 2 0 % " , configurado: true, }
, {
id: "prep_ 3 " , proceso : "Ensamblado" , descripcion: "Montaje de componentes pre elaborados" , margen: " 3 5 % " , configurado: true, }
, {
id: "prep_ 4 " , proceso : "Combo" , descripcion: "Combinaci璐?n de m鐓?ltiples productos" , margen: " 2 5 % " , configurado: true, }
, ] )
;
const handleSubmit = (e)
= > {
e.preventdefault ( )
;
const nuevaPreparacion = {
id: `prep_ $ {preparaciones.length + 1 }
` , proceso , descripcion, margen: ` $ {margen}
% ` , configurado, creadoPor: "sistema " , fechaCreacion: new Date( )
.toISOString( )
, }
;
setPreparaciones( [ . . .preparaciones, nuevaPreparacion] )
;
setProceso( " " )
;
setDescripcion ( " " )
;
setMargen( " " )
;
setConfigurado (true)
;
}
;
return ( <div className= "grid grid cols 1 lg:grid cols 2 gap 6 mt 6 text white" > {
/ * Formulario izquierda * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 " > <h2 className= "text xl font bold text yellow 3 0 0 mb 1 flex items center gap 2 " > 棣?鎳?閳?宥?鐓??Tipos de Preparaci璐?n < /h2 > <p className= "text sm text slate 3 0 0 mb 4 " >Registra un nuevo tipo de preparaci璐?n . < /p> <form onSubmit= {handleSubmit}
className= "spacey 3 " > <div> <label className= "block text sm text slate 3 0 0 mb 1 " >Proceso < /label> <input type= "text" value= {proceso }
onChange= {
(e)
= > setProceso(e.target.value)
}
placeholder= "Ej. Producci璐?n " required className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" / > < /div> <div> <label className= "block text sm text slate 3 0 0 mb 1 " >Descripci璐?n < /label> <input type= "text" value= {descripcion}
onChange= {
(e)
= > setDescripcion (e.target.value)
}
placeholder= "Describe el proceso " required className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" / > < /div> <div> <label className= "block text sm text slate 3 0 0 mb 1 " >Margen de ganancia sugerido ( % )
< /label> <input type= "number" step= " 1 " min= " 0 " value= {margen}
onChange= {
(e)
= > setMargen(e.target.value)
}
placeholder= "Ej. 3 0 " required className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" / > < /div> <div className= "flex items center gap 2 " > <input type= "checkbox" checked = {configurado}
onChange= {
(e)
= > setConfigurado (e.target.checked )
}
className= "accent yellow 4 0 0 " / > <label className= "text sm text slate 3 0 0 " >Configurado< /label> < /div> <div className= "pt 3 " > <button type= "submit" className= "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 6 py 2 rounded md" > Guardar preparaci璐?n < /button> < /div> < /form> < /div> {
/ * Tabla derecha * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 minh [ 4 0 0px] text white overflow auto" > <h3 className= "text lg font bold text yellow 3 0 0 mb 2 " >Tipos registrados< /h3 > <table className= "w full text sm text left border separate border spacingy2 " > <thead> <tr className= "text yellow 2 0 0 " > <th>ID< /th> <th>Proceso < /th> <th>Descripci璐?n < /th> <th>Margen< /th> <th>Configurado< /th> < /tr> < /thead> <tbody> {preparaciones.map( (prep)
= > ( <tr key= {prep.id}
className= "text white" > <td> {prep.id}
< /td> <td> {prep.proceso }
< /td> <td> {prep.descripcion}
< /td> <td> {prep.margen}
< /td> <td> {prep.configurado ? "S閾?" : "No" }
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> < /div> )
;
}
;
export default PreparacionForm;