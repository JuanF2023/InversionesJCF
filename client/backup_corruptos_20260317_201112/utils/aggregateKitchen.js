// src/utils/aggregateKitchen.js export function buildKitchenSummary(orden)
{
if ( !Array.isArray (orden)
| | orden.length = = = 0 )
{
return {
resumenPlatos: [ ] , resumenComponentes: [ ] }
;
}
// Normalizador para evitar duplicados por espacios/caso const norm = (s)
= > String(s ? ? " " )
.trim( )
;
// Si quieres hacerlo case insensitive, a鐢?ade: .toLowerCase( )
const platos = new Map( )
;
// firma > {
nombre, mods, count }
const componentes = new Map( )
;
// componente > count const sigMods = (item)
= > {
const m = item? .selectedMods | | {
}
;
const ex = (m.EXCLUDE | | [ ] )
.map(norm)
.filter(Boolean )
.sort( )
.map(x = > `SIN $ {x}
` )
.join( " , " )
;
const sg = Object.values(m.SINGLE | | {
}
)
.map(norm)
.filter(Boolean )
.sort( )
.join( " , " )
;
const ml = Object.values(m.MULTI | | {
}
)
.flat( )
.map(norm)
.filter(Boolean )
.sort( )
.join( " , " )
;
return [ex, sg, ml] .filter(Boolean )
.join( " | " )
;
// QUANTITY no afecta la firma }
;
const humanMods = (item)
= > {
const m = item? .selectedMods | | {
}
;
const parts = [ ] ;
(m.EXCLUDE | | [ ] )
.map(norm)
.filter(Boolean )
.forEach (x = > parts.push( `SIN $ {x}
` )
)
;
Object.values(m.SINGLE | | {
}
)
.map(norm)
.filter(Boolean )
.forEach (x = > parts.push( ` $ {x}
` )
)
;
Object.values(m.MULTI | | {
}
)
.flat( )
.map(norm)
.filter(Boolean )
.forEach (x = > parts.push( ` + $ {x}
` )
)
;
return parts.join( " , " )
;
}
;
for (const linea of orden)
{
const nombre = norm(linea? .nombre)
;
if ( !nombre)
continue;
const qty = Number(linea? .cantidad ? ? 1 )
| | 1 ;
// 1 )
Conteo por PLATO (agrupa por firma de modificadores)
const firma = ` $ {nombre}
_ _ $ {sigMods (linea)
}
` ;
if ( !platos.has(firma)
)
{
platos.set(firma, {
nombre, mods: humanMods(linea)
, count: 0 }
)
;
}
platos.get(firma)
.count + = qty;
// 2 )
Conteo por COMPONENTES (MULTI y QUANTITY)
const m = linea? .selectedMods | | {
}
;
// MULTI: cada selecci ?n cuenta 1 * qty for (const comp of Object.values(m.MULTI | | {
}
)
.flat( )
)
{
const key = norm(comp)
;
if ( !key)
continue;
componentes.set(key, (componentes.get(key)
| | 0 )
+ qty)
;
}
// QUANTITY: suma cantidad * qty for (const [comp, cant] of Object.entries (m.QUANTITY | | {
}
)
)
{
const key = norm(comp)
;
const c = Number(cant)
| | 0 ;
if ( !key | | c < = 0 )
continue;
componentes.set(key, (componentes.get(key)
| | 0 )
+ c * qty)
;
}
}
const resumenPlatos = Array.from(platos.values( )
)
.sort( (a, b)
= > a.nombre.localeCompare(b.nombre)
)
;
const resumenComponentes = Array.from(componentes.entries ( )
)
.map( ( [nombre, count] )
= > ( {
nombre, count }
)
)
.sort( (a, b)
= > a.nombre.localeCompare(b.nombre)
)
;
return {
resumenPlatos, resumenComponentes }
;
}