"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";

interface BulkItem {
  color?: string;
  size?: string;
  lines: string[];
}

interface CartItem {
  id: string;
  type: string;
  details: string;
  price: number;
  quantity?: number;
  image: string;
  customization: string[];
  variations?: BulkItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    setCartItems(items);
    setIsLoaded(true);
  }, []);

  const handleRemove = (id: string) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem("premia_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleProceedToCheckout = () => {
    const isLoggedIn = localStorage.getItem("premia_logged_in") === "true";
    if (isLoggedIn) {
      router.push("/checkout");
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Carrito de Compras</h1>

        {!isLoaded ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Explora nuestro catálogo para encontrar el reconocimiento perfecto.</p>
            <Link href="/" className="px-8 py-4 bg-[#d32f2f] text-white font-bold rounded-xl hover:bg-red-800 transition-colors inline-block uppercase tracking-widest">
              Volver a la Tienda
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[70%] flex flex-col gap-4">
              {cartItems.map((item) => {
                const itemQty = item.quantity || 1;
                const isExpanded = expandedItems[item.id];
                
                return (
                <div key={item.id} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-32 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                      <img src={item.image} alt={item.type} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-xl uppercase tracking-tight">{item.type}</h3>
                        <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-[#d32f2f] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">SKU: {item.details}</p>
                      
                      <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Qty: {itemQty}</div>

                      {/* Botón para ver variantes si existen */}
                      {item.variations && item.variations.length > 0 && (
                        <button 
                          onClick={() => toggleExpand(item.id)}
                          className="text-xs font-bold text-[#00b0ff] uppercase flex items-center gap-1 hover:underline w-max"
                        >
                          {isExpanded ? 'OCULTAR GRABADOS' : 'VER TEXTOS DE GRABADO'}
                        </button>
                      )}

                      {/* Grabado Clásico (Legacy/Simple) */}
                      {!item.variations && (item.customization.length > 0 || (item as any).medallionImage) && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800/30 mt-2">
                          {item.customization.length > 0 && (
                            <>
                              <p className="text-[10px] font-black uppercase text-yellow-800 dark:text-yellow-600 mb-1">Grabado Seleccionado:</p>
                              <div className="font-serif text-sm italic text-gray-700 dark:text-gray-300">
                                {item.customization.map((line, i) => (
                                  <div key={i}>"{line}"</div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-end items-end sm:items-center sm:justify-center">
                      {(item as any).isOffer && (
                        <span className="text-gray-400 line-through text-sm font-bold">Q{((item as any).originalPrice * itemQty).toFixed(2)}</span>
                      )}
                      <span className="text-2xl font-black text-[#d32f2f]">Q{(item.price * itemQty).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Detalle de Variantes Desplegable */}
                  {isExpanded && item.variations && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                      {item.variations.map((v, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#d32f2f] mb-3">
                            Grabado {idx + 1} de {item.variations?.length}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            {v.color && (
                              <div className="text-xs"><span className="font-bold text-gray-500 uppercase">Color:</span> {v.color}</div>
                            )}
                            {v.size && (
                              <div className="text-xs"><span className="font-bold text-gray-500 uppercase">Tamaño:</span> {v.size}"</div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            {v.lines.map((line, lIdx) => (
                              <div key={lIdx} className="text-sm font-serif">
                                <span className="font-bold text-gray-400 mr-2 font-sans text-xs">Línea {lIdx + 1}:</span>
                                {line || <span className="text-gray-300 italic">(Vacio)</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )})}
            </div>

            <div className="w-full lg:w-[30%]">
              <div className="bg-[#0a0a0a] text-white rounded-3xl p-8 sticky top-24 shadow-2xl">
                <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">Resumen de Orden</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold">Q{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-gray-400">Envío</span>
                  <span className="text-green-500 font-bold uppercase text-xs tracking-widest flex items-center">A calcular en pago</span>
                </div>
                <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-800">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-3xl font-black text-[#d32f2f]">Q{total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-[#d32f2f] hover:bg-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(211,47,47,0.4)]"
                >
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

      <Footer />
    </div>
  );
}
