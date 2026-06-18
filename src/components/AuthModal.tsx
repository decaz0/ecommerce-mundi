"use client";

import { useState } from "react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const handleAuth = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    // Simulamos un inicio de sesión exitoso guardando en localStorage
    localStorage.setItem("premia_logged_in", "true");
    
    // Si escribió un nickname, lo usamos. Si no, conservamos el que ya tenía o usamos uno por defecto.
    const existingNickname = localStorage.getItem("premia_nickname");
    const finalNickname = nickname.trim() ? nickname : (existingNickname || "Usuario Estrella");
    localStorage.setItem("premia_nickname", finalNickname);
    
    // Guardamos el email
    if (email.trim()) {
      localStorage.setItem("premia_email", email.trim());
    } else if (!localStorage.getItem("premia_email")) {
      localStorage.setItem("premia_email", "usuario@kemik.gt");
    }
    
    window.dispatchEvent(new Event("auth_changed"));
    
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tight mb-2 uppercase text-center">
            {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Únete a la plataforma líder de reconocimientos
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <button onClick={handleAuth} className="flex items-center justify-center gap-3 w-full py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg font-black">G</span> {isRegister ? "Registrarse" : "Iniciar Sesión"} con Google
            </button>
            <button onClick={handleAuth} className="flex items-center justify-center gap-3 w-full py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-[#1877F2] text-white hover:text-white border-transparent">
              <span className="text-lg font-bold">f</span> {isRegister ? "Registrarse" : "Iniciar Sesión"} con Facebook
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-sm text-gray-400">o con email</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Nickname (Apodo)
                  </label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-premia-red outline-none transition-all"
                    placeholder="Ej. Campeón23"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-premia-red outline-none transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-premia-red outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-premia-red hover:bg-premia-red-dark text-white font-bold rounded-lg transition-colors"
            >
              {isRegister ? "Registrarse" : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-bold text-premia-red hover:underline"
            >
              {isRegister ? "Inicia Sesión" : "Regístrate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
