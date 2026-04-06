// server/scripts/fix-imports-and-headers.mjs
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC  = path.join(ROOT, "src");
const MODS = path.join(SRC, "modules");

// regex para encontrar imports ESM
const IMPORT_RE = /from\s+["']([^"']+)["']/g;

// mapea targets de raíz a la nueva profundidad
const ROOT_FOLDERS = ["middlewares", "utils", "lib", "config", "constants"];

async function walk(dir) {
  const out = [];
  const ents = await fs.readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.isFile() && e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

function fixRootImport(spec, fromFile) {
  // Queremos reescribir solo imports tipo "../middlewares/x" o "../../utils/y" etc
  // y llevarlos a la profundidad correcta (../../<carpeta>/archivo)
  // Punto de partida: modules/<mod>/(controllers|models|routes)/*
  const relToSrc = path.relative(path.join(SRC, "modules"), path.dirname(fromFile));
  // relToSrc: "<mod>/<carpeta>" → subir dos niveles hasta "src"
  const upToSrc = "../../"; // desde modules/<mod>/<subcarpeta> hasta src/
  for (const rf of ROOT_FOLDERS) {
    // distintos patrones comunes:
    const patterns = [
      `../${rf}/`, `./../${rf}/`, `../../${rf}/`, `./../../${rf}/`,
      `${rf}/` // por si alguien usó alias relativo (raro)
    ];
    for (const pat of patterns) {
      if (spec.startsWith(pat)) {
        // normalizamos a "../../<rf>/..."
        const rest = spec.slice(pat.length);
        return upToSrc + rf + "/" + rest;
      }
    }
  }
  return spec;
}

function withHeaderComment(filePath, content) {
  const virtual = filePath.replace(SRC + path.sep, "").replace(/\\/g, "/");
  const header  = `// ${virtual}\n`;
  if (content.startsWith("// ")) return content; // ya tiene cabecera
  return header + content;
}

async function fixFile(file) {
  let text = await fs.readFile(file, "utf8");
  // reescribe imports
  text = text.replace(IMPORT_RE, (m, spec) => {
    const fixed = fixRootImport(spec, file);
    return `from "${fixed}"`;
  });
  // añade cabecera con ruta
  text = withHeaderComment(file, text);
  await fs.writeFile(file, text, "utf8");
}

(async function main() {
  console.log("== Arreglando imports y encabezados en src/modules/* ==");
  try {
    const files = await walk(MODS);
    for (const f of files) {
      await fixFile(f);
      console.log("✔ patched:", f.replace(SRC + path.sep, ""));
    }
    console.log("\nListo ✅");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
