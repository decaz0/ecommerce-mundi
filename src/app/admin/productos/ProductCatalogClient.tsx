"use client";

import { useState } from "react";
import Link from "next/link";

interface ProductCatalogClientProps {
  products: any[];
}

export default function ProductCatalogClient({ products }: ProductCatalogClientProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-4 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-premia-red focus:border-transparent sm:text-base font-medium shadow-sm transition-shadow duration-300 hover:shadow-md"
            placeholder="Buscar producto por nombre o SKU base..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No se encontraron productos.</p>
          {search ? (
            <button onClick={() => setSearch("")} className="mt-2 text-premia-red hover:underline text-sm font-bold">
              Limpiar búsqueda
            </button>
          ) : (
            <Link href="/admin/productos/nuevo" className="mt-3 inline-block text-premia-red underline text-sm font-bold">
              Crear tu primer producto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const variantCount = product.variants.length;
            const activeVariants = product.variants.filter((v: any) => v.isActive).length;
            
            // Buscar la primera imagen disponible de las variantes para usarla de portada
            const coverImage = product.variants.find((v: any) => v.imageUrl)?.imageUrl;

            return (
              <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 group flex flex-col hover:-translate-y-1">
                {/* Imagen de Portada */}
                <div className="h-56 bg-[#121212] flex items-center justify-center relative overflow-hidden">
                  {coverImage ? (
                    <img src={coverImage} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition duration-700" />
                  ) : (
                    <span className="text-6xl opacity-30">🏆</span>
                  )}
                  <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow-lg text-[10px] font-bold uppercase tracking-wider">
                    {activeVariants} activos
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 flex-1 flex flex-col bg-white">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mb-3">SKU: {product.sku}</p>

                  {/* Resumen de variantes */}
                  <div className="mt-auto">
                    {variantCount > 0 ? (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.variants.slice(0, 3).map((v: any) => (
                          <span key={v.id} className="text-[10px] bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-100 truncate max-w-full font-medium tracking-wide" title={`${v.size} - ${v.color.name}`}>
                            {v.size} • {v.color.name}
                          </span>
                        ))}
                        {variantCount > 3 && (
                          <span className="text-[10px] bg-premia-red/10 text-premia-red font-bold px-2 py-0.5 rounded border border-premia-red/20">
                            +{variantCount - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block mb-4 border border-amber-200 font-bold">
                        ⚠️ Sin variantes
                      </p>
                    )}

                    <Link href={`/admin/productos/${product.id}`} className="block w-full text-center bg-gray-50 hover:bg-gray-100 hover:text-premia-red text-gray-700 font-semibold py-2.5 rounded-full transition-colors duration-300 text-sm">
                      Configurar Variantes
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
