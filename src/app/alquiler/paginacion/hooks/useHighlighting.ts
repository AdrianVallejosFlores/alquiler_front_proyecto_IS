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
      // Persistir en sessionStorage para recargas
      sessionStorage.setItem('highlightTerms', JSON.stringify(terms));
    } else {
      // Solo limpiar si estamos en la página de búsqueda
      if (pathname.includes('/alquiler')) {
        setSearchTerms([]);
        sessionStorage.removeItem('highlightTerms');
      }
    }
  }, [getSearchTermsFromURL, pathname]);

  // Cargar desde sessionStorage en recargas
  useEffect(() => {
    // Solo cargar si estamos en la página de búsqueda
    if (!pathname.includes('/alquiler')) {
      setSearchTerms([]);
      return;
    }

    const storedTerms = sessionStorage.getItem('highlightTerms');
    if (storedTerms) {
      try {
        const terms = JSON.parse(storedTerms);
        if (Array.isArray(terms) && terms.length > 0) {
          setSearchTerms(terms);
        }
      } catch (error) {
        console.warn('Error loading highlight terms from storage:', error);
        sessionStorage.removeItem('highlightTerms');
      }
    }
  }, [pathname]);

  const clearHighlighting = useCallback(() => {
    setSearchTerms([]);
    sessionStorage.removeItem('highlightTerms');
  }, []);

  return {
    searchTerms,
    clearHighlighting,
    hasHighlighting: searchTerms.length > 0
  };
};