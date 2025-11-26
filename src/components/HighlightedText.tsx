/**
 * HighlightedText.tsx
 * 
 * Componente React para renderizar texto con términos resaltados
 * Maneja:
 * - Múltiples términos
 * - Evita resaltado doble
 * - Soporta saltos de línea
 * - Case-insensitive y sin acentos
 */

'use client';

import React, { useMemo } from 'react';
import {
  highlightMatches,
  splitSearchTerms,
  getTermVariations,
} from '../lib/searchHighlight.utils';

interface HighlightedTextProps {
  text: string | undefined | null;
  searchTerms: string[];
  className?: string;
  highlightClassName?: string;
  preserveLineBreaks?: boolean;
}

/**
 * Componente para renderizar texto con resaltado
 */
export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerms,
  className = '',
  highlightClassName = 'bg-yellow-200 font-semibold',
  preserveLineBreaks = true,
}) => {
  if (!text) return null;

  const parts = useMemo(() => {
    if (!searchTerms.length) {
      return [{ text, highlighted: false }];
    }

    // Expandir términos para incluir variaciones
    const allTerms = new Set<string>();
    searchTerms.forEach((term: string) => {
      if (term.trim()) {
        getTermVariations(term).forEach((v: string) => allTerms.add(v));
      }
    });

    return highlightMatches(text, Array.from(allTerms));
  }, [text, searchTerms]);

  if (preserveLineBreaks) {
    return (
      <span className={className}>
        {parts.map((part: any, index: number) => (
          part.highlighted ? (
            <mark
              key={index}
              className={highlightClassName}
              style={{ backgroundColor: '#fbbf24', textDecoration: 'none' }}
            >
              {part.text}
            </mark>
          ) : (
            <span key={index} className="break-words">
              {part.text.split('\n').map((line: string, lineIndex: number) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < part.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          )
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      {parts.map((part: any, index: number) =>
        part.highlighted ? (
          <mark
            key={index}
            className={highlightClassName}
            style={{ backgroundColor: '#fbbf24', textDecoration: 'none' }}
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  );
};

export default HighlightedText;
