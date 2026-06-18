import { prisma } from "@/lib/prisma";
import { deleteColor, updateColorStock } from "@/actions/catalogActions";
import ColorForm from "./ColorForm";

export default async function ColorsCatalogPage() {
  const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
  const lowStock = colors.filter(c => c.stock <= 5);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎨 Catálogo de Colores</h1>
        <p className="text-sm text-gray-500 mt-1">Tubos y cartuchos de color disponibles. El stock controla la disponibilidad de variantes en tienda.</p>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start space-x-2">
          <span className="text-amber-600 font-bold shrink-0">⚠️</span>
          <div>
            <span className="text-amber-700 font-bold text-sm">Stock Crítico: </span>
            <span className="text-amber-700 text-sm">{lowStock.map(c => `${c.name} (${c.stock})`).join(", ")}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario con upload */}
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
          <h2 className="font-bold mb-4 text-gray-800">Añadir Nuevo Color</h2>
          <ColorForm />
        </div>

        {/* Tabla */}
        <div className="md:col-span-2 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vista</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {colors.map(color => (
                <tr key={color.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {color.imageUrl ? (
                      <img src={color.imageUrl} alt={color.name} className="w-10 h-10 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color.hex }}></div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm text-gray-800">{color.name}</div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }}></div>
                      <span className="text-xs text-gray-400 font-mono">{color.hex}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <form action={updateColorStock} className="flex items-center justify-center space-x-1">
                      <input type="hidden" name="id" value={color.id} />
                      <input type="number" name="stock" defaultValue={color.stock} min={0}
                        className={`w-20 border text-center rounded-lg p-1.5 text-sm font-bold ${color.stock <= 5 ? 'border-red-400 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700'}`} />
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-lg font-medium transition">✓</button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => { "use server"; await deleteColor(color.id); }}>
                      <button className="text-red-500 hover:text-red-700 text-sm font-medium transition">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
              {colors.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">No hay colores registrados. Añade uno.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
