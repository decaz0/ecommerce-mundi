"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MiniIA from "../components/MiniIA";
import { SplineScene } from "../components/SplineScene";

// Custom hook for Scroll Animations
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Only trigger once
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15 } // Trigger when 15% visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Wrapper component for Scroll Reveal
function RevealOnScroll({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-24 scale-95"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Custom hook for Scroll Y Position (Parallax)
function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

// Slides Configuration (Images and Videos supported)
const HERO_SLIDES = [
  {
    title: "Encuentra tu",
    highlight: "Reconocimiento",
    subtitle: "Ideal",
    desc: "Diseñamos y fabricamos los trofeos, medallas y plaquetas más premium de Centro América.",
    button: "Explorar Modelo 3D",
    type: "spline", 
    src: "https://prod.spline.design/zbWkue63YRffMYty/scene.splinecode", 
    bg: "bg-[#050505]",
    href: "#mini-ia",
  },
  {
    title: "Ofertas de",
    highlight: "Temporada",
    subtitle: "Exclusivas",
    desc: "Aprovecha descuentos especiales en la línea corporativa y deportiva por tiempo limitado.",
    button: "Ver Promociones",
    type: "image",
    src: "/ofertas.png", 
    bg: "bg-[#800000]",
    href: "/vidrios",
  },
  {
    title: "Descubre los",
    highlight: "Nuevos Ingresos",
    subtitle: "2026",
    desc: "Acabados vanguardistas en cristal y metal para premiar la excelencia al más alto nivel.",
    button: "Ver Colección",
    type: "image",
    src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop", // Cycling winner
    bg: "bg-[#0a0a0a]",
    href: "#categorias",
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollY = useScrollY();

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  const handlePrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  return (
    <>
      <Header />
      
      {/* HERO SECTION - MEDIA CAROUSEL (IMAGES / VIDEOS / SPLINE) */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-black">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
            }`}
          >
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {slide.type === "spline" ? (
                <div 
                  className="absolute inset-0 w-full h-full lg:w-[60%] lg:left-[40%] cursor-grab active:cursor-grabbing will-change-transform"
                  style={{ transform: `translateY(${scrollY * 0.4}px)` }}
                >
                  <SplineScene scene={slide.src} className="w-full h-full" />
                </div>
              ) : slide.type === "video" ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover opacity-60"
                  src={slide.src}
                />
              ) : (
                <img 
                  src={slide.src} 
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-50"
                />
              )}
            </div>
            
            {/* Ambient Background Glow (Red Tint Overlay) - pointer-events-none allows clicks to pass through to 3D */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none"></div>
            
            {/* The wrapper is pointer-events-none to let you drag the 3D model anywhere, but pointer-events-auto on the text box */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-20 pointer-events-none">
              {/* Text Content with staggered fade-in */}
              <div className="flex flex-col gap-6 text-white max-w-2xl pointer-events-auto">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight uppercase overflow-hidden">
                  <span className={`block transition-all duration-[1200ms] ease-out ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"}`}>
                    {slide.title}
                  </span>
                  <span className={`block text-[#d32f2f] transition-all duration-[1200ms] delay-100 ease-out ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"}`}>
                    {slide.highlight}
                  </span>
                  <span className={`block transition-all duration-[1200ms] delay-200 ease-out ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"}`}>
                    {slide.subtitle}
                  </span>
                </h1>
                
                <p className={`text-white/80 text-xl font-light leading-relaxed transition-all duration-1000 delay-500 ${index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  {slide.desc}
                </p>
                
                <div className={`mt-4 transition-all duration-1000 delay-700 ${index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <Link href={slide.href || "/store"} className="inline-flex items-center justify-center px-10 py-4 bg-[#d32f2f] text-white hover:bg-red-800 font-black uppercase tracking-widest rounded-none shadow-2xl transition-all duration-500 group">
                    <span className="relative overflow-hidden">
                      <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">{slide.button}</span>
                      <span className="inline-block absolute left-0 top-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0">{slide.button}</span>
                    </span>
                    <span className="ml-3 group-hover:translate-x-3 transition-transform duration-500">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* INVISIBLE NAVIGATION BUTTONS */}
        <button 
          className="absolute left-0 top-0 w-[15%] h-full z-40 cursor-w-resize bg-transparent" 
          onClick={handlePrevSlide}
          aria-label="Anterior"
        />
        <button 
          className="absolute right-0 top-0 w-[15%] h-full z-40 cursor-e-resize bg-transparent" 
          onClick={handleNextSlide}
          aria-label="Siguiente"
        />

        {/* Carousel Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1 transition-all duration-700 ease-out ${
                index === currentSlide ? "w-16 bg-[#d32f2f]" : "w-6 bg-white/30 hover:bg-white/60 hover:w-10"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIAS (SCROLL ANIMATED) */}
      <section className="py-40 bg-white dark:bg-[#121212] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-24">
              <span className="text-[#d32f2f] font-black text-sm uppercase tracking-[0.3em]">Catálogo Principal</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black dark:text-white mt-4">
                Nuestras Categorías
              </h2>
            </div>
          </RevealOnScroll>

          {/* Exact categories requested: Vidrios, Medallas, Plaquetas MDF, Trofeos, PLS, Botones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Vidrios", image: "/categorias/vidrio.png", desc: "La más alta sofisticación en reconocimientos corporativos. Grabados en alta resolución.", href: "/vidrios" },
              { title: "Medallas", image: "/categorias/medallas.png", desc: "Forjadas con precisión milimétrica. Opciones personalizadas o genéricas para eventos de toda magnitud.", href: "/medallas/builder" },
              { title: "Plaquetas MDF", image: "/categorias/plaquetas.png", desc: "Tributo atemporal con acabados premium en maderas nobles combinadas con acrílico y metal.", href: "/plaquetas" },
              { title: "Trofeos", image: "/categorias/trofeos.png", desc: "Estructuras imponentes diseñadas para celebrar campeonatos, torneos y logros legendarios.", href: "/trofeos" },
              { title: "PLS (Plasmas)", image: "/categorias/plasmas.png", desc: "Figuras especializadas, estéticas y versátiles para todas las disciplinas deportivas y académicas.", href: "/trofeos-plasma/builder" },
              { title: "Botones", image: "/categorias/botones.png", desc: "Pines y botones promocionales de alta calidad para distinguir a tu equipo en cualquier evento.", href: "/botones" },
            ].map((prod, index) => (
              <RevealOnScroll key={index} delay={index * 150}>
                <Link href={prod.href} className="group relative bg-gray-50 dark:bg-[#161616] h-[400px] rounded-none overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(211,47,47,0.15)] transition-all duration-[800ms] flex flex-col justify-end p-10 cursor-pointer border-b-4 border-transparent hover:border-[#d32f2f] block">
                  {/* Background Image */}
                  <img src={prod.image} alt={prod.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-all duration-[1200ms] z-0 bg-white" />
                  
                  {/* Gradient Overlay to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-0"></div>

                  {/* Hover background slide */}
                  <div className="absolute inset-0 bg-[#d32f2f] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 opacity-95"></div>
                  
                  {/* Content */}
                  <div className="relative z-20 w-full transform group-hover:-translate-y-6 transition-transform duration-700">
                    <h3 className="font-black text-3xl text-white group-hover:text-white transition-colors duration-500 uppercase tracking-tight mb-4 drop-shadow-lg">
                      {prod.title}
                    </h3>
                    
                    {/* Detailed Description */}
                    <div className="overflow-hidden">
                      <p className="text-gray-300 group-hover:text-white/90 transition-colors duration-500 text-base leading-relaxed transform opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
                        {prod.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-40 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-24">
              <span className="text-[#d32f2f] font-black text-sm uppercase tracking-[0.3em]">Destacados</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black dark:text-white mt-4">
                Lo Más Buscado
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                name: "Vidrio Hexágono", 
                img: "/categorias/vidrio hexagono.png", 
                desc: "Corte geométrico de 6 lados con base de mármol. Incluye grabado láser premium en placa dorada.",
                link: "/vidrios/builder?model=hexagono"
              },
              { 
                name: "Trofeo Columna Deportiva", 
                img: "/categorias/RF11.png", 
                desc: "Trofeo de columna personalizable ideal para torneos y competiciones deportivas de alto nivel.",
                link: "/trofeos/builder?model=futbol"
              },
              { 
                name: "Plaqueta de Reconocimiento", 
                img: "/categorias/plaqueta.png", 
                desc: "Elegante plaqueta de madera y metal, perfecta para honrar trayectorias y logros corporativos.",
                link: "/plaquetas/builder"
              }
            ].map((item, index) => (
              <RevealOnScroll key={index} delay={index * 200}>
                <div className="group bg-white dark:bg-[#161616] rounded-none overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 flex flex-col h-full relative">
                  
                  {/* Etiqueta Lo Más Vendido */}
                  <div className="absolute top-4 right-4 bg-[#d32f2f] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-20 shadow-lg">
                    Lo Más Vendido
                  </div>

                  <Link href={item.link} className="aspect-square bg-white dark:bg-[#111] flex items-center justify-center relative overflow-hidden p-8 cursor-pointer block">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-[1500ms] ease-out" />
                  </Link>
                  <div className="p-10 text-center flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-black text-2xl text-black dark:text-white mb-4 uppercase">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{item.desc}</p>
                    </div>
                    <Link href={item.link} className="w-full block py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300">
                      Personalizar
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* MINI IA RECOMMENDER */}
      <section id="mini-ia" className="py-40 bg-white dark:bg-[#121212] relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d32f2f]/5 dark:bg-[#d32f2f]/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <RevealOnScroll>
            <div className="pr-0 lg:pr-12">
              <span className="text-[#d32f2f] font-black text-sm uppercase tracking-[0.3em]">Asistencia Inteligente</span>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mt-4 mb-8 text-black dark:text-white">
                ¿No sabes qué elegir?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-10 text-xl font-light leading-relaxed">
                Indícanos qué clase de evento estás organizando y nuestra Asesora de IA analizará al instante nuestro inventario para recomendarte la pieza exacta que elevará el prestigio de tu ceremonia.
              </p>
              <div className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest text-black dark:text-white">
                <div className="flex items-center gap-6 p-2 transform hover:translate-x-4 transition-transform duration-500 cursor-default">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-[#d32f2f] rounded-full flex items-center justify-center text-xl">⚡</div>
                  Respuestas instantáneas
                </div>
                <div className="flex items-center gap-6 p-2 transform hover:translate-x-4 transition-transform duration-500 cursor-default">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-[#d32f2f] rounded-full flex items-center justify-center text-xl">🎯</div>
                  Precisión disciplinaria
                </div>
              </div>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300}>
            <div className="relative">
              {/* Outer decorative frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d32f2f] to-red-900 blur-xl opacity-20 dark:opacity-40 animate-pulse"></div>
              <div className="relative bg-white dark:bg-[#161616] shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <MiniIA />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ABOUT US / HISTORY */}
      <section id="nosotros" className="py-40 bg-[#050505] text-white">
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[#d32f2f] font-black text-sm uppercase tracking-[0.3em]">Nuestra Historia</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-4 mb-12">¿Quiénes Somos?</h2>
            
            <div className="text-gray-400 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed font-light">
              <p>
                Somos la empresa líder de reconocimientos más grande de Centro América, con más de 40 años de excelencia. Una corporación respaldada por el talento de más de 200 colaboradores y un robusto portafolio para consagrar tus mayores triunfos.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
