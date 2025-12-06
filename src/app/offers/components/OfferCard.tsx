'use client';

import React from 'react';
import type { Offer } from '../services/offersService';
import { useBalance } from '../context/BalanceContext'; // Importamos el hook
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth/session';

type Props = {
  offer: Offer;
  onOpen: (offer: Offer) => void;
  onOpenPromotions: (offer: Offer) => void;
};

const clamp = (text: string | undefined | null, max = 100) => {
  const t = (text ?? '').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
};

export default function OfferCard({ offer, onOpen, onOpenPromotions }: Props) {
  const isInactive = offer.status === 'inactive';
  
  // 1. Usamos el contexto para saber si tiene saldo
  const { hasBalance, isLoading } = useBalance();
  const router = useRouter();

  // Función para redirigir a recargar si no hay saldo
  const handleNoBalanceClick = () => {
    const user = getStoredUser();
    if (user?.fixerId) {
       // Redirige a tu vista de billetera/recarga
       router.push(`/bitcrew/wallet?fixer_id=${user.fixerId}`);
    } else {
       console.error("No fixer ID found");
    }
  };

  // Helper para ocultar datos sensibles
  const renderSensitiveInfo = (label: string, value: string | undefined) => {
    if (!value) return null;
    return (
      <span>
        <strong style={{ color: '#1366fd' }}>{label}: </strong>
        {isLoading ? '...' : hasBalance ? value : '🔒 Recarga para ver'}
      </span>
    );
  };

  return (
    <div
      role="article"
      aria-label={offer.title}
      className="offer-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 12,
        border: '1px solid #F0F2F5',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        opacity: isInactive ? 0.7 : 1,
        position: 'relative'
      }}
    >
      <div style={{ display: 'grid', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden="true" style={{ fontSize: 18 }}>🛠️</span>
          <h3
            title={offer.title}
            style={{
              margin: 0,
              color: '#11255a',
              fontWeight: 600,
              fontSize: 16,
              fontFamily: 'Poppins, system-ui, sans-serif',
            }}
          >
            {offer.title}
          </h3>
          {isInactive && (
            <span style={{ marginLeft: 8, fontSize: 12, padding: '2px 8px', borderRadius: 999, background: '#DBDEE5', color: '#616E8A' }}>
              Inactiva
            </span>
          )}
        </div>

        <p style={{ margin: 0, color: '#2a87ff', fontSize: 14, lineHeight: 1.35, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {clamp(offer.description, 100)}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', color: '#616E8A' }}>
          
          <span>
            <strong style={{ color: '#1366fd' }}>Categoría: </strong>
            {offer.category}
          </span>
          
          {/* INFORMACIÓN PROTEGIDA POR SALDO */}
          {renderSensitiveInfo('WhatsApp', offer.contact?.whatsapp)}
          {renderSensitiveInfo('Teléfono', offer.contact?.phone)}
          {renderSensitiveInfo('Email', offer.contact?.email)}
        </div>
      </div>
           <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
           <button
           type="button"
          onClick={() => onOpenPromotions(offer)}
    className="btn-outline"
    style={{
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px solid #DBDEE5',
      background: '#F0F2F5',
      color: '#0c4fe9',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}
    aria-label={`Ver promociones de ${offer.title}`}
  >
    Ver Promociones
  </button>

  <button
    type="button"
    onClick={() => onOpen(offer)}
    className="btn-outline"
    style={{
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px solid #DBDEE5',
      background: '#F0F2F5',
      color: '#0c4fe9',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}
    aria-label={`Ver oferta ${offer.title}`}
  >
    Ver oferta
  </button>

 </div>
    </div>
  );
}