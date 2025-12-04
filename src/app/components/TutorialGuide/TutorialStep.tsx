'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const originalStyle = useRef({
    overflow: '',
    position: '',
    top: '',
    width: '',
    height: ''
  });
  const scrollY = useRef(0);

  // Bloquear scroll COMPLETAMENTE en el body y html cuando el tutorial está activo
  useEffect(() => {
    const blockScroll = () => {
      // Guardar posición actual del scroll
      scrollY.current = window.scrollY;
      
      // Guardar los valores originales del body
      originalStyle.current = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        height: document.body.style.height
      };
      
      // Bloquear scroll en body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // También bloquear scroll en html
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'relative';
      document.documentElement.style.height = '100%';
    };

    const enableScroll = () => {
      // Restaurar valores originales del body
      document.body.style.overflow = originalStyle.current.overflow;
      document.body.style.position = originalStyle.current.position;
      document.body.style.top = originalStyle.current.top;
      document.body.style.width = originalStyle.current.width;
      document.body.style.height = originalStyle.current.height;
      
      // Restaurar valores originales del html
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.height = '';
      
      // Restaurar la posición del scroll
      window.scrollTo(0, scrollY.current);
    };

    // Bloquear scroll cuando el componente se monta
    blockScroll();

    // También prevenir scroll con rueda del mouse en toda la página
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Agregar event listeners para bloquear todos los tipos de scroll
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('keydown', (e) => {
      // Bloquear teclas de navegación (Page Up, Page Down, Space, Arrow keys)
      if ([
        'Space', ' ', 'PageUp', 'PageDown', 
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
      ].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Permitir scroll cuando el componente se desmonta
    return () => {
      enableScroll();
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('scroll', preventScroll);
    };
  }, []);

  // Scroll al elemento objetivo - solo al cambiar de paso
  useEffect(() => {
    const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
    if (targetElement) {
      // Permitir scroll momentáneamente
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.top = '';
      
      // Hacer scroll al elemento
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
      
      // Volver a bloquear después de un breve delay
      setTimeout(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
        scrollY.current = window.scrollY;
      }, 500);
      
      // Resaltar el elemento objetivo
      targetElement.classList.add('tutorial-highlight');
      
      return () => {
        targetElement.classList.remove('tutorial-highlight');
      };
    }
  }, [step.targetElement]);

  // Efecto para calcular la posición del tooltip
  useEffect(() => {
    // Esperar un poco para que todo se estabilice
    const timer = setTimeout(() => {
      const updatePosition = () => {
        const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
        if (targetElement && stepRef.current) {
          const rect = targetElement.getBoundingClientRect();
          const stepRect = stepRef.current.getBoundingClientRect();
          
          console.log(`🔍 PASO ${currentStep + 1} (${step.targetElement}):`);
          console.log(`📏 Elemento - top: ${rect.top}, left: ${rect.left}, width: ${rect.width}, height: ${rect.height}`);
          console.log(`📐 Tooltip - width: ${stepRect.width}, height: ${stepRect.height}`);
          
          let top = rect.bottom + 10;
          let left = rect.left;

          // Ajustar posición según la preferencia y espacio disponible
          if (step.position === 'top') {
            top = rect.top - stepRect.height - 10;
          }

          // POSICIÓN FIJA ESPECÍFICA PARA EL PASO 6
          if (step.targetElement === "support-section") {
            console.log("🎯 CONFIGURANDO POSICIÓN FIJA PARA PASO 6");
            
            // Para el paso 6, siempre poner el tooltip a la DERECHA del elemento
            // y centrado verticalmente con la sección de soporte
            left = rect.right + 20;
            
            // Centrar verticalmente con la sección
            const sectionCenter = rect.top + (rect.height / 2);
            top = sectionCenter - (stepRect.height / 2);
            
            console.log(`📍 Posición calculada - top: ${top}, left: ${left}`);
            
            // Si no cabe a la derecha (se sale de la pantalla)
            if (left + stepRect.width > window.innerWidth - 20) {
              console.log("⚠️ No cabe a la derecha, moviendo a IZQUIERDA");
              left = rect.left - stepRect.width - 20;
            }
            
            // Si no cabe a la izquierda tampoco
            if (left < 20) {
              console.log("⚠️ No cabe a la izquierda, poniendo ARRIBA");
              left = rect.left + (rect.width / 2) - (stepRect.width / 2);
              top = rect.top - stepRect.height - 20;
            }
          }

          // Asegurar que no se salga de la pantalla
          if (top + stepRect.height > window.innerHeight - 20) {
            top = window.innerHeight - stepRect.height - 20;
          }
          if (top < 20) {
            top = 20;
          }
          if (left + stepRect.width > window.innerWidth - 20) {
            left = window.innerWidth - stepRect.width - 20;
          }
          if (left < 20) {
            left = 20;
          }

          console.log(`✅ POSICIÓN FINAL - top: ${top}, left: ${left}`);
          setPosition({ top, left });
        }
      };

      updatePosition();
    }, 100); // Pequeño delay para estabilizar

    return () => clearTimeout(timer);
  }, [step, currentStep]);

  // Focus trap - mantener Tab dentro del tooltip
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
      currentTooltip.addEventListener('keydown', handleKeyDown);
      currentTooltip.setAttribute('tabindex', '-1');
      currentTooltip.focus();
      const firstButton = currentTooltip.querySelector('button');
      if (firstButton) {
        setTimeout(() => (firstButton as HTMLElement).focus(), 0);
      }
    }

    return () => {
      if (currentTooltip) {
        currentTooltip.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [currentStep]);

  return (
    <>
      <div
        ref={tooltipRef}
        className="fixed z-60 bg-white rounded-xl shadow-2xl border border-blue-100 max-w-sm w-full transform transition-all duration-300"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          position: 'fixed'
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
              onClick={onPrev}
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
              onClick={onNext}
              className="px-4 py-2 bg-linear-to-r from-[#52abff] to-[#11255a] text-white rounded-lg font-medium hover:from-[#3a9cff] hover:to-[#0e1f4d] transition-all duration-200 transform hover:scale-105"
            >
              {currentStep === totalSteps - 1 ? 'Finalizar ' : 'Siguiente →'}
            </button>
          </div>
          
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:scale-105 transition-transform duration-200"
          >
            Saltar
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default TutorialStep;
