'use client';

import React, { useEffect, useState, useRef } from 'react';

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
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !targetElement) {
      setSpotlightRect(null);
      return;
    }

    const updateSpotlight = () => {
      const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (targetElementNode) {
        const rect = targetElementNode.getBoundingClientRect();
        
        // AJUSTE ESPECIAL PARA EL PASO 6 (support-section)
        if (targetElement === "support-section") {
          // Para el paso 6, expandimos un poco el rectángulo para cubrir toda la sección
          // y centrarlo mejor
          const expandedRect = {
            top: rect.top - 10, // 10px más arriba
            bottom: rect.bottom + 10, // 10px más abajo
            left: rect.left - 15, // 15px más a la izquierda
            right: rect.right + 15, // 15px más a la derecha
            width: rect.width + 30, // 30px más ancho
            height: rect.height + 20, // 20px más alto
            x: rect.left - 15,
            y: rect.top - 10
          };
          
          // Crear un DOMRect personalizado
          const customRect = new DOMRect(
            expandedRect.x,
            expandedRect.y,
            expandedRect.width,
            expandedRect.height
          );
          
          setSpotlightRect(customRect);
        } else {
          // Para los otros pasos, mantener el comportamiento normal
          setSpotlightRect(rect);
        }
        
        // Asegurar que el elemento objetivo sea completamente visible
        targetElementNode.classList.add('tutorial-highlight');
      }
    };

    // Calcular posición inicial
    updateSpotlight();

    return () => {
      // Limpiar la clase al desmontar
      const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (targetElementNode) {
        targetElementNode.classList.remove('tutorial-highlight');
      }
    };
  }, [isActive, targetElement]);

  if (!isActive) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50">
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
      
      {/* Borde resaltado alrededor del elemento - CON AJUSTE PARA PASO 6 */}
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