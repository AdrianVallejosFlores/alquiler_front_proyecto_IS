'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

export const useHighlighting = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  const getSearchTermsFromURL = useCallback((): string[] => {
    const query = searchParams.get('q');
    if (!query) return [];
    
    return query
      .split(' ')
      .map(term => term.trim())
      .filter(term => term.length > 0);
  }, [searchParams]);

  // Efecto principal para sincronizar con URL
  useEffect(() => {
    const terms = getSearchTermsFromURL();
    
    if (terms.length > 0) {
      setSearchTerms(terms);
      // Persistir en localStorage para mantener entre secciones
      localStorage.setItem('highlightTerms', JSON.stringify(terms));
    } else {
      // Solo limpiar si estamos fuera del contexto de búsqueda
      if (!pathname.includes('/alquiler')) {
        setSearchTerms([]);
        localStorage.removeItem('highlightTerms');
      }
    }
  }, [getSearchTermsFromURL, pathname]);

  // Cargar desde localStorage en navegaciones
  useEffect(() => {
    const storedTerms = localStorage.getItem('highlightTerms');
    if (storedTerms) {
      try {
        const terms = JSON.parse(storedTerms);
        if (Array.isArray(terms) && terms.length > 0) {
          setSearchTerms(terms);
        }
      } catch (error) {
        console.warn('Error loading highlight terms from storage:', error);
        localStorage.removeItem('highlightTerms');
      }
    }
  }, []);

  const clearHighlighting = useCallback(() => {
    setSearchTerms([]);
    localStorage.removeItem('highlightTerms');
  }, []);

  return {
    searchTerms,
    clearHighlighting,
    hasHighlighting: searchTerms.length > 0
  };
};