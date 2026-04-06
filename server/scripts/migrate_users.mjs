// server/scripts/migrate_users.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/inversionesjcf";

function col(name) { return mongoose.connection.db.collection(name); }

async function run() {
  await mongoose.connect(MONGO_URI, { maxPoolSize: 5 });
  const db = mongoose.connection.db;

  console.log("✅ Conectado:", MONGO_URI);

  // 1) Normaliza users: status -> activo, pin -> pinHash
  const users = col("users");

  // a) status -> activo (si existe)
  const r1 = await users.updateMany(
    { status: { $exists: true } },
    [
      {
        $set: {
          activo: {
            $cond: [{ $eq: ["$status", "active"] }, true,
                    { $cond: [{ $eq: ["$status", "inactive"] }, false, { $ifNull: ["$activo", true] }] }]
          }
        }
      },
      { $unset: "status" }
    ]
  );
  console.log(`🔧 Users normalizados (status->activo): matched=${r1.matchedCount}, modified=${r1.modifiedCount}`);

  // b) hash de PIN plano a pinHash
  const toHash = await users.find({ pin: { $exists: true }, pinHash: { $exists: false } }).toArray();
  for (const u of toHash) {
    const pin = String(u.pin || "");
    if (!/^\d{4}$|^\d{6}$/.test(pin)) continue;
    const pinHash = await bcrypt.hash(pin, 10);
    await users.updateOne({ _id: u._id }, { $set: { pinHash }, $unset: { pin: "" } });
  }
  console.log(`🔐 PINs hasheados: ${toHash.length}`);

  // c) índices de users
  await users.createIndex({ email: 1 }, { unique: true, sparse: true, name: "email_1_unique_sparse" });
  await users.createIndex({ tenantId: 1, activo: 1 }, { name: "tenant_activo_1" });

  // 2) Limpiar colecciones duplicadas
  for (const dup of ["txncategories", "txnconcepts"]) {
    const exists = await db.listCollections({ name: dup }).hasNext();
    if (exists) { await db.dropCollection(dup); console.log(`🧹 Drop ${dup}`); }
  }

  // 3) Índices de memberships
  const memberships = col("memberships");
  await memberships.createIndex(
    { userId: 1, businessId: 1 },
    { unique: true, sparse: true, partialFilterExpression: { businessId: { $exists: true } }, name: "uniq_user_business" }
  );
  await memberships.createIndex(
    { userId: 1, tenantId: 1, scope: 1 },
    { unique: true, sparse: true, partialFilterExpression: { scope: "tenant", tenantId: { $exists: true } }, name: "uniq_user_tenant_scope" }
  );

  console.log("🎯 Migración completa.");
  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error("💥 Migración fallida:", e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
