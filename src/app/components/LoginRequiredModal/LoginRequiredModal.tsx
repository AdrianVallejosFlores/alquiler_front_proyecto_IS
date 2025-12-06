'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal container and ensure focus trap
      modalRef.current.setAttribute('tabindex', '-1');
      modalRef.current.focus();

      // Focus the login button after rendering
      setTimeout(() => {
        const loginBtn = modalRef.current?.querySelector('button[data-action="login"]') as HTMLButtonElement;
        if (loginBtn) {
          loginBtn.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  const handleLoginClick = () => {
    router.push('/login');
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-black/20 z-40"
        onClick={handleClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2
              id="login-modal-title"
              className="text-xl font-bold text-[#11255a]"
            >
              Acceso Requerido
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-700 text-center mb-6">
              Para continuar con esta acción, necesitas iniciar sesión en tu cuenta.
            </p>

            <p className="text-sm text-gray-600 text-center mb-6">
              {/* Espacio reservado para texto auxiliar si se requiere en el futuro */}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-[#52abff]"
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <button
              onClick={handleLoginClick}
              data-action="login"
              className="flex-1 px-4 py-2 bg-[#52abff] text-white rounded-lg hover:bg-[#3a96e6] transition focus:outline-none focus:ring-2 focus:ring-[#52abff] focus:ring-offset-2"
              aria-label="Iniciar sesión"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRequiredModal;