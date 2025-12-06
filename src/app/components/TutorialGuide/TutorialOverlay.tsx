'use client';

import React, { useEffect, useState } from 'react';

interface TutorialOverlayProps {
  isActive: boolean;
  targetElement?: string;
  children: React.ReactNode;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ 
  isActive, 
  targetElement,
  children 
}) => {
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !targetElement) {
      setSpotlightRect(null);
      return;
    }

    const updateSpotlight = () => {
      const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (targetElementNode) {
        const rect = targetElementNode.getBoundingClientRect();
        setSpotlightRect(rect);
        
        // Asegurar que el elemento objetivo sea completamente visible
        targetElementNode.classList.add('tutorial-highlight');
      }
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
      
      // Limpiar la clase al desmontar
      const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (targetElementNode) {
        targetElementNode.classList.remove('tutorial-highlight');
      }
    };
  }, [isActive, targetElement]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo difuminado completo con "hueco" transparente */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        style={
          spotlightRect ? {
            clipPath: `polygon(
              0% 0%, 
              0% 100%, 
              ${spotlightRect.left}px 100%, 
              ${spotlightRect.left}px ${spotlightRect.top}px, 
              ${spotlightRect.right}px ${spotlightRect.top}px, 
              ${spotlightRect.right}px ${spotlightRect.bottom}px, 
              ${spotlightRect.left}px ${spotlightRect.bottom}px, 
              ${spotlightRect.left}px 100%, 
              100% 100%, 
              100% 0%
            )`
          } : {}
        }
      />
      
      {/* Borde resaltado alrededor del elemento - MUY VISIBLE */}
      {spotlightRect && (
        <div 
          className="absolute pointer-events-none border-3 border-blue-500 rounded-lg bg-transparent"
          style={{
            top: `${spotlightRect.top - 8}px`,
            left: `${spotlightRect.left - 8}px`,
            width: `${spotlightRect.width + 16}px`,
            height: `${spotlightRect.height + 16}px`,
            boxShadow: `
              0 0 0 9999px rgba(37, 99, 235, 0.2),
              0 0 40px rgba(59, 130, 246, 0.8)
            `,
            animation: 'border-pulse 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Contenido del tutorial */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export default TutorialOverlay;
