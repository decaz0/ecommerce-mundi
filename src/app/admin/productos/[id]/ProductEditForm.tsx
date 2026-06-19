"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct, deleteProduct } from "@/actions/productActions";

export default function ProductEditForm({ product, categories }: { product: any, categories: any[] }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [description, setDescription] = useState(product.description || "");
  const [categoryId, setCategoryId] = useState(product.categoryId || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const fd = new FormData();
    fd.append("id", product.id);
    fd.append("name", name);
    fd.append("sku", sku);
    fd.append("description", description);
    fd.append("categoryId", categoryId);

    const res = await updateProduct(fd);
    setLoading(false);
    if (res?.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert("Error: " + res?.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este producto y todas sus variantes? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    const res = await deleteProduct(product.id);
    if (res?.success) {
      router.push("/admin/productos");
    } else {
      setLoading(false);
      alert("Error: " + res?.error);
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-8 relative">
        <div className="absolute top-6 right-6 space-x-3">
          <button onClick={() => setIsEditing(true)} className="text-sm text-gray-500 hover:text-gray-900 font-semibold px-4 py-2 border rounded-full transition hover:bg-gray-50">
            Editar Detalles
          </button>
          <button onClick={handleDelete} className="text-sm text-red-500 hover:text-white font-semibold px-4 py-2 border border-red-200 hover:bg-red-500 rounded-full transition">
            Eliminar Producto
          </button>
        </div>

        <h2 className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Información Base</h2>
        <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 font-mono mb-4">SKU: {product.sku}</p>
        
        {product.category && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold mr-2">
            📂 {product.category.name}
          </span>
        )}
        
        {product.description && (
          <p className="text-sm text-gray-600 mt-4 leading-relaxed max-w-3xl">
            {product.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-[2rem] border border-gray-200 shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Editar Detalles del Producto</h2>
        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕ Cerrar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">SKU Base</label>
          <input value={sku} onChange={e => setSku(e.target.value)} required className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white">
            <option value="">Sin Categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-500/30">
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
