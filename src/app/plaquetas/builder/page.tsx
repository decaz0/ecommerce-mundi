"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// Definición de tipos avanzados
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
const MAX_CHARS = 15;

export default function PlaquetaBuilder() {
  const router = useRouter();

  const [lines, setLines] = useState<LineState[]>([
    { type: "TEXT", text: "Presentado a:", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "NOMBRE RECEPTOR", size: "Large", style: "Bold" },
    { type: "ORNAMENT", text: "", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "Por tu apoyo", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "y dedicación", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "TU EMPRESA", size: "Medium", style: "Bold" },
  ]);

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLineChange = (index: number, field: keyof LineState, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    if (field === "type" && value === "ORNAMENT") {
      newLines[index].text = "";
    }
    setLines(newLines);
    setAcceptedTerms(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("png")) {
      alert("¡ATENCIÓN! Solo se aceptan archivos PNG con fondo transparente. Los archivos JPG imprimirán cuadros blancos o negros en tu lámina.");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
      setAcceptedTerms(false);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isCustomizing = lines.some(l => l.type === "ORNAMENT" || l.text.trim().length > 0) || logoPreview !== null;
  const isCartReady = !isCustomizing || acceptedTerms;

  const handleAddToCart = () => {
    if (!isCartReady) return;

    const cartItem = {
      id: Date.now().toString(),
      type: "Plaqueta Premium MDF",
      details: "PLQ-MDF-ORO",
      price: 150, 
      image: "/categorias/plaqueta.png",
      customization: [
        ...(logoPreview ? ["[LOGO INCLUIDO]"] : []),
        ...lines.map(l => l.type === "ORNAMENT" ? "[Ornamenta]" : l.text).filter(t => t.trim().length > 0)
      ],
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const getFontSizeClass = (sz: FontSize) => {
    switch (sz) {
      case "Large": return "text-lg sm:text-xl";
      case "Small": return "text-[10px] sm:text-xs";
      case "Medium": default: return "text-xs sm:text-sm";
    }
  };
  const getFontStyleClass = (st: FontStyle) => {
    switch (st) {
      case "Bold": return "font-black";
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
          <Link href="/plaquetas" className="hover:text-[#d32f2f] transition-colors">Plaquetas MDF</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Constructor</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* IZQUIERDA: Plaqueta Visualizador */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-24 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-black uppercase tracking-tight">Plaqueta Madera MDF</h1>
                <p className="text-gray-500 text-sm">Previsualización de Grabado</p>
              </div>

              <div className="relative flex items-center justify-center p-8 bg-gray-100 dark:bg-[#1a1a1a]">
                <div className="relative w-full max-w-sm mx-auto">
                  <img 
                    src="/categorias/plaqueta.png" 
                    alt="Plaqueta Base" 
                    className="w-full h-auto drop-shadow-2xl relative z-10 block"
                  />

                  {/* OVERLAY METÁLICO (LÁMINA) */}
                  <div className="absolute top-[22%] bottom-[22%] left-[20.5%] right-[20.5%] z-20 flex flex-col items-center justify-start py-6 px-4 overflow-hidden bg-gradient-to-br from-[#d4af37] via-[#ffe066] to-[#b38728] border border-[#b38728]/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.5)] rounded-sm">
                    
                    {logoPreview && (
                      <div className="w-full h-[25%] shrink-0 flex items-center justify-center mb-2">
                        <img src={logoPreview} alt="Logo preview" className="max-w-[80%] max-h-full object-contain mix-blend-multiply opacity-80" />
                      </div>
                    )}
                    
                    <div className="w-full text-center font-serif text-black uppercase flex flex-col justify-center items-center gap-0.5 shrink-0">
                      {lines.map((line, idx) => (
                        <div 
                          key={idx} 
                          className={`w-full flex items-center justify-center break-words text-center leading-tight px-1 ${line.type === "ORNAMENT" ? "text-lg" : `${getFontSizeClass(line.size)} ${getFontStyleClass(line.style)}`}`}
                        >
                          {line.type === "ORNAMENT" ? ORNAMENT_SYMBOL : (line.text || " ")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DERECHA: Editor */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8 pb-20">
            
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Editor de Plaqueta</h2>
              <p className="text-gray-500 mb-8">Sube tu logo y utiliza nuestro editor avanzado para configurar tipografías y estilos.</p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg">
                <h3 className="text-sm font-black text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mb-1">⚠️ IMPORTANTE SOBRE IMÁGENES</h3>
                <ul className="text-xs text-yellow-700 dark:text-yellow-600 list-disc ml-4 space-y-1">
                  <li>Tu logo <strong>DEBE SER FORMATO PNG SIN FONDO (Transparente)</strong>. Si subes un JPG, se imprimirá un cuadro en tu placa.</li>
                  <li><strong>Calidad de Imagen:</strong> El reconocimiento se imprimirá exactamente con la calidad que subas.</li>
                </ul>
              </div>

              <div className="flex flex-col xl:flex-row gap-12">
                {/* Formulario */}
                <div className="w-full xl:w-3/5 flex flex-col gap-6">
                  
                  {/* LOGO */}
                  <div>
                    <div className="text-sm font-bold text-[#d32f2f] uppercase mb-2">1. Logotipo (Opcional)</div>
                    {!logoPreview ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Haz clic para subir PNG</span>
                        <input type="file" accept=".png,.jpg,.jpeg" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
                      </div>
                    ) : (
                      <div className="border-2 border-green-500 rounded-xl p-4 bg-green-50 dark:bg-green-900/10 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded border border-gray-200 p-1">
                              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">Logo Subido Exitosamente</span>
                          </div>
                          <button onClick={removeLogo} className="text-xs font-bold text-white bg-red-500 px-3 py-1 rounded uppercase tracking-widest hover:bg-red-600">Eliminar</button>
                        </div>
                        <div className="bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest p-2 rounded text-center">
                          Un especialista en diseño ajustará tu arte para asegurar un encaje perfecto dentro de tu reconocimiento.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LÍNEAS DE TEXTO */}
                  <div className="flex flex-col gap-4">
                    <div className="text-sm font-bold text-[#d32f2f] uppercase border-b pb-2">2. Texto del Reconocimiento</div>
                    
                    {lines.map((line, idx) => (
                      <div key={idx} className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">Línea {idx + 1}</span>
                          <span className={`text-[10px] font-bold ${line.text.length === MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                            {line.type === "TEXT" ? `${line.text.length} / ${MAX_CHARS}` : ""}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <select 
                            value={line.type} 
                            onChange={(e) => handleLineChange(idx, "type", e.target.value)}
                            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1.5 text-xs outline-none"
                          >
                            <option value="TEXT">Texto</option>
                            <option value="ORNAMENT">Ornamenta</option>
                          </select>

                          {line.type === "TEXT" ? (
                            <div className="flex-1 flex gap-2 min-w-[200px]">
                              <input 
                                type="text" 
                                maxLength={MAX_CHARS}
                                value={line.text}
                                onChange={(e) => handleLineChange(idx, "text", e.target.value)}
                                className={`flex-1 bg-white dark:bg-black border ${line.text.length === MAX_CHARS ? 'border-red-400' : 'border-gray-300 dark:border-gray-700 focus:border-[#d32f2f]'} rounded-md px-3 py-1.5 text-sm outline-none`}
                                placeholder="Escribe aquí..."
                              />
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-md text-sm cursor-not-allowed">
                              {ORNAMENT_SYMBOL}
                            </div>
                          )}
                        </div>

                        {line.type === "TEXT" && (
                          <div className="flex gap-2 mt-1">
                            <select 
                              value={line.size} 
                              onChange={(e) => handleLineChange(idx, "size", e.target.value)}
                              className="bg-transparent border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-[10px] uppercase text-gray-600 dark:text-gray-400"
                            >
                              <option value="Large">Grande</option>
                              <option value="Medium">Mediana</option>
                              <option value="Small">Pequeña</option>
                            </select>
                            <select 
                              value={line.style} 
                              onChange={(e) => handleLineChange(idx, "style", e.target.value)}
                              className="bg-transparent border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-[10px] uppercase text-gray-600 dark:text-gray-400"
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

                {/* Previsualización Derecha */}
                <div className="w-full xl:w-2/5 flex flex-col">
                  <div className="text-sm font-bold text-[#d32f2f] uppercase mb-2">Vista Detallada</div>
                  <div className="w-full max-w-[300px] mx-auto aspect-[5/7] bg-gradient-to-br from-[#d4af37] via-[#ffe066] to-[#b38728] border border-[#b38728] shadow-[0_10px_30px_rgba(179,135,40,0.3)] rounded-sm p-6 flex flex-col items-center justify-start gap-4 overflow-hidden relative">
                    {logoPreview && (
                      <div className="w-full h-24 shrink-0 flex items-center justify-center relative group border border-dashed border-[#b38728]/30">
                        <img src={logoPreview} alt="Logo Detalle" className="max-w-[80%] max-h-full object-contain mix-blend-multiply opacity-90" />
                        <div className="absolute -top-3 bg-[#b38728] text-white text-[8px] px-2 rounded uppercase font-bold tracking-widest hidden group-hover:block">Espacio de Logo</div>
                      </div>
                    )}

                    <div className="w-full text-center font-serif text-black uppercase flex flex-col gap-1 shrink-0">
                      {lines.map((line, idx) => (
                        <div key={idx} className="w-full flex items-center justify-center px-2">
                          <div className={`w-full flex justify-center break-words text-center leading-tight min-h-[16px] ${line.type === "ORNAMENT" ? "text-lg" : `${getFontSizeClass(line.size)} ${getFontStyleClass(line.style)}`}`}>
                            {line.type === "ORNAMENT" ? ORNAMENT_SYMBOL : (line.text || <span className="text-black/10">Línea {idx+1}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VALIDACIÓN Y CARRITO */}
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                  <h3 className="font-black text-xl mb-1 text-gray-500">Total a Pagar</h3>
                  <p className="text-xs text-gray-400">Incluye placa metálica y grabado.</p>
                </div>
                <div className="text-4xl font-black text-[#d32f2f]">Q150.00</div>
              </div>

              {isCustomizing && (
                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-6 h-6 text-[#d32f2f] border-gray-300 rounded cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-[#d32f2f]">ACEPTACIÓN DE DISEÑO Y ORTOGRAFÍA</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      Confirmo que he revisado exhaustivamente todos los textos. Entiendo que mi producto será grabado <strong>exactamente</strong> como lo he configurado en los estilos.
                    </p>
                  </div>
                </div>
              )}

              <button 
                disabled={!isCartReady}
                onClick={handleAddToCart}
                className={`w-full py-5 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg text-lg ${
                  isCartReady
                    ? "bg-[#d32f2f] hover:bg-red-800 text-white cursor-pointer hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(211,47,47,0.3)]"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isCartReady ? "Añadir al Carrito" : "Acepta los Términos para Continuar"}
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
