'use client';

import React from 'react';

interface TutorialOverlayProps {
  isActive: boolean;
  children: React.ReactNode;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ 
  isActive, 
  children 
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo difuminado */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
      
      {/* Contenido del tutorial */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export default TutorialOverlay;