"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveVariantTextConfig } from "@/actions/productActions";

export default function VariantTextEditor({ variant, typographies }: { variant: any, typographies: any[] }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Local state for editing
  const [lines, setLines] = useState<{label: string, maxChars: number}[]>(
    variant.textLines.map((l: any) => ({ label: l.label, maxChars: l.maxChars }))
  );
  const [selectedFonts, setSelectedFonts] = useState<string[]>(
    variant.typographies.map((t: any) => t.typographyId)
  );
  const [loading, setLoading] = useState(false);

  const toggleFont = (id: string) => {
    setSelectedFonts(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addLine = () => setLines([...lines, { label: "", maxChars: 30 }]);
  const updateLine = (idx: number, field: string, val: any) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [field]: val };
    setLines(newLines);
  };
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      variantId: variant.id,
      textLines: lines.filter(l => l.label.trim() !== ""),
      typographies: selectedFonts
    };
    
    const res = await saveVariantTextConfig(payload);
    setLoading(false);
    if (res?.success) {
      setIsExpanded(false);
      router.refresh();
    } else {
      alert("Error: " + res?.error);
    }
  };

  if (!isExpanded) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 font-bold px-4 py-2 rounded-lg transition border border-purple-200"
        >
          <span>✍️ Configurar Textos y Fuentes</span>
          {(lines.length > 0 || selectedFonts.length > 0) && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">✅ Configurado</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 mt-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-gray-800">✍️ Configuración de Texto</h4>
          <p className="text-xs text-gray-500">Define los campos de texto y fuentes permitidas para esta variante.</p>
        </div>
        <button onClick={() => setIsExpanded(false)} className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition">
          Cerrar
        </button>
      </div>

      <div className="space-y-6">
        {/* Tipografías */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Fuentes Permitidas</label>
          {typographies.length === 0 ? (
            <p className="text-sm text-red-500">No hay fuentes en el catálogo.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {typographies.map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleFont(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                    selectedFonts.includes(t.id) ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Líneas de Texto */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Líneas de Texto Requeridas</label>
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="flex space-x-2">
                <input
                  type="text"
                  value={line.label}
                  onChange={e => updateLine(idx, "label", e.target.value)}
                  placeholder="Ej. Nombre del Ganador"
                  className="flex-1 p-2 border rounded-lg text-sm outline-none focus:border-purple-500"
                />
                <input
                  type="number"
                  value={line.maxChars}
                  onChange={e => updateLine(idx, "maxChars", Number(e.target.value))}
                  placeholder="Max Chars"
                  className="w-24 p-2 border rounded-lg text-sm outline-none focus:border-purple-500 font-mono text-center"
                />
                <button onClick={() => removeLine(idx)} className="px-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-bold">×</button>
              </div>
            ))}
            <button onClick={addLine} className="text-xs text-purple-600 font-bold mt-2 hover:underline">
              + Añadir otra línea
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-purple-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </div>
  );
}
