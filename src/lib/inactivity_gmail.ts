import {
  getProveedorById,
  getServicioById,
  getClienteById,
} from "@/lib/data-fetcher";

export type Destination = { email?: string; phone?: string; name?: string };

export type CreateAppointmentPayload = {
  proveedorId: string;
  servicioId: string;
  fecha: string; // ISO
  horario?: { inicio?: string; fin?: string };
  cliente?: { nombre?: string; email?: string; phone?: string; id?: string };
  ubicacion?: { direccion?: string; notas?: string };
  citaId?: string;
  [key: string]: any;
};
// 
export type CreateResponse = {
  ok: boolean;
  data?: any;
  message?: string;
  status?: number;
  error?: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* Utils */

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
   📧 Función base: Gmail
   =========================================================== */

function isValidEmail(email?: string) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).trim());
}


export async function sendNotification(payload: {
  subject: string;
  message: string;
  destinations: Destination[];
  fromName?: string;
  meta?: any;
}): Promise<CreateResponse> {
  const NOTIFY_URL = `${API_URL}/api/gmail-notifications`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (process.env.NEXT_PUBLIC_API_KEY)
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;

  const safeMessage =
    payload.message
      ?.replace(/\*(.*?)\*/g, "<b>$1</b>")
      ?.replace(/\n/g, "<br>") ?? "";

  const formattedPayload = { ...payload, message: safeMessage };

  const maxAttempts = 3;
  const retryDelay = 15000;

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(NOTIFY_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(formattedPayload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const body = await res.json().catch(() => ({}));

      const backendFailed =
        !res.ok ||
        body?.ok === false ||
        body?.error ||
        /invalid_client|Unauthorized|fail|error/i.test(
          JSON.stringify(body)
        );

      if (backendFailed) {
        console.warn(
          `❌ Error en intento ${attempt}:`,
          body?.message ?? res.statusText
        );

        if (attempt < maxAttempts) {
          console.log(
            `⏳ Esperando ${retryDelay / 1000}s antes del reintento...`
          );
          await wait(retryDelay);
          continue;
        }

        return {
          ok: false,
          status: res.status,
          message: body?.message ?? "Error al enviar notificación.",
          error: body?.error ?? null,
        };
      }

      console.info(
        `✅ Notificación enviada correctamente en intento ${attempt} (${Date.now() - startTime
        }ms)`
      );

      return { ok: true, data: body?.data ?? body, status: res.status };
    } catch (err: any) {
      console.error(
        `⚠️ Fallo en intento ${attempt}:`,
        err?.message ?? err
      );

      if (attempt >= maxAttempts) {
        return {
          ok: false,
          message:
            err?.message ?? "Error desconocido al enviar notificación.",
        };
      }

      console.log(
        `⏳ Esperando ${retryDelay / 1000}s antes del reintento...`
      );
      await wait(retryDelay);
    }
  }

  return {
    ok: false,
    message: "No se pudo enviar la notificación tras varios intentos.",
  };
}

/* ===========================================================
   📧 CREAR  CITA — Requester + Fixer
   =========================================================== */

export async function notifyNewServicesAvailable() {
  try {
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.fixer) {
      console.warn("⚠️ No hay datos de fixer en env_prueba");
      return { ok: false, message: "No hay datos del fixer para enviar notificación." };
    }

    const { request } = userData;

    const requestNombre = request.nombre || "Usuario";
    const requestCorreo = request.correo || "";

    const nuevosServicios = parseInt(
      localStorage.getItem("lista_nuevos_servicios") || "0",
      10
    );

    if (nuevosServicios <= 0) {
      return { ok: true, notified: false, message: "No hay nuevos servicios." };
    }

    // ✔ Si supera 15 → "(+)"
    const cantidadMostrar = nuevosServicios > 15 ? "(+15)" : String(nuevosServicios);

    // URL app
    const appURL = process.env.NEXT_PUBLIC_URL_DEPLOY + "/booking/agenda"; // 🔹 cámbiala cuando quieras

    const hora = localStorage.getItem("hora_sistema");
    let saludo = "Hola";
    if (hora === "mañana") saludo = "Buenos días";
    else if (hora === "tarde") saludo = "Buenas tardes";
    else if (hora === "noche") saludo = "Buenas noches";

    const subject = "Nuevos servicios disponibles";

    const message = [
      `✨ *${saludo}, ${requestNombre}* ✨`,
      "",
      "Somos *SERVINEO* y queremos informarte que:",
      `🔔 *Tienes ${cantidadMostrar} nuevos servicios disponibles para ti.*`,
      "",
      `🔗 Ingresa a al panel para mas informacion: ${appURL}`,
      "",
      "Esperamos tu regreso 💙",
      "",
      "— *Equipo SERVINEO*",
    ].join("\n");

    const destinations: Destination[] = [];
    if (requestCorreo) destinations.push({ email: requestCorreo, name: requestNombre });

    const result = await sendNotification({
      subject,
      message,
      destinations,
      fromName: "Sistema de Trabajos",
      meta: { tipo: "nuevos_servicios" },
    });

    return result.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: result.message };

  } catch (err: any) {
    console.error("❌ Error en notifyNewServicesAvailable:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}


export async function notifyNewPromotionsAvailable() {
  try {
    // 🔹 1️⃣ Leer datos del localStorage
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.fixer) {
      console.warn("⚠️ No hay datos de fixer en env_prueba");
      return { ok: false, message: "No hay datos del fixer para enviar notificación." };
    }

    const { request } = userData;

    // Datos permitidos
    const requestNombre = request.nombre || "Usuario";
    const requestCorreo = request.correo || "";
    const requestNumero = request.numero || "";

    const appURL = process.env.NEXT_PUBLIC_URL_DEPLOY; // 🔹 cámbiala cuando quieras

    // 🔹 3️⃣ Determinar saludo según la hora
    const hora = localStorage.getItem("hora_sistema");
    let saludo = "Hola";
    if (hora === "mañana") saludo = "Buenos días";
    else if (hora === "tarde") saludo = "Buenas tardes";
    else if (hora === "noche") saludo = "Buenas noches";

    // 🔹 4️⃣ Crear mensaje
    const subject = "Nuevos promociones disponibles";

    const message = [
      `✨ *${saludo}, ${requestNombre}* ✨`,
      "",
      "Somos *SERVINEO* y te recordamos que tenemos promociones interesantes disponibles",
      `🔔 *No te pierdas las oportunidades de aprovecharlas, antes de que caduquen*`,
      "",
      `🔗 Ver promociones aquí: ${appURL}`,
      "",
      "Esperamos tu regreso 💙",
      "",
      "— *Equipo SERVINEO*",
    ].join("\n");

    // 🔹 5️⃣ Destinos (solo correo del fixer)
    const destinations: Destination[] = [];

    if (requestCorreo) destinations.push({ email: requestCorreo, name: requestNombre });

    // 🔹 6️⃣ Enviar notificación
    const result = await sendNotification({
      subject,
      message,
      destinations,
      fromName: "Sistema de Trabajos",
      meta: { tipo: "nuevos_servicios" },
    });

    return result.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: result.message };

  } catch (err: any) {
    console.error("❌ Error en notifyNewServicesAvailable:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}