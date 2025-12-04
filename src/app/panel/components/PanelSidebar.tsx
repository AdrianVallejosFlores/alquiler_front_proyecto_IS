'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { DATA_MANUAL, CategoryItem } from './panelData';

interface PanelSidebarProps {
  activeCategory: string;
  activePageId: string;
  expandedSidebarItems: string[];
  onSidebarClick: (catKey: string, subItem?: CategoryItem) => void;
  isMobileMenuOpen: boolean; // Nuevo
  closeMobileMenu: () => void; // Nuevo
}

export default function PanelSidebar({
  activeCategory,
  activePageId,
  expandedSidebarItems,
  onSidebarClick,
  isMobileMenuOpen,
  closeMobileMenu
}: PanelSidebarProps) {

  // Esta función genera el contenido del menú (para reutilizarlo en móvil y desktop)
  const renderNavContent = () => (
    <div className="space-y-1">
       {Object.entries(DATA_MANUAL).map(([key, category]) => {
          const isActiveCategory = activeCategory === key;
          const isExpanded = expandedSidebarItems.includes(key);
          const hasSubItems = category.items && category.items.length > 0;

          const categoryButtonClass = `w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-200 
                ${
                  isActiveCategory && !hasSubItems
                    ? 'bg-[#eef7ff] text-[#0c4fe9] font-bold border-l-4 border-[#0c4fe9]'
                    : 'text-gray-600 hover:bg-[#eef7ff] hover:text-[#0c4fe9] border-l-4 border-transparent'
                }
                ${isActiveCategory && hasSubItems ? 'bg-gray-50 text-[#1140bc] font-medium' : ''}
            `;

          return (
            <div key={key} className="mb-1">
              <button 
                onClick={() => {
                   onSidebarClick(key);
                   // Si es categoría directa (sin hijos), cerramos menú móvil al hacer click
                   if(!hasSubItems) closeMobileMenu();
                }} 
                className={categoryButtonClass}
              >
                <div className="flex items-center gap-3">
                  <span className={isActiveCategory ? 'text-[#0c4fe9]' : 'text-gray-400'}>
                    {category.icon}
                  </span>
                  <span>{category.title}</span>
                </div>
                {hasSubItems && (
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </button>

              {hasSubItems && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="ml-4 pl-4 border-l border-[#b9ddff] mt-1 space-y-1 overflow-hidden"
                >
                  {category.items?.map((item) => {
                    const isSubActive =
                      activeCategory === key &&
                      (activePageId === item.id ||
                        (!activePageId && category.items![0].id === item.id));

                    return (
                      <button
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSidebarClick(key, item);
                          closeMobileMenu(); // Cerrar menú móvil al seleccionar sub-item
                        }}
                        className={`block w-full text-left text-sm py-2 transition-all rounded-md px-2
                                    ${
                                      isSubActive
                                        ? 'bg-black text-white font-bold shadow-md'
                                        : 'text-gray-500 hover:text-[#0c4fe9] hover:bg-[#eef7ff]'
                                    }
                                `}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
    </div>
  );

  return (
    <>
      {/* --- VERSIÓN DESKTOP (Normal) --- */}
      <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
        {renderNavContent()}
      </aside>

      {/* --- VERSIÓN MÓVIL (Drawer / Overlay) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                {/* Fondo oscuro */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={closeMobileMenu}
                    className="fixed inset-0 bg-black z-40 md:hidden"
                />
                
                {/* Menú deslizante */}
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 shadow-2xl p-4 overflow-y-auto md:hidden"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <span className="font-bold text-[#1140bc] text-lg">Menú de Ayuda</span>
                        <button onClick={closeMobileMenu} className="p-1 text-gray-500 hover:text-red-500">
                            <X className="w-6 h-6"/>
                        </button>
                    </div>
                    {renderNavContent()}
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d8ecff;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}