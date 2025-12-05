// src/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/services/api.ts
import { Job } from "../interfaces/types";
import { normalizarEstado } from "../utils/helpers";

// Interfaz que representa la estructura del trabajo simulando el backend (MongoDB)
interface TrabajoBackend {
  _id: string;
  id_cliente?: { nombre: string };
  id_proveedor?: { nombre: string };
  cliente?: string;
  proveedor?: string;
  servicio?: string;
  fecha?: string; // ej. "2025-11-02"
  hora_inicio?: string; // ej. "09:00"
  hora_fin?: string; // ej. "11:00"
  estado?: string;
  descripcion?: string;
  descripcion_trabajo?: string;
  costo?: number;
  precio?: number;
  fechaISO?: string;
  horaInicio?: string;
  horaFin?: string;
  estadoTrabajo?: string;
  justificacion_cancelacion?: string;
  cancelado_por?: string;
}

// Convierte fecha y hora en formato ISO "YYYY-MM-DDTHH:MM:00"
function safeConvertToISO(fecha?: string, hora?: string): string {
  if (!fecha || !hora) return "";
  return `${fecha}T${hora}:00`;
}

// 🔹 MOCKS para PROVEEDOR (Héctor Abraham Coajera Rocha)
const MOCK_TRABAJOS_PROVEEDOR: TrabajoBackend[] = [
  {
    _id: "prov-job-1",
    id_cliente: { nombre: "María López" },
    id_proveedor: { nombre: "Héctor Abraham Coajera Rocha" },
    servicio: "Destapar lavaplatos de la cocina",
    fecha: "2025-10-09",
    hora_inicio: "09:00",
    hora_fin: "10:30",
    estado: "finalizado",
    descripcion_trabajo: "Lavaplatos obstruido, se realizó limpieza del sifón en U.",
    costo: 120,
  },
  {
    _id: "prov-job-2",
    id_cliente: { nombre: "Carlos Gutiérrez" },
    id_proveedor: { nombre: "Héctor Abraham Coajera Rocha" },
    servicio: "Instalar luces en la sala de estar",
    fecha: "2025-10-14",
    hora_inicio: "15:00",
    hora_fin: "17:00",
    estado: "pendiente",
    descripcion_trabajo: "Instalación de 4 focos LED empotrables y prueba de apagadores.",
    costo: 200,
  },
  {
    _id: "prov-job-3",
    id_cliente: { nombre: "Lucía Fernández" },
    id_proveedor: { nombre: "Héctor Abraham Coajera Rocha" },
    servicio: "Arreglar marco de puerta roto",
    fecha: "2025-10-12",
    hora_inicio: "11:00",
    hora_fin: "12:30",
    estado: "cancelado",
    descripcion_trabajo: "Reparación del marco astillado y ajuste de bisagras.",
    costo: 150,
    justificacion_cancelacion: "El cliente no se encontraba en el domicilio.",
    cancelado_por: "cliente",
  },
];

// 🔹 MOCKS para CLIENTE (por si la vista del cliente también usa este service)
const MOCK_TRABAJOS_CLIENTE: TrabajoBackend[] = [
  {
    _id: "cli-job-1",
    id_cliente: { nombre: "Cliente Demo" },
    id_proveedor: { nombre: "Héctor Abraham Coajera Rocha" },
    servicio: "Destapar lavaplatos de la cocina",
    fecha: "2025-10-09",
    hora_inicio: "09:00",
    hora_fin: "10:30",
    estado: "finalizado",
    descripcion_trabajo: "Trabajo completado sin inconvenientes.",
    costo: 120,
  },
  {
    _id: "cli-job-2",
    id_cliente: { nombre: "Cliente Demo" },
    id_proveedor: { nombre: "Héctor Abraham Coajera Rocha" },
    servicio: "Instalar luces en la sala de estar",
    fecha: "2025-10-14",
    hora_inicio: "15:00",
    hora_fin: "17:00",
    estado: "pendiente",
    descripcion_trabajo: "Instalación de 4 focos LED empotrables.",
    costo: 200,
  },
  {
    _id: "cli-job-3",
    id_cliente: { nombre: "Cliente Demo" },
    id_proveedor: { nombre: "Héctor Abraham Coajera Rocha" },
    servicio: "Arreglar marco de puerta roto",
    fecha: "2025-10-12",
    hora_inicio: "11:00",
    hora_fin: "12:30",
    estado: "cancelado",
    descripcion_trabajo: "Marco astillado por golpe.",
    costo: 150,
    justificacion_cancelacion: "El cliente canceló por motivos de fuerza mayor.",
    cancelado_por: "cliente",
  },
];

/**
 * 🔹 HU 1.7 – Trabajos por PROVEEDOR (solo MOCKS)
 */
export async function fetchTrabajosProveedor(
  proveedorId: string,
  estado?: string
): Promise<Job[]> {
  console.warn(
    "[MOCK] fetchTrabajosProveedor usando datos mock. proveedorId =",
    proveedorId,
    "estado =",
    estado
  );

  // Si quieres filtrar por estado (opcional)
  const filtrados = MOCK_TRABAJOS_PROVEEDOR.filter((t) => {
    if (!estado) return true;
    const estadoNorm = normalizarEstado(t.estado ?? t.estadoTrabajo ?? "");
    return estadoNorm === normalizarEstado(estado);
  });

  return filtrados.map((t) => ({
    id: t._id,
    clientName: t.id_cliente?.nombre ?? t.cliente ?? "",
    service: t.servicio ?? "",
    startISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_inicio ?? t.horaInicio),
    endISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_fin ?? t.horaFin),
    fechaISO: t.fecha ?? t.fechaISO,
    status: normalizarEstado(t.estado ?? t.estadoTrabajo ?? ""),
    description: t.descripcion_trabajo ?? t.descripcion ?? "",
    costo: t.costo ?? t.precio,
  }));
}

/**
 * 🔹 Trabajos por CLIENTE (también MOCK)
 */
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  console.warn("[MOCK] fetchTrabajosCliente usando datos mock. clienteId =", clienteId);

  return MOCK_TRABAJOS_CLIENTE.map((t) => ({
    id: t._id,
    providerName: t.id_proveedor?.nombre ?? t.proveedor ?? "",
    service: t.servicio ?? "",
    startISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_inicio ?? t.horaInicio),
    endISO: safeConvertToISO(t.fecha ?? t.fechaISO, t.hora_fin ?? t.horaFin),
    fechaISO: t.fecha ?? t.fechaISO,
    status: normalizarEstado(t.estado ?? t.estadoTrabajo ?? ""),
    description: t.descripcion_trabajo ?? t.descripcion ?? "",
    costo: t.costo ?? t.precio,
  }));
}
