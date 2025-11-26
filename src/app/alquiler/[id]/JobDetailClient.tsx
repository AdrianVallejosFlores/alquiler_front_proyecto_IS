'use client';

import React, { useEffect, useState } from 'react';
import JobDetailContent from './components/JobDetailContent';
import { Usuario } from './types/usuario.types';
import {
  getSearchTermsFromStorage,
  isSearchTermsStillValid,
} from '../../../lib/searchHighlight.utils';

interface JobDetailClientProps {
  usuario: Usuario;
  postedDate: string;
  SERVER_ORIGIN: string;
  promedio?: number;
}

export default function JobDetailClient({
  usuario,
  postedDate,
  SERVER_ORIGIN,
  promedio,
}: JobDetailClientProps) {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  useEffect(() => {
    // Recuperar términos de búsqueda del storage
    const terms = getSearchTermsFromStorage();
    if (terms.length > 0 && isSearchTermsStillValid()) {
      setSearchTerms(terms);
    }
  }, []);

  return (
    <JobDetailContent
      usuario={usuario}
      postedDate={postedDate}
      SERVER_ORIGIN={SERVER_ORIGIN}
      promedio={promedio}
      searchTerms={searchTerms}
    />
  );
}
