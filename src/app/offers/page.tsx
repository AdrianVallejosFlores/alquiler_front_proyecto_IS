'use client';

import React from 'react';
import OffersList from './components/OffersList';
import RestrictedModal from './components/RestrictedModal';
import { BalanceProvider, useBalance } from './context/BalanceContext';

const OffersContent = () => {
  const { hasBalance, isLoading } = useBalance();

  return (
    // 'relative' es necesario para que el modal sepa dónde posicionarse
    <div className="relative w-full min-h-screen"> 
      
      {/* Modal: Se mostrará "encima" pero desplazado hacia abajo gracias al 'top-44' del archivo anterior */}
      {!isLoading && !hasBalance && (
        <RestrictedModal />
      )}

      {/* Lista de Ofertas */}
      <div className={!isLoading && !hasBalance ? '' : ''}>
        <OffersList />
      </div>

    </div>
  );
};

export default function OffersPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100dvh', padding: '24px 20px' }}>
      <BalanceProvider>
        <OffersContent />
      </BalanceProvider>
    </main>
  );
}