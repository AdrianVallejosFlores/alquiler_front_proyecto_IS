import { useState, useEffect, useCallback } from "react";
import { fetchWalletData } from "../service/walletApiService";
import { IBilletera, IFrontendTransaction } from "../types";

export const useWallet = (fixerId: string | null) => {
  const [balanceData, setBalanceData] = useState<IBilletera | null>(null);
  const [transactions, setTransactions] = useState<IFrontendTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!fixerId) {
      setError("No se especificó un ID de Fixer.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Pasamos fixerId al servicio
      const { billetera, transacciones } = await fetchWalletData(fixerId);
      
      setBalanceData(billetera);

      // Mapeo a formato Frontend
      const frontendTransactions: IFrontendTransaction[] = transacciones.map((tx) => ({
        id: tx._id,
        type: tx.tipo,
        date: tx.fecha,
        amount: tx.monto,
        descripcion: tx.descripcion,
        currency: billetera.moneda 
      }));

      setTransactions(frontendTransactions);

    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setError(err.message);
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  }, [fixerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { balanceData, transactions, loading, error, reload: loadData };
};