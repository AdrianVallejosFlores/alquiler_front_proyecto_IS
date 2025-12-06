// src/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/services/api.ts
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

// Usamos la URL de producción (Vercel) corregida.
const API_URL = 'https://alquiler-back-soft-war2.vercel.app/api/vengadores/trabajos';

// Interfaz que representa la estructura del trabajo que viene del backend (MongoDB)
interface TrabajoBackend {
  _id: string;
  id_cliente?: { nombre: string };
  id_proveedor?: { nombre: string };
  cliente?: string;
  proveedor?: string;
  servicio?: string;
  fecha?: string;          // ej. "2025-11-02"
  hora_inicio?: string;    // ej. "09:00"
  hora_fin?: string;       // ej. "11:00"
  estado?: string;
  descripcion?: string;
  descripcion_trabajo?: string;
  costo?: number;
  precio?: number;
  // campos adicionales opcionales:
  fechaISO?: string;
  horaInicio?: string;
  horaFin?: string;
  estadoTrabajo?: string;
  justificacion_cancelacion?: string;
  cancelado_por?: string;
}

// Convierte fecha y hora en formato ISO "YYYY-MM-DDTHH:MM:00"
function safeConvertToISO(fecha?: string, hora?: string): string {
  if (!fecha || !hora) return '';
  return `${fecha}T${hora}:00`;
}

/** * HU 1.7 – Trabajos por PROVEEDOR 
 * 🔹 Obtiene trabajos del proveedor usando query params
 */
export async function fetchTrabajosProveedor(proveedorId: string, estado?: string): Promise<Job[]> {
  // Construimos la URL con parámetros de búsqueda (query params)
  const url = new URL(`${API_URL}/proveedor`);
  url.searchParams.set('proveedorId', proveedorId);
  
  if (estado) {
    url.searchParams.set('estado', estado);
  }

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener trabajos del proveedor');

  const data: TrabajoBackend[] = await res.json();

  return data.map((t) => ({
    id: t._id,
    clientName: t.id_cliente?.nombre ?? t.cliente ?? '',
    service: t.servicio ?? '',
    startISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_inicio ?? t.horaInicio),
    endISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_fin ?? t.horaFin),
    fechaISO: t.fecha ?? t.fechaISO,
    status: normalizarEstado(t.estado ?? t.estadoTrabajo ?? ''),
    description: t.descripcion_trabajo ?? t.descripcion ?? '',
    costo: t.costo ?? t.precio,
  }));
}

/** 🔹 Obtiene trabajos del cliente */
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');

  const data: TrabajoBackend[] = await res.json();

  return data.map((t) => ({
    id: t._id,
    providerName: t.id_proveedor?.nombre ?? t.proveedor ?? '',
    service: t.servicio ?? '',
    startISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_inicio ?? t.horaInicio),
    endISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_fin ?? t.horaFin),
    fechaISO: t.fecha ?? t.fechaISO,
    status: normalizarEstado(t.estado ?? t.estadoTrabajo ?? ''),
    description: t.descripcion_trabajo ?? t.descripcion ?? '',
    costo: t.costo ?? t.precio,
  }));
}