"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "./hooks/useWallet";
import WalletAlert from "./components/walletAlert";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";

function WalletLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // LEEMOS EL FIXER ID
  const fixerId = searchParams.get("fixer_id");

  const { balanceData, transactions, loading, error, reload } = useWallet(fixerId);
  const [showSaldo, setShowSaldo] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-8">
        
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 p-2" title="Volver">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#11255A]">Mi Billetera</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors disabled:opacity-50"
              onClick={() => fixerId && router.push(`/bitcrew/pagosQR?fixer_id=${fixerId}`)}
              disabled={loading || !fixerId}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504-1.125-1.125-1.125H6.375c-.621 0-1.125-.504-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h9.375m-1.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <span>Recargar Saldo</span>
            </button>
          </div>
        </header>

        <main>
          {error && <div className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</div>}
          
          {loading && !balanceData && <p className="text-center py-10">Cargando...</p>}

          {!loading && balanceData && (
            <>
              <WalletAlert balance={balanceData.saldo} estado={balanceData.estado} />
              <BalanceCard
                saldo={balanceData.saldo}
                moneda={balanceData.moneda || "Bs"}
                showSaldo={showSaldo}
                onToggleShowSaldo={() => setShowSaldo(!showSaldo)}
                onRefresh={reload}
                loading={loading}
                walletId={balanceData._id}
              />
              <div className="mt-8">
                <TransactionList transactions={transactions} />
              </div>
            </>
          )}

          {!fixerId && !loading && (
             <p className="text-center text-gray-500 mt-10">No se detectó un ID de Fixer.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <WalletLogic />
    </Suspense>
  );
}