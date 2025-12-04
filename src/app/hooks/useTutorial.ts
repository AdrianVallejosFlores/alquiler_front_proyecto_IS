'use client';

import { useState, useEffect } from 'react';

export interface TutorialState {
  isActive: boolean;
  currentStep: number;
  isCompleted: boolean;
  showStartPanel: boolean;
}

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isActive: false,
    currentStep: 0,
    isCompleted: false,
    showStartPanel: false
  });

  // Escuchar evento personalizado para mostrar el tutorial
  useEffect(() => {
    const handleShowTutorial = () => {
      console.log('🎯 Evento "show-tutorial" recibido');
      setTutorialState({
        isActive: false,
        currentStep: 0,
        isCompleted: false,
        showStartPanel: true
      });
    };

    const handleLogin = () => {
      console.log('🔑 Evento "login-exitoso" recibido');
      const hasSeenTutorial = localStorage.getItem('servineo-tutorial-seen');
      if (!hasSeenTutorial) {
        setTutorialState({
          isActive: false,
          currentStep: 0,
          isCompleted: false,
          showStartPanel: true
        });
      }
    };

    window.addEventListener('show-tutorial', handleShowTutorial);
    window.addEventListener('login-exitoso', handleLogin as EventListener);

    return () => {
      window.removeEventListener('show-tutorial', handleShowTutorial);
      window.removeEventListener('login-exitoso', handleLogin as EventListener);
    };
  }, []);

  const startTutorial = () => {
    console.log('🚀 Tutorial iniciado');
    try { 
      localStorage.setItem('servineo-tutorial-seen', 'true'); 
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
    setTutorialState({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  const nextStep = () => {
    console.log(`➡️ Avanzando del paso ${tutorialState.currentStep} al ${tutorialState.currentStep + 1}`);
    setTutorialState(prev => {
      // IMPORTANTE: Cambiar de 5 a 6 pasos (0-5)
      if (prev.currentStep < 5) { // 6 pasos totales (0, 1, 2, 3, 4, 5)
        return { ...prev, currentStep: prev.currentStep + 1 };
      } else {
        console.log('✅ Tutorial completado');
        return { 
          ...prev, 
          isActive: false, 
          isCompleted: true,
          currentStep: 0
        };
      }
    });
  };

  const prevStep = () => {
    console.log(`⬅️ Retrocediendo del paso ${tutorialState.currentStep} al ${tutorialState.currentStep - 1}`);
    setTutorialState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const skipTutorial = () => {
    console.log('⏭️ Tutorial saltado');
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  const closeTutorial = () => {
    console.log('❌ Tutorial cerrado');
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  const restartTutorial = () => {
    console.log('🔄 Tutorial reiniciado');
    setTutorialState({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  return {
    tutorialState,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    closeTutorial,
    restartTutorial
  };
};