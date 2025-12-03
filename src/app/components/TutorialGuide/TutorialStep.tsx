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

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
      if (targetElement && stepRef.current) {
        const rect = targetElement.getBoundingClientRect();
        const stepRect = stepRef.current.getBoundingClientRect();
        
        let top = rect.bottom + 10;
        let left = rect.left;

        // Ajustar posición según la preferencia y espacio disponible
        if (step.position === 'top') {
          top = rect.top - stepRect.height - 10;
        }

        // Asegurar que no se salga de la pantalla
        if (top + stepRect.height > window.innerHeight) {
          top = window.innerHeight - stepRect.height - 20;
        }
        if (top < 20) {
          top = 20;
        }
        if (left + stepRect.width > window.innerWidth) {
          left = window.innerWidth - stepRect.width - 20;
        }
        if (left < 20) {
          left = 20;
        }

        setPosition({ top, left });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step]);

  // Scroll al elemento objetivo
  useEffect(() => {
    const targetElement = document.querySelector(`[data-tutorial="${step.targetElement}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
      
      // Resaltar el elemento objetivo
      targetElement.classList.add('tutorial-highlight');
      
      return () => {
        targetElement.classList.remove('tutorial-highlight');
      };
    }
  }, [step.targetElement]);

  return (
    <>
      {/* Tooltip del paso */}
      <div
        ref={stepRef}
        className="fixed z-60 bg-white rounded-xl shadow-2xl border border-blue-100 max-w-sm w-full transform transition-all duration-300"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        {/* Header */}
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

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">{step.description}</p>
        </div>

        {/* Actions */}
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
              {currentStep === totalSteps - 1 ? 'Finalizar 🎉' : 'Siguiente →'}
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
    </>
  );
};

export default TutorialStep;