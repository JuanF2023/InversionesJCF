// server/src/core/infrastructure/services/media.service.js
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Uploads locales (disco)
 *
 * Reglas enterprise:
 * - Directorio físico: server/uploads (fuera de /src)
 * - URL pública: /uploads/<filename>
 * - app.js debe exponerlo con: app.use("/uploads", express.static(getUploadsDir()))
 *
 * Importante:
 * - NO dependemos ciegamente de process.cwd() porque cambia según dónde se ejecute nodemon/node.
 * - Permitimos override por env: UPLOADS_DIR
 */

const PUBLIC_PREFIX = "/uploads";

/* -------------------- path resolution -------------------- */

/**
 * Resuelve de forma robusta el directorio físico de uploads.
 * Prioridad:
 * 1) process.env.UPLOADS_DIR
 * 2) Si cwd termina en "server" => <cwd>/uploads
 * 3) Si existe <cwd>/server/uploads => úsalo (monorepo/root)
 * 4) Fallback: <cwd>/uploads
 */
function resolveUploadsDir() {
    const envDir = String(process.env.UPLOADS_DIR || "").trim();
    if (envDir) return path.resolve(envDir);

    const cwd = process.cwd();
    const baseName = path.basename(cwd);

    if (baseName.toLowerCase() === "server") {
        return path.resolve(cwd, "uploads");
    }

    const candidate = path.resolve(cwd, "server", "uploads");
    // Evita fs sync; como esto corre una vez al cargar el módulo,
    // usamos una heurística simple con try/catch async en ensureUploadsDir().
    // Aquí devolvemos candidate si parece razonable.
    return candidate;
}

const UPLOADS_DIR = resolveUploadsDir();

/* -------------------- helpers -------------------- */

async function ensureUploadsDir() {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    } catch (e) {
        // Si el candidate era <cwd>/server/uploads pero no existe el /server,
        // caemos a <cwd>/uploads como último recurso.
        if (String(e?.code) === "ENOENT") {
            const fallback = path.resolve(process.cwd(), "uploads");
            await fs.mkdir(fallback, { recursive: true });
            // eslint-disable-next-line no-global-assign
            // Nota: no reasignamos const; por eso en este caso tiramos error controlado
            // para que el dev corrija el cwd o setee UPLOADS_DIR.
            throw new Error(
                `media.ensureUploadsDir: no se pudo crear '${UPLOADS_DIR}'. ` +
                `Ejecuta el server desde la carpeta 'server' o define UPLOADS_DIR.`
            );
        }
        throw e;
    }
}

function uniqueFilename(originalname = "file.bin") {
    const ext = path.extname(originalname) || "";
    const base = crypto.randomBytes(16).toString("hex");
    return `${base}${ext}`;
}

function publicUrlFor(filename) {
    return `${PUBLIC_PREFIX}/${filename}`.replace(/\\/g, "/");
}

/**
 * Extrae filename desde:
 * - filename directo: "abc.jpg"
 * - ruta pública: "/uploads/abc.jpg"
 * - url absoluta: "https://dominio.com/uploads/abc.jpg"
 */
function filenameFromKeyOrUrl(keyOrUrl = "") {
    const raw = String(keyOrUrl || "").trim();
    if (!raw) return "";

    // Caso: "/uploads/abc.jpg"
    if (raw.startsWith(`${PUBLIC_PREFIX}/`)) {
        return raw.slice(PUBLIC_PREFIX.length + 1);
    }

    // Caso: URL absoluta
    try {
        const u = new URL(raw);
        const p = u.pathname || "";
        if (p.includes(`${PUBLIC_PREFIX}/`)) {
            return p.substring(p.lastIndexOf("/") + 1);
        }
        // URL que no apunta a /uploads -> no es archivo local eliminable
        return "";
    } catch {
        // No es URL: probablemente "abc.jpg" o "uploads/abc.jpg"
        return raw.replace(/^\/?uploads\/?/, "");
    }
}

/* -------------------- API -------------------- */

/**
 * Sube un archivo a almacenamiento local (server/uploads).
 *
 * Soporta:
 * - Multer file: { buffer: Buffer|Uint8Array, originalname: string }
 * - Objeto: { buffer, originalname }
 * - URL ya existente: { url: string } => retorna esa url (no guarda nada)
 *
 * @returns {Promise<{ url: string, key: string, filename: string }>}
 */
export async function uploadFile(input) {
    await ensureUploadsDir();

    // Si ya viene URL, respetarla (no es archivo local)
    if (input?.url && typeof input.url === "string") {
        return {
            url: input.url,
            key: input.url,
            filename: path.basename(input.url),
        };
    }

    const buffer = input?.buffer;
    if (!buffer || !(buffer instanceof Uint8Array)) {
        throw new Error(
            "media.uploadFile: payload inválido. Se requiere { buffer } o { url }."
        );
    }

    const filename = uniqueFilename(input?.originalname || "file.bin");
    const dest = path.join(UPLOADS_DIR, filename);

    await fs.writeFile(dest, buffer);

    return {
        url: publicUrlFor(filename),
        key: filename,
        filename,
    };
}

/**
 * Elimina un archivo del almacenamiento local.
 * Acepta:
 * - filename ("abc.jpg")
 * - "/uploads/abc.jpg"
 * - "https://.../uploads/abc.jpg"
 */
export async function deleteFile(keyOrUrl) {
    await ensureUploadsDir();

    const filename = filenameFromKeyOrUrl(keyOrUrl);
    if (!filename) return;

    const target = path.join(UPLOADS_DIR, filename);

    try {
        await fs.unlink(target);
    } catch (err) {
        if (err?.code === "ENOENT") return;
        throw err;
    }
}

/**
 * Lista archivos locales en uploads (debug/admin).
 * @returns {Promise<Array<{ filename: string, url: string }>>}
 */
export async function listFiles() {
    await ensureUploadsDir();
    const files = await fs.readdir(UPLOADS_DIR);
    return files.map((f) => ({ filename: f, url: publicUrlFor(f) }));
}

/**
 * Devuelve la ruta física de uploads (para app.js).
 * Evita duplicar lógica de path.
 */
export function getUploadsDir() {
    return UPLOADS_DIR;
}

export default {
    uploadFile,
    deleteFile,
    listFiles,
    getUploadsDir,
};
