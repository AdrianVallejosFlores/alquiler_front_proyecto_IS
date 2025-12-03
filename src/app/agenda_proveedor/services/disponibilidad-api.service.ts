// src/app/agenda_proveedor/services/disponibilidad-api.service.ts

const API_BASE_URL = 'https://back-segundosprint-1.onrender.com/api/los_vengadores/calendario-disponibilidad';

export interface HorarioAPI {
  horaInicio: string;
  horaFin: string;
  costoHora: number;
}

export interface RespuestaHorarios {
  fecha: string;
  horarios?: HorarioAPI[];
  mensaje?: string;
}

export interface InfoProveedor {
  nombre: string;
  profesion: string;
  descripcion?: string;
}

export class DisponibilidadAPIService {
  /**
   * Obtener horarios disponibles de un día específico
   * @param proveedorId - ID o slug del proveedor (ej: "proveedor_123" o "juan-perez")
   * @param fecha - Fecha en formato YYYY-MM-DD (ej: "2025-10-29")
   */
  static async obtenerHorariosDia(
    proveedorId: string,
    fecha: string
  ): Promise<RespuestaHorarios> {
    try {
      const url = `${API_BASE_URL}/${proveedorId}/horarios/${fecha}`;
      console.log('🌐 Fetching:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RespuestaHorarios = await response.json();
      console.log('✅ Horarios recibidos:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error al obtener horarios:', error);
      throw error;
    }
  }

  /**
   * Obtener información del proveedor
   * @param proveedorId - ID o slug del proveedor
   */
  static async obtenerInfoProveedor(proveedorId: string): Promise<InfoProveedor> {
    try {
      const url = `${API_BASE_URL}/${proveedorId}/info`;
      console.log('🌐 Fetching proveedor info:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: InfoProveedor = await response.json();
      console.log('✅ Info proveedor recibida:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error al obtener info del proveedor:', error);
      throw error;
    }
  }
}