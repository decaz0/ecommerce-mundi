"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CategoriasPage() {
  const categories = [
    { id: "trofeos", name: "Trofeos Clásicos", img: "/categorias/trofeo clasico.png", href: "/trofeos" },
    { id: "plasma", name: "Trofeos Plasma", img: "/categorias/trofeo plasma.png", href: "/trofeos-plasma" },
    { id: "medallas", name: "Medallas", img: "/categorias/medalla.png", href: "/medallas" },
    { id: "vidrios", name: "Reconocimientos en Vidrio", img: "/categorias/vidrio 1.png", href: "/vidrios" },
    { id: "plaquetas", name: "Plaquetas de Madera", img: "/categorias/plaqueta.png", href: "/plaquetas" },
    { id: "botones", name: "Botones Publicitarios", img: "/categorias/boton.png", href: "/botones" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4 text-center">Catálogo de Productos</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Selecciona la categoría que deseas personalizar.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.href}
              className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#d32f2f] transition-all flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full h-64 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center p-6 mb-6 group-hover:scale-105 transition-transform duration-500">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest text-[#d32f2f]">{cat.name}</h2>
              <span className="text-xs text-gray-400 font-bold uppercase mt-2 group-hover:text-black dark:group-hover:text-white transition-colors">Diseñar ahora →</span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
