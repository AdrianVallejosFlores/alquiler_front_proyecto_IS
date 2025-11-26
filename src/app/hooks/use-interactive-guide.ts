// src/app/hooks/use-interactive-guide.ts
'use client';

import { useState, useEffect } from 'react';

export const useInteractiveGuide = () => {
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Verificar si es la primera visita del usuario
    const hasSeenGuide = localStorage.getItem('servineo-guide-seen');
    if (!hasSeenGuide) {
      setIsFirstVisit(true);
    }
  }, []);

  const startGuide = () => {
    setIsGuideActive(true);
    setCurrentStep(0);
    localStorage.setItem('servineo-guide-seen', 'true');
    setIsFirstVisit(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1;
      // CORRECCIÓN: No permitir que currentStep exceda el número de pasos
      return next < guideSteps.length ? next : prev;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const previous = prev - 1;
      // CORRECCIÓN: No permitir que currentStep sea menor que 0
      return previous >= 0 ? previous : prev;
    });
  };

  const closeGuide = () => {
    setIsGuideActive(false);
    setCurrentStep(0);
  };

  const restartGuide = () => {
    setCurrentStep(0);
  };

  return {
    isGuideActive,
    setIsGuideActive,
    currentStep,
    setCurrentStep,
    isFirstVisit,
    startGuide,
    nextStep,
    prevStep,
    closeGuide,
    restartGuide
  };
};

// CORRECCIÓN: Mover guideSteps aquí para evitar dependencia circular
const guideSteps = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
  { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }
];