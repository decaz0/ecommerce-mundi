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
}

const DraggableElement: React.FC<DraggableProps> = ({ element, isSelected, onSelect, onChange, parentWidth, parentHeight, readOnly }) => {
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
      // Limitar coordenadas (Hard Bounds)
      onChange({
        ...element,
        x: Math.max(0, Math.min(element.x + dx, parentWidth - element.width)),
        y: Math.max(0, Math.min(element.y + dy, parentHeight - element.height))
      });
    } else if (isResizing) {
      // Resize bottom-right (con límites físicos)
      onChange({
        ...element,
        width: Math.max(20, Math.min(element.width + dx, parentWidth - element.x)),
        height: Math.max(20, Math.min(element.height + dy, parentHeight - element.y))
      });
    }
    
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setIsResizing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
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
          fontFamily: element.fontFamily || 'serif'
        }}>
          {element.text ? element.text : (readOnly ? "" : "[Vacío]")}
        </div>
      )}

      {element.type === "text" && element.isCurved && (
        <svg width="100%" height="100%" viewBox="-150 -150 300 300" style={{ overflow: 'visible' }}>
          <path id={`curve-${element.id}`} d="M -100,0 A 100,100 0 1,1 100,0" fill="transparent" />
          <text fontSize={element.fontSize || 24} fill={element.text ? (element.color || '#000') : (readOnly ? 'transparent' : '#ccc')} fontWeight={fontWeight} fontStyle={fontStyleCss} fontFamily={element.fontFamily || 'serif'}>
            <textPath href={`#curve-${element.id}`} startOffset="50%" textAnchor="middle">
              {element.text ? element.text : (readOnly ? "" : "[Vacío]")}
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
  readOnly = false
}: CanvasEditorProps) {
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleElementChange = (newElem: CanvasElement) => {
    onChange(elements.map(el => el.id === newElem.id ? newElem : el));
  };

  const handleCanvasClick = () => {
    onSelect(null);
  };

  return (
    <div 
      className="relative mx-auto overflow-hidden shadow-inner bg-transparent"
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

      {/* Elementos interactivos ordenados por zIndex */}
      {elements.sort((a, b) => a.zIndex - b.zIndex).map((el) => (
        <DraggableElement
          key={el.id}
          element={el}
          isSelected={selectedId === el.id}
          onSelect={() => onSelect(el.id)}
          onChange={handleElementChange}
          parentWidth={width}
          parentHeight={height}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
