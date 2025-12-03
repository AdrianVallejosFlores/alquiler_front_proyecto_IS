'use client';

import React, { useEffect } from 'react';
import { useTutorial } from '../../hooks/useTutorial';
import { tutorialSteps } from './tutorialData';
import TutorialOverlay from './TutorialOverlay';
import TutorialStep from './TutorialStep';
import StartPanel from './StartPanel';
import CompletionPanel from './CompletionPanel';

const TutorialGuide: React.FC = () => {
  const {
    tutorialState,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    closeTutorial,
    restartTutorial
  } = useTutorial();

  // Obtener el paso actual para el spotlight
  const currentStep = tutorialState.isActive ? tutorialSteps[tutorialState.currentStep] : null;

  // Manejar teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!tutorialState.isActive && !tutorialState.showStartPanel && !tutorialState.isCompleted) return;

      switch (event.key) {
        case 'ArrowRight':
          if (tutorialState.isActive) nextStep();
          break;
        case 'ArrowLeft':
          if (tutorialState.isActive) prevStep();
          break;
        case 'Escape':
          if (tutorialState.isActive) skipTutorial();
          else if (tutorialState.showStartPanel) skipTutorial();
          else if (tutorialState.isCompleted) closeTutorial();
          break;
        case 'Enter':
          if (tutorialState.showStartPanel) startTutorial();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tutorialState, nextStep, prevStep, skipTutorial, startTutorial, closeTutorial]);

  // No mostrar nada si no hay estado activo
  if (!tutorialState.showStartPanel && !tutorialState.isActive && !tutorialState.isCompleted) {
    return null;
  }

  return (
    <>
      {/* Panel de Inicio */}
      {tutorialState.showStartPanel && (
        <StartPanel
          onStart={startTutorial}
          onSkip={skipTutorial}
        />
      )}

      {/* Overlay y Pasos del Tutorial */}
      {tutorialState.isActive && (
        <TutorialOverlay 
          isActive={true}
          targetElement={currentStep?.targetElement} // ✅ LÍNEA AÑADIDA
        >
          {tutorialSteps.map((step, index) => (
            index === tutorialState.currentStep && (
              <TutorialStep
                key={step.id}
                step={step}
                onNext={nextStep}
                onPrev={prevStep}
                onSkip={skipTutorial}
                currentStep={index}
                totalSteps={tutorialSteps.length}
              />
            )
          ))}
        </TutorialOverlay>
      )}

      {/* Panel de Finalización */}
      {tutorialState.isCompleted && (
        <CompletionPanel
          onRestart={restartTutorial}
          onClose={closeTutorial}
        />
      )}
    </>
  );
};

export default TutorialGuide;