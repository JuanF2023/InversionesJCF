// _tools/reorg.js  — versión sin JSON externo
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Raíz del workspace reorg
const ROOT = path.resolve(__dirname, '..');

// 🔧 Config embebida (antes estaba en reorg.config.json)
const CONFIG = {
  moves: [
    { from: "client/src/pages/Corporativo",                           to: "client/src/features/corporativo" },
    { from: "client/src/components/layout/CorporativoLayout.jsx",     to: "client/src/features/corporativo/layout/CorporativoLayout.jsx" },
    { from: "client/src/components/layouts/CorporativoLayout.jsx",    to: "client/src/features/corporativo/layout/CorporativoLayout.jsx" },
    { from: "client/src/pages/LoginPage.jsx",                          to: "client/src/features/auth/pages/LoginPage.jsx" }
  ]
};

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true }).catch(()=>{});
}

async function movePath(fromRel, toRel) {
  const fromAbs = path.join(ROOT, fromRel);
  const toAbs   = path.join(ROOT, toRel);

  try {
    const st = await fs.lstat(fromAbs);
    await ensureDir(path.dirname(toAbs));

    if (st.isDirectory()) {
      await ensureDir(toAbs);
      const entries = await fs.readdir(fromAbs, { withFileTypes: true });
      for (const e of entries) {
        const s = path.join(fromAbs, e.name);
        const d = path.join(toAbs,   e.name);
        if (e.isDirectory()) {
          await movePath(path.join(fromRel, e.name), path.join(toRel, e.name));
        } else {
          await ensureDir(path.dirname(d));
          await fs.rename(s, d).catch(async () => { await fs.copyFile(s, d); await fs.unlink(s); });
          console.log('mv', path.join(fromRel, e.name), '->', path.join(toRel, e.name));
        }
      }
      // borra dir origen si queda vacío
      await fs.rmdir(fromAbs).catch(()=>{});
    } else {
      await ensureDir(path.dirname(toAbs));
      await fs.rename(fromAbs, toAbs).catch(async () => { await fs.copyFile(fromAbs, toAbs); await fs.unlink(fromAbs); });
      console.log('mv', fromRel, '->', toRel);
    }
  } catch (e) {
    // no existe: omitir en silencio
  }
}

for (const rule of CONFIG.moves) {
  await movePath(rule.from, rule.to);
}

console.log('✅ Move phase done.');
