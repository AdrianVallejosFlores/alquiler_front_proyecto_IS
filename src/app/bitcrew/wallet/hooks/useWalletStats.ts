import { useEffect, useState } from "react";
import { fetchWalletStats, IWalletStats } from "../service/walletApiService";
import { io, Socket } from "socket.io-client";

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:4000";

export const useWalletStats = (fixerId: string | null) => {
  const [stats, setStats] = useState<IWalletStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fixerId) {
      setError("No se especificó un ID de Fixer.");
      setLoading(false);
      return;
    }

    let socket: Socket | null = null;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const initialStats = await fetchWalletStats(fixerId);
        if (!cancelled) {
          setStats(initialStats);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error cargando stats de billetera:", err);
        if (!cancelled) {
          setError(err.message ?? "Error al cargar stats");
          setLoading(false);
        }
      }
    };

    const connectSocket = () => {
      socket = io(WS_BASE_URL, {
        transports: ["websocket"],
        query: { fixerId },
      });

      socket.on("wallet:statsUpdated", (payload: IWalletStats) => {
        if (!cancelled) {
          setStats(payload);
        }
      });
    };

    load();
    connectSocket();

    return () => {
      cancelled = true;
      if (socket) {
        socket.off("wallet:statsUpdated");
        socket.disconnect();
      }
    };
  }, [fixerId]);

  return { stats, loading, error };
};
