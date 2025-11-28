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

  useEffect(() => {
    // Mostrar panel de inicio automáticamente al cargar la página por primera vez
    const hasSeenTutorial = localStorage.getItem('servineo-tutorial-seen');
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setTutorialState(prev => ({
          ...prev,
          showStartPanel: true
        }));
        localStorage.setItem('servineo-tutorial-seen', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Escuchar evento personalizado para mostrar el tutorial
  useEffect(() => {
    const handleShowTutorial = () => {
      setTutorialState({
        isActive: true,
        currentStep: 0,
        isCompleted: false,
        showStartPanel: false
      });
    };

    window.addEventListener('show-tutorial', handleShowTutorial);
    
    return () => {
      window.removeEventListener('show-tutorial', handleShowTutorial);
    };
  }, []);

  const startTutorial = () => {
    setTutorialState({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  const nextStep = () => {
    setTutorialState(prev => {
      if (prev.currentStep < 5) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      } else {
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
    setTutorialState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const skipTutorial = () => {
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  const closeTutorial = () => {
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      showStartPanel: false
    });
  };

  const restartTutorial = () => {
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