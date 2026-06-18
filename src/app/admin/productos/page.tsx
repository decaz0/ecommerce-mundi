import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCatalogClient from "./ProductCatalogClient";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        include: {
          color: true,
          figure: true,
          baseType: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Convertimos objetos Decimal de Prisma a números simples para serialización
  const plainProducts = products.map(p => ({
    ...p,
    variants: p.variants.map(v => ({
      ...v,
      price: Number(v.price)
    }))
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight mb-2">📦 Catálogo de Productos</h1>
          <p className="text-sm text-gray-500 font-medium">
            Gestiona tus productos base y todas sus variantes generadas (tamaños, colores, figuras, bases).
          </p>
        </div>
        <Link 
          href="/admin/productos/nuevo" 
          className="bg-premia-red hover:bg-premia-red-dark text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-premia-red/20 transition-transform hover:scale-105 whitespace-nowrap"
        >
          + Nuevo Producto (Wizard)
        </Link>
      </div>

      <ProductCatalogClient products={plainProducts} />
    </div>
  );
}
