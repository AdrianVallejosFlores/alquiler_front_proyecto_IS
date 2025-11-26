// src/app/hooks/use-interactive-guide.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export const useInteractiveGuide = () => {
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = inactivo, 1 = intro, 2-7 = pasos
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('servineo-guide-seen');
    if (!hasSeenGuide) {
      setIsFirstVisit(true);
    }
  }, []);

  const startGuide = useCallback(() => {
    console.log('🔍 [DEBUG] Iniciando guía en PASO 0 (INTRO)');
    setIsGuideActive(true);
    setCurrentStep(0); // EMPEZAR EN INTRO
    localStorage.setItem('servineo-guide-seen', 'true');
    setIsFirstVisit(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      console.log('🔍 [DEBUG] Siguiente paso:', next);
      return next <= 6 ? next : prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => {
      const previous = prev - 1;
      console.log('🔍 [DEBUG] Paso anterior:', previous);
      return previous >= 0 ? previous : prev;
    });
  }, []);

  const closeGuide = useCallback(() => {
    console.log('🔍 [DEBUG] Cerrando guía');
    setIsGuideActive(false);
    setCurrentStep(0);
  }, []);

  const restartGuide = useCallback(() => {
    console.log('🔍 [DEBUG] Reiniciando guía');
    setCurrentStep(0);
    setIsGuideActive(true);
  }, []);

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