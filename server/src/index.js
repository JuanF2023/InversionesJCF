// server/src/index.js
import dotenv from "dotenv";
dotenv.config();

import http from "node:http";
import mongoose from "mongoose";
import app from "./app.js";
import { idleSessionsJob } from "./jobs/idleSessions.job.js";

const PORT = Number(process.env.PORT || 4000);

let server = null;
let idleTimer = null;

/* ====== Conexión Mongoose ====== */
mongoose.set("strictQuery", true);

process.on("unhandledRejection", (reason) => {
  console.error("🛑 UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🛑 UNCAUGHT EXCEPTION:", err);
});

/**
 * Crea índice solo si no existe (por nombre).
 * Evita conflictos de opciones.
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

/** Asegura índices sin colisiones (usa la MISMA conexión de Mongoose) */
async function ensureIndexes() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB no inicializado (connection.db es null).");

  await createIndexIfMissing(
    db.collection("countries"),
    { code: 1 },
    { unique: true, name: "code_1" }
  );
  await createIndexIfMissing(
    db.collection("countries"),
    { name: 1 },
    { unique: true, name: "name_1" }
  );

  // Properties (id + codigo)
  await createIndexIfMissing(
    db.collection("properties"),
    { id: 1 },
    { unique: true, name: "id_1" }
  );
  await createIndexIfMissing(
    db.collection("properties"),
    { codigo: 1 },
    { unique: true, name: "codigo_1" }
  );

  // Transactions
  await createIndexIfMissing(
    db.collection("transactions"),
    { txnId: -1 },
    { unique: true, name: "txnId_-1" }
  );
  await createIndexIfMissing(
    db.collection("transactions"),
    { date: 1 },
    { name: "date_1" }
  );

  // Projects
  await createIndexIfMissing(
    db.collection("projects"),
    { codigo: 1 },
    { unique: true, name: "codigo_1" }
  );
  await createIndexIfMissing(
    db.collection("projects"),
    { nombre: 1 },
    { name: "nombre_1" }
  );
  await createIndexIfMissing(
    db.collection("projects"),
    { estado: 1 },
    { name: "estado_1" }
  );

  // Counters
  await db.collection("counters").updateOne(
    { _id: "transactions" },
    { $setOnInsert: { seq: 0, createdAt: new Date() } },
    { upsert: true }
  );

  // ---- Business domain ----
  await createIndexIfMissing(
    db.collection("business_categories"),
    { nombre: 1 },
    { unique: true, name: "nombre_1" }
  );

  await createIndexIfMissing(
    db.collection("business_types"),
    { categoriaId: 1, nombre: 1 },
    { unique: true, name: "categoriaId_1_nombre_1" }
  );

  await createIndexIfMissing(
    db.collection("business_types"),
    { slug: 1 },
    { unique: true, name: "slug_1" }
  );

  await createIndexIfMissing(
    db.collection("businesses"),
    { propertyId: 1, code: 1 },
    { unique: true, name: "propertyId_1_code_1" }
  );

  console.log("�?Índices verificados correctamente");
}

async function boot() {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/inversionesjcf";

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });

    console.log("�?MongoDB conectado");

    await ensureIndexes();

    server = http.createServer(app);

    server.on("error", (err) => {
      console.error("💥 HTTP server error:", err);
      process.exit(1);
    });

    server.listen(PORT, () => {
      console.log(`🚀 API lista �?http://localhost:${PORT}`);
    });

    // Job (inactividad) �?cada 10 min
    const intervalMs = 10 * 60 * 1000;
    idleTimer = setInterval(() => {
      Promise.resolve(idleSessionsJob()).catch((e) =>
        console.error("💥 idleSessionsJob error:", e)
      );
    }, intervalMs);
    idleTimer.unref?.();
  } catch (e) {
    console.error("💥 Error al iniciar la API:", e);
    process.exit(1);
  }
}

async function shutdown(code = 0, signal = "") {
  try {
    if (idleTimer) clearInterval(idleTimer);

    if (server) {
      await new Promise((resolve) => server.close(resolve));
      server = null;
    }

    await mongoose.disconnect().catch(() => { });
    console.log("🔒 Shutdown limpio.");
  } finally {
    // nodemon usa SIGUSR2 para reiniciar.
    if (signal === "SIGUSR2") {
      process.kill(process.pid, "SIGUSR2");
      return;
    }
    process.exit(code);
  }
}

["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => shutdown(0, sig)));
process.once("SIGUSR2", () => shutdown(0, "SIGUSR2"));

boot();
