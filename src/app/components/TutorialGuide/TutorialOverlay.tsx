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
  const animationFrameId = useRef<number | null>(null); // ✅ CORREGIDO: Valor inicial null
  const hasCalculatedRef = useRef<boolean>(false); // ✅ CORREGIDO: Valor inicial false

  // Función para calcular el spotlight de manera ESTABLE
  const calculateSpotlight = useCallback(() => {
    if (!targetElement) return null;
    
    const targetElementNode = document.querySelector(`[data-tutorial="${targetElement}"]`);
    if (!targetElementNode) return null;

    const rect = targetElementNode.getBoundingClientRect();
    
    // Para el PASO 6 específicamente
    if (targetElement === "support-section") {
      console.log("🎯 CALCULANDO SPOTLIGHT ESTABLE PARA PASO 6");
      console.log(`📏 Posición actual - top: ${rect.top}, left: ${rect.left}`);
      
      // MEDICIÓN PRECISA: Obtener la posición del contenido REAL
      const contentElements = targetElementNode.querySelectorAll('li, a, button, span');
      let contentRect = rect;
      
      if (contentElements.length > 0) {
        // Calcular el bounding box de TODO el contenido
        let minTop = Infinity, minLeft = Infinity, maxBottom = -Infinity, maxRight = -Infinity;
        
        contentElements.forEach(el => {
          const elRect = el.getBoundingClientRect();
          minTop = Math.min(minTop, elRect.top);
          minLeft = Math.min(minLeft, elRect.left);
          maxBottom = Math.max(maxBottom, elRect.bottom);
          maxRight = Math.max(maxRight, elRect.right);
        });
        
        contentRect = new DOMRect(
          minLeft,
          minTop,
          maxRight - minLeft,
          maxBottom - minTop
        );
        
        console.log("✅ Usando bounding box del contenido real");
      }
      
      // Crear rectángulo EXPANDIDO para cubrir bien
      return {
        top: contentRect.top - 25,
        left: contentRect.left - 30,
        width: Math.max(contentRect.width, 300) + 60,  // Mínimo 300px + padding
        height: Math.max(contentRect.height, 200) + 50, // Mínimo 200px + padding
        right: contentRect.left + Math.max(contentRect.width, 300) + 60 - 30,
        bottom: contentRect.top + Math.max(contentRect.height, 200) + 50 - 25
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
    // 1. Esperar a que termine cualquier animación de scroll
    // 2. Esperar a que el navegador haga todos los reflows
    // 3. Calcular UNA sola vez y mantenerlo fijo
    
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
    <div ref={overlayRef} className="fixed inset-0 z-50 pointer-events-none tutorial-step-6-container force-stable-render">
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
          transition: 'clip-path 0.3s ease-out' // Transición suave pero no reactiva
        }}
      />
      
      {/* Borde resaltado - COMPLETAMENTE FIJO */}
      <div 
        className="absolute pointer-events-none border-4 border-blue-500 rounded-xl bg-transparent tutorial-spotlight-step-6"
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
