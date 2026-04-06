import { getDb } from "../config/db.js";

(async () => {
  const db = await getDb();

  await db.collection("businesses").createIndex({ status: 1 });
  await db.collection("businesses").createIndex({ propertyId: 1 });

  await db.collection("business_incomes").createIndex({ businessId: 1, ym: 1 });
  await db.collection("business_incomes").createIndex({ ym: 1 });

  await db.collection("business_costs").createIndex({ businessId: 1, ym: 1 });
  await db.collection("business_costs").createIndex({ ym: 1 });

  console.log("✅ Índices corporativo/negocios creados");
  process.exit(0);
})();
