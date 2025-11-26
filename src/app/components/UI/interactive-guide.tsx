// src/app/components/ui/interactive-guide.tsx
'use client';

import React, { useEffect, useRef, CSSProperties } from 'react';
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
  
  // Paso actual
  const currentStepData: GuideStep | undefined = guideSteps.find(step => step.id === currentStep);

  useEffect(() => {
    if (isActive && currentStepData?.targetElement) {
      console.log('🔍 [DEBUG] Buscando elemento:', currentStepData.targetElement);
      
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          console.log('🔍 [DEBUG] Elemento encontrado, haciendo scroll');
          
          // Calcular posición para scroll suave
          const elementRect = targetElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
          
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        } else {
          console.log('🔍 [DEBUG] ERROR: No se encontró el elemento:', currentStepData.targetElement);
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, currentStepData?.targetElement]);

  if (!isActive || !currentStepData) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && currentStepData.type === 'intro') {
      onClose();
    }
  };

  const getHighlightPosition = (): CSSProperties => {
    if (!currentStepData.targetElement) return { display: 'none' };

    const targetElement = document.querySelector(currentStepData.targetElement);
    if (!targetElement) return { display: 'none' };

    const rect = targetElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    return {
      position: 'absolute',
      top: rect.top + scrollY - 8,
      left: rect.left + scrollX - 8,
      width: rect.width + 16,
      height: rect.height + 16,
      borderRadius: '8px',
      boxShadow: `
        0 0 0 9999px rgba(0, 0, 0, 0.75),
        0 0 0 3px #2a87ff, 
        0 0 20px 5px rgba(42, 135, 255, 0.8),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5)
      `,
      zIndex: 9998,
      pointerEvents: 'none',
      transition: 'all 0.3s ease-out',
    };
  };

  const getTooltipPosition = (): CSSProperties => {
    if (currentStepData.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      };
    }

    const targetElement = document.querySelector(currentStepData.targetElement!);
    if (!targetElement) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const gap = 15;

    switch (currentStepData.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `calc(100vh - ${rect.top}px + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: rect.bottom + gap,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999
        };
      case 'left':
        return {
          position: 'fixed',
          right: `calc(100vw - ${rect.left}px + ${gap}px)`,
          top: rect.top + (rect.height / 2),
          transform: 'translateY(-50%)',
          zIndex: 9999
        };
      case 'right':
        return {
          position: 'fixed',
          left: rect.right + gap,
          top: rect.top + (rect.height / 2),
          transform: 'translateY(-50%)',
          zIndex: 9999
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999
        };
    }
  };

  // Renderizar paso de introducción (como la imagen)
  const renderIntroStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4">
      <div className="p-8 text-center">
        <div className="text-5xl mb-6">👋</div>
        <h2 className="text-2xl font-bold text-[#11255A] mb-4">
          ¡Bienvenido a SERVINEO!
        </h2>
        <p className="text-gray-600 mb-2">
          Te mostraremos las funciones principales de la plataforma en un recorrido rápido
        </p>
        <p className="text-gray-600 mb-8">
          de 2 minutos. Aprenderás a buscar servicios, registrarte como Fixer o cliente, y más.
        </p>
        
        {/* Grid de funciones como en la imagen */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">🔍</div>
            <span className="font-semibold text-[#11255A]">Buscador</span>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">📋</div>
            <span className="font-semibold text-[#11255A]">Servicios</span>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">🗺️</div>
            <span className="font-semibold text-[#11255A]">Mapa</span>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">🛠️</div>
            <span className="font-semibold text-[#11255A]">Trabajos</span>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">💼</div>
            <span className="font-semibold text-[#11255A]">Ser Fixer</span>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">🎯</div>
            <span className="font-semibold text-[#11255A]">Soporte</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white text-[#2a87ff] border border-[#2a87ff] rounded-lg font-semibold hover:bg-[#eef7ff] transition-all duration-200"
          >
            Saltar tutorial
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all duration-200 shadow-lg"
          >
            Comenzar recorrido
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar paso final (como la imagen 3)
  const renderFinalStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#11255A] mb-2">
            ¡Tutorial Completado!
          </h2>
          <p className="text-gray-600">
            Ya conoces las funciones principales de SERVINEO. Ahora estás listo para:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#f8fafc] rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-[#11255A] mb-4 text-center text-lg">Como Cliente</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>Buscar servicios que necesitas</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>Contratar fixers verificados</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>Calificar trabajos realizados</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#f8fafc] rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-[#11255A] mb-4 text-center text-lg">Como Fixer</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>Ofrecer tus servicios profesionales</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>Recibir solicitudes de trabajo</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>Construir tu reputación</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all duration-200"
          >
            Ver de nuevo
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white text-[#2a87ff] border border-[#2a87ff] rounded-lg font-semibold hover:bg-[#eef7ff] transition-all duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar paso normal (como la imagen 2)
  const renderNormalStep = () => (
    <div
      style={getTooltipPosition()}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 z-9999 pointer-events-auto max-w-xs mx-4"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl shrink-0">{currentStepData.icon}</div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#11255A] mb-1">
              {currentStepData.title}
            </h3>
            <div className="text-xs text-[#2a87ff] font-semibold">
              Paso {currentStep} de 6
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-700 mb-4 leading-relaxed">
          {currentStepData.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={onPrev}
              disabled={currentStep === 1}
              className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#eef7ff] text-[#2a87ff] hover:bg-[#d8ecff] hover:shadow-sm'
              }`}
            >
              Anterior
            </button>
            
            <button
              onClick={onNext}
              className="px-3 py-1 bg-[#2a87ff] text-white rounded text-xs font-medium hover:bg-[#1a347a] hover:shadow-sm transition-all duration-200"
            >
              Siguiente
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors duration-200"
          >
            Saltar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9997 flex items-center justify-center bg-black/70"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual - SOLO para pasos normales */}
      {currentStepData.type === 'step' && currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Renderizar el tipo de paso correspondiente */}
      {currentStepData.type === 'intro' && renderIntroStep()}
      {currentStepData.type === 'final' && renderFinalStep()}
      {currentStepData.type === 'step' && renderNormalStep()}
    </div>
  );
};

export default InteractiveGuide;