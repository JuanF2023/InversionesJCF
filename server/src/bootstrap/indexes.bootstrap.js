// server/src/bootstrap/indexes.bootstrap.js

/**
 * Crea índice solo si no existe (por nombre).
 * Evita colisiones de opciones.
 */
async function createIndexIfMissing(coll, keys, options = {}) {
  const name =
    options.name ||
    Object.entries(keys)
      .map(([k, v]) => `${k}_${v}`)
      .join("_");

  const existing = await coll.indexes();
  if (existing.some((i) => i.name === name)) return;

  await coll.createIndex(keys, { background: true, ...options });
}

export async function ensureIndexes({ mongoose }) {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB no inicializado (connection.db es null).");

  // Countries
  await createIndexIfMissing(db.collection("countries"), { code: 1 }, { unique: true, name: "code_1" });
  await createIndexIfMissing(db.collection("countries"), { name: 1 }, { unique: true, name: "name_1" });

  // Properties
  await createIndexIfMissing(db.collection("properties"), { id: 1 }, { unique: true, name: "id_1" });
  await createIndexIfMissing(db.collection("properties"), { codigo: 1 }, { unique: true, name: "codigo_1" });

  // Transactions
  await createIndexIfMissing(db.collection("transactions"), { txnId: -1 }, { unique: true, name: "txnId_-1" });
  await createIndexIfMissing(db.collection("transactions"), { date: 1 }, { name: "date_1" });

  // Projects
  await createIndexIfMissing(db.collection("projects"), { codigo: 1 }, { unique: true, name: "codigo_1" });
  await createIndexIfMissing(db.collection("projects"), { nombre: 1 }, { name: "nombre_1" });
  await createIndexIfMissing(db.collection("projects"), { estado: 1 }, { name: "estado_1" });

  // Counters seed
  await db.collection("counters").updateOne(
    { _id: "transactions" },
    { $setOnInsert: { seq: 0, createdAt: new Date() } },
    { upsert: true }
  );

  // Business domain
  await createIndexIfMissing(db.collection("business_categories"), { nombre: 1 }, { unique: true, name: "nombre_1" });
  await createIndexIfMissing(db.collection("business_types"), { categoriaId: 1, nombre: 1 }, { unique: true, name: "categoriaId_1_nombre_1" });
  await createIndexIfMissing(db.collection("business_types"), { slug: 1 }, { unique: true, name: "slug_1" });
  await createIndexIfMissing(db.collection("businesses"), { propertyId: 1, code: 1 }, { unique: true, name: "propertyId_1_code_1" });

  console.log("�?Índices verificados correctamente");
}
