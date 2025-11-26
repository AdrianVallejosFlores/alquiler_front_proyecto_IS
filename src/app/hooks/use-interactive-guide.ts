'use client';

import { useState, useEffect } from 'react';

export const useInteractiveGuide = () => {
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('servineo-guide-seen');
    if (!hasSeenGuide) {
      setIsFirstVisit(true);
    }
  }, []);

  const startGuide = () => {
    setIsGuideActive(true);
    setCurrentStep(0); // Empezar en paso 0 (que mostrará la bienvenida)
    localStorage.setItem('servineo-guide-seen', 'true');
    setIsFirstVisit(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1;
      return next < guideSteps.length ? next : prev;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const previous = prev - 1;
      return previous >= 0 ? previous : prev;
    });
  };

  const closeGuide = () => {
    setIsGuideActive(false);
    setCurrentStep(0);
  };

  const restartGuide = () => {
    setCurrentStep(0);
    setIsGuideActive(true);
  };

  return {
    isGuideActive,
    currentStep,
    isFirstVisit,
    startGuide,
    nextStep,
    prevStep,
    closeGuide,
    restartGuide
  };
};

// Necesitamos definir guideSteps aquí también para la función nextStep
const guideSteps = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }
];