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
  
  // Paso actual (1-6)
  const currentStepData: GuideStep | undefined = guideSteps.find(step => step.id === currentStep);

  useEffect(() => {
    if (isActive && currentStepData?.targetElement) {
      console.log('🔍 [DEBUG] Buscando elemento:', currentStepData.targetElement);
      
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          console.log('🔍 [DEBUG] Elemento encontrado, haciendo scroll');
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        } else {
          console.log('🔍 [DEBUG] ERROR: No se encontró el elemento');
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, currentStepData?.targetElement]);

  if (!isActive || !currentStepData) {
    console.log('🔍 [DEBUG] No renderizando - isActive:', isActive, 'currentStep:', currentStep);
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
    if (!targetElement) return {};

    const rect = targetElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    return {
      position: 'fixed',
      top: rect.top + scrollY - 5,
      left: rect.left - 5,
      width: rect.width + 10,
      height: rect.height + 10,
      borderRadius: '8px',
      boxShadow: `
        0 0 0 9999px rgba(0, 0, 0, 0.6),
        0 0 0 3px #2a87ff, 
        0 0 20px rgba(42, 135, 255, 0.8)
      `,
      zIndex: 9998,
      pointerEvents: 'none',
    };
  };

  const getTooltipPosition = (): CSSProperties => {
    if (currentStepData.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const highlightStyle = getHighlightPosition();
    if (!highlightStyle.position) return {};

    const rect = {
      top: Number(highlightStyle.top) || 0,
      left: Number(highlightStyle.left) || 0,
      width: Number(highlightStyle.width) || 0,
      height: Number(highlightStyle.height) || 0
    };

    const gap = 20;

    switch (currentStepData.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `calc(100vh - ${rect.top}px + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: rect.top + rect.height + gap,
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          position: 'fixed',
          right: `calc(100vw - ${rect.left}px + ${gap}px)`,
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          position: 'fixed',
          left: rect.left + rect.width + gap,
          top: '50%',
          transform: 'translateY(-50%)'
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  const isFinalStep = currentStep === 6;

  // Renderizar paso final
  const renderFinalStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4">
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
              className={`px-3 py-1 rounded text-xs ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#eef7ff] text-[#2a87ff] hover:bg-[#d8ecff]'
              }`}
            >
              Anterior
            </button>
            
            <button
              onClick={onNext}
              className="px-3 py-1 bg-[#2a87ff] text-white rounded text-xs hover:bg-[#1a347a]"
            >
              {isFinalStep ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs"
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
      className="fixed inset-0 z-9997 flex items-center justify-center bg-black/60"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Renderizar el tipo de paso correspondiente */}
      {isFinalStep ? renderFinalStep() : renderNormalStep()}
    </div>
  );
};

export default InteractiveGuide;