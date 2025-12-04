import axios from "axios";

const BASE = "https://alquiler-back-1-9td5.onrender.com/api/borbotones/search/avanzada";

// =====================================================================
// ============================= TIPOS =================================
// =====================================================================

// -----------------------
// SERVICIOS
// -----------------------
export interface ServicioItem {
  id_servicio: number;
  nombre: string;
  descripcion?: string;
}

export interface ServiciosResponse {
  success: boolean;
  total: number;
  servicios: ServicioItem[];
}

// -----------------------
// ZONAS
// -----------------------
export interface ZonasResponse {
  success: boolean;
  total: number;
  zonas: string[];
}

// -----------------------
// HORARIOS
// -----------------------
export interface HorariosResponse {
  success?: boolean;
  total?: number;
  turnos?: string[];
  horarios?: string[];
}

// -----------------------
// EXPERIENCIA
// -----------------------
export interface ExperienciasResponse {
  success: boolean;
  total: number;
  experiencias: number[];
}

// -----------------------
// ESTADOS (true/false)
// -----------------------
export interface EstadosResponse {
  success: boolean;
  total: number;
  activos: boolean[];
}

// -----------------------
// PRECIO
// -----------------------
export interface PrecioItem {
  _id: string;
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  duracion_estimada: number;
  fecha_creacion: string;
}

export interface PrecioFiltro {
  precio_min: string;
  precio_max: string;
  rango: string;
}

export interface PrecioEstadisticas {
  precio_promedio: number;
  precio_minimo: number;
  precio_maximo: number;
  total_servicios: number;
}

export interface PrecioResponse {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filtro: PrecioFiltro;
  estadisticas: PrecioEstadisticas;
  data: PrecioItem[];
}

// -----------------------
// FECHA — BÚSQUEDA EXACTA
// -----------------------
export interface FechaItem {
  _id: string;
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  duracion_estimada: number;
  fecha_creacion: string;
  fecha_formateada: string;
  dia_semana: number;
}

export interface FechaFiltro {
  fecha_exacta: string;
  orden: string;
}

export interface FechaResponse {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filtro: FechaFiltro;
  data: FechaItem[];
}

// -----------------------
// USUARIOS ACTIVOS/INACTIVOS
// -----------------------
export interface UsuarioItem {
  _id: string;
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;

  ciudad: {
    id_ciudad: number;
    nombre: string;
    codigo_postal: string;
  };

  zona: {
    id_zona: string;
    nombre: string;
  };

  servicios: Array<{
    id_servicio: number;
    nombre: string;
    precio: number;
    descripcion?: string;
  }>;

  descripcion?: string;
}

export interface UsuariosResponse {
  success: boolean;
  total: number;
  data: UsuarioItem[];
}

// ------------------------------
// 🔹 TIPOS PARA FECHA POR RANGO
// ------------------------------
export interface FechaRangoItem {
  _id: string;
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;

  fecha_registro: string;

  ciudad: {
    id_ciudad: number;
    nombre: string;
    codigo_postal: string;
  };

  zona: {
    id_zona: string;
    nombre: string;
  };

  horarios_disponibles: Array<{
    id_horario: string;
    nombre: string;
  }>;

  especialidades: Array<{
    id_especialidad: number;
    nombre: string;
    _id: string;
  }>;

  servicios: Array<{
    id_servicio: number;
    nombre: string;
    precio: number;
  }>;

  descripcion: string;

  experiencia: Array<{
    id_especialidad: number;
    años_experiencia: number;
    nivel_experiencia: string;
    proyectos_completados: number;
    descripcion: string;
    certificaciones: string[];
    valoracion_promedio: number;
  }>;
}

export interface FechaRangoResponse {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filtro: {
    inicio: string;
    fin: string;
  };
  data: FechaRangoItem[];
}

// =====================================================================
// ============================ API ====================================
// =====================================================================

export const apiBusqueda = {
  // -----------------------
  // 🔥 FECHAS
  // -----------------------

  getFechaExacta: async (fecha_exacta: string): Promise<FechaResponse> => {
    const res = await axios.get<FechaResponse>(`${BASE}/fecha`, {
      params: { fecha_exacta },
    });
    return res.data;
  },

  getFechaRango: async (
    inicio: string,
    fin: string
  ): Promise<FechaRangoResponse> => {
    const res = await axios.get<FechaRangoResponse>(`${BASE}/fecha/rango`, {
      params: { inicio, fin },
    });
    return res.data;
  },

  // -----------------------
  // SERVICIOS
  // -----------------------
  getServicios: async (): Promise<ServiciosResponse> => {
    const res = await axios.get(`${BASE}/servicios/todos`);
    return res.data;
  },

  getServicioPorNombre: async (servicio: string) => {
    const res = await axios.get(`${BASE}/servicios`, {
      params: { servicio },
    });
    return res.data;
  },

  // -----------------------
  // ZONAS
  // -----------------------
  getZonas: async (): Promise<ZonasResponse> => {
    const res = await axios.get(`${BASE}/zona/todas`);
    return res.data;
  },

  // -----------------------
  // HORARIOS
  // -----------------------
  getHorarios: async (): Promise<HorariosResponse> => {
    const res = await axios.get(`${BASE}/disponibilidad/todas`);
    return res.data;
  },

  // -----------------------
  // ESTADOS (true/false)
  // -----------------------
  getEstados: async (): Promise<EstadosResponse> => {
    const res = await axios.get(`${BASE}/usuarios/activos/lista`);
    return res.data;
  },

  // -----------------------
  // USUARIOS ACTIVOS / INACTIVOS
  // -----------------------
  getUsuariosActivosDetalle: async (): Promise<UsuariosResponse> => {
    const res = await axios.get(`${BASE}/usuarios/activos/detalle`);
    return res.data;
  },

  getUsuariosInactivos: async (): Promise<UsuariosResponse> => {
    const res = await axios.get(`${BASE}/usuarios/inactivos/lista`);
    return res.data;
  },

  // -----------------------
  // EXPERIENCIA
  // -----------------------
  getExperiencia: async (
    params?: Record<string, string | number>
  ): Promise<ExperienciasResponse> => {
    const res = await axios.get(`${BASE}/experiencia`, { params });
    return res.data;
  },

  // -----------------------
  // PRECIO
  // -----------------------
  getPrecio: async (
    params?: Record<string, string | number>
  ): Promise<PrecioResponse> => {
    const res = await axios.get(`${BASE}/precio`, { params });
    return res.data;
  },

  getPrecioAvanzado: async (
    precio_min: number,
    precio_max: number
  ): Promise<PrecioResponse> => {
    const res = await axios.get(`${BASE}/precio`, {
      params: { precio_min, precio_max },
    });
    return res.data;
  },
};
