"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColor } from "@/actions/catalogActions";
import ImageUploader from "@/components/ImageUploader";

export default function ColorForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#FFD700");
  const [stock, setStock] = useState(100);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Escribe el nombre del color");
    setLoading(true);

    const fd = new FormData();
    fd.append("name", name);
    fd.append("hex", hex);
    fd.append("stock", String(stock));
    fd.append("imageUrl", imageUrl);

    await createColor(fd);

    setName("");
    setHex("#FFD700");
    setStock(100);
    setImageUrl("");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-premia-red" placeholder="Ej. Dorado Mate" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color de referencia</label>
        <div className="flex items-center space-x-3">
          <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-10 border rounded-lg p-1 cursor-pointer" />
          <span className="text-sm font-mono text-gray-500">{hex}</span>
        </div>
      </div>

      <ImageUploader
        folder="catalogos/colores"
        onUploaded={url => setImageUrl(url)}
        label="Foto del tubo / pieza de color"
        size="md"
        placeholder="Subir foto del color"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} min={0} className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-premia-red" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-premia-red hover:bg-premia-red-dark text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 shadow-sm shadow-premia-red/20">
        {loading ? "Guardando..." : "Guardar Color"}
      </button>
    </form>
  );
}
