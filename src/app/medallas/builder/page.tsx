"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CanvasEditor, { CanvasElement } from "../../../components/CanvasEditor";

type MedalColor = "Oro" | "Plata" | "Bronce";
type RibbonColor = "Rojo" | "Azul" | "Blanco" | "Nacional" | "Negro";

interface BulkRow {
  id: string;
  line1: string;
  line2: string;
  line3: string;
}

type PersonalizationType = "NONE" | "SAME" | "DIFFERENT";

const TEMPLATES = [
  { id: "vacio", name: "Plantilla en Blanco", texts: ["", "", ""] },
  { id: "deportivo", name: "Campeonato Deportivo", texts: ["PRIMER LUGAR", "CAMPEONATO", "2026"] },
  { id: "academico", name: "Excelencia Académica", texts: ["EXCELENCIA", "ACADÉMICA", "PROMO 2026"] },
  { id: "corporativo", name: "Reconocimiento Corporativo", texts: ["EMPLEADO", "DEL MES", "VENTAS"] },
];

function MedallasBuilderContent() {
  const router = useRouter();

  const [color, setColor] = useState<MedalColor>("Oro");
  const [ribbon, setRibbon] = useState<RibbonColor>("Rojo");

  // Plantilla Base (Diseño Maestro)
  const [elements, setElements] = useState<CanvasElement[]>([
    { id: "text-1", type: "text", text: "PRIMER LUGAR", x: 60, y: 30, width: 180, height: 40, zIndex: 2, fontSize: 28, isCurved: false, fontStyle: 'Bold', color: '#000000' },
    { id: "text-2", type: "text", text: "CAMPEONATO", x: 60, y: 180, width: 180, height: 40, zIndex: 3, fontSize: 24, isCurved: false, fontStyle: 'Bold', color: '#000000' },
    { id: "text-3", type: "text", text: "2026", x: 60, y: 230, width: 180, height: 40, zIndex: 4, fontSize: 28, isCurved: false, fontStyle: 'Bold', color: '#000000' },
    { id: "image-1", type: "image", src: "", x: 100, y: 80, width: 100, height: 100, zIndex: 1 }
  ]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Producción Masiva (B2B)
  const [personalizationType, setPersonalizationType] = useState<PersonalizationType>("SAME");
  const [quantity, setQuantity] = useState<number>(12);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([{ id: "1", line1: "PRIMER LUGAR", line2: "CAMPEONATO", line3: "2026" }]);

  // Modo Vista Previa
  const [previewRowId, setPreviewRowId] = useState<string | null>(null);

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

  const applyTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    
    setElements(elements.map(el => {
      if (el.id === "text-1") return { ...el, text: tpl.texts[0] };
      if (el.id === "text-2") return { ...el, text: tpl.texts[1] };
      if (el.id === "text-3") return { ...el, text: tpl.texts[2] };
      return el;
    }));

    const newRows = [...bulkRows];
    newRows[0] = { ...newRows[0], line1: tpl.texts[0], line2: tpl.texts[1], line3: tpl.texts[2] };
    setBulkRows(newRows);
    setPreviewRowId(null);
  };

  const handleMasterChange = (field: "text-1" | "text-2" | "text-3", value: string) => {
    if (value.length > 15) return;
    handleUpdateTemplate(field, { text: value });
    setPreviewRowId(null);
    
    if (personalizationType === "SAME") {
      const newRows = [...bulkRows];
      const keyMap: Record<string, keyof BulkRow> = {
        "text-1": "line1",
        "text-2": "line2",
        "text-3": "line3"
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

    if (previewRowId === newRows[index].id) {
       const fieldIdMap: Record<string, string> = { "line1": "text-1", "line2": "text-2", "line3": "text-3" };
       handleUpdateTemplate(fieldIdMap[field], { text: value });
    }
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
      ? bulkRows.map(() => ({ color, ribbon, lines: ["", "", ""] }))
      : personalizationType === "SAME"
      ? bulkRows.map(() => ({ color, ribbon, lines: [bulkRows[0].line1, bulkRows[0].line2, bulkRows[0].line3] }))
      : bulkRows.map(row => ({ color, ribbon, lines: [row.line1, row.line2, row.line3] }));

    const cartItem = {
      id: Date.now().toString(),
      type: "Medalla Personalizada (Lote B2B)",
      details: `Medalla ${color} 50mm con cinta ${ribbon} Lote x${quantity}`,
      price: 150,
      quantity: quantity,
      image: `/categorias/medalla${color === "Oro" ? "" : color === "Plata" ? " bronce" : " bronce"}.png`, // Note: " plata" fix needed
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

  const viewRowInMaster = (row: BulkRow) => {
    setPreviewRowId(row.id);
    setElements(elements.map(el => {
      if (el.id === "text-1") return { ...el, text: row.line1 };
      if (el.id === "text-2") return { ...el, text: row.line2 };
      if (el.id === "text-3") return { ...el, text: row.line3 };
      return el;
    }));
  };

  const medalImageSrc = `/categorias/medalla${color === "Oro" ? "" : color === "Plata" ? " plata" : " bronce"}.png`;

  const StaticMedal = ({ line1, line2, line3 }: { line1: string, line2: string, line3: string }) => {
    let computedElements = elements.map(el => {
      if (el.id === "text-1") return { ...el, text: line1 };
      if (el.id === "text-2") return { ...el, text: line2 };
      if (el.id === "text-3") return { ...el, text: line3 };
      return el;
    });

    // Auto-layout para abarcar más espacio si solo se llena 1 línea
    const textElements = computedElements.filter(el => el.type === "text" && el.text);
    if (textElements.length === 1) {
      const textEl = textElements[0];
      const newHeight = textEl.height * 1.5;
      computedElements = computedElements.map(el => 
        el.id === textEl.id 
        ? { ...el, y: 150 - (newHeight / 2), height: newHeight, fontSize: (el.fontSize || 24) * 1.5, width: 260, x: 20 } 
        : el
      );
    }

    return (
      <div className="relative w-[150px] h-[150px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[120px] h-[120px] rounded border border-yellow-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] overflow-hidden relative bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728]">
            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(calc(120 / 300))' }}>
              <CanvasEditor elements={computedElements} onChange={() => {}} selectedId={null} onSelect={() => {}} width={300} height={300} readOnly={true} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const masterLine1 = elements.find(el => el.id === "text-1")?.text || "";
  const masterLine2 = elements.find(el => el.id === "text-2")?.text || "";
  const masterLine3 = elements.find(el => el.id === "text-3")?.text || "";

  return (
    <div className="flex flex-col gap-8 relative pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f] flex items-center gap-3">
                  1. Diseño Maestro: Lámina
                  {previewRowId && <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-bold shadow-sm">Viendo Fila {previewRowId}</span>}
                </h2>
                <p className="text-gray-500 text-sm mt-1">Organiza, mueve y agranda libremente los textos y el logo sobre la lámina central dorada.</p>
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
                  Subir Logo del Torneo
                </button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1 items-center">
                      <span className="flex items-center gap-2">
                        Línea 1
                        <select 
                          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded px-1 outline-none ml-2"
                          value={elements.find(el => el.id === "text-1")?.fontStyle || 'Normal'}
                          onChange={(e) => handleUpdateTemplate("text-1", { fontStyle: e.target.value as any })}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Bold">Negrita</option>
                          <option value="Italic">Cursiva</option>
                        </select>
                      </span>
                      <span className={masterLine1.length === 15 ? 'text-red-500' : ''}>{masterLine1.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine1} onChange={(e) => handleMasterChange("text-1", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1 items-center">
                      <span className="flex items-center gap-2">
                        Línea 2
                        <select 
                          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded px-1 outline-none ml-2"
                          value={elements.find(el => el.id === "text-2")?.fontStyle || 'Normal'}
                          onChange={(e) => handleUpdateTemplate("text-2", { fontStyle: e.target.value as any })}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Bold">Negrita</option>
                          <option value="Italic">Cursiva</option>
                        </select>
                      </span>
                      <span className={masterLine2.length === 15 ? 'text-red-500' : ''}>{masterLine2.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine2} onChange={(e) => handleMasterChange("text-2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1 items-center">
                      <span className="flex items-center gap-2">
                        Línea 3
                        <select 
                          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded px-1 outline-none ml-2"
                          value={elements.find(el => el.id === "text-3")?.fontStyle || 'Normal'}
                          onChange={(e) => handleUpdateTemplate("text-3", { fontStyle: e.target.value as any })}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Bold">Negrita</option>
                          <option value="Italic">Cursiva</option>
                        </select>
                      </span>
                      <span className={masterLine3.length === 15 ? 'text-red-500' : ''}>{masterLine3.length}/15</span>
                    </div>
                    <input type="text" maxLength={15} value={masterLine3} onChange={(e) => handleMasterChange("text-3", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center relative">
                <img src={medalImageSrc} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply opacity-50 pointer-events-none" alt="" />
                <div className="w-[300px] h-[300px] border border-yellow-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden relative bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] z-10">
                  <CanvasEditor 
                    elements={elements} 
                    onChange={setElements} 
                    selectedId={selectedId} 
                    onSelect={setSelectedId} 
                    width={300} 
                    height={300} 
                    readOnly={false} 
                    enableOverlapDetection={true} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f] mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">2. Personalización B2B</h2>

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
              <div className="p-10 text-center bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Se enviarán las medallas con la placa metálica en blanco o sin pegar para tu propia personalización.</p>
              </div>
            )}

            {personalizationType === "SAME" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-xl border border-gray-200 dark:border-gray-800">
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
                  <StaticMedal line1={bulkRows[0].line1} line2={bulkRows[0].line2} line3={bulkRows[0].line3} />
                </div>
              </div>
            )}

            {personalizationType === "DIFFERENT" && (
              <div className="flex flex-col gap-6">
                {bulkRows.map((row, idx) => (
                  <div key={row.id} className={`grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-xl border transition-colors ${previewRowId === row.id ? 'border-[#d32f2f] shadow-md' : 'border-gray-200 dark:border-gray-800'}`}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-2">
                         <h4 className="text-sm font-black uppercase text-[#d32f2f]">Medalla {idx + 1}</h4>
                         <button onClick={() => viewRowInMaster(row)} className="text-xs bg-[#d32f2f] text-white px-3 py-1 rounded font-bold shadow hover:bg-red-700 flex items-center gap-1">
                           👁️ Ver en Maestro
                         </button>
                      </div>
                      
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
                          <input type="text" maxLength={15} value={row.line2} onChange={(e) => handleBulkChange(idx, "line2", e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
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
                      <StaticMedal line1={row.line1} line2={row.line2} line3={row.line3} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:col-span-1">
          <div className="bg-white dark:bg-[#111] p-10 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24 shadow-2xl flex flex-col gap-6">
             <h3 className="font-black text-2xl mb-2 text-[#d32f2f] uppercase tracking-tight text-center">Detalles de Orden</h3>
             
             <div className="relative h-56 w-full flex items-center justify-center bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <img src={medalImageSrc} className="h-full w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform" alt="Medalla" />
             </div>

             <div className="flex flex-col gap-5 border-t border-gray-100 dark:border-gray-800 pt-6">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">1. Color de Medalla:</span>
                  <select value={color} onChange={(e) => setColor(e.target.value as MedalColor)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-bold outline-none text-base">
                    <option value="Oro">Oro</option><option value="Plata">Plata</option><option value="Bronce">Bronce</option>
                  </select>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">2. Color de Cinta:</span>
                  <select value={ribbon} onChange={(e) => setRibbon(e.target.value as RibbonColor)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-bold outline-none text-base">
                    <option value="Rojo">Rojo</option>
                    <option value="Azul">Azul</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Nacional">Nacional (Bandera)</option>
                    <option value="Negro">Negro</option>
                  </select>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">3. Cantidad Total:</span>
                  <input type="number" min="1" max="5000" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center font-black outline-none text-lg" />
                </div>
             </div>

             <div className="text-right border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">Subtotal</div>
                <div className="text-5xl font-black text-[#d32f2f]">Q{(150 * quantity).toFixed(2)}</div>
             </div>
             
             <div className="flex items-start gap-4 bg-red-50 dark:bg-red-900/20 p-5 rounded-xl mt-4">
                <input type="checkbox" id="terms_side" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-6 h-6 accent-[#d32f2f]" />
                <label htmlFor="terms_side" className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                  <span className="font-black text-black dark:text-white uppercase block mb-1">Garantía Crown:</span> 
                  Confirmo el diseño, color de medalla, color de cinta y la revisión ortográfica.
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

export default function MedallasBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/medallas" className="hover:text-[#d32f2f] transition-colors">Medallas</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador B2B</span>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-[#d32f2f] p-4 mb-8 rounded-r-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#d32f2f] font-black uppercase text-sm">Flujo de Producción B2B</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Escoge un diseño maestro para la placa frontal y elige si vas a grabar el mismo texto en todas o texto diferente.</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center font-bold text-gray-500">Cargando personalizador...</div>}>
          <MedallasBuilderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
