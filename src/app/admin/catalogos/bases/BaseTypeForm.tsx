"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBaseType } from "@/actions/catalogActions";
import ImageUploader from "@/components/ImageUploader";

export default function BaseTypeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [material, setMaterial] = useState("");
  const [stock, setStock] = useState(100);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Escribe el nombre de la base");
    setLoading(true);

    const fd = new FormData();
    fd.append("name", name);
    fd.append("material", material);
    fd.append("stock", String(stock));
    fd.append("imageUrl", imageUrl);

    await createBaseType(fd);

    setName("");
    setMaterial("");
    setStock(100);
    setImageUrl("");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-premia-red" placeholder="Ej. Base Redonda 15cm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
        <input value={material} onChange={e => setMaterial(e.target.value)} className="w-full border rounded-lg p-2 text-sm outline-none" placeholder="Ej. Madera, Cristal, Mármol" />
      </div>

      <ImageUploader
        folder="catalogos/bases"
        onUploaded={url => setImageUrl(url)}
        label="Imagen de la base"
        size="lg"
        placeholder="Subir imagen de la base"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} min={0} className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-premia-red" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-premia-red hover:bg-premia-red-dark text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 shadow-sm shadow-premia-red/20">
        {loading ? "Guardando..." : "Guardar Base"}
      </button>
    </form>
  );
}
