import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "./hooks/useWallet";
import WalletAlert from "./components/walletAlert";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";
// NUEVO: Importamos los iconos
import { ChevronLeft, BarChart3, Wallet, Settings } from "lucide-react";

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

<header className="flex justify-between items-center mb-6">
  <div className="flex items-center space-x-2">
    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 p-2" title="Volver">
      {/* CAMBIO: Icono Lucide */}
      <ChevronLeft className="w-6 h-6" />
    </button>
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#11255A]">Mi Billetera</h1>
      {/* CAMBIO: Ocultar subtítulo en móvil para ganar espacio */}
      <p className="text-xs text-gray-500 md:hidden">Billetera de: usuario</p>
    </div>
  </div>

  {/* El resto del header sigue igual por ahora... */}
  {/* ... div izquierdo del header ... */}

  {/* NUEVO: Contenedor para acciones del header */}
  <div className="flex items-center gap-2">
    {/* Aquí irán los botones de escritorio luego */}

    {/* Botón de Ajustes (Visible siempre o ajustado luego) */}
    <button onClick={handleAjustes} className="p-2 text-gray-500 hover:text-[#11255A] transition rounded-full hover:bg-gray-100">
      <Settings className="w-6 h-6" />
    </button>
  </div>
</header>

{/* Contenedor derecho del header */ }
<div className="flex items-center gap-3">

  {/* NUEVO: Contenedor exclusivo Desktop */}
  <div className="hidden md:flex items-center space-x-3">
    {/* Espacio reservado para botones */}
  </div>

  {/* Botón Ajustes se mantiene fuera o dentro según prefieras, dejémoslo al final */}
  <button onClick={handleAjustes} className="p-2 text-gray-500 hover:text-[#11255A]">
    <Settings className="w-6 h-6" />
  </button>
</div>
<div className="hidden md:flex items-center space-x-3">
              {/* NUEVO: Botón Gráfico */}
              <button
                onClick={handleGrafico}
                className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Gráfico de Ingresos</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button onClick={handleGrafico} ... > ... </button>

{/* NUEVO: Botón Recargar */ }
<button
  onClick={handleRecargar}
  disabled={loading || !fixerId}
  className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors disabled:opacity-50"
>
  <Wallet className="w-5 h-5" />
  <span>Recargar Saldo</span>
</button>
            </div >