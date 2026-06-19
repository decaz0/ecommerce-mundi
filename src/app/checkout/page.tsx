"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { guatemalaData, departments } from "../../utils/guatemala";

interface CartItem {
  id: string;
  type: string;
  details: string;
  price: number;
  image: string;
  customization: string[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Form State
  const [shippingMethod, setShippingMethod] = useState("envio");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Guatemala");
  const [municipality, setMunicipality] = useState("Guatemala");
  const [exactAddress, setExactAddress] = useState("");
  const [reference, setReference] = useState("");
  
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDept = e.target.value;
    setDepartment(newDept);
    setMunicipality(guatemalaData[newDept][0]);
  };
  
  const [nit, setNit] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [comments, setComments] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  useEffect(() => {
    // Check auth
    const isLoggedIn = localStorage.getItem("premia_logged_in") === "true";
    if (!isLoggedIn) {
      router.push("/cart");
      return;
    }

    const items = JSON.parse(localStorage.getItem("premia_cart") || "[]");
    if (items.length === 0) {
      router.push("/cart");
    } else {
      setCartItems(items);
      setIsLoaded(true);
    }
  }, [router]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  
  // LOGICA DE ENVÍO: Gratis si subtotal >= 1000
  const shippingCost = subtotal >= 1000 ? 0 : 20;
  const total = subtotal + shippingCost;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderConfirmed(true);
    localStorage.removeItem("premia_cart");
    window.dispatchEvent(new Event("cart_updated"));
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="bg-white dark:bg-[#111] p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 text-center max-w-2xl w-full animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
              ✓
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4 text-gray-900 dark:text-white">¡Orden Confirmada!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Gracias por tu compra. Hemos recibido tu pedido por un total de <strong className="text-black dark:text-white">Q{total.toFixed(2)}</strong> y comenzaremos a trabajar en tus reconocimientos inmediatamente.
            </p>

            <div className="mt-8 mb-8 text-left border-t border-gray-200 dark:border-gray-800 pt-8">
              <h3 className="font-bold uppercase tracking-widest text-sm text-gray-500 mb-4 text-center">Tus productos solicitados:</h3>
              <div className="flex flex-col gap-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <img src={item.image} className="w-16 h-20 object-contain bg-white dark:bg-black rounded-lg p-2 flex-shrink-0" alt={item.type} />
                    <div className="flex-1">
                      <p className="font-black uppercase text-sm">{item.type}</p>
                      <p className="text-[10px] font-bold tracking-widest text-gray-500 mb-2">SKU: {item.details}</p>
                      {item.customization.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-serif italic border-l-2 border-[#d32f2f] pl-2">
                          "{item.customization.join(" / ")}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => router.push("/")}
              className="w-full py-4 bg-[#d32f2f] hover:bg-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoaded) return <div className="min-h-screen bg-gray-50 dark:bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Confirmar Pedido - Dirección y Pago</h1>

        <form onSubmit={handleConfirmOrder} className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE: FORM */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            
            {/* Método de Envío */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#d32f2f] text-white p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <span className="text-lg">✈️</span> Método de Envío
              </div>
              <div className="p-6 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <input type="radio" name="shipping" checked={shippingMethod === "envio"} onChange={() => setShippingMethod("envio")} className="w-4 h-4 text-[#d32f2f]" />
                  <span className="font-bold text-sm">Envío a Domicilio {shippingCost === 0 ? <span className="text-green-500 uppercase ml-2 text-xs">(Gratis)</span> : <span className="text-gray-500 font-normal ml-2 text-xs">(Q20.00)</span>}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <input type="radio" name="shipping" checked={shippingMethod === "recoger"} onChange={() => setShippingMethod("recoger")} className="w-4 h-4 text-[#d32f2f]" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Pasa a recoger</span>
                    <span className="text-xs text-gray-500">Recibirás una notificación cuando tu orden esté lista.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dirección */}
            {shippingMethod === "envio" && (
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4">
                <div className="bg-[#d32f2f] text-white p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                  <span className="text-lg">📍</span> Dirección de Entrega
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre de quien recibe *</label>
                      <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Apellidos de quien recibe *</label>
                      <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Número de teléfono *</label>
                    <div className="flex bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#d32f2f] transition-all">
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-3 border-r border-gray-300 dark:border-gray-700 flex items-center gap-2 select-none">
                        <span className="text-xl leading-none">🇬🇹</span>
                        <span className="text-sm font-bold">+502</span>
                      </div>
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Departamento *</label>
                      <select required value={department} onChange={handleDepartmentChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm">
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Municipio *</label>
                      <select required value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm">
                        {guatemalaData[department]?.map((muni) => (
                          <option key={muni} value={muni}>{muni}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Dirección exacta *</label>
                    <input type="text" required value={exactAddress} onChange={(e) => setExactAddress(e.target.value)} placeholder="Ej. 24 calle 0-23 zona 1" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Referencia o indicaciones (opcional)</label>
                    <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Casa de portón negro, frente al parque..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Facturación */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#d32f2f] text-white p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <span className="text-lg">🧾</span> Información de Facturación
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-[1]">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">NIT/DPI *</label>
                    <input type="text" required value={nit} onChange={(e) => setNit(e.target.value)} placeholder="Ej. 108194361 o C/F" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre / Razón social *</label>
                    <input type="text" required value={billingName} onChange={(e) => setBillingName(e.target.value)} placeholder="Nombre en la factura" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Dirección (opcional)</label>
                  <input type="text" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder="Ciudad" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-[#d32f2f] outline-none transition-all text-sm" />
                </div>
                <p className="text-xs text-gray-500">
                  Si este NIT es exento de IVA, escríbenos a <a href="mailto:conta@correo.com" className="underline text-blue-500">conta@correo.com</a>
                </p>
              </div>
            </div>

            {/* Comentarios */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <span className="text-lg">💬</span> Añadir comentarios sobre tu orden
              </div>
              <div className="p-6">
                <textarea 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Instrucciones especiales para entrega, dudas adicionales, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-gray-400 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#d32f2f] text-white p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <span className="text-lg">💳</span> Método de Pago
              </div>
              <div className="p-4 flex flex-col gap-2">
                {[
                  { id: "tarjeta", label: "Tarjeta de Crédito o Débito" },
                  { id: "cuotas", label: "Cuotas (Cualquier tarjeta)" }
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${paymentMethod === method.id ? 'border-[#d32f2f] bg-orange-50 dark:bg-orange-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="w-4 h-4 text-[#d32f2f]" />
                    <span className="text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
              
              {/* Detalles Tarjeta */}
              {paymentMethod === "tarjeta" && (
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#151515] animate-in fade-in slide-in-from-top-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Detalles de Tarjeta de Crédito</p>
                  <div className="flex gap-2 mb-4">
                    <div className="w-10 h-6 bg-blue-600 rounded"></div>
                    <div className="w-10 h-6 bg-red-500 rounded"></div>
                    <div className="w-10 h-6 bg-yellow-400 rounded"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      required 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="**** **** **** 8953"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-[#d32f2f] outline-none text-sm font-mono tracking-widest"
                    />
                    <input 
                      type="text" 
                      required 
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      placeholder="CVV"
                      maxLength={4}
                      className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-[#d32f2f] outline-none text-sm font-mono tracking-widest text-center"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Productos Seleccionados */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#1a1a1a] dark:bg-black text-white p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <span className="text-lg">🛍️</span> Productos Seleccionados
              </div>
              <div className="p-6 flex flex-col gap-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <img src={item.image} className="w-16 h-20 object-contain bg-white dark:bg-black rounded-lg p-2 flex-shrink-0" alt={item.type} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-black uppercase text-sm text-gray-900 dark:text-white">{item.type}</p>
                        <div className="flex flex-col items-end">
                          {(item as any).isOffer && (
                            <span className="text-gray-400 line-through text-[10px] font-bold">Q{(item as any).originalPrice?.toFixed(2)}</span>
                          )}
                          <p className="font-black text-[#d32f2f]">Q{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-500 mb-2">SKU: {item.details}</p>
                      {item.customization.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-serif italic border-l-2 border-[#d32f2f] pl-2">
                          "{item.customization.join(" / ")}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: SUMMARY */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Total de Tu Orden</h2>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 uppercase font-bold">Sub-Total Productos:</span>
                  <span className="font-black">Q{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 uppercase font-bold">Envío:</span>
                  <span className={`font-black ${shippingCost === 0 ? "text-green-500" : ""}`}>
                    {shippingMethod === "recoger" ? "Q0.00" : shippingCost === 0 ? "GRATIS" : `Q${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800 mb-8">
                <span className="text-xl font-black">TOTAL:</span>
                <span className="text-3xl font-black text-[#d32f2f]">
                  Q{(shippingMethod === "recoger" ? subtotal : total).toFixed(2)}
                </span>
              </div>

              <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
                Al confirmar la orden, confirmo que he leído y acepto los <strong>Términos y Condiciones</strong>, <strong>Política de Devolución</strong> y <strong>Garantía</strong>.
              </p>

              <button 
                type="submit"
                className="w-full py-4 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-black uppercase tracking-widest rounded-lg transition-all shadow-[0_10px_20px_rgba(211,47,47,0.3)] hover:scale-[1.02] active:scale-95 text-lg"
              >
                Confirmar Orden
              </button>
            </div>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}
