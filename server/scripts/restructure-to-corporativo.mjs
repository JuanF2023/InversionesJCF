import { promises as fs } from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const OLD_DIRS = {
  models: path.join(SRC, "models"),
  controllers: path.join(SRC, "controllers"),
  routes: path.join(SRC, "routes"),
};

const NEW_BASE = path.join(SRC, "modules", "corporativo");
const NEW_DIRS = {
  models: path.join(NEW_BASE, "models"),
  controllers: path.join(NEW_BASE, "controllers"),
  routes: path.join(NEW_BASE, "routes"),
};

const EXCLUDED_BASENAMES = new Set([
  "auth.controller.js",
  "users.controller.js",
  "users.routes.js",
  "roles.routes.js",
  "roles.controller.js",
  "permissions.routes.js",
  "permissions.controller.js",
  "tenants.routes.js",
  "tenants.controller.js",
  "audit.routes.js",
  "audit.controller.js",
]);

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function listFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter(e => e.isFile() && e.name.endsWith(".js") && e.name !== ".gitkeep")
      .map(e => path.join(dir, e.name));
  } catch {
    return [];
  }
}

function shouldExclude(fullPath) {
  const base = path.basename(fullPath);
  if (EXCLUDED_BASENAMES.has(base)) return true;
  const low = base.toLowerCase();
  return ["auth", "role", "permission", "tenant", "audit"].some(p => low.startsWith(p));
}

function newDest(oldFile, kind) {
  return path.join(NEW_DIRS[kind], path.basename(oldFile));
}

function stubContent(kind, filename) {
  const from = path.join(SRC, kind, filename);
  const to = path.join(NEW_DIRS[kind], filename);
  const rel = path.relative(path.dirname(from), to).replace(/\\/g, "/");
  return `// AUTO-GENERATED STUB ¡ú re-export desde modules/corporativo
export * from "${rel}";
export { default } from "${rel}";
`;
}

async function moveWithStub(kind) {
  const oldDir = OLD_DIRS[kind];
  const newDir = NEW_DIRS[kind];
  await ensureDir(newDir);

  const files = await listFiles(oldDir);
  for (const f of files) {
    const base = path.basename(f);
    if (shouldExclude(f)) continue;

    const dest = newDest(f, kind);
    await fs.rename(f, dest);

    const stubPath = path.join(oldDir, base);
    await fs.writeFile(stubPath, stubContent(kind, base), "utf8");
    console.log(`¡ú ${kind}: ${base}  =>  modules/corporativo/${kind}/${base}  (stub creado)`);
  }
}

(async () => {
  console.log("== Reestructurando a modules/corporativo ==");
  await ensureDir(NEW_BASE);
  await moveWithStub("models");
  await moveWithStub("controllers");
  await moveWithStub("routes");

  console.log("\n? Listo.");
  console.log("   ? Archivos movidos a src/modules/corporativo/* con stubs en src/*");
})();
