// src/lib/appointments_gmail.ts

/* Para las funciones de actualizacion y cancelacion faltan validar valores para el nombre
 * del cliente, ya que estamos usando el predeterminado, solo se puso su nombre de pila
 */

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

  const maxAttempts = 1;
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
        `✅ Notificación enviada correctamente en intento ${attempt} (${
          Date.now() - startTime
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


export async function notifyFixerBalance(balance: number, estado: string) {
  try {
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.fixer) {
      console.warn("⚠️ No hay datos de fixer en env_prueba");
      return { ok: false, message: "Faltan datos locales del fixer." };
    }

    const { fixer } = userData;

    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerCorreo = fixer.correo || "";

    if (!fixerCorreo) {
      console.warn("⚠️ El fixer no tiene correo registrado.");
      return { ok: false, message: "El fixer no tiene correo para notificación." };
    }

    // 📅 Fecha actual
    const fechaActual = new Date().toLocaleString("es-BO");

    const subject = `Actualizacion de saldo — Estado: ${estado}`;

    const message = [
      "💰 *AVISO ACERCA DEL SALDO*",
      "",
      `Hola *${fixerNombre}*,`,
      "",
      "Tenemos una actualizacion sobre tu saldo, por el momento tu saldo esta en 0",
      "",
      `💵 *Saldo:* Bs. ${balance.toFixed(2)}`,
      `📌 *Estado:* Restringido`,
      `📅 *Fecha:* ${fechaActual}`,
      "",
      "— *Sistema de Pagos*",
    ].join("\n");

    const result = await sendNotification({
      subject,
      message,
      destinations: [{ email: fixerCorreo, name: fixerNombre }],
      fromName: "Sistema de Pagos",
      meta: { tipo: "fixer_balance_update", balance, estado, fecha: fechaActual },
    });

    return result;
  } catch (err: any) {
    console.error("❌ Error en notifyFixerBalance:", err);
    return { ok: false, message: err?.message };
  }
}

export async function notifyFixerBalanceNegative(balance: number, estado: string) {
  try {
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.fixer) {
      console.warn("⚠️ No hay datos de fixer en env_prueba");
      return { ok: false, message: "Faltan datos locales del fixer." };
    }

    const { fixer } = userData;

    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerCorreo = fixer.correo || "";

    if (!fixerCorreo) {
      console.warn("⚠️ El fixer no tiene correo registrado.");
      return { ok: false, message: "El fixer no tiene correo para notificación." };
    }

    // 📅 Fecha actual
    const fechaActual = new Date().toLocaleString("es-BO");

    const subject = `⚠️ Saldo negativo detectado — Estado: ${estado}`;

    const message = [
      "❗ *ALERTA DE SALDO NEGATIVO*",
      "",
      `Hola *${fixerNombre}*,`,
      "",
      "Tu saldo ha bajado a un valor negativo. Esto podría afectar tu interacción con los servicios.",
      "",
      `💵 *Saldo actual:* Bs. ${balance.toFixed(2)}`,
      `📌 *Estado:* Restringido`,
      `📅 *Fecha:* ${fechaActual}`,
      "",
      "Por favor regulariza tu saldo lo antes posible.",
      "",
      "— *Sistema de Pagos*",
    ].join("\n");

    const result = await sendNotification({
      subject,
      message,
      destinations: [{ email: fixerCorreo, name: fixerNombre }],
      fromName: "Sistema de Pagos",
      meta: { tipo: "fixer_balance_negative", balance, estado, fecha: fechaActual },
    });

    return result;
  } catch (err: any) {
    console.error("❌ Error en notifyFixerBalanceNegative:", err);
    return { ok: false, message: err?.message };
  }
}