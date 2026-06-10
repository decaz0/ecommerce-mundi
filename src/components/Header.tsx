"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isBuilder = pathname?.includes("/builder");

  useEffect(() => {
    // Check dark mode
    if (localStorage.theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Check cart count
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("premia_cart") || "[]");
        setCartCount(cart.length);
      } catch (e) {
        setCartCount(0);
      }
    };

    // Check auth
    const updateAuthState = () => {
      setIsLoggedIn(localStorage.getItem("premia_logged_in") === "true");
      setNickname(localStorage.getItem("premia_nickname") || "");
    };

    updateCartCount();
    updateAuthState();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart_updated", updateCartCount);
    window.addEventListener("auth_changed", updateAuthState);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart_updated", updateCartCount);
      window.removeEventListener("auth_changed", updateAuthState);
    };
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDarkMode(true);
    }
  };

  const [pendingNavigationHref, setPendingNavigationHref] = useState<string | null>(null);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    if (isBuilder) {
      e.preventDefault();
      setPendingNavigationHref(targetHref);
    }
  };

  const confirmNavigation = () => {
    if (pendingNavigationHref) {
      router.push(pendingNavigationHref);
      setPendingNavigationHref(null);
    }
  };

  const cancelNavigation = () => {
    setPendingNavigationHref(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-t-4 border-t-premia-red border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" onClick={(e) => handleNavigation(e, "/")} className="flex items-center">
              <img src="/logo premia.webp" alt="Grupo Premia Logo" className="h-10 w-auto object-contain dark:drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]" />
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 items-center font-bold text-xs uppercase tracking-widest text-black dark:text-white">
            <Link href="/store" onClick={(e) => handleNavigation(e, "/store")} className="hover:text-premia-red transition-colors">Catálogo</Link>
            <Link href="/#nosotros" onClick={(e) => handleNavigation(e, "/#nosotros")} className="hover:text-premia-red transition-colors">Nosotros</Link>
            <Link href="/#mini-ia" onClick={(e) => handleNavigation(e, "/#mini-ia")} className="hover:text-premia-red transition-colors">Asesor IA</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {nickname || "Usuario Estrella"}
                  </span>
                  <span className="text-[10px] text-gray-500">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <Link href="#" className="block px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      👤 Mi Perfil
                    </Link>
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        localStorage.removeItem("premia_logged_in");
                        // We don't remove the nickname, so it remembers them next time they login
                        window.dispatchEvent(new Event("auth_changed"));
                        if (pathname === '/checkout') {
                          router.push('/cart');
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-gray-800"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex px-4 py-2 text-sm font-bold bg-premia-red text-white rounded-lg hover:bg-premia-red-dark transition-colors"
              >
                Iniciar Sesión
              </button>
            )}

            <Link href="/cart" onClick={(e) => handleNavigation(e, "/cart")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative cursor-pointer">
              🛒
              <span className="absolute top-0 right-0 w-4 h-4 bg-premia-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* MODAL DE CONFIRMACIÓN DE SALIDA */}
      {pendingNavigationHref && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            
            <div className="bg-[#d32f2f] p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white">⚠️</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">¿Deseas Salir?</h2>
            </div>
            
            <div className="p-8 text-center flex flex-col gap-8">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Si abandonas esta página ahora, <strong className="text-black dark:text-white font-bold">perderás todos los cambios</strong> que has realizado en tu diseño actual.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={cancelNavigation}
                  className="flex-1 py-4 bg-gray-100 dark:bg-[#1a1a1a] text-black dark:text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
                >
                  Seguir Diseñando
                </button>
                <button 
                  onClick={confirmNavigation}
                  className="flex-1 py-4 bg-[#d32f2f] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20"
                >
                  Estoy de Acuerdo
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
