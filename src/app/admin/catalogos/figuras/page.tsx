import { prisma } from "@/lib/prisma";
import { deleteFigure, updateFigureStock } from "@/actions/catalogActions";
import FigureForm from "./FigureForm";

export default async function FiguresCatalogPage() {
  const figures = await prisma.figure.findMany({ orderBy: { name: "asc" } });
  const lowStock = figures.filter(f => f.stock <= 5);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🏆 Catálogo de Figuras</h1>
        <p className="text-sm text-gray-500 mt-1">Siluetas decorativas para la parte superior de los trofeos. El stock desactiva variantes automáticamente.</p>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start space-x-2">
          <span className="text-amber-600 font-bold shrink-0">⚠️</span>
          <div>
            <span className="text-amber-700 font-bold text-sm">Stock Crítico: </span>
            <span className="text-amber-700 text-sm">{lowStock.map(f => `${f.name} (${f.stock})`).join(", ")}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
          <h2 className="font-bold mb-4 text-gray-800">Añadir Nueva Figura</h2>
          <FigureForm />
        </div>

        <div className="md:col-span-2 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          {/* Vista de cuadrícula */}
          {figures.length > 0 ? (
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {figures.map(fig => (
                <div key={fig.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition">
                  <div className="h-32 bg-white flex items-center justify-center">
                    {fig.imageUrl ? (
                      <img src={fig.imageUrl} alt={fig.name} className="h-full w-full object-contain p-2" />
                    ) : (
                      <span className="text-4xl">🏆</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-gray-800 truncate">{fig.name}</p>
                    <form action={updateFigureStock} className="flex items-center space-x-1 mt-1">
                      <input type="hidden" name="id" value={fig.id} />
                      <span className="text-xs text-gray-500">Stock:</span>
                      <input type="number" name="stock" defaultValue={fig.stock} min={0}
                        className={`w-16 border text-center rounded p-1 text-xs font-bold ${fig.stock <= 5 ? 'border-red-400 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700'}`} />
                      <button className="text-xs bg-gray-200 hover:bg-gray-300 px-1.5 py-1 rounded font-medium transition">✓</button>
                    </form>
                    <form action={async () => { "use server"; await deleteFigure(fig.id); }} className="mt-2">
                      <button className="text-red-400 hover:text-red-600 text-xs font-medium transition">Eliminar</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-gray-400">
              No hay figuras registradas. Sube la primera.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
