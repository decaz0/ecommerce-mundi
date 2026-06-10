"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

type ColorType = "D" | "R" | "V" | null;
type FigureType = "F" | "V" | "PM" | "NONE" | null;
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

function CustomizeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const color = searchParams.get("color") as ColorType;
  const size = searchParams.get("size") || "11";
  const figure = searchParams.get("figure") as FigureType;
  
  const isPM = figure === "PM";

  const [lines, setLines] = useState<LineState[]>([
    { type: "TEXT", text: "Presentado a:", size: "Medium", style: "Normal" },
    { type: "TEXT", text: "NOMBRE RECEPTOR", size: "Large", style: "Bold" },
    { type: "ORNAMENT", text: "", size: "Medium", style: "Normal" },
  ]);

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [medallionPreview, setMedallionPreview] = useState<string | null>(null);
  const medallionInputRef = useRef<HTMLInputElement>(null);
  
  // Nuevos estados avanzados
  const [imageOffsetY, setImageOffsetY] = useState<number>(50);
  const [skipMedallion, setSkipMedallion] = useState<boolean>(false);
  
  // Estados del Modal
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [warningMessages, setWarningMessages] = useState<string[]>([]);

  const getProductImage = () => {
    if (!color || color === "NONE") return `/categorias/b${size}.png`;
    if (!figure || figure === "NONE") return `/categorias/${color.toLowerCase()}${size}.png`;
    return `/categorias/${color}${figure}${size}.png`;
  };

  const handleLineChange = (index: number, field: keyof LineState, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    if (field === "type" && value === "ORNAMENT") {
      newLines[index].text = "";
    }
    setLines(newLines);
    setAcceptedTerms(false);
  };

  const handleMedallionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Comprimir a JPEG con calidad 0.7 para que pese poquísimo en el carrito
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setMedallionPreview(dataUrl);
        setSkipMedallion(false);
        setImageOffsetY(50); // resetear al centro
        setAcceptedTerms(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeMedallion = () => {
    setMedallionPreview(null);
    setImageOffsetY(50);
    if (medallionInputRef.current) medallionInputRef.current.value = "";
  };

  const activeLines = lines.filter(l => l.type === "ORNAMENT" || l.text.trim().length > 0);
  
  const [termsError, setTermsError] = useState<boolean>(false);

  // Lógica inteligente de Validación
  const handleAddToCartAttempt = () => {
    setTermsError(false);
    const warnings: string[] = [];

    // Validar Texto
    if (activeLines.length === 0) {
      warnings.push("Has dejado la placa de grabado vacía. Tu reconocimiento no tendrá texto.");
    }

    // Validar Imagen Portamedallón
    if (isPM && !medallionPreview && !skipMedallion) {
      warnings.push("Elegiste un 'Victoria Portamedallón', pero no has subido una imagen ni has marcado 'Omitir'.");
    }

    // Validar Checkbox Términos (si hay algo que aceptar)
    const hasCustomization = activeLines.length > 0 || medallionPreview !== null;
    if (hasCustomization && !acceptedTerms) {
      setTermsError(true);
      return; // Detenemos aquí para obligar visualmente al usuario a marcar la casilla
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
      type: "Trofeo Clásico",
      details: `TR-${color || "X"}${figure || "X"}${size}`,
      price: size === "11" ? 100 : 130,
      image: getProductImage(),
      customization: lines.map(l => l.type === "ORNAMENT" ? "[Ornamenta]" : l.text).filter(t => t.trim().length > 0),
      medallionImage: skipMedallion ? null : medallionPreview,
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  // Mapeo SVG Font Size
  const getSvgFontSize = (sz: FontSize) => {
    switch (sz) {
      case "Large": return "90";
      case "Small": return "40";
      case "Medium": default: return "65";
    }
  };

  // Mapeo CSS Font Style
  const getFontStyleClass = (st: FontStyle) => {
    switch (st) {
      case "Bold": return "font-black font-sans"; 
      case "Italic": return "font-serif italic";
      case "Normal": default: return "font-serif";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      {/* IZQUIERDA: Trofeo */}
      <div className="w-full lg:w-[35%]">
        <div className="sticky top-24 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 flex items-center justify-center aspect-[3/4] overflow-hidden relative">
          <img 
            src={getProductImage()} 
            alt="Trofeo Configurado" 
            className="w-full h-full object-contain drop-shadow-2xl relative z-10"
          />
        </div>
      </div>

      {/* DERECHA: Editor y Placa */}
      <div className="w-full lg:w-[65%] flex flex-col gap-8 pb-20">
        
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Personalización Avanzada</h1>
          <p className="text-gray-500 mb-8">Reemplaza el texto sugerido o elige una ornamenta gráfica. Todo se reflejará en tu placa.</p>
          
          <div className="flex flex-col gap-12">
            
            {/* Visualización de la Placa Estática + Medalla a la par */}
            <div className="w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-center gap-8">
                
                {/* Medallón Visualizador a la par */}
                {isPM && medallionPreview && !skipMedallion && (
                  <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] rounded-full p-[3px] shadow-[0_5px_15px_rgba(0,0,0,0.4)] overflow-hidden">
                      <img 
                        src={medallionPreview} 
                        alt="Medalla Circular" 
                        className="w-full h-full object-cover rounded-full mix-blend-multiply opacity-90 shadow-inner"
                        style={{ objectPosition: `center ${imageOffsetY}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tu Medalla</span>
                  </div>
                )}

                {/* Placa Dorada Estática y Ancha */}
                <div className="flex-1 w-full max-w-[500px] h-[130px] bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] border-2 border-[#fff7c2] shadow-[0_10px_30px_rgba(179,135,40,0.4)] rounded-sm p-3 flex flex-col items-center justify-center gap-0 overflow-hidden">
                  {activeLines.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-black/20 font-bold text-lg uppercase tracking-widest text-center">
                      Vista Previa de Placa
                    </div>
                  )}

                  {activeLines.map((line, idx) => (
                    <div key={idx} className="w-full flex-1 flex items-center justify-center overflow-hidden min-h-0">
                      {line.type === "ORNAMENT" ? (
                        <div className="text-black flex items-center justify-center h-full text-2xl md:text-3xl lg:text-4xl">
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
              <div className="text-sm font-bold text-[#d32f2f] uppercase border-b pb-2">1. Grabado (3 Líneas Máximo)</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* MÓDULO EXTRA: PORTAMEDALLÓN */}
          {isPM && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-sm font-bold text-[#d32f2f] uppercase mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>2. Imagen para Medalla Superior</span>
                  <span className="bg-[#d32f2f] text-white text-[10px] px-2 py-0.5 rounded-full">Exclusivo</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 transition-colors">
                  <input type="checkbox" checked={skipMedallion} onChange={(e) => {
                    setSkipMedallion(e.target.checked);
                    if (e.target.checked) setMedallionPreview(null);
                  }} className="text-[#d32f2f] focus:ring-[#d32f2f]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Omitir Imagen</span>
                </label>
              </div>
              
              {!skipMedallion && (
                <>
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
                    <h3 className="text-sm font-black text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mb-1">⚠️ CALIDAD Y ENCUADRE DE IMAGEN</h3>
                    <p className="text-xs text-yellow-700 dark:text-yellow-600">Sube cualquier archivo JPG o PNG. Usa la barra deslizante para enfocar la parte exacta de tu foto en el círculo. Eres 100% responsable del recorte y la calidad.</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {!medallionPreview ? (
                      <div className="w-full md:w-1/2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => medallionInputRef.current?.click()}>
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300 mb-3 flex items-center justify-center text-gray-400">+</div>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Subir foto (JPG/PNG)</span>
                        <input type="file" accept=".png,.jpg,.jpeg" className="hidden" ref={medallionInputRef} onChange={handleMedallionUpload} />
                      </div>
                    ) : (
                      <div className="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-[#1a1a1a]">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] rounded-full p-1 shadow-lg shrink-0">
                            <img src={medallionPreview} alt="Medalla" className="w-full h-full object-cover rounded-full shadow-inner" style={{ objectPosition: `center ${imageOffsetY}%` }} />
                          </div>
                          <div className="flex flex-col">
                            <span className="block text-sm font-bold text-green-600 uppercase tracking-widest">Encuadre Manual</span>
                            <span className="block text-xs text-gray-500 mt-1 mb-2">Desliza para centrar tu foto</span>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={imageOffsetY} 
                              onChange={(e) => setImageOffsetY(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#d32f2f]"
                            />
                          </div>
                        </div>
                        <button onClick={removeMedallion} className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline px-4 py-2 border border-red-200 rounded-lg shrink-0">Cambiar Foto</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* VALIDACIÓN Y CARRITO */}
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl flex flex-col gap-6">
          
          {/* GARANTÍA */}
          <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
            termsError 
              ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 animate-[shake_0.5s_ease-in-out]" 
              : "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30"
          }`}>
            <input 
              type="checkbox" 
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked) setTermsError(false);
              }}
              className={`mt-1 w-6 h-6 rounded cursor-pointer ${termsError ? "outline outline-2 outline-red-500 outline-offset-2" : "text-[#d32f2f] border-gray-300"}`}
            />
            <div>
              <p className={`font-bold text-sm ${termsError ? "text-red-600 dark:text-red-400" : "text-[#d32f2f]"}`}>
                GARANTÍA DE GRABADO Y CALIDAD
              </p>
              <p className={`text-xs mt-1 leading-relaxed ${termsError ? "text-red-600/80 dark:text-red-400/80 font-bold" : "text-gray-600 dark:text-gray-400"}`}>
                Revisa exhaustivamente que toda la ortografía del texto sea correcta. 
                {isPM && !skipMedallion && <strong> Adicionalmente, confirmo que he revisado el encuadre circular con el slider y la calidad de la foto.</strong>}
                {" "}Los cambios no se pueden hacer una vez se realiza la orden. La empresa no se hace responsable por información mal escrita o fotografías de baja resolución.
              </p>
              {termsError && (
                <p className="text-xs font-black text-red-600 dark:text-red-400 mt-2 flex items-center gap-1 uppercase tracking-widest">
                  <span>⚠️</span> Debes marcar esta casilla para continuar
                </p>
              )}
            </div>
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
  );
}

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="p-20 text-center font-bold animate-pulse">Cargando personalizador...</div>}>
          <CustomizeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
