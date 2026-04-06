// server/src/scripts/createIndexes.js
import { getDb } from "../config/db.js";

(async () => {
  try {
    console.log("🔗 Conectando a MongoDB...");
    const db = await getDb();

    /* ===========================================================
       1️⃣  BUSINESS CATEGORIES
       -----------------------------------------------------------
       Cada categoría debe tener un nombre único
    =========================================================== */
    await db.collection("business_categories").createIndex(
      { nombre: 1 },
      { unique: true, name: "nombre_unique" }
    );

    /* ===========================================================
       2️⃣  BUSINESS TYPES
       -----------------------------------------------------------
       Un tipo de negocio pertenece a una categoría.
       Combinación única: (categoriaId + nombre)
       Y además un slug único para búsquedas rápidas.
    =========================================================== */
    await db.collection("business_types").createIndex(
      { categoriaId: 1, nombre: 1 },
      { unique: true, name: "categoria_nombre_unique" }
    );

    await db.collection("business_types").createIndex(
      { slug: 1 },
      { unique: true, sparse: true, name: "slug_unique" }
    );

    /* ===========================================================
       3️⃣  BUSINESSES
       -----------------------------------------------------------
       Cada negocio tiene una propiedad relacionada (propertyId)
       y un código único dentro de esa propiedad.
       También índices de apoyo para búsquedas frecuentes.
    =========================================================== */
    await db.collection("businesses").createIndex(
      { propertyId: 1, code: 1 },
      { unique: true, name: "propertyId_code_unique" }
    );

    await db.collection("businesses").createIndex(
      { status: 1 },
      { name: "status_idx" }
    );

    await db.collection("businesses").createIndex(
      { typeId: 1 },
      { name: "typeId_idx" }
    );

    await db.collection("businesses").createIndex(
      { categoryId: 1 },
      { name: "categoryId_idx" }
    );

    console.log("�?Índices creados o ya existentes.");
    process.exit(0);
  } catch (err) {
    console.error("�?Error al crear índices:", err.message);
    process.exit(1);
  }
})();
