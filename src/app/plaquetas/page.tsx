import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PlaquetasCatalog() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span className="mx-2">/</span> 
          <span className="text-black dark:text-white font-bold">Catálogo de Plaquetas</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Plaquetas Corporativas</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Descubre nuestra elegante colección de plaquetas MDF con acabados premium. Selecciona un modelo para comenzar a personalizar con tu logotipo y texto.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Main Customizable Plaqueta */}
          <Link href="/plaquetas/builder" className="group block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="aspect-[3/4] bg-gray-100 dark:bg-[#1a1a1a] p-8 flex items-center justify-center relative">
              <div className="absolute top-4 left-4 bg-[#d32f2f] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10">
                Personalizable
              </div>
              
              <img 
                src="/categorias/plaqueta.png" 
                alt="Plaqueta Base Personalizable" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="p-6">
              <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Serie Madera MDF</div>
              <h3 className="font-black text-xl mb-2 group-hover:text-[#d32f2f] transition-colors">Plaqueta Premium con Lámina Dorada</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                Elegante plaqueta ideal para reconocimientos corporativos. Sube tu logotipo y graba tu mensaje personalizado.
              </p>
              <div className="flex items-center justify-between">
                <span className="font-black text-lg">Desde Q150.00</span>
                <span className="text-[#d32f2f] font-bold text-sm uppercase tracking-wider flex items-center">
                  Personalizar <span className="ml-1">→</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Placeholder for future */}
          <div className="group block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm opacity-50 grayscale cursor-not-allowed">
            <div className="aspect-[3/4] bg-gray-100 dark:bg-[#1a1a1a] p-8 flex items-center justify-center">
              <span className="text-gray-400 font-bold">Próximamente</span>
            </div>
            <div className="p-6">
              <h3 className="font-black text-xl mb-2">Plaqueta de Acrílico</h3>
              <p className="text-sm text-gray-500 mb-4">Reconocimientos en acrílico cristalino.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
