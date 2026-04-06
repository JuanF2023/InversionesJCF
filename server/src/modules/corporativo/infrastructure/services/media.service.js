// server/src/modules/corporativo/infrastructure/services/media.service.js
import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.resolve(process.cwd(), "uploads");

/** Garantiza que exista el directorio de uploads */
function ensureUploadsDir() {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    return UPLOADS_DIR;
}

/** Export requerido por app.js */
export function getUploadsDir() {
    return ensureUploadsDir();
}

/** Nombre seguro para archivo */
function buildSafeFilename(originalname = "file") {
    const ext = path.extname(originalname).slice(0, 16) || "";
    const base = crypto.randomBytes(12).toString("hex");
    return `${base}${ext}`;
}

/**
 * Guarda un file de Multer memoryStorage:
 * file = { buffer, originalname, mimetype, size, ... }
 */
export async function saveFileFromMulter(file) {
    if (!file?.buffer) {
        throw new Error("Archivo inválido (buffer no presente).");
    }

    const dir = ensureUploadsDir();
    const filename = buildSafeFilename(file.originalname);
    const absPath = path.join(dir, filename);

    await fs.promises.writeFile(absPath, file.buffer);

    // path público que tu Express puede servir como estático
    return {
        filename,
        path: `/uploads/${filename}`,
        mimetype: file.mimetype || "application/octet-stream",
        size: Number(file.size || file.buffer.length || 0),
    };
}

/** Borra un archivo por path público (/uploads/xxx) o filename */
export async function deleteFileByPublicPath(publicPathOrName) {
    if (!publicPathOrName) return;

    const s = String(publicPathOrName);
    const filename = s.startsWith("/uploads/") ? s.replace("/uploads/", "") : s;
    const absPath = path.join(UPLOADS_DIR, filename);

    // No explotes si no existe
    try {
        await fs.promises.unlink(absPath);
    } catch (e) {
        if (e?.code !== "ENOENT") throw e;
    }
}

const mediaService = {
    getUploadsDir,
    saveFileFromMulter,
    deleteFileByPublicPath,
};

export default mediaService;
