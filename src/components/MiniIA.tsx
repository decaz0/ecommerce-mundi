"use client";

import { useState, useEffect, useRef } from "react";

const INITIAL_MESSAGES = [
  "¡Hola! Soy tu Asesora IA Premia. 👋",
  "Te ayudo a encontrar el galardón perfecto.",
  "¿Qué evento estás organizando?",
  "Ej: 'Torneo de baloncesto' o 'Mejor vendedor'."
];

export default function MiniIA() {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Typing animation effect for the loop
  useEffect(() => {
    if (userInteracted) return;

    if (typingIndex < INITIAL_MESSAGES.length) {
      if (charIndex < INITIAL_MESSAGES[typingIndex].length) {
        const timer = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, 50); // Typing speed
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', text: INITIAL_MESSAGES[typingIndex] }]);
          setTypingIndex(prev => prev + 1);
          setCharIndex(0);
        }, 800); // Pause between messages
        return () => clearTimeout(timer);
      }
    } else {
      // Loop the animation after a delay
      const timer = setTimeout(() => {
        setMessages([]);
        setTypingIndex(0);
        setCharIndex(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [typingIndex, charIndex, userInteracted]);

  // Scroll to bottom without scrolling the whole window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, charIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setUserInteracted(true);
    setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      const lowerInput = inputValue.toLowerCase();
      
      if (lowerInput.includes("mundo") || lowerInput.includes("fútbol") || lowerInput.includes("futbol")) {
        response = "¡Excelente! Para fútbol te sugiero nuestra 'Copa del Mundo' réplica o trofeos de columna con figura de balón.";
      } else if (lowerInput.includes("natacion") || lowerInput.includes("natación") || lowerInput.includes("agua")) {
        response = "Para deportes acuáticos, nuestras medallas de natación con acabado especial son las más vendidas.";
      } else if (lowerInput.includes("basquet") || lowerInput.includes("baloncesto")) {
        response = "¡Claro! El 'Trofeo de Basquetball' en acrílico o resina es perfecto para destacar a los mejores encestadores.";
      } else if (lowerInput.includes("empresa") || lowerInput.includes("vendedor") || lowerInput.includes("trabajo")) {
        response = "Para reconocimientos corporativos, te recomiendo nuestras elegantes Plaquetas MDF con Grabado Láser o los Vidrios con Lámina.";
      } else {
        response = "Esa es una gran ocasión. Te sugiero explorar nuestros Productos Destacados, que se adaptan a cualquier evento especial. ¿Te gustaría ver trofeos o medallas?";
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl mx-auto w-full flex flex-col h-[400px]">
      
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-full bg-premia-red flex items-center justify-center text-white text-xl shadow-lg">
          🤖
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-wide text-gray-900 dark:text-white">Asesora IA Premia</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">En línea • Lista para ayudarte</p>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-2 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm ${
            msg.role === 'ai' 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start rounded-tl-sm' 
              : 'bg-premia-red text-white self-end rounded-tr-sm'
          }`}>
            {msg.text}
          </div>
        ))}
        
        {/* Typing animation indicator */}
        {!userInteracted && typingIndex < INITIAL_MESSAGES.length && (
          <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start rounded-tl-sm">
            {INITIAL_MESSAGES[typingIndex].substring(0, charIndex)}
            <span className="animate-pulse border-r-2 border-premia-red ml-1">&nbsp;</span>
          </div>
        )}

        {/* Loading dots when AI is thinking after user input */}
        {userInteracted && isTyping && (
          <div className="max-w-[85%] p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 self-start rounded-tl-sm flex gap-1 items-center h-10">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ej: Busco trofeos para natación..." 
          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-full pl-5 pr-12 py-3 outline-none focus:border-premia-red focus:ring-1 focus:ring-premia-red transition-all"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-2 top-1.5 w-9 h-9 flex items-center justify-center rounded-full bg-premia-red hover:bg-premia-red-dark text-white disabled:opacity-50 transition-colors"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
