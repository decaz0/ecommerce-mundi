"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ----------------------------------------
// Subida de IMÁGENES
// ----------------------------------------
export async function uploadImage(
  formData: FormData,
  folder: string = "general"
): Promise<{ url: string | null; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return { url: null, error: "No se recibió ningún archivo" };

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) return { url: null, error: "El archivo excede los 10MB" };

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) return { url: null, error: "Tipo de archivo no permitido. Usa JPG, PNG o WebP" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${folder.replace(/\//g, "_")}_${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return { url: `/uploads/${folder}/${filename}` };
  } catch (e: any) {
    console.error("Upload error:", e);
    return { url: null, error: e.message };
  }
}

// ----------------------------------------
// Subida de FUENTES TIPOGRÁFICAS (.ttf, .otf, .woff, .woff2)
// ----------------------------------------
export async function uploadFont(
  formData: FormData
): Promise<{ url: string | null; familyName: string | null; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return { url: null, familyName: null, error: "No se recibió ningún archivo" };

    const MAX_SIZE = 20 * 1024 * 1024; // 20MB para fuentes
    if (file.size > MAX_SIZE) return { url: null, familyName: null, error: "El archivo excede los 20MB" };

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedExts = ["ttf", "otf", "woff", "woff2"];
    if (!allowedExts.includes(ext)) {
      return { url: null, familyName: null, error: "Solo se permiten archivos .ttf, .otf, .woff o .woff2" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generamos un nombre seguro basado en el nombre original del archivo
    const safeName = file.name
      .replace(`.${ext}`, "")
      .replace(/[^a-zA-Z0-9_\-]/g, "_")
      .toLowerCase();
    const filename = `${safeName}_${Date.now()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "fonts");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    // Generamos un family name limpio para @font-face (sin timestamps)
    const familyName = safeName.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return { url: `/fonts/${filename}`, familyName };
  } catch (e: any) {
    console.error("Font upload error:", e);
    return { url: null, familyName: null, error: e.message };
  }
}

// Alias para imágenes de variantes
export async function uploadVariantImage(formData: FormData) {
  return uploadImage(formData, "variantes");
}
