import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Sparkles, Palette, Trophy, Layers, Type, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const [
    productsCount,
    variantsCount,
    activeVariants,
    colorsCount,
    figuresCount,
    basesCount,
    criticalColors,
    criticalFigures,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.productVariant.count({ where: { isActive: true } }),
    prisma.color.count(),
    prisma.figure.count(),
    prisma.baseType.count(),
    prisma.color.findMany({ where: { stock: { lte: 5 } }, select: { name: true, stock: true, hex: true } }),
    prisma.figure.findMany({ where: { stock: { lte: 5 } }, select: { name: true, stock: true } }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { variants: true } } }
    }),
  ]);

  const cards = [
    { label: "Productos Base", value: productsCount, bg: "bg-gradient-to-br from-black to-gray-900", href: "/admin/productos" },
    { label: "Variantes Totales", value: variantsCount, bg: "bg-gradient-to-br from-premia-red-dark to-premia-red", href: "/admin/productos" },
    { label: "Colores", value: colorsCount, bg: "bg-gradient-to-br from-gray-900 to-gray-700", href: "/admin/catalogos/colores" },
    { label: "Figuras", value: figuresCount, bg: "bg-gradient-to-br from-[#2a2a2a] to-black", href: "/admin/catalogos/figuras" },
  ];

  const hasCritical = criticalColors.length > 0 || criticalFigures.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Bienvenido.</h1>
        <p className="text-gray-500 mt-2 font-medium">Control total de tu tienda oficial Grupo Premia.</p>
      </div>

      {/* Alertas de Stock Crítico */}
      {hasCritical && (
        <div className="mb-10 p-5 bg-red-50/50 border border-red-50 rounded-3xl">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle size={18} className="text-red-500" />
            <h3 className="font-semibold text-red-600 text-sm tracking-wide uppercase">Stock Crítico (≤5 unidades)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {criticalColors.map(c => (
              <Link key={c.name} href="/admin/catalogos/colores"
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-full text-xs font-medium hover:text-red-600 transition shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }}></span>
                <span>{c.name}: <span className="font-semibold">{c.stock}</span></span>
              </Link>
            ))}
            {criticalFigures.map(f => (
              <Link key={f.name} href="/admin/catalogos/figuras"
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-full text-xs font-medium hover:text-red-600 transition shadow-sm">
                <Trophy size={12} className="text-gray-400" />
                <span>{f.name}: <span className="font-semibold">{f.stock}</span></span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tarjetas de Métricas - Estilo Storefront Oficial */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map(card => (
          <div key={card.label} 
            className={`${card.bg} rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg flex flex-col justify-between min-h-[220px]`}>
            
            {/* Efecto hover decorativo suave */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

            <div>
              <p className="text-white/80 font-medium tracking-wide text-sm">{card.label}</p>
              <p className="text-5xl font-bold mt-3 tracking-tight">{card.value}</p>
            </div>
            
            <div className="mt-8">
              <Link href={card.href} className="inline-block bg-white text-gray-900 text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                Ver más
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Productos Recientes */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Productos Recientes</h2>
            <Link href="/admin/productos" className="text-premia-red text-sm font-medium hover:underline mb-0.5">Ver todos</Link>
          </div>
          
          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border-none shadow-sm">
                <p className="text-gray-400 mb-4 font-medium">Aún no tienes productos creados.</p>
                <Link href="/admin/productos/nuevo" className="inline-block bg-premia-red text-white font-medium px-6 py-3 rounded-full hover:bg-premia-red-dark transition shadow-md shadow-premia-red/20">
                  Crear el primero
                </Link>
              </div>
            ) : (
              recentProducts.map(p => (
                <Link key={p.id} href={`/admin/productos/${p.id}`}
                  className="flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group border border-transparent hover:border-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-premia-red transition-colors text-base">{p.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5 tracking-wide">{p.sku}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">Variantes</span>
                    <span className="bg-gray-50 text-gray-600 font-semibold px-3 py-1 rounded-full text-xs group-hover:bg-premia-red/10 group-hover:text-premia-red transition-colors">{p._count.variants}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Accesos Rápidos Minimalistas */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-6">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/admin/productos/nuevo", label: "Nuevo Producto", desc: "Usa el wizard", icon: <Sparkles size={24} strokeWidth={1.5} />, isPrimary: true },
              { href: "/admin/catalogos/colores", label: "Colores", desc: "Gestión de stock", icon: <Palette size={24} strokeWidth={1.5} /> },
              { href: "/admin/catalogos/figuras", label: "Figuras", desc: "Trofeos y más", icon: <Trophy size={24} strokeWidth={1.5} /> },
              { href: "/admin/catalogos/bases", label: "Bases", desc: "Madera/plástico", icon: <Layers size={24} strokeWidth={1.5} /> },
              { href: "/admin/catalogos/tipografias", label: "Fuentes", desc: "Archivos .ttf", icon: <Type size={24} strokeWidth={1.5} /> },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className={`flex flex-col p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                  item.isPrimary 
                    ? "bg-premia-red text-white shadow-lg shadow-premia-red/20 hover:shadow-xl hover:shadow-premia-red/30" 
                    : "bg-white text-gray-800 shadow-sm hover:shadow-md border border-transparent hover:border-gray-50"
                }`}>
                <span className={`mb-4 ${item.isPrimary ? 'text-white' : 'text-gray-400'}`}>{item.icon}</span>
                <span className="font-semibold text-base leading-tight mb-1">{item.label}</span>
                <span className={`text-[11px] font-medium ${item.isPrimary ? 'text-white/80' : 'text-gray-400'}`}>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
