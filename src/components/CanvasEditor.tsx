"use client";

import React, { useState, useRef, useEffect } from "react";

export type ElementType = "text" | "image";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  
  // Para texto
  text?: string;
  fontSize?: number;
  isCurved?: boolean;
  color?: string;
  fontFamily?: string;
  fontStyle?: "Normal" | "Bold" | "Italic";
  
  // Para imagen
  src?: string;
}

interface DraggableProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newElem: CanvasElement) => void;
  parentWidth: number;
  parentHeight: number;
  readOnly?: boolean;
  onInteractionEnd?: () => void;
}

const DraggableElement: React.FC<DraggableProps> = ({ element, isSelected, onSelect, onChange, parentWidth, parentHeight, readOnly, onInteractionEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const elementRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    onSelect();
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }
    setStartPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging && !isResizing) return;
    
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    
    if (isDragging) {
      onChange({
        ...element,
        x: Math.max(0, Math.min(element.x + dx, parentWidth - element.width)),
        y: Math.max(0, Math.min(element.y + dy, parentHeight - element.height))
      });
    } else if (isResizing) {
      const newWidth = Math.max(20, Math.min(element.width + dx, parentWidth - element.x));
      const newHeight = Math.max(20, Math.min(element.height + dy, parentHeight - element.y));
      
      const updates: any = {
        width: newWidth,
        height: newHeight
      };
      
      // Auto-escala de texto basado en la altura
      if (element.type === 'text') {
        updates.fontSize = Math.max(10, Math.floor(newHeight * 0.7));
      }
      
      onChange({
        ...element,
        ...updates
      });
    }
    
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      if (onInteractionEnd) onInteractionEnd();
    }
  };

  const fontWeight = element.fontStyle === "Bold" ? "900" : "normal";
  const fontStyleCss = element.fontStyle === "Italic" ? "italic" : "normal";

  return (
    <div
      ref={elementRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
        touchAction: readOnly ? 'auto' : 'none',
        cursor: readOnly ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        border: (isSelected && !readOnly) ? '2px dashed #00b0ff' : 'none',
        overflow: 'visible'
      }}
      className="group"
    >
      {/* Contenido del Elemento */}
      {element.type === "image" && element.src && (
        <img src={element.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
      )}
      
      {element.type === "text" && !element.isCurved && (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: `${element.fontSize || 24}px`,
          color: element.text ? (element.color || '#000') : (readOnly ? 'transparent' : '#ccc'),
          fontWeight: fontWeight,
          fontStyle: fontStyleCss,
          textAlign: 'center',
          wordBreak: 'break-word',
          lineHeight: 1.1
        }}>
          {element.text ? element.text : (readOnly ? "" : "")}
        </div>
      )}

      {element.type === "text" && element.isCurved && (
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          <path id={`curve-${element.id}`} d={`M 0,${element.height / 2} A ${element.width / 2},${element.width / 2} 0 0,1 ${element.width},${element.height / 2}`} fill="transparent" />
          <text fontSize={element.fontSize || 24} fill={element.text ? (element.color || '#000') : (readOnly ? 'transparent' : 'transparent')} fontWeight={fontWeight} fontStyle={fontStyleCss} fontFamily={element.fontFamily || 'serif'}>
            <textPath href={`#curve-${element.id}`} startOffset="50%" textAnchor="middle">
              {element.text ? element.text : (readOnly ? "" : "")}
            </textPath>
          </text>
        </svg>
      )}

      {/* Manejador de redimensionamiento */}
      {isSelected && !readOnly && (
        <div 
          className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-[#00b0ff] rounded-full border-2 border-white cursor-nwse-resize shadow-md z-50"
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelect();
            setIsResizing(true);
            setStartPos({ x: e.clientX, y: e.clientY });
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
        />
      )}
    </div>
  );
};

interface CanvasEditorProps {
  elements: CanvasElement[];
  onChange: (elements: CanvasElement[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  width?: number;
  height?: number;
  clipPath?: string;
  backgroundElement?: React.ReactNode;
  readOnly?: boolean;
  enableOverlapDetection?: boolean;
}

export default function CanvasEditor({ 
  elements, 
  onChange, 
  selectedId, 
  onSelect,
  width = 500,
  height = 500,
  clipPath,
  backgroundElement,
  readOnly = false,
  enableOverlapDetection = false
}: CanvasEditorProps) {
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null);
  const [overlappingElementId, setOverlappingElementId] = useState<string | null>(null);

  const handleElementChange = (newElem: CanvasElement) => {
    onChange(elements.map(el => el.id === newElem.id ? newElem : el));
  };

  const handleCanvasClick = () => {
    onSelect(null);
  };

  const checkOverlaps = () => {
    if (!enableOverlapDetection || readOnly) return;
    
    // Validar intersección de bounding boxes
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const a = elements[i];
        const b = elements[j];
        
        // Ignorar si uno no tiene contenido real
        if (a.type === 'text' && !a.text) continue;
        if (b.type === 'text' && !b.text) continue;
        if (a.type === 'image' && !a.src) continue;
        if (b.type === 'image' && !b.src) continue;

        const aRight = a.x + a.width;
        const aBottom = a.y + a.height;
        const bRight = b.x + b.width;
        const bBottom = b.y + b.height;

        const isOverlapping = !(
          aRight < b.x || 
          a.x > bRight || 
          aBottom < b.y || 
          a.y > bBottom
        );

        if (isOverlapping) {
          const idToFix = a.id === selectedId ? a.id : (b.id === selectedId ? b.id : a.id);
          setOverlappingElementId(idToFix);
          if ((a.type === 'text' && b.type === 'image') || (a.type === 'image' && b.type === 'text')) {
            setOverlapWarning("Tu texto está sobrepuesto sobre una imagen.");
            return;
          } else {
            setOverlapWarning("Tu texto está sobrepuesto sobre otro texto.");
            return;
          }
        }
      }
    }
  };

  const handleFixOverlap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!overlappingElementId) {
      setOverlapWarning(null);
      return;
    }

    const elemToFix = elements.find(el => el.id === overlappingElementId);
    if (!elemToFix) {
      setOverlapWarning(null);
      return;
    }

    const stepY = 10;
    const stepX = 10;
    let found = false;
    let bestX = elemToFix.x;
    let bestY = elemToFix.y;

    for (let y = 10; y < height - elemToFix.height; y += stepY) {
      for (let x = 10; x < width - elemToFix.width; x += stepX) {
        let collision = false;
        for (const other of elements) {
          if (other.id === overlappingElementId) continue;
          if ((other.type === 'text' && !other.text) || (other.type === 'image' && !other.src)) continue;

          const aRight = x + elemToFix.width;
          const aBottom = y + elemToFix.height;
          const bRight = other.x + other.width;
          const bBottom = other.y + other.height;

          if (!(aRight < other.x || x > bRight || aBottom < other.y || y > bBottom)) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          bestX = x;
          bestY = y;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      handleElementChange({ ...elemToFix, x: bestX, y: bestY });
      setOverlapWarning(null);
      setOverlappingElementId(null);
    } else {
      setOverlapWarning("No se puede corregir ya que no cuenta con espacio libre. Haz el texto o imagen más pequeño, o déjalo como está.");
      setOverlappingElementId(null);
    }
  };

  return (
    <div 
      className="relative mx-auto overflow-hidden shadow-inner bg-transparent group"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        clipPath: clipPath,
        maxWidth: '100%',
        aspectRatio: `${width}/${height}`
      }}
      onPointerDown={handleCanvasClick}
      ref={canvasRef}
    >
      {/* Capa de fondo estática */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundElement}
      </div>

      {/* Alerta de colisión */}
      {overlapWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white text-base sm:text-xl px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center text-center gap-6 w-[95%] max-w-lg border-4 border-red-400">
          <span className="font-black text-2xl leading-tight">{overlapWarning}</span>
          <div className="flex gap-4 w-full">
            <button 
              className="flex-1 bg-white text-red-600 px-4 py-3 rounded-xl font-black hover:bg-gray-100 transition-colors shadow-lg text-lg uppercase"
              onClick={(e) => { e.stopPropagation(); setOverlapWarning(null); }}
            >
              Dejarlo así
            </button>
            <button 
              className="flex-1 bg-red-800 text-white px-4 py-3 rounded-xl font-black hover:bg-red-900 transition-colors shadow-lg text-lg uppercase border-2 border-red-500"
              onClick={handleFixOverlap}
            >
              Arreglarlo
            </button>
          </div>
        </div>
      )}

      {/* Elementos interactivos ordenados por zIndex */}
      {elements.sort((a, b) => a.zIndex - b.zIndex).map((el) => (
        <DraggableElement
          key={el.id}
          element={el}
          isSelected={selectedId === el.id}
          onSelect={() => { onSelect(el.id); setOverlapWarning(null); }}
          onChange={handleElementChange}
          parentWidth={width}
          parentHeight={height}
          readOnly={readOnly}
          onInteractionEnd={checkOverlaps}
        />
      ))}
    </div>
  );
}
