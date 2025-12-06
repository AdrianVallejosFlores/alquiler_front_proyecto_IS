import { fetchFromApi } from "@/lib/data-fetcher";
import { notifyNewServicesAvailable, notifyNewPromotionsAvailable } from "@/lib/inactivity_gmail";


export function procesarServiciosNuevos(servicios: any[]) {
  const horaLocalStr = localStorage.getItem("hora_local_actual");
  const appLoadedAtStr = localStorage.getItem("appLoadedAt");

  if (!horaLocalStr || !appLoadedAtStr) return;

  const horaLocal = new Date(horaLocalStr).getTime();
  const appLoadedAt = new Date(appLoadedAtStr).getTime();

  // Obtener contador actual
  let counter = parseInt(localStorage.getItem("lista_nuevos_servicios") || "0", 10);

  // Rango fijo almacenado
  const inicio = Math.min(appLoadedAt, horaLocal);
  const fin = Math.max(appLoadedAt, horaLocal);

  servicios.forEach((servicio) => {
    const id = servicio._id;
    if (!id) return;

    // Obtener fecha del ObjectId
    const timestampSeg = parseInt(id.substring(0, 8), 16);
    const fechaCreacion = timestampSeg * 1000;

    // Verificar que esté dentro del rango almacenado
    if (fechaCreacion >= inicio && fechaCreacion <= fin) {
      counter++;
    }
  });

  // Guardar conteo actualizado
  localStorage.setItem("lista_nuevos_servicios", counter.toString());
}



export function verificarCondicionDias() {
  const ahora = new Date();
  const appLoadedAtStr = localStorage.getItem("appLoadedAt");
  if (!appLoadedAtStr) return;
  

  const appLoadedAt = new Date(appLoadedAtStr);

  let condicionEnvio = parseInt(localStorage.getItem("condicion_envio") || "1", 10);
  const diasNecesarios = (2 * condicionEnvio);

  // Ahora calculamos días FALTANTES (porque appLoadedAt está en el futuro)
  const diffMs = appLoadedAt.getTime() - ahora.getTime();
  const diffDias = (diffMs / (1000 * 60 * 60 * 24)) + 0.1;

  // Si los días faltantes son <= 0 → ya pasamos appLoadedAt → condición cumplida
  if (diffDias >= diasNecesarios) {

    const listaActual = Number(localStorage.getItem("lista_nuevos_servicios") || "0");
    

    if (listaActual == 0) {
      notifyNewPromotionsAvailable();
      condicionEnvio = condicionEnvio + 1;
      localStorage.setItem("condicion_envio", condicionEnvio.toString());
      return; 
    }

    notifyNewServicesAvailable();
    localStorage.setItem("lista_nuevos_servicios", "0");
    condicionEnvio = condicionEnvio + 1;
    localStorage.setItem("condicion_envio", condicionEnvio.toString());

    alert(
      "⚠ Condición cumplida: se alcanzó la fecha appLoadedAt.\n" +
        "condicion_envio actual: " +
        condicionEnvio
    );

  }
}