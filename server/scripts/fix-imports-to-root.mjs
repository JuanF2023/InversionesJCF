/**
 * Reescribe imports relativos dentro de src/modules/corporativo/**
 * que apunten a ../middlewares (o ../lib, ../constants, ../services)
 * para que referencien el directorio raíz src/<dir>/... con la ruta
 * relativa correcta desde cada archivo.
 *
 * Uso:
 *   node ./scripts/fix-imports-to-root.mjs         # Dry-run (muestra cambios)
 *   node ./scripts/fix-imports-to-root.mjs --write # Aplica cambios
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");       // server/src/..
const SRC  = path.join(ROOT, "src");
const MODS = path.join(SRC, "modules", "corporativo");

const ROOT_DIRS = ["middlewares", "lib", "constants", "services", "utils", "validations", "config"];

const WRITE = process.argv.includes("--write");

function isJsFile(name) {
  return name.endsWith(".js") && name !== ".gitkeep";
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile() && isJsFile(e.name)) {
      yield full;
    }
  }
}

function ensureJsExt(spec, hadExt) {
  // Si el import original tenía .js, preservamos.
  // Si no lo tenía, no forzamos.
  if (hadExt) return spec;
  return spec;
}

function replaceInCode(code, filePath) {
  // Captura:  from "spec"  |  from 'spec'
  const FROM_RE = /from\s+(['"])([^'"]+)\1/g;
  // Captura: import("spec")
  const DYN_RE  = /import\(\s*(['"])([^'"]+)\1\s*\)/g;

  const transforms = (m, q, spec, kind) => {
    const hadExt = spec.endsWith(".js");
    if (!spec.startsWith(".")) return m; // sólo relativos

    // ¿Es uno de los directorios raíz?
    const parts = spec.split("/");
    const idx = parts.findIndex(p => ROOT_DIRS.includes(p.replace(/^\.{1,2}$/, "")));
    // Ej: "../middlewares/validateObjectId.js" → idx será 1 (la posición de "middlewares")
    //     "./x/../middlewares/xx" también lo encuentra si aparece el segmento.

    // Si no aparece ninguno, intentamos detectar patrones tipo "../middlewares/..."
    let rootHit = null;
    for (const root of ROOT_DIRS) {
      const marker = `/${root}/`;
      if (spec.includes(marker) || spec.startsWith(`./${root}/`) || spec.startsWith(`../${root}/`)) {
        rootHit = root;
        break;
      }
    }
    if (!rootHit) return m;

    // Extrae la parte "después de <rootHit>/"
    const after = spec.split(`${rootHit}/`)[1];
    if (!after) return m; // algo raro

    // Construye destino absoluto: src/<rootHit>/<after>
    const destAbs = path.join(SRC, rootHit, after);
    // Relativo desde el archivo actual:
    const fileDir = path.dirname(filePath);
    let rel = path.relative(fileDir, destAbs).replace(/\\/g, "/");
    if (!rel.startsWith(".")) rel = `./${rel}`;

    rel = ensureJsExt(rel, hadExt);

    if (kind === "from") return `from ${q}${rel}${q}`;
    if (kind === "dyn")  return `import(${q}${rel}${q})`;

    return m;
  };

  let out = code;

  out = out.replace(FROM_RE, (m, q, spec) => transforms(m, q, spec, "from"));
  out = out.replace(DYN_RE,  (m, q, spec) => transforms(m, q, spec, "dyn"));

  return out;
}

async function run() {
  console.log(`\nScanning: ${MODS.replace(path.resolve() + path.sep, "")}\n`);

  let changedCount = 0;
  for await (const file of walk(MODS)) {
    const before = await fs.readFile(file, "utf8");
    const after  = replaceInCode(before, file);

    if (before !== after) {
      changedCount++;
      const rel = file.replace(path.resolve() + path.sep, "");
      if (WRITE) {
        await fs.writeFile(file, after, "utf8");
        console.log(`✔ REWRITTEN: ${rel}`);
      } else {
        console.log(`~ Would change: ${rel}`);
      }
    }
  }

  if (!changedCount) {
    console.log("No se detectaron imports a corregir.");
  } else if (!WRITE) {
    console.log(`\nSe detectaron ${changedCount} archivo(s) con cambios. Ejecuta con --write para aplicarlos.`);
  } else {
    console.log(`\nListo. Reescritos ${changedCount} archivo(s).`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
