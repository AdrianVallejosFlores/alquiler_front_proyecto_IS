'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, HelpCircle, Phone, Home, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { getToken, getStoredUser } from '@/lib/auth/session';
import { PageData, AccordionItem } from './panelData';

// Tipo extendido para resultados de búsqueda global
export type SearchResultItem = {
    accordion: AccordionItem;
    categoryTitle: string;
    pageTitle: string;
    contextId: string; // Para usar como Key única
};

interface PanelContentProps {
  currentPage: PageData | null;
  query: string;
  searchResults: SearchResultItem[]; // Nueva prop
}

export default function PanelContent({ currentPage, query, searchResults }: PanelContentProps) {
  const [openMainAccordion, setOpenMainAccordion] = useState<string | null>(null);
  const [becomeFixerHref, setBecomeFixerHref] = useState<string>('/convertirse-fixer');

  // Reset al cambiar de página
  useEffect(() => {
    setOpenMainAccordion(null);
  }, [currentPage?.id]);

  // Si hay búsqueda, abrimos el primer resultado automáticamente
  useEffect(() => {
    if (query && searchResults.length > 0) {
        setOpenMainAccordion(searchResults[0].contextId);
    } else if (!query) {
        setOpenMainAccordion(null);
    }
  }, [query, searchResults]); // Se ejecuta cuando cambian los resultados

  // Calcular el destino del botón "Registrarme como Fixer" igual que en el Header
  useEffect(() => {
    try {
      const isLoggedIn = Boolean(getToken());
      const fixerId = getStoredUser()?.fixerId ?? null;
      const href = isLoggedIn ? (fixerId ? `/fixers/${fixerId}` : '/convertirse-fixer') : '/login?next=/convertirse-fixer';
      setBecomeFixerHref(href);
    } catch {
      setBecomeFixerHref('/convertirse-fixer');
    }
  }, []);

  // --- RENDERIZADO DE ITEM (Reutilizable) ---
  const renderAccordionItem = (item: AccordionItem, contextKey: string, breadcrumb?: string) => {
     const isOpen = openMainAccordion === contextKey;

     return (
        <motion.div
            key={contextKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl overflow-hidden transition-all duration-300 mb-4
            ${
                isOpen
                ? 'shadow-md border border-[#b9ddff] ring-1 ring-[#eef7ff]'
                : 'shadow-sm border border-gray-200 hover:border-[#b9ddff]'
            }
            `}
        >
            {/* Botón para abrir/cerrar */}
            <button
            onClick={() => setOpenMainAccordion(isOpen ? null : contextKey)}
            className="w-full text-left bg-white p-5"
            >
            {/* Breadcrumb (Solo visible en búsqueda global) */}
            {breadcrumb && (
                <div className="text-xs font-bold text-[#1140bc] uppercase tracking-wider mb-1 flex items-center gap-1 opacity-70">
                    <SearchIcon className="w-3 h-3"/>
                    {breadcrumb}
                </div>
            )}
            
            <div className="flex items-center justify-between">
                <span
                    className={`text-lg font-medium transition-colors ${
                    isOpen ? 'text-[#0c4fe9]' : 'text-gray-700'
                    }`}
                >
                    {item.title}
                </span>
                <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-90 text-[#0c4fe9]' : ''
                    }`}
                />
            </div>
            </button>

            {/* Contenido desplegable */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
                >
                <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600 mb-5 leading-relaxed">{item.description}</p>

                    {item.bullets && item.bullets.length > 0 && (
                    <div className="bg-[#eef7ff] rounded-lg p-5 mb-6 border border-[#b9ddff]">
                        <div className="flex items-center gap-2 mb-3 text-[#1140bc] font-bold text-sm uppercase tracking-wide">
                        <HelpCircle className="w-4 h-4" />
                        <span>Información útil</span>
                        </div>
                        <ul className="space-y-2">
                        {item.bullets.map((bullet, idx) => (
                            <li
                            key={idx}
                            className="flex items-start gap-2 text-[#1140bc] text-sm"
                            >
                            <span className="mt-1.5 w-1.5 h-1.5 bg-[#1366fd] rounded-full shrink-0" />
                            <span>{bullet}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}

                    {item.actions && item.actions.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                        {item.actions.map((action, idx) => {
                        const baseHover = 'transition-colors transition-transform duration-200 transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#d8ecff]';
                        const btnClass =
                          action.type === 'primary'
                          ? `px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] ${baseHover}`
                          : `px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] ${baseHover}`;

                        if (action.onClick) {
                            return (
                            <button key={idx} onClick={action.onClick} className={btnClass}>
                                {action.label}
                            </button>
                            );
                        }
                        // Si el botón es "Registrarme como Fixer" o apunta a /registro-fixer, usar la misma lógica que el Header
                        const targetHref =
                          (action.href === '/registro-fixer' || (action.label || '').toLowerCase().includes('registrarme como fixer'))
                          ? becomeFixerHref
                          : (action.href || '#');

                        return (
                          <Link key={idx} href={targetHref} className={btnClass}>
                            {action.label}
                            </Link>
                        );
                        })}
                    </div>
                    )}
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
     );
  }

  // --- VISTA 1: MODO BÚSQUEDA GLOBAL ---
  if (query) {
      return (
        <main className="md:col-span-8 lg:col-span-9 min-h-[500px]">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Resultados para: <span className="text-[#0c4fe9]">&quot;{query}&quot;</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Se encontraron {searchResults.length} resultados en toda la guía.
                </p>
            </div>

            <div className="space-y-4">
                {searchResults.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
                        <div className="flex justify-center mb-4">
                            <SearchIcon className="w-12 h-12 text-gray-300"/>
                        </div>
                        <p className="text-lg font-medium">No encontramos coincidencias</p>
                        <p className="text-sm">Intenta buscar con otras palabras clave.</p>
                    </div>
                ) : (
                    searchResults.map((res) => (
                        renderAccordionItem(
                            res.accordion, 
                            res.contextId, 
                            `${res.categoryTitle} > ${res.pageTitle}` // Pasamos el breadcrumb
                        )
                    ))
                )}
            </div>
        </main>
      );
  }

  // --- VISTA 2: NAVEGACIÓN NORMAL (Sin búsqueda) ---
  if (!currentPage) {
    return (
      <main className="md:col-span-8 lg:col-span-9 min-h-[500px]">
        <div className="bg-white rounded-xl p-10 border border-[#b9ddff] shadow-sm text-center">
          <h2 className="text-xl font-bold text-gray-400">Seleccione una opción del menú</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="md:col-span-8 lg:col-span-9 min-h-[500px]">
      <div className="animate-fadeIn space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[#1140bc] mb-6 px-1"
        >
          {currentPage.title}
        </motion.h1>

        {/* Lista de Acordeones de la Página Actual */}
        <div className="space-y-4">
          {currentPage.accordions.map((item) => (
             renderAccordionItem(item, item.id) // Sin breadcrumb en vista normal
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 bg-[#eef7ff] rounded-xl p-8 border border-[#b9ddff]">
        <h4 className="font-bold text-[#1140bc] text-lg mb-2">¿No encuentras lo que buscas?</h4>
        <p className="text-[#1366fd] text-sm mb-6">
          Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta o problema.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="https://wa.me/59160379823"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] transition duration-200 transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#d8ecff] flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Contactar soporte
          </Link>

          <Link
            href="/"
            className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] transition duration-200 transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#d8ecff] flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}