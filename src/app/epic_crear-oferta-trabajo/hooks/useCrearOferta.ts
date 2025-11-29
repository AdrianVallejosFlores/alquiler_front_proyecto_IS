"use client";

import { useState } from "react";
import { OfertaTrabajo, RespuestaMock } from "../interfaces/Oferta.interface";
import { validarOferta } from "../utils/validarOferta";

export function useCrearOferta() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function enviarOferta(data: OfertaTrabajo): Promise<RespuestaMock> {
    const error = validarOferta(data);
    if (error) {
      setMensaje(error);
      return { success: false, message: error };
    }

    setMensaje(null);
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1200)); // ⏳ Simulación API

    setLoading(false);
    setMensaje("✅ Oferta creada correctamente (mock).");

    return { success: true, message: "OK (mock)" };
  }

  return { loading, mensaje, setMensaje, enviarOferta };
}
