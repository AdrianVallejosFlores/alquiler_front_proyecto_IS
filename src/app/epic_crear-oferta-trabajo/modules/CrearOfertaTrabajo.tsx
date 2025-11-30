"use client";
import React, { useState } from "react";
import InputFile from "../components/InputFile";
import { useCrearOferta } from "../hooks/useCrearOferta";
import { OfertaTrabajo } from "../interfaces/Oferta.interface";

export default function CrearOfertaTrabajo() {
  const { loading, mensaje, setMensaje, enviarOferta } = useCrearOferta();

  const [data, setData] = useState<OfertaTrabajo>({
    titulo: "",
    descripcion: "",
    fotoPortada: null,
    fotosExtra: [],
    activa: true,
  });

  const cambiar = (campo: keyof OfertaTrabajo, valor: string | boolean | File | File[]) =>
    setData((prev) => ({ ...prev, [campo]: valor }));

  const enviar = async () => {
    setMensaje(null);
    await enviarOferta(data);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 sm:p-8 md:p-10">
      {/* TÍTULO */}
      <h1 className="text-[#0C4FE9] Poppins text-3xl sm:text-4xl font-bold text-center mb-8">
        Crear nueva oferta de trabajo
      </h1>

      {/* FORMULARIO */}
      <div className="text-[17px] sm:text-[19px] Poppins leading-8">
        
        {/* Titulo */}
        <label className="font-bold">Titulo</label>
        <input
          type="text"
          className="w-full border rounded-md p-3 mt-1"
          value={data.titulo}
          onChange={(e) => cambiar("titulo", e.target.value)}
        />

        {/* Descripción */}
        <label className="font-bold mt-6 block">Descripción</label>
        <textarea
          className="w-full border rounded-md p-3 mt-1 h-32 resize-none"
          value={data.descripcion}
          onChange={(e) => cambiar("descripcion", e.target.value)}
        />

        {/* Foto Portada */}
        <InputFile
          id="portada"
          label="Foto portada"
          maxFiles={1} // Limita a una sola imagen
          onSelect={(files) => cambiar("fotoPortada", files[0])}
        />

        {/* Más fotos */}
        <InputFile
          id="fotosExtra"
          label="Más fotos"
          multiple
          maxFiles={5} // Limita a 5 imágenes
          onSelect={(files) => cambiar("fotosExtra", Array.from(files))}
        />

        {/* Activa */}
        <div className="flex items-center justify-between mt-6">
          <label className="font-bold text-[17px]">¿Activa?</label>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={data.activa === true}
                onChange={() => cambiar("activa", true)}
              />
              Si
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={data.activa === false}
                onChange={() => cambiar("activa", false)}
              />
              No
            </label>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div
            className={`mt-6 border px-4 py-3 rounded-md text-center text-[16px] ${
              mensaje.includes("Oferta creada correctamente") 
                ? "bg-[#DFFFE3] text-[#3DD45E]"  // Mensaje de éxito en verde
                : "bg-[#FFE3E3] text-[#FF4D4D]"  // Mensaje de error en rojo
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* Botones */}
        <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-[#0C4FE9] text-white w-full sm:w-40 py-3 rounded-lg Poppins font-semibold"
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={enviar}
            disabled={loading}
            className="bg-[#0C4FE9] text-white w-full sm:w-40 py-3 rounded-lg Poppins font-semibold disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
