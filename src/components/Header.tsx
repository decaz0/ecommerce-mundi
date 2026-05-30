"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Only check local storage, default to light mode
    if (localStorage.theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-t-4 border-t-premia-red border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl font-black tracking-tighter text-premia-red uppercase flex items-center gap-2">
              <span className="text-4xl">🏆</span> GRUPO PREMIA
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 items-center font-bold text-xs uppercase tracking-widest text-black dark:text-white">
            <Link href="/store" className="hover:text-premia-red transition-colors">Catálogo</Link>
            <Link href="/#nosotros" className="hover:text-premia-red transition-colors">Nosotros</Link>
            <Link href="/#mini-ia" className="hover:text-premia-red transition-colors">Asesor IA</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex px-4 py-2 text-sm font-bold bg-premia-red text-white rounded-lg hover:bg-premia-red-dark transition-colors"
            >
              Iniciar Sesión
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
              🛒
              <span className="absolute top-0 right-0 w-4 h-4 bg-premia-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal rendered conditionally */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
