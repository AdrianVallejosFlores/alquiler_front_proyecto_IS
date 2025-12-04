'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

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
  const [spotlightRect, setSpotlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const hasCalculatedRef = useRef<boolean>(false);

  // Función para calcular el spotlight de manera ESTABLE
  const calculateSpotlight = useCallback(() => {
    if (!targetElement) return null;
    
    const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
    if (!targetElementNode) return null;

    const rect = targetElementNode.getBoundingClientRect();
    
    // Para el PASO 6 específicamente
    if (targetElement === "support-section") {
      console.log("🎯 CALCULANDO SPOTLIGHT PARA PASO 6");
      console.log(`📏 Posición actual - top: ${rect.top}, left: ${rect.left}, width: ${rect.width}, height: ${rect.height}`);
      
      // Para el paso 6, hacer un spotlight más compacto alrededor del contenido real
      // Usar el rectángulo del elemento pero con menos padding
      
      return {
        top: rect.top - 15,           // Menos padding arriba
        left: rect.left - 20,         // Menos padding izquierda
        width: rect.width + 40,       // Padding total 40px
        height: rect.height + 30,     // Padding total 30px
        right: rect.left + rect.width + 40 - 20,
        bottom: rect.top + rect.height + 30 - 15
      };
    }
    
    // Para otros pasos
    return {
      top: rect.top - 15,
      left: rect.left - 15,
      width: rect.width + 30,
      height: rect.height + 30,
      right: rect.left + rect.width + 30 - 15,
      bottom: rect.top + rect.height + 30 - 15
    };
  }, [targetElement]);

  useEffect(() => {
    if (!isActive || !targetElement) {
      setSpotlightRect(null);
      hasCalculatedRef.current = false;
      return;
    }

    // Función para actualizar el spotlight de manera estable
    const updateSpotlightStable = () => {
      if (hasCalculatedRef.current) {
        // Solo calcular UNA vez por paso
        return;
      }
      
      const newRect = calculateSpotlight();
      if (newRect) {
        console.log("🎯 ESTABLECIENDO SPOTLIGHT FIJADO");
        console.log(`📍 Rectángulo fijado:`, newRect);
        setSpotlightRect(newRect);
        hasCalculatedRef.current = true;
        
        // Resaltar el elemento objetivo
        const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
        if (targetElementNode) {
          targetElementNode.classList.add('tutorial-highlight');
        }
      }
    };

    // STRATEGY: Esperar a que TODO esté completamente estable
    const waitForStability = () => {
      // Cancelar cualquier cálculo anterior pendiente
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      // Usar requestAnimationFrame para sincronizar con el renderizado del navegador
      animationFrameId.current = requestAnimationFrame(() => {
        // Esperar un frame más para asegurar estabilidad
        setTimeout(() => {
          updateSpotlightStable();
        }, 50);
      });
    };

    // Iniciar el proceso de estabilización
    waitForStability();

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      // Limpiar la clase al desmontar
      const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (targetElementNode) {
        targetElementNode.classList.remove('tutorial-highlight');
      }
      
      hasCalculatedRef.current = false;
    };
  }, [isActive, targetElement, calculateSpotlight]);

  if (!isActive || !spotlightRect) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 pointer-events-none">
      {/* Fondo difuminado COMPLETAMENTE FIJO */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{
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
          )`,
          transition: 'clip-path 0.3s ease-out'
        }}
      />
      
      {/* Borde resaltado - COMPLETAMENTE FIJO */}
      <div 
        className="absolute pointer-events-none border-4 border-blue-500 rounded-xl bg-transparent"
        style={{
          top: `${spotlightRect.top - 12}px`,
          left: `${spotlightRect.left - 12}px`,
          width: `${spotlightRect.width + 24}px`,
          height: `${spotlightRect.height + 24}px`,
          boxShadow: `
            0 0 0 9999px rgba(37, 99, 235, 0.35),
            0 0 60px rgba(59, 130, 246, 1),
            inset 0 0 25px rgba(255, 255, 255, 0.4)
          `
        }}
      />

      {/* Contenido del tutorial - permitir interacción */}
      <div className="absolute inset-0 pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default TutorialOverlay;