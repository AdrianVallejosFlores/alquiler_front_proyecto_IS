'use client';

import React from 'react';

interface HighlightedTextProps {
  text: string;
  searchTerms: string[];
  highlightClassName?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerms,
  highlightClassName = "bg-yellow-300 font-medium"
}) => {
  if (!searchTerms.length || !text) {
    return <span>{text}</span>;
  }

  // Normalización mejorada para cumplir todos los criterios
  const normalizeForHighlight = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Elimina tildes y diacríticos
      .replace(/[´`'"]/g, '')
      .replace(/[^\w\sáéíóúñü\-_\.]/gi, ' ') // Preserva -_. en palabras
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
  };

  const normalizedText = normalizeForHighlight(text);
  const originalText = String(text);
  
  let lastIndex = 0;
  const segments: JSX.Element[] = [];
  
  // Crear patrón de búsqueda mejorado
  const searchPattern = searchTerms
    .map(term => term.trim())
    .filter(term => term.length > 0)
    .map(term => normalizeForHighlight(term))
    .filter(term => term.length > 0)
    .join('|');

  if (!searchPattern) {
    return <span>{originalText}</span>;
  }

  try {
    const regex = new RegExp(`(${searchPattern})`, 'gi');
    
    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      // Texto antes del match
      if (match.index > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {originalText.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Texto resaltado (usa texto original para mantener formato)
      const originalMatch = originalText.substring(match.index, match.index + match[0].length);
      segments.push(
        <mark key={`highlight-${match.index}`} className={highlightClassName}>
          {originalMatch}
        </mark>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Texto después del último match
    if (lastIndex < originalText.length) {
      segments.push(
        <span key={`text-${lastIndex}`}>
          {originalText.substring(lastIndex)}
        </span>
      );
    }

    return <>{segments}</>;
  } catch (error) {
    console.warn('Error en resaltado:', error);
    return <span>{originalText}</span>;
  }
};