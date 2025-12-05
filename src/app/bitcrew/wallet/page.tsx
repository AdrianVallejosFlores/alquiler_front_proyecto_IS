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

import Recaptcha from "../captcha/components/Recaptcha";
import { validarCaptcha } from "../captcha/service/captcha.service";

function WalletLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fixerId = searchParams.get("fixer_id");

  const { balanceData, transactions, loading, error, reload } = useWallet(
    fixerId
  );
  const [showSaldo, setShowSaldo] = useState(true);

  const [showReceive, setShowReceive] = useState(false);
  const [showRestriction, setShowRestriction] = useState(false);

  const [showCaptchaBox, setShowCaptchaBox] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const [captchaCargando, setCaptchaCargando] = useState(false);

  if (showReceive && fixerId) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <ReceivePayment userId={fixerId} onBack={() => setShowReceive(false)} />
      </div>
    );
  }

  const onCaptchaVerify = async (token: string | null) => {
    if (!token) {
      setCaptchaValido(false);
      return;
    }

    setCaptchaValido(true);

    try {
      setCaptchaCargando(true);
      const result = await validarCaptcha(token);
      console.log("[Wallet] validarCaptcha:", result);
    } catch (err) {
      console.error("[Wallet] Error validarCaptcha:", err);
    } finally {
      setCaptchaCargando(false);
    }
  };

  const handleRecargar = () => {
    if (!fixerId) return;

    if (!showCaptchaBox) {
      setShowCaptchaBox(true);
      setCaptchaValido(false);
      return;
    }

    if (!captchaValido) return;

    router.push(`/bitcrew/pagosQR?fixer_id=${fixerId}`);
  };

  const handleGrafico = () => {
    if (fixerId) {
      router.push(`/bitcrew/grafico?fixer_id=${fixerId}`);
    }
  };

  const handleAjustes = () => {
    setShowRestriction(true);
  };

  const handleCancelarCaptcha = () => {
    setShowCaptchaBox(false);
    setCaptchaValido(false);
  };

  return (
    <div className="bg-gray-50 w-full min-h-[calc(100vh-64px)] overflow-hidden relative">
      <WalletRestrictionModal
        isOpen={showRestriction}
        onClose={() => setShowRestriction(false)}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-8 h-full">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-800 p-2"
              title="Volver"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#11255A]">
                Mi Billetera
              </h1>
              <p className="text-xs text-gray-500 md:hidden">
                Billetera de: usuario
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
              onClick={() => setShowReceive(true)}
              disabled={loading || !fixerId}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                />
              </svg>
              <span>Cobrar QR</span>
            </button>

            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={handleGrafico}
                className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Gráfico de Ingresos</span>
              </button>

              <button
                onClick={handleRecargar}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-colors ${
                  loading || !fixerId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#11255A] text-white hover:bg-[#0B1A40]"
                }`}
                disabled={loading || !fixerId}
              >
                <Wallet className="w-5 h-5" />
                <span>Recargar Saldo</span>
              </button>

              <button
                onClick={handleAjustes}
                className="p-2 text-gray-500 hover:text-[#11255A] transition rounded-full hover:bg-gray-100"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={handleAjustes}
                className="p-2 text-gray-500 hover:text-[#11255A]"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {showCaptchaBox && (
          <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Antes de recargar tu saldo, completa el captcha:
            </p>
            <Recaptcha onVerify={onCaptchaVerify} />
            {captchaCargando && (
              <p className="text-sm text-gray-500 mt-2">Validando...</p>
            )}
            <button
              type="button"
              onClick={handleCancelarCaptcha}
              className="mt-3 text-sm text-blue-700 hover:underline"
            >
              Cancelar
            </button>
          </div>
        )}

        <main>
          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && !balanceData && (
            <p className="text-center py-10">Cargando...</p>
          )}

          {!loading && balanceData && (
            <>
              <WalletAlert
                balance={balanceData.saldo}
                estado={balanceData.estado}
              />

              <BalanceCard
                saldo={balanceData.saldo}
                moneda={balanceData.moneda || "Bs"}
                showSaldo={showSaldo}
                onToggleShowSaldo={() => setShowSaldo(!showSaldo)}
                onRefresh={reload}
                loading={loading}
                walletId={balanceData._id}
              />

              <div className="flex flex-col gap-3 mt-4 mb-6 md:hidden">
                <button
                  onClick={handleRecargar}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium shadow-sm transition-colors ${
                    loading || !fixerId
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#11255A] text-white hover:bg-[#0B1A40]"
                  }`}
                  disabled={loading || !fixerId}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Recargar Saldo</span>
                </button>

                <button
                  onClick={handleGrafico}
                  className="w-full flex items-center justify-center space-x-2 bg-[#11255A] text-white px-4 py-3 rounded-xl text-sm font-medium shadow-sm hover:bg-[#0B1A40] transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Gráfico de Ingresos</span>
                </button>
              </div>

              <div className="mt-8 pb-10">
                <TransactionList transactions={transactions} />
              </div>
            </>
          )}

          {!fixerId && !loading && (
            <p className="text-center text-gray-500 mt-10">
              No se detectó un ID de Fixer.
            </p>
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
