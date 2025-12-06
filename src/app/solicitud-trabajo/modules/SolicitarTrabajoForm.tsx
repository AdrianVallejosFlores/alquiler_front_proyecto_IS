"use client";

import { useState } from "react";
import TimeInput from "../components/CampoHora";
import { useSolicitudTrabajo } from "../hooks/useSolicitudTrabajo";
import { IFranjaDisponible } from "../interfaces/Solicitud.interface";

type Props = {
  franjas: IFranjaDisponible[];
  date: string; // Asegúrate de que date sea pasado correctamente a este componente
  providerId: string;
};

export default function SolicitarTrabajoForm({ franjas, date, providerId }: Props) {
  const [horaInicio, setHoraInicio] = useState(""); // "" = sin seleccionar
  const [horaFin, setHoraFin] = useState("");
  const [descripcion, setDescripcion] = useState(""); // Nuevo campo Descripción
  const [costo, setCosto] = useState(""); // Nuevo campo Costo
  const [categoria, setCategoria] = useState(""); // Nuevo campo Categoría

  // Errores por campo (mensajes personalizados)
  const [errorInicio, setErrorInicio] = useState("");
  const [errorFin, setErrorFin] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState(""); // Error de Descripción
  const [errorCosto, setErrorCosto] = useState(""); // Error de Costo
  const [errorCategoria, setErrorCategoria] = useState(""); // Error de Categoría
  const [errorGeneral, setErrorGeneral] = useState(""); // nuevo mensaje general

  const { loading, mensaje, setMensaje, enviar } = useSolicitudTrabajo(
    franjas,
    date,
    providerId
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrorInicio("");
    setErrorFin("");
    setErrorDescripcion(""); // Limpiar error de descripción
    setErrorCosto(""); // Limpiar error de costo
    setErrorCategoria(""); // Limpiar error de categoría
    setErrorGeneral("");

    // 🟡 Nueva validación: ambos campos vacíos
    if (!horaInicio && !horaFin) {
      setErrorGeneral("Debe seleccionar todos los campos para solicitar el trabajo");
      return;
    }

    // Validaciones personalizadas
    if (!horaInicio) {
      setErrorInicio("Debe seleccionar una hora inicio para solicitar el trabajo");
      return;
    }

    if (!horaFin) {
      setErrorFin("Debe seleccionar una hora fin para solicitar el trabajo");
      return;
    }

    if (!descripcion) {
      setErrorDescripcion("Debe ingresar una descripción para el trabajo");
      return;
    }

    // Verificar que la descripción no contenga números ni caracteres especiales
    if (/\d/.test(descripcion)) {
      setErrorDescripcion("La descripción no debe contener números");
      return;
    }

    // Verificar que la descripción no exceda los 200 caracteres
    if (descripcion.length > 200) {
      setErrorDescripcion("La descripción no debe exceder los 200 caracteres");
      return;
    }

    // Validación de costo
    if (!costo || isNaN(Number(costo))) {
      setErrorCosto("Debe ingresar un costo válido en Bs");
      return;
    }

    // Validación de categoría
    if (!categoria) {
      setErrorCategoria("Debe ingresar una categoría para el trabajo");
      return;
    }

    // Verificar que la categoría no contenga números ni caracteres especiales
    if (/\d/.test(categoria)) {
      setErrorCategoria("La categoría no debe contener números");
      return;
    }

    // Verificar que la categoría no exceda los 100 caracteres
    if (categoria.length > 100) {
      setErrorCategoria("La categoría no debe exceder los 100 caracteres");
      return;
    }

    // Enviar el payload, incluyendo 'date'
    await enviar({ horaInicio, horaFin, descripcion, costo: Number(costo), categoria, date });
  };

  // 🎨 Estilos dinámicos del mensaje inferior según su contenido
  const getMessageStyles = () => {
    if (!mensaje) return "";
    const msg = mensaje.toLowerCase();

    // ✅ Éxito
    if (msg.includes("enviada") || msg.includes("confirmada") || msg.includes("éxito")) {
      return "border-green-300 bg-green-100 text-green-800";
    }

    // ❌ Error
    if (
      msg.includes("no disponible") ||
      msg.includes("reservado") ||
      msg.includes("error") ||
      msg.includes("hora fin debe ser mayor")
    ) {
      return "border-red-300 bg-red-100 text-red-700";
    }

    // ⚠️ Advertencia
    if (msg.includes("debe seleccionar") || msg.includes("selecciona")) {
      return "border-yellow-300 bg-yellow-100 text-yellow-800";
    }

    // Neutro
    return "border-gray-300 bg-gray-50 text-gray-600";
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
      {/* Hora Inicio */}
      <div className="flex flex-col">
        <TimeInput
          label="Hora Inicio"
          value={horaInicio}
          onChange={(e) => {
            setHoraInicio(e.target.value);
            setHoraFin("");
            setErrorInicio("");
            setErrorFin("");
            setErrorGeneral("");
            if (mensaje) setMensaje("");
          }}
          step={1800}
          disabled={loading}
        />
        {errorInicio && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorInicio}</p>
        )}
      </div>

      {/* Hora Fin */}
      <div className="flex flex-col">
        <TimeInput
          label="Hora Fin"
          value={horaFin}
          onChange={(e) => {
            setHoraFin(e.target.value);
            setErrorFin("");
            setErrorInicio("");
            setErrorGeneral("");
            if (mensaje) setMensaje("");
          }}
          step={1800}
          disabled={loading}
        />
        {errorFin && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorFin}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm Poppins">Descripción del trabajo</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 mt-1 h-12 sm:h-11 text-base sm:text-[15px] focus:ring-2 focus:ring-blue-600 outline-none text-black bg-white"
          maxLength={200} // Limitar a 200 caracteres
        />
        {errorDescripcion && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorDescripcion}</p>
        )}
      </div>

      {/* Costo */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm Poppins">Costo (Bs)</label>
        <input
          type="number"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 mt-1 h-12 sm:h-11 text-base sm:text-[15px] focus:ring-2 focus:ring-blue-600 outline-none text-black bg-white"
        />
        {errorCosto && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorCosto}</p>
        )}
      </div>

      {/* Categoría */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm Poppins">Categoría</label>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 mt-1 h-12 sm:h-11 text-base sm:text-[15px] focus:ring-2 focus:ring-blue-600 outline-none text-black bg-white"
          maxLength={100} // Limitar a 100 caracteres
        />
        {errorCategoria && (
          <p className="text-red-500 text-sm mt-1 text-center">{errorCategoria}</p>
        )}
      </div>

      {/* 🔹 Nuevo mensaje general si ambos campos están vacíos */}
      {errorGeneral && (
        <p className="text-red-500 text-sm mt-1 text-center">{errorGeneral}</p>
      )}

      {/* Botón principal */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins rounded-lg mt-1 sm:mt-2 h-12 sm:h-11 disabled:opacity-70"
      >
        {loading ? "Enviando…" : "Enviar Solicitud"}
      </button>

      {/* Botón Atrás */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="w-full bg-[#0C4FE9] hover:bg-blue-700 text-white Poppins rounded-lg h-12 sm:h-11"
        aria-label="Volver a la página anterior"
      >
        Atrás
      </button>

      {/* Mensaje inferior dinámico */}
      {!!mensaje && (
        <div
          className={`w-full text-center rounded-lg border text-sm px-4 py-3 mt-2 Poppins font-medium ${getMessageStyles()}`}
        >
          {mensaje}
        </div>
      )}
    </form>
  );
}