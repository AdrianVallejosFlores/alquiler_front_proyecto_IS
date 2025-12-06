// src/lib/appointments_gmail.ts

/* Para las funciones de actualizacion y cancelacion faltan validar valores para el nombre
  del cliente, ya que estamos usando el predeterminado, solo se puso su nombre de pila
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

/* 
  📧 Función base: Gmail
    */

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

/* 
  CREAR CITA — Requester + Fixer
    */

export async function createAndNotify(payload: CreateAppointmentPayload) {
  try {
    //  1️⃣ Recuperar datos guardados del localStorage
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.request || !userData.fixer) {
      console.warn("⚠️ No hay datos válidos en env_prueba para requester/fixer");
      return { ok: false, message: "Faltan datos locales para enviar notificación." };
    }

    const { request, fixer } = userData;

    //  2️⃣ Usar directamente los datos locales
    const clienteNombre = request.nombre || "Cliente";
    const clienteCorreo = request.correo || "";
    const clienteNumero = request.numero || "";

    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerCorreo = fixer.correo || "";
    const fixerNumero = fixer.numero || "";

    let servicioNombre = "Servicio no especificado";
    try {
      const servicio = await getServicioById(payload.servicioId);
      if (servicio && servicio.nombre) {
        servicioNombre = servicio.nombre;
      }
    } catch (e) {
      console.warn("⚠️ No se pudo obtener el nombre del servicio:", e);
    }

    //  3️⃣ Datos de la cita
    const fechaLocal = formatearFechaLarga(payload.fecha);
    const horaInicio = safeStr(payload.horario?.inicio);
    const horaFin = safeStr(payload.horario?.fin);
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const notas = payload.ubicacion?.notas ?? "Ninguna";
    const citaId = payload.citaId ?? "";

    //  4️⃣ Crear mensaje para el Requester
    const requesterSubject = `Creación de cita con ${fixerNombre}`;
    const requesterMessage = [
      "✨ *CREACIÓN DE TU CITA* ✨",
      "",
      `Hola *${clienteNombre}*,`,
      "Tu cita ha sido creada exitosamente. Aquí los detalles:",
      "",
      `📅 *Fecha:* ${fechaLocal}`,
      `⏰ *Horario:* ${horaInicio} - ${horaFin}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      `👨‍⚕️ *Proveedor:* ${fixerNombre}`,
      `📍 *Dirección:* ${direccion}`,
      `🗒️ *Notas:* ${notas}`,
      citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
      "",
      "Gracias por confiar en nosotros 💙",
      "— *Sistema de Citas*",
    ].join("\n");

    const requesterDestinations: Destination[] = [];
    if (clienteCorreo) requesterDestinations.push({ email: clienteCorreo, name: clienteNombre });

    const requesterResult = requesterDestinations.length
      ? await sendNotification({
          subject: requesterSubject,
          message: requesterMessage,
          destinations: requesterDestinations,
          fromName: "Sistema de Citas",
          meta: { tipo: "booking_requester" },
        })
      : { ok: true };

    //  5️⃣ Notificación al Fixer
    if (fixerCorreo) {
      const fixerSubject = "Nueva cita confirmada";
      const fixerMessage = [
        "✅ *Nueva cita confirmada*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "Has recibido una nueva cita.",
        "",
        `📅 *Fecha:* ${fechaLocal}`,
        `🕒 *Horario:* ${horaInicio}${horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `📍 *Dirección:* ${direccion}`,
        `🗒️ *Notas:* ${notas}`,
        citaId ? `🆔 *ID de cita:* ${citaId}` : "",
        "",
        "Asegúrate de estar disponible en el horario indicado.",
      ].join("\n");

      await sendNotification({
        subject: fixerSubject,
        message: fixerMessage,
        destinations: [{ email: fixerCorreo, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "booking_fixer" },
      });
    }

    const noti = {
      type: "create",
      timestamp: Date.now(),
      fixerNombre,
      servicioNombre,
      fecha: fechaLocal,
      horaInicio,
      horaFin
    };

    // Obtener el número de citas en el localStorage
    let index = 1;
    while (localStorage.getItem(`temp_appointment${index}`)) {
      index++;
    }

    // Almacenar la nueva notificación con una clave única
    localStorage.setItem(`temp_appointment${index}`, JSON.stringify(noti));

    return requesterResult.ok
      ? { ok: true, notified: true, notifyResult: requesterResult }
      : { ok: false, notified: false, message: requesterResult.message };
  } catch (err: any) {
    console.error("❌ Error en createAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}

/* 
    UPDATE — Requester + Fixer
    */

export async function updateAndNotify(
  payload: CreateAppointmentPayload & { cambios?: string[] }
) {
  try {
    //  1️⃣ Recuperar datos guardados del localStorage
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.request || !userData.fixer) {
      console.warn("⚠️ No hay datos válidos en env_prueba para requester/fixer");
      return { ok: false, message: "Faltan datos locales para enviar notificación." };
    }

    const { request, fixer } = userData;

    //  2️⃣ Usar directamente los datos locales
    const clienteNombre = request.nombre || "Cliente";
    const clienteCorreo = request.correo || "";
    const clienteNumero = request.numero || "";

    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerCorreo = fixer.correo || "";
    const fixerNumero = fixer.numero || "";

    let servicioNombre = "Servicio no especificado";
    try {
      const servicio = await getServicioById(payload.servicioId);
      if (servicio && servicio.nombre) {
        servicioNombre = servicio.nombre;
      }
    } catch (e) {
      console.warn("⚠️ No se pudo obtener el nombre del servicio:", e);
    }

    //  3️⃣ Datos de la cita
    const fechaLocal = formatearFechaLarga(payload.fecha);
    const horaInicio = safeStr(payload.horario?.inicio);
    const horaFin = safeStr(payload.horario?.fin);
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const citaId =
      payload.citaId || (payload as any)?._id || (payload as any)?.id || "";

    const cambiosTexto =
      payload.cambios?.length
        ? `🔄 *Cambios realizados:* ${payload.cambios.join(", ")}`
        : "Se han actualizado los detalles de tu cita.";

    //  4️⃣ Notificación para el Requester
    const requesterSubject = `Actualización de tu cita con ${fixerNombre}`;
    const requesterMessage = [
      "✨ *ACTUALIZACIÓN DE CITA* ✨",
      "",
      `Hola *${clienteNombre}*,`,
      "Tu cita ha sido modificada correctamente.",
      "",
      cambiosTexto,
      "",
      `📅 *Fecha:* ${fechaLocal}`,
      `⏰ *Horario:* ${horaInicio} - ${horaFin}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      `👨‍⚕️ *Proveedor:* ${fixerNombre}`,
      `📍 *Dirección:* ${direccion}`,
      citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
      "",
      "— *Sistema de Citas*",
    ].join("\n");

    const requesterDestinations: Destination[] = [];
    if (clienteCorreo)
      requesterDestinations.push({ email: clienteCorreo, name: clienteNombre });

    const requesterResult = requesterDestinations.length
      ? await sendNotification({
          subject: requesterSubject,
          message: requesterMessage,
          destinations: requesterDestinations,
          fromName: "Sistema de Citas",
          meta: { tipo: "update_requester" },
        })
      : { ok: true };

    //  5️⃣ Notificación para el Fixer
    if (fixerCorreo) {
      const motivoUpdate =
        payload.ubicacion?.notas ||
        (payload.cambios?.length
          ? payload.cambios.join(", ")
          : "ajuste de disponibilidad del cliente.");

      const fixerSubject = "Cita actualizada";
      const fixerMessage = [
        "⚠️ *Cita actualizada*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "La cita con tu cliente ha sido actualizada.",
        "",
        `📅 *Nueva fecha:* ${fechaLocal}`,
        `🕒 *Nueva hora:* ${horaInicio}${
          horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""
        }`,
        `👤 *Cliente:* ${clienteNombre}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        citaId ? `🆔 *ID de cita:* ${citaId}` : "",
        `📝 *Motivo:* ${motivoUpdate}`,
        "",
        "Si el nuevo horario no te conviene, puedes proponer otro.",
      ].join("\n");

      await sendNotification({
        subject: fixerSubject,
        message: fixerMessage,
        destinations: [{ email: fixerCorreo, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "update_fixer" },
      });
    } else {
      console.warn("Proveedor sin email: no se envía notificación al fixer.");
    }

    const noti = {
      type: "update",
      timestamp: Date.now(),
      fixerNombre,
      servicioNombre,
      fecha: fechaLocal,
      horaInicio,
      horaFin
    };

    // Obtener el número de citas en el localStorage
    let index = 1;
    while (localStorage.getItem(`temp_appointment${index}`)) {
      index++;
    }

    // Almacenar la nueva notificación con una clave única
    localStorage.setItem(`temp_appointment${index}`, JSON.stringify(noti));

    return requesterResult.ok
      ? { ok: true, notified: true, notifyResult: requesterResult }
      : { ok: false, notified: false, message: requesterResult.message };
  } catch (err: any) {
    console.error("❌ Error en updateAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}

/* 
  CANCEL — Requester + Fixer
    */

/* 
  CANCEL — Requester + Fixer (solo con datos locales)
    */

export async function cancelAndNotify(payload: CreateAppointmentPayload) {
  try {
    //  1️⃣ Recuperar datos locales
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.request || !userData.fixer) {
      console.warn("⚠️ No hay datos válidos en env_prueba para requester/fixer");
      return { ok: false, message: "Faltan datos locales para enviar notificación." };
    }

    const { request, fixer } = userData;

    //  2️⃣ Datos básicos
    const clienteNombre = request.nombre || "Cliente";
    const clienteCorreo = request.correo || "";
    const clienteNumero = request.numero || "";

    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerCorreo = fixer.correo || "";
    const fixerNumero = fixer.numero || "";

    let servicioNombre = "Servicio no especificado";
    try {
      const servicio = await getServicioById(payload.servicioId);
      if (servicio && servicio.nombre) {
        servicioNombre = servicio.nombre;
      }
    } catch (e) {
      console.warn("⚠️ No se pudo obtener el nombre del servicio:", e);
    }

    //  3️⃣ Datos de la cita
    const fechaLocal = formatearFechaLarga(payload.fecha);

    //  4️⃣ Notificación para el Requester
    const requesterSubject = `Cancelación de cita con ${fixerNombre}`;
    const requesterMessage = [
      "❌ *CANCELACIÓN DE CITA* ❌",
      "",
      `Hola *${clienteNombre}*,`,
      `Tu cita programada con *${fixerNombre}* ha sido cancelada.`,
      "",
      `📅 *Fecha original:* ${fechaLocal}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      "",
      "Si fue un error, puedes volver a programarla cuando desees.",
      "",
      "— *Sistema de Citas*",
    ].join("\n");

    const requesterDestinations: Destination[] = [];
    if (clienteCorreo)
      requesterDestinations.push({ email: clienteCorreo, name: clienteNombre });

    const requesterResult = requesterDestinations.length
      ? await sendNotification({
          subject: requesterSubject,
          message: requesterMessage,
          destinations: requesterDestinations,
          fromName: "Sistema de Citas",
          meta: { tipo: "cancel_requester" },
        })
      : { ok: true };

    //  5️⃣ Notificación para el Fixer
    if (fixerCorreo) {
      const fixerSubject = "Cita cancelada";
      const fixerMessage = [
        "❌ *Cita cancelada*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "Tu cita con el cliente ha sido cancelada.",
        "",
        `📅 *Fecha original:* ${fechaLocal}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        "📝 *Motivo:* el cliente presentó un problema y no podrá asistir.",
        "",
        "Te notificaremos si solicita una reprogramación.",
      ].join("\n");

      await sendNotification({
        subject: fixerSubject,
        message: fixerMessage,
        destinations: [{ email: fixerCorreo, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "cancel_fixer" },
      });
    } else {
      console.warn("ℹ️ Proveedor sin email: no se envía notificación al fixer.");
    }

    const noti = {
      type: "cancel",
      timestamp: Date.now(),
      fixerNombre,
      servicioNombre,
      fecha: fechaLocal,
    };

    // Obtener el número de citas en el localStorage
    let index = 1;
    while (localStorage.getItem(`temp_appointment${index}`)) {
      index++;
    }

    // Almacenar la nueva notificación con una clave única
    localStorage.setItem(`temp_appointment${index}`, JSON.stringify(noti));

    return requesterResult.ok
      ? { ok: true, notified: true, notifyResult: requesterResult }
      : { ok: false, notified: false, message: requesterResult.message };
  } catch (err: any) {
    console.error("❌ Error en cancelAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}