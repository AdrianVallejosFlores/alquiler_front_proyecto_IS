/**
 * searchHighlight.utils.ts
 * 
 * Sistema completo de resaltado de búsquedas con soporte para:
 * - Case-insensitive
 * - Acentos y variaciones diacríticas (Å, Ü, å, ü)
 * - Múltiples palabras
 * - Variaciones singular/plural
 * - Caracteres especiales (-, _, ., , etc)
 * - Saltos de línea
 * - Evitar resaltado doble/anidado
 */

/**
 * Normaliza texto para búsqueda/comparación
 * Elimina acentos, convierte a minúsculas, unifica espacios
 */
export function normalizeTextForSearch(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .replace(/\s+/g, ' ') // Unifica espacios
    .trim();
}

/**
 * Normaliza un término de búsqueda
 * Mantiene la estructura pero lo prepara para buscar
 */
export function normalizeSearchTerm(term: string): string {
  if (!term) return '';
  
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Separa un término de búsqueda en palabras individuales
 * Maneja espacios múltiples
 */
export function splitSearchTerms(searchTerm: string): string[] {
  if (!searchTerm) return [];
  
  return searchTerm
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter((term) => term.length > 0);
}

/**
 * Encuentra todas las posiciones de un término normalizado en un texto
 * Retorna: array de {start, end, original} para cada coincidencia
 */
export function findAllMatches(
  text: string,
  searchTerm: string
): Array<{ start: number; end: number; original: string }> {
  if (!text || !searchTerm) return [];

  const normalizedText = normalizeTextForSearch(text);
  const normalizedTerm = normalizeSearchTerm(searchTerm);
  const matches: Array<{ start: number; end: number; original: string }> = [];

  let searchIndex = 0;
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Buscar en el texto normalizado
    searchIndex = normalizedText.indexOf(normalizedTerm, searchIndex);

    if (searchIndex === -1) break;

    // Mapear índice normalizado al texto original
    // Contamos caracteres en el texto original hasta llegar al índice en el normalizado
    let originalIndex = 0;
    let normalizedIndex = 0;

    while (normalizedIndex < searchIndex && originalIndex < text.length) {
      const char = text[originalIndex];
      const normalized = normalizeTextForSearch(char);
      normalizedIndex += normalized.length;
      originalIndex++;
    }

    // Encontrar la longitud original del término
    let termLength = 0;
    let normalizedTermIndex = 0;

    while (normalizedTermIndex < normalizedTerm.length && originalIndex < text.length) {
      const char = text[originalIndex];
      const normalized = normalizeTextForSearch(char);

      if (normalized.length > 0) {
        normalizedTermIndex += normalized.length;
      }

      termLength++;
      originalIndex++;
    }

    const start = originalIndex - termLength;
    const end = originalIndex;
    const original = text.substring(start, end);

    // Evitar duplicados
    if (!matches.some((m) => m.start === start && m.end === end)) {
      matches.push({ start, end, original });
    }

    searchIndex += normalizedTerm.length;
    currentIndex = originalIndex;
  }

  return matches;
}

/**
 * Busca coincidencias de forma más precisa usando regex
 * Útil para encontrar límites de palabras correctos
 */
export function findMatchesWithBoundaries(
  text: string,
  terms: string[]
): Array<{ start: number; end: number; original: string; term: string }> {
  if (!text || terms.length === 0) return [];

  const matches: Array<{ start: number; end: number; original: string; term: string }> = [];
  const normalizedText = normalizeTextForSearch(text);

  for (const term of terms) {
    const normalizedTerm = normalizeSearchTerm(term);
    if (!normalizedTerm) continue;

    // Buscar todas las ocurrencias
    let searchStart = 0;
    let matchIndex = normalizedText.indexOf(normalizedTerm, searchStart);

    while (matchIndex !== -1) {
      // Mapear de vuelta al texto original
      let originalPos = 0;
      let normalizedPos = 0;

      // Contar hasta el inicio de la coincidencia
      while (normalizedPos < matchIndex && originalPos < text.length) {
        const char = text[originalPos];
        const normalized = normalizeTextForSearch(char);
        normalizedPos += normalized.length;
        originalPos++;
      }

      const start = originalPos;

      // Contar la longitud del término
      let termLength = 0;
      let termNormalizedPos = 0;

      while (termNormalizedPos < normalizedTerm.length && originalPos < text.length) {
        const char = text[originalPos];
        const normalized = normalizeTextForSearch(char);

        if (normalized.length > 0) {
          termNormalizedPos += normalized.length;
        }

        termLength++;
        originalPos++;
      }

      const end = start + termLength;
      const original = text.substring(start, end);

      // Evitar duplicados
      if (!matches.some((m) => m.start === start && m.end === end)) {
        matches.push({ start, end, original, term });
      }

      searchStart = matchIndex + normalizedTerm.length;
      matchIndex = normalizedText.indexOf(normalizedTerm, searchStart);
    }
  }

  // Ordenar por posición
  return matches.sort((a, b) => a.start - b.start);
}

/**
 * Resalta términos en texto
 * Retorna array de partes: {text, highlighted}
 */
export function highlightMatches(
  text: string,
  searchTerms: string[]
): Array<{ text: string; highlighted: boolean }> {
  if (!text || !searchTerms.length) {
    return [{ text, highlighted: false }];
  }

  const matches = findMatchesWithBoundaries(text, searchTerms);

  if (matches.length === 0) {
    return [{ text, highlighted: false }];
  }

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let lastIndex = 0;

  // Filtrar matches para evitar solapamientos
  const filteredMatches = filterOverlappingMatches(matches);

  for (const match of filteredMatches) {
    // Agregar texto antes de la coincidencia
    if (match.start > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.start),
        highlighted: false,
      });
    }

    // Agregar texto coincidente
    parts.push({
      text: text.substring(match.start, match.end),
      highlighted: true,
    });

    lastIndex = match.end;
  }

  // Agregar texto restante
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false,
    });
  }

  return parts;
}

/**
 * Filtra matches que se solapan, mantiene solo los que no colisionan
 */
function filterOverlappingMatches(
  matches: Array<{ start: number; end: number }> & any
): Array<{ start: number; end: number } & any> {
  if (matches.length === 0) return [];

  const sorted = [...matches].sort((a, b) => a.start - b.start);
  const filtered = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = filtered[filtered.length - 1];

    // Si no se solapan, agregar
    if (current.start >= last.end) {
      filtered.push(current);
    } else if (current.end > last.end) {
      // Si el actual es más largo, reemplazar
      filtered[filtered.length - 1] = current;
    }
    // Si current está completamente dentro de last, ignorar
  }

  return filtered;
}

/**
 * Resalta múltiples campos de un objeto Job
 * Campos a resaltar: title, company, service, description
 */
export function highlightJobFields(
  job: any,
  searchTerms: string[]
): Record<string, Array<{ text: string; highlighted: boolean }>> {
  const fieldsToHighlight = ['title', 'company', 'service', 'description'];
  const result: Record<string, Array<{ text: string; highlighted: boolean }>> = {};

  for (const field of fieldsToHighlight) {
    if (job[field]) {
      result[field] = highlightMatches(String(job[field]), searchTerms);
    }
  }

  return result;
}

/**
 * Verifica si una palabra tiene variación singular/plural
 */
export function getSingularPluralVariations(word: string): string[] {
  const variations = [word];

  // Reglas básicas españolas
  if (word.endsWith('o')) {
    variations.push(word + 's');
  } else if (word.endsWith('s')) {
    variations.push(word.slice(0, -1));
  } else if (word.endsWith('a')) {
    variations.push(word + 's');
  } else if (word.endsWith('í')) {
    variations.push(word.slice(0, -1) + 'ías');
  } else if (word.endsWith('ía')) {
    variations.push(word.slice(0, -2) + 'í');
  }

  return [...new Set(variations)]; // Evitar duplicados
}

/**
 * Obtiene variaciones de un término considerando acentos
 */
export function getTermVariations(term: string): string[] {
  const variations = new Set<string>();
  const normalized = normalizeSearchTerm(term);

  variations.add(term);
  variations.add(normalized);

  // Agregar variaciones singular/plural
  const singularPlurals = getSingularPluralVariations(term);
  singularPlurals.forEach((v) => variations.add(v));

  const normalizedSingularPlurals = getSingularPluralVariations(normalized);
  normalizedSingularPlurals.forEach((v) => variations.add(v));

  return Array.from(variations).filter((v) => v.length > 0);
}

/**
 * Limpia múltiples resaltados para evitar anidamiento
 */
export function cleanDoubleHighlighting(
  html: string
): string {
  // Reemplaza </mark><mark> con espacio/nada para evitar marcas adyacentes
  let cleaned = html.replace(/<\/mark>\s*<mark>/g, '');

  // Elimina marcas anidadas
  cleaned = cleaned.replace(/<mark>([^<]*<mark>[^<]*<\/mark>[^<]*)<\/mark>/g, '<mark>$1</mark>');

  return cleaned;
}

/**
 * Extrae términos de búsqueda del sessionStorage
 */
export function getSearchTermsFromStorage(): string[] {
  if (typeof window === 'undefined') return [];

  const stored = sessionStorage.getItem('searchTerms');
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Guarda términos de búsqueda en sessionStorage
 */
export function setSearchTermsInStorage(terms: string[]): void {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem('searchTerms', JSON.stringify(terms));
  sessionStorage.setItem('searchTermsTimestamp', Date.now().toString());
}

/**
 * Limpia términos de búsqueda del storage
 */
export function clearSearchTermsFromStorage(): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('searchTerms');
  sessionStorage.removeItem('searchTermsTimestamp');
}

/**
 * Verifica si los términos guardados siguen siendo válidos
 * (no han pasado demasiado tiempo)
 */
export function isSearchTermsStillValid(maxAgeMs: number = 30 * 60 * 1000): boolean {
  if (typeof window === 'undefined') return false;

  const timestamp = sessionStorage.getItem('searchTermsTimestamp');
  if (!timestamp) return false;

  const age = Date.now() - parseInt(timestamp, 10);
  return age < maxAgeMs;
}
