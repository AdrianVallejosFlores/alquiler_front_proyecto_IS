"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    type: "normal",
    image: "/img1.jpg",
    title: "Servicios de plomería a domicilio",
    description:
      "Profesionales calificados listos para ayudarte con reparaciones y mantenimiento del hogar. Atendemos urgencias y proyectos grandes o pequeños.",
  },
  {
    type: "normal",
    image: "/img2.jpg",
    title: "Servicios de albañilería y construcción",
    description:
      "Expertos en remodelaciones, ampliaciones y trabajos estructurales con materiales de calidad y acabados profesionales.",
  },
  {
    type: "normal",
    image: "/img3.jpg",
    title: "Carpinteros especializados en muebles y estructuras",
    description:
      "Diseñamos, reparamos y fabricamos muebles personalizados con precisión y dedicación artesanal.",
  },

  //  SLIDE DEL CHATBOT (imagen + texto azul + botón blanco)
  {
    type: "chatbot",
    image: "/chatbot.jpeg",
    title: "¿Tienes dudas? Habla con nuestro Asistente Servineo",
    description:
      "Ahora contamos con un chatbot que responde tus preguntas sobre servicios y disponibilidad en tiempo real. Interactúa ahora mismo con nuestro asistente en WhatsApp..",
  },
];

export default function CarruselInspirador() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [current, isPaused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 mx-auto scroll-smooth"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Contenedor de slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-center w-full flex-shrink-0 p-4"
          >
            {/* ⭐ SLIDES NORMALES ⭐ */}
            {slide.type === "normal" && (
              <>
                {/* Imagen */}
                <div className="w-full md:w-1/2 flex justify-center items-center bg-blue-100 rounded-2xl md:rounded-none md:rounded-l-2xl overflow-hidden p-2 md:p-4">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-[95%] md:w-[90%] h-auto md:h-[460px] object-contain rounded-2xl shadow-md transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>

                {/* Texto */}
                <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 text-[#2a87ff]">
                    {slide.title}
                  </h2>

                  <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 max-w-[90%] md:max-w-none">
                    {slide.description}
                  </p>

                  <a
                    href="#trabajos-recientes"
                    className="inline-block px-5 py-2 sm:px-6 sm:py-3 bg-[#2a87ff] text-white rounded-lg text-sm sm:text-base hover:bg-blue-600 transition"
                  >
                    Ver más
                  </a>
                </div>
              </>
            )}

            {/* ⭐ SLIDE CHATBOT (azul + imagen + botón a WhatsApp) ⭐ */}
            {slide.type === "chatbot" && (
              <>
                {/* Imagen del robot */}
                <div className="w-full md:w-1/2 flex justify-center items-center bg-blue-100 rounded-2xl md:rounded-none md:rounded-l-2xl overflow-hidden p-2 md:p-4">
                  <img
                    src={slide.image}
                    alt="Chatbot"
                    className="w-[95%] md:w-[90%] h-auto md:h-[460px] object-contain rounded-2xl shadow-md"
                  />
                </div>

                {/* Texto y botón */}
                <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-center items-center md:items-start text-center md:text-left">

                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 text-[#2a87ff]">
                    {slide.title}
                  </h2>

                  <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 max-w-[90%] md:max-w-none">
                    {slide.description}
                  </p>

                  {/* ⭐ Botón blanco que abre WhatsApp ⭐ */}
                  <a
                    href="https://wa.me/59160379823?text=Hola%20necesito%20ayuda"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform"
                  >
                    🤖 Iniciar Chat con Servineo
                  </a>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 text-[#2a87ff] rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#2a87ff] hover:text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 text-[#2a87ff] rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#2a87ff] hover:text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
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
    </div>
  );
}
