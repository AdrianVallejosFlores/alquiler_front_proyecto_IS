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
    };
  }, [isActive, targetElement]);

  if (!isActive) return null;

  return (
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
  );
};

export default TutorialOverlay;