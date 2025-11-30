'use client';

import Link from 'next/link';
import { useClientSession } from '@/lib/auth/useSession';
// 1. Importamos el hook del contexto
import { useBalance } from '../context/BalanceContext';

type OffersToolbarProps = {
  filter: 'all' | 'mine';
  onChangeFilter: (value: 'all' | 'mine') => void;
};

export default function OffersToolbar({ filter, onChangeFilter }: OffersToolbarProps) {
  const { user } = useClientSession();
  const isFixer = Boolean(user?.fixerId);
  
  // 2. Obtenemos el estado del saldo
  const { hasBalance, isLoading } = useBalance();

  // 3. Calculamos si debemos bloquear las acciones
  // (Bloqueamos si ya cargó y NO tiene saldo)
  const isBlocked = !isLoading && !hasBalance;

  // 4. Definimos el estilo de "deshabilitado" para reutilizarlo
  const disabledStyle = {
    pointerEvents: 'none' as const, // Evita clics
    opacity: 0.5,                   // Se ve gris/apagado
    cursor: 'not-allowed',          // Muestra icono de prohibido (aunque pointer-events lo anula visualmente, es buena práctica)
    userSelect: 'none' as const     // Evita selección de texto
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, color: '#616E8A', fontWeight: 500 }}>
        
        {/* Enlace: Encontrar Fixers */}
        <Link 
          href="/fixers" 
          style={{ 
            textDecoration: 'none', 
            color: '#616E8A',
            // Aplicamos estilo condicional
            ...(isBlocked ? disabledStyle : {}) 
          }}
          aria-disabled={isBlocked}
        >
          Encontrar Fixers
        </Link>

        {/* Enlace: Ver fixers por trabajo */}
        <Link 
          href="/fixers" 
          style={{ 
            textDecoration: 'none', 
            color: '#616E8A',
            ...(isBlocked ? disabledStyle : {}) 
          }}
          aria-disabled={isBlocked}
        >
          Ver fixers por trabajo
        </Link>

        {/* Botón: Mis ofertas */}
        {isFixer && (
          <button
            type="button"
            onClick={() => onChangeFilter(filter === 'mine' ? 'all' : 'mine')}
            disabled={isBlocked} // Propiedad nativa disabled
            style={{
              border: 'none',
              background: 'transparent',
              color: filter === 'mine' ? '#0c4fe9' : '#616E8A',
              fontWeight: filter === 'mine' ? 600 : 500,
              cursor: isBlocked ? 'not-allowed' : 'pointer', // Cursor manual
              padding: 0,
              opacity: isBlocked ? 0.5 : 1, // Opacidad manual
            }}
          >
            {filter === 'mine' ? 'Ver todas' : 'Mis ofertas'}
          </button>
        )}

        {/* Enlace: Ayuda */}
        <a 
          href="#" 
          style={{ 
            textDecoration: 'none', 
            color: '#616E8A',
            ...(isBlocked ? disabledStyle : {})
          }}
          aria-disabled={isBlocked}
        >
          Ayuda
        </a>
      </nav>

      {/* Botón Principal: Add new offer */}
      {isFixer && (
        <Link
          href="/addNewJobOffer"
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: isBlocked ? '1px solid #ccc' : '1px solid #2563eb', // Borde gris si bloqueado
            color: isBlocked ? '#999' : '#2563eb', // Texto gris si bloqueado
            fontWeight: 600,
            textDecoration: 'none',
            background: isBlocked ? '#f5f5f5' : '#ffffff', // Fondo grisáceo si bloqueado
            ...(isBlocked ? disabledStyle : {})
          }}
          aria-disabled={isBlocked}
        >
          Add new offer
        </Link>
      )}
    </div>
  );
}