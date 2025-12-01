import { IBilletera, ITransaccionBackend } from "../types";

// Si tu .env no está definido, esto usará localhost:4000/api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const fetchWalletData = async (fixerId: string) => {
  
  // CORRECCIÓN 1: Construcción correcta de la URL
  // Quitamos el "/api" extra y agregamos "/fixer" que faltaba según tu routes.ts
  const urlWallet = `${API_BASE_URL}/api/bitcrew/wallet/fixer/${fixerId}`;
  
  // Asumiremos que el historial también sigue un patrón similar (ajusta si es diferente en tu backend)
  const urlHistorial = `${API_BASE_URL}/api/bitcrew/historial/${fixerId}`; 

  console.log("📡 URL Solicitada (Wallet):", urlWallet);

  const [billeteraRes, historialRes] = await Promise.all([
    fetch(urlWallet, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }),
    fetch(urlHistorial, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }),
  ]);

  // Manejo de errores Billetera
  if (!billeteraRes.ok) {
    // Esto nos ayudará a ver en consola si sigue siendo 404 o es otro error
    throw new Error(`Error HTTP (Saldo): ${billeteraRes.status} - ${billeteraRes.statusText}`);
  }
  const dataBilletera = await billeteraRes.json();
  // Validación extra: a veces el success viene dentro de data o directo
  if (dataBilletera.success === false) throw new Error(dataBilletera.message || "Error al obtener billetera");

  // Manejo de errores Historial
  if (!historialRes.ok) {
    // Si el historial falla, no debería romper toda la app, podrías manejarlo diferente, 
    // pero por ahora dejemos el throw.
    throw new Error(`Error HTTP (Historial): ${historialRes.status}`);
  }
  const dataHistorial = await historialRes.json();
  if (dataHistorial.success === false) throw new Error(dataHistorial.message || "Error al obtener historial");
  // Validación suave para historial: si falla, devolvemos array vacío en lugar de error crítico
  const transaccionesRaw = dataHistorial.success ? dataHistorial.transacciones : [];

  // Transformación de datos
  // IMPORTANTE: Asegúrate de leer la propiedad correcta que devuelve tu backend (data o billetera)
  const walletInfo = dataBilletera.data || dataBilletera.billetera || {}; 

  const billeteraAdaptada: IBilletera = {
    _id: walletInfo._id,
    saldo: walletInfo.saldo,
    estado: walletInfo.estado,
  moneda: "Bs" 
};

const transaccionesAdaptadas: ITransaccionBackend[] = transaccionesRaw.map((tx: any) => ({
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