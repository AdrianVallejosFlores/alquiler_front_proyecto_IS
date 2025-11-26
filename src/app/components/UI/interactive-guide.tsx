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
  const [showWelcome, setShowWelcome] = useState(false);
  
  const isValidStep = currentStep >= 0 && currentStep < guideSteps.length;
  const currentStepData: GuideStep | undefined = isValidStep ? guideSteps[currentStep] : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mostrar bienvenida solo al iniciar por primera vez
  useEffect(() => {
    if (isActive && currentStep === 0) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (isActive && currentStepData?.targetElement && mounted && !showWelcome) {
      const scrollToElement = () => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
          targetElement.getBoundingClientRect();
        }
      };

      const timer = setTimeout(scrollToElement, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, currentStepData?.targetElement, mounted, showWelcome]);

  if (!isActive || !currentStepData || !mounted) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const getHighlightPosition = (): CSSProperties => {
    if (!currentStepData.targetElement || showWelcome) return {};

    const targetElement = document.querySelector(currentStepData.targetElement);
    if (!targetElement) {
      return {};
    }

    const rect = targetElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    return {
      position: 'fixed',
      top: rect.top + scrollY - 8,
      left: rect.left + scrollX - 8,
      width: rect.width + 16,
      height: rect.height + 16,
      borderRadius: '12px',
      boxShadow: `
        0 0 0 9999px rgba(17, 37, 90, 0.8),
        0 0 0 3px #2a87ff, 
        0 0 30px rgba(42, 135, 255, 0.9)
      `,
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    };
  };

  const getTooltipPosition = (): CSSProperties => {
    if (currentStepData.position === 'center' || showWelcome) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const highlightStyle = getHighlightPosition();
    if (!highlightStyle.position) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const gap = 25;
    const top = Number(highlightStyle.top) || 0;
    const left = Number(highlightStyle.left) || 0;
    const width = Number(highlightStyle.width) || 0;
    const height = Number(highlightStyle.height) || 0;

    switch (currentStepData.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `calc(100vh - ${top}px + ${gap}px)`,
          left: left + (width / 2),
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: top + height + gap,
          left: left + (width / 2),
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          position: 'fixed',
          right: `calc(100vw - ${left}px + ${gap}px)`,
          top: top + (height / 2),
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          position: 'fixed',
          left: left + width + gap,
          top: top + (height / 2),
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

  const isFinalStep = currentStepData.isFinalStep;

  // Renderizar ventana de bienvenida (SOLO cuando showWelcome es true)
  const renderWelcomeStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4">
      <div className="p-8 text-center">
        {/* Header simple */}
        <div className="mb-6">
          <div className="text-4xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-[#11255A] mb-3">
            ¡Bienvenido a SERVINEO!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Te mostraremos las funciones principales de la plataforma en un recorrido rápido de 2 minutos.
          </p>
        </div>

        {/* Botón simple */}
        <button
          onClick={() => {
            setShowWelcome(false);
            onNext();
          }}
          className="w-full py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all"
        >
          Comenzar Tour
        </button>
      </div>
    </div>
  );

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
      className="bg-white rounded-xl shadow-2xl border border-gray-200 z-9999 pointer-events-auto max-w-xs"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl shrink-0">{currentStepData.icon}</div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#11255A] mb-1">
              {currentStepData.title}
            </h3>
            <div className="text-xs text-[#2a87ff] font-semibold">
              Paso {currentStep + 1} de {guideSteps.length}
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
              disabled={currentStep === 0}
              className={`px-3 py-1 rounded text-xs ${
                currentStep === 0
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
      className="fixed inset-0 z-9997 flex items-center justify-center bg-[#11255a]/70"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual - SOLO cuando no es bienvenida */}
      {!showWelcome && currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Renderizar el tipo de paso correspondiente */}
      {showWelcome && renderWelcomeStep()}
      {isFinalStep && renderFinalStep()}
      {!showWelcome && !isFinalStep && renderNormalStep()}
    </div>
  );
};

export default InteractiveGuide;