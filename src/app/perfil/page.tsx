"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PerfilPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("premia_logged_in") === "true";
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    
    setNickname(localStorage.getItem("premia_nickname") || "Usuario Estrella");
    setEmail(localStorage.getItem("premia_email") || "usuario@kemik.gt");
    setIsLoaded(true);
  }, [router]);

  if (!isLoaded) return <div className="min-h-screen bg-gray-50 dark:bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-black dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Mi Perfil</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <div className="w-full lg:w-[30%] flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-[#d32f2f] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold uppercase shadow-lg">
                {nickname.charAt(0)}
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest">{nickname}</h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
            
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <button className="w-full text-left p-4 font-bold border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 transition-colors uppercase text-sm tracking-widest flex items-center justify-between">
                <span>Mis Pedidos</span>
                <span>➤</span>
              </button>
              <button className="w-full text-left p-4 font-bold border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors uppercase text-sm tracking-widest text-gray-500 flex items-center justify-between">
                <span>Direcciones Guardadas</span>
                <span>➤</span>
              </button>
              <button className="w-full text-left p-4 font-bold hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors uppercase text-sm tracking-widest text-gray-500 flex items-center justify-between">
                <span>Métodos de Pago</span>
                <span>➤</span>
              </button>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="w-full lg:w-[70%] flex flex-col gap-8">
            
            {/* PEDIDOS ANTERIORES */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black uppercase text-[#d32f2f] mb-6 flex items-center gap-2">
                📦 Pedidos Anteriores
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Dummy Order 1 */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50 dark:bg-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">Pedido #KEM-9842</span>
                      <span className="text-sm font-bold">12 de Junio, 2026</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 dark:text-green-500 font-bold text-xs uppercase bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">Entregado</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center p-2">
                      <img src="/categorias/trofeo clasico.png" alt="Trofeo" className="h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold uppercase text-sm">Trofeo Columna Deportiva (x10)</p>
                      <p className="text-xs text-gray-500">SKU: Campeonato Fútbol</p>
                    </div>
                    <div className="font-black text-lg">Q1,300.00</div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 font-bold uppercase text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Volver a Pedir</button>
                </div>
              </div>
            </div>

            {/* DIRECCIONES */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black uppercase text-[#d32f2f] mb-6 flex items-center gap-2">
                📍 Direcciones Guardadas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address 1 */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 relative bg-gray-50 dark:bg-[#1a1a1a]">
                  <div className="absolute top-4 right-4 bg-[#d32f2f] text-white text-[10px] font-bold uppercase px-2 py-1 rounded">Predeterminada</div>
                  <p className="font-bold uppercase text-sm mb-2">{nickname}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24 calle 0-23 zona 1</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Guatemala, Guatemala</p>
                  <p className="text-xs text-gray-500 font-bold mb-4">+502 5555-5555</p>
                  <div className="flex gap-2 text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                    <button className="hover:underline">Editar</button>
                    <span>|</span>
                    <button className="hover:underline text-red-500">Eliminar</button>
                  </div>
                </div>
                
                {/* Add New */}
                <button className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors text-gray-500">
                  <span className="text-3xl">+</span>
                  <span className="font-bold uppercase text-xs tracking-widest">Agregar Nueva</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
