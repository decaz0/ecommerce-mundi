"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { updateVariantImage, deleteVariant } from "@/actions/productActions";

export default function VariantImageActions({ variantId, currentImageUrl }: { variantId: string, currentImageUrl: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImageUploaded = async (url: string) => {
    setLoading(true);
    await updateVariantImage(variantId, url || null);
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta variante? Se perderán todas sus configuraciones y esto no se puede deshacer.")) return;
    setLoading(true);
    const res = await deleteVariant(variantId);
    if (res?.success) {
      router.refresh();
    } else {
      setLoading(false);
      alert("Error al eliminar variante: " + res?.error);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 p-4 z-10">
      <div className="bg-white p-2 rounded-xl text-center">
        <ImageUploader 
          currentImageUrl={currentImageUrl}
          folder="variantes"
          onUploaded={handleImageUploaded}
          label=""
          size="sm"
          placeholder="Cambiar Foto"
        />
      </div>

      <button 
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-lg"
      >
        {loading ? "..." : "🗑️ Eliminar Variante"}
      </button>
    </div>
  );
}
