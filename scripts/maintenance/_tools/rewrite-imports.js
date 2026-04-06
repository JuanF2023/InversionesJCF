// _tools/rewrite-imports.js — versión sin JSON externo
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// 🔧 Reglas embebidas (antes venían en reorg.config.json)
const REWRITE = [
  { from: '@/pages/Corporativo/',                 to: '@/features/corporativo/' },
  { from: '@/components/layouts/CorporativoLayout', to: '@/features/corporativo/layout/CorporativoLayout' },
  { from: '@/components/layout/CorporativoLayout',  to: '@/features/corporativo/layout/CorporativoLayout' },
  { from: '@/pages/LoginPage',                    to: '@/features/auth/pages/LoginPage' }
];

const exts = new Set(['.js','.jsx','.ts','.tsx']);

async function* walk(dir) {
  for (const d of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function rewriteLine(line) {
  if (!/^\s*(import|export)\s/.test(line)) return line;
  let out = line;
  for (const r of REWRITE) out = out.replaceAll(r.from, r.to);
  return out;
}

async function processFile(file) {
  if (!exts.has(path.extname(file))) return;
  const src = await fs.readFile(file, 'utf8');
  const out = src.split('\n').map(rewriteLine).join('\n');
  if (out !== src) {
    await fs.writeFile(file, out, 'utf8');
    console.log('rewrite', path.relative(ROOT, file));
  }
}

for await (const f of walk(ROOT)) {
  await processFile(f);
}
console.log('✅ Rewrite phase done.');
