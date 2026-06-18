"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

type FontSize = "Small" | "Medium" | "Large";
type FontStyle = "Normal" | "Italic" | "Bold";
type LineType = "TEXT" | "ORNAMENT";

interface LineState {
  type: LineType;
  text: string;
  size: FontSize;
  style: FontStyle;
}

const ORNAMENT_SYMBOL = "❦ ❧ ❦";
const MAX_CHARS = 15;

const MODELS = [
  { id: "hexagono", name: "Vidrio Hexágono", img: "/categorias/vidrio hexagono.png", price: 350 },
  { id: "cuadrilatero", name: "Vidrio Cuadrilátero", img: "/categorias/vidrio cuadrilatero.png", price: 350 }
];

function VidriosBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams?.get("model") || "hexagono";
  const isOffer = searchParams?.get("offer") === "true";
  
  const baseModel = MODELS.find(m => m.id === modelId) || MODELS[0];
  const selectedModel = {
    ...baseModel,
    originalPrice: baseModel.price,
    price: isOffer ? baseModel.price - 100 : baseModel.price,
  };

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const [lines, setLines] = useState<LineState[]>([
    { type: "TEXT", text: "Reconocimiento", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "NOMBRE PREMIADO", size: "Large", style: "Bold" },
    { type: "ORNAMENT", text: "", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "Por su gran", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "desempeño", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "SU EMPRESA", size: "Medium", style: "Bold" },
  ]);

  const handleTextChange = (idx: number, val: string) => {
    if (val.length > MAX_CHARS) return;
    const newLines = [...lines];
    newLines[idx].text = val;
    setLines(newLines);
  };

  const handleLinePropChange = (idx: number, field: keyof LineState, value: string) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [field]: value };
    setLines(newLines);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddToCart = () => {
    if (!acceptedTerms) {
      alert("Por favor, acepta la revisión visual marcando la casilla de confirmación.");
      return;
    }

    const customizationDetails = lines.map((l, i) => 
      l.type === "ORNAMENT" ? `Línea ${i+1}: [Ornamento]` : `Línea ${i+1}: ${l.text || "(Vacía)"}`
    );

    const cartItem = {
      id: Date.now().toString(),
      type: "Reconocimiento de Vidrio Premium",
      details: selectedModel.name,
      price: selectedModel.price,
      originalPrice: selectedModel.originalPrice,
      isOffer: isOffer,
      quantity: 1,
      image: selectedModel.img,
      customization: customizationDetails,
      medallionImage: logoPreview
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const getFontSizeClass = (sz: FontSize) => {
    switch (sz) {
      case "Large": return "text-2xl sm:text-4xl";
      case "Small": return "text-sm sm:text-lg";
      case "Medium": default: return "text-lg sm:text-2xl";
    }
  };
  const getFontStyleClass = (st: FontStyle) => {
    switch (st) {
      case "Bold": return "font-bold";
      case "Italic": return "italic";
      case "Normal": default: return "font-normal";
    }
  };

  // Coordenadas corregidas y ampliadas
  const isHex = selectedModel.id === "hexagono";
  
  // Contenedor expandido para abarcar casi toda la foto
  const overlayPositionClass = isHex 
    ? "top-[14%] bottom-[24%] left-[17%] right-[17%]" 
    : "top-[12.5%] bottom-[21.5%] left-[18%] right-[18%]";

  // Recortes geométricos precisos (Con esquinas redondeadas simuladas y más ancho arriba)
  const clipPathStyle = isHex
    ? "polygon(32% 0%, 68% 0%, 69% 0.5%, 69.8% 1.5%, 70.2% 3%, 99.8% 46%, 100% 48%, 99.5% 50%, 73.5% 97%, 73.2% 98.5%, 72% 100%, 28% 100%, 26.8% 98.5%, 26.5% 97%, 0.5% 50%, 0% 48%, 0.2% 46%, 29.8% 3%, 30.2% 1.5%, 31% 0.5%)" 
    : "polygon(17% 0%, 83% 0%, 84% 0.5%, 84.8% 1.5%, 85% 3%, 100% 97%, 99.5% 98.5%, 98% 100%, 2% 100%, 0.5% 98.5%, 0% 97%, 15% 3%, 15.2% 1.5%, 16% 0.5%)";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative pb-20">
      
      {/* 1. IZQUIERDA: FOTO DEL VIDRIO */}
      <div className="flex flex-col gap-6">
        <div className="sticky top-24">
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-tight">Producto Real</h2>
              <span className="text-[#d32f2f] text-[10px] font-bold uppercase">{selectedModel.name}</span>
            </div>
            <div className="relative flex items-center justify-center p-8 bg-gray-100 dark:bg-[#1a1a1a]">
              <div className="relative w-full max-w-sm mx-auto">
                <img 
                  src={selectedModel.img} 
                  alt={selectedModel.name} 
                  className="w-full h-auto drop-shadow-2xl relative z-10 block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTRO: CONFIGURADOR */}
      <div className="flex flex-col gap-8">
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Diseñador</h1>
          <p className="text-gray-500 mb-6 text-sm">Configura los detalles de tu reconocimiento.</p>

          <div className="flex flex-col gap-8">

            {/* LOGO */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-bold text-[#d32f2f] uppercase border-b pb-2 flex justify-between items-center">
                <span>1. Logotipo (Opcional)</span>
              </div>
              <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                {!logoPreview ? (
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-[#111] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 text-xs">
                      IMG
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">PNG sin fondo recomendado.</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                      >
                        Buscar Archivo
                      </button>
                      <input type="file" accept=".png,.jpg,.jpeg" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1">
                        <img src={logoPreview} className="max-w-full max-h-full object-contain" />
                      </div>
                      <p className="text-xs font-bold text-green-600">✓ Logo subido</p>
                    </div>
                    <button 
                      onClick={removeLogo}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-xs"
                      title="Eliminar logo"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TEXTOS */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-bold text-[#d32f2f] uppercase border-b pb-2 flex justify-between items-center">
                <span>2. Grabado Láser</span>
                <span className="text-[10px] font-normal text-gray-500 normal-case bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">Máx. 15 letras/línea</span>
              </div>
              <div className="flex flex-col gap-6">
                {lines.map((line, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Línea {idx + 1}</span>
                      {line.type === "TEXT" && (
                        <span className={`text-[10px] font-bold ${line.text.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                          {line.text.length} / {MAX_CHARS}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Tipo de Línea */}
                      <select 
                        value={line.type} 
                        onChange={(e) => handleLinePropChange(idx, "type", e.target.value)}
                        className="w-1/4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded text-xs px-2 py-2 outline-none focus:border-[#d32f2f]"
                      >
                        <option value="TEXT">Texto</option>
                        <option value="ORNAMENT">Ornamento</option>
                      </select>

                      {/* Texto Input */}
                      <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded flex items-center px-2 py-2 focus-within:border-[#d32f2f] transition-all">
                        <input 
                          type="text" 
                          value={line.type === "ORNAMENT" ? "" : line.text}
                          onChange={(e) => handleTextChange(idx, e.target.value)}
                          disabled={line.type === "ORNAMENT"}
                          placeholder={line.type === "ORNAMENT" ? "---- ORNAMENTO ----" : "Escribe..."}
                          className="w-full bg-transparent border-none outline-none text-xs font-medium placeholder-gray-400 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {line.type === "TEXT" && (
                      <div className="flex gap-2 mt-1">
                        {/* Tamaño */}
                        <select 
                          value={line.size} 
                          onChange={(e) => handleLinePropChange(idx, "size", e.target.value)}
                          className="w-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded font-bold text-[10px] uppercase tracking-wider px-2 py-1.5 outline-none focus:border-[#d32f2f] transition-colors"
                        >
                          <option value="Small">Pequeña</option>
                          <option value="Medium">Mediana</option>
                          <option value="Large">Grande</option>
                        </select>
                        
                        {/* Estilo/Grosor */}
                        <select 
                          value={line.style} 
                          onChange={(e) => handleLinePropChange(idx, "style", e.target.value)}
                          className="w-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded font-bold text-[10px] uppercase tracking-wider px-2 py-1.5 outline-none focus:border-[#d32f2f] transition-colors"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Bold">Negrita</option>
                          <option value="Italic">Cursiva</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RESUMEN Y PAGO EN EL CENTRO */}
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Total</h3>
            <span className="text-3xl font-black text-[#d32f2f]">Q{selectedModel.price}.00</span>
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl">
            <input 
              type="checkbox" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[#d32f2f] border-gray-300 rounded cursor-pointer shrink-0"
            />
            <div>
              <p className="font-bold text-[#d32f2f] text-xs">CONFIRMO LOS TEXTOS</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">
                El vidrio será grabado exactamente como se muestra a la derecha.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {isOffer && (
              <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 p-3 rounded-lg">
                <span className="text-[#d32f2f] font-bold text-xs uppercase">Precio Especial de Oferta</span>
                <span className="text-gray-400 line-through text-sm font-bold">Q{selectedModel.originalPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800">
              <span className="font-bold text-sm uppercase text-gray-500">Precio Total:</span>
              <span className="font-black text-2xl text-[#d32f2f]">Q{selectedModel.price.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full py-4 mt-2 bg-[#d32f2f] hover:bg-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-sm shadow-[0_10px_30px_rgba(211,47,47,0.3)]"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>

      {/* 3. DERECHA: LÁMINA GIGANTE */}
      <div className="flex flex-col gap-6">
        <div className="sticky top-24">
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-[#d4af37]/10 flex justify-center items-center">
              <h2 className="text-sm font-black text-[#b38728] uppercase tracking-widest">Arte de Lámina Final</h2>
            </div>
            
            <div className="w-full bg-gray-50 dark:bg-[#151515] p-8 lg:p-12 flex items-center justify-center min-h-[500px]">
              <div 
                className="w-[95%] max-w-[480px] aspect-[3/4] bg-gradient-to-br from-[#d4af37] via-[#ffe066] to-[#b38728] shadow-[0_20px_50px_rgba(212,175,55,0.3)] p-10 flex flex-col items-center justify-center transition-all duration-500 relative mx-auto"
                style={{ clipPath: clipPathStyle }}
              >
                {/* Reflejos de brillo extra para la lámina grande */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none"></div>

                {logoPreview && (
                  <div className="w-full h-32 shrink-0 flex items-center justify-center relative border border-dashed border-black/10 mb-6 z-10">
                    <img src={logoPreview} alt="Logo Detalle" className="max-w-[80%] max-h-full object-contain mix-blend-multiply opacity-90" />
                  </div>
                )}

                <div className="w-full text-center font-serif text-black uppercase flex flex-col gap-3 shrink-0 z-10">
                  {lines.map((line, idx) => (
                    <div key={idx} className="w-full flex items-center justify-center px-2">
                      <div className={`w-full flex justify-center break-words text-center leading-tight min-h-[20px] ${line.type === "ORNAMENT" ? "text-3xl" : `${getFontSizeClass(line.size)} ${getFontStyleClass(line.style)}`}`}>
                        {line.type === "ORNAMENT" ? ORNAMENT_SYMBOL : (line.text || <span className="text-black/10">Línea {idx+1}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VidriosBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/vidrios" className="hover:text-[#d32f2f] transition-colors">Vidrios</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador</span>
        </div>
        <Suspense fallback={<div className="p-20 text-center font-bold animate-pulse">Cargando constructor de cristal...</div>}>
          <VidriosBuilderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
