// client/src/features/corporativo/Indicadores/IndicadoresPanelPage.jsx import React from "react" ;
// import useIndicadoresData from " . /hooks/useIndicadoresData" ;
// luego export default function IndicadoresPanelPage( )
{
// const {
resumen , loading , error }
= useIndicadoresData( )
;
// integraci?n futura return ( <div className= "grid gap 6 xl:grid cols [ 2fr_ 1 . 2fr] " > {
/ * Bloque izquierdo: KPIs principales y desglose por pa?s /zona * / }
<div className= "spacey 6 " > {
/ * KPIs principales * / }
<div className= "grid gap 4 sm:grid cols 2 lg:grid cols 3 " > <KpiCard title= "Producci?n mensual total" value= " $ 0 . 0 0 " hint= "Incluye El Salvador + USA" / > <KpiCard title= "Margen promedio" value= " 0 . 0 % " hint= "Sobre ventas consolidadas" / > <KpiCard title= "Cashflow neto" value= " $ 0 . 0 0 " hint= "Ingresos egresos recurrentes" / > < /div> {
/ * Distribuci?n por pa?s / zona * / }
<div className= "neo card p 4 md:p 5 spacey 4 " > <header className= "flex items center justify between gap 3 " > <div> <h2 className= "text base md:text lg font semibold" > Distribuci?n por pa?s y zona < /h2 > <p className= "text xs md:text sm text slate 4 0 0 " > C?mo se reparte la producci?n entre El Salvador (Lourdes Col?n , Chaparral)
y Los 閼?ngeles (USA)
. < /p> < /div> < /header> <div className= "grid gap 4 md:grid cols 2 " > <div className= "spacey 3 " > <h3 className= "text xs font semibold uppercase tracking wide text slate 4 0 0 " > El Salvador < /h3 > <SegRow label= "Lourdes Col?n ??Propiedades" value= " $ 0 . 0 0 " pct= " 0 % " / > <SegRow label= "Chaparral ??Restaurantes" value= " $ 0 . 0 0 " pct= " 0 % " / > < /div> <div className= "spacey 3 " > <h3 className= "text xs font semibold uppercase tracking wide text slate 4 0 0 " > USA < /h3 > <SegRow label= "Los 閼?ngeles ??Propiedades / negocios" value= " $ 0 . 0 0 " pct= " 0 % " / > < /div> < /div> < /div> {
/ * Top propiedades / negocios por producci?n * / }
<div className= "neo card p 4 md:p 5 spacey 4 " > <header className= "flex items center justify between gap 3 " > <div> <h2 className= "text base md:text lg font semibold" > Top propiedades y negocios < /h2 > <p className= "text xs md:text sm text slate 4 0 0 " > Ranking por producci?n mensual para detectar qu閼? activos empujan m?s el resultado consolidado. < /p> < /div> < /header> <div className= "overflowxauto" > <table className= "minwfull text xs md:text sm" > <thead> <tr className= "text left text slate 4 0 0 border b border [var( border)
] " > <th className= "py 2 pr 3 font semibold" >Activo< /th> <th className= "py 2 px 3 font semibold" >Tipo< /th> <th className= "py 2 px 3 font semibold text right" > Producci?n mensual < /th> <th className= "py 2 pl 3 font semibold text right" >Margen< /th> < /tr> < /thead> <tbody> {
/ * filas de ejemplo ;
luego se reemplazan con datos reales * / }
<tr className= "border b border [var( border)
] / 6 0 " > <td className= "py 2 pr 3 text sm" > APT 0 0 1 ??Apartamento Lourdes < /td> <td className= "py 2 px 3 text slate 4 0 0 " >Propiedad< /td> <td className= "py 2 px 3 text right tabular nums" > $ 0 . 0 0 < /td> <td className= "py 2 pl 3 text right tabular nums" > 0 . 0 % < /td> < /tr> <tr className= "border b border [var( border)
] / 6 0 " > <td className= "py 2 pr 3 text sm" > REST CHAP ??Local Chaparral < /td> <td className= "py 2 px 3 text slate 4 0 0 " >Restaurante< /td> <td className= "py 2 px 3 text right tabular nums" > $ 0 . 0 0 < /td> <td className= "py 2 pl 3 text right tabular nums" > 0 . 0 % < /td> < /tr> <tr> <td className= "py 2 pr 3 text sm" > LA 0 0 1 ??Propiedad Los 閼?ngeles < /td> <td className= "py 2 px 3 text slate 4 0 0 " >Propiedad< /td> <td className= "py 2 px 3 text right tabular nums" > $ 0 . 0 0 < /td> <td className= "py 2 pl 3 text right tabular nums" > 0 . 0 % < /td> < /tr> < /tbody> < /table> < /div> < /div> < /div> {
/ * Bloque derecho : resumen r?pido + checklist de salud * / }
<aside className= "spacey 6 " > <div className= "neo card p 4 md:p 5 spacey 3 " > <h2 className= "text base md:text lg font semibold" > Salud del portafolio < /h2 > <p className= "text xs md:text sm text slate 4 0 0 " > Resumen r?pido de ocupaci ?n , liquidez y endeudamiento. < /p> <ul className= "mt 2 spacey 2 text xs md:text sm" > <li className= "flex items start gap 2 " > <span className= "mt 1 h 2 w 2 rounded full bg emerald 4 0 0 " / > <div> <span className= "font semibold" >Ocupaci ?n consolidada< /span> <span className= "block text slate 4 0 0 text xs" > (Propiedades + Restaurantes)
< /span> < /div> <span className= "ml auto tabular nums text sm font semibold" > 0 . 0 % < /span> < /li> <li className= "flex items start gap 2 " > <span className= "mt 1 h 2 w 2 rounded full bg sky 4 0 0 " / > <div> <span className= "font semibold" >Liquidez bancos< /span> <span className= "block text slate 4 0 0 text xs" > Saldo disponible para inversiones y gastos. < /span> < /div> <span className= "ml auto tabular nums text sm font semibold" > $ 0 . 0 0 < /span> < /li> <li className= "flex items start gap 2 " > <span className= "mt 1 h 2 w 2 rounded full bg amber 4 0 0 " / > <div> <span className= "font semibold" >Deuda / Producci?n < /span> <span className= "block text slate 4 0 0 text xs" > Relaci?n entre obligaciones y flujo mensual . < /span> < /div> <span className= "ml auto tabular nums text sm font semibold" > 0 . 0 x < /span> < /li> < /ul> < /div> <div className= "neo card p 4 md:p 5 spacey 3 " > <h2 className= "text base md:text lg font semibold" > Alertas y observaciones < /h2 > <p className= "text xs md:text sm text slate 4 0 0 " > Aqu? se mostrar ?n alertas generadas desde reglas de negocio (propiedades sin producci?n , restaurantes con ca?da fuerte, etc. )
. < /p> <ul className= "mt 2 spacey 2 text xs md:text sm text slate 3 0 0 " > <li className= "rounded lg bg red 5 0 0 / 1 0 border border red 5 0 0 / 4 0 px 3 py 2 " > No hay datos cargados a閻?n . Importa transacciones y producciones para activar este panel. < /li> < /ul> < /div> < /aside> < /div> )
;
}
/ * Componentes internos simples * / function KpiCard ( {
title, value, hint }
)
{
return ( <div className= "neo card p 3 . 5 md:p 4 flex flex col gap 1 . 5 " > <h3 className= "text xs font semibold uppercase tracking wide text slate 4 0 0 " > {title}
< /h3 > <div className= "text xl md:text 2xl font semibold tabular nums" > {value}
< /div> {hint & & ( <p className= "text [ 1 1px] md:text xs text slate 4 0 0 leading snug" > {hint}
< /p> )
}
< /div> )
;
}
function SegRow( {
label, value, pct }
)
{
return ( <div className= "flex items center gap 3 text xs md:text sm" > <div className= "flex 1 " > <div className= "flex items center justify between gap 2 " > <span className= "font medium" > {label}
< /span> <span className= "tabular nums text xs opacity 7 5 " > {pct}
< /span> < /div> <div className= "mt 1 h 1 . 5 rounded full bg slate 9 0 0 / 5 0 overflow hidden" > <div className= "h full w 0 bg [var( accent)
] transition all" / > < /div> < /div> <span className= "tabular nums text xs md:text sm font semibold minw [ 7 0px] text right" > {value}
< /span> < /div> )
;
}