'use client';

import { useState } from 'react';

// Datos de prueba
const MOCK_PROMOTIONS = [
  {
    id: 1,
    title: '50% de Descuento en Trabajo de Electricista',
    //icon: '☀️', // Icono similar al sol/luz de la imagen
  },
  {
    id: 2,
    title: 'Cotización en obras grandes en Trabajos de Albañileria',
    //icon: '🔨',
  },
  {
    id: 3,
    title: '2x1 en Mantenimiento de Jardines',
    //icon: '🌱',
  },
  {
    id: 4,
    title: 'Revisión gratuita de fugas de agua',
    //icon: '💧',
  },
];

export default function PromotionsSection({ fixerId }: { fixerId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para avanzar
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_PROMOTIONS.length);
  };

  // Función para retroceder
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_PROMOTIONS.length) % MOCK_PROMOTIONS.length);
  };

  // Lógica para mostrar 2 tarjetas a la vez (como en tu diseño original adaptable)
  // O ajustamos para intentar mostrar lo que quepa.
  // En la imagen se ven 2 tarjetas completas.
  const visiblePromotions = [
    MOCK_PROMOTIONS[currentIndex],
    MOCK_PROMOTIONS[(currentIndex + 1) % MOCK_PROMOTIONS.length],
  ];

  return (
    <section className="mt-12 w-full max-w-4xl mx-auto">
      
     {/* TÍTULO CON LÍNEA NEGRA */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0C4FE9] inline-block pb-1 border-b-2 border-black">
          Promociones disponibles
        </h2>
      </div>

      <div className="relative flex items-center justify-between px-4">
        
        {/* FLECHA IZQUIERDA (Triángulo Negro) */}
        <button 
          onClick={prevSlide}
          className="p-2 transition hover:scale-110 focus:outline-none"
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <path d="M20 4L4 12L20 20V4Z" /> {/* Triángulo apuntando izquierda */}
          </svg>
        </button>

        {/* CARRUSEL DE TARJETAS */}
        <div className="flex gap-6 overflow-hidden justify-center w-full py-4">
          {visiblePromotions.map((promo) => (
            <div 
              key={promo.id} 
              className="border border-blue-600 p-6 flex flex-col items-center text-center w-64 bg-white shadow-sm"
              style={{ minHeight: '220px' }} // Altura fija para uniformidad
            >
              {/* Título de la promoción */}
              <p className="font-bold text-black text-sm mb-auto px-2 leading-tight">
                {promo.title}
              </p>
              
              {/* Botón Azul "Mas información" */}
              <button className="mt-4 bg-[#1366FD] text-white px-6 py-2 rounded-md text-xs font-bold hover:bg-blue-700 transition w-full">
                Mas información
              </button>
            </div>
          ))}
        </div>

        {/* FLECHA DERECHA (Triángulo Negro) */}
        <button 
          onClick={nextSlide}
          className="p-2 transition hover:scale-110 focus:outline-none"
          aria-label="Siguiente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <path d="M4 4L20 12L4 20V4Z" /> {/* Triángulo apuntando derecha */}
          </svg>
        </button>

      </div>
    </section>
  );
}