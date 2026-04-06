// server/scripts/seedAuthProd.js
// -------------------------------------------------------------
// Seed de configuración de AUTH en producción para Inversiones JCF
// - Limpia: tenants, permissions, roles, memberships
// - NO toca: users (solo hace upsert de algunos usuarios clave)
// - Crea:
//   * Tenants: CORP, REST01
//   * Roles: ADMIN_CORP, LEGAL_REP_CORP, MANAGER_REST, COOK_REST, SERVER_REST
//   * Memberships: relaciones usuario ↔ tenant ↔ rol
// -------------------------------------------------------------

import "dotenv/config";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

/**
 * Helper para conectar a Mongo
 */
async function connectMongo() {
    const uri =
        process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/inversionesjcf"; // fallback local

    console.log("🔥 Conectando a MongoDB…");
    await mongoose.connect(uri, {
        autoIndex: false,
    });

    console.log("✅ Conectado a MongoDB");
}

/**
 * Helper para garantizar que exista un usuario, sin borrar el documento actual.
 * - Busca por email.
 * - Si existe → lo deja como está.
 * - Si NO existe → lo inserta con los datos base.
 * Devuelve siempre el _id del usuario.
 */
async function ensureUser(db, baseUser) {
    const usersCol = db.collection("users");

    const email = baseUser.email.toLowerCase();
    const now = new Date();

    // Datos que solo se ponen si el usuario NO existe
    const toInsert = {
        ...baseUser,
        email,
        status: "active",
        isTempPin: true,
        pinLength: baseUser.pin?.length || baseUser.pinLength || 4,
        createdAt: now,
        updatedAt: now,
    };

    let result;
    try {
        result = await usersCol.findOneAndUpdate(
            { email },
            {
                $setOnInsert: toInsert,
            },
            {
                upsert: true,
                // Algunos drivers usan returnOriginal, otros returnDocument
                returnDocument: "after",
            }
        );
    } catch (err) {
        console.error(`❌ Error en findOneAndUpdate para email=${email}:`, err);
        throw err;
    }

    let userDoc = result?.value || null;

    // ⚠️ Fallback: si por tema de versión del driver viene null,
    // buscamos manualmente el usuario.
    if (!userDoc) {
        userDoc = await usersCol.findOne({ email });
    }

    if (!userDoc) {
        throw new Error(`No se pudo garantizar usuario para email=${email}`);
    }

    console.log(`👤 Usuario listo: ${email}  (_id=${userDoc._id})`);
    return userDoc._id;
}


async function main() {
    await connectMongo();

    const db = mongoose.connection;

    const tenantsCol = db.collection("tenants");
    const permissionsCol = db.collection("permissions");
    const rolesCol = db.collection("roles");
    const membershipsCol = db.collection("memberships");
    const usersCol = db.collection("users"); // reservado para futuras validaciones

    console.log(
        "🧹 Limpiando colecciones de configuración (TENANTS/ROLES/PERMISSIONS/MEMBERSHIPS)…"
    );

    await Promise.all([
        tenantsCol.deleteMany({}),
        permissionsCol.deleteMany({}),
        rolesCol.deleteMany({}),
        membershipsCol.deleteMany({}),
        // ❗ OJO: NO tocamos users aquí
    ]);

    console.log("✅ Colecciones limpiadas (sin tocar users)");

    const now = new Date();

    // -----------------------------------------------------------
    // 1) TENANTS
    // -----------------------------------------------------------

    const corpTenantId = new ObjectId();
    const restTenantId = new ObjectId();

    const tenants = [
        {
            _id: corpTenantId,
            key: "CORP",
            slug: "corporativo-inversionesjcf",
            name: "Corporativo Inversiones JCF",
            type: "corporativo",
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: restTenantId,
            key: "REST01",
            slug: "restaurante-01",
            name: "Restaurante 01",
            type: "restaurante",
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
    ];

    await tenantsCol.insertMany(tenants);
    console.log("🏢 Tenants creados:", tenants.map((t) => t.key).join(", "));

    // -----------------------------------------------------------
    // 2) PERMISSIONS (formales para Inversiones JCF)
    // -----------------------------------------------------------

    // Pre-generamos ids para poder referenciarlos desde ROLES
    const permIds = {
        // Corporativo: usuarios / sesiones / configuración
        CORP_USERS_READ: new ObjectId(),
        CORP_USERS_MANAGE: new ObjectId(),
        CORP_SESSIONS_MONITOR: new ObjectId(),
        CORP_CONFIG_READ: new ObjectId(),
        CORP_CONFIG_MANAGE: new ObjectId(),

        // Corporativo: negocios / propiedades / ingresos / legal
        CORP_BUSINESSES_READ: new ObjectId(),
        CORP_BUSINESSES_MANAGE: new ObjectId(),
        CORP_PROPERTIES_READ: new ObjectId(),
        CORP_PROPERTIES_MANAGE: new ObjectId(),
        CORP_INCOME_READ: new ObjectId(),
        CORP_LEGAL_VIEW_DOCS: new ObjectId(),
        CORP_LEGAL_APPROVE: new ObjectId(),

        // Restaurante 01: operaciones
        REST01_DASHBOARD_VIEW: new ObjectId(),
        REST01_ORDERS_CREATE: new ObjectId(),
        REST01_ORDERS_MANAGE: new ObjectId(),
        REST01_KITCHEN_VIEW: new ObjectId(),
        REST01_MENU_MANAGE: new ObjectId(),
        REST01_SHIFTS_MANAGE: new ObjectId(),
        REST01_CASH_CLOSE: new ObjectId(),
    };

    const permissions = [
        // --- Corporativo: usuarios / sesiones / configuración ---
        {
            _id: permIds.CORP_USERS_READ,
            key: "CORP_USERS_READ",
            tenantKey: "CORP",
            name: "Ver usuarios corporativos",
            description: "Puede listar y ver detalle de usuarios del corporativo.",
            module: "auth",
            scope: "corp.users.read",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_USERS_MANAGE,
            key: "CORP_USERS_MANAGE",
            tenantKey: "CORP",
            name: "Gestionar usuarios corporativos",
            description: "Puede crear, editar y desactivar usuarios del corporativo.",
            module: "auth",
            scope: "corp.users.write",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_SESSIONS_MONITOR,
            key: "CORP_SESSIONS_MONITOR",
            tenantKey: "CORP",
            name: "Monitorear sesiones",
            description:
                "Puede ver sesiones activas, cerrar sesiones en conflicto y revisar estado de conexión.",
            module: "auth",
            scope: "corp.sessions.monitor",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_CONFIG_READ,
            key: "CORP_CONFIG_READ",
            tenantKey: "CORP",
            name: "Ver configuración corporativa",
            description: "Puede ver parámetros globales del corporativo.",
            module: "config",
            scope: "corp.config.read",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_CONFIG_MANAGE,
            key: "CORP_CONFIG_MANAGE",
            tenantKey: "CORP",
            name: "Gestionar configuración corporativa",
            description:
                "Puede modificar parámetros globales: idioma, zona horaria, flujo de negocio.",
            module: "config",
            scope: "corp.config.write",
            createdAt: now,
            updatedAt: now,
        },

        // --- Corporativo: negocios / propiedades / proyectos / ingresos ---
        {
            _id: permIds.CORP_BUSINESSES_READ,
            key: "CORP_BUSINESSES_READ",
            tenantKey: "CORP",
            name: "Ver negocios",
            description:
                "Puede ver el listado de negocios (restaurantes, flotas, etc.).",
            module: "corporativo",
            scope: "corp.businesses.read",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_BUSINESSES_MANAGE,
            key: "CORP_BUSINESSES_MANAGE",
            tenantKey: "CORP",
            name: "Gestionar negocios",
            description: "Puede crear y editar negocios en el corporativo.",
            module: "corporativo",
            scope: "corp.businesses.write",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_PROPERTIES_READ,
            key: "CORP_PROPERTIES_READ",
            tenantKey: "CORP",
            name: "Ver propiedades",
            description:
                "Puede ver el panel de propiedades e indicadores asociados.",
            module: "corporativo",
            scope: "corp.properties.read",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_PROPERTIES_MANAGE,
            key: "CORP_PROPERTIES_MANAGE",
            tenantKey: "CORP",
            name: "Gestionar propiedades",
            description:
                "Puede registrar nuevas propiedades y actualizar información.",
            module: "corporativo",
            scope: "corp.properties.write",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_INCOME_READ,
            key: "CORP_INCOME_READ",
            tenantKey: "CORP",
            name: "Ver ingresos corporativos",
            description:
                "Puede consultar reportes de ingresos y flujos de caja a nivel corporativo.",
            module: "corporativo",
            scope: "corp.income.read",
            createdAt: now,
            updatedAt: now,
        },

        // --- Corporativo: representante legal ---
        {
            _id: permIds.CORP_LEGAL_VIEW_DOCS,
            key: "CORP_LEGAL_VIEW_DOCS",
            tenantKey: "CORP",
            name: "Ver documentos legales",
            description: "Puede ver contratos, escrituras y documentación legal.",
            module: "legal",
            scope: "corp.legal.read",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.CORP_LEGAL_APPROVE,
            key: "CORP_LEGAL_APPROVE",
            tenantKey: "CORP",
            name: "Aprobar decisiones legales",
            description:
                "Puede aprobar contratos, autorizaciones importantes y resoluciones de inversión.",
            module: "legal",
            scope: "corp.legal.approve",
            createdAt: now,
            updatedAt: now,
        },

        // --- Restaurante 01: órdenes, menú, turnos, caja ---
        {
            _id: permIds.REST01_DASHBOARD_VIEW,
            key: "REST01_DASHBOARD_VIEW",
            tenantKey: "REST01",
            name: "Ver panel del restaurante",
            description:
                "Puede ver el panel principal con órdenes abiertas, ventas del día e indicadores básicos.",
            module: "restaurante",
            scope: "rest01.dashboard.view",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.REST01_ORDERS_CREATE,
            key: "REST01_ORDERS_CREATE",
            tenantKey: "REST01",
            name: "Crear órdenes",
            description: "Puede abrir nuevas órdenes desde las mesas o para llevar.",
            module: "restaurante",
            scope: "rest01.orders.create",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.REST01_ORDERS_MANAGE,
            key: "REST01_ORDERS_MANAGE",
            tenantKey: "REST01",
            name: "Gestionar órdenes",
            description:
                "Puede agregar productos, cerrar y cobrar órdenes. Normalmente para encargado/gerente.",
            module: "restaurante",
            scope: "rest01.orders.manage",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.REST01_KITCHEN_VIEW,
            key: "REST01_KITCHEN_VIEW",
            tenantKey: "REST01",
            name: "Ver tickets de cocina",
            description:
                "Puede ver el monitor de cocina y marcar productos como preparados.",
            module: "restaurante",
            scope: "rest01.kitchen.view",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.REST01_MENU_MANAGE,
            key: "REST01_MENU_MANAGE",
            tenantKey: "REST01",
            name: "Gestionar menú",
            description:
                "Puede administrar porciones, combos, precios y disponibilidad del menú.",
            module: "restaurante",
            scope: "rest01.menu.manage",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.REST01_SHIFTS_MANAGE,
            key: "REST01_SHIFTS_MANAGE",
            tenantKey: "REST01",
            name: "Gestionar turnos",
            description:
                "Puede revisar y ajustar turnos, entradas, salidas y descansos registrados.",
            module: "restaurante",
            scope: "rest01.shifts.manage",
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: permIds.REST01_CASH_CLOSE,
            key: "REST01_CASH_CLOSE",
            tenantKey: "REST01",
            name: "Cerrar caja",
            description:
                "Puede realizar el cierre de caja del día, imprimir resumen y registrar montos entregados.",
            module: "restaurante",
            scope: "rest01.cash.close",
            createdAt: now,
            updatedAt: now,
        },
    ];

    await permissionsCol.insertMany(permissions);
    console.log(
        "✅ Permisos creados:",
        permissions.map((p) => p.key).join(", ")
    );

    // -----------------------------------------------------------
    // 3) ROLES
    // -----------------------------------------------------------

    const roleIds = {
        ADMIN_CORP: new ObjectId(),
        LEGAL_REP_CORP: new ObjectId(),
        MANAGER_REST: new ObjectId(),
        COOK_REST: new ObjectId(),
        SERVER_REST: new ObjectId(),
    };

    const roles = [
        {
            _id: roleIds.ADMIN_CORP,
            key: "ADMIN_CORP",
            slug: "admin-corp", // ← NUEVO: único, en minúsculas y con guiones
            name: "Administrador Corporativo",
            description:
                "Acceso completo al módulo corporativo y a la configuración de negocios.",
            tenantType: "corporativo",
            permissions: [
                permIds.CORP_USERS_READ,
                permIds.CORP_USERS_MANAGE,
                permIds.CORP_SESSIONS_MONITOR,
                permIds.CORP_CONFIG_READ,
                permIds.CORP_CONFIG_MANAGE,
                permIds.CORP_BUSINESSES_READ,
                permIds.CORP_BUSINESSES_MANAGE,
                permIds.CORP_PROPERTIES_READ,
                permIds.CORP_PROPERTIES_MANAGE,
                permIds.CORP_INCOME_READ,
                permIds.CORP_LEGAL_VIEW_DOCS,
                permIds.CORP_LEGAL_APPROVE,
                // acceso a ver operación del restaurante
                permIds.REST01_DASHBOARD_VIEW,
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: roleIds.LEGAL_REP_CORP,
            key: "LEGAL_REP_CORP",
            slug: "legal-rep-corp", // ← NUEVO
            name: "Representante Legal",
            description:
                "Rol para el representante legal con acceso a documentación y reportes clave.",
            tenantType: "corporativo",
            permissions: [
                permIds.CORP_LEGAL_VIEW_DOCS,
                permIds.CORP_LEGAL_APPROVE,
                permIds.CORP_INCOME_READ,
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: roleIds.MANAGER_REST,
            key: "MANAGER_REST",
            slug: "manager-rest01", // ← NUEVO
            name: "Administrador de Restaurante",
            description:
                "Gestión completa del restaurante: órdenes, menú, turnos y cierre de caja.",
            tenantType: "restaurante",
            permissions: [
                permIds.REST01_DASHBOARD_VIEW,
                permIds.REST01_ORDERS_CREATE,
                permIds.REST01_ORDERS_MANAGE,
                permIds.REST01_KITCHEN_VIEW,
                permIds.REST01_MENU_MANAGE,
                permIds.REST01_SHIFTS_MANAGE,
                permIds.REST01_CASH_CLOSE,
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: roleIds.COOK_REST,
            key: "COOK_REST",
            slug: "cook-rest01", // ← NUEVO
            name: "Cocinero",
            description:
                "Acceso a la pantalla de cocina y tickets de preparación.",
            tenantType: "restaurante",
            permissions: [permIds.REST01_KITCHEN_VIEW],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: roleIds.SERVER_REST,
            key: "SERVER_REST",
            slug: "server-rest01", // ← NUEVO
            name: "Mesero/Mesera",
            description: "Crear y gestionar órdenes de los clientes.",
            tenantType: "restaurante",
            permissions: [
                permIds.REST01_DASHBOARD_VIEW,
                permIds.REST01_ORDERS_CREATE,
                permIds.REST01_ORDERS_MANAGE,
            ],
            createdAt: now,
            updatedAt: now,
        },
    ];


    await rolesCol.insertMany(roles);
    console.log("🧩 Roles creados:", roles.map((r) => r.key).join(", "));

    // -----------------------------------------------------------
    // 4) USUARIOS CLAVE (sin borrar los que ya tienes)
    //   - Sólo se crean si no existen.
    // -----------------------------------------------------------

    console.log("👥 Verificando/creando usuarios base…");

    // 4.1 Juan Flores → ADMIN_CORP + MANAGER_REST
    const juanId = await ensureUser(db, {
        email: "juanito003013_@hotmail.com",
        firstName: "Juan Carlos",
        lastName: "Flores Palacios",
        displayName: "Juan Flores",
        phone: "323-907-8516",
        pin: "779797", // tu pin actual (no se modifica si ya existe)
    });

    // 4.2 Representante Legal
    const legalRepId = await ensureUser(db, {
        email: "representante.legal@inversionesjcf.test",
        firstName: "Representante",
        lastName: "Legal",
        displayName: "Representante Legal",
        phone: "000-000-4444",
        pin: "4444",
    });

    // 4.3 Encargado / Administrador del Restaurante
    const managerId = await ensureUser(db, {
        email: "encargado.restaurante@restaurante01.test",
        firstName: "Encargado",
        lastName: "Restaurante",
        displayName: "Encargado Restaurante",
        phone: "000-000-1111",
        pin: "1111",
    });

    // 4.4 Cocinero
    const cookId = await ensureUser(db, {
        email: "cocinero@restaurante01.test",
        firstName: "Cocinero",
        lastName: "Restaurante",
        displayName: "Cocinero Restaurante",
        phone: "000-000-2222",
        pin: "2222",
    });

    // 4.5 Mesero / Mesera
    const serverId = await ensureUser(db, {
        email: "mesero@restaurante01.test",
        firstName: "Mesero",
        lastName: "Restaurante",
        displayName: "Mesero Restaurante",
        phone: "000-000-3333",
        pin: "3333",
    });

    // -----------------------------------------------------------
    // 5) MEMBERSHIPS: relaciones usuario ↔ tenant ↔ rol
    // -----------------------------------------------------------

    console.log("🔗 Creando memberships…");

    const memberships = [
        // Juan → Corporativo (ADMIN_CORP)
        {
            _id: new ObjectId(),
            userId: juanId,
            tenantId: corpTenantId,
            roleId: roleIds.ADMIN_CORP,
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
        // Juan → Restaurante 01 (MANAGER_REST)
        {
            _id: new ObjectId(),
            userId: juanId,
            tenantId: restTenantId,
            roleId: roleIds.MANAGER_REST,
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
        // Representante Legal → Corporativo
        {
            _id: new ObjectId(),
            userId: legalRepId,
            tenantId: corpTenantId,
            roleId: roleIds.LEGAL_REP_CORP,
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
        // Encargado Restaurante → Restaurante 01
        {
            _id: new ObjectId(),
            userId: managerId,
            tenantId: restTenantId,
            roleId: roleIds.MANAGER_REST,
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
        // Cocinero → Restaurante 01
        {
            _id: new ObjectId(),
            userId: cookId,
            tenantId: restTenantId,
            roleId: roleIds.COOK_REST,
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
        // Mesero → Restaurante 01
        {
            _id: new ObjectId(),
            userId: serverId,
            tenantId: restTenantId,
            roleId: roleIds.SERVER_REST,
            status: "active",
            createdAt: now,
            updatedAt: now,
        },
    ];

    await membershipsCol.insertMany(memberships);
    console.log("✅ Memberships creados:", memberships.length);

    console.log("✨ SEED AUTH COMPLETADO CON ÉXITO ✨");
}

// Ejecutar
main()
    .then(() => {
        console.log("✅ Listo. Cierra este proceso.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Error en seedAuthProd:", err);
        process.exit(1);
    });
