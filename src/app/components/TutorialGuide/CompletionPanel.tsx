'use client';

import React from 'react';

interface CompletionPanelProps {
  onRestart: () => void;
  onClose: () => void;
}

const CompletionPanel: React.FC<CompletionPanelProps> = ({ onRestart, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-linear-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Tutorial Completado!</h2>
          <p className="text-green-100">Ya conoces las funciones principales de SERVINEO</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 text-lg">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800">Como Cliente</h4>
                <p className="text-sm text-gray-600">Buscar servicios, contratar Fixers verificados, calificar trabajos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800">Como Fixer</h4>
                <p className="text-sm text-gray-600">Ofrecer servicios, recibir solicitudes, construir reputación</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRestart}
              className="w-full bg-linear-to-r from-[#52abff] to-[#11255a] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#3a9cff] hover:to-[#0e1f4d] transition-all duration-200 transform hover:scale-105"
            >
              🔄 Ver de Nuevo
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Volver al Inicio
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl text-center">
          <p className="text-xs text-gray-500">
            ¿Necesitas ayuda? Contacta a soporte: <br />
            <a href="tel:+59173782241" className="text-blue-600 hover:underline">+591 73782241</a> • 
            <a href="mailto:servineobol@gmail.com" className="text-blue-600 hover:underline ml-1">servineobol@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionPanel;