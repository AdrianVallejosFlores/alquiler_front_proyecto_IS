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
  const currentStepData: GuideStep = guideSteps[currentStep];

  useEffect(() => {
    if (isActive && currentStepData.targetElement) {
      // Scroll al elemento objetivo si existe
      const targetElement = document.querySelector(currentStepData.targetElement);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isActive, currentStep, currentStepData.targetElement]);

  if (!isActive) return null;

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
      position: 'absolute',
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
      borderRadius: '8px',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 0 3px #52abff, 0 0 20px rgba(82, 171, 255, 0.5)',
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents']
    };
  };

  const getTooltipPosition = (): CSSProperties => {
    const highlightStyle = getHighlightPosition();
    if (!highlightStyle.position) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const position = currentStepData.position || 'bottom';
    const gap = 20;

    switch (position) {
      case 'top':
        return {
          position: 'absolute',
          bottom: `calc(100% + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          position: 'absolute',
          top: `calc(100% + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          position: 'absolute',
          right: `calc(100% + ${gap}px)`,
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          position: 'absolute',
          left: `calc(100% + ${gap}px)`,
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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {/* Highlight del elemento actual */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Tooltip de la guía */}
      <div
        style={getTooltipPosition()}
        className="bg-white rounded-lg shadow-2xl max-w-sm mx-4 z-9999"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {currentStepData.title}
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-blue-600 font-medium">
                  Paso {currentStep + 1} de {guideSteps.length}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold"
              aria-label="Cerrar guía"
            >
              ×
            </button>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>
              
              {currentStep === guideSteps.length - 1 ? (
                <button
                  onClick={onRestart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Ver de nuevo
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Siguiente
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              Saltar tutorial
            </button>
          </div>

          {/* Indicadores de progreso */}
          <div className="flex justify-center space-x-1 mt-4">
            {guideSteps.map((step: GuideStep, index: number) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instrucciones de navegación */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
        Presiona ← → para navegar • ESC para salir
      </div>
    </div>
  );
};

export default InteractiveGuide;