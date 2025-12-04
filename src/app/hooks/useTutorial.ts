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
    // NOTE: We no longer auto-open the tutorial on first page load.
    // Instead we will open it when the user explicitly requests it (via
    // `show-tutorial`) or automatically after a successful login if the
    // user hasn't seen it yet. This avoids showing the guide before the
    // user signs in.
  }, []);

  // Escuchar evento personalizado para mostrar el tutorial
  useEffect(() => {
    const handleShowTutorial = () => {
      // Show the welcome/start panel when the user explicitly requests the
      // tutorial. We don't mark it as "seen" yet — mark when they actually
      // start the guide.
      setTutorialState({
        isActive: false,
        currentStep: 0,
        isCompleted: false,
        showStartPanel: true
      });
    };

    window.addEventListener('show-tutorial', handleShowTutorial);

    // If the user logs in successfully, and they haven't seen the tutorial
    // before (checked via localStorage), then start the tutorial
    const handleLogin = () => {
      const hasSeenTutorial = localStorage.getItem('servineo-tutorial-seen');
      if (!hasSeenTutorial) {
        // Show the welcome/start panel after login; user will click Start
        // to begin the step-by-step guide.
        setTutorialState({
          isActive: false,
          currentStep: 0,
          isCompleted: false,
          showStartPanel: true
        });
      }
    };

    window.addEventListener('login-exitoso', handleLogin as EventListener);

    return () => {
      window.removeEventListener('show-tutorial', handleShowTutorial);
      window.removeEventListener('login-exitoso', handleLogin as EventListener);
    };
  }, []);

  const startTutorial = () => {
    // mark as seen when the user actually starts the guide
    try { localStorage.setItem('servineo-tutorial-seen', 'true'); } catch (e) {}
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