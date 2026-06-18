"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import CanvasEditor, { CanvasElement } from "../../../components/CanvasEditor";

type FontSize = "Small" | "Medium" | "Large";
type FontStyle = "Normal" | "Bold" | "Italic";

interface LineState {
  id: string;
  text: string;
  size: FontSize;
  style: FontStyle;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

const MAX_CHARS = 15;

export default function MedallasBuilder() {
  const router = useRouter();

  const [lines, setLines] = useState<LineState[]>([
    { id: "l1", text: "1er LUGAR", size: "Medium", style: "Bold", x: 20, y: 100, width: 260, height: 40, zIndex: 1 },
    { id: "l2", text: "Torneo", size: "Small", style: "Normal", x: 20, y: 150, width: 260, height: 30, zIndex: 2 },
    { id: "l3", text: "Regional", size: "Small", style: "Normal", x: 20, y: 190, width: 260, height: 30, zIndex: 3 },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [warningMessages, setWarningMessages] = useState<string[]>([]);

  const handleLineChange = (index: number, field: keyof LineState, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
    setAcceptedTerms(false);
  };

  const activeLines = lines.filter(l => l.text.trim().length > 0);
  
  const handleAddToCartAttempt = () => {
    const warnings: string[] = [];

    if (activeLines.length === 0) {
      warnings.push("Has dejado la medalla sin grabado. Tu medalla no tendrá texto.");
    }

    const hasCustomization = activeLines.length > 0;
    if (hasCustomization && !acceptedTerms) {
      alert("Por favor, acepta la garantía marcando la casilla antes de continuar.");
      return;
    }

    if (warnings.length > 0) {
      setWarningMessages(warnings);
      setShowWarningModal(true);
    } else {
      executeAddToCart();
    }
  };

  const executeAddToCart = () => {
    const cartItem = {
      id: Date.now().toString(),
      type: "Medalla Premium",
      details: "Medalla con Grabado Cuadrado",
      price: 150,
      image: "/categorias/medalla.png",
      customization: lines.map(l => l.text).filter(t => t.trim().length > 0),
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const getSvgFontSize = (sz: FontSize, totalLines: number, textLen: number) => {
    const multiplier = totalLines === 1 ? 1.5 : 1;
    let baseSize;
    switch (sz) {
      case "Large": baseSize = 36; break;
      case "Small": baseSize = 16; break;
      case "Medium": default: baseSize = 24; break;
    }
    return baseSize * multiplier;
  };

  const getCanvasElements = (): CanvasElement[] => {
    return lines.map((line) => ({
      id: line.id,
      type: "text",
      x: line.x,
      y: line.y,
      width: line.width,
      height: line.height,
      zIndex: line.zIndex,
      text: line.text,
      fontSize: getSvgFontSize(line.size, activeLines.length, line.text.length),
      fontStyle: line.style,
      color: "#000000",
      fontFamily: line.style === "Italic" ? "serif" : "sans-serif"
    }));
  };

  const handleElementsChange = (newElements: CanvasElement[]) => {
    const newLines = lines.map(line => {
      const el = newElements.find(e => e.id === line.id);
      if (el) {
        return { ...line, x: el.x, y: el.y, width: el.width, height: el.height, zIndex: el.zIndex };
      }
      return line;
    });
    setLines(newLines);
    setAcceptedTerms(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador de Medallas</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative pb-20">
          
          {/* 1. IZQUIERDA: FOTO DE LA MEDALLA CON LÁMINA ENCIMA */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-24 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-tight">Producto Real</h2>
              </div>
              <div className="relative flex items-center justify-center p-8 bg-gray-100 dark:bg-[#1a1a1a]">
                <div className="relative w-full max-w-sm mx-auto">
                  <img 
                    src="/categorias/medalla.png" 
                    alt="Medalla" 
                    className="w-full h-auto drop-shadow-2xl relative z-10 block"
                  />
                  
                  <div className="absolute top-[32.5%] bottom-[21.5%] left-[29.8%] right-[26.2%] z-20 flex flex-col items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-2 border-[#e6c27a] pointer-events-none">
                    <div style={{ transform: 'scale(0.35)', transformOrigin: 'center center' }}>
                      <CanvasEditor
                        elements={getCanvasElements()}
                        onChange={() => {}}
                        selectedId={null}
                        onSelect={() => {}}
                        width={300}
                        height={300}
                        readOnly={true}
                        enableOverlapDetection={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CENTRO: CONFIGURADOR DE TEXTO */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
              <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Diseñador</h1>
              <p className="text-gray-500 mb-8 text-sm">Configura las líneas de texto para la lámina central cuadrada.</p>
              
              <div className="w-full flex flex-col gap-6">
                <div className="text-sm font-bold text-[#d32f2f] uppercase border-b pb-2">Grabado Láser</div>
                
                <div className="flex flex-col gap-4">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Línea {idx + 1}</span>
                        <span className={`text-[10px] font-bold ${line.text.length === MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                          {line.text.length} / {MAX_CHARS}
                        </span>
                      </div>

                      <input 
                        type="text" 
                        maxLength={MAX_CHARS}
                        value={line.text}
                        onChange={(e) => handleLineChange(idx, "text", e.target.value)}
                        className={`w-full bg-white dark:bg-black border ${line.text.length === MAX_CHARS ? 'border-red-400 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-[#d32f2f]'} rounded-md px-3 py-2 text-sm outline-none transition-colors`}
                        placeholder="Escribe aquí..."
                      />

                      <div className="flex gap-2 mt-1">
                        <select 
                          value={line.size} 
                          onChange={(e) => handleLineChange(idx, "size", e.target.value)}
                          className="flex-1 bg-transparent border border-gray-200 dark:border-gray-800 rounded px-1 py-1 text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 outline-none focus:border-[#d32f2f]"
                        >
                          <option value="Large">Grande</option>
                          <option value="Medium">Mediana</option>
                          <option value="Small">Pequeña</option>
                        </select>
                        <select 
                          value={line.style} 
                          onChange={(e) => handleLineChange(idx, "style", e.target.value)}
                          className="flex-1 bg-transparent border border-gray-200 dark:border-gray-800 rounded px-1 py-1 text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 outline-none focus:border-[#d32f2f]"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Bold">Negrita</option>
                          <option value="Italic">Cursiva</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VALIDACIÓN Y CARRITO */}
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-6 h-6 text-[#d32f2f] border-gray-300 rounded cursor-pointer"
                />
                <div>
                  <p className="font-bold text-[#d32f2f] text-sm">GARANTÍA DE GRABADO</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    Revisa exhaustivamente que toda la ortografía del texto sea correcta. Los cambios no se pueden hacer una vez se realiza la orden.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold text-gray-500 uppercase">Total:</span>
                <span className="text-3xl font-black text-[#d32f2f]">Q150.00</span>
              </div>

              <button 
                onClick={handleAddToCartAttempt}
                className="w-full py-5 bg-[#d32f2f] hover:bg-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(211,47,47,0.3)] text-lg"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>

          {/* 3. DERECHA: VISTA PREVIA DETALLADA LÁMINA CUADRADA */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-24 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-[#d4af37]/10 flex justify-center items-center">
                <h2 className="text-sm font-black text-[#b38728] uppercase tracking-widest">Placa Cuadrada (Zoom)</h2>
              </div>
              
              <div className="w-full bg-gray-50 dark:bg-[#151515] p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                {/* Lámina cuadrada dorada */}
                <div className="w-full max-w-[300px] aspect-square bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] border-4 border-[#fff7c2] shadow-[0_20px_50px_rgba(179,135,40,0.4)] rounded-sm p-1 flex flex-col items-center justify-center overflow-hidden relative">
                  <CanvasEditor
                    elements={getCanvasElements()}
                    onChange={handleElementsChange}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    width={300}
                    height={300}
                    enableOverlapDetection={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MODAL DE ADVERTENCIA */}
          {showWarningModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                <div className="text-5xl text-[#d32f2f] mb-4 text-center">⚠️</div>
                <h2 className="text-2xl font-black uppercase text-center mb-6">Campos Incompletos</h2>
                <div className="space-y-3 mb-8">
                  {warningMessages.map((msg, i) => (
                    <div key={i} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="text-sm font-bold text-red-800 dark:text-red-400">{msg}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowWarningModal(false)}
                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl"
                  >
                    Volver para Editar
                  </button>
                  <button 
                    onClick={() => {
                      setShowWarningModal(false);
                      executeAddToCart();
                    }}
                    className="w-full py-4 bg-transparent border-2 border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-widest rounded-xl"
                  >
                    Sí, Proceder así
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
