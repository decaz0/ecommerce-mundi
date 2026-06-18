"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BoundingBoxEditorProps {
  variantId: string;
  imageUrl: string;
  initialArea?: { x: number; y: number; width: number; height: number } | null;
  onSaveAction: (variantId: string, area: string | null) => Promise<void>;
}

export default function BoundingBoxEditor({ variantId, imageUrl, initialArea, onSaveAction }: BoundingBoxEditorProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [area, setArea] = useState(initialArea || null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setStartPos({ x, y });
    setArea({ x, y, width: 0, height: 0 });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current || !area) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const newX = Math.min(startPos.x, currentX);
    const newY = Math.min(startPos.y, currentY);
    const newWidth = Math.abs(currentX - startPos.x);
    const newHeight = Math.abs(currentY - startPos.y);

    setArea({
      x: Math.max(0, newX),
      y: Math.max(0, newY),
      width: Math.min(100 - newX, newWidth),
      height: Math.min(100 - newY, newHeight)
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSaveAction(variantId, area ? JSON.stringify(area) : null);
    setSaving(false);
    router.refresh();
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClear = () => {
    setArea(null);
  };

  if (!isExpanded) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 text-sm text-premia-red bg-premia-red/5 hover:bg-premia-red/10 font-bold px-4 py-2 rounded-lg transition border border-premia-red/20"
        >
          <span>🖼️ Configurar Área del Logo</span>
          {initialArea && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">✅ Configurado</span>}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-bold text-gray-700 text-sm">🖼️ Lienzo para Logo</h4>
          <p className="text-xs text-gray-500">Dibuja el área permitida para el logo sobre la imagen.</p>
        </div>
        <div className="space-x-2">
          <button 
            type="button" 
            onClick={() => setIsExpanded(false)}
            className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
          >
            Cerrar
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
          >
            Limpiar
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-3 py-1.5 bg-premia-black hover:bg-gray-800 text-white rounded-lg transition font-bold disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Área"}
          </button>
        </div>
      </div>

      <div className="relative inline-block w-full max-w-sm select-none border-2 border-dashed border-gray-300 bg-white rounded-lg overflow-hidden group"
           style={{ touchAction: "none" }}>
        
        {/* Imagen de fondo */}
        <img 
          src={imageUrl} 
          alt="Vista previa para logo" 
          className="w-full h-auto pointer-events-none" 
          draggable={false}
        />

        {/* Capa de dibujo */}
        <div 
          ref={containerRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Overlay oscuro fuera del área */}
          {area && !isDrawing && (
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          )}
          
          {/* Rectángulo dibujado */}
          {area && (
            <div 
              className="absolute border-2 border-premia-red bg-premia-red/30 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
                boxShadow: isDrawing ? 'none' : '0 0 0 9999px rgba(0,0,0,0.3)'
              }}
            >
              {!isDrawing && (
                <div className="absolute -top-6 left-0 bg-premia-red text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap">
                  Área de Logo
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Helper overlay */}
        {!area && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/50 text-white text-xs px-3 py-2 rounded-lg font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">
              Haz clic y arrastra para dibujar
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
