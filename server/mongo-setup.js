import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "InversionesJCF";
if (!MONGO_URI) throw new Error("Missing MONGO_URI in .env");

const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 20000 });

async function run() {
  await client.connect();
  const db = client.db(DB_NAME);

  // counters base
  await db.collection("counters").updateOne(
    { _id: "propiedad" }, { $setOnInsert: { seq: 0 } }, { upsert: true }
  );

  // propiedades: crea si no existe y valida (campos de descripciones)
  const colls = (await db.listCollections().toArray()).map(c => c.name);
  if (!colls.includes("propiedades")) await db.createCollection("propiedades");

  await db.command({
    collMod: "propiedades",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        properties: {
          id: { bsonType: ["int","long"] },
          nombre: { bsonType: ["string","null"] },
          descripcionCompra: { bsonType: ["string","null"] },
          descripcionActual: { bsonType: ["string","null"] },
          descripcionLog: {
            bsonType: ["array","null"],
            items: {
              bsonType: "object",
              properties: {
                fecha: { bsonType: "date" },
                valor: { bsonType: "string" },
                usuario: { bsonType: "string" },
                motivo: { bsonType: "string" }
              }
            }
          }
        }
      }
    }
  }).catch(async (e) => {
    if (e.codeName !== "NamespaceNotFound") throw e;
    await db.createCollection("propiedades");
  });

  await db.collection("propiedades").createIndex({ id: 1 }, { unique: true });

  // unidades
  if (!colls.includes("unidades")) await db.createCollection("unidades");
  await db.command({
    collMod: "unidades",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["id","propiedadId","nombre","tipo","estado"],
        properties: {
          id: { bsonType: ["int","long"] },
          propiedadId: { bsonType: ["int","long"] },
          negocioId: { bsonType: ["string","null"] },
          nombre: { bsonType: "string" },
          tipo: { enum: ["apartamento","cuarto","local","restaurante","bodega","otro"] },
          estado: { enum: ["activa","vacante"] },
          diaPago: { bsonType: ["int","long","null"] },
          rentaMensual: { bsonType: ["double","int","long","null"] },
          ocupaciones: {
            bsonType: ["array","null"],
            items: {
              bsonType: "object",
              properties: {
                inicio: { bsonType: ["string","null"] },
                fin: { bsonType: ["string","null"] },
                inquilino: { bsonType: ["string","null"] }
              }
            }
          },
          creadoPor: { bsonType: ["string","null"] },
          fechaCreacion: { bsonType: ["date","null"] }
        }
      }
    }
  });

  await db.collection("unidades").createIndex({ propiedadId: 1, id: 1 }, { unique: true });
  await db.collection("unidades").createIndex({ propiedadId: 1 });

  console.log("✔ Validadores e índices listos");
  await client.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
