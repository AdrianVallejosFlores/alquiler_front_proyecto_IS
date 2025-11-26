'use client';

import { useEffect, useState } from 'react';
import {
  getSearchTermsFromStorage,
  setSearchTermsInStorage,
  clearSearchTermsFromStorage,
  isSearchTermsStillValid,
} from '../../../../lib/searchHighlight.utils';

/**
 * Hook personalizado para gestionar términos de búsqueda en storage
 * Persiste los términos cuando se realizan búsquedas
 * Y los recupera cuando se navega entre páginas
 */
export function useSearchTermsStorage() {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar términos del storage al montar el componente
  useEffect(() => {
    const terms = getSearchTermsFromStorage();
    if (terms.length > 0 && isSearchTermsStillValid()) {
      setSearchTerms(terms);
    }
    setIsLoaded(true);
  }, []);

  // Guardar términos en storage
  const saveSearchTerms = (terms: string[]) => {
    if (terms.length > 0) {
      const filteredTerms = terms.filter((t) => t.trim().length > 0);
      setSearchTermsInStorage(filteredTerms);
      setSearchTerms(filteredTerms);
    } else {
      clearSearchTermsFromStorage();
      setSearchTerms([]);
    }
  };

  // Limpiar términos
  const clearSearchTerms = () => {
    clearSearchTermsFromStorage();
    setSearchTerms([]);
  };

  return {
    searchTerms,
    saveSearchTerms,
    clearSearchTerms,
    isLoaded,
  };
}
