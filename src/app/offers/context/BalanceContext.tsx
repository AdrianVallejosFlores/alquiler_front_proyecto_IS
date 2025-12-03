'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUser, getToken } from '@/lib/auth/session'; // Ajusta la ruta si es necesario

// Definimos qué información compartiremos
type BalanceContextType = {
  hasBalance: boolean;
  isLoading: boolean;
};

const BalanceContext = createContext<BalanceContextType>({ hasBalance: false, isLoading: true });

export const useBalance = () => useContext(BalanceContext);

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasBalance, setHasBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // URL del Backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  //const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wallletback.vercel.app/api';
  useEffect(() => {
    const checkBalance = async () => {
      try {
        const user = getStoredUser();
        const token = getToken();

        if (!user || !user.fixerId || !token) {
          console.log('Usuario no autenticado o no es fixer');
          setHasBalance(false);
          setIsLoading(false);
          return;
        }

        // Consultamos el saldo usando el endpoint que ya funciona
        const response = await fetch(`${API_URL}/api/bitcrew/wallet/fixer/${user.fixerId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${token}` // Descomenta si tu backend pide token
            }
        });

        const data = await response.json();

        if (response.ok && data.success && data.billetera) {
          // VALIDACIÓN: Consideramos que tiene saldo si es mayor a 0 (o el monto mínimo que tú decidas)
          // Puedes cambiar 0 por 10 o 50 si quieres un mínimo para ver ofertas.
          const saldoSuficiente = data.billetera.saldo > 0; 
          setHasBalance(saldoSuficiente);
          console.log(`[BalanceCheck] Saldo: ${data.billetera.saldo}. Acceso: ${saldoSuficiente ? 'Permitido' : 'Restringido'}`);
        } else {
          setHasBalance(false);
        }
      } catch (error) {
        console.error('Error verificando saldo:', error);
        setHasBalance(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBalance();
  }, [API_URL]);

  return (
    <BalanceContext.Provider value={{ hasBalance, isLoading }}>
      {children}
    </BalanceContext.Provider>
  );
};