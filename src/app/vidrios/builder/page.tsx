"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CanvasEditor, { CanvasElement } from "../../../components/CanvasEditor";

const MODELS = [
  { id: "hexagono", name: "Vidrio Hexágono", img: "/categorias/vidrio hexagono.png", price: 350 },
  { id: "cuadrilatero", name: "Vidrio Cuadrilátero", img: "/categorias/vidrio cuadrilatero.png", price: 350 }
];

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
  { id: "reconocimiento", name: "Reconocimiento al Mérito", texts: ["RECONOCIMIENTO", "AL MÉRITO", "Por su inquebrantable dedicación y liderazgo excepcional que han dejado una huella imborrable en nuestra organización.", "OCTUBRE 2026"] },
  { id: "agradecimiento", name: "Agradecimiento", texts: ["EN PROFUNDO", "AGRADECIMIENTO A", "Por su apoyo incondicional y colaboración constante en el desarrollo de nuestras metas compartidas.", "2026"] },
  { id: "trayectoria", name: "Trayectoria", texts: ["POR SU", "TRAYECTORIA", "En honor a 20 años de servicio excepcional, lealtad y profesionalismo continuo.", "20 AÑOS"] },
];

function VidriosBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultModelId = searchParams?.get("model") || "hexagono";
  const isOffer = searchParams?.get("offer") === "true";
  
  // Plantilla Base (Diseño Maestro)
  const [elements, setElements] = useState<CanvasElement[]>([
    { id: "text-1", type: "text", text: "RECONOCIMIENTO", x: 100, y: 150, width: 200, height: 40, zIndex: 2, fontSize: 24, isCurved: false, fontFamily: 'serif', fontStyle: 'Bold', color: '#000000' },
    { id: "text-2", type: "text", text: "AL MÉRITO", x: 100, y: 200, width: 200, height: 30, zIndex: 3, fontSize: 18, isCurved: false, fontFamily: 'serif', fontStyle: 'Normal', color: '#000000' },
    { id: "text-3", type: "text", text: "Por su inquebrantable dedicación y liderazgo excepcional que han dejado una huella imborrable en nuestra organización.", x: 50, y: 240, width: 300, height: 90, zIndex: 4, fontSize: 13, isCurved: false, fontFamily: 'serif', fontStyle: 'Italic', color: '#000000' },
    { id: "text-4", type: "text", text: "2026", x: 100, y: 350, width: 200, height: 30, zIndex: 5, fontSize: 20, isCurved: false, fontFamily: 'serif', fontStyle: 'Bold', color: '#000000' },
    { id: "image-1", type: "image", src: "", x: 150, y: 380, width: 100, height: 100, zIndex: 1 }
  ]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Producción Masiva (B2B)
  const [personalizationType, setPersonalizationType] = useState<PersonalizationType>("SAME");
  const [quantity, setQuantity] = useState<number>(1);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([{ id: "1", line1: "RECONOCIMIENTO", line2: "AL MÉRITO", line3: "Por su inquebrantable dedicación y liderazgo excepcional que han dejado una huella imborrable en nuestra organización.", line4: "2026" }]);
  const [previewRowId, setPreviewRowId] = useState<string | null>(null);

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
    setPreviewRowId(null);
  };

  const handleUpdateTemplate = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        if (id !== "text-3" && updates.text && updates.text.length > 25) return el;
        if (id === "text-3" && updates.text && updates.text.length > 250) return el;
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
    if (field !== "text-3" && value.length > 25) return;
    if (field === "text-3" && value.length > 250) return;
    
    handleUpdateTemplate(field, { text: value });
    setPreviewRowId(null);
    
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
    if (field !== "line3" && value.length > 25) return;
    if (field === "line3" && value.length > 250) return;
    const newRows = [...bulkRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setBulkRows(newRows);

    if (previewRowId === newRows[index].id) {
       const fieldIdMap: Record<string, string> = { "line1": "text-1", "line2": "text-2", "line3": "text-3", "line4": "text-4" };
       handleUpdateTemplate(fieldIdMap[field], { text: value });
    }
  };

  const copyToAll = (field: keyof BulkRow) => {
    const firstValue = bulkRows[0][field];
    setBulkRows(bulkRows.map(row => ({ ...row, [field]: firstValue })));
  };

  const viewRowInMaster = (row: BulkRow) => {
    setPreviewRowId(row.id);
    setElements(elements.map(el => {
      if (el.id === "text-1") return { ...el, text: row.line1 };
      if (el.id === "text-2") return { ...el, text: row.line2 };
      if (el.id === "text-3") return { ...el, text: row.line3 };
      if (el.id === "text-4") return { ...el, text: row.line4 };
      return el;
    }));
  };

  const handleAddToCart = () => {
    if (!acceptedTerms) {
      alert("Por favor, acepta la garantía marcando la casilla antes de continuar.");
      return;
    }

    const variations = personalizationType === "NONE" 
      ? bulkRows.map(() => ({ color: defaultModelId, lines: ["", "", "", ""] }))
      : personalizationType === "SAME"
      ? bulkRows.map(() => ({ color: defaultModelId, lines: [bulkRows[0].line1, bulkRows[0].line2, bulkRows[0].line3, bulkRows[0].line4] }))
      : bulkRows.map(row => ({ color: defaultModelId, lines: [row.line1, row.line2, row.line3, row.line4] }));

    const cartItem = {
      id: Date.now().toString(),
      type: "Reconocimiento de Vidrio",
      details: `Vidrio ${defaultModelId} Lote x${quantity}`,
      price: isOffer ? 250 : 350,
      quantity: quantity,
      image: `/categorias/vidrio ${defaultModelId}.png`,
      canvasElements: elements,
      variations: variations,
      personalizationType
    };

    const existingCart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    localStorage.setItem("premia_cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("cart_updated"));
    router.push("/cart");
  };

  const isHex = defaultModelId === "hexagono";
  const clipPathStyle = isHex
    ? "polygon(32% 0%, 68% 0%, 69% 0.5%, 69.8% 1.5%, 70.2% 3%, 99.8% 46%, 100% 48%, 99.5% 50%, 73.5% 97%, 73.2% 98.5%, 72% 100%, 28% 100%, 26.8% 98.5%, 26.5% 97%, 0.5% 50%, 0% 48%, 0.2% 46%, 29.8% 3%, 30.2% 1.5%, 31% 0.5%)" 
    : "polygon(17% 0%, 83% 0%, 84% 0.5%, 84.8% 1.5%, 85% 3%, 100% 97%, 99.5% 98.5%, 98% 100%, 2% 100%, 0.5% 98.5%, 0% 97%, 15% 3%, 15.2% 1.5%, 16% 0.5%)";

  const StaticVidrioPlaque = ({ line1, line2, line3, line4 }: { line1: string, line2: string, line3: string, line4: string }) => {
    const computedElements = elements.map(el => {
      if (el.id === "text-1") return { ...el, text: line1 };
      if (el.id === "text-2") return { ...el, text: line2 };
      if (el.id === "text-3") return { ...el, text: line3 };
      if (el.id === "text-4") return { ...el, text: line4 };
      return el;
    });

    return (
      <div className="relative w-[120px] h-[150px] mx-auto bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] border border-yellow-600 flex items-center justify-center shadow-lg" style={{ clipPath: clipPathStyle }}>
        <div className="relative w-[400px] h-[500px]">
          <div className="absolute top-0 left-0" style={{ transform: 'scale(calc(120 / 400))', transformOrigin: 'top left' }}>
            <CanvasEditor 
              elements={computedElements}
              onChange={() => {}}
              selectedId={null}
              onSelect={() => {}}
              width={400}
              height={500}
              clipPath={clipPathStyle}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    );
  };

  const masterLine1 = elements.find(el => el.id === "text-1")?.text || "";
  const masterLine2 = elements.find(el => el.id === "text-2")?.text || "";
  const masterLine3 = elements.find(el => el.id === "text-3")?.text || "";
  const masterLine4 = elements.find(el => el.id === "text-4")?.text || "";

  return (
    <div className="flex flex-col gap-8 pb-32 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IZQUIERDA: DISEÑO MAESTRO Y B2B */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#d32f2f] flex items-center gap-3">
                  1. Diseño Maestro: Vidrio
                  {previewRowId && <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-bold shadow-sm">Viendo Cristal {previewRowId}</span>}
                </h2>
                <p className="text-gray-500 text-sm mt-1">Crea el diseño principal. Puedes arrastrar y escalar los textos e imágenes.</p>
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
                  Subir Logo PNG
                </button>
                <input type="file" accept="image/png" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                  {[
                    { id: '1', max: 25 },
                    { id: '2', max: 25 },
                    { id: '3', max: 250, isTextarea: true },
                    { id: '4', max: 25 }
                  ].map((field) => {
                    const fieldId = `text-${field.id}` as any;
                    const val = eval(`masterLine${field.id}`);
                    return (
                      <div key={field.id}>
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1 items-center">
                          <span className="flex items-center gap-2">
                            Línea {field.id}
                            <select 
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded px-1 outline-none ml-2"
                              value={elements.find(el => el.id === fieldId)?.fontStyle || 'Normal'}
                              onChange={(e) => handleUpdateTemplate(fieldId, { fontStyle: e.target.value as any })}
                            >
                              <option value="Normal">Normal</option>
                              <option value="Bold">Negrita</option>
                              <option value="Italic">Cursiva</option>
                            </select>
                          </span>
                          <span className={val.length === field.max ? 'text-red-500' : ''}>{val.length}/{field.max}</span>
                        </div>
                        {field.isTextarea ? (
                          <textarea maxLength={field.max} rows={3} value={val} onChange={(e) => handleMasterChange(fieldId, e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm resize-none" />
                        ) : (
                          <input type="text" maxLength={field.max} value={val} onChange={(e) => handleMasterChange(fieldId, e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-sm" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center items-center w-full">
                <div 
                  className="w-[400px] h-[500px] border border-yellow-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden relative bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] rounded-sm flex-shrink-0"
                  style={{ clipPath: clipPathStyle, transformOrigin: 'top center', transform: 'scale(0.8)' }}
                >
                  <CanvasEditor 
                    elements={elements} 
                    onChange={setElements} 
                    selectedId={selectedId} 
                    onSelect={setSelectedId} 
                    width={400} 
                    height={500} 
                    clipPath={clipPathStyle}
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
                <p className="text-sm text-gray-500">Se enviarán los cristales en blanco para tu propia personalización.</p>
              </div>
            )}

            {personalizationType === "SAME" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-4">
                  {[
                    { id: '1', max: 25 },
                    { id: '2', max: 25 },
                    { id: '3', max: 250, isTextarea: true },
                    { id: '4', max: 25 }
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea {field.id} (Máx {field.max})</label>
                      {field.isTextarea ? (
                        <textarea maxLength={field.max} rows={3} value={(bulkRows[0] as any)[`line${field.id}`]} onChange={(e) => handleBulkChange(0, `line${field.id}` as keyof BulkRow, e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none resize-none" />
                      ) : (
                        <input type="text" maxLength={field.max} value={(bulkRows[0] as any)[`line${field.id}`]} onChange={(e) => handleBulkChange(0, `line${field.id}` as keyof BulkRow, e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h4 className="text-[10px] font-black uppercase text-[#d32f2f]">Muestra</h4>
                  <StaticVidrioPlaque line1={bulkRows[0].line1} line2={bulkRows[0].line2} line3={bulkRows[0].line3} line4={bulkRows[0].line4} />
                </div>
              </div>
            )}

            {personalizationType === "DIFFERENT" && (
              <div className="flex flex-col gap-6">
                {bulkRows.map((row, idx) => (
                  <div key={row.id} className={`grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-xl border transition-colors ${previewRowId === row.id ? 'border-[#d32f2f] shadow-md' : 'border-gray-200 dark:border-gray-800'}`}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-2">
                         <h4 className="text-sm font-black uppercase text-[#d32f2f]">Cristal {idx + 1}</h4>
                         <button onClick={() => viewRowInMaster(row)} className="text-xs bg-[#d32f2f] text-white px-3 py-1 rounded font-bold shadow hover:bg-red-700 flex items-center gap-1">
                           👁️ Ver en Maestro
                         </button>
                      </div>
                      
                      {[
                        { id: '1', max: 25 },
                        { id: '2', max: 25 },
                        { id: '3', max: 250, isTextarea: true },
                        { id: '4', max: 25 }
                      ].map((field) => (
                        <div className="flex gap-2" key={field.id}>
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Línea {field.id}</label>
                            {field.isTextarea ? (
                              <textarea maxLength={field.max} rows={3} value={(row as any)[`line${field.id}`]} onChange={(e) => handleBulkChange(idx, `line${field.id}` as keyof BulkRow, e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none resize-none" />
                            ) : (
                              <input type="text" maxLength={field.max} value={(row as any)[`line${field.id}`]} onChange={(e) => handleBulkChange(idx, `line${field.id}` as keyof BulkRow, e.target.value)} className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none" />
                            )}
                          </div>
                          {idx === 0 && <button onClick={() => copyToAll(`line${field.id}` as keyof BulkRow)} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-[10px] font-bold uppercase px-3 py-2 rounded self-end h-[38px] mt-[18px]">Repetir</button>}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <h4 className="text-[10px] font-black uppercase text-[#d32f2f]">Muestra</h4>
                      <StaticVidrioPlaque line1={row.line1} line2={row.line2} line3={row.line3} line4={row.line4} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DERECHA: SIDEBAR DE ORDEN */}
        <div className="w-full lg:col-span-1">
          <div className="bg-white dark:bg-[#111] p-10 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24 shadow-2xl flex flex-col gap-6">
             <h3 className="font-black text-2xl mb-2 text-[#d32f2f] uppercase tracking-tight text-center">Detalles de Orden</h3>
             
             <div className="relative h-96 w-full flex items-center justify-center bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <img src={`/categorias/vidrio ${defaultModelId}.png`} className="h-full w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform" alt="Vidrio" />
             </div>

             <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-2">
               <h3 className="text-xs font-black text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mb-2">Características del Producto</h3>
               <ul className="text-xs text-yellow-700 dark:text-yellow-600 list-disc list-inside flex flex-col gap-1">
                 <li><strong>Material:</strong> Cristal templado de 10mm de grosor con bordes biselados.</li>
                 <li><strong>Base:</strong> Base de cristal sólido o madera elegante según modelo.</li>
                 <li><strong>Personalización:</strong> Lámina impresa en alta definición o grabado sandblast.</li>
               </ul>
             </div>

             <div className="flex flex-col gap-5 border-t border-gray-100 dark:border-gray-800 pt-6">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">1. Modelo:</span>
                  <div className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-bold text-base capitalize">Vidrio {defaultModelId}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">2. Cantidad Total:</span>
                  <input type="number" min="1" max="5000" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center font-black outline-none text-lg" />
                </div>
             </div>

             <div className="text-right border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">Subtotal</div>
                <div className="text-5xl font-black text-[#d32f2f]">Q{((isOffer ? 250 : 350) * quantity).toFixed(2)}</div>
             </div>
             
             <div className="flex items-start gap-4 bg-red-50 dark:bg-red-900/20 p-5 rounded-xl mt-4">
                <input type="checkbox" id="terms_side" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-6 h-6 accent-[#d32f2f]" />
                <label htmlFor="terms_side" className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                  <span className="font-black text-black dark:text-white uppercase block mb-1">Garantía Crown:</span> 
                  Confirmo el diseño, modelo y la revisión ortográfica.
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

export default function VidriosBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d32f2f] transition-colors">Inicio</Link> 
          <span>/</span> 
          <Link href="/vidrios" className="hover:text-[#d32f2f] transition-colors">Reconocimientos de Vidrio</Link>
          <span>/</span> 
          <span className="text-black dark:text-white">Diseñador B2B</span>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-[#d32f2f] p-4 mb-8 rounded-r-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#d32f2f] font-black uppercase text-sm">Flujo de Producción B2B</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Escoge un diseño maestro para la placa frontal y elige si vas a grabar el mismo texto en todos o texto diferente.</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center font-bold text-gray-500">Cargando personalizador...</div>}>
          <VidriosBuilderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
