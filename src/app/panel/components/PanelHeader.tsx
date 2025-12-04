'use client';

import { Search, X, Menu } from 'lucide-react'; // Importamos Menu
import Link from 'next/link';

interface PanelHeaderProps {
  query: string;
  setQuery: (q: string) => void;
  onMenuClick: () => void; // Nueva prop para abrir el menú
}

export default function PanelHeader({ query, setQuery, onMenuClick }: PanelHeaderProps) {
  return (
    <header className="bg-white border-b border-[#b9ddff] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Lado Izquierdo: Menú Móvil + Buscador */}
        <div className="flex items-center gap-4 flex-1">
          
          {/* Botón Menú (Solo Móvil) */}
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-[#1140bc] hover:bg-[#eef7ff] rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Buscador */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en toda la guía..." // Texto actualizado
              className="w-full pl-10 pr-4 py-2.5 bg-[#eef7ff] border border-transparent rounded-lg text-sm text-[#1140bc] placeholder-gray-500 focus:bg-white focus:border-[#0c4fe9] focus:ring-4 focus:ring-[#d8ecff] outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lado Derecho: Link de retorno (Oculto en móvil muy pequeño si quieres, o déjalo) */}
        <div className="hidden sm:flex gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-[#1366fd] hover:text-[#0c4fe9] transition-colors flex items-center gap-1"
          >
            Volver a inicio
          </Link>
        </div>
      </div>
    </header>
  );
}