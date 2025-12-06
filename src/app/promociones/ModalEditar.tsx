"use client";
import React, { useState, useEffect } from "react";

// Definimos qué datos recibe el modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, nuevaDescripcion: string) => void;
  promocionActual: { id: number; descripcion: string } | null;
}

export default function ModalEditar({ isOpen, onClose, onSave, promocionActual }: ModalProps) {
  const [descripcion, setDescripcion] = useState("");

  // Cada vez que se abre el modal con una nueva promo, actualizamos el texto
  useEffect(() => {
    if (promocionActual) {
      setDescripcion(promocionActual.descripcion);
    }
  }, [promocionActual]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Editar Promoción</h2>
        
        <label className="block text-gray-700 font-semibold mb-2">Descripción:</label>
        <textarea
          className="w-full border-2 border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:border-blue-500 resize-none"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (promocionActual) onSave(promocionActual.id, descripcion);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}