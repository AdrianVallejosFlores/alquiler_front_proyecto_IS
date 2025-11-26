'use client';

import React, { useEffect, useRef, CSSProperties, useState } from 'react';
import { guideSteps, GuideStep } from '../data/guide-steps';

interface InteractiveGuideProps {
  isActive: boolean;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onRestart: () => void;
}

const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  isActive,
  currentStep,
  onNext,
  onPrev,
  onClose,
  onRestart
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const isValidStep = currentStep >= 0 && currentStep < guideSteps.length;
  const currentStepData: GuideStep | undefined = isValidStep ? guideSteps[currentStep] : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  // DEBUG: Ver qué está pasando - CORREGIDO: usar currentStep en lugar de currentStepData
  useEffect(() => {
    if (isActive) {
      console.log('🔍 [GUIDE DEBUG] Guía activa, paso:', currentStep);
      console.log('🔍 [GUIDE DEBUG] Datos del paso:', guideSteps[currentStep]);
      
      const stepData = guideSteps[currentStep];
      if (stepData?.targetElement) {
        console.log('🔍 [GUIDE DEBUG] Buscando elemento:', stepData.targetElement);
        const element = document.querySelector(stepData.targetElement);
        console.log('🔍 [GUIDE DEBUG] Elemento encontrado:', element);
        if (element) {
          console.log('🔍 [GUIDE DEBUG] Posición del elemento:', element.getBoundingClientRect());
        }
      }
    }
  }, [isActive, currentStep]); // SOLO currentStep, no currentStepData

  useEffect(() => {
    if (isActive && currentStepData?.targetElement && mounted) {
      console.log('🔍 [GUIDE DEBUG] Intentando scroll a elemento:', currentStepData.targetElement);
      
      const scrollToElement = () => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          console.log('🔍 [GUIDE DEBUG] Elemento encontrado, haciendo scroll');
          
          // Método más agresivo para asegurar el scroll
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center' 
          });
          
          // Forzar un re-flow
          targetElement.getBoundingClientRect();
          
        } else {
          console.log('🔍 [GUIDE DEBUG] ERROR: Elemento NO encontrado:', currentStepData.targetElement);
          // Intentar nuevamente después de un delay
          setTimeout(() => {
            const retryElement = document.querySelector(currentStepData.targetElement!);
            console.log('🔍 [GUIDE DEBUG] Reintento - elemento encontrado:', retryElement);
            if (retryElement) {
              retryElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }, 500);
        }
      };

      const timer = setTimeout(scrollToElement, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, currentStepData?.targetElement, mounted]);

  if (!isActive || !currentStepData || !mounted) {
    console.log('🔍 [GUIDE DEBUG] No renderizando - isActive:', isActive, 'currentStepData:', currentStepData, 'mounted:', mounted);
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const getHighlightPosition = (): CSSProperties => {
    if (!currentStepData.targetElement) return {};

    const targetElement = document.querySelector(currentStepData.targetElement);
    if (!targetElement) {
      console.log('🔍 [GUIDE DEBUG] No se pudo encontrar elemento para resaltar:', currentStepData.targetElement);
      return {};
    }

    const rect = targetElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    console.log('🔍 [GUIDE DEBUG] Calculando posición highlight:', {
      top: rect.top,
      scrollY,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });

    return {
      position: 'fixed',
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      width: rect.width,
      height: rect.height,
      borderRadius: '8px',
      boxShadow: `
        0 0 0 9999px rgba(17, 37, 90, 0.7),
        0 0 0 3px #2a87ff, 
        0 0 25px rgba(42, 135, 255, 0.8)
      `,
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    };
  };

  const isWelcomeStep = currentStep === 0;
  const isFinalStep = currentStepData.isFinalStep;

  // Renderizar paso de bienvenida (SIMPLIFICADO - como en tu imagen)
  const renderWelcomeStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-[#d8ecff] w-full max-w-2xl mx-4">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-[#11255A] mb-2">
            ¡Bienvenido a SERVINEO!
          </h2>
          <p className="text-gray-600 text-lg">
            Te mostraremos las funciones principales de la plataforma en un recorrido rápido de 2 minutos.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-[#f8fafc] rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2a87ff]">500+</div>
            <div className="text-sm text-gray-600">FIXERS activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2a87ff]">1,200+</div>
            <div className="text-sm text-gray-600">Servicios completados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2a87ff]">4.8</div>
            <div className="text-sm text-gray-600">Calificación promedio</div>
          </div>
        </div>

        {/* Lista de características - SIN puntos azules */}
        <div className="space-y-2 mb-8 text-center text-gray-700">
          <div>Buscador de servicios</div>
          <div>Categorías organizadas</div>
          <div>Mapa interactivo</div>
          <div>Registro como Fixer</div>
        </div>

        {/* Botón de acción - MÁS GRANDE */}
        <div className="text-center">
          <button
            onClick={onNext}
            className="px-12 py-4 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all text-lg"
          >
            Comenzar Tour
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar paso final
  const renderFinalStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-[#d8ecff] w-full max-w-2xl mx-4">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#11255A] mb-2">
            ¡Tutorial Completado!
          </h2>
          <p className="text-gray-600">
            Ya conoces las funciones principales de SERVINEO.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#f8fafc] rounded-lg p-4">
            <h3 className="font-semibold text-[#11255A] mb-3 text-center">Como Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Buscar servicios que necesitas
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Contratar fixers verificados
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Calificar trabajos realizados
              </li>
            </ul>
          </div>

          <div className="bg-[#f8fafc] rounded-lg p-4">
            <h3 className="font-semibold text-[#11255A] mb-3 text-center">Como Fixer</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Ofrecer tus servicios
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Recibir solicitudes
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Construir reputación
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all"
          >
            Ver de nuevo
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white text-[#2a87ff] border border-[#2a87ff] rounded-lg font-semibold hover:bg-[#eef7ff] transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar paso normal
  const renderNormalStep = () => (
    <div className="bg-white rounded-xl shadow-2xl border border-[#d8ecff] max-w-sm mx-4 fixed bottom-8 left-1/2 transform -translate-x-1/2 z-9999">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-2xl shrink-0">{currentStepData.icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#11255A] mb-1">
              {currentStepData.title}
            </h3>
            <div className="text-sm text-[#2a87ff] font-semibold">
              Paso {currentStep + 1} de {guideSteps.length}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          {currentStepData.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#eef7ff] text-[#2a87ff] hover:bg-[#d8ecff]'
              }`}
            >
              Anterior
            </button>
            
            <button
              onClick={onNext}
              className="px-4 py-2 bg-[#2a87ff] text-white rounded-lg text-sm font-medium hover:bg-[#1a347a]"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9997 flex items-center justify-center bg-[#11255a]/70 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual */}
      {currentStepData.targetElement && currentStepData.position !== 'center' && (
        <div style={getHighlightPosition()} />
      )}

      {/* Renderizar el tipo de paso correspondiente */}
      {isWelcomeStep && renderWelcomeStep()}
      {isFinalStep && renderFinalStep()}
      {!isWelcomeStep && !isFinalStep && renderNormalStep()}
    </div>
  );
};

export default InteractiveGuide;