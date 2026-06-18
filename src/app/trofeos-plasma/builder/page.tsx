"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

type LineType = "TEXT" | "ORNAMENT";
type FontSize = "Small" | "Medium" | "Large";
type FontStyle = "Normal" | "Bold" | "Italic";

interface LineState {
  type: LineType;
  text: string;
  size: FontSize;
  style: FontStyle;
}

const ORNAMENT_SYMBOL = "❦ ❧ ❦";
const MAX_CHARS = 20;

export default function TrofeoPlasmaBuilder() {
  const router = useRouter();

  const [lines, setLines] = useState<LineState[]>([
    { type: "TEXT", text: "Campeonato 2026", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "PRIMER LUGAR", size: "Large", style: "Bold" },
    { type: "ORNAMENT", text: "", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "Goleador", size: "Medium", style: "Normal" },
  ]);

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [warningMessages, setWarningMessages] = useState<string[]>([]);

  const handleLineChange = (index: number, field: keyof LineState, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    if (field === "type" && value === "ORNAMENT") {
      newLines[index].text = "";
    }
    setLines(newLines);
    setAcceptedTerms(false);
  };

  const activeLines = lines.filter(l => l.type === "ORNAMENT" || l.text.trim().length > 0);
  
  const handleAddToCartAttempt = () => {
    const warnings: string[] = [];

    if (activeLines.length === 0) {
      warnings.push("Has dejado la placa de grabado vacía. Tu reconocimiento no tendrá texto.");
    }

    const hasCustomization = activeLines.length > 0;
    if (hasCustomization && !acceptedTerms) {
      alert("Por favor, acepta la garantía de ortografía y calidad marcando la casilla antes de continuar.");
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
      type: "Trofeo Plasma",
      details: "Diseño Estelar Fútbol",
      price: 250,
      image: "/categorias/trofeo plasma.png",
      customization: lines.map(l => l.type === "ORNAMENT" ? "[Ornamenta]" : l.text).filter(t => t.trim().length > 0),
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const getSvgFontSize = (sz: FontSize) => {
    switch (sz) {
      case "Large": return "80";
      case "Small": return "35";
      case "Medium": default: return "55";
    }
  };

  const getFontStyleClass = (st: FontStyle) => {
    switch (st) {
      case "Bold": return "font-black font-sans"; 
      case "Italic": return "font-serif italic";
      case "Normal": default: return "font-serif";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <span className="text-black dark:text-white">Trofeo Plasma</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* IZQUIERDA: Trofeo */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-24 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 flex items-center justify-center aspect-[3/4] overflow-hidden relative">
              <img 
                src="/categorias/trofeo plasma.png" 
                alt="Trofeo Plasma" 
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
              />
            </div>
          </div>

          {/* DERECHA: Editor y Placa */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8 pb-20">
            
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
              <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Personalizar Plaqueta Frontal</h1>
              <p className="text-gray-500 mb-8">Diseña el texto para la placa del Trofeo Plasma. Esta placa es más grande y permite hasta 4 líneas.</p>
              
              <div className="flex flex-col gap-12">
                
                {/* Visualización de la Placa Estática Ancha */}
                <div className="w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8">
                    
                    {/* Placa Dorada Estática y Más Grande */}
                    <div className="flex-1 w-full max-w-[550px] h-[180px] bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] border-2 border-[#fff7c2] shadow-[0_10px_30px_rgba(179,135,40,0.4)] rounded-sm p-4 flex flex-col items-center justify-center gap-0 overflow-hidden">
                      {activeLines.length === 0 && (
                        <div className="w-full h-full flex items-center justify-center text-black/20 font-bold text-lg uppercase tracking-widest text-center">
                          Vista Previa de Placa
                        </div>
                      )}

                      {activeLines.map((line, idx) => (
                        <div key={idx} className="w-full flex-1 flex items-center justify-center overflow-hidden min-h-0">
                          {line.type === "ORNAMENT" ? (
                            <div className="text-black flex items-center justify-center h-full text-3xl md:text-4xl lg:text-5xl">
                              {ORNAMENT_SYMBOL}
                            </div>
                          ) : (
                            <svg viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full max-h-[100%]">
                              <text 
                                x="50%" 
                                y="50%" 
                                dominantBaseline="middle" 
                                textAnchor="middle" 
                                fill="#000"
                                fontSize={getSvgFontSize(line.size)}
                                className={getFontStyleClass(line.style)}
                                fontWeight={line.style === 'Bold' ? '900' : 'normal'}
                                fontStyle={line.style === 'Italic' ? 'italic' : 'normal'}
                              >
                                {line.text}
                              </text>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Formulario Estricto */}
                <div className="w-full flex flex-col gap-6">
                  <div className="text-sm font-bold text-[#d32f2f] uppercase border-b pb-2">1. Grabado (4 Líneas Máximo)</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {lines.map((line, idx) => (
                      <div key={idx} className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">Línea {idx + 1}</span>
                          <span className={`text-[10px] font-bold ${line.text.length === MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                            {line.type === "TEXT" ? `${line.text.length} / ${MAX_CHARS}` : ""}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <select 
                            value={line.type} 
                            onChange={(e) => handleLineChange(idx, "type", e.target.value)}
                            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-[#d32f2f] outline-none"
                          >
                            <option value="TEXT">Texto</option>
                            <option value="ORNAMENT">Ornamenta</option>
                          </select>

                          {line.type === "TEXT" ? (
                            <input 
                              type="text" 
                              maxLength={MAX_CHARS}
                              value={line.text}
                              onChange={(e) => handleLineChange(idx, "text", e.target.value)}
                              className={`w-full bg-white dark:bg-black border ${line.text.length === MAX_CHARS ? 'border-red-400 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-[#d32f2f]'} rounded-md px-3 py-1.5 text-sm outline-none transition-colors`}
                              placeholder="Escribe aquí..."
                            />
                          ) : (
                            <div className="w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-md text-sm py-1.5 cursor-not-allowed">
                              {ORNAMENT_SYMBOL}
                            </div>
                          )}
                        </div>

                        {line.type === "TEXT" && (
                          <div className="flex gap-2 mt-1">
                            <select 
                              value={line.size} 
                              onChange={(e) => handleLineChange(idx, "size", e.target.value)}
                              className="flex-1 bg-transparent border border-gray-200 dark:border-gray-800 rounded px-1 py-1 text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400"
                            >
                              <option value="Large">Grande</option>
                              <option value="Medium">Mediana</option>
                              <option value="Small">Pequeña</option>
                            </select>
                            <select 
                              value={line.style} 
                              onChange={(e) => handleLineChange(idx, "style", e.target.value)}
                              className="flex-1 bg-transparent border border-gray-200 dark:border-gray-800 rounded px-1 py-1 text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400"
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
                  <p className="font-bold text-[#d32f2f]">GARANTÍA DE GRABADO Y CALIDAD</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    Revisa exhaustivamente que toda la ortografía del texto sea correcta. Los cambios no se pueden hacer una vez se realiza la orden. La empresa no se hace responsable por información mal escrita.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold text-gray-500 uppercase">Total:</span>
                <span className="text-3xl font-black text-[#d32f2f]">Q250.00</span>
              </div>

              <button 
                onClick={handleAddToCartAttempt}
                className="w-full py-5 bg-[#d32f2f] hover:bg-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(211,47,47,0.3)] text-lg"
              >
                Añadir al Carrito
              </button>
            </div>

          </div>

          {/* MODAL INTELIGENTE DE ADVERTENCIA */}
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

                <p className="text-center text-sm text-gray-500 mb-8">
                  ¿Estás seguro de que quieres añadir este producto al carrito con estas configuraciones faltantes?
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowWarningModal(false)}
                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Volver para Editar
                  </button>
                  <button 
                    onClick={() => {
                      setShowWarningModal(false);
                      executeAddToCart();
                    }}
                    className="w-full py-4 bg-transparent border-2 border-gray-200 dark:border-gray-800 text-gray-500 hover:text-[#d32f2f] hover:border-[#d32f2f] font-bold uppercase tracking-widest rounded-xl transition-colors"
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
