'use client';

import { useState, useEffect, useMemo } from 'react';
import PanelHeader from './PanelHeader';
import PanelSidebar from './PanelSidebar';
import PanelContent, { SearchResultItem } from './PanelContent';
import { DATA_MANUAL, PageData, CategoryItem } from './panelData';

export default function PanelAyuda() {
  const [activeCategory, setActiveCategory] = useState<string>('inicio');
  const [activePageId, setActivePageId] = useState<string>('');
  const [expandedSidebarItems, setExpandedSidebarItems] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  
  // Nuevo Estado: Menú Móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Normalizador de texto (quita acentos y minúsculas)
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  // --- LÓGICA DE BÚSQUEDA GLOBAL (Memoizada para rendimiento) ---
  const globalSearchResults = useMemo(() => {
    if (!query) return [];
    
    const results: SearchResultItem[] = [];
    const q = normalize(query);

    // Recorremos Categorías
    Object.values(DATA_MANUAL).forEach((category) => {
        // Helper para buscar dentro de una Página
        const searchInPage = (page: PageData, catTitle: string) => {
            page.accordions.forEach((acc) => {
                const inTitle = normalize(acc.title).includes(q);
                const inDesc = normalize(acc.description).includes(q);
                const inBullets = acc.bullets?.some(b => normalize(b).includes(q));

                if (inTitle || inDesc || inBullets) {
                    results.push({
                        accordion: acc,
                        categoryTitle: catTitle,
                        pageTitle: page.title,
                        contextId: `${page.id}-${acc.id}` // ID único compuesto
                    });
                }
            });
        };

        // 1. Verificar si la categoría tiene página directa
        if (category.directPageData) {
            searchInPage(category.directPageData, category.title);
        }

        // 2. Verificar si tiene sub-items (hijos)
        if (category.items) {
            category.items.forEach((item) => {
                searchInPage(item.pageData, category.title);
            });
        }
    });

    return results;
  }, [query]);

  // Reset de página al cambiar categoría padre
  useEffect(() => {
    const category = DATA_MANUAL[activeCategory];
    if (category?.directPageData) {
      setActivePageId('');
    }
  }, [activeCategory]);

  const toggleSidebarFolder = (key: string) => {
    if (expandedSidebarItems.includes(key)) {
      setExpandedSidebarItems(expandedSidebarItems.filter((k) => k !== key));
    } else {
      setExpandedSidebarItems([...expandedSidebarItems, key]);
    }
  };

  const handleSidebarClick = (catKey: string, subItem?: CategoryItem) => {
    setActiveCategory(catKey);

    if (subItem) {
      setActivePageId(subItem.id);
      setQuery(''); // Limpiar búsqueda al navegar manualmente
      if (!expandedSidebarItems.includes(catKey)) {
        setExpandedSidebarItems((prev) => [...prev, catKey]);
      }
    } else {
      if (DATA_MANUAL[catKey].items) {
        toggleSidebarFolder(catKey);
      } else {
        setActivePageId('');
        setQuery(''); // Limpiar búsqueda al navegar manualmente
      }
    }
  };

  // Obtener datos de la página actual (solo se usa si NO hay búsqueda)
  const getCurrentPageData = (): PageData | null => {
    const category = DATA_MANUAL[activeCategory];
    if (!category) return null;

    if (category.directPageData) return category.directPageData;

    if (category.items && activePageId) {
      const item = category.items.find((i) => i.id === activePageId);
      return item ? item.pageData : null;
    }

    if (category.items && category.items.length > 0) {
      return category.items[0].pageData;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <PanelHeader 
        query={query} 
        setQuery={setQuery} 
        onMenuClick={() => setIsMobileMenuOpen(true)} // Abrir menú
      />

      <div className="max-w-[1400px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <PanelSidebar
          activeCategory={activeCategory}
          activePageId={activePageId}
          expandedSidebarItems={expandedSidebarItems}
          onSidebarClick={handleSidebarClick}
          isMobileMenuOpen={isMobileMenuOpen}     // Estado del menú
          closeMobileMenu={() => setIsMobileMenuOpen(false)} // Cerrar menú
        />

        <PanelContent 
            currentPage={getCurrentPageData()} 
            query={query}
            searchResults={globalSearchResults} // Pasamos los resultados globales
        />
        
      </div>
    </div>
  );
}