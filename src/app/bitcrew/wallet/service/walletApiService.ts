import { IBilletera, ITransaccionBackend } from "../types";

// 1. CORRECCIÓN: Definimos la base solo como el servidor (sin /api) para evitar confusiones
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchWalletData = async (fixerId: string) => {
  
  // 2. CORRECCIÓN: Añadimos explícitamente '/api/bitcrew' para coincidir con tu backend
  const walletUrl = `${BASE_URL}/api/bitcrew/wallet/${fixerId}`;
  const historialUrl = `${BASE_URL}/api/bitcrew/historial/${fixerId}`;

  console.log("📡 Fetching Wallet:", walletUrl);

  const [billeteraRes, historialRes] = await Promise.all([
    fetch(walletUrl, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }),
    
    fetch(historialUrl, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }),
  ]);

  // Manejo de errores
  if (!billeteraRes.ok) throw new Error(`Error HTTP (Saldo): ${billeteraRes.status}`);
  const dataBilletera = await billeteraRes.json();
  // Validación extra: a veces el success viene dentro de data o directo
  if (dataBilletera.success === false) throw new Error(dataBilletera.message || "Error al obtener billetera");

  if (!historialRes.ok) throw new Error(`Error HTTP (Historial): ${historialRes.status}`);
  const dataHistorial = await historialRes.json();
  if (dataHistorial.success === false) throw new Error(dataHistorial.message || "Error al obtener historial");

  // Transformación de datos
  // IMPORTANTE: Asegúrate de leer la propiedad correcta que devuelve tu backend (data o billetera)
  const walletInfo = dataBilletera.data || dataBilletera.billetera || {}; 

  const billeteraAdaptada: IBilletera = {
    _id: walletInfo._id,
    saldo: walletInfo.saldo,
    estado: walletInfo.estado,
    moneda: "Bs" 
  };

  const listaTransacciones = dataHistorial.data || dataHistorial.transacciones || [];

  const transaccionesAdaptadas: ITransaccionBackend[] = listaTransacciones.map((tx: any) => ({
    _id: tx._id,
    monto: tx.monto,
    descripcion: tx.descripcion,
    fecha: tx.fecha_pago || tx.createdAt || new Date().toISOString(),
    tipo: (tx.tipo === 'ingreso' || tx.tipo === 'credito') ? 'credito' : 'debito'
  }));

  return {
    billetera: billeteraAdaptada,
    transacciones: transaccionesAdaptadas,
  };
};