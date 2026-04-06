import dotenv from "dotenv" ;
dotenv.config( )
;
import {
getDb, closeDb }
from " . . /db.js" ;
async function run( )
{
const db = await getDb( )
;
// counters base await db.collection( "counters" )
.updateOne( {
_id: "propiedad" }
, {
$setOnInsert: {
seq: 0 }
}
, {
upsert: true }
)
;
// PROPIEDADES: validator (a鐢?ade descripciones)
await db.command ( {
collMod : "properties" , validator: {
$jsonSchema: {
bsonType: "object" , required: [ "nombre" ] , properties: {
id: {
bsonType: [ "int" , "long" ] }
, nombre: {
bsonType: "string" }
, status: {
enum: [ "Activa" , "Vendida " , "Inactiva" , null] }
, pais: {
bsonType: [ "string" , "null" ] }
, bandera : {
bsonType: [ "string" , "null" ] }
, departamento: {
bsonType: [ "string" , "null" ] }
, municipio: {
bsonType: [ "string" , "null" ] }
, ciudad: {
bsonType: [ "string" , "null" ] }
, direccion: {
bsonType: [ "string" , "null" ] }
, calleAcceso: {
bsonType: [ "string" , "null" ] }
, tipoPropiedad: {
bsonType: [ "string" , "null" ] }
, fechaCompra: {
bsonType: [ "string" , "null" ] }
, precioCompra: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, valorActual: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, costoTotal: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, dimensionMt: {
bsonType: [ "string" , "double" , "int" , "long" , "null" ] }
, areaM2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, areaV2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, costoVara2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, costoMetro2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, norte: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, sur: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, esteOriente: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, oestePoniente: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, notas: {
bsonType: [ "string" , "null" ] }
, media: {
bsonType: [ "array" , "null" ] }
, descripcionCompra: {
bsonType: [ "string" , "null" ] }
, descripcionActual: {
bsonType: [ "string" , "null" ] }
, descripcionLog : {
bsonType: [ "array" , "null" ] , items: {
bsonType: "object" , required: [ "fecha" , "valor" , "usuario " , "motivo" ] , properties: {
fecha: {
bsonType: "date" }
, valor: {
bsonType: "string" }
, usuario : {
bsonType: "string" }
, motivo: {
bsonType: "string" }
}
}
}
}
}
}
}
)
.catch(async (e)
= > {
if (e.codeName = = = "NamespaceNotFound" )
{
await db.createCollection( "properties" )
;
return run( )
;
}
throw e;
}
)
;
await db.collection( "properties" )
.createIndex( {
id: 1 }
, {
unique: true }
)
;
// UNIDADES: create + validator + indexes try {
await db.createCollection( "unidades" , {
capped: false }
)
;
}
catch {
}
await db.command ( {
collMod : "unidades" , validator: {
$jsonSchema: {
bsonType: "object" , required: [ "id" , "propiedadId" , "nombre" , "tipo" , "estado" ] , properties: {
id: {
bsonType: [ "int" , "long" ] }
, propiedadId: {
bsonType: [ "int" , "long" ] }
, negocioId: {
bsonType: [ "string" , "null" ] }
, nombre: {
bsonType: "string" }
, tipo: {
enum: [ "apartamento" , "cuarto" , "local" , "restaurante" , "bodega" , "otro" ] }
, estado: {
enum: [ "activa" , "vacante " ] }
, diaPago : {
bsonType: [ "int" , "long" , "null" ] }
, rentaMensual: {
bsonType: [ "double" , "int" , "long" , "null" ] }
, dimensionMt: {
bsonType: [ "string" , "null" ] }
, areaM2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, areaV2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, costoVara2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, costoMetro2 : {
bsonType: [ "double" , "int" , "long" , "null" ] }
, ocupaciones: {
bsonType: [ "array" , "null" ] , items: {
bsonType: "object" , properties: {
inicio: {
bsonType: [ "string" , "null" ] }
, fin: {
bsonType: [ "string" , "null" ] }
, inquilino: {
bsonType: [ "string" , "null" ] }
}
}
}
, creadoPor: {
bsonType: [ "string" , "null" ] }
, fechaCreacion: {
bsonType: [ "date" , "null" ] }
}
}
}
}
)
;
await db.collection( "unidades" )
.createIndex( {
propiedadId: 1 , id: 1 }
, {
unique: true }
)
;
await db.collection( "unidades" )
.createIndex( {
propiedadId: 1 }
)
;
console .log( " ??Validadores e ?ndices listos" )
;
await closeDb ( )
;
}
run( )
.catch( (e)
= > {
console .error(e)
;
process .exit( 1 )
;
}
)
;