import { fetchTrabajosCliente } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api';
import { fetchTrabajosProveedor } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/services/api';
import type { Job } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types';

export type Role = 'cliente' | 'proveedor';

// IDs reales del backend (Hardcoded temporalmente para Sprint 2)
const CLIENTE_ID = '6902c31538df4e88b6680634';
// ✅ NUEVO: Definimos un ID de proveedor por defecto para evitar el error de TypeScript
const PROVEEDOR_ID = '673e44e25a24300326463994'; 

/** Devuelve un trabajo por ID usando el rol para decidir qué servicio llamar */
export async function fetchJobByIdRole(id: string, role: Role): Promise<Job | null> {
  try {
    let list: Job[];
    
    if (role === 'cliente') {
      list = await fetchTrabajosCliente(CLIENTE_ID);
    } else {
      // ✅ CORRECCIÓN: Ahora pasamos el PROVEEDOR_ID requerido por la función actualizada
      list = await fetchTrabajosProveedor(PROVEEDOR_ID);
    }

    return list.find(j => j.id === id) ?? null;
  } catch (error) {
    console.error(`Error al obtener trabajo por ID (${role}):`, error);
    return null;
  }
}