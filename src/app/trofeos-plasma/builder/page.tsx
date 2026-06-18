"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CanvasEditor, { CanvasElement } from "../../../components/CanvasEditor";

interface BulkRow {
  id: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
}

type PersonalizationType = "NONE" | "SAME" | "DIFFERENT";

const TEMPLATES = [
  { id: "vacio", name: "Plantilla en Blanco", texts: ["", "", "", ""] },
  { id: "deportivo", name: "Campeonato Deportivo", texts: ["CAMPEONATO", "PRIMER LUGAR", "GOLEADOR", "2026"] },
  { id: "academico", name: "Excelencia Académica", texts: ["PREMIO A LA", "EXCELENCIA", "MEJOR PROMEDIO", "PROMO 2026"] },
  { id: "corporativo", name: "Reconocimiento Corporativo", texts: ["EMPRESA S.A.", "EMPLEADO DEL MES", "DEDICACIÓN", "JULIO 2026"] },
];

function TrofeoPlasmaBuilderContent() {
  const router = useRouter();

  // Plantilla Base (Diseño Maestro)
  const [elements, setElements] = useState<CanvasElement[]>([
    { id: "text-1", type: "text", text: "CAMPEONATO", x: 150, y: 15, width: 250, height: 25, zIndex: 2, fontSize: 16, isCurved: false, fontFamily: 'serif', fontStyle: 'Normal' },
    { id: "text-2", type: "text", text: "PRIMER LUGAR", x: 100, y: 45, width: 350, height: 40, zIndex: 3, fontSize: 24, isCurved: false, fontFamily: 'serif', fontStyle: 'Bold' },
    { id: "text-3", type: "text", text: "GOLEADOR", x: 150, y: 90, width: 250, height: 30, zIndex: 4, fontSize: 18, isCurved: false, fontFamily: 'serif', fontStyle: 'Italic' },
    { id: "text-4", type: "text", text: "2026", x: 200, y: 125, width: 150, height: 30, zIndex: 5, fontSize: 16, isCurved: false, fontFamily: 'serif', fontStyle: 'Normal' },
    { id: "image-1", type: "image", src: "", x: 20, y: 20, width: 60, height: 60, zIndex: 1 }
  ]);
  
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Producción Masiva (B2B)
  const [personalizationType, setPersonalizationType] = useState<PersonalizationType>("SAME");
  const [quantity, setQuantity] = useState<number>(1);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([{ id: "1", line1: "CAMPEONATO", line2: "PRIMER LUGAR", line3: "GOLEADOR", line4: "2026" }]);

  useEffect(() => {
    if (quantity > bulkRows.length) {
      const newRows = [...bulkRows];
      for (let i = bulkRows.length; i < quantity; i++) {
        newRows.push({ id: (i + 1).toString(), line1: "", line2: "", line3: "", line4: "" });
      }
      setBulkRows(newRows);
    } else if (quantity < bulkRows.length) {
      setBulkRows(bulkRows.slice(0, quantity));
    }
  }, [quantity]);

  const applyTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    
    setElements(elements.map(el => {
      if (el.id === "text-1") return { ...el, text: tpl.texts[0] };
      if (el.id === "text-2") return { ...el, text: tpl.texts[1] };
      if (el.id === "text-3") return { ...el, text: tpl.texts[2] };
      if (el.id === "text-4") return { ...el, text: tpl.texts[3] };
      return el;
    }));

    const newRows = [...bulkRows];
    newRows[0] = { ...newRows[0], line1: tpl.texts[0], line2: tpl.texts[1], line3: tpl.texts[2], line4: tpl.texts[3] };
    setBulkRows(newRows);
  };

  const handleUpdateTemplate = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        if (updates.text && updates.text.length > 15) return el;
        return { ...el, ...updates };
      }
      return el;
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdateTemplate("image-1", { src: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMasterChange = (field: "text-1" | "text-2" | "text-3" | "text-4", value: string) => {
    if (value.length > 15) return;
    handleUpdateTemplate(field, { text: value });
    
    if (personalizationType === "SAME") {
      const newRows = [...bulkRows];
      const keyMap: Record<string, keyof BulkRow> = {
        "text-1": "line1",
        "text-2": "line2",
        "text-3": "line3",
        "text-4": "line4"
      };
      newRows[0] = { ...newRows[0], [keyMap[field]]: value };
      setBulkRows(newRows);
    }
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
      ? bulkRows.map(() => ({ color: "Dorado", lines: ["", "", "", ""] }))
      : personalizationType === "SAME"
      ? bulkRows.map(() => ({ color: "Dorado", lines: [bulkRows[0].line1, bulkRows[0].line2, bulkRows[0].line3, bulkRows[0].line4] }))
      : bulkRows.map(row => ({ color: "Dorado", lines: [row.line1, row.line2, row.line3, row.line4] }));

    const cartItem = {
      id: Date.now().toString(),
      type: "Trofeo Plasma",
      details: `Diseño Estelar Fútbol Lote x${quantity}`,
      price: 250,
      quantity: quantity,
      image: "/categorias/trofeo plasma.png",
      canvasElements: elements,
      customization: [],
      variations: variations,
      personalizationType
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const masterLine1 = elements.find(el => el.id === "text-1")?.text || "";
  const masterLine2 = elements.find(el => el.id === "text-2")?.text || "";
  const masterLine3 = elements.find(el => el.id === "text-3")?.text || "";
  const masterLine4 = elements.find(el => el.id === "text-4")?.text || "";

  const StaticPlasmaPlaque = ({ line1, line2, line3, line4 }: { line1: string, line2: string, line3: string, line4: string }) => {
    const computedElements = elements.map(el => {
      if (el.id === "text-1") return { ...el, text: line1 };
      if (el.id === "text-2") return { ...el, text: line2 };
      if (el.id === "text-3") return { ...el, text: line3 };
      if (el.id === "text-4") return { ...el, text: line4 };
      return el;
    });

    return (
      <div className="relative w-64 h-24 flex items-center justify-center">
        <div className="w-[240px] h-[78px] rounded-sm border border-[#b38728]/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden relative bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728]">
          <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(calc(240 / 550))' }}>
            <CanvasEditor 
              elements={computedElements}
              onChange={() => {}}
              selectedId={null}
              onSelect={() => {}}
              width={550}
              height={180}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 relative pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IZQUIERDA: DISEÑO MAESTRO Y LISTA B2B */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f]">1. Diseño Maestro: Placa Plasma</h2>
                <p className="text-gray-500 text-sm">Crea la plantilla base para tu lote de trofeos.</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl mb-8 border border-gray-200 dark:border-gray-800">
              <span className="text-sm font-bold uppercase text-gray-500">Usar Plantilla Rápida:</span>
              <select onChange={(e) => applyTemplate(e.target.value)} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-sm font-bold outline-none">
                <option value="">Selecciona una opción...</option>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <button onClick={() => fileInputRef.current?.click()} className="py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs rounded-xl hover:scale-105 transition-transform w-full">
                  Subir Logo PNG
                </button>
                <input type="file" accept="image/png" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3 mt-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <span>Línea 1 (Máx 15)</span>
                      <span className={masterLine1.length === 15 ? 'text-red-500' : ''}>{masterLine1.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine1} onChange={(e) => handleMasterChange("text-1", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <span>Línea 2 (Máx 15)</span>
                      <span className={masterLine2.length === 15 ? 'text-red-500' : ''}>{masterLine2.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine2} onChange={(e) => handleMasterChange("text-2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <span>Línea 3 (Máx 15)</span>
                      <span className={masterLine3.length === 15 ? 'text-red-500' : ''}>{masterLine3.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine3} onChange={(e) => handleMasterChange("text-3", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <span>Línea 4 (Máx 15)</span>
                      <span className={masterLine4.length === 15 ? 'text-red-500' : ''}>{masterLine4.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine4} onChange={(e) => handleMasterChange("text-4", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="relative shadow-[0_20px_50px_rgba(179,135,40,0.4)] border-2 border-[#fff7c2] rounded-sm overflow-hidden bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] w-[280px] h-[91px] mx-auto">
                  <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(calc(280 / 550))' }}>
                    <CanvasEditor elements={elements} onChange={() => {}} selectedId={null} onSelect={() => {}} width={550} height={180} readOnly={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f]">2. Personalización B2B</h2>
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
                    <input type="text" maxLength={15} value={bulkRows[0].line2} onChange={(e) => handleBulkChange(0, "line2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 3 (Máx 15)</label>
                    <input type="text" maxLength={15} value={bulkRows[0].line3} onChange={(e) => handleBulkChange(0, "line3", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 4 (Máx 15)</label>
                    <input type="text" maxLength={15} value={bulkRows[0].line4} onChange={(e) => handleBulkChange(0, "line4", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h4 className="text-[10px] font-black uppercase text-[#d32f2f]">Muestra</h4>
                  <StaticPlasmaPlaque line1={bulkRows[0].line1} line2={bulkRows[0].line2} line3={bulkRows[0].line3} line4={bulkRows[0].line4} />
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

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea 4</label>
                          <input type="text" maxLength={15} value={row.line4} onChange={(e) => handleBulkChange(idx, "line4", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                        </div>
                        {idx === 0 && <button onClick={() => copyToAll("line4")} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-[10px] font-bold uppercase px-3 py-2 rounded self-end h-[38px]">Repetir</button>}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <h4 className="text-[10px] font-black uppercase text-[#d32f2f]">Muestra</h4>
                      <StaticPlasmaPlaque line1={row.line1} line2={row.line2} line3={row.line3} line4={row.line4} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DERECHA: SIDEBAR DE ORDEN */}
        <div className="w-full lg:col-span-1">
          <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24 shadow-xl">
             <h3 className="font-black text-xl mb-6 text-[#d32f2f] uppercase tracking-tight">Detalles de Orden</h3>
             
             <div className="relative h-64 w-full flex items-center justify-center mb-6">
               <img src="/categorias/trofeo plasma.png" className="h-full w-auto object-contain drop-shadow-2xl" alt="Trofeo Plasma" />
             </div>

             <div className="flex flex-col gap-4 mb-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">1. Modelo:</span>
                  <div className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded p-3 font-bold text-sm">Trofeo Plasma (Fútbol)</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">2. Cantidad Total:</span>
                  <input type="number" min="1" max="5000" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-center font-black outline-none" />
                </div>
             </div>

             <div className="text-right border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                <div className="text-xs font-bold text-gray-500 uppercase">Subtotal</div>
                <div className="text-4xl font-black text-[#d32f2f]">Q{(250 * quantity).toFixed(2)}</div>
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

export default function TrofeosPlasmaBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/trofeos-plasma" className="hover:text-[#d32f2f] transition-colors">Trofeos de Plasma</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador B2B</span>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-[#d32f2f] p-4 mb-8 rounded-r-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#d32f2f] font-black uppercase text-sm">Flujo de Producción B2B</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Escoge un diseño maestro de la placa y decide si vas a grabar el mismo texto en las placas base o un texto diferente para cada unidad.</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center font-bold text-gray-500">Cargando personalizador...</div>}>
          <TrofeoPlasmaBuilderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
