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
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.2), 0 0 0 4px #52abff, 0 0 30px rgba(82, 171, 255, 0.6)',
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
    const gap = 25;

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
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {/* Highlight del elemento actual con efecto más sutil */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Tooltip de la guía - Diseño mejorado */}
      <div
        style={getTooltipPosition()}
        className={`bg-white rounded-2xl shadow-2xl mx-4 z-9999 border-2 border-blue-100 ${
          isWelcomeStep || isFinalStep ? 'max-w-md' : 'max-w-sm'
        } transform transition-all duration-300 scale-100`}
      >
        <div className="p-6">
          {/* Header con icono */}
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
              {currentStepData.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {currentStepData.title}
              </h3>
              <div className="flex items-center mt-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {currentStep + 1}/{guideSteps.length}
                </span>
              </div>
            </div>
            {!isWelcomeStep && !isFinalStep && (
              <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                aria-label="Cerrar guía"
              >
                ×
              </button>
            )}
          </div>

          {/* Descripción */}
          <p className="text-gray-700 mb-6 leading-relaxed text-base">
            {currentStepData.description}
          </p>

          {/* Contenido especial para el paso final */}
          {isFinalStep && (
            <div className="mb-6 space-y-4 bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-2">✓</span>
                    Como Cliente
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 ml-8">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      Buscar servicios que necesitas
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      Contratar fixers verificados
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      Calificar trabajos realizados
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-2">✓</span>
                    Como Fixer
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 ml-8">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      Ofrecer tus servicios profesionales
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      Recibir solicitudes de trabajo
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      Construir tu reputación
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 shadow-sm'
                }`}
              >
                ← Anterior
              </button>
              
              {isFinalStep ? (
                <button
                  onClick={onRestart}
                  className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  🔄 Ver de nuevo
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isWelcomeStep ? '🚀 Comenzar recorrido' : 'Siguiente →'}
                </button>
              )}
            </div>

            {!isWelcomeStep && !isFinalStep && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors hover:bg-gray-50 rounded-lg"
              >
                Saltar
              </button>
            )}
          </div>

          {/* Indicadores de progreso mejorados */}
          <div className="flex justify-center space-x-2 mt-5">
            {guideSteps.map((step: GuideStep, index: number) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 scale-125' 
                    : index < currentStep 
                    ? 'bg-blue-300' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Instrucciones de navegación para el primer paso */}
          {isWelcomeStep && (
            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded border text-xs">←</kbd>
                  <span>Retroceder</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded border text-xs">→</kbd>
                  <span>Avanzar</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded border text-xs">ESC</kbd>
                  <span>Salir</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuide;