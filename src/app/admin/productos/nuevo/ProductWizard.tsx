"use client";

import { useState, useRef } from "react";
import { saveWizardVariants, uploadVariantImage } from "@/actions/productActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CUSTOM_TYPES = [
  { id: "TEXT_LOGO", label: "Texto + Logo", desc: "Logo y texto personalizados.", emoji: "✍️🖼️" },
  { id: "TEXT_ONLY", label: "Sólo Texto", desc: "Solo texto personalizado.", emoji: "✍️" },
  { id: "LOGO_ONLY", label: "Sólo Logo", desc: "Solo logo/imagen.", emoji: "🖼️" },
  { id: "NONE", label: "Sin Personalización", desc: "Producto genérico tal cual.", emoji: "📦" },
];

export default function ProductWizard({ catalogs, existingProducts }: any) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- PASO 1: Producto ---
  const [isNewProduct, setIsNewProduct] = useState(true);
  const [baseProductId, setBaseProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // --- PASO 2: Múltiples Tamaños ---
  const [sizes, setSizes] = useState<string[]>([""]);
  const addSize = () => setSizes(prev => [...prev, ""]);
  const removeSize = (i: number) => setSizes(prev => prev.filter((_, idx) => idx !== i));
  const updateSize = (i: number, val: string) => setSizes(prev => prev.map((s, idx) => idx === i ? val : s));
  const validSizes = sizes.map(s => s.trim()).filter(Boolean);

  // --- PASO 3: Múltiples Colores ---
  const [colorIds, setColorIds] = useState<string[]>([]);
  const toggleColor = (id: string) =>
    setColorIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  // --- PASO 4: Múltiples Figuras y Bases ---
  const [figureIds, setFigureIds] = useState<string[]>([]);
  const [baseTypeIds, setBaseTypeIds] = useState<string[]>([]);
  const toggleFigure = (id: string) =>
    setFigureIds(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  const toggleBase = (id: string) =>
    setBaseTypeIds(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  // --- PASO 5: Modalidades ---
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const toggleCustomType = (type: string) =>
    setCustomTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  // --- PASO 6: Texto (condicional) ---
  const [selectedTypographies, setSelectedTypographies] = useState<string[]>([]);
  const toggleTypography = (id: string) =>
    setSelectedTypographies(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const [textLines, setTextLines] = useState<any[]>([{ label: "Nombre", maxChars: 30 }]);

  // --- PASO 7: Matriz de Variantes ---
  const [finalVariants, setFinalVariants] = useState<any[]>([]);
  const fileRefs = useRef<any[]>([]);

  // --- Helpers ---
  const hasText = customTypes.includes("TEXT_LOGO") || customTypes.includes("TEXT_ONLY");
  const baseSku = isNewProduct ? productSku : (existingProducts.find((p: any) => p.id === baseProductId)?.sku || "BASE");

  // Calcula el total de combinaciones en tiempo real
  const totalCombinations = Math.max(validSizes.length, 1)
    * Math.max(colorIds.length, 1)
    * Math.max(figureIds.length, 1)
    * Math.max(baseTypeIds.length, 1)
    * Math.max(customTypes.length, 1);

  // Genera el producto cartesiano completo
  const generateFinalVariants = () => {
    const allSizes = validSizes.length > 0 ? validSizes : [""];
    const allColors = colorIds.length > 0 ? colorIds : [""];
    const allFigures = figureIds.length > 0 ? figureIds : [""];
    const allBases = baseTypeIds.length > 0 ? baseTypeIds : [""];
    const allTypes = customTypes.length > 0 ? customTypes : ["NONE"];

    const variants: any[] = [];
    for (const size of allSizes) {
      for (const colorId of allColors) {
        for (const figureId of allFigures) {
          for (const baseTypeId of allBases) {
            for (const customizationType of allTypes) {
              const colorName = catalogs.colors.find((c: any) => c.id === colorId)?.name?.substring(0, 3).toUpperCase() || "CLR";
              const figureName = catalogs.figures.find((f: any) => f.id === figureId)?.name?.substring(0, 3).toUpperCase() || "FIG";
              const baseName = catalogs.bases.find((b: any) => b.id === baseTypeId)?.name?.substring(0, 3).toUpperCase() || "BAS";
              const sku = `${baseSku}-${size}-${colorName}-${figureName}-${customizationType.substring(0, 4)}`
                .toUpperCase()
                .replace(/\s+/g, "-");

              variants.push({
                size,
                colorId,
                figureId,
                baseTypeId,
                customizationType,
                sku,
                price: "",
                imageUrl: "",
                imagePreview: "",
              });
            }
          }
        }
      }
    }
    setFinalVariants(variants);
    fileRefs.current = variants.map(() => null);
  };

  // --- Navegación ---
  const handleNext = () => {
    if (step === 1) {
      if (isNewProduct && (!productName || !productSku)) return alert("Completa el nombre y SKU del producto");
      if (isNewProduct && !categoryId) return alert("Selecciona una categoría");
      if (!isNewProduct && !baseProductId) return alert("Selecciona un producto existente");
    }
    if (step === 2 && validSizes.length === 0) return alert("Agrega al menos un tamaño");
    if (step === 3 && colorIds.length === 0) return alert("Selecciona al menos un color");
    if (step === 4 && (figureIds.length === 0 || baseTypeIds.length === 0)) return alert("Selecciona al menos una figura y una base");
    if (step === 5 && customTypes.length === 0) return alert("Selecciona al menos una modalidad");
    if (step === 5) {
      if (!hasText) { generateFinalVariants(); setStep(7); return; }
    }
    if (step === 6) {
      if (selectedTypographies.length === 0) return alert("Selecciona al menos una tipografía");
      generateFinalVariants();
    }
    setStep(p => p + 1);
  };

  const handlePrev = () => {
    if (step === 7 && !hasText) { setStep(5); return; }
    setStep(p => p - 1);
  };

  const updateFinalVariant = (index: number, field: string, value: any) => {
    setFinalVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;
    fileRefs.current[index] = file;
    updateFinalVariant(index, "imagePreview", URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (finalVariants.some(v => !v.price && v.price !== 0)) return alert("Asigna un precio a todas las variantes");
    setLoading(true);

    const updatedVariants = await Promise.all(
      finalVariants.map(async (v, idx) => {
        if (fileRefs.current[idx]) {
          const fd = new FormData();
          fd.append("file", fileRefs.current[idx]);
          const res = await uploadVariantImage(fd);
          return { ...v, imageUrl: res.url || "" };
        }
        return v;
      })
    );

    // Para variantes con múltiples combinaciones, hay que guardar cada una individualmente
    // Agrupamos por combinación única de (size, colorId, figureId, baseTypeId)
    for (const v of updatedVariants) {
      const payload = {
        isNewProduct: updatedVariants.indexOf(v) === 0 ? isNewProduct : false, // Solo crear producto en la primera
        productData: isNewProduct
          ? { name: productName, sku: productSku, description: productDescription, categoryId }
          : { id: baseProductId },
        variantBase: { size: v.size, colorId: v.colorId, figureId: v.figureId, baseTypeId: v.baseTypeId },
        textConfig: hasText ? { typographies: selectedTypographies, textLines } : null,
        generatedVariants: [v],
        existingProductId: updatedVariants.indexOf(v) === 0 ? undefined : "USE_LAST",
      };
      
      if (updatedVariants.indexOf(v) > 0) {
        payload.isNewProduct = false;
      }
    }

    // Guardamos todo en un solo batch
    const payload = {
      isNewProduct,
      productData: isNewProduct
        ? { name: productName, sku: productSku, description: productDescription, categoryId }
        : { id: baseProductId },
      textConfig: hasText ? { typographies: selectedTypographies, textLines } : null,
      generatedVariants: updatedVariants,
    };

    const res = await saveWizardVariants(payload);
    setLoading(false);
    if (res.success) {
      router.push("/admin/productos");
    } else {
      alert("Error al guardar: " + res.error);
    }
  };

  // --- Resumen de selecciones para mostrar en Step 7 ---
  const getVariantLabel = (v: any) => {
    const color = catalogs.colors.find((c: any) => c.id === v.colorId);
    const figure = catalogs.figures.find((f: any) => f.id === v.figureId);
    const base = catalogs.bases.find((b: any) => b.id === v.baseTypeId);
    const type = CUSTOM_TYPES.find(t => t.id === v.customizationType);
    return { color, figure, base, type };
  };

  const stepTitles = ["Producto", "Tamaños", "Colores", "Figura y Base", "Modalidades", "Texto", "Resumen"];

  // Contador de combinaciones visible en los pasos 2-5
  const showCounter = step >= 2 && step <= 5;

  return (
    <div className="p-8">
      {/* Progress Bar */}
      <div className="flex mb-8 space-x-1 items-center">
        {stepTitles.map((title, i) => {
          const num = i + 1;
          if (num === 6 && !hasText && step >= 7) return null;
          return (
            <div key={num} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 border-2 transition-all ${
                step > num ? 'bg-green-500 text-white border-green-500' :
                step === num ? 'bg-blue-600 text-white border-blue-600' :
                'bg-white text-gray-400 border-gray-300'
              }`}>
                {step > num ? "✓" : num}
              </div>
              <span className={`text-xs font-medium hidden md:block ${step === num ? 'text-blue-600' : 'text-gray-400'}`}>{title}</span>
            </div>
          );
        })}
      </div>

      {/* Contador de combinaciones */}
      {showCounter && (validSizes.length > 0 || colorIds.length > 0 || figureIds.length > 0 || customTypes.length > 0) && (
        <div className="mb-5 flex flex-wrap gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm items-center">
          <span className="font-bold text-indigo-700">📊 Variantes que se generarán:</span>
          <span className="bg-white border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-mono">
            {Math.max(validSizes.length, 1)} tamaños
          </span>
          <span className="text-indigo-400">×</span>
          <span className="bg-white border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-mono">
            {Math.max(colorIds.length, 1)} colores
          </span>
          <span className="text-indigo-400">×</span>
          <span className="bg-white border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-mono">
            {Math.max(figureIds.length, 1)} figuras
          </span>
          <span className="text-indigo-400">×</span>
          <span className="bg-white border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-mono">
            {Math.max(baseTypeIds.length, 1)} bases
          </span>
          <span className="text-indigo-400">×</span>
          <span className="bg-white border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-mono">
            {Math.max(customTypes.length, 1)} modalidades
          </span>
          <span className="text-indigo-400">=</span>
          <span className="bg-indigo-600 text-white px-3 py-0.5 rounded-full text-sm font-black">
            {totalCombinations} variantes
          </span>
        </div>
      )}

      <div className="min-h-[420px]">

        {/* === PASO 1: PRODUCTO === */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800">Paso 1: Producto Base</h2>
            <div className="flex space-x-3">
              <button onClick={() => setIsNewProduct(true)} className={`flex-1 p-4 rounded-xl border-2 font-bold text-sm transition ${isNewProduct ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                ➕ Nuevo Producto
              </button>
              <button onClick={() => setIsNewProduct(false)} className={`flex-1 p-4 rounded-xl border-2 font-bold text-sm transition ${!isNewProduct ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                📂 Añadir a Existente
              </button>
            </div>
            {isNewProduct ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nombre *</label>
                  <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Trofeo Copa del Mundo" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">SKU Base *</label>
                  <input value={productSku} onChange={e => setProductSku(e.target.value.toUpperCase())} className="w-full border rounded-lg p-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500" placeholder="TRF-CDM" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Categoría *</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Selecciona una categoría...</option>
                    {catalogs.categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Descripción</label>
                  <textarea value={productDescription} onChange={e => setProductDescription(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Descripción opcional..."></textarea>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">Selecciona el Producto *</label>
                {existingProducts.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                    No hay productos creados. <button onClick={() => setIsNewProduct(true)} className="underline font-bold">Crea uno nuevo</button>.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {existingProducts.map((p: any) => (
                      <div key={p.id} onClick={() => setBaseProductId(p.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${baseProductId === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="font-bold text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{p.sku} · {p._count?.variants || 0} variante(s)</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === PASO 2: TAMAÑOS (múltiples) === */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Paso 2: Tamaños</h2>
              <p className="text-sm text-gray-500 mt-1">Agrega todos los tamaños disponibles para este producto. Se generará una rama de variantes por cada tamaño.</p>
            </div>

            <div className="space-y-2 max-w-lg">
              {sizes.map((s, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">{i + 1}</div>
                  <input
                    value={s}
                    onChange={e => updateSize(i, e.target.value)}
                    className="flex-1 border-2 rounded-lg p-2.5 font-bold text-base outline-none focus:border-blue-500 transition"
                    placeholder={`Ej. ${["Grande", "Mediano", "Pequeño", "XL", "25cm"][i] || "Tamaño"}`}
                  />
                  {sizes.length > 1 && (
                    <button onClick={() => removeSize(i)} className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition font-bold text-lg">×</button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addSize} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm border-2 border-dashed border-blue-300 hover:border-blue-500 px-4 py-2 rounded-lg transition">
              <span className="text-lg">+</span>
              <span>Agregar otro tamaño</span>
            </button>

            {validSizes.length > 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {validSizes.map(s => (
                  <span key={s} className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">📐 {s}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === PASO 3: COLORES (múltiples) === */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Paso 3: Colores</h2>
              <p className="text-sm text-gray-500 mt-1">Selecciona todos los colores disponibles. Se generarán variantes para cada color elegido.</p>
            </div>

            {catalogs.colors.length === 0 ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-red-700 font-bold mb-2">No hay colores en el catálogo</p>
                <Link href="/admin/catalogos/colores" className="text-blue-600 underline text-sm">→ Ir al Catálogo de Colores</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {catalogs.colors.map((c: any) => (
                    <div key={c.id} onClick={() => toggleColor(c.id)}
                      className={`cursor-pointer p-3 rounded-xl border-2 flex flex-col items-center space-y-2 transition relative ${colorIds.includes(c.id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                      {colorIds.includes(c.id) && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                      )}
                      <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c.hex }}></div>
                      <span className="font-semibold text-xs text-center leading-tight">{c.name}</span>
                      <span className={`text-xs font-bold ${c.stock <= 5 ? 'text-red-500' : 'text-gray-400'}`}>Stock: {c.stock}</span>
                    </div>
                  ))}
                </div>

                {colorIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                    <span className="text-xs text-gray-500 font-bold self-center">Seleccionados:</span>
                    {colorIds.map(id => {
                      const c = catalogs.colors.find((col: any) => col.id === id);
                      return c ? (
                        <span key={id} className="flex items-center space-x-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.hex }}></span>
                          <span>{c.name}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* === PASO 4: FIGURAS Y BASES (múltiples) === */}
        {step === 4 && (
          <div className="space-y-7">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Paso 4: Figuras y Bases</h2>
              <p className="text-sm text-gray-500 mt-1">Selecciona todas las figuras y bases que aplican. Se combinarán entre sí.</p>
            </div>

            {/* Figuras */}
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Figuras Decorativas</h3>
              {catalogs.figures.length === 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-sm">
                  <Link href="/admin/catalogos/figuras" className="text-blue-600 underline">→ Añadir figuras al catálogo</Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {catalogs.figures.map((f: any) => (
                      <div key={f.id} onClick={() => toggleFigure(f.id)}
                        className={`cursor-pointer p-3 rounded-xl border-2 text-center transition relative ${figureIds.includes(f.id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                        {figureIds.includes(f.id) && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                        )}
                        <div className="text-2xl mb-1">🏆</div>
                        <span className="font-semibold text-xs block">{f.name}</span>
                        <span className={`text-xs ${f.stock <= 5 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>Stock: {f.stock}</span>
                      </div>
                    ))}
                  </div>
                  {figureIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {figureIds.map(id => {
                        const f = catalogs.figures.find((fig: any) => fig.id === id);
                        return f ? <span key={id} className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">🏆 {f.name}</span> : null;
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bases */}
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Bases del Trofeo</h3>
              {catalogs.bases.length === 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-sm">
                  <Link href="/admin/catalogos/bases" className="text-blue-600 underline">→ Añadir bases al catálogo</Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {catalogs.bases.map((b: any) => (
                      <div key={b.id} onClick={() => toggleBase(b.id)}
                        className={`cursor-pointer p-3 rounded-xl border-2 text-center transition relative ${baseTypeIds.includes(b.id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                        {baseTypeIds.includes(b.id) && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                        )}
                        <div className="text-2xl mb-1">🪨</div>
                        <span className="font-semibold text-xs block">{b.name}</span>
                        <span className="text-xs text-gray-400">{b.material || "N/A"}</span>
                      </div>
                    ))}
                  </div>
                  {baseTypeIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {baseTypeIds.map(id => {
                        const b = catalogs.bases.find((base: any) => base.id === id);
                        return b ? <span key={id} className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-0.5 rounded-full">🪨 {b.name}</span> : null;
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* === PASO 5: MODALIDADES === */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Paso 5: Modalidades de Personalización</h2>
              <p className="text-sm text-gray-500 mt-1">Para cada combinación anterior, ¿en qué modalidades la venderemos?</p>
            </div>
            <div className="space-y-3">
              {CUSTOM_TYPES.map(type => (
                <label key={type.id} className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition ${customTypes.includes(type.id) ? 'bg-blue-50 border-blue-400' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600 shrink-0" checked={customTypes.includes(type.id)} onChange={() => toggleCustomType(type.id)} />
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-800">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* === PASO 6: TEXTO (CONDICIONAL) === */}
        {step === 6 && (
          <div className="space-y-7">
            <h2 className="text-xl font-bold text-gray-800">Paso 6: Configuración de Texto</h2>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              Esta configuración se aplicará a todas las variantes que incluyan texto.
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Tipografías Permitidas *</h3>
              {catalogs.typographies.length === 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-sm">
                  <Link href="/admin/catalogos/tipografias" className="text-blue-600 underline">→ Añadir tipografías al catálogo</Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {catalogs.typographies.map((t: any) => (
                    <button key={t.id} type="button" onClick={() => toggleTypography(t.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${selectedTypographies.includes(t.id) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Líneas de Texto</h3>
              <div className="space-y-2">
                {textLines.map((line, idx) => (
                  <div key={idx} className="flex space-x-2 items-center bg-gray-50 p-3 rounded-lg border">
                    <input type="text" value={line.label} onChange={e => { const l = [...textLines]; l[idx].label = e.target.value; setTextLines(l); }}
                      className="flex-1 border rounded-lg p-2 text-sm outline-none" placeholder="Ej. Nombre del Torneo" />
                    <input type="number" value={line.maxChars} onChange={e => { const l = [...textLines]; l[idx].maxChars = Number(e.target.value); setTextLines(l); }}
                      className="w-20 border rounded-lg p-2 text-sm text-center font-bold outline-none" />
                    <span className="text-xs text-gray-400 shrink-0">chars</span>
                    {textLines.length > 1 && (
                      <button type="button" onClick={() => setTextLines(textLines.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 font-bold w-8 h-8 flex items-center justify-center shrink-0">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setTextLines([...textLines, { label: "", maxChars: 30 }])}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-1">+ Añadir línea</button>
              </div>
            </div>
          </div>
        )}

        {/* === PASO 7: RESUMEN Y FOTOS === */}
        {step === 7 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Paso 7: Resumen y Fotos</h2>
              <p className="text-sm text-gray-500 mt-1">Se crearán <strong className="text-blue-700">{finalVariants.length} variantes</strong> en total. Asigna precio y foto a cada una.</p>
            </div>

            {/* Precio global rápido */}
            <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-sm font-bold text-amber-700 shrink-0">💡 Precio global:</span>
              <input type="number" placeholder="Aplica un precio a todas..." className="border rounded-lg p-2 text-sm flex-1 max-w-xs outline-none"
                onChange={e => {
                  if (e.target.value) setFinalVariants(prev => prev.map(v => ({ ...v, price: e.target.value })));
                }} />
            </div>

            {/* Lista de variantes */}
            <div className="space-y-3">
              {finalVariants.map((v, idx) => {
                const { color, figure, base, type } = getVariantLabel(v);
                return (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                    {/* Header de la variante */}
                    <div className="bg-gray-50 px-4 py-2 flex flex-wrap gap-1.5 items-center border-b">
                      <span className="font-bold text-xs text-gray-600">#{idx + 1}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">📐 {v.size}</span>
                      {color && <span className="flex items-center space-x-1 bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }}></span>
                        <span>{color.name}</span>
                      </span>}
                      {figure && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">🏆 {figure.name}</span>}
                      {base && <span className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-0.5 rounded-full">🪨 {base.name}</span>}
                      {type && <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">{type.emoji} {type.label}</span>}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Foto */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition cursor-pointer flex flex-col items-center justify-center min-h-[100px]"
                        onClick={() => document.getElementById(`file-${idx}`)?.click()}>
                        {v.imagePreview ? (
                          <img src={v.imagePreview} alt="preview" className="h-24 object-contain rounded" />
                        ) : (
                          <>
                            <div className="text-2xl mb-1">📷</div>
                            <div className="text-xs text-gray-400">Subir foto</div>
                          </>
                        )}
                        <input type="file" id={`file-${idx}`} accept="image/*" className="hidden"
                          onChange={e => handleImageChange(idx, e.target.files?.[0] || null)} />
                      </div>

                      {/* Precio */}
                      <div className="flex flex-col justify-center space-y-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Precio *</label>
                          <div className="flex items-center border-2 rounded-lg overflow-hidden focus-within:border-blue-500">
                            <span className="px-2 py-2 bg-gray-100 text-gray-600 font-bold text-sm">$</span>
                            <input type="number" value={v.price} onChange={e => updateFinalVariant(idx, 'price', e.target.value)}
                              className="flex-1 p-2 font-bold outline-none text-sm" placeholder="0.00" />
                          </div>
                        </div>
                      </div>

                      {/* SKU */}
                      <div className="flex flex-col justify-center space-y-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">SKU (editable)</label>
                          <input type="text" value={v.sku} onChange={e => updateFinalVariant(idx, 'sku', e.target.value)}
                            className="w-full border-2 rounded-lg p-2 font-mono text-xs outline-none focus:border-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer de Navegación */}
      <div className="flex justify-between mt-8 pt-5 border-t border-gray-200">
        <button onClick={handlePrev} disabled={step === 1 || loading}
          className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-30 transition">
          ← Atrás
        </button>
        {step < 7 ? (
          <button onClick={handleNext} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow transition">
            Siguiente →
          </button>
        ) : (
          <button onClick={handleSave} disabled={loading}
            className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg disabled:opacity-50 transition">
            {loading ? `⏳ Creando ${finalVariants.length} variantes...` : `✅ Crear ${finalVariants.length} Variantes`}
          </button>
        )}
      </div>
    </div>
  );
}
