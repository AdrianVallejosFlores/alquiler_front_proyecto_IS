"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  diasSemanaCompletos,
  mesesNombres,
  type Horario,
} from "./constantes";
import { DisponibilidadAPIService, HorarioAPI, InfoProveedor } from "../services/disponibilidad-api.service";

interface HorarioProps {
  fechaSeleccionada: Date;
  proveedorId: string;
  infoProveedor: InfoProveedor;
  onVolver: () => void;
}

function formatearFecha(fecha: Date): string {
  const dia = fecha.getDate();
  const mes = mesesNombres[fecha.getMonth()];
  const diaSemana = diasSemanaCompletos[fecha.getDay()];
  return `${diaSemana} ${dia} de ${mes}`;
}

function getFechaKey(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Convertir formato del backend al formato del frontend
function convertirHorariosAPI(horariosAPI: HorarioAPI[]): Horario[] {
  return horariosAPI.map((h, index) => ({
    id: index + 1,
    horaInicio: h.horaInicio,
    horaFin: h.horaFin,
    costo: h.costoHora,
    moneda: "Bs/Hr."
  }));
}

const Horario: React.FC<HorarioProps> = ({ 
  fechaSeleccionada, 
  proveedorId, 
  // infoProveedor, // Ya no usamos esto visualmente para no repetir info, pero lo mantenemos en props por compatibilidad
  onVolver 
}) => {
  const router = useRouter();
  const fechaKey = getFechaKey(fechaSeleccionada);
  
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        setCargando(true);
        setError(null);
        setMensaje(null);

        console.log(`📅 Cargando horarios para ${proveedorId} en fecha ${fechaKey}`);
        
        const respuesta = await DisponibilidadAPIService.obtenerHorariosDia(
          proveedorId,
          fechaKey
        );

        if (respuesta.mensaje) {
          setMensaje(respuesta.mensaje);
          setHorarios([]);
        } else if (respuesta.horarios && respuesta.horarios.length > 0) {
          const horariosConvertidos = convertirHorariosAPI(respuesta.horarios);
          setHorarios(horariosConvertidos);
        } else {
          setMensaje("No hay horarios disponibles para esta fecha");
          setHorarios([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar horarios:", err);
        setError("No se pudieron cargar los horarios. Intenta más tarde.");
        setHorarios([]);
      } finally {
        setCargando(false);
      }
    };

    cargarHorarios();
  }, [proveedorId, fechaKey]);

  const solicitarTrabajo = () => {
    if (horarios.length === 0) return;

    const params = new URLSearchParams();
    params.set("date", fechaKey);

    horarios.forEach((h) => {
      params.append("s", `${h.horaInicio}-${h.horaFin}`);
    });

    router.push(`/solicitud-trabajo?${params.toString()}`);
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* 1. Título Simplificado */}
      <div className="mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Horarios disponibles
          </h3>
          <p className="text-slate-500 text-sm">
            Para el <span className="font-semibold text-blue-600">{formatearFecha(fechaSeleccionada)}</span>
          </p>
      </div>

      <div className="mb-8 min-h-[200px]">
        {/* Estado de carga */}
        {cargando ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-sm">Buscando espacios...</p>
          </div>
        ) : error ? (
          /* Estado de error */
          <div className="py-12 flex flex-col items-center justify-center text-red-500">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm font-medium text-center">{error}</p>
          </div>
        ) : mensaje || horarios.length === 0 ? (
          /* Estado sin resultados */
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="text-4xl mb-4 grayscale opacity-50">📅</div>
            <p className="text-sm text-center">{mensaje || "No hay huecos libres."}</p>
            <button onClick={onVolver} className="mt-4 text-blue-600 hover:underline text-sm">
              Buscar otra fecha
            </button>
          </div>
        ) : (
          /* ✅ Lista de Horarios */
          <>
            {/* Vista Desktop (Tabla limpia) */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                <div>Horario</div>
                <div className="text-center">Inicio</div>
                <div className="text-center">Fin</div>
                <div className="text-right">Tarifa</div>
              </div>

              <div className="space-y-2">
                {horarios.map((h, index) => (
                  <div
                    key={h.id}
                    className="grid grid-cols-4 gap-4 items-center p-3 rounded-lg border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-default"
                  >
                    <div className="text-blue-600 font-bold text-sm">
                      Opción {index + 1}
                    </div>
                    <div className="text-center text-slate-700 font-medium">
                      {h.horaInicio}
                    </div>
                    <div className="text-center text-slate-700 font-medium">
                      {h.horaFin}
                    </div>
                    <div className="text-right text-slate-900 font-bold">
                      {h.costo} <span className="text-xs text-slate-500 font-normal">{h.moneda}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vista Móvil (Tarjetas compactas) */}
            <div className="sm:hidden space-y-3">
              {horarios.map((h, index) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <div>
                    <div className="text-xs text-blue-600 font-bold mb-1">Opción {index + 1}</div>
                    <div className="text-slate-900 font-bold text-lg">
                      {h.horaInicio} - {h.horaFin}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900 font-bold">{h.costo}</div>
                    <div className="text-xs text-slate-500">{h.moneda}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={onVolver}
          className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={solicitarTrabajo}
          disabled={horarios.length === 0 || cargando}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Solicitar Trabajo
        </button>
      </div>
    </div>
  );
};

export default Horario;