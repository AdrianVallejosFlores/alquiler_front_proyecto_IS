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
    };
  }, [isActive, targetElement]);

  if (!isActive) return null;

  return (
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
  );
};

export default TutorialOverlay;