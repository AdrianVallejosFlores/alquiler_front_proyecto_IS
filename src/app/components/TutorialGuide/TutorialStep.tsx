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
          top = 10;
        }
        if (left + stepRect.width > window.innerWidth) {
          left = window.innerWidth - stepRect.width - 20;
        }
        if (left < 20) {
          left = 0;
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

 
};

export default TutorialStep;