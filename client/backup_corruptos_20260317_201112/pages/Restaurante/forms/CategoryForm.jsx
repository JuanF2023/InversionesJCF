import React, {
useState }
from "react" ;
const CategoriaForm = ( )
= > {
const [nombre, setNombre] = useState( " " )
;
const [descripcion, setDescripcion ] = useState( " " )
;
const [margen, setMargen] = useState( " " )
;
const [categorias, setCategorias] = useState( [ {
id: "cat_ 1 " , nombre: "Bebidas " , descripcion: "Jugos, refrescos, caf鑼?s " , margen: " 5 5 % " , }
, {
id: "cat_ 2 " , nombre: "Comida Casera" , descripcion: "Guisos, sopas, comida del hogar" , margen: " 4 0 % " , }
, {
id: "cat_ 3 " , nombre: "Men鐓? Infantil" , descripcion: "Comidas para ni甯?os" , margen: " 6 0 % " , }
, ] )
;
const handleSubmit = (e)
= > {
e.preventdefault ( )
;
const nuevaCategoria = {
id: `cat_ $ {categorias.length + 1 }
` , nombre, descripcion, margen: ` $ {margen}
% ` , creadoPor: "sistema " , fechaCreacion: new Date( )
.toISOString( )
, }
;
setCategorias( [ . . .categorias, nuevaCategoria ] )
;
setNombre( " " )
;
setDescripcion ( " " )
;
setMargen( " " )
;
}
;
return ( <div className= "grid grid cols 1 lg:grid cols 2 gap 6 mt 6 text white" > {
/ * Formulario * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 " > <h2 className= "text xl font bold text yellow 3 0 0 mb 1 flex items center gap 2 " > 棣?姊???Categor 閾?as < /h2 > <p className= "text sm text slate 3 0 0 mb 4 " >Registra una nueva categor 閾?a del men鐓?. < /p> <form onSubmit= {handleSubmit}
className= "spacey 3 " > <div> <label className= "block text sm text slate 3 0 0 mb 1 " > Nombre de la categor 閾?a < /label> <input type= "text" value= {nombre}
onChange= {
(e)
= > setNombre(e.target.value)
}
placeholder= "Ej. Bebidas " required className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" / > < /div> <div> <label className= "block text sm text slate 3 0 0 mb 1 " > Descripci璐?n < /label> <textarea value= {descripcion}
onChange= {
(e)
= > setDescripcion (e.target.value)
}
placeholder= "Describe el tipo de platos que incluye esta categor 閾?a " rows= {
2 }
required className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" / > < /div> <div> <label className= "block text sm text slate 3 0 0 mb 1 " > Margen de ganancia sugerido ( % )
< /label> <input type= "number" step= " 1 " min= " 0 " value= {margen}
onChange= {
(e)
= > setMargen(e.target.value)
}
placeholder= "Ej. 4 0 " required className= "w full px 4 py 2 bg [ # 2c3e5 0 ] text white rounded md" / > < /div> <div className= "pt 3 " > <button type= "submit" className= "bg yellow 4 0 0 hover:bg yellow 5 0 0 text black font semibold px 6 py 2 rounded md" > Guardar categor 閾?a < /button> < /div> < /form> < /div> {
/ * Tabla * / }
<div className= "bg [ # 1a2 2 3 8 ] p 6 rounded xl border border yellow 5 0 0 minh [ 4 0 0px] text white" > <h3 className= "text lg font bold text yellow 3 0 0 mb 2 " > Categor 閾?as registradas < /h3 > <table className= "w full text sm text left border separate border spacingy2 " > <thead> <tr className= "text yellow 2 0 0 " > <th>ID< /th> <th>Nombre< /th> <th>Descripci璐?n < /th> <th>Margen< /th> < /tr> < /thead> <tbody> {categorias.map( (cat)
= > ( <tr key= {cat.id}
className= "text white" > <td> {cat.id}
< /td> <td> {cat.nombre}
< /td> <td> {cat.descripcion}
< /td> <td> {cat.margen}
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> < /div> )
;
}
;
export default CategoriaForm;