'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth/session';

export default function RestrictedModal() {
  const router = useRouter();

  const handleRecharge = () => {
    const user = getStoredUser();
    if (user?.fixerId) {
      router.push(`/bitcrew/wallet?fixer_id=${user.fixerId}`);
    }
  };

  return (
    // CAMBIOS AQUÍ:
    // 1. 'absolute': Para que se quede dentro del contenedor de ofertas.
    // 2. 'top-40' (aprox 160px) o 'top-48': Esto empuja la cortina hacia abajo para NO tapar el buscador/botones.
    // 3. 'h-[calc(100%-160px)]': Ajusta la altura para que no se salga por abajo.
    <div className="absolute top-44 left-0 w-full h-[calc(100%-176px)] z-10 flex items-start justify-center bg-white/80 backdrop-blur-sm pt-10 rounded-b-xl">
      
      {/* Tarjeta del Modal */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300 mx-4">
        
        <div className="mx-auto flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[#11255A] text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#11255A] mb-3">
          Acceso Restringido
        </h2>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Para ver los detalles de las ofertas y postularte, necesitas tener saldo positivo en tu billetera.
        </p>

        <button 
          onClick={handleRecharge}
          className="px-6 py-2 bg-[#11255A] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors text-sm shadow-md"
        >
          Recargar Saldo Ahora
        </button>
      </div>
    </div>
  );
}