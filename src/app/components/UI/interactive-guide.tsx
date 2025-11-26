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

  useEffect(() => {
    if (isActive && currentStepData?.targetElement && mounted) {
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          // Forzar un reflow para asegurar que el scroll funcione
          targetElement.getBoundingClientRect();
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, currentStepData?.targetElement, mounted]);

  // Efecto para manejar teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onNext, onPrev, onClose]);

  if (!isActive || !currentStepData || !mounted) return null;

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
    const scrollX = window.scrollX || window.pageXOffset;

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
      transition: 'all 0.4s ease',
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
    if (!highlightStyle.position) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const gap = 25;
    const viewportPadding = 20;

    // Obtener valores numéricos de las posiciones
    const top = typeof highlightStyle.top === 'number' ? highlightStyle.top : 0;
    const left = typeof highlightStyle.left === 'number' ? highlightStyle.left : 0;
    const width = typeof highlightStyle.width === 'number' ? highlightStyle.width : 0;
    const height = typeof highlightStyle.height === 'number' ? highlightStyle.height : 0;

    switch (currentStepData.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `calc(100vh - ${top}px + ${gap}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: `calc(100vw - ${viewportPadding * 2}px)`
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: top + height + gap,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: `calc(100vw - ${viewportPadding * 2}px)`
        };
      case 'left':
        return {
          position: 'fixed',
          right: `calc(100vw - ${left}px + ${gap}px)`,
          top: top + (height / 2),
          transform: 'translateY(-50%)',
          maxWidth: '300px'
        };
      case 'right':
        return {
          position: 'fixed',
          left: left + width + gap,
          top: top + (height / 2),
          transform: 'translateY(-50%)',
          maxWidth: '300px'
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
  const isFinalStep = currentStepData.isFinalStep;

  // Renderizar paso de bienvenida (como imagen 1)
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

        {/* Estadísticas como en imagen 2 */}
        {currentStepData.showStats && (
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
        )}

        {/* Lista de características */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-[#2a87ff] rounded-full mr-3"></span>
            <span>Buscador de servicios</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-[#2a87ff] rounded-full mr-3"></span>
            <span>Categorías organizadas</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-[#2a87ff] rounded-full mr-3"></span>
            <span>Mapa interactivo</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-[#2a87ff] rounded-full mr-3"></span>
            <span>Registro como Fixer</span>
          </div>
        </div>

        {/* Instrucciones de navegación */}
        <div className="bg-[#eef7ff] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <kbd className="bg-white px-2 py-1 rounded border mr-2">←</kbd>
              <span>para retroceder</span>
            </div>
            <div className="flex items-center">
              <kbd className="bg-white px-2 py-1 rounded border mr-2">→</kbd>
              <span>para avanzar</span>
            </div>
            <div className="flex items-center">
              <kbd className="bg-white px-2 py-1 rounded border mr-2">ESC</kbd>
              <span>para salir</span>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="text-center">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all transform hover:scale-105"
          >
            Comenzar Tour
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar paso final (como imagen 3)
  const renderFinalStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-[#d8ecff] w-full max-w-2xl mx-4">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#11255A] mb-2">
            ¡Tutorial Completado!
          </h2>
          <p className="text-gray-600">
            Ya conoces las funciones principales de SERVINEO. Ahora estás listo para:
          </p>
        </div>

        {/* Contenido como Cliente y Fixer */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                Ofrecer tus servicios profesionales
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Recibir solicitudes de trabajo
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Construir tu reputación
              </li>
            </ul>
          </div>
        </div>

        {/* Botones de acción final */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all flex-1 text-center"
          >
            Ver de nuevo
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white text-[#2a87ff] border border-[#2a87ff] rounded-lg font-semibold hover:bg-[#eef7ff] transition-all flex-1 text-center"
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
      className="bg-white rounded-xl shadow-2xl border border-[#d8ecff] z-9999 pointer-events-auto max-w-sm min-w-[320px] mx-4"
    >
      <div className="p-6">
        {/* Header */}
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
            
            <button
              onClick={onNext}
              className="px-4 py-2 bg-[#2a87ff] text-white rounded-lg text-sm font-medium hover:bg-[#1a347a] hover:scale-105 transition-all"
            >
              Siguiente
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-all"
          >
            Saltar tour
          </button>
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
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9997 flex items-center justify-center bg-[#11255a]/70 backdrop-blur-sm transition-all duration-300"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual - solo para pasos normales */}
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