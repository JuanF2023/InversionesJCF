// server/src/config/db.js
import mongoose from "mongoose";

let connectPromise = null;

/**
 * Asegura que hay conexión activa de Mongoose.
 * - Si ya está conectado, no hace nada.
 * - Si no, conecta usando MONGO_URI.
 * - Evita conexiones duplicadas con un singleton de promesa.
 */
export async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;        // connected
  if (mongoose.connection.readyState === 2) {                                  // connecting
    await mongoose.connection.asPromise?.();                                   // Node 22+ Mongoose v8+
    return mongoose.connection;
  }
  if (!connectPromise) {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/inversionesjcf";
    connectPromise = mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    }).then(() => mongoose.connection)
      .finally(() => { connectPromise = null; });
  }
  return connectPromise;
}

/**
 * getDb(): compatibilidad para código que usaba el driver nativo.
 * Devuelve `mongoose.connection.db` (misma conexión que Mongoose).
 */
export async function getDb() {
  await ensureConnected();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB no disponible en mongoose.connection.db");
  return db;
}
