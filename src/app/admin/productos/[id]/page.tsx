import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BoundingBoxEditor from "@/components/BoundingBoxEditor";
import { saveVariantLogoArea } from "@/actions/productActions";
import ProductEditForm from "./ProductEditForm";
import VariantTextEditor from "./VariantTextEditor";
import VariantImageActions from "./VariantImageActions";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        include: {
          color: true,
          figure: true,
          baseType: true,
          typographies: { include: { typography: true } },
          textLines: true,
        },
        orderBy: { createdAt: "asc" }
      },
      category: true,
    }
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const typographies = await prisma.typography.findMany({ orderBy: { name: "asc" } });

  if (!product) return <div className="p-8 text-center text-gray-500">Producto no encontrado.</div>;

  const customTypeLabel: Record<string, string> = {
    TEXT_LOGO: "Texto + Logo",
    TEXT_ONLY: "Solo Texto",
    LOGO_ONLY: "Solo Logo",
    NONE: "Sin Personalización",
  };
  const customTypeEmoji: Record<string, string> = {
    TEXT_LOGO: "✍️🖼️",
    TEXT_ONLY: "✍️",
    LOGO_ONLY: "🖼️",
    NONE: "📦",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/productos" className="inline-block text-premia-red hover:underline text-sm font-semibold mb-4">← Volver a Productos</Link>
      
      <ProductEditForm product={product} categories={categories} />

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-bold text-gray-700">Variantes del Producto ({product.variants.length})</h2>
        <Link href={`/admin/productos/nuevo`}
          className="bg-premia-red hover:bg-premia-red-dark text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-lg shadow-premia-red/20 transition-transform hover:scale-105">
          + Añadir Variante
        </Link>
      </div>

      {product.variants.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-500 font-medium">No hay variantes aún.</p>
          <Link href="/admin/productos/nuevo" className="mt-3 inline-block text-premia-red underline text-sm font-bold">Crear variantes con el Wizard</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {product.variants.map(v => (
            <div key={v.id} className={`bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-opacity ${!v.isActive ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex flex-col md:flex-row">
                {/* Imagen */}
                <div className="w-full md:w-56 h-56 md:h-auto shrink-0 bg-[#121212] flex items-center justify-center relative overflow-hidden group">
                  {v.imageUrl ? (
                    <img src={v.imageUrl} alt={v.sku} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-6xl opacity-30">🏆</span>
                  )}
                  <VariantImageActions variantId={v.id} currentImageUrl={v.imageUrl} />
                </div>

                {/* Info */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                        <span className="bg-premia-red/10 text-premia-red text-xs font-bold px-2 py-1 rounded-full">📐 {v.size}</span>
                        <span className="flex items-center space-x-1 bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                          <span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: v.color.hex }}></span>
                          <span>{v.color.name}</span>
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">🏆 {v.figure.name}</span>
                        <span className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-1 rounded-full">🪨 {v.baseType.name}</span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                          {customTypeEmoji[v.customizationType]} {customTypeLabel[v.customizationType]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">SKU: {v.sku}</p>
                    </div>

                    {/* Toggle activo */}
                    <form action={async () => {
                      "use server";
                      const { toggleVariantActive } = await import("@/actions/productActions");
                      await toggleVariantActive(v.id, !v.isActive);
                    }}>
                      <button className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${v.isActive ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-red-50 text-red-600 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}>
                        {v.isActive ? "✅ Activo" : "❌ Inactivo"}
                      </button>
                    </form>
                  </div>

                  <div className="mt-3 flex items-center space-x-6">
                    {/* Precio editable inline */}
                    <form action={async (fd: FormData) => {
                      "use server";
                      const { updateVariantPrice } = await import("@/actions/productActions");
                      await updateVariantPrice(v.id, Number(fd.get("price")));
                    }} className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Precio:</span>
                      <div className="flex items-center border border-gray-100 rounded-full overflow-hidden focus-within:ring-1 focus-within:ring-premia-red">
                        <span className="pl-4 pr-2 py-2 bg-gray-50 text-gray-400 text-sm font-semibold">$</span>
                        <input type="number" name="price" defaultValue={Number(v.price)} className="w-24 py-2 text-sm font-semibold outline-none text-gray-800" step="0.01" />
                      </div>
                      <button className="text-xs bg-gray-800 text-white px-5 py-2.5 rounded-full hover:bg-gray-900 font-semibold transition-transform hover:scale-105">Guardar</button>
                    </form>
                  </div>

                  {/* Configuración de texto si aplica */}
                  {(v.customizationType === "TEXT_LOGO" || v.customizationType === "TEXT_ONLY") && (
                    <VariantTextEditor variant={v} typographies={typographies} />
                  )}

                  {/* Lienzo Bounding Box (Solo si admite Logo y tiene imagen) */}
                  {(v.customizationType === "TEXT_LOGO" || v.customizationType === "LOGO_ONLY") && v.imageUrl && (
                    <BoundingBoxEditor 
                      variantId={v.id} 
                      imageUrl={v.imageUrl} 
                      initialArea={v.logoArea ? JSON.parse(v.logoArea) : null}
                      onSaveAction={saveVariantLogoArea}
                    />
                  )}
                  {(v.customizationType === "TEXT_LOGO" || v.customizationType === "LOGO_ONLY") && !v.imageUrl && (
                    <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-200">
                      ⚠️ Sube una imagen de esta variante para poder definir el área del logo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
