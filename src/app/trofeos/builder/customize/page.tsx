"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import CanvasEditor, { CanvasElement } from "../../../../components/CanvasEditor";

type ColorType = "D" | "R" | "V" | "NONE";
type FigureType = "F" | "V" | "PM" | "NONE";

interface BulkRow {
  id: string;
  line1: string;
  line2: string;
  line3: string;
}

type PersonalizationType = "NONE" | "SAME" | "DIFFERENT";

const TEMPLATES = [
  { id: "vacio", name: "Plantilla en Blanco", texts: ["", "", ""] },
  { id: "deportivo", name: "Campeonato Deportivo", texts: ["1ER LUGAR", "CAMPEONATO", "2026"] },
  { id: "academico", name: "Excelencia Académica", texts: ["EXCELENCIA", "ACADÉMICA", "PROMO 2026"] },
  { id: "corporativo", name: "Reconocimiento Corporativo", texts: ["EMPLEADO", "DEL MES", "VENTAS"] },
];

function CustomizeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const color = (searchParams.get("color") || "D") as ColorType;
  const size = searchParams.get("size") || "11";
  const figure = (searchParams.get("figure") || "PM") as FigureType;
  
  const isPM = figure === "PM";

  // Medallion Canvas State (Diseño Maestro del Medallón)
  const [medallionElements, setMedallionElements] = useState<CanvasElement[]>([
    { id: "medal-text-1", type: "text", text: "TORNEO", x: 60, y: 30, width: 180, height: 40, zIndex: 2, fontSize: 24, isCurved: false, fontStyle: 'Bold', color: '#ffffff' },
    { id: "medal-text-2", type: "text", text: "2026", x: 60, y: 230, width: 180, height: 40, zIndex: 3, fontSize: 24, isCurved: false, fontStyle: 'Bold', color: '#ffffff' },
    { id: "medal-image-1", type: "image", src: "", x: 100, y: 100, width: 100, height: 100, zIndex: 1 }
  ]);
  const [skipMedallion, setSkipMedallion] = useState<boolean>(false);
  const medallionFileInputRef = useRef<HTMLInputElement>(null);

  // Plaque & B2B State
  const [personalizationType, setPersonalizationType] = useState<PersonalizationType>("SAME");
  const [quantity, setQuantity] = useState<number>(1);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([{ id: "1", line1: "1ER LUGAR", line2: "CAMPEONATO", line3: "2026" }]);
  
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  useEffect(() => {
    if (quantity > bulkRows.length) {
      const newRows = [...bulkRows];
      for (let i = bulkRows.length; i < quantity; i++) {
        newRows.push({ id: (i + 1).toString(), line1: "", line2: "", line3: "" });
      }
      setBulkRows(newRows);
    } else if (quantity < bulkRows.length) {
      setBulkRows(bulkRows.slice(0, quantity));
    }
  }, [quantity]);

  const getProductImage = () => {
    if (!color || color === "NONE") return `/categorias/b${size}.png`;
    if (!figure || figure === "NONE") return `/categorias/${color.toLowerCase()}${size}.png`;
    return `/categorias/${color}${figure}${size}.png`;
  };

  const applyTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    const newRows = [...bulkRows];
    newRows[0] = { ...newRows[0], line1: tpl.texts[0], line2: tpl.texts[1], line3: tpl.texts[2] };
    setBulkRows(newRows);
  };

  const handleUpdateMedallion = (id: string, updates: Partial<CanvasElement>) => {
    setMedallionElements(medallionElements.map(el => {
      if (el.id === id) {
        if (updates.text && updates.text.length > 15) return el;
        return { ...el, ...updates };
      }
      return el;
    }));
  };

  const handleBulkChange = (index: number, field: keyof BulkRow, value: string) => {
    if (value.length > 15) return;
    const newRows = [...bulkRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setBulkRows(newRows);
  };

  const copyToAll = (field: keyof BulkRow) => {
    const firstValue = bulkRows[0][field];
    setBulkRows(bulkRows.map(row => ({ ...row, [field]: firstValue })));
  };

  const handleAddToCart = () => {
    if (!acceptedTerms) {
      alert("Por favor, acepta la garantía marcando la casilla antes de continuar.");
      return;
    }

    const variations = personalizationType === "NONE" 
      ? bulkRows.map(() => ({ color: color === "D" ? "Dorado" : color === "R" ? "Rojo" : "Verde", size, lines: ["", "", ""] }))
      : personalizationType === "SAME"
      ? bulkRows.map(() => ({ color: color === "D" ? "Dorado" : color === "R" ? "Rojo" : "Verde", size, lines: [bulkRows[0].line1, bulkRows[0].line2, bulkRows[0].line3] }))
      : bulkRows.map(row => ({ color: color === "D" ? "Dorado" : color === "R" ? "Rojo" : "Verde", size, lines: [row.line1, row.line2, row.line3] }));

    const basePrice = size === "11" ? 100 : 130;

    const cartItem = {
      id: Date.now().toString(),
      type: "Trofeo Clásico",
      details: `TR-${color}${figure}${size} Lote x${quantity}`,
      price: basePrice,
      quantity: quantity,
      image: getProductImage(),
      customization: [],
      variations: variations,
      plaqueCanvas: [], 
      medallionCanvas: skipMedallion ? [] : medallionElements,
      personalizationType
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const masterMedallionLine1 = medallionElements.find(el => el.id === "medal-text-1")?.text || "";
  const masterMedallionLine2 = medallionElements.find(el => el.id === "medal-text-2")?.text || "";

  const StaticPlaque = ({ line1, line2, line3 }: { line1: string, line2: string, line3: string }) => (
    <div className="relative border-2 border-[#fff7c2] rounded-sm overflow-hidden shadow-[0_10px_30px_rgba(179,135,40,0.3)] bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] w-[300px] h-[90px] flex flex-col items-center justify-center p-2 text-center text-black" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
      <div className="text-sm font-normal uppercase leading-tight break-words whitespace-normal w-full px-1">{line1}</div>
      <div className="text-lg font-bold uppercase leading-tight break-words whitespace-normal w-full mt-1 mb-1 px-1">{line2}</div>
      <div className="text-sm font-serif italic leading-tight break-words whitespace-normal w-full px-1">{line3}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 relative pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IZQUIERDA: DISEÑO MAESTRO Y B2B */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {isPM && (
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f]">1. Diseño de Portamedallón</h2>
                  <p className="text-gray-500 text-sm">El medallón será idéntico para todos los trofeos del lote.</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={skipMedallion} onChange={(e) => setSkipMedallion(e.target.checked)} className="w-4 h-4 text-[#d32f2f] rounded" />
                  Omitir Medallón
                </label>
              </div>

              {!skipMedallion && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <button onClick={() => medallionFileInputRef.current?.click()} className="py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs rounded-xl hover:scale-105 transition-transform w-full">
                      Subir Logo del Medallón
                    </button>
                    <input type="file" accept="image/*" className="hidden" ref={medallionFileInputRef} onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => handleUpdateMedallion("medal-image-1", { src: ev.target?.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} />

                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3 mt-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                          <span>Texto Superior (Máx 15)</span>
                          <span className={masterMedallionLine1.length === 15 ? 'text-red-500' : ''}>{masterMedallionLine1.length}/15</span>
                        </div>
                        <input type="text" maxLength={15} value={masterMedallionLine1} onChange={(e) => handleUpdateMedallion("medal-text-1", { text: e.target.value })} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                          <span>Texto Inferior (Máx 15)</span>
                          <span className={masterMedallionLine2.length === 15 ? 'text-red-500' : ''}>{masterMedallionLine2.length}/15</span>
                        </div>
                        <input type="text" maxLength={15} value={masterMedallionLine2} onChange={(e) => handleUpdateMedallion("medal-text-2", { text: e.target.value })} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="w-[300px] h-[300px] rounded-full border-2 border-gray-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden relative bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#3a3a3a]">
                      <CanvasEditor elements={medallionElements} onChange={() => {}} selectedId={null} onSelect={() => {}} width={300} height={300} readOnly={true} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f]">{isPM ? "2" : "1"}. Personalización de Placa Base</h2>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl mb-8 border border-gray-200 dark:border-gray-800">
              <span className="text-sm font-bold uppercase text-gray-500">Usar Plantilla Rápida:</span>
              <select onChange={(e) => applyTemplate(e.target.value)} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-sm font-bold outline-none">
                <option value="">Selecciona una opción...</option>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row mb-8 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <button onClick={() => setPersonalizationType("NONE")} className={`flex-1 py-3 px-4 text-xs font-bold uppercase transition-colors ${personalizationType === "NONE" ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-b-2 border-[#d32f2f]" : "bg-white dark:bg-[#111] text-gray-500 hover:bg-gray-50"}`}>
                Sin Grabado
              </button>
              <button onClick={() => setPersonalizationType("SAME")} className={`flex-1 py-3 px-4 text-xs font-bold uppercase transition-colors border-l border-r border-gray-200 dark:border-gray-800 ${personalizationType === "SAME" ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-b-2 border-[#d32f2f]" : "bg-white dark:bg-[#111] text-gray-500 hover:bg-gray-50"}`}>
                Mismo Texto
              </button>
              <button onClick={() => setPersonalizationType("DIFFERENT")} className={`flex-1 py-3 px-4 text-xs font-bold uppercase transition-colors ${personalizationType === "DIFFERENT" ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-b-2 border-[#d32f2f]" : "bg-white dark:bg-[#111] text-gray-500 hover:bg-gray-50"}`}>
                Texto Diferente
              </button>
            </div>

            {personalizationType === "NONE" && (
              <div className="p-8 text-center bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Se enviarán los trofeos con la placa en blanco para tu propia personalización.</p>
              </div>
            )}

            {personalizationType === "SAME" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 1 (Máx 15)</label>
                    <input type="text" maxLength={15} value={bulkRows[0].line1} onChange={(e) => handleBulkChange(0, "line1", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 2 (Máx 15)</label>
                    <input type="text" maxLength={15} value={bulkRows[0].line2} onChange={(e) => handleBulkChange(0, "line2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 3 (Máx 15)</label>
                    <input type="text" maxLength={15} value={bulkRows[0].line3} onChange={(e) => handleBulkChange(0, "line3", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none font-bold" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h4 className="text-[10px] font-black uppercase text-[#d32f2f]">Muestra</h4>
                  <StaticPlaque line1={bulkRows[0].line1} line2={bulkRows[0].line2} line3={bulkRows[0].line3} />
                </div>
              </div>
            )}

            {personalizationType === "DIFFERENT" && (
              <div className="flex flex-col gap-6">
                {bulkRows.map((row, idx) => (
                  <div key={row.id} className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-sm font-black uppercase text-[#d32f2f] mb-2">Placa {idx + 1}</h4>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 1</label>
                          <input type="text" maxLength={15} value={row.line1} onChange={(e) => handleBulkChange(idx, "line1", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                        </div>
                        {idx === 0 && <button onClick={() => copyToAll("line1")} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-[10px] font-bold uppercase px-3 py-2 rounded self-end h-[38px]">Repetir</button>}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 2</label>
                          <input type="text" maxLength={15} value={row.line2} onChange={(e) => handleBulkChange(idx, "line2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none font-bold" />
                        </div>
                        {idx === 0 && <button onClick={() => copyToAll("line2")} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-[10px] font-bold uppercase px-3 py-2 rounded self-end h-[38px]">Repetir</button>}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 3</label>
                          <input type="text" maxLength={15} value={row.line3} onChange={(e) => handleBulkChange(idx, "line3", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none font-bold" />
                        </div>
                        {idx === 0 && <button onClick={() => copyToAll("line3")} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-[10px] font-bold uppercase px-3 py-2 rounded self-end h-[38px]">Repetir</button>}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <h4 className="text-[10px] font-black uppercase text-[#d32f2f]">Muestra</h4>
                      <StaticPlaque line1={row.line1} line2={row.line2} line3={row.line3} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DERECHA: SIDEBAR DE ORDEN */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24 shadow-xl">
             <h3 className="font-black text-xl mb-6 text-[#d32f2f] uppercase tracking-tight">Detalles de Orden</h3>
             
             <div className="relative h-64 w-full flex items-center justify-center mb-6">
                <img src={getProductImage()} className="h-full w-auto object-contain drop-shadow-2xl" alt="Trofeo" />
             </div>

             <div className="flex flex-col gap-4 mb-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">1. Modelo:</span>
                  <div className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded p-3 font-bold text-sm">TR-{color}{figure}{size}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">2. Cantidad Total:</span>
                  <input type="number" min="1" max="5000" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-center font-black outline-none" />
                </div>
             </div>

             <div className="text-right border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                <div className="text-xs font-bold text-gray-500 uppercase">Subtotal</div>
                <div className="text-4xl font-black text-[#d32f2f]">Q{((size === "11" ? 100 : 130) * quantity).toFixed(2)}</div>
             </div>
             
             <div className="flex items-start gap-3 mb-6 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl">
                <input type="checkbox" id="terms_side" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-5 h-5 accent-[#d32f2f]" />
                <label htmlFor="terms_side" className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-black dark:text-white uppercase">Garantía Crown:</span> Confirmo el diseño, colores y la revisión ortográfica.
                </label>
             </div>
             
             <button onClick={handleAddToCart} disabled={!acceptedTerms} className="w-full py-4 bg-[#d32f2f] hover:bg-red-700 disabled:bg-gray-400 text-white font-black uppercase rounded-xl transition-all shadow-lg hover:scale-105">
                Añadir al Carrito
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrofeosCustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/trofeos" className="hover:text-[#d32f2f] transition-colors">Trofeos Clásicos</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador B2B</span>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-[#d32f2f] p-4 mb-8 rounded-r-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#d32f2f] font-black uppercase text-sm">Flujo de Producción B2B</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Escoge un diseño de medallón (si aplica) y decide si vas a grabar el mismo texto en las placas base o un texto diferente para cada unidad.</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center font-bold text-gray-500">Cargando personalizador...</div>}>
          <CustomizeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
