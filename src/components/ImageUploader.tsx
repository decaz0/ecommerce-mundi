"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/actions/uploadActions";

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  folder: string;
  onUploaded: (url: string) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "circle";
  placeholder?: string;
}

export default function ImageUploader({
  currentImageUrl,
  folder,
  onUploaded,
  label = "Imagen",
  size = "md",
  shape = "square",
  placeholder,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview inmediato
    setPreview(URL.createObjectURL(file));
    setError(null);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const result = await uploadImage(fd, folder);
    setUploading(false);

    if (result.url) {
      onUploaded(result.url);
    } else {
      setError(result.error || "Error al subir");
      setPreview(currentImageUrl || null);
    }
  };

  const handleClick = () => inputRef.current?.click();

  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className="flex flex-col items-start space-y-1">
      {label && <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>}

      <div
        onClick={handleClick}
        className={`${sizeClasses[size]} ${roundedClass} border-2 border-dashed cursor-pointer relative overflow-hidden flex items-center justify-center transition-all
          ${uploading ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
          ${error ? "border-red-400 bg-red-50" : ""}
        `}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className={`w-full h-full object-cover ${roundedClass}`}
            />
            {/* Overlay al hover */}
            <div className={`absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center transition-all ${roundedClass}`}>
              <span className="text-white text-xs font-bold opacity-0 hover:opacity-100 transition-opacity">Cambiar</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 p-2">
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-1"></div>
                <span className="text-xs">Subiendo...</span>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-center leading-tight">{placeholder || "Subir imagen"}</span>
              </>
            )}
          </div>
        )}

        {/* Badge de subiendo */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {preview && !error && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setPreview(null); onUploaded(""); }}
          className="text-xs text-red-400 hover:text-red-600"
        >
          Quitar imagen
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
