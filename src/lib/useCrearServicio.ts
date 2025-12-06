"use client";

import { useState } from "react";

export function useCrearServicio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Crear un nuevo servicio enviando  solo el nombre.
   * Llena  datos básicos por defecto.
   */
  async function crearServicio(nombre: string) {
    setLoading(true);
    setError(null);

    try {
      // Obtener proveedor desde localStorage (si existe)
      const local = localStorage.getItem("env_prueba");
      const dataLocal = local ? JSON.parse(local) : null;
      const proveedorId = dataLocal?.fixer?.id ?? null;

      const payload = {
        nombre,
        descripcion: "Servicio creado automáticamente",
        duracion: 30,
        precio: 0,
        rating: 0,
        proveedorId: proveedorId || undefined,
      };

      const res = await fetch(`${API_URL}/api/devcode/servicios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear servicio");
      }

      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { crearServicio, loading, error };
}
