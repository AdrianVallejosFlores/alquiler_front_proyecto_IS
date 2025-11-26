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
  
  const isValidStep = currentStep >= 0 && currentStep < guideSteps.length;
  const currentStepData: GuideStep | undefined = isValidStep ? guideSteps[currentStep] : undefined;

  useEffect(() => {
    if (isActive && currentStepData?.targetElement) {
      // Pequeño delay para asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center' 
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, currentStepData?.targetElement]);

  if (!isActive || !currentStepData) return null;

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
    return {
      position: 'fixed',
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
      borderRadius: '8px',
      boxShadow: `
        0 0 0 9999px rgba(17, 37, 90, 0.3),
        0 0 0 3px #2a87ff, 
        0 0 20px rgba(42, 135, 255, 0.6)
      `,
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
      transition: 'all 0.3s ease',
    };
  };

  const getTooltipPosition = (): CSSProperties => {
    const highlightStyle = getHighlightPosition();
    
    // Si no hay elemento target o la posición es 'center', centrar el tooltip
    if (!highlightStyle.position || currentStepData.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const position = currentStepData.position;
    const gap = 20;

    switch (position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `calc(100vh - ${highlightStyle.top}px + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: `calc(${highlightStyle.top}px + ${highlightStyle.height}px + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          position: 'fixed',
          right: `calc(100vw - ${highlightStyle.left}px + ${gap}px)`,
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          position: 'fixed',
          left: `calc(${highlightStyle.left}px + ${highlightStyle.width}px + ${gap}px)`,
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

  const isWelcomeStep = currentStep === 0;
  const isFinalStep = currentStep === guideSteps.length - 1;

  return (
    <div
      ref={overlayRef}
      // OVERLAY OSCURO PERO NO NEGRO - semitransparente
      className="fixed inset-0 z-9997 flex items-center justify-center bg-[#11255a]/30 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Ventana de la guía */}
      <div
        style={getTooltipPosition()}
        className="bg-white rounded-xl shadow-2xl border border-[#d8ecff] mx-4 z-9999 pointer-events-auto max-w-sm min-w-[320px]"
      >
        <div className="p-6">
          {/* Header con icono y título */}
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

          {/* Descripción */}
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#eef7ff] text-[#2a87ff] hover:bg-[#d8ecff] hover:scale-105'
                }`}
              >
                Anterior
              </button>
              
              {isFinalStep ? (
                <button
                  onClick={onRestart}
                  className="px-4 py-2 bg-[#2a87ff] text-white rounded-lg text-sm font-medium hover:bg-[#1a347a] hover:scale-105 transition-all"
                >
                  Comenzar de nuevo
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-4 py-2 bg-[#2a87ff] text-white rounded-lg text-sm font-medium hover:bg-[#1a347a] hover:scale-105 transition-all"
                >
                  {isWelcomeStep ? 'Comenzar tour' : 'Siguiente'}
                </button>
              )}
            </div>

            {!isWelcomeStep && !isFinalStep && (
              <button
                onClick={onClose}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-all"
              >
                Saltar tour
              </button>
            )}
          </div>

          {/* Indicadores de progreso */}
          <div className="flex justify-center space-x-1 mt-4">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-[#2a87ff] w-4' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuide;