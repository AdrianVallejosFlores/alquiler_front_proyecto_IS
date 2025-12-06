'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type PromotionMock = {
  id: number;
  title: string;
  offerId: number;
};

// Datos de prueba (los mismos que ya usabas)
const MOCK_PROMOTIONS: PromotionMock[] = [
  {
    id: 1,
    title: '50% de Descuento en Trabajo de Electricista',
    offerId: 1,
  },
  {
    id: 2,
    title: 'Cotización en obras grandes en Trabajos de Albañileria',
    offerId: 2,
  },
  {
    id: 3,
    title: '2x1 en Mantenimiento de Jardines',
    offerId: 3,
  },
  {
    id: 4,
    title: 'Revisión gratuita de fugas de agua',
    offerId: 4,
  },
];

export default function PromotionsSection({ fixerId }: { fixerId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_PROMOTIONS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_PROMOTIONS.length) % MOCK_PROMOTIONS.length);
  };

  // Siempre calculamos 2, pero en móvil mostraremos solo 1 (el primero)
  const visiblePromotions: PromotionMock[] = [
    MOCK_PROMOTIONS[currentIndex],
    MOCK_PROMOTIONS[(currentIndex + 1) % MOCK_PROMOTIONS.length],
  ];

  const handleMoreInfo = (offerId: number) => {
    router.push(`/mock-offers/${offerId}`);
  };

  return (
    <section className="mt-10 w-full max-w-4xl mx-auto">
      {/* Título */}
      <div className="mb-6 px-2 sm:px-0">
        <h2 className="inline-block border-b-2 border-black pb-1 text-2xl font-bold text-[#0C4FE9]">
          Promociones disponibles
        </h2>
      </div>

      {/* CONTENEDOR RESPONSIVO */}
      <div className="flex flex-col items-center gap-3 px-2 
        sm:flex-row sm:items-center sm:justify-between sm:px-4">        {/* Flecha izquierda (solo desktop / tablet) */}
        <button
          onClick={prevSlide}
          aria-label="Anterior"
          className="hidden h-full items-center justify-center p-2 transition hover:scale-110 focus:outline-none sm:inline-flex"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <path d="M20 4L4 12L20 20V4Z" />
          </svg>
        </button>

        {/* Tarjetas */}
        <div className="flex w-full justify-center gap-4 overflow-hidden py-2">
          {visiblePromotions.map((promo, idx) => (
            <div
              key={promo.id}
              // En móvil solo se muestra la PRIMERA tarjeta,
              // en sm+ se muestran las 2 como en el diseño original.
              className={`flex flex-col items-center rounded-sm border border-blue-600 bg-white text-center shadow-sm
                          px-4 py-6 min-h-[200px] w-full max-w-xs
                          ${idx === 1 ? 'hidden sm:flex' : 'flex'}`}
            >
              <p className="mb-auto px-1 text-sm font-bold leading-tight text-black">
                {promo.title}
              </p>

              <button
                onClick={() => handleMoreInfo(promo.offerId)}
                className="mt-4 w-full rounded-md bg-[#1366FD] px-6 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Mas información
              </button>
            </div>
          ))}
        </div>

        {/* Flecha derecha (solo desktop / tablet) */}
        <button
          onClick={nextSlide}
          aria-label="Siguiente"
          className="hidden h-full items-center justify-center p-2 transition hover:scale-110 focus:outline-none sm:inline-flex"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <path d="M4 4L20 12L4 20V4Z" />
          </svg>
        </button>

        {/* Flechas para móvil (abajo de las tarjetas) */}
        <div className="flex w-full items-center justify-between sm:hidden">
          <button
            onClick={prevSlide}
            aria-label="Anterior"
            className="flex h-8 w-10 items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M20 4L4 12L20 20V4Z" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            aria-label="Siguiente"
            className="flex h-8 w-10 items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M4 4L20 12L4 20V4Z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
