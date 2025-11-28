'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BookOpen, Headphones, Phone, Bot } from 'lucide-react';

export default function HelpButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleWhatsApp = () => {
    window.open('https://wa.me/59160379823?text=Hola%20necesito%20ayuda', '_blank');
    setIsMenuOpen(false);
  };

  const handleFAQ = () => {
    window.location.href = '/preguntas-frecuentes';
    setIsMenuOpen(false);
  };

  const handleHelpCenter = () => {
    window.location.href = '/centro-de-ayuda';
    setIsMenuOpen(false);
  };

  const handleAIAssistant = () => {
    window.location.href = '/asistente-ia'; // Esta es la ruta que creamos antes
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="fixed z-[100] bottom-20 right-6 flex flex-col items-end gap-3" ref={menuRef}>
      {/* Menú desplegable - solo FAQ y Centro de Ayuda */}
      {isMenuOpen && (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden w-60 animate-in slide-in-from-bottom-5 fade-in duration-200 border border-gray-100">
          <div className="py-1">
            <button
              onClick={handleAIAssistant}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-purple-50 transition-all text-left group border-b border-gray-100"
            >
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-full group-hover:scale-105 transition-transform">
                <Bot className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Asistente IA</p>
                <p className="text-xs text-purple-600 font-medium">¡Nuevo! Descubre qué hace</p>
              </div>
            </button>

            <button
              onClick={handleFAQ}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-orange-50 transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-full group-hover:scale-105 transition-transform">
                <HelpCircle className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Preguntas Frecuentes</p>
                <p className="text-xs text-gray-500">Respuestas rápidas</p>
              </div>
            </button>

            <button
              onClick={handleHelpCenter}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-[#2a87ff] to-[#1366fd] p-2 rounded-full group-hover:scale-105 transition-transform">
                <BookOpen className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Centro de Ayuda</p>
                <p className="text-xs text-gray-500">Guías y tutoriales</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Botón acerca del asistente */}
      <button
        onClick={handleAIAssistant}
        // Quitamos el p-1 para que el círculo dicte el tamaño exacto
        className="group flex items-center rounded-full transition-all duration-300 ease-in-out hover:bg-purple-50 hover:pr-4 border-b border-transparent hover:border-gray-100"
      >
        {/* 1. EL ICONO (Ahora w-14 h-14 para ser idéntico a los otros) */}
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg z-10 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {/* Aumentamos el tamaño del icono a 24 y el grosor a 2 para igualar a los demás */}
          <Bot className="text-white" size={24} strokeWidth={2} />
        </div>

        {/* 2. EL TEXTO (Se mantiene la animación de expansión) */}
        <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:pl-3 overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap text-left">
          <p className="font-semibold text-gray-800 text-sm">Asistente IA</p>
          <p className="text-xs text-purple-600 font-medium">¡Nuevo! Descubre qué hace</p>
        </div>
      </button>

      {/* Botón de soporte - azul de la app */}
      <button 
        onClick={toggleMenu}
        aria-label="Soporte"
        className="w-14 h-14 bg-gradient-to-br from-[#2a87ff] to-[#1366fd] hover:from-[#1366fd] hover:to-[#0d4db8] text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Headphones size={24} strokeWidth={2} />
      </button>

      {/* Botón de WhatsApp */}
      <button 
        onClick={handleWhatsApp}
        aria-label="WhatsApp"
        className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0F7A6C] text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Phone size={24} strokeWidth={2} fill="currentColor" />
      </button>
    </div>
  );
}
