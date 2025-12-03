'use client';

import { useMemo } from 'react';
import type { Filtros } from '../../BusquedaAvanzada/BusquedaAvanzada';

interface FilterTermMatch {
  matchedFields: string[];
  hasMatch: boolean;
}

/**
 * Hook que detecta si algún filtro aplicado coincide con los términos de búsqueda
 * Retorna los campos del filtro que coinciden con los términos
 */
export const useFilterTermMatch = (
  searchTerms: string[],
  appliedFilters: Filtros | null
): FilterTermMatch => {
  return useMemo(() => {
    if (!searchTerms.length || !appliedFilters) {
      return { matchedFields: [], hasMatch: false };
    }

    const normalizeForComparison = (str: string): string => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    const normalizedTerms = searchTerms.map(normalizeForComparison);
    const matchedFields: string[] = [];

    // Verificar tipoServicio
    if (appliedFilters.tipoServicio) {
      const normalizedFilter = normalizeForComparison(appliedFilters.tipoServicio);
      if (normalizedTerms.includes(normalizedFilter)) {
        matchedFields.push('tipoServicio');
      }
    }

    // Verificar zona
    if (appliedFilters.zona) {
      const normalizedFilter = normalizeForComparison(appliedFilters.zona);
      if (normalizedTerms.includes(normalizedFilter)) {
        matchedFields.push('zona');
      }
    }

    // Verificar horario
    if (appliedFilters.horario) {
      const normalizedFilter = normalizeForComparison(appliedFilters.horario);
      if (normalizedTerms.includes(normalizedFilter)) {
        matchedFields.push('horario');
      }
    }

    // Verificar experiencia
    if (appliedFilters.experiencia) {
      const normalizedFilter = normalizeForComparison(appliedFilters.experiencia);
      if (normalizedTerms.includes(normalizedFilter)) {
        matchedFields.push('experiencia');
      }
    }

    return {
      matchedFields,
      hasMatch: matchedFields.length > 0
    };
  }, [searchTerms, appliedFilters]);
};
