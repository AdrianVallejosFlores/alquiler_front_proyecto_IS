// src/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api.ts
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

<<<<<<< HEAD
const API_URL = 'https://back-segundosprint-1.onrender.com/api/los_vengadores/trabajos';
=======
// Se usa la URL de producción (Vercel) del branch 'origin/dev/soft_war_Sprint_2'.
// Nota: Se corrigió 'los_vengadores' por 'vengadores' para coincidir con el backend remoto.
const API_URL = 'https://alquiler-back-soft-war2.vercel.app/api/vengadores/trabajos';
>>>>>>> development

// 🔹 Actualizar la interfaz para incluir campos de cancelación
interface BackendTrabajo {
  _id: string;
  id_cliente?: { nombre: string };
  id_proveedor?: { nombre: string };
  servicio: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  descripcion?: string;
  costo?: number;
  // ✅ AGREGAR ESTOS CAMPOS DE CANCELACIÓN
  justificacion_cancelacion?: string;
  cancelado_por?: string;
}

// 🔹 Obtener trabajos del cliente desde el backend real
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  // Se usa la constante API_URL definida arriba
  const res = await fetch(`${API_URL}/cliente/${clienteId}`, { cache: 'no-store' });

  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data: BackendTrabajo[] = await res.json();

  return data.map((t) => ({
    id: t._id,
    providerName: t.id_proveedor?.nombre || 'Proveedor desconocido',
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.hora_inicio),
    endISO: convertirAISO(t.fecha, t.hora_fin),
    status: normalizarEstado(t.estado),
    description: t.descripcion || 'Sin descripción',
    cost: t.costo || 0,
    // ✅ AGREGAR ESTOS CAMPOS AL JOB
    cancelReason: t.justificacion_cancelacion || '',
    cancelledBy: t.cancelado_por || '',
  }));
}