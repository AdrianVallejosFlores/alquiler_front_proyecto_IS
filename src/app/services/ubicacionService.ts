const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface UbicacionFromAPI {
  _id: string;
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  direccion?: string;
  tipo?: string;
}

export const obtenerUbicacionesFromAPI = async (): Promise<UbicacionFromAPI[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ubicaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Error al obtener ubicaciones');
    }
  } catch (error) {
    console.error('Error fetching ubicaciones:', error);
    throw new Error('No se pudieron cargar las ubicaciones. Intente nuevamente.');
  }
};

// Función de salud para verificar conexión con backend
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};