import { IBilletera, ITransaccionBackend } from "../types";

// 1. CORRECCIÓN CRÍTICA: Asegúrate de que termine en "/api"
// Si tienes un archivo .env, revisa que NEXT_PUBLIC_API_URL tenga "/api" al final.
// Si no, usa este valor por defecto:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const fetchWalletData = async (fixerId: string) => {
  // Para depurar, descomenta esta línea y mira la consola del navegador (F12)
  console.log("📡 URL Solicitada:", `${API_BASE_URL}/bitCrew/wallet/${fixerId}`);

  const [billeteraRes, historialRes] = await Promise.all([
    // Asegúrate de escribir 'bitCrew' tal cual como lo definiste en tu backend (respetando mayúsculas)
    fetch(`${API_BASE_URL}/api/bitCrew/wallet/${fixerId}`, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }),
    
    fetch(`${API_BASE_URL}/api/bitCrew/historial/${fixerId}`, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }),
  ]);

  // Manejo de errores
  if (!billeteraRes.ok) throw new Error(`Error HTTP (Saldo): ${billeteraRes.status}`);
  const dataBilletera = await billeteraRes.json();
  if (!dataBilletera.success) throw new Error(dataBilletera.message || "Error al obtener billetera");

  if (!historialRes.ok) throw new Error(`Error HTTP (Historial): ${historialRes.status}`);
  const dataHistorial = await historialRes.json();
  if (!dataHistorial.success) throw new Error(dataHistorial.message || "Error al obtener historial");

  // Transformación de datos
  const billeteraAdaptada: IBilletera = {
    _id: dataBilletera.billetera._id,
    saldo: dataBilletera.billetera.saldo,
    estado: dataBilletera.billetera.estado,
    moneda: "Bs" 
  };

  const transaccionesAdaptadas: ITransaccionBackend[] = dataHistorial.transacciones.map((tx: any) => ({
    _id: tx._id,
    monto: tx.monto,
    descripcion: tx.descripcion,
    fecha: tx.fecha_pago || tx.createdAt || new Date().toISOString(),
    tipo: (tx.tipo === 'ingreso') ? 'credito' : 'debito'
  }));

  return {
    billetera: billeteraAdaptada,
    transacciones: transaccionesAdaptadas,
  };
};