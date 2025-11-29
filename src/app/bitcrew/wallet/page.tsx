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