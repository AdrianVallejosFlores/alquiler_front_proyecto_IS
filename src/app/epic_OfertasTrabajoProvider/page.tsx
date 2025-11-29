// page.tsx (dentro de epic_Ofertas_De_Trabajo o epic_OfertasTrabajoProvider)
'use client';

import dynamic from 'next/dynamic';

const OfertasTrabajoProvider = dynamic(
  () => import('./components/Ofertatrabajo'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    )
  }
);

export default function OfertasDeTrabajoPage() {
  return <OfertasTrabajoProvider />;
}