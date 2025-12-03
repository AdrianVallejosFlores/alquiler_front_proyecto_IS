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
<<<<<<< HEAD
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !targetElement) {
      setElementRect(null);
      return;
    }

    const updateElementPosition = () => {
      const element = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementRect(rect);
        
        // Aplicar efecto LED DIRECTAMENTE al elemento
        element.classList.add('tutorial-spotlight-active');
      }
    };

    updateElementPosition();
    const resizeObserver = new ResizeObserver(updateElementPosition);
    const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
    if (targetElementNode) {
      resizeObserver.observe(targetElementNode);
    }

    window.addEventListener('scroll', updateElementPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateElementPosition);
      
      // Limpiar efectos
      const element = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (element) {
        element.classList.remove('tutorial-spotlight-active');
      }
=======
  const [spotlightStyle, setSpotlightStyle] = useState({});

  useEffect(() => {
    if (!isActive || !targetElement) {
      setSpotlightStyle({});
      return;
    }

    const updateSpotlight = () => {
      const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (targetElementNode) {
        const rect = targetElementNode.getBoundingClientRect();
        
        setSpotlightStyle({
          '--spotlight-top': `${rect.top}px`,
          '--spotlight-left': `${rect.left}px`,
          '--spotlight-width': `${rect.width}px`,
          '--spotlight-height': `${rect.height}px`,
        } as React.CSSProperties);
      }
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
>>>>>>> origin/guiainteractiva-ricardoferminpari_3ersprint2corrida
    };
  }, [isActive, targetElement]);

  if (!isActive) return null;

  return (
<<<<<<< HEAD
    <>
      {/* Overlay difuminado */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      
      {/* Borde LED animado alrededor del elemento */}
      {elementRect && (
        <div 
          className="fixed z-50 border-3 border-blue-500 rounded-lg animate-pulse shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{
            top: `${elementRect.top - 8}px`,
            left: `${elementRect.left - 8}px`,
            width: `${elementRect.width + 16}px`,
            height: `${elementRect.height + 16}px`,
          }}
        />
      )}
      
      {/* Contenido del tutorial */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </>
=======
    <div className="fixed inset-0 z-50">
      {/* Fondo difuminado con spotlight */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 tutorial-overlay"
        style={spotlightStyle}
      >
        {/* Spotlight effect - área clara alrededor del elemento */}
        <div className="spotlight-area"></div>
      </div>
      
      {/* Contenido del tutorial */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
>>>>>>> origin/guiainteractiva-ricardoferminpari_3ersprint2corrida
  );
};

export default TutorialOverlay;