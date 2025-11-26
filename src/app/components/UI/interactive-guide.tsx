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
  
  // Verificar que currentStep sea válido
  const isValidStep = currentStep >= 0 && currentStep < guideSteps.length;
  const currentStepData: GuideStep | undefined = isValidStep ? guideSteps[currentStep] : undefined;

  useEffect(() => {
    if (isActive && currentStepData?.targetElement) {
      const targetElement = document.querySelector(currentStepData.targetElement);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
      position: 'absolute',
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
      borderRadius: '12px',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.05), 0 0 0 4px #52abff, 0 0 30px rgba(82, 171, 255, 0.6)',
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
      transition: 'all 0.3s ease'
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
    const gap = 15;

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

  const isWelcomeStep = currentStep === 0;
  const isFinalStep = currentStep === guideSteps.length - 1;

  return (
    <div
      ref={overlayRef}
      // OVERLAY COMPLETAMENTE TRANSPARENTE - SOLO RESALTA EL ELEMENTO
      className="fixed inset-0 z-9999 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
      onClick={handleOverlayClick}
    >
      {/* Highlight del elemento actual - MUY SUTIL */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Tooltip de la guía - VENTANA PEQUEÑA */}
      <div
        style={getTooltipPosition()}
        className={`bg-white rounded-xl shadow-xl mx-4 z-9999 border-2 border-blue-200 pointer-events-auto ${
          isWelcomeStep || isFinalStep ? 'max-w-xs' : 'max-w-xs'
        } transform transition-all duration-300 scale-100`}
      >
        <div className="p-4">
          {/* Header con icono */}
          <div className="flex items-start gap-3 mb-3">
            <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
              {currentStepData.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                {currentStepData.title}
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  {currentStep + 1}/{guideSteps.length}
                </span>
              </div>
            </div>
            {!isWelcomeStep && !isFinalStep && (
              <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors text-sm font-bold hover:bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center"
                aria-label="Cerrar guía"
              >
                ×
              </button>
            )}
          </div>

          {/* Descripción */}
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Contenido especial para el paso final */}
          {isFinalStep && (
            <div className="mb-4 space-y-2 bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold text-gray-800 text-xs mb-1">Como Cliente</h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-1 text-xs">✓</span>
                      Buscar servicios
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-1 text-xs">✓</span>
                      Contratar fixers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                }`}
              >
                ←
              </button>
              
              {isFinalStep ? (
                <button
                  onClick={onRestart}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  Ver de nuevo
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  {isWelcomeStep ? 'Comenzar' : '→'}
                </button>
              )}
            </div>

            {!isWelcomeStep && !isFinalStep && (
              <button
                onClick={onClose}
                className="px-2 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors hover:bg-gray-50 rounded"
              >
                Saltar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuide;