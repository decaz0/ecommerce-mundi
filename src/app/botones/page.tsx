import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function BotonesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span className="mx-2">/</span> 
          <span className="text-black dark:text-white">Botones Publicitarios</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* IMAGEN DEL PRODUCTO */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] opacity-50"></div>
              <img 
                src="/categorias/botones.png" 
                alt="Botones Publicitarios" 
                className="w-full h-full object-contain drop-shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white dark:bg-[#111] rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
                <img src="/categorias/boton frontal.png" className="h-16 w-16 object-contain mb-2 drop-shadow-md" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vista Frontal</span>
              </div>
              <div className="bg-white dark:bg-[#111] rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
                <img src="/categorias/boton trasero.png" className="h-16 w-16 object-contain mb-2 drop-shadow-md" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gacho Metálico</span>
              </div>
            </div>
          </div>

          {/* DETALLES DEL PRODUCTO */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="inline-block bg-[#d32f2f] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mb-4">
              Venta al por mayor
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Botones Publicitarios</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              Ideal para campañas, eventos empresariales, conciertos y promociones. Impresión de alta fidelidad fotográfica en chapa metálica duradera con gancho de seguridad trasero.
            </p>

            <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-8 shadow-sm">
              <h3 className="font-bold uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 text-[#d32f2f]">Opciones Disponibles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tamaños (Diámetro)</h4>
                  <ul className="space-y-2 text-sm font-bold">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> 2.5 cm (Pequeño)</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400"></span> 3.5 cm (Estándar)</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span> 4.5 cm (Mediano)</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-600"></span> 5.5 cm (Grande)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Condiciones</h4>
                  <div className="bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-400 p-3 rounded-lg text-xs font-bold leading-relaxed border border-red-100 dark:border-red-900/30">
                    Pedido mínimo exclusivo de 75 unidades por diseño. Excelente calidad para volúmenes altos.
                  </div>
                </div>
              </div>
            </div>

            <Link href="/botones/builder" className="w-full block text-center py-5 bg-[#d32f2f] text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-800 transition-all shadow-[0_10px_30px_rgba(211,47,47,0.3)] hover:shadow-[0_15px_40px_rgba(211,47,47,0.4)] hover:-translate-y-1">
              Personalizar mi Diseño Ahora
            </Link>
            
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
              Podrás ajustar tu imagen al tamaño exacto del botón en el siguiente paso.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
