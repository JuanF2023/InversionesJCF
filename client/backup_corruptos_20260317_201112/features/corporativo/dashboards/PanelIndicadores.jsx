// client/src/features/corporativo/dashboards/PanelIndicadores.jsx import React from "react" ;
const MOCK_KPIS = {
ocupacionTotal : 0 . 9 2 , ocupacionES: 0 . 9 5 , ocupacionUSA: 0 . 8 8 , flujoMes: 2 4 5 0 , roiProps: 0 . 1 6 , roiNegocios: 0 . 2 2 , }
;
const MOCK_TOP_ACTIVOS = [ {
nombre: "APT0 4 ??Lourdes Col?n " , tipo: "Apartamento" , pais: "El Salvador" , ingreso : 6 5 0 }
, {
nombre: "LOC0 1 ??Chaparral" , tipo: "Restaurante" , pais: "El Salvador" , ingreso : 5 4 0 }
, {
nombre: "APT0 1 ??Los 閼?ngeles" , tipo: "Apartamento" , pais: "USA" , ingreso : 5 2 0 }
, {
nombre: "APT0 2 ??Los 閼?ngeles" , tipo: "Apartamento" , pais: "USA" , ingreso : 4 8 0 }
, {
nombre: "LOC0 2 ??Comercial Lourdes " , tipo: "Local" , pais: "El Salvador" , ingreso : 4 3 0 }
, ] ;
const MOCK_ALERTAS = [ "APT0 2 ??Los 閼?ngeles presenta flujo negativo 2 meses seguidos. " , "LOC0 1 ??Chaparral: revisar margen de utilidad de men閻?. " , "APT0 4 ??Lourdes Col?n : contrato por vencer en 6 0 d?as. " , ] ;
const MOCK_SERIES_MESES = [ {
mes: "Ene" , ingreso : 1 8 0 0 }
, {
mes: "Feb" , ingreso : 1 9 5 0 }
, {
mes: "Mar" , ingreso : 2 1 0 0 }
, {
mes: "Abr" , ingreso : 2 3 0 0 }
, {
mes: "May" , ingreso : 2 5 0 0 }
, {
mes: "Jun" , ingreso : 2 4 5 0 }
, ] ;
const MOCK_BY_AREA = [ {
label: "Lourdes Col?n (ES)
" , valor: 0 . 4 2 }
, {
label: "Chaparral / Restaurantes (ES)
" , valor: 0 . 2 8 }
, {
label: "Los 閼?ngeles (USA)
" , valor: 0 . 3 0 }
, ] ;
export default function PanelIndicadores( )
{
const formatoMoneda = (v)
= > new Intl.NumberFormat( "es SV" , {
style: "currency" , currency: "USD" , maximumFractionDigits : 0 , }
)
.format(v)
;
const formatoPorcentaje = (v)
= > ` $ {
(v * 1 0 0 )
.toFixed ( 1 )
.replace ( " . " , " , " )
}
% ` ;
const totalByArea = MOCK_BY_AREA.reduce( (acc, cur)
= > acc + cur.valor, 0 )
| | 1 ;
return ( <div className= "container 9 0 mx auto spacey 6 pb 6 " > {
/ * HEADER + FILTROS * / }
<header className= "flex flex col gap 3 md:flex row md:items center md:justify between " > <div> <h1 className= "text xl md:text 2xl font semibold tracking tight" > Indicadores clave del portafolio < /h1 > <p className= "text sm subtle mt 1 maxw 2xl" > Vista ejecutiva de ocupaci ?n , flujo de caja y rentabilidad de todas las propiedades y negocios de Inversiones JCF. < /p> < /div> <div className= "flex flex wrap gap 2 md:gap 3 items center" > <select className= "neo input h 9 px 3 text xs md:text sm" > <option> 閼?ltimo mes< /option> <option> 閼?ltimos 3 meses< /option> <option> 閼?ltimos 1 2 meses< /option> < /select> <select className= "neo input h 9 px 3 text xs md:text sm" > <option>Global (ES + USA)
< /option> <option>El Salvador< /option> <option>USA< /option> < /select> <select className= "neo input h 9 px 3 text xs md:text sm" > <option>Todos los activos < /option> <option>Propiedades< /option> <option>Restaurantes< /option> < /select> < /div> < /header> {
/ * FILA KPIs PRINCIPALES * / }
<section className= "grid grid cols 1 sm:grid cols 2 xl:grid cols 4 gap 4 " > <div className= "neo card neu strong p 4 flex flex col justify between " > <div className= "flex items center justify between mb 2 " > <span className= "text xs font semibold uppercase tracking [ 0 . 1 2em] subtle" > Flujo de caja neto (mes)
< /span> <span className= "kpi chip kpi chip up text [ 1 0px] " > + Estable < /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatoMoneda(MOCK_KPIS.flujoMes)
}
< /div> <p className= "text xs subtle mt 1 " > Ingresos ??egresos considerando propiedades y restaurantes. < /p> < /div> <div className= "neo card neu strong p 4 flex flex col justify between " > <div className= "flex items center justify between mb 2 " > <span className= "text xs font semibold uppercase tracking [ 0 . 1 2em] subtle" > Ocupaci ?n total < /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatoPorcentaje(MOCK_KPIS.ocupacionTotal )
}
< /div> <div className= "mt 2 spacey 1 text xs" > <div className= "flex items center justify between " > <span className= "metric row" > <span className= "dot dot activos " / > ES < /span> <span className= "tabular nums" > {formatoPorcentaje(MOCK_KPIS.ocupacionES)
}
< /span> < /div> <div className= "flex items center justify between " > <span className= "metric row" > <span className= "dot dot const" / > USA < /span> <span className= "tabular nums" > {formatoPorcentaje(MOCK_KPIS.ocupacionUSA)
}
< /span> < /div> < /div> < /div> <div className= "neo card neu strong p 4 flex flex col justify between " > <div className= "flex items center justify between mb 2 " > <span className= "text xs font semibold uppercase tracking [ 0 . 1 2em] subtle" > ROI promedio ??Propiedades < /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatoPorcentaje(MOCK_KPIS.roiProps)
}
< /div> <p className= "text xs subtle mt 1 " > Considera flujo de renta y gastos directos asociados a las unidades. < /p> < /div> <div className= "neo card neu strong p 4 flex flex col justify between " > <div className= "flex items center justify between mb 2 " > <span className= "text xs font semibold uppercase tracking [ 0 . 1 2em] subtle" > ROI promedio ??Negocios < /span> < /div> <div className= "text 2xl font semibold tabular nums" > {formatoPorcentaje(MOCK_KPIS.roiNegocios)
}
< /div> <p className= "text xs subtle mt 1 " > Incluye restaurantes (Chaparral)
y otros negocios ligados a activos . < /p> < /div> < /section > {
/ * FILA GR閼?FICOS * / }
<section className= "grid grid cols 1 xl:grid cols [minmax( 0 , 2fr)
_minmax( 0 , 1 . 4fr)
] gap 4 items stretch " > {
/ * Ingresos 閻?ltimos 6 meses * / }
<div className= "neo card p 4 flex flex col" > <div className= "flex items center justify between mb 2 " > <div> <h2 className= "text sm font semibold" > Ingresos totales 閻?ltimos 6 meses < /h2 > <p className= "text xs subtle" > Vista r?pida de tendencia global de ingresos. < /p> < /div> < /div> <div className= "mt 4 flex 1 flex items end gap 2 md:gap 3 " > {MOCK_SERIES_MESES.map( (p)
= > {
const max = Math.max( . . .MOCK_SERIES_MESES.map( (x)
= > x.ingreso )
)
| | 1 ;
const pct = (p.ingreso / max)
* 1 0 0 ;
return ( <div key= {p.mes}
className= "flex 1 flex flex col items center justify end gap 1 " > <div className= "w full bg border/ 6 0 rounded full h 3 2 overflow hidden flex items end" > <div className= "w full bank bar rounded full" style= {
{
height: ` $ {pct}
% ` }
}
/ > < /div> <span className= "text [ 1 1px] subtle mt 1 " > {p.mes}
< /span> < /div> )
;
}
)
}
< /div> < /div> {
/ * Distribuci?n por ?rea * / }
<div className= "neo card p 4 flex flex col" > <div className= "flex items center justify between mb 2 " > <div> <h2 className= "text sm font semibold" >Distribuci?n por ?rea< /h2 > <p className= "text xs subtle" > Porcentaje del ingreso que proviene de cada zona. < /p> < /div> < /div> <div className= "mt 4 spacey 3 " > {MOCK_BY_AREA.map( (item)
= > {
const pct = (item.valor / totalByArea)
* 1 0 0 ;
return ( <div key= {item.label}
className= "spacey 1 " > <div className= "flex items center justify between text xs" > <span> {item.label}
< /span> <span className= "tabular nums" > {pct.toFixed ( 1 )
.replace ( " . " , " , " )
}
% < /span> < /div> <div className= "segbar" > <span className= "segbar_ _chunk segbar_ _activos " style= {
{
width: ` $ {pct}
% ` }
}
/ > <span className= "segbar_ _chunk segbar_ _rest" style= {
{
width: ` $ {
1 0 0 pct}
% ` }
}
/ > < /div> < /div> )
;
}
)
}
< /div> <div className= "mt 3 text [ 1 1px] subtle" > Lourdes Col?n incluye apartamentos y locales ;
Chaparral agrupa los restaurantes;
Los 閼?ngeles concentra propiedades de renta en USA. < /div> < /div> < /section > {
/ * FILA TOP ACTIVOS + ALERTAS * / }
<section className= "grid grid cols 1 lg:grid cols [minmax( 0 , 1 . 5fr)
_minmax( 0 , 1fr)
] gap 4 items start" > {
/ * Top activos * / }
<div className= "neo card p 4 overflow hidden" > <div className= "flex items center justify between mb 2 " > <h2 className= "text sm font semibold" >Top 5 activos por ingreso mensual < /h2 > <span className= "text [ 1 1px] subtle" >Corte: mes actual< /span> < /div> <div className= "mt 2 spacey [ 4px] " > {MOCK_TOP_ACTIVOS .map( (a, idx)
= > ( <div key= {a.nombre}
className= "bank row" > <div className= "flex items center gap 2 minw 0 " > <div className= "bank chip text [ 1 0px] " > {idx + 1 }
< /div> <div className= "minw 0 " > <div className= "text xs font semibold truncate" > {a.nombre}
< /div> <div className= "text [ 1 1px] subtle truncate" > {a.tipo}
? {a.pais}
< /div> < /div> < /div> <div className= "text xs font semibold tabular nums" > {formatoMoneda(a.ingreso )
}
< /div> < /div> )
)
}
< /div> < /div> {
/ * Alertas * / }
<div className= "neo card p 4 " > <div className= "flex items center justify between mb 2 " > <h2 className= "text sm font semibold" >Alertas r?pidas< /h2 > <span className= "kpi chip text [ 1 0px] " >Riesgos < /span> < /div> <ul className= "mt 2 spacey 2 text xs" > {MOCK_ALERTAS .map( (msg, i)
= > ( <li key= {i}
className= "flex items start gap 2 rounded lg bg [color mix(in_oklab,var( panel)
_ 8 8 % , #f9 7 3 1 6 _ 1 2 % )
] border border [color mix(in_oklab,var( border)
_ 7 5 % , #f9 7 3 1 6 _ 2 5 % )
] px 3 py 2 " > <span className= "mt [ 3px] w 1 . 5 h 1 . 5 rounded full bg amber 4 0 0 flex shrink 0 " / > <span> {msg}
< /span> < /li> )
)
}
< /ul> <p className= "text [ 1 1px] subtle mt 3 " > Estas alertas se alimentar?n autom?ticamente a partir de tus transacciones y configuraciones de propiedades/negocios. < /p> < /div> < /section > < /div> )
;
}