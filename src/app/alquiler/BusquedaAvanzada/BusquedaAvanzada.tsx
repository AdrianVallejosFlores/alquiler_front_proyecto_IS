"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { apiBusqueda } from "./busquedaAvanzada.api";

//
// ===== TIPOS =====
//

export interface Filtros {
  tipoServicio?: string;
  zona?: string;
  precioMin?: number;
  precioMax?: number;
  horario?: string;
  experiencia?: string;

  // 🟢 Nuevos para rango:
  fecha?: string;            // fecha exacta (opcional)
  fechaInicio?: string;      // inicio de rango
  fechaFin?: string;         // fin de rango

  activo?: string;
}

export type ResultItem = {
  id: string | number;
} & Record<string, unknown>;

type UnknownObject = Record<string, unknown>;

interface ServicioItem {
  id_servicio: number;
  nombre: string;
  descripcion?: string;
}

//
// ===== ENDPOINT PRINCIPAL =====
//

const BASE = "http://localhost:5000/api/borbotones/search/avanzada";

//
// ===== NORMALIZADORES =====
//

function normalizeToItems(arr: unknown): ResultItem[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((raw) => {
      if (raw && typeof raw === "object") {
        const o = raw as UnknownObject;

        const id =
          (o.id as string | number | undefined) ??
          (o.id_servicio as string | number | undefined) ??
          (o._id as string | number | undefined);

        if (id !== undefined) return { id, ...o };
      }
      return null;
    })
    .filter((x): x is ResultItem => x !== null);
}

//
// ===== HELPERS =====
//

function parseExp(exp?: string): Record<string, number> {
  if (!exp) return {};

  const r = exp.match(/(\d+)\s*a\s*(\d+)/i);
  if (r) return { años_min: parseInt(r[1], 10), años_max: parseInt(r[2], 10) };

  const mas = exp.match(/(\d+)\s*\+/);
  if (mas) return { años_min: parseInt(mas[1], 10) };

  const exact = exp.match(/^\d+$/);
  if (exact) return { años_min: parseInt(exp, 10) };

  return {};
}

function buildParams(f: Filtros): Record<string, string | number> {
  const qp: Record<string, string | number> = {};

  if (f.tipoServicio) qp.servicio = f.tipoServicio;
  if (f.zona) qp.zona = f.zona;
  if (f.horario) qp.turno = f.horario;

  // 🔥 NUEVO → parametros para rango
  if (f.fecha) qp.fecha_exacta = f.fecha;
  if (f.fechaInicio) qp.inicio = f.fechaInicio;
  if (f.fechaFin) qp.fin = f.fechaFin;

  if (f.precioMin !== undefined) qp.precio_min = f.precioMin;
  if (f.precioMax !== undefined) qp.precio_max = f.precioMax;

  Object.assign(qp, parseExp(f.experiencia));

  if (f.activo !== undefined) qp.activo = f.activo;

  return qp;
}

//
// ===== INTERSECCIÓN =====
//

function intersectById(lists: ResultItem[][]): ResultItem[] {
  if (lists.length === 0) return [];
  if (lists.length === 1) return lists[0];

  const sets = lists.map((arr) => new Set(arr.map((x) => String(x.id))));

  const commonIds = [...sets[0]].filter((id) =>
    sets.every((s) => s.has(id))
  );

  const index = new Map<string, ResultItem>();
  lists.flat().forEach((it) => index.set(String(it.id), it));

  return commonIds
    .map((id) => index.get(id))
    .filter((x): x is ResultItem => Boolean(x));
}

//
// ===== BÚSQUEDA PRINCIPAL =====
//

async function buscarConInterseccion(f: Filtros): Promise<ResultItem[]> {
  const params = buildParams(f);
  const requests: Array<Promise<unknown>> = [];

  // SERVICIO
  if (f.tipoServicio) {
    requests.push(
      apiBusqueda.getServicioPorNombre(f.tipoServicio).then((r) => r)
    );
  }

  // PRECIO AVANZADO
  if (f.precioMin !== undefined && f.precioMax !== undefined) {
    requests.push(apiBusqueda.getPrecioAvanzado(f.precioMin, f.precioMax));
  }

  // 🔥 FECHA EXACTA O RANGO
  if (f.fechaInicio && f.fechaFin) {
    requests.push(apiBusqueda.getFechaRango(f.fechaInicio, f.fechaFin));
  } else if (f.fecha) {
    requests.push(apiBusqueda.getFechaExacta(f.fecha));
  }

  // DISPONIBILIDAD
  if (f.horario) {
    requests.push(
      axios.get(`${BASE}/disponibilidad`, { params }).then((r) => r.data)
    );
  }

  // ZONA
  if (f.zona) {
    requests.push(
      axios.get(`${BASE}/zona`, { params }).then((r) => r.data)
    );
  }

  // EXPERIENCIA
  if (f.experiencia) {
    requests.push(
      axios.get(`${BASE}/experiencia`, { params }).then((r) => r.data)
    );
  }

  // ESTADO
  if (f.activo !== undefined) {
    if (f.activo === "true") {
      requests.push(apiBusqueda.getUsuariosActivosDetalle());
    } else {
      requests.push(apiBusqueda.getUsuariosInactivos());
    }
  }

  // SIN FILTROS
  if (requests.length === 0) {
    requests.push(
      axios.get(`${BASE}/servicios/todos`).then((r) => r.data)
    );
  }

  const responses = await Promise.all(requests);

  const lists = responses.map((resp) => {
    if (!resp || typeof resp !== "object") return [];

    const d = resp as UnknownObject;

    let arrayKey: string | undefined;

    if ("servicios_encontrados" in d && Array.isArray(d.servicios_encontrados)) {
      arrayKey = "servicios_encontrados";
    } else if ("data" in d && Array.isArray(d.data)) {
      arrayKey = "data";
    } else {
      arrayKey = Object.keys(d).find((k) => Array.isArray(d[k]));
    }

    if (!arrayKey) return [];

    const arr = d[arrayKey];
    if (!Array.isArray(arr)) return [];

    return normalizeToItems(arr);
  });

  return intersectById(lists);
}

//
// ===== COMPONENTE =====
//

interface Props {
  onAplicarFiltros: (f: Filtros, r?: ResultItem[]) => void;
  onLimpiarFiltros?: () => void;
  onToggle?: (abierta: boolean) => void;   // ✅ AGREGAR ESTA LÍNEA
}


const BusquedaAvanzada: React.FC<Props> = ({
  onAplicarFiltros,
  onLimpiarFiltros,
}) => {
  const [filtros, setFiltros] = useState<Filtros>({});
  const [zonas, setZonas] = useState<string[]>([]);
  const [turnos, setTurnos] = useState<string[]>([]);
  const [estadosActivos, setEstadosActivos] = useState<boolean[]>([]);
  const [expand, setExpand] = useState(false);

  //
  // ===== CARGA DE DATOS =====
  //

  useEffect(() => {
    const loadZonas = async () => {
      try {
        const data = await apiBusqueda.getZonas();
        if (Array.isArray(data.zonas)) setZonas(data.zonas);
      } catch {
        setZonas([]);
      }
    };

    const loadHorarios = async () => {
      try {
        const data = await apiBusqueda.getHorarios();
        if (Array.isArray(data.turnos)) setTurnos(data.turnos);
        else if (Array.isArray(data.horarios)) setTurnos(data.horarios);
      } catch {
        setTurnos([]);
      }
    };

    const loadEstados = async () => {
      try {
        const data = await apiBusqueda.getEstados();
        if (Array.isArray(data.activos)) setEstadosActivos(data.activos);
      } catch {
        setEstadosActivos([]);
      }
    };

    loadZonas();
    loadHorarios();
    loadEstados();
  }, []);

  //
  // ===== HANDLERS =====
  //

  const handleChange = (campo: keyof Filtros, valor: string): void => {
    if (
      (campo === "precioMin" || campo === "precioMax") &&
      valor &&
      !/^\d+$/.test(valor)
    )
      return;

    setFiltros((prev) => ({
      ...prev,
      [campo]:
        campo === "precioMin" || campo === "precioMax"
          ? Number(valor)
          : valor,
    }));
  };

  const aplicar = async (): Promise<void> => {
    const res = await buscarConInterseccion(filtros);
    onAplicarFiltros(filtros, res);
  };

  const limpiar = (): void => {
    setFiltros({});
    onLimpiarFiltros?.();
  };

  const hayFiltros = Object.values(filtros).some(
    (v) => v !== "" && v !== undefined
  );

  //
  // ===== UI =====
  //

  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
      <div className="flex justify-end border-b pb-3">
        <button
          className="text-blue-600 font-medium"
          onClick={() => setExpand((prev) => !prev)}
        >
          Búsqueda avanzada {expand ? "▲" : "▼"}
        </button>
      </div>

      {/* CONTENIDO EXPANDIBLE */}
      <div
        className={`transition-all overflow-hidden ${
          expand ? "max-h-[1200px] mt-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-wrap gap-4 justify-between mt-4">

          {/* Tipo Servicio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Tipo de servicio</label>
            <input
              type="text"
              placeholder="Ej: Limpieza, Electricidad..."
              value={filtros.tipoServicio || ""}
              onChange={(e) => handleChange("tipoServicio", e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

          {/* Zona */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Zona</label>
            <select
              value={filtros.zona || ""}
              onChange={(e) => handleChange("zona", e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">Selecciona...</option>
              {zonas.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Precio (mín - máx)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Mín"
                value={filtros.precioMin ?? ""}
                onChange={(e) => handleChange("precioMin", e.target.value)}
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Máx"
                value={filtros.precioMax ?? ""}
                onChange={(e) => handleChange("precioMax", e.target.value)}
                className="p-2 border rounded-lg w-full"
              />
            </div>
          </div>

           {/* Estado */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Estado</label>
            <select
              value={filtros.activo || ""}
              onChange={(e) => handleChange("activo", e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">Selecciona...</option>
              {estadosActivos.map((estado, i) => (
                <option key={i} value={String(estado)}>
                  {estado ? "Activo" : "Inactivo"}
                </option>
              ))}
            </select>
          </div>

             {/* Experiencia */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Experiencia (años)</label>
            <input
              type="text"
              placeholder="Ej: 5, 3 a 7, 10+"
              value={filtros.experiencia || ""}
              onChange={(e) => handleChange("experiencia", e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
            
          {/* FECHA INICIO */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Fecha inicio</label>
            <input
              type="date"
              value={filtros.fechaInicio || ""}
              onChange={(e) => handleChange("fechaInicio", e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

          {/* FECHA FIN */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm">Fecha fin</label>
            <input
              type="date"
              value={filtros.fechaFin || ""}
              onChange={(e) => handleChange("fechaFin", e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

         

        

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 w-full">
            <button
              onClick={aplicar}
              disabled={!hayFiltros}
              className={`px-5 py-2 rounded-lg text-white ${
                hayFiltros ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              buscar
            </button>

            <button
              onClick={limpiar}
              disabled={!hayFiltros}
              className={`px-5 py-2 rounded-lg ${
                hayFiltros ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusquedaAvanzada;
