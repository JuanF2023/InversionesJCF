// client/src/features/corporativo/dashboards/PanelInformes.jsx import React from "react" ;
import {
Link }
from "React router dom" ;
const INFORMES_CLAVE = [ {
id: "flujo mensual " , titulo: "Flujo de caja mensual " , descripcion: "Resumen de ingresos y egresos por propiedad, negocio y pa?s para el periodo seleccionado. " , destino : " /corporativo/informes/resumen " , rango: " 閼?ltimo mes" , }
, {
id: "rentabilidad prop" , titulo: "Rentabilidad por propiedad" , descripcion: "ROI, flujo neto y ocupaci ?n para cada propiedad de El Salvador y USA. " , destino : " /corporativo/informes/tablas" , rango: " 閼?ltimos 1 2 meses" , }
, {
id: "rentabilidad negocios" , titulo: "Rentabilidad por negocio " , descripcion: "Estado de resultados consolidado por negocio (ej. Chaparral / Restaurantes)
. " , destino : " /corporativo/informes/tablas" , rango: " 閼?ltimos 6 meses" , }
, {
id: "historial transacciones" , titulo: "Historial de transacciones" , descripcion: "Listado detallado de transacciones con filtros por cuenta, negocio , propiedad y rango de fechas. " , destino : " /corporativo/informes/tablas" , rango: "Personalizable " , }
, ] ;
const MOCK_ULTIMOS _INFORMES = [ {
id: 1 , nombre: "Flujo de caja ??Junio 2 0 2 5 " , fecha: " 2 0 2 5 0 7 0 2 " , rango: " 0 1 / 0 6 / 2 0 2 5 ?? 3 0 / 0 6 / 2 0 2 5 " , tipo: "PDF" , }
, {
id: 2 , nombre: "Rentabilidad propiedades ?? 1 2 meses" , fecha: " 2 0 2 5 0 7 0 1 " , rango: " 0 1 / 0 7 / 2 0 2 4 ?? 3 0 / 0 6 / 2 0 2 5 " , tipo: "Excel" , }
, {
id: 3 , nombre: "Ventas Chaparral ?? 閼?ltimos 3 meses" , fecha: " 2 0 2 5 0 6 3 0 " , rango: " 0 1 / 0 4 / 2 0 2 5 ?? 3 0 / 0 6 / 2 0 2 5 " , tipo: "Excel" , }
, {
id: 4 , nombre: "Transacciones consolidadas ??sistema " , fecha: " 2 0 2 5 0 6 2 9 " , rango: " 0 1 / 0 6 / 2 0 2 5 ?? 2 9 / 0 6 / 2 0 2 5 " , tipo: "Tabla interna " , }
, ] ;
const FAVORITOS = [ "Flujo de caja mensual " , "Rentabilidad por propiedad" , "Ventas Chaparral / Restaurantes" , ] ;
export default function PanelInformes( )
{
const formatoFecha = (iso)
= > new Date(iso)
.toLocaleDateString( "es SV" , {
year: "numeric " , month: "short" , day: " 2 digit" , }
)
;
return ( <div className= "container 9 0 mx auto spacey 6 pb 6 " > {
/ * HEADER * / }
<header className= "flex flex col gap 3 md:flex row md:items center md:justify between " > <div> <h1 className= "text xl md:text 2xl font semibold tracking tight" > Informes corporativos < /h1 > <p className= "text sm subtle mt 1 maxw 2xl" > Acceso r?pido a los principales reportes financieros y operativos de Inversiones JCF: propiedades, negocios, transacciones y flujo de caja consolidado. < /p> < /div> <div className= "flex flex col items start md:items end gap 2 " > <Link to= " /corporativo/informes/resumen " className= "btn gradient btn action btn shimmer text xs md:text sm" > Ir al centro de informes avanzados < /Link> <span className= "text [ 1 1px] subtle" > Dise鐢?ado para exportar a PDF / Excel y compartir con socios. < /span> < /div> < /header> {
/ * INFORMES CLAVE * / }
<section className= "grid grid cols 1 md:grid cols 2 xl:grid cols 4 gap 4 " > {INFORMES_CLAVE.map( (inf)
= > ( <div key= {inf.id}
className= "neo card neo card tinted p 4 flex flex col justify between no clip" > <div className= "raise spacey 2 " > <h2 className= "text sm font semibold" > {inf.titulo}
< /h2 > <p className= "text xs subtle leading snug" > {inf.descripcion}
< /p> <div className= "mt 1 text [ 1 1px] subtle" > Rango por defecto : <span className= "font semibold" > {inf.rango}
< /span> < /div> < /div> <div className= "mt 3 raise flex justify between items center" > <Link to= {inf.destino }
className= "text xs font semibold text [color mix(in_oklab,var( accent)
_ 8 5 % ,var( text)
_ 1 5 % )
] hover:underline" > Ver detalles < /Link> <span className= "kpi chip text [ 1 0px] " >Informe clave< /span> < /div> < /div> )
)
}
< /section > {
/ * 閼?LTIMOS INFORMES GENERADOS + FAVORITOS * / }
<section className= "grid grid cols 1 lg:grid cols [minmax( 0 , 2 . 1fr)
_minmax( 0 , 1fr)
] gap 4 items start" > {
/ * Tabla 閻?ltimos informes * / }
<div className= "neo card p 4 overflow hidden" > <div className= "flex items center justify between mb 2 " > <h2 className= "text sm font semibold" > 閼?ltimos informes generados< /h2 > <span className= "text [ 1 1px] subtle" >Historial reciente< /span> < /div> <div className= "mt 2 overflow auto maxh 7 2 " > <table className= "w full text xs border collapse table lined" > <thead className= "bg [color mix(in_oklab,var( panel)
_ 9 0 % ,var( accent)
_ 1 0 % )
] " > <tr> <th className= "px 2 py 2 text left font semibold" > Nombre < /th> <th className= "px 2 py 2 text left font semibold" > Fecha < /th> <th className= "px 2 py 2 text left font semibold" > Rango < /th> <th className= "px 2 py 2 text left font semibold" > Tipo < /th> < /tr> < /thead> <tbody> {MOCK_ULTIMOS _INFORMES.map( (r)
= > ( <tr key= {r.id}
className= "hover:bg [color mix(in_oklab,var( panel)
_ 8 8 % ,var( accent)
_ 1 2 % / 9 % )
] " > <td className= "px 2 py 2 align top" > <div className= "font semibold" > {r.nombre}
< /div> < /td> <td className= "px 2 py 2 align top whitespace nowrap" > {formatoFecha(r.fecha)
}
< /td> <td className= "px 2 py 2 align top whitespace nowrap" > {r.rango}
< /td> <td className= "px 2 py 2 align top whitespace nowrap" > {r.tipo}
< /td> < /tr> )
)
}
< /tbody> < /table> < /div> <p className= "text [ 1 1px] subtle mt 2 " > Este historial se alimentar? autom?ticamente cada vez que generes o exportes un informe desde el m?dulo de Informes. < /p> < /div> {
/ * Favoritos / categor ?as * / }
<div className= "neo card p 4 " > <h2 className= "text sm font semibold mb 2 " > Informes favoritos y categor ?as < /h2 > <div className= "mb 3 " > <div className= "text [ 1 1px] subtle mb 1 " >M?s usados por ti< /div> <div className= "flex flex wrap gap 2 " > {FAVORITOS.map( (f, idx)
= > ( <span key= {idx}
className= "px 3 py 1 rounded full text [ 1 1px] font semibold bg [color mix(in_oklab,var( panel)
_ 8 5 % ,var( accent)
_ 1 5 % / 2 2 % )
] border border [color mix(in_oklab,var( accent)
_ 4 5 % ,var( border)
)
] " > {f}
< /span> )
)
}
< /div> < /div> <div className= "mt 3 spacey 2 text xs" > <div> <div className= "font semibold mb 1 " >Propiedades< /div> <ul className= "list disc list inside subtle spacey 1 " > <li>Flujo por propiedad (ES / USA)
< /li> <li>Ocupaci ?n y rentas pendientes< /li> < /ul> < /div> <div> <div className= "font semibold mb 1 " >Negocios< /div> <ul className= "list disc list inside subtle spacey 1 " > <li>Ventas y costos Chaparral / Restaurantes< /li> <li>Margen operativo por negocio < /li> < /ul> < /div> <div> <div className= "font semibold mb 1 " >Finanzas< /div> <ul className= "list disc list inside subtle spacey 1 " > <li>Resumen de bancos e indicadores de liquidez< /li> <li>Flujo consolidado del sistema < /li> < /ul> < /div> < /div> <div className= "mt 3 text [ 1 1px] subtle" > La idea es que desde aqu? entres en 1 ?? clics al reporte correcto, y el m?dulo de <strong>Informes< /strong> te permita ajustar filtros y exportar para compartir con socios o contabilidad. < /div> < /div> < /section > < /div> )
;
}