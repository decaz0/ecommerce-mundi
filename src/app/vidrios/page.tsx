import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VIDRIOS_CATALOG = [
  {
    id: "hexagono",
    name: "Vidrio Hexágono",
    desc: "Corte geométrico de 6 lados con base de mármol. Incluye grabado láser premium en placa dorada.",
    price: 350,
    img: "/categorias/vidrio hexagono.png",
  },
  {
    id: "cuadrilatero",
    name: "Vidrio Cuadrilátero",
    desc: "Elegante corte trapezoidal invertido. Base de mármol oscura e incrustación de lámina dorada texturizada.",
    price: 350,
    img: "/categorias/vidrio cuadrilatero.png",
  }
];

export default function VidriosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Inicio</Link> 
          <span>/</span> 
          <span className="text-black dark:text-white">Reconocimientos de Vidrio</span>
        </div>

        <div className="text-center mb-16">
          <div className="inline-block bg-[#d4af37] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Categoría Premium
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">Línea de Cristal</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            La más alta sofisticación en premiación corporativa. Cristal grueso biselado sobre base de mármol con una lámina dorada para destacar los méritos extraordinarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {VIDRIOS_CATALOG.map((item) => {
            const isOffer = item.id === "cuadrilatero";
            const originalPrice = item.price;
            const currentPrice = isOffer ? 250 : item.price;
            const offerHref = isOffer ? `/vidrios/builder?model=${item.id}&offer=true` : `/vidrios/builder?model=${item.id}`;

            return (
              <div key={item.id} className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 relative">
                
                {isOffer && (
                  <div className="absolute top-4 right-4 bg-[#d32f2f] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-20 shadow-lg">
                    Oferta -28%
                  </div>
                )}

                <Link href={offerHref} className="relative aspect-[4/5] bg-gray-100 dark:bg-[#1a1a1a] p-8 flex items-center justify-center overflow-hidden block cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-0"></div>
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{item.name}</h2>
                    <div className="flex flex-col items-end">
                      {isOffer && (
                        <span className="text-gray-400 line-through text-xs font-bold">Q{originalPrice}.00</span>
                      )}
                      <span className="text-2xl font-black text-[#d32f2f]">Q{currentPrice}.00</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                    {item.desc}
                  </p>

                  <Link 
                    href={offerHref}
                    className="w-full block text-center py-4 bg-[#111] dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#d32f2f] dark:hover:bg-[#d32f2f] hover:text-white transition-all shadow-md hover:shadow-lg"
                  >
                    {isOffer ? "Aprovechar Oferta" : "Personalizar este Modelo"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
