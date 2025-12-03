'use client';

import React, { useState } from 'react';

// Definición de las props del componente
interface CrearPromocionProps {
  onBack: () => void;
  onSave: (description: string, isActive: boolean) => void;
}

// Constante para el límite de caracteres (100)
const MAX_CARACTERES = 100;

const CrearPromocion: React.FC<CrearPromocionProps> = ({ onBack, onSave }) => {
  const [descripcion, setDescripcion] = useState('');
  // Inicializado en null para indicar que ninguna opción ha sido seleccionada
  const [activa, setActiva] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDescripcionChange = (value: string) => {
    setDescripcion(value);
    if (error) {
      setError(null);
    }
  };

  const handleSave = () => {
    setError(null);

    const trimmedDescripcion = descripcion.trim();
    const currentLength = trimmedDescripcion.length;

    // 1. Validación de Descripción Vacía
    if (trimmedDescripcion === '') {
      setError('No se puede guardar, debe especificar la descripción de la promoción.');
      return;
    }

    // 2. Validación de Límite de Caracteres (100)
    if (currentLength > MAX_CARACTERES) {
      setError(`No se puede guardar, la descripción no puede tener más de ${MAX_CARACTERES} caracteres.`);
      return;
    }

    // 3. Validación de Opción Activa (Debe ser true o false, no null)
    if (activa === null) {
      setError('No se puede guardar, debe indicar si la promoción estará activa o no.');
      return;
    }

    // Si todas las validaciones pasan
    onSave(trimmedDescripcion, activa as boolean);
  };

  const descripcionLength = descripcion.length;
  const isOverLimit = descripcionLength > MAX_CARACTERES;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-blue-600">Crear nueva promoción</h1>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label
          htmlFor="descripcionPromocion"
          className="block text-xl font-bold text-gray-800 mb-2"
        >
          Descripción promoción:
        </label>
        <textarea
          id="descripcionPromocion"
          rows={5}
          value={descripcion}
          onChange={(e) => handleDescripcionChange(e.target.value)}
          className={`w-full px-3 py-2 text-gray-700 border ${
            isOverLimit ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out resize-none`}
          placeholder="Escribe la descripción de la promoción aquí..."
        />

        {/* Contador de caracteres */}
        <div
          className={`text-sm mt-1 text-right ${
            isOverLimit ? 'text-red-500 font-bold' : 'text-gray-500'
          }`}
        >
          {descripcionLength}/{MAX_CARACTERES} caracteres
        </div>
      </div>

      {/* ¿Activa? */}
      <div className="space-y-4">
        <p className="text-xl font-bold text-gray-800">¿Activa?</p>
        <div className="flex items-center space-x-8">
          {/* Opción SI */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="activa"
              value="Si"
              checked={activa === true}
              onChange={() => {
                setActiva(true);
                setError(null);
              }}
              className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-lg text-gray-700">Sí</span>
          </label>

          {/* Opción NO */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="activa"
              value="No"
              checked={activa === false}
              onChange={() => {
                setActiva(false);
                setError(null);
              }}
              className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-lg text-gray-700">No</span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="w-1/3 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          Atrás
        </button>

        <button
          onClick={handleSave}
          className="w-1/3 py-2 px-4 bg-blue-700 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default CrearPromocion;