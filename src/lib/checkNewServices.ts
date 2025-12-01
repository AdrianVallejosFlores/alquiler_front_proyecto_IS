import { fetchFromApi } from "@/lib/data-fetcher";
import {
  notifyNewServicesAvailable,
  notifyNewPromotionsAvailable,
} from "@/lib/inactivity_gmail";

import {
  notifyNewServicesAvailableWhatsApp,
  notifyNewPromotionsAvailableWhatsApp,
} from "@/lib/inactivity_whatsapp";

/**
 * Obtiene nuevos servicios de últimos 15 min.
 */
export async function getNewServicesCount(): Promise<number> {
  try {
    const servicios = await fetchFromApi<any[]>("/api/devcode/servicios");
    if (!servicios || !Array.isArray(servicios)) return 0;

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const nuevosServicios = servicios.filter((s) => {
      if (!s._id) return false;
      const timestamp = new Date(parseInt(s._id.substring(0, 8), 16) * 1000);
      return timestamp >= fifteenMinutesAgo;
    });

    return nuevosServicios.length;
  } catch (err) {
    console.error("❌ Error verificando nuevos servicios:", err);
    return 0;
  }
}

/**
 * Procesa los servicios dentro del rango de fechas entre appLoadedAt y hora_local_actual,
 * PERO usando IDs procesados para evitar duplicados.
 */
export function procesarServiciosNuevos(servicios: any[]) {
  const horaLocalStr = localStorage.getItem("hora_local_actual");
  const appLoadedAtStr = localStorage.getItem("appLoadedAt");

  if (!horaLocalStr || !appLoadedAtStr) return;

  const horaLocal = new Date(horaLocalStr).getTime();
  const appLoadedAt = new Date(appLoadedAtStr).getTime();

  let counter = parseInt(localStorage.getItem("lista_nuevos_servicios") || "0", 10);

  // 🔥 IDs ya procesados (evita duplicados)
  const idsProcesados = new Set(
    JSON.parse(localStorage.getItem("ids_procesados") || "[]")
  );

  const inicio = Math.min(appLoadedAt, horaLocal);
  const fin = Math.max(appLoadedAt, horaLocal);

  servicios.forEach((servicio) => {
    const id = servicio._id;
    if (!id) return;

    // ⛔ Si ya fue contado, no lo contamos de nuevo
    if (idsProcesados.has(id)) return;

    const timestampSeg = parseInt(id.substring(0, 8), 16);
    const fechaCreacion = timestampSeg * 1000;

    if (fechaCreacion >= inicio && fechaCreacion <= fin) {
      counter++;
      idsProcesados.add(id); // 🔥 Marcado como procesado
    }
  });

  localStorage.setItem("lista_nuevos_servicios", counter.toString());
  localStorage.setItem("ids_procesados", JSON.stringify([...idsProcesados]));
}

/**
 * Valida días, llama a procesarServiciosNuevos SOLO cuando se ejecute esta función.
 */
export async function verificarCondicionDias() {
  const ahora = new Date();
  const appLoadedAtStr = localStorage.getItem("appLoadedAt");
  if (!appLoadedAtStr) return;

  const appLoadedAt = new Date(appLoadedAtStr);

  let condicionEnvio = parseInt(localStorage.getItem("condicion_envio") || "1", 10);
  const diasNecesarios = 2 * condicionEnvio;

  const diffMs = appLoadedAt.getTime() - ahora.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24) + 0.1;

  // 🔥 Solo se procesa cuando ya se cumplió la condición
  if (diffDias >= diasNecesarios) {

    // 🟦 Obtengo servicios SOLO para procesar si ya cumplió condición
    const servicios = await fetchFromApi<any[]>("/api/devcode/servicios");
    if (servicios && Array.isArray(servicios)) {
      procesarServiciosNuevos(servicios);
    }

    const listaActual = Number(localStorage.getItem("lista_nuevos_servicios") || "0");

    if (listaActual === 0) {
      notifyNewPromotionsAvailable();
      notifyNewPromotionsAvailableWhatsApp();
      condicionEnvio++;
      localStorage.setItem("condicion_envio", condicionEnvio.toString());
      alert( "⚠ Condición cumplida, se alcanzó el rango de inactividad.");
      return;
    }

    notifyNewServicesAvailable();
    notifyNewServicesAvailableWhatsApp();
    localStorage.setItem("lista_nuevos_servicios", "0");
    condicionEnvio++;
    localStorage.setItem("condicion_envio", condicionEnvio.toString());

    alert( "⚠ Condición cumplida, se alcanzó el rango de inactividad.");
  }
}
