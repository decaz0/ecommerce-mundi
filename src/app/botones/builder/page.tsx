"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const SIZES = [
  { id: "2.5", label: "2.5 cm (Pequeño)", price: 4 },
  { id: "3.5", label: "3.5 cm (Estándar)", price: 5 },
  { id: "4.5", label: "4.5 cm (Mediano)", price: 6 },
  { id: "5.5", label: "5.5 cm (Grande)", price: 7 },
];

function BotonesBuilderContent() {
  const router = useRouter();
  
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default 3.5cm
  const [quantity, setQuantity] = useState<number>(75);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageOffsetY, setImageOffsetY] = useState<number>(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setImageOffsetY(50); // resetear al centro
      setAcceptedTerms(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageOffsetY(50);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setQuantity(isNaN(val) ? 0 : val);
  };

  const handleQuantityBlur = () => {
    if (quantity < 75) {
      setQuantity(75);
    }
  };

  const calculateTotal = () => {
    const q = Math.max(quantity, 75);
    return q * selectedSize.price;
  };

  const handleAddToCartAttempt = () => {
    if (!imagePreview) {
      setShowWarningModal(true);
      return;
    }

    if (!acceptedTerms) {
      alert("Por favor, acepta la garantía de calidad marcando la casilla antes de continuar.");
      return;
    }

    executeAddToCart();
  };

  const executeAddToCart = () => {
    const finalQuantity = Math.max(quantity, 75);
    
    const cartItem = {
      id: Date.now().toString(),
      type: `Botones Publicitarios (${selectedSize.label})`,
      details: `BOTON-${selectedSize.id}CM`,
      price: calculateTotal(),
      quantity: finalQuantity,
      image: "/categorias/botones.png",
      customization: [`Cantidad: ${finalQuantity} unidades`],
      medallionImage: imagePreview,
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      
      {/* IZQUIERDA: VISUALIZADOR 3D */}
      <div className="w-full lg:w-[40%] flex flex-col gap-6">
        <div className="sticky top-24 flex flex-col gap-6">
          
          {/* Vista Frontal */}
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#161616]">
              <h2 className="text-sm font-black uppercase tracking-tight text-center">Vista Frontal (Diseño)</h2>
            </div>
            
            <div className="relative flex items-center justify-center p-8 bg-gray-100 dark:bg-[#1a1a1a] aspect-square overflow-hidden">
              <div 
                className="relative w-full h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center"
                style={{ transform: `scale(${parseFloat(selectedSize.id) / 5.5})` }}
              >
                <img 
                  src="/categorias/boton frontal.png" 
                  alt="Botón Frontal" 
                  className="w-full h-full object-contain relative z-10"
                />
                
                {/* Círculo Mágico de Inserción (Simulando el área imprimible del botón) */}
                <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] z-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Tu Diseño" 
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `center ${imageOffsetY}%` }}
                    />
                  ) : (
                    <span className="text-gray-300 font-black text-2xl uppercase tracking-widest text-center px-4 opacity-50">
                      Sube tu Imagen
                    </span>
                  )}
                </div>
                
                {/* Brillo overlay para dar realismo al metal/plástico */}
                <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] z-30 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none mix-blend-overlay"></div>
              </div>
            </div>
          </div>

          {/* Vista Trasera */}
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#161616]">
              <h2 className="text-sm font-black uppercase tracking-tight text-center">Vista Trasera (Gancho)</h2>
            </div>
            <div className="relative flex items-center justify-center p-8 bg-gray-100 dark:bg-[#1a1a1a] aspect-[2/1] overflow-hidden">
              <img 
                src="/categorias/boton trasero.png" 
                alt="Botón Trasero" 
                className="h-full object-contain relative z-10 drop-shadow-xl"
              />
            </div>
          </div>

        </div>
      </div>

      {/* DERECHA: CONFIGURADOR */}
      <div className="w-full lg:w-[60%] flex flex-col gap-8 pb-20">
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Diseñador de Botones</h1>
          <p className="text-gray-500 mb-8">Selecciona el tamaño, sube tu arte a todo color y ajusta el encuadre.</p>

          <div className="flex flex-col gap-10">
            
            {/* 1. TAMAÑO Y CANTIDAD */}
            <div className="flex flex-col gap-6">
              <div className="text-sm font-bold text-[#d32f2f] uppercase border-b pb-2">1. Especificaciones de Orden</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tamaños */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Diámetro del Botón</label>
                  <div className="flex flex-col gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          selectedSize.id === size.id 
                            ? 'border-[#d32f2f] bg-red-50 dark:bg-red-900/20 text-[#d32f2f]' 
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                      >
                        <span className="font-bold">{size.label}</span>
                        <span className="text-sm">Q{size.price}.00 c/u</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cantidad */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Cantidad (Mínimo 75)</label>
                  <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
                    <input 
                      type="number" 
                      min="75"
                      value={quantity}
                      onChange={handleQuantityChange}
                      onBlur={handleQuantityBlur}
                      className="w-full text-center text-4xl font-black bg-transparent outline-none border-b-2 border-gray-300 focus:border-[#d32f2f] transition-colors pb-2"
                    />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center">Unidades</span>
                    
                    {quantity < 75 && (
                      <span className="text-xs text-red-500 font-bold animate-pulse">La cantidad mínima es 75.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ARTE VISUAL */}
            <div className="flex flex-col gap-6">
              <div className="text-sm font-bold text-[#d32f2f] uppercase border-b pb-2">2. Diseño Gráfico</div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-2">
                <h3 className="text-sm font-black text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mb-1">⚠️ INSTRUCCIONES DE IMPRESIÓN</h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-600">Sube tu logo o diseño completo en JPG o PNG de alta calidad. Tu imagen se adaptará al círculo de impresión del botón. Eres responsable de enfocar la parte importante en el centro.</p>
              </div>

              {!imagePreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-[#d32f2f]/10 text-[#d32f2f] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Sube tu Imagen</h3>
                  <p className="text-sm text-gray-500">Haz clic para buscar en tu dispositivo.</p>
                  <input type="file" accept=".png,.jpg,.jpeg" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden shrink-0 relative">
                    <img 
                      src={imagePreview} 
                      alt="Miniatura" 
                      className="w-full h-full object-cover" 
                      style={{ objectPosition: `center ${imageOffsetY}%` }} 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4 w-full">
                    <div>
                      <span className="block text-sm font-black text-green-600 uppercase tracking-widest mb-1">✓ Imagen Cargada</span>
                      <span className="block text-xs text-gray-500 mb-2">Desliza la barra para encuadrar tu imagen verticalmente dentro del círculo del botón. Observa la Vista Frontal a la izquierda.</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={imageOffsetY} 
                        onChange={(e) => setImageOffsetY(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#d32f2f]"
                      />
                    </div>
                    
                    <button 
                      onClick={removeImage} 
                      className="self-start text-xs font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 border border-red-200 rounded-lg transition-colors"
                    >
                      Cambiar Diseño
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. RESUMEN Y PAGO */}
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-gray-100 dark:border-gray-800 pb-6">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Resumen de Orden</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 font-bold">{Math.max(quantity, 75)} unidades x Q{selectedSize.price}.00</span>
              <span className="text-4xl font-black text-[#d32f2f]">Q{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl">
            <input 
              type="checkbox" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-6 h-6 text-[#d32f2f] border-gray-300 rounded cursor-pointer shrink-0"
            />
            <div>
              <p className="font-bold text-[#d32f2f] text-sm">CONFIRMO MI DISEÑO</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Entiendo que mi lote de {Math.max(quantity, 75)} botones será impreso exactamente con el encuadre que configuré. La empresa no altera ni mejora imágenes de baja calidad.
              </p>
            </div>
          </div>

          <button 
            onClick={handleAddToCartAttempt}
            className="w-full py-5 bg-[#d32f2f] hover:bg-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(211,47,47,0.3)] text-lg"
          >
            Añadir Lote al Carrito
          </button>
        </div>
      </div>

      {/* MODAL INTELIGENTE DE ADVERTENCIA */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
            <div className="text-5xl text-[#d32f2f] mb-4 text-center">⚠️</div>
            <h2 className="text-2xl font-black uppercase text-center mb-6">Falta el Diseño</h2>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              No puedes proceder con la compra de botones publicitarios sin haber subido la imagen que se imprimirá en ellos. 
            </p>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full py-4 bg-[#d32f2f] text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-800 transition-colors shadow-lg"
            >
              Entendido, subiré mi imagen
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function BotonesBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/botones" className="hover:text-[#d32f2f] transition-colors">Botones</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador</span>
        </div>
        <Suspense fallback={<div className="p-20 text-center font-bold animate-pulse">Cargando personalizador de botones...</div>}>
          <BotonesBuilderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
