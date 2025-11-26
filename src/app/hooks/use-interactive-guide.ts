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
    setCurrentStep(0); // Empezar en paso 0 (bienvenida)
    localStorage.setItem('servineo-guide-seen', 'true');
    setIsFirstVisit(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1;
      return next < 6 ? next : prev; // 6 pasos totales
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