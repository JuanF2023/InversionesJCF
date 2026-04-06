// server/scripts/move-to-modules.mjs
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC  = path.join(ROOT, "src");

// === 1) Mapeo de módulos por prefijos de archivo ===
// Puedes ajustar/añadir prefijos cuando agregues nuevas features
const MODULE_PREFIXES = {
  // corporativo "core"
  corporativo: [
    "banks", "business", "businessCategories", "businessTypes",
    "catalog", "countries", "ideas", "incomes",
    "memberships", "projects", "properties", "units",
    "transactions", "monthlyProduction", "properties.media"
  ],
  // Si luego agregas "restaurante", "logistica", etc, crea arrays aquí
  // restaurante: ["menus", "orders", ...]
};

// Si un archivo no calza, lo mandamos a este módulo:
const FALLBACK_MODULE = "corporativo";

// === 2) Dónde están los archivos viejos ===
const OLD = {
  controllers: path.join(SRC, "controllers"),
  models:      path.join(SRC, "models"),
  routes:      path.join(SRC, "routes"),
};

// === 3) Helpers ===
async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

function detectModuleFromBase(basename) {
  const base = basename.toLowerCase();
  for (const [mod, prefixes] of Object.entries(MODULE_PREFIXES)) {
    for (const pref of prefixes) {
      const p = pref.toLowerCase();
      if (base === `${p}.js` || base.startsWith(`${p}.`)) return mod;
    }
  }
  return FALLBACK_MODULE;
}

function moduleDirs(mod) {
  const base = path.join(SRC, "modules", mod);
  return {
    base,
    controllers: path.join(base, "controllers"),
    models:      path.join(base, "models"),
    routes:      path.join(base, "routes"),
    services:    path.join(base, "services"),
    validations: path.join(base, "validations"),
    dtos:        path.join(base, "dtos"),
    tests:       path.join(base, "tests"),
    index:       path.join(base, "index.js"),
  };
}

async function listFiles(dir) {
  try {
    const ents = await fs.readdir(dir, { withFileTypes: true });
    return ents.filter(e => e.isFile() && e.name.endsWith(".js") && e.name !== ".gitkeep")
               .map(e => path.join(dir, e.name));
  } catch { return []; }
}

async function moveFilesOf(kind) {
  const oldDir = OLD[kind];
  const files = await listFiles(oldDir);
  for (const full of files) {
    const base = path.basename(full);
    const mod  = detectModuleFromBase(base);
    const dirs = moduleDirs(mod);

    // crea toda la estructura (8 subcarpetas + index.js)
    await ensureDir(dirs.controllers);
    await ensureDir(dirs.models);
    await ensureDir(dirs.routes);
    await ensureDir(dirs.services);
    await ensureDir(dirs.validations);
    await ensureDir(dirs.dtos);
    await ensureDir(dirs.tests);

    try {
      await fs.access(dirs.index);
    } catch {
      await fs.writeFile(dirs.index, `// index del módulo ${mod}\nexport {};`, "utf8");
    }

    const destDir = dirs[kind];
    const dest = path.join(destDir, base);

    await fs.rename(full, dest);
    console.log(`✔ moved: ${kind}/${base}  →  modules/${mod}/${kind}/${base}`);
  }
}

(async function main() {
  console.log("== Reorganizando a src/modules/* ==");
  await moveFilesOf("models");
  await moveFilesOf("controllers");
  await moveFilesOf("routes");
  console.log("\nListo. Ahora corre: node scripts/fix-imports-and-headers.mjs");
})().catch(err => {
  console.error(err);
  process.exit(1);
});
