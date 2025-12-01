// ===========================================================
//   📱 NOTIFICACIONES WHATSAPP (versión clonada del Gmail)
// ===========================================================

import {
  getProveedorById,
  getServicioById,
  getClienteById,
} from "@/lib/data-fetcher";

/* Tipos */
export type Destination = { phone?: string; name?: string };

export type CreateAppointmentPayload = {
  proveedorId: string;
  servicioId: string;
  fecha: string;
  horario?: { inicio?: string; fin?: string };
  cliente?: { nombre?: string; phone?: string; id?: string };
  ubicacion?: { direccion?: string; notas?: string };
  citaId?: string;
  [key: string]: any;
};

export type CreateResponse = {
  ok: boolean;
  data?: any;
  message?: string;
  status?: number;
  error?: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ========================================
   📅 Utilidades
   ======================================== */
const formatearFechaLarga = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const safeStr = (v: any, fallback = "—") =>
  v === undefined || v === null || v === "" ? fallback : String(v);

/* ===========================================================
   📱 Función base: WhatsApp
   =========================================================== */

export async function sendWhatsAppNotification(payload: {
  message: string;
  destinations: Destination[];
  fromName?: string;
  meta?: any;
}): Promise<CreateResponse> {
  const NOTIFY_URL = `${API_URL}/api/whatsapp-notifications`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.NEXT_PUBLIC_API_KEY)
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;

  const maxAttempts = 3;
  const retryDelay = 15000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(NOTIFY_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const body = await res.json().catch(() => ({}));

      if (!res.ok || body?.ok === false || body?.error) {
        console.warn(`❌ Error intento ${attempt}:`, body?.message ?? res.statusText);

        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, retryDelay));
          continue;
        }

        return {
          ok: false,
          status: res.status,
          message: body?.message ?? "Error al enviar WhatsApp.",
          error: body?.error ?? null,
        };
      }

      return { ok: true, data: body?.data ?? body, status: res.status };
    } catch (err: any) {
      console.error(`⚠️ Fallo intento ${attempt}:`, err?.message ?? err);

      if (attempt >= maxAttempts)
        return { ok: false, message: err?.message ?? "Error desconocido en WhatsApp." };

      await new Promise((r) => setTimeout(r, retryDelay));
    }
  }

  return { ok: false, message: "No se pudo enviar la notificación tras varios intentos." };
}

/* ===========================================================
   📱 WHATSAPP — Nuevos Servicios
   =========================================================== */

export async function notifyNewServicesAvailableWhatsApp() {
  try {
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.fixer) {
      console.warn("⚠️ No hay datos de fixer en env_prueba");
      return { ok: false, message: "No hay datos del fixer para enviar notificación." };
    }

    const { request } = userData;

    const requestNombre = request.nombre || "Usuario";
    const requestNumero = request.numero || "";

    const nuevosServicios = parseInt(
      localStorage.getItem("lista_nuevos_servicios") || "0",
      10
    );

    if (nuevosServicios <= 0) {
      return { ok: true, notified: false, message: "No hay nuevos servicios." };
    }

    const cantidadMostrar = nuevosServicios > 15 ? "(+15)" : String(nuevosServicios);

    const appURL = process.env.NEXT_PUBLIC_URL_DEPLOY + "/booking/agenda";

    const hora = localStorage.getItem("hora_sistema");
    let saludo = "Hola";
    if (hora === "mañana") saludo = "Buenos días";
    else if (hora === "tarde") saludo = "Buenas tardes";
    else if (hora === "noche") saludo = "Buenas noches";

    const message = [
      `*${saludo}, ${requestNombre}*`,
      "",
      "Somos *SERVINEO* y queremos informarte:",
      `🔔 *Tienes ${cantidadMostrar} nuevos servicios disponibles.*`,
      "",
      `🔗 Ingresa para ver más: ${appURL}`,
      "",
      "Esperamos tu regreso 💙",
      "",
      "— *Equipo SERVINEO*",
    ].join("\n");

    if (!requestNumero)
      return { ok: false, message: "No hay número de teléfono del usuario." };

    const result = await sendWhatsAppNotification({
      message,
      destinations: [{ phone: requestNumero, name: requestNombre }],
      fromName: "Sistema de Trabajos",
      meta: { tipo: "nuevos_servicios" },
    });

    return result.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: result.message };
  } catch (err: any) {
    console.error("❌ Error en notifyNewServicesAvailableWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}

/* ===========================================================
   📱 WHATSAPP — Nuevas Promociones
   =========================================================== */

export async function notifyNewPromotionsAvailableWhatsApp() {
  try {
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.fixer) {
      console.warn("⚠️ No hay datos de fixer en env_prueba");
      return { ok: false, message: "No hay datos del fixer para enviar notificación." };
    }

    const { request } = userData;

    const requestNombre = request.nombre || "Usuario";
    const requestNumero = request.numero || "";

    const appURL = process.env.NEXT_PUBLIC_URL_DEPLOY;

    const hora = localStorage.getItem("hora_sistema");
    let saludo = "Hola";
    if (hora === "mañana") saludo = "Buenos días";
    else if (hora === "tarde") saludo = "Buenas tardes";
    else if (hora === "noche") saludo = "Buenas noches";

    const message = [
      `✨ *${saludo}, ${requestNombre}* ✨`,
      "",
      "Tenemos *promociones especiales disponibles* para ti.",
      "",
      `🔗 Ver promociones aquí: ${appURL}`,
      "",
      "Aprovecha antes de que caduquen 💙",
      "",
      "— *Equipo SERVINEO*",
    ].join("\n");

    if (!requestNumero)
      return { ok: false, message: "No hay número telefónico del usuario." };

    const result = await sendWhatsAppNotification({
      message,
      destinations: [{ phone: requestNumero, name: requestNombre }],
      fromName: "Sistema de Trabajos",
      meta: { tipo: "nuevas_promociones" },
    });

    return result.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: result.message };
  } catch (err: any) {
    console.error("❌ Error en notifyNewPromotionsAvailableWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}
