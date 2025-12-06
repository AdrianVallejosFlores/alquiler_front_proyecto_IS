import { IBilletera, ITransaccionBackend } from "../types";

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
//const rawBase = process.env.NEXT_PUBLIC_API_URL || "https://wallletback.vercel.app";
const API_BASE_URL = rawBase.endsWith("/api")
  ? rawBase.slice(0, -4)
  : rawBase;

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

export const fetchWalletData = async (fixerId: string) => {
  const urlWallet = buildUrl(`/api/bitcrew/wallet/fixer/${fixerId}`);
  const urlHistorial = buildUrl(`/api/bitcrew/historial/${fixerId}`);

  console.log("📡 URL Solicitada (Wallet):", urlWallet);

  const [billeteraRes, historialRes] = await Promise.all([
    fetch(urlWallet, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    }),
    fetch(urlHistorial, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    }),
  ]);

  if (!billeteraRes.ok) {
    throw new Error(
      `Error HTTP (Saldo): ${billeteraRes.status} - ${billeteraRes.statusText}`
    );
  }
  const dataBilletera = await billeteraRes.json();
  if (dataBilletera.success === false) {
    throw new Error(dataBilletera.message || "Error al obtener billetera");
  }

  if (!historialRes.ok) {
    throw new Error(`Error HTTP (Historial): ${historialRes.status}`);
  }
  const dataHistorial = await historialRes.json();
  if (dataHistorial.success === false) {
    throw new Error(dataHistorial.message || "Error al obtener historial");
  }

  const transaccionesRaw = dataHistorial.success
    ? dataHistorial.transacciones
    : [];

  const walletInfo = dataBilletera.data || dataBilletera.billetera || {};

  const billeteraAdaptada: IBilletera = {
    _id: walletInfo._id,
    saldo: walletInfo.saldo,
    estado: walletInfo.estado,
    moneda: "Bs",
  };

  const transaccionesAdaptadas: ITransaccionBackend[] = transaccionesRaw.map(
    (tx: any) => ({
      _id: tx._id,
      monto: tx.monto,
      descripcion: tx.descripcion,
      fecha: tx.fecha_pago || tx.createdAt || new Date().toISOString(),
      tipo:
        tx.tipo === "ingreso" || tx.tipo === "credito" ? "credito" : "debito",
    })
  );

  return {
    billetera: billeteraAdaptada,
    transacciones: transaccionesAdaptadas,
  };
};

export interface IWalletStats {
  ingresosTotal: number;
  recargasTotal: number;
  retirosTotal: number;
}

export const fetchWalletStats = async (
  fixerId: string
): Promise<IWalletStats> => {
  const url = buildUrl(`/api/bitcrew/wallet/fixer/${fixerId}/stats`);
  console.log("📡 URL stats:", url);

  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Error HTTP (Stats): ${res.status} - ${res.statusText}`
    );
  }

  const data = await res.json();

  if (data.success === false) {
    throw new Error(
      data.message || "Error al obtener stats de billetera"
    );
  }

  return {
    ingresosTotal: data.ingresosTotal ?? 0,
    recargasTotal: data.recargasTotal ?? 0,
    retirosTotal: data.retirosTotal ?? 0,
  };
};