import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductWizard from "./ProductWizard";

export default async function NewProductPage() {
  const [colors, figures, bases, typographies, categories, existingProducts] = await Promise.all([
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.figure.findMany({ orderBy: { name: "asc" } }),
    prisma.baseType.findMany({ orderBy: { name: "asc" } }),
    prisma.typography.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: { _count: { select: { variants: true } } },
      orderBy: { name: "asc" }
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/productos" className="text-blue-600 hover:underline text-sm font-medium">
          ← Volver a Productos
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">Asistente de Creación de Producto</h1>
          <p className="text-blue-100 text-sm mt-1">Sigue los pasos para configurar la matriz de variantes para tu nuevo trofeo o galardón.</p>
        </div>

        <ProductWizard
          catalogs={{ colors, figures, bases, typographies, categories }}
          existingProducts={existingProducts}
        />
      </div>
    </div>
  );
}
