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
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const closeGuide = () => {
    setIsGuideActive(false);
    setCurrentStep(0);
  };

  const restartGuide = () => {
    startGuide();
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