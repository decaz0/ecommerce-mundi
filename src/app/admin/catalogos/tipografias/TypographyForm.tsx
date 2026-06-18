"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadFont } from "@/actions/uploadActions";
import { createTypography } from "@/actions/catalogActions";

const PREVIEW_TEXT = "AaBbCc 123 ¡Hola Mundo!";

export default function TypographyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const [fontFaceFamily, setFontFaceFamily] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setFileName(file.name);

    const fd = new FormData();
    fd.append("file", file);

    const result = await uploadFont(fd);
    setUploading(false);

    if (result.url) {
      setFontUrl(result.url);
      // Usamos un family name temporal solo para el preview en esta sesión
      const tempFamily = `preview-${Date.now()}`;
      setFontFaceFamily(tempFamily);
      // Pre-llenar el nombre si está vacío
      if (!name && result.familyName) setName(result.familyName);
    } else {
      setError(result.error || "Error al subir la fuente");
      setFileName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Escribe un nombre para la tipografía");
    if (!fontUrl) return setError("Sube un archivo de fuente primero");

    setSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("fontUrl", fontUrl);

    const result = await createTypography(fd);
    setSaving(false);

    if (result.success) {
      // Reset formulario
      setName("");
      setFontUrl(null);
      setFontFaceFamily(null);
      setFileName(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } else {
      setError("Error al guardar: " + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Inyectar @font-face para el preview local (no persistido) */}
      {fontUrl && fontFaceFamily && (
        <style>{`
          @font-face {
            font-family: '${fontFaceFamily}';
            src: url('${fontUrl}');
            font-display: swap;
          }
        `}</style>
      )}

      {/* Zona de upload */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
          Archivo de Fuente *
        </label>
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
            ${uploading ? "border-premia-red bg-premia-red/5" : ""}
            ${fontUrl && !uploading ? "border-green-400 bg-green-50" : ""}
            ${!fontUrl && !uploading ? "border-gray-300 hover:border-premia-red hover:bg-gray-50" : ""}
            ${error ? "border-red-400 bg-red-50" : ""}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2 py-2">
              <div className="w-8 h-8 border-2 border-premia-red border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-premia-red font-bold">Subiendo fuente...</span>
            </div>
          ) : fontUrl ? (
            <div className="flex flex-col items-center space-y-1 py-1">
              <span className="text-3xl">✅</span>
              <span className="text-sm text-green-700 font-bold truncate max-w-full">{fileName}</span>
              <span className="text-xs text-green-600">Clic para cambiar</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-gray-400 py-2">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-600">Clic para subir archivo de fuente</p>
                <p className="text-xs text-gray-400 mt-0.5">.ttf · .otf · .woff · .woff2 — Máx 20MB</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Preview en vivo */}
      {fontUrl && fontFaceFamily && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Vista previa</p>
          <p style={{ fontFamily: `'${fontFaceFamily}', serif` }} className="text-2xl text-gray-800">
            {PREVIEW_TEXT}
          </p>
          <p style={{ fontFamily: `'${fontFaceFamily}', serif` }} className="text-sm text-gray-500 mt-1">
            El veloz murciélago hindú comía feliz cardillo y kiwi.
          </p>
          <p style={{ fontFamily: `'${fontFaceFamily}', serif` }} className="text-xs text-gray-400 mt-0.5">
            0123456789 !@#$%
          </p>
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tipografía *</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-premia-red"
          placeholder="Ej. Arial Bold, Montserrat Regular..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving || uploading || !fontUrl}
        className="w-full bg-premia-red hover:bg-premia-red-dark text-white font-bold py-2.5 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-premia-red/20"
      >
        {saving ? "Guardando..." : "Guardar Tipografía"}
      </button>
    </form>
  );
}
