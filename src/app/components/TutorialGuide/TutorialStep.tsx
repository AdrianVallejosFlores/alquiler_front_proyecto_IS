'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TutorialStep as TutorialStepType } from './types';

interface TutorialStepProps {
  step: TutorialStepType;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
  step,
  onNext,
  onPrev,
  onSkip,
  currentStep,
  totalSteps
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const stepRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const isInitialized = useRef(false);

  // Función para calcular posición del tooltip
  const calculateTooltipPosition = useCallback(() => {
    const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
    if (targetElement && stepRef.current) {
      const rect = targetElement.getBoundingClientRect();
      const stepRect = stepRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      console.log(`📏 Calculando tooltip para: ${step.targetElement}`);
      console.log(`📍 Elemento - top: ${rect.top}, left: ${rect.left}, width: ${rect.width}, height: ${rect.height}`);
      console.log(`📐 Tooltip - width: ${stepRect.width}, height: ${stepRect.height}`);
      
      // Inicializar variables
      let top: number;
      let left: number;
      
      // POSICIÓN ESPECIAL PARA PASO 6
      if (step.targetElement === "support-section") {
        console.log("🎯 POSICIÓN ESPECIAL PASO 6 - MEJOR VISIBILIDAD");
        
        // ESTRATEGIA MEJORADA: El elemento está a la derecha (según logs: left: 1104px)
        // El tooltip debe ir a la IZQUIERDA pero BIEN POSICIONADO
        
        // 1. Calcular posición a la izquierda del elemento
        left = rect.left - stepRect.width - 30;
        
        // 2. Centrar verticalmente con la parte visible de la sección
        const visibleTop = Math.max(rect.top, 100);
        const visibleBottom = Math.min(rect.bottom, viewportHeight - 100);
        const visibleHeight = visibleBottom - visibleTop;
        
        if (visibleHeight > stepRect.height) {
          // Hay espacio para centrar
          top = visibleTop + (visibleHeight / 2) - (stepRect.height / 2);
        } else {
          // Poco espacio, poner en el centro del elemento
          top = rect.top + (rect.height / 2) - (stepRect.height / 2);
        }
        
        console.log(`📊 Visible area: top=${visibleTop}, bottom=${visibleBottom}, height=${visibleHeight}`);
        console.log(`📍 Posición inicial: left=${left}, top=${top}`);
        
        // 3. Si no cabe a la izquierda (muy cerca del borde), ajustar
        if (left < 20) {
          console.log("⬅️ Demasiado a la izquierda, ajustando...");
          left = 20; // Mínimo margen
          
          // Intentar poner arriba del elemento
          if (rect.top > stepRect.height + 50) {
            top = rect.top - stepRect.height - 30;
            left = rect.left + (rect.width / 2) - (stepRect.width / 2);
            console.log("⬆️ Poniendo arriba del elemento");
          }
        }
        
        // 4. Si el tooltip cubre mucho el elemento, mover más arriba/abajo
        const tooltipBottom = top + stepRect.height;
        if (tooltipBottom > rect.top && top < rect.bottom) {
          console.log("🔄 Tooltip cubre elemento, ajustando posición...");
          
          // Intentar poner debajo si hay espacio
          if (rect.bottom + stepRect.height + 30 < viewportHeight - 50) {
            top = rect.bottom + 30;
            left = rect.left + (rect.width / 2) - (stepRect.width / 2);
            console.log("⬇️ Moviendo debajo del elemento");
          }
        }
      } else {
        // Para otros pasos: lógica normal
        top = rect.bottom + 20;
        left = rect.left;
        
        if (step.position === 'top') {
          top = rect.top - stepRect.height - 20;
        } else if (step.position === 'left') {
          left = rect.left - stepRect.width - 20;
          top = rect.top + (rect.height / 2) - (stepRect.height / 2);
        } else if (step.position === 'right') {
          left = rect.right + 20;
          top = rect.top + (rect.height / 2) - (stepRect.height / 2);
        }
      }
      
      // Asegurar que esté dentro de la pantalla
      const margin = 20;
      if (top < margin) top = margin;
      if (top + stepRect.height > viewportHeight - margin) {
        top = viewportHeight - stepRect.height - margin;
      }
      if (left < margin) left = margin;
      if (left + stepRect.width > viewportWidth - margin) {
        left = viewportWidth - stepRect.width - margin;
      }
      
      console.log(`✅ Tooltip posicionado: top=${Math.round(top)}, left=${Math.round(left)}`);
      setPosition({ top, left });
    }
  }, [step.targetElement, step.position]);

  // EFECTO PRINCIPAL: Scroll al elemento y setup
  useEffect(() => {
    console.log(`🚀 INICIANDO PASO ${currentStep + 1}: ${step.targetElement}`);
    isInitialized.current = false;

    const initializeStep = () => {
      const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
      
      if (!targetElement) {
        console.error(`❌ Elemento no encontrado: ${step.targetElement}`);
        return;
      }

      console.log(`✅ Elemento encontrado, haciendo scroll...`);
      
      // 1. GUARDAR posición actual del scroll
      scrollY.current = window.scrollY;
      
      // 2. ESPECIAL PARA PASO 6: Mostrar toda la sección de soporte
      if (step.targetElement === "support-section") {
        console.log("🎯 CONFIGURACIÓN ESPECIAL PARA PASO 6");
        
        // Convertir a HTMLElement
        const htmlElement = targetElement as HTMLElement;
        
        // Para el paso 6, mostrar la sección completa
        // Calcular posición para que se vea bien
        const rect = htmlElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.height > viewportHeight * 0.8) {
          // Sección muy grande, mostrar desde el inicio
          htmlElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        } else {
          // Sección normal, centrar
          htmlElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
        
        // Pequeño ajuste después del scroll
        setTimeout(() => {
          const newRect = htmlElement.getBoundingClientRect();
          console.log(`📏 Después del scroll - top: ${newRect.top}, visible: ${newRect.top > 50 && newRect.bottom < viewportHeight - 50 ? 'SÍ' : 'NO'}`);
          
          // Si no se ve completamente, ajustar
          if (newRect.top < 50 || newRect.bottom > viewportHeight - 50) {
            const scrollAdjust = htmlElement.offsetTop - 80;
            window.scrollTo({
              top: scrollAdjust,
              behavior: 'smooth'
            });
            console.log(`🔧 Ajustando scroll a: ${scrollAdjust}px`);
          }
        }, 500);
      } else {
        // 3. PARA OTROS PASOS: Scroll normal al centro
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
      
      // 4. Resaltar el elemento
      targetElement.classList.add('tutorial-highlight');
      
      // 5. Esperar a que termine el scroll y luego bloquear
      setTimeout(() => {
        console.log(`🔒 Aplicando bloqueo de scroll...`);
        
        // Bloquear scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Calcular posición del tooltip
        calculateTooltipPosition();
        
        isInitialized.current = true;
      }, 1000); // Más tiempo para el paso 6
    };

    initializeStep();

    return () => {
      // Cleanup
      const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
      if (targetElement) {
        targetElement.classList.remove('tutorial-highlight');
      }
      
      // Restaurar scroll temporalmente
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [step.targetElement, currentStep, calculateTooltipPosition]);

  // Bloquear eventos de scroll/wheel
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = [' ', 'Spacebar', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown'];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    if (isInitialized.current) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventKeyScroll);
    }
    
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [currentStep]);

  // Focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!tooltipRef.current) return;

      const focusableElements = tooltipRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusableArray = Array.from(focusableElements) as HTMLElement[];

      if (focusableArray.length === 0) return;

      const firstElement = focusableArray[0];
      const lastElement = focusableArray[focusableArray.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const currentTooltip = tooltipRef.current;
    if (currentTooltip) {
      setTimeout(() => {
        currentTooltip.addEventListener('keydown', handleKeyDown);
        const firstButton = currentTooltip.querySelector('button');
        if (firstButton) {
          (firstButton as HTMLElement).focus();
        }
      }, 500);
    }

    return () => {
      if (currentTooltip) {
        currentTooltip.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [currentStep]);

  // Handler para botones
  const handleAction = (action: () => void) => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    action();
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-60 bg-white rounded-xl shadow-2xl border border-blue-100 max-w-sm w-full"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div ref={stepRef}>
        <div className="bg-linear-to-r from-[#11255a] to-[#52abff] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{step.icon}</span>
              <h3 className="text-white font-semibold text-lg">{step.title}</h3>
            </div>
            <span className="bg-white/20 text-white/90 px-2 py-1 rounded-full text-sm font-medium">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">{step.description}</p>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(onPrev)}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105'
              }`}
            >
              ← Anterior
            </button>
            <button
              onClick={() => handleAction(onNext)}
              className="px-4 py-2 bg-linear-to-r from-[#52abff] to-[#11255a] text-white rounded-lg font-medium hover:from-[#3a9cff] hover:to-[#0e1f4d] transition-all duration-200 transform hover:scale-105"
            >
              {currentStep === totalSteps - 1 ? 'Finalizar ' : 'Siguiente →'}
            </button>
          </div>
          
          <button
            onClick={() => handleAction(onSkip)}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:scale-105 transition-transform duration-200"
          >
            Saltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialStep;