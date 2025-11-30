"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "./hooks/useWallet";
import WalletAlert from "./components/walletAlert";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";
import { ChevronLeft, BarChart3, Wallet, Settings } from "lucide-react"; // Usamos lucide-react para limpieza

import Recaptcha from "../captcha/components/Recaptcha";
import { validarCaptcha } from "../captcha/service/captcha.service";



function WalletLogic() {

 const [captchaValido, setCaptchaValido] = useState(false);
 const [captchaCargando, setCaptchaCargando] = useState(false);

const onCaptchaVerify = async (token: string | null) => {
  if (!token) {
    setCaptchaValido(false);
    return;
  }

  setCaptchaCargando(true);
  const result = await validarCaptcha(token);
  setCaptchaCargando(false);

  setCaptchaValido(result.success);
};


  const router = useRouter();
  const searchParams = useSearchParams();

  // LEEMOS EL FIXER ID
  const fixerId = searchParams.get("fixer_id");

  const { balanceData, transactions, loading, error, reload } = useWallet(fixerId);
  const [showSaldo, setShowSaldo] = useState(true);

  // Handlers para las acciones
  const handleRecargar = () => {
    if (fixerId) router.push(`/bitcrew/pagosQR?fixer_id=${fixerId}`);
  };

  const handleGrafico = () => {
    // Aquí puedes añadir la navegación al gráfico cuando exista la ruta
    console.log("Navegar a Gráfico de Ingresos");
  };

  const handleAjustes = () => {
    console.log("Abrir Ajustes");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-8">

        {/* ================= HEADER ================= */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 p-2" title="Volver">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#11255A]">Mi Billetera</h1>
              <p className="text-xs text-gray-500 md:hidden">Billetera de: usuario</p>
            </div>
          </div>

         


          {/* --- BOTONES DESKTOP (Alineados a la derecha) --- */}
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
              disabled={loading || !fixerId || !captchaValido}
              className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors disabled:opacity-50"
            >
              <Wallet className="w-5 h-5" />
              <span>Recargar Saldo</span>
            </button>

            {/* Botón de Ajustes (Tuerca) */}
            <button onClick={handleAjustes} className="p-2 text-gray-500 hover:text-[#11255A] transition rounded-full hover:bg-gray-100">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* --- BOTÓN AJUSTES MOBILE (Solo la tuerca en el header) --- */}
          <div className="md:hidden">
            <button onClick={handleAjustes} className="p-2 text-gray-500 hover:text-[#11255A]">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* CAPTCHA para validar recarga (Desktop y Mobile) */}
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

              {/* TARJETA DE SALDO */}
              <BalanceCard
                saldo={balanceData.saldo}
                moneda={balanceData.moneda || "Bs"}
                showSaldo={showSaldo}
                onToggleShowSaldo={() => setShowSaldo(!showSaldo)}
                onRefresh={reload}
                loading={loading}
                walletId={balanceData._id}
              />

              {/* --- BOTONES MOBILE (Reubicados debajo de la tarjeta) --- */}
              <div className="flex flex-col gap-3 mt-4 mb-6 md:hidden">
                <button
                  onClick={handleRecargar}
                  disabled={loading || !fixerId || !captchaValido}
                  className="w-full flex items-center justify-center space-x-2 bg-[#11255A] text-white px-4 py-3 rounded-xl text-sm font-medium shadow-sm hover:bg-[#0B1A40] transition-colors disabled:opacity-50"
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

              {/* LISTA DE TRANSACCIONES */}
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