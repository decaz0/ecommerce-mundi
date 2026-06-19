"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/actions/catalogActions";

export default function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Escribe el nombre de la categoría");
    setLoading(true);

    const fd = new FormData();
    fd.append("name", name);

    await createCategory(fd);

    setName("");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría *</label>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-premia-red" 
          placeholder="Ej. Reconocimientos de Cristal" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-premia-red hover:bg-premia-red-dark text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 shadow-sm shadow-premia-red/20"
      >
        {loading ? "Guardando..." : "Guardar Categoría"}
      </button>
    </form>
  );
}
