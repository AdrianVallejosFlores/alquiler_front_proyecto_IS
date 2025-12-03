"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const slides = [
  {
    type: "normal",
    image: "/img1.jpg",
    title: "Servicios de plomería a domicilio",
    description:
      "Contamos con profesionales calificados para atender cualquier emergencia en tu hogar.",
  },
  {
    type: "normal",
    image: "/img2.jpg",
    title: "Electricistas certificados",
    description:
      "Encuentra electricistas con experiencia y garantía de servicio.",
  },
  {
    type: "normal",
    image: "/img3.jpg",
    title: "Limpieza profesional",
    description:
      "Servicios de limpieza para hogares, oficinas y negocios con los mejores precios.",
  },
  // ⭐ SLIDE DEL CHATBOT (Agregado desde HEAD)
  {
    type: "chatbot",
    image: "/chatbot.jpeg",
    title: "¿Tienes dudas? Habla con nuestro Asistente Servineo",
    description:
      "Ahora contamos con un chatbot que responde tus preguntas sobre servicios y disponibilidad en tiempo real. Interactúa ahora mismo con nuestro asistente en WhatsApp.",
  },
];

export default function CarruselInspirador() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, current]);

  const handleVerMas = () => {
    const start = window.scrollY;
    const end = start + 2500;
    const duration = 2500;
    let startTime: number | null = null;

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const scroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      window.scrollTo(0, start + (end - start) * ease);

      if (elapsed < duration) requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  };

  const handlePorQueServineo = () => {
    router.push("/porqueservineo");
  };

  // Variants para animaciones de texto
  const textVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.42, 0, 1, 1] },
    },
  };

  return (
    <section
      className="
        relative w-full overflow-hidden shadow-lg bg-white flex flex-col md:flex-row
        h-auto md:h-[420px]
        rounded-none md:rounded-2xl
        mt-0! pt-0!
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* === IZQUIERDA: IMAGENES (Next/Image + Fade) === */}
      <div className="relative w-full md:w-1/2 h-[300px] md:h-full !mt-0 !pt-0 bg-blue-50">
        {slides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            fill
            className={`
              ${slide.type === "chatbot" ? "object-contain p-4" : "object-cover"} 
              transition-opacity duration-1000 ease-in-out 
              ${index === current ? "opacity-100" : "opacity-0"}
            `}
            priority={index === 0}
          />
        ))}
      </div>

      {/* === DERECHA: TEXTO Y BOTONES (Framer Motion) === */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center px-6 md:px-8 py-6 md:py-0 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <h2 className="text-xl md:text-3xl font-bold mb-4 text-[#2a87ff]">
              {slides[current].title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
              {slides[current].description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
              {/* LÓGICA CONDICIONAL DE BOTONES */}
              {slides[current].type === "chatbot" ? (
                // Botón especial para WhatsApp (del HEAD)
                <a
                  href="https://wa.me/59160379823?text=Hola%20necesito%20ayuda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 hover:scale-105 transition-all"
                >
                  🤖 Iniciar Chat con Servineo
                </a>
              ) : (
                // Botones normales (del ORIGIN)
                <>
                  <button
                    onClick={handleVerMas}
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-full shadow-md w-full sm:w-auto"
                  >
                    Ver más
                  </button>
                  <button
                    onClick={handlePorQueServineo}
                    className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 px-6 py-3 rounded-full shadow-md w-full sm:w-auto"
                  >
                    ¿Por qué Servineo?
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* === FLECHAS DE NAVEGACIÓN === */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full z-10 transition-colors"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full z-10 transition-colors"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
      
      {/* Indicadores (Puntos) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "bg-[#2a87ff] scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}