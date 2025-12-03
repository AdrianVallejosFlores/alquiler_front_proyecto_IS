// src/modules/epic_aceptar-rechazar-trabajo-proveedor/services/solicitudProveedorService.ts

/**
 * Servicio para que el proveedor confirme o rechace trabajos (HU1)
 */

const BASE_URL = "https://back-segundosprint-1.onrender.com/api/los_vengadores/trabajos";

// 🔹 Tipo esperado desde el backend
export interface TrabajoResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    estado: string;
    [key: string]: unknown; // permite campos extra sin romper tipado
  };
}

/**
 * ✅ Confirmar trabajo
 * PUT /api/los_vengadores_trabajos/trabajos/:id/confirmar
 */
export async function confirmarSolicitud(id: string): Promise<TrabajoResponse> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/confirmar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data: TrabajoResponse = await res.json().catch(() => ({
      success: false,
      message: "Error inesperado del servidor",
    }));

    if (!res.ok) {
      console.error("❌ Error al confirmar trabajo:", data);
      throw new Error(data.message || "Error al confirmar trabajo");
    }

    console.log("✅ Trabajo confirmado:", data);
    return data;
  } catch (error) {
    console.error("❌ Excepción en confirmarSolicitud:", error);
    throw error;
  }
}

/**
 * ❌ Rechazar trabajo
 * PUT /api/los_vengadores_trabajos/trabajos/:id/rechazar
 */
export async function rechazarSolicitud(id: string): Promise<TrabajoResponse> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/rechazar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data: TrabajoResponse = await res.json().catch(() => ({
      success: false,
      message: "Error inesperado del servidor",
    }));

    if (!res.ok) {
      console.error("❌ Error al rechazar trabajo:", data);
      throw new Error(data.message || "Error al rechazar trabajo");
    }

    console.log("🚫 Trabajo rechazado:", data);
    return data;
  } catch (error) {
    console.error("❌ Excepción en rechazarSolicitud:", error);
    throw error;
  }
}
