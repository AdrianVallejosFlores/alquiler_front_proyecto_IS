'use client';

import React, { useEffect, useRef } from 'react';
import { tutorialFeatures } from './tutorialData';

interface StartPanelProps {
  onStart: () => void;
  onSkip: () => void;
}

const StartPanel: React.FC<StartPanelProps> = ({ onStart, onSkip }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap - mantener Tab dentro del panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (!panelRef.current) return;

      // Obtener todos los elementos focusables dentro del panel
      const focusableElements = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusableArray = Array.from(focusableElements) as HTMLElement[];

      if (focusableArray.length === 0) return;

      const firstElement = focusableArray[0];
      const lastElement = focusableArray[focusableArray.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const currentPanel = panelRef.current;
    if (currentPanel) {
      currentPanel.addEventListener('keydown', handleKeyDown);
      // Asegurar que el contenedor pueda recibir foco y posicionar el foco dentro
      currentPanel.setAttribute('tabindex', '-1');
      currentPanel.focus();
      const firstButton = currentPanel.querySelector('button');
      if (firstButton) {
        setTimeout(() => (firstButton as HTMLButtonElement).focus(), 0);
      }
    }

    return () => {
      if (currentPanel) {
        currentPanel.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);
  return (
    <div ref={panelRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#11255a] to-[#52abff] p-6 rounded-t-2xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a SERVINEO!</h2>
          <p className="text-blue-100">Te mostraremos las funciones principales en 2 minutos</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {tutorialFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">{feature.name}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={onStart}
              className="w-full bg-linear-to-r from-[#52abff] to-[#11255a] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#3a9cff] hover:to-[#0e1f4d] transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
               Comenzar Recorrido
            </button>

            <button
              onClick={onSkip}
              className="w-full border border-gray-300 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Saltar Tutorial
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 rounded-b-2xl text-center">
          <p className="text-xs text-gray-500">
            Usa <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">→</kbd> para avanzar • 
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1">←</kbd> para retroceder • 
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs ml-1">ESC</kbd> para salir
          </p>
        </div>

      </div>
    </div>
  );
};

export default StartPanel;
