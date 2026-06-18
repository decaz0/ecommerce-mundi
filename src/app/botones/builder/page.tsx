"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CanvasEditor, { CanvasElement } from "../../../components/CanvasEditor";

const SIZES = [
  { id: "2.5", label: "2.5 cm (Pequeño)", price: 4 },
  { id: "3.5", label: "3.5 cm (Estándar)", price: 5 },
  { id: "4.5", label: "4.5 cm (Mediano)", price: 6 },
  { id: "5.5", label: "5.5 cm (Grande)", price: 7 },
];

const TEMPLATES = [
  { id: "vacio", name: "Plantilla en Blanco", texts: ["", ""] },
  { id: "empresa", name: "Campaña Corporativa", texts: ["MI EMPRESA", "CAMPAÑA 2026"] },
  { id: "evento", name: "Evento Especial", texts: ["ANIVERSARIO", "15 AÑOS"] },
  { id: "politico", name: "Campaña Política", texts: ["VOTA POR", "JUAN PÉREZ"] },
];

function BotonesBuilderContent() {
  const router = useRouter();
  
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default 3.5cm
  const [quantity, setQuantity] = useState<number>(75);
  
  // Diseño del Botón (Único para todos)
  const [elements, setElements] = useState<CanvasElement[]>([
    { id: "text-1", type: "text", text: "MI EMPRESA", x: 25, y: 30, width: 350, height: 60, zIndex: 2, fontSize: 40, isCurved: true, fontStyle: 'Bold' },
    { id: "text-2", type: "text", text: "CAMPAÑA 2026", x: 25, y: 310, width: 350, height: 60, zIndex: 3, fontSize: 32, isCurved: true, fontStyle: 'Normal' },
    { id: "image-1", type: "image", src: "", x: 100, y: 100, width: 200, height: 200, zIndex: 1 }
  ]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const applyTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    
    setElements(elements.map(el => {
      if (el.id === "text-1") return { ...el, text: tpl.texts[0] };
      if (el.id === "text-2") return { ...el, text: tpl.texts[1] };
      return el;
    }));
  };

  const handleUpdateTemplate = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        if (updates.text && updates.text.length > 20) return el;
        return { ...el, ...updates };
      }
      return el;
    }));
  };

  const handleMasterChange = (field: "text-1" | "text-2", value: string) => {
    if (value.length > 20) return;
    handleUpdateTemplate(field, { text: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleUpdateTemplate("image-1", { src: event.target?.result as string });
    };
    reader.readAsDataURL(file);
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

  const handleAddToCart = () => {
    if (!acceptedTerms) {
      alert("Por favor, acepta la garantía de calidad marcando la casilla antes de continuar.");
      return;
    }

    const finalQuantity = Math.max(quantity, 75);
    
    const cartItem = {
      id: Date.now().toString(),
      type: "Botones Publicitarios",
      details: `Botón ${selectedSize.label} x${finalQuantity}`,
      price: selectedSize.price,
      quantity: finalQuantity,
      image: "/categorias/botones.png",
      canvasElements: elements,
      customization: [`Lote estático de ${finalQuantity} unidades con el mismo diseño`],
      variations: Array.from({ length: finalQuantity }).map(() => ({
        color: "Botón",
        lines: [
          elements.find(e => e.id === "text-1")?.text || "",
          elements.find(e => e.id === "text-2")?.text || ""
        ]
      })),
      personalizationType: "SAME"
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const masterLine1 = elements.find(el => el.id === "text-1")?.text || "";
  const masterLine2 = elements.find(el => el.id === "text-2")?.text || "";
  const masterLine1Curved = elements.find(el => el.id === "text-1")?.isCurved || false;
  const masterLine2Curved = elements.find(el => el.id === "text-2")?.isCurved || false;

  return (
    <div className="flex flex-col gap-8 relative pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IZQUIERDA: CONFIGURADOR */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f]">1. Especificaciones de Orden</h2>
                <p className="text-gray-500 text-sm">Selecciona el tamaño del botón. Cantidad mínima: 75.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Diámetro del Botón</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      selectedSize.id === size.id 
                        ? 'border-[#d32f2f] bg-red-50 dark:bg-red-900/20 text-[#d32f2f]' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <span className="font-bold text-sm">{size.label}</span>
                    <span className="text-xs mt-1">Q{size.price}.00 c/u</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f]">2. Diseño del Botón</h2>
                <p className="text-gray-500 text-sm">Crea tu botón promocional. Puedes mover y redimensionar los elementos.</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl mb-8 border border-gray-200 dark:border-gray-800">
              <span className="text-sm font-bold uppercase text-gray-500">Usar Plantilla Rápida:</span>
              <select onChange={(e) => applyTemplate(e.target.value)} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-sm font-bold outline-none">
                <option value="">Selecciona una opción...</option>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <button onClick={() => fileInputRef.current?.click()} className="py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs rounded-xl hover:scale-105 transition-transform w-full">
                  Subir Imagen/Fondo PNG
                </button>
                <input type="file" accept="image/png, image/jpeg" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4 mt-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1 items-center">
                      <span className="flex items-center gap-2">
                        Texto Superior
                        <label className="flex items-center gap-1 cursor-pointer ml-2 bg-gray-200 dark:bg-gray-800 px-2 rounded-full py-0.5">
                          <input type="checkbox" checked={masterLine1Curved} onChange={(e) => handleUpdateTemplate("text-1", { isCurved: e.target.checked })} className="accent-[#d32f2f]" />
                          Curvo
                        </label>
                      </span>
                      <span className={masterLine1.length === 20 ? 'text-red-500' : ''}>{masterLine1.length}/20</span>
                    </div>
                    <input type="text" maxLength={20} value={masterLine1} onChange={(e) => handleMasterChange("text-1", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1 items-center">
                      <span className="flex items-center gap-2">
                        Texto Inferior
                        <label className="flex items-center gap-1 cursor-pointer ml-2 bg-gray-200 dark:bg-gray-800 px-2 rounded-full py-0.5">
                          <input type="checkbox" checked={masterLine2Curved} onChange={(e) => handleUpdateTemplate("text-2", { isCurved: e.target.checked })} className="accent-[#d32f2f]" />
                          Curvo
                        </label>
                      </span>
                      <span className={masterLine2.length === 20 ? 'text-red-500' : ''}>{masterLine2.length}/20</span>
                    </div>
                    <input type="text" maxLength={20} value={masterLine2} onChange={(e) => handleMasterChange("text-2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-gray-700 rounded-full" style={{ width: 250, height: 250 }}>
                  <div className="absolute top-0 left-0" style={{ transform: 'scale(calc(250 / 400))', transformOrigin: 'top left' }}>
                    <CanvasEditor 
                      elements={elements}
                      onChange={setElements}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      width={400}
                      height={400}
                      clipPath="circle(50% at 50% 50%)"
                      backgroundElement={
                        <div className="w-full h-full bg-white dark:bg-gray-100" style={{ clipPath: "circle(50% at 50% 50%)" }}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none mix-blend-overlay z-50"></div>
                        </div>
                      }
                      readOnly={false}
                      enableOverlapDetection={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA: SIDEBAR DE ORDEN */}
        <div className="w-full lg:col-span-1">
          <div className="bg-white dark:bg-[#111] p-10 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24 shadow-2xl flex flex-col gap-6">
             <h3 className="font-black text-2xl mb-2 text-[#d32f2f] uppercase tracking-tight text-center">Detalles de Orden</h3>
             
             <div className="relative h-64 w-full flex items-center justify-center bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-2">
               <div 
                  className="relative flex items-center justify-center transition-transform duration-500 ease-in-out hover:scale-105"
                  style={{ transform: `scale(${parseFloat(selectedSize.id) / 5.5})` }}
                >
                  <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-full overflow-hidden" style={{ width: 250, height: 250 }}>
                    <div className="absolute top-0 left-0" style={{ transform: 'scale(calc(250 / 400))', transformOrigin: 'top left' }}>
                      <CanvasEditor 
                        elements={elements}
                        onChange={() => {}}
                        selectedId={null}
                        onSelect={() => {}}
                        width={400}
                        height={400}
                        clipPath="circle(50% at 50% 50%)"
                        backgroundElement={
                          <div className="w-full h-full bg-white dark:bg-gray-100" style={{ clipPath: "circle(50% at 50% 50%)" }}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none mix-blend-overlay z-50"></div>
                          </div>
                        }
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex flex-col gap-5 border-t border-gray-100 dark:border-gray-800 pt-6">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">1. Modelo:</span>
                  <div className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-bold text-base">Botón {selectedSize.label}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">2. Cantidad Total (Mín 75):</span>
                  <input type="number" min="75" value={quantity} onChange={handleQuantityChange} onBlur={handleQuantityBlur} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center font-black outline-none text-lg" />
                </div>
             </div>

             <div className="text-right border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">Subtotal</div>
                <div className="text-5xl font-black text-[#d32f2f]">Q{(selectedSize.price * Math.max(quantity, 75)).toFixed(2)}</div>
             </div>
             
             <div className="flex items-start gap-4 bg-red-50 dark:bg-red-900/20 p-5 rounded-xl mt-4">
                <input type="checkbox" id="terms_side" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-6 h-6 accent-[#d32f2f]" />
                <label htmlFor="terms_side" className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                  <span className="font-black text-black dark:text-white uppercase block mb-1">Garantía Crown:</span> 
                  Confirmo el diseño, tamaño y la revisión ortográfica.
                </label>
             </div>
             
             <button onClick={handleAddToCart} disabled={!acceptedTerms} className="w-full py-5 mt-2 bg-[#d32f2f] hover:bg-red-700 disabled:bg-gray-400 text-white font-black uppercase text-lg rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]">
                Añadir al Carrito
             </button>
          </div>
        </div>

      </div>
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
          <span className="text-black dark:text-white">Diseñador B2B</span>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-[#d32f2f] p-4 mb-8 rounded-r-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#d32f2f] font-black uppercase text-sm">Flujo de Producción Masiva</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Crea el diseño de tu botón. Puedes mover y redimensionar textos. Todos los botones de este lote compartirán el mismo diseño maestro.</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center font-bold text-gray-500">Cargando personalizador...</div>}>
          <BotonesBuilderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
