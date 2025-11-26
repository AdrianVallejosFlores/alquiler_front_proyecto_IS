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
      borderRadius: '8px',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.1), 0 0 0 3px #2a87ff, 0 0 20px rgba(42, 135, 255, 0.5)',
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
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
      // OVERLAY COMPLETAMENTE TRANSPARENTE - SOLO RESALTA ELEMENTOS
      className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none"
      onClick={handleOverlayClick}
    >
      {/* Solo el resaltado del elemento actual */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Ventana de la guía */}
      <div
        style={getTooltipPosition()}
        className="bg-white rounded-lg shadow-lg border border-gray-200 mx-4 z-9999 pointer-events-auto max-w-xs"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="text-xl">{currentStepData.icon}</div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#11255A]">
                {currentStepData.title}
              </h3>
              <div className="text-xs text-[#2a87ff] font-medium">
                Paso {currentStep + 1} de {guideSteps.length}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-xs text-gray-600 mb-4">
            {currentStepData.description}
          </p>

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={onPrev}
                disabled={currentStep === 0}
                className={`px-3 py-1 rounded text-xs ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>
              
              {isFinalStep ? (
                <button
                  onClick={onRestart}
                  className="px-3 py-1 bg-[#2a87ff] text-white rounded text-xs hover:bg-[#1a347a]"
                >
                  Ver de nuevo
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-3 py-1 bg-[#2a87ff] text-white rounded text-xs hover:bg-[#1a347a]"
                >
                  {isWelcomeStep ? 'Comenzar' : 'Siguiente'}
                </button>
              )}
            </div>

            {!isWelcomeStep && !isFinalStep && (
              <button
                onClick={onClose}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs"
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