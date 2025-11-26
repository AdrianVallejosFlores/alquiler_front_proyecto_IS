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

  // DEBUG: Ver qué está pasando
  useEffect(() => {
    if (isActive) {
      console.log('🔍 [GUIDE DEBUG] Guía activa, paso:', currentStep + 1);
      console.log('🔍 [GUIDE DEBUG] Datos del paso:', guideSteps[currentStep]);
      
      const stepData = guideSteps[currentStep];
      if (stepData?.targetElement) {
        console.log('🔍 [GUIDE DEBUG] Buscando elemento:', stepData.targetElement);
        const element = document.querySelector(stepData.targetElement);
        console.log('🔍 [GUIDE DEBUG] Elemento encontrado:', element);
      }
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (isActive && currentStepData?.targetElement && mounted) {
      console.log('🔍 [GUIDE DEBUG] Intentando scroll a elemento:', currentStepData.targetElement);
      
      const scrollToElement = () => {
        const targetElement = document.querySelector(currentStepData.targetElement!);
        if (targetElement) {
          console.log('🔍 [GUIDE DEBUG] Elemento encontrado, haciendo scroll');
          
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
          
          targetElement.getBoundingClientRect();
          
        } else {
          console.log('🔍 [GUIDE DEBUG] ERROR: Elemento NO encontrado:', currentStepData.targetElement);
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

    return {
      position: 'fixed',
      top: rect.top + scrollY - 5, // Margen adicional
      left: rect.left + scrollX - 5,
      width: rect.width + 10,
      height: rect.height + 10,
      borderRadius: '12px',
      boxShadow: `
        0 0 0 9999px rgba(17, 37, 90, 0.7),
        0 0 0 3px #2a87ff, 
        0 0 30px rgba(42, 135, 255, 0.9),
        inset 0 0 0 2px #ffffff
      `,
      zIndex: 9998,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
      transition: 'all 0.3s ease-out',
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

    const gap = 20;
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

  // Renderizar paso de bienvenida (como imagen 2)
  const renderWelcomeStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#2a87ff] w-full max-w-md mx-4">
      <div className="p-8 text-center">
        {/* Header con efecto */}
        <div className="mb-6">
          <div className="text-5xl mb-4 animate-bounce">👋</div>
          <h2 className="text-2xl font-bold text-[#11255A] mb-3">
            ¡Bienvenido a SERVINEO!
          </h2>
          <p className="text-gray-600">
            Conectamos clientes con proveedores. Desde reparaciones del hogar hasta servicios especializados.
          </p>
        </div>

        {/* Buscador simulado como en imagen 2 */}
        <div className="mb-6 p-4 bg-[#f8fafc] rounded-lg border border-[#d8ecff]">
          <div className="text-left mb-3">
            <span className="text-sm font-medium text-[#11255A]">¿Qué servicio necesita?</span>
          </div>
          <div className="relative">
            <div className="w-full px-4 py-3 pl-10 border-2 border-[#2a87ff] rounded-lg bg-white text-[#11255A] font-medium">
              Escribe tu servicio aquí...
            </div>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2a87ff]">
              🔍
            </div>
          </div>
        </div>

        {/* Estadísticas con iconos como imagen 2 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-[#2a87ff] mb-1">500+</div>
            <div className="text-xs text-gray-600">FIXERS</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#2a87ff] mb-1">1,200+</div>
            <div className="text-xs text-gray-600">Servicios</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#2a87ff] mb-1">4.8</div>
            <div className="text-xs text-gray-600">Calificación</div>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={onNext}
          className="w-full py-4 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all transform hover:scale-105 shadow-lg"
        >
          Comenzar Tour
        </button>
      </div>
    </div>
  );

  // Renderizar paso final
  const renderFinalStep = () => (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#2a87ff] w-full max-w-2xl mx-4">
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
          <div className="bg-[#f8fafc] rounded-xl p-6 border border-[#d8ecff]">
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

          <div className="bg-[#f8fafc] rounded-xl p-6 border border-[#d8ecff]">
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
            className="px-8 py-3 bg-[#2a87ff] text-white rounded-lg font-semibold hover:bg-[#1a347a] transition-all transform hover:scale-105"
          >
            Ver de nuevo
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white text-[#2a87ff] border-2 border-[#2a87ff] rounded-lg font-semibold hover:bg-[#eef7ff] transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar paso normal (alineado con el elemento)
  const renderNormalStep = () => (
    <div
      style={getTooltipPosition()}
      className="bg-white rounded-xl shadow-2xl border-2 border-[#2a87ff] z-9999 pointer-events-auto max-w-xs transform transition-all duration-300"
    >
      <div className="p-5">
        {/* Header con icono animado */}
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl shrink-0 animate-pulse">{currentStepData.icon}</div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#11255A] mb-1">
              {currentStepData.title}
            </h3>
            <div className="text-xs text-[#2a87ff] font-semibold">
              Paso {currentStep + 1} de {guideSteps.length}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-xs text-gray-700 mb-4 leading-relaxed">
          {currentStepData.description}
        </p>

        {/* Navegación */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#eef7ff] text-[#2a87ff] hover:bg-[#d8ecff] hover:scale-105'
              }`}
            >
              ← Anterior
            </button>
            
            <button
              onClick={onNext}
              className="px-3 py-1 bg-[#2a87ff] text-white rounded-lg text-xs font-medium hover:bg-[#1a347a] hover:scale-105 transition-all"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
      
      {/* Flecha indicadora */}
      <div className="absolute w-4 h-4 bg-white border-r-2 border-t-2 border-[#2a87ff] transform rotate-45 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          [currentStepData.position === 'top' ? 'bottom' : 'top']: '-8px'
        }}
      ></div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9997 flex items-center justify-center bg-[#11255a]/80 backdrop-blur-sm transition-all duration-300"
      onClick={handleOverlayClick}
    >
      {/* Resaltado del elemento actual */}
      {currentStepData.targetElement && (
        <div style={getHighlightPosition()} />
      )}

      {/* Renderizar el tipo de paso correspondiente */}
      {currentStep === 0 && renderWelcomeStep()}
      {isFinalStep && renderFinalStep()}
      {currentStep > 0 && !isFinalStep && renderNormalStep()}
    </div>
  );
};

export default InteractiveGuide;