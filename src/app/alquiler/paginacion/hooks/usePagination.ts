'use client';

import { useState } from "react";

export function usePagination(initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  return {
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage
  };
}