"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "./hooks/useWallet";

import WalletAlert from "./components/walletAlert";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";
import ReceivePayment from "./components/ReceivePayments/ReceivePayments";
import WalletRestrictionModal from "./components/WalletRestrictionModal";

import { ChevronLeft, BarChart3, Wallet, Settings } from "lucide-react";

//  IMPORTACIÓN DEL CAPTCHA
import Recaptcha from "../captcha/components/Recaptcha";
import { validarCaptcha } from "../captcha/service/captcha.service";

function WalletLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fixerId = searchParams.get("fixer_id");

  const { balanceData, transactions, loading, error, reload } = useWallet(fixerId);
  const [showSaldo, setShowSaldo] = useState(true);

  const [showReceive, setShowReceive] = useState(false); 
  const [showRestriction, setShowRestriction] = useState(false);

  //  ESTADOS DEL CAPTCHA
  const [captchaValido, setCaptchaValido] = useState(false);
  const [captchaCargando, setCaptchaCargando] = useState(false);

  //  FUNCIÓN DE VALIDACIÓN DEL CAPTCHA
  const onCaptchaVerify = async (token: string | null) => {
    if (!token) return setCaptchaValido(false);

    setCaptchaCargando(true);
    const result = await validarCaptcha(token);
    setCaptchaValido(result.success);
    setCaptchaCargando(false);
  };

  //  NAVEGAR A RECARGA
  const handleRecargar = () => {
    if (fixerId) router.push(`/bitcrew/pagosQR?fixer_id=${fixerId}`);
  };

  const handleGrafico = () => router.push("/bitcrew/grafico");
  const handleAjustes = () => setShowRestriction(true);


  // SI showReceive ES TRUE, SE MUESTRA SOLO LA PANTALLA DE COBRO
  if (showReceive && fixerId) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <ReceivePayment 
          userId={fixerId} 
          onBack={() => setShowReceive(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full min-h-[calc(100vh-64px)] overflow-hidden relative">

      {/* MODAL DE RESTRICCIÓN */}
      <WalletRestrictionModal
        isOpen={showRestriction}
        onClose={() => setShowRestriction(false)}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-8 h-full">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 p-2">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#11255A]">Mi Billetera</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">

            {/* BOTÓN COBRAR QR */}
            <button
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
              onClick={() => setShowReceive(true)}
              disabled={loading || !fixerId}
            >
              <span>Cobrar QR</span>
            </button>

            {/* BOTONES DESKTOP */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={handleGrafico}
                className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40]"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Gráfico de Ingresos</span>
              </button>

              {/* BOTÓN RECARGAR CON CAPTCHA */}
              <button
                onClick={handleRecargar}
                disabled={loading || !fixerId || !captchaValido}
                className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] disabled:opacity-50"
              >
                <Wallet className="w-5 h-5" />
                <span>Recargar Saldo</span>
              </button>

              <button onClick={handleAjustes} className="p-2 text-gray-500 hover:text-[#11255A]">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* SECCIÓN CAPTCHA */}
        <div className="mt-4 mb-6">
          <Recaptcha onVerify={onCaptchaVerify} />
          {captchaCargando && <p className="text-sm text-gray-500">Validando...</p>}
        </div>

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

              {/* BOTONES MOBILE */}
              <div className="flex flex-col gap-3 mt-4 mb-6 md:hidden">
                <button
                  onClick={handleRecargar}
                  disabled={loading || !fixerId || !captchaValido}
                  className="w-full flex items-center justify-center space-x-2 bg-[#11255A] text-white px-4 py-3 rounded-xl shadow-sm hover:bg-[#0B1A40] disabled:opacity-50"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Recargar Saldo</span>
                </button>
              </div>

              <div className="mt-8 pb-10">
                <TransactionList transactions={transactions} />
              </div>
            </>
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
