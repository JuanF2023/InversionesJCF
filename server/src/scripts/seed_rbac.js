// server/src/scripts/seed_rbac.js
import { getDb } from "../config/db.js";

const OWNER_EMAIL = "juanito003013_@hotmail.com";

console.log("🚀 Iniciando seed RBAC...");

(async () => {
  try {
    const db = await getDb();
    console.log("�?Conectado a la base de datos");

    // Colecciones
    const rolesCol = db.collection("roles");
    const usersCol = db.collection("users");
    const membershipsCol = db.collection("memberships");
    const tenantsCol = db.collection("tenants");

    // -----------------------------
    // 1️⃣ Definir roles y permisos base
    // -----------------------------
    const roles = [
      {
        key: "owner",
        nombre: "Owner",
        descripcion: "Acceso total al sistema",
        permisos: [
          "users.manage",
          "roles.manage",
          "tenants.manage",
          "properties.manage",
          "business.manage",
          "transactions.manage",
        ],
      },
      {
        key: "corporate_admin",
        nombre: "Administrador Corporativo",
        descripcion: "Administra todos los negocios y propiedades del corporativo",
        permisos: [
          "users.manage",
          "business.manage",
          "properties.manage",
          "transactions.view",
        ],
      },
      {
        key: "gerente",
        nombre: "Gerente",
        descripcion: "Gestiona operaciones y reportes de su sucursal",
        permisos: ["orders.manage", "reports.view", "staff.manage"],
      },
      {
        key: "empleado",
        nombre: "Empleado",
        descripcion: "Acceso limitado a funciones de restaurante",
        permisos: ["orders.create", "orders.view", "clock.manage"],
      },
    ];

    // Insertar o actualizar roles
    for (const role of roles) {
      await rolesCol.updateOne(
        { key: role.key },
        { $set: { ...role, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`�?Rol '${role.key}' insertado o actualizado.`);
    }

    // -----------------------------
    // 2️⃣ Crear tenant corporativo base
    // -----------------------------
    const tenant = await tenantsCol.findOneAndUpdate(
      { nombre: "Corporativo" },
      {
        $set: {
          nombre: "Corporativo",
          tipo: "corporativo",
          estado: "activo",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" }
    );

    const tenantId = tenant.value?._id;
    console.log(`🏢 Tenant corporativo listo: ${tenantId}`);

    // -----------------------------
    // 3️⃣ Asignar rol 'owner' al usuario principal
    // -----------------------------
    const user = await usersCol.findOne({ email: OWNER_EMAIL });
    if (!user) {
      console.warn(`⚠️ Usuario ${OWNER_EMAIL} no encontrado en la colección 'users'.`);
      console.warn("Asegúrate de haber creado el usuario con ese correo antes de correr el seed.");
      return;
    }

    const ownerRole = await rolesCol.findOne({ key: "owner" });
    if (!ownerRole) {
      console.error("�?No se encontró el rol 'owner'. Verifica la colección 'roles'.");
      return;
    }

    await membershipsCol.updateOne(
      { userId: user._id, tenantId },
      {
        $set: {
          userId: user._id,
          tenantId,
          roles: [ownerRole.key],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`�?Usuario ${OWNER_EMAIL} tiene rol 'owner' y membership creada.`);

    console.log("🎉 Seed RBAC completado exitosamente.");
    process.exit(0);
  } catch (err) {
    console.error("�?Error ejecutando seed_rbac.js:", err);
    process.exit(1);
  }
})();
