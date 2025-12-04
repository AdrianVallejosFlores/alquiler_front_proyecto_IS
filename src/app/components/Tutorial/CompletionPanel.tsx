'use client';

import React from 'react';

interface CompletionPanelProps {
  onRestart: () => void;
  onClose: () => void;
}

const CompletionPanel: React.FC<CompletionPanelProps> = ({ onRestart, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 overflow-hidden">
        {/* Header con gradiente SERVINEO */}
        <div className="bg-linear-to-r from-[#11255a] to-[#52abff] p-8 rounded-t-3xl text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">¡Tutorial Completado!</h2>
          <p className="text-blue-100 text-lg">Ya conoces las funciones principales de SERVINEO</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-5 mb-8">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">Como Cliente</h4>
                <p className="text-sm text-gray-600 mt-1">Buscar servicios, contratar Fixers verificados, calificar trabajos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">Como Fixer</h4>
                <p className="text-sm text-gray-600 mt-1">Ofrecer servicios, recibir solicitudes, construir reputación</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={onRestart}
              className="w-full bg-linear-to-r from-[#52abff] to-[#11255a] text-white py-4 px-6 rounded-2xl font-semibold hover:from-[#3a9cff] hover:to-[#0e1f4d] transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              🔄 Ver de Nuevo
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-200 text-gray-600 py-4 px-6 rounded-2xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-lg"
            >
              Volver al Inicio
            </button>
          </div>
        </div>

        {/* Footer mejorado */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-3xl text-center border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">
            ¿Necesitas ayuda? Contacta a nuestro soporte
          </p>
          <div className="flex justify-center items-center gap-4 text-sm">
            <a href="tel:+59173782241" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
              📞 +591 73782241
            </a>
            <span className="text-gray-300">•</span>
            <a href="mailto:servineobol@gmail.com" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
              ✉️ servineobol@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionPanel;