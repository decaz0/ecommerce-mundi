"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// Definición de tipos para el estado
type SizeType = "11" | "12";
type FigureType = "F" | "V" | "PM" | "NONE" | null;
type ColorType = "D" | "R" | "V" | null;

function TrophyBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams?.get("model");

  const isFutbol = modelId === "futbol";

  // Estado de los pasos (Acordeón secuencial)
  const [activeStep, setActiveStep] = useState<number>(isFutbol ? 3 : 1);
  
  // Estado de la selección
  const [color, setColor] = useState<ColorType>(isFutbol ? "R" : null);
  const [size, setSize] = useState<SizeType>("11");
  const [figure, setFigure] = useState<FigureType>(isFutbol ? "F" : null);

  // Función constructora del nombre de imagen final
  const getProductImage = () => {
    if (!color) return `/categorias/b${size}.png`;
    if (!figure || figure === "NONE") return `/categorias/${color.toLowerCase()}${size}.png`;
    return `/categorias/${color}${figure}${size}.png`;
  };

  // Manejadores de pasos
  const handleSelectColor = (col: ColorType) => {
    setColor(col);
    if (activeStep === 1) setActiveStep(2);
  };

  const handleSelectSize = (s: SizeType) => {
    setSize(s);
    if (activeStep === 2) setActiveStep(3);
  };

  const handleSelectFigure = (fig: FigureType) => {
    setFigure(fig);
  };

  const handleProceedToCustomize = () => {
    // Redirigir a la vista de personalización con los parámetros
    router.push(`/trofeos/builder/customize?color=${color || "NONE"}&size=${size}&figure=${figure || "NONE"}`);
  };

  // Diccionarios de UI
  const COLOR_OPTIONS = [
    { id: "D", name: "Dorado Clásico", hex: "bg-yellow-400", border: "border-yellow-500" },
    { id: "R", name: "Rojo Estrellas", hex: "bg-red-600", border: "border-red-700" },
    { id: "V", name: "Verde Esmeralda", hex: "bg-green-600", border: "border-green-700" },
  ];

  const FIGURE_OPTIONS = [
    { id: "NONE", name: "Sin Figura", src: `/categorias/b${size}.png` },
    { id: "F", name: "Fútbol", src: "/categorias/futbol.png" },
    { id: "V", name: "Victoria", src: "/categorias/victoria.png" },
    { id: "PM", name: "Victoria Portamedallón", src: "/categorias/victoria portamedallon.png" },
  ];

  const price = size === "11" ? 100 : 130;
  
  // Está listo para personalizar si eligió color y figura (incluso 'NONE')
  const isReadyToCustomize = color !== null && figure !== null;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* COLUMNA IZQUIERDA: VISUALIZADOR DEL PRODUCTO (Sticky) */}
        <div className="w-full lg:w-[45%]">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-black uppercase tracking-tight">Trofeo Columna Deportiva</h1>
                <p className="text-gray-500 text-sm">Configuración Base</p>
              </div>
              
              <div className="aspect-[3/4] w-full bg-gray-100 dark:bg-[#1a1a1a] relative flex flex-col items-center justify-center p-8 overflow-hidden">
                <img 
                  key={getProductImage()}
                  src={getProductImage()} 
                  alt="Previsualización del Trofeo" 
                  className="w-full h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700 relative z-10"
                />
                
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-30">
                  <span className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded shadow-lg">
                    {size}" Pulgadas
                  </span>
                  {color && (
                    <span className={`text-[10px] text-white font-black uppercase tracking-wider px-3 py-1 rounded shadow-lg ${COLOR_OPTIONS.find(c => c.id === color)?.hex}`}>
                      {COLOR_OPTIONS.find(c => c.id === color)?.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PANELES DE OPCIONES (ACORDEÓN) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-6 pb-20">
          
          {/* IN STOCK & PRICE BAR */}
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-green-600 dark:text-green-500 font-black uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                En Inventario
              </div>
              <div className="text-sm text-gray-500 mt-1 uppercase">Item #: TR-{color || "X"}{figure || "X"}{size}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-[#d32f2f]">Q{price.toFixed(2)}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">Precio Unitario</div>
            </div>
          </div>

          {/* STEP 1: COLOR */}
          <div className={`bg-white dark:bg-[#111] rounded-2xl border transition-all duration-500 ${activeStep >= 1 ? "border-[#d32f2f] shadow-lg opacity-100" : "border-gray-200 dark:border-gray-800 opacity-50"}`}>
            <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setActiveStep(1)}>
              <h2 className="text-xl font-black flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 ${activeStep >= 1 ? "bg-[#d32f2f] text-white" : "bg-gray-200 text-gray-500"}`}>1</span>
                Color de Columna
              </h2>
              {color && activeStep !== 1 && <span className="text-sm font-bold text-[#d32f2f] uppercase">Editando...</span>}
            </div>
            
            {activeStep === 1 && (
              <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
                <p className="text-sm text-gray-500 mb-6">Elige el color principal de la estructura de tu trofeo.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleSelectColor(col.id as ColorType)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 ${
                        color === col.id 
                          ? `border-[#d32f2f] bg-red-50 dark:bg-red-900/20 shadow-md` 
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full shadow-inner border-4 ${col.border} ${col.hex} ${color === col.id ? "scale-110" : ""}`}></div>
                      <div className={`text-xs font-bold text-center uppercase tracking-widest ${color === col.id ? "text-[#d32f2f]" : "text-gray-600 dark:text-gray-400"}`}>
                        {col.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: SIZE */}
          <div className={`bg-white dark:bg-[#111] rounded-2xl border transition-all duration-500 ${activeStep >= 2 ? "border-[#d32f2f] shadow-lg opacity-100" : "border-gray-200 dark:border-gray-800 opacity-50 grayscale pointer-events-none"}`}>
            <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => activeStep >= 2 && setActiveStep(2)}>
              <h2 className="text-xl font-black flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 ${activeStep >= 2 ? "bg-[#d32f2f] text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-500"}`}>2</span>
                Tamaño del Trofeo
              </h2>
            </div>
            
            {activeStep === 2 && (
              <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
                <p className="text-sm text-gray-500 mb-6">Elige la altura total del trofeo.</p>
                <div className="grid grid-cols-2 gap-4">
                  {(["11", "12"] as SizeType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSelectSize(s)}
                      className={`py-6 px-6 rounded-xl border-2 flex flex-col items-center transition-all hover:-translate-y-1 ${
                        size === s 
                          ? "border-[#d32f2f] bg-red-50 dark:bg-red-900/20 text-[#d32f2f] shadow-md" 
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <div className="text-3xl font-black">{s}"</div>
                      <div className="text-xs uppercase tracking-widest mt-2 font-bold">Pulgadas</div>
                      <div className="text-[10px] text-gray-400 mt-1">Precio: Q{s === "11" ? "100" : "130"}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: FIGURE */}
          <div className={`bg-white dark:bg-[#111] rounded-2xl border transition-all duration-500 ${activeStep >= 3 ? "border-[#d32f2f] shadow-lg opacity-100" : "border-gray-200 dark:border-gray-800 opacity-50 grayscale pointer-events-none"}`}>
            <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => activeStep >= 3 && setActiveStep(3)}>
              <h2 className="text-xl font-black flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 ${activeStep >= 3 ? "bg-[#d32f2f] text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-500"}`}>3</span>
                Figura Decorativa
              </h2>
            </div>
            
            {activeStep === 3 && (
              <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
                <p className="text-sm text-gray-500 mb-6">Selecciona el diseño de la parte superior, o elige 'Sin Figura'.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {FIGURE_OPTIONS.map((fig) => (
                    <button
                      key={fig.id}
                      onClick={() => handleSelectFigure(fig.id as FigureType)}
                      className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 ${
                        figure === fig.id 
                          ? "border-[#d32f2f] bg-red-50 dark:bg-red-900/20 shadow-md" 
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 opacity-80"
                      }`}
                    >
                      {figure === fig.id && (
                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#d32f2f] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">✓</div>
                      )}
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center">
                        <img src={fig.src} alt={fig.name} className={`w-full h-full object-contain ${fig.id === "NONE" ? "opacity-30" : ""}`} />
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-wider text-center leading-tight ${figure === fig.id ? "text-[#d32f2f]" : ""}`}>
                        {fig.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTION BAR: PROCEED TO CUSTOMIZE */}
          <div className={`mt-4 rounded-2xl p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-700 ${
            isReadyToCustomize 
              ? "bg-[#0a0a0a] text-white border-t-4 border-[#d32f2f] scale-100 opacity-100" 
              : "bg-gray-100 dark:bg-[#161616] text-gray-400 border-t-4 border-gray-300 dark:border-gray-800 scale-95 opacity-80"
          }`}>
            <div>
              <h3 className={`font-black text-xl mb-1 ${isReadyToCustomize ? "text-white" : "text-gray-500"}`}>¡Excelente Elección!</h3>
              <p className="text-xs text-gray-400">Pasa al siguiente paso para agregar tu texto.</p>
            </div>
            <button 
              disabled={!isReadyToCustomize}
              onClick={handleProceedToCustomize}
              className={`w-full sm:w-auto px-10 py-4 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${
                isReadyToCustomize
                  ? "bg-[#d32f2f] hover:bg-red-800 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(211,47,47,0.4)]"
                  : "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isReadyToCustomize ? "Personalizar Ahora →" : "Completa los Pasos"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default function TrophyBuilder() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/trofeos" className="hover:text-[#d32f2f] transition-colors">Trofeos Clásicos</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Constructor</span>
        </div>

        <Suspense fallback={<div className="p-20 text-center font-bold">Cargando constructor...</div>}>
          <TrophyBuilderContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
