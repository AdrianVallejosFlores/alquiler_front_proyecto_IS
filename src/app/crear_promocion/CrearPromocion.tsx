import React, { useState } from 'react';

// Definición de las props del componente (opcional, pero buena práctica en TypeScript)
interface CrearPromocionProps {
  onBack: () => void; // Función a llamar al hacer clic en "Atrás"
  onSave: (description: string, isActive: boolean) => void; // Función a llamar al hacer clic en "Guardar"
}

const CrearPromocion: React.FC<CrearPromocionProps> = ({ onBack, onSave }) => {
  // Estado para la descripción de la promoción
  const [descripcion, setDescripcion] = useState('');
  // Estado para si la promoción está activa o no (por defecto, activa)
  const [activa, setActiva] = useState(true);

  // Manejador para el botón Guardar
  const handleSave = () => {
    // Aquí puedes agregar validación antes de llamar a onSave
    onSave(descripcion, activa);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-8">
      
      {/* Título - Replicando el estilo grande y azul */}
      <h1 className="text-3xl font-bold text-blue-600">Crear nueva promoción.</h1>
      
      {/* --- Sección de Descripción --- */}
      <div>
        <label htmlFor="descripcionPromocion" className="block text-xl font-bold text-gray-800 mb-2">
          Descripción promoción:
        </label>
        <textarea
          id="descripcionPromocion"
          rows={5}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out resize-none"
          placeholder="Escribe la descripción de la promoción aquí..."
        />
      </div>

      {/* --- Sección ¿Activa? --- */}
      <div className="space-y-4">
        <p className="text-xl font-bold text-gray-800">¿Activa?</p>
        <div className="flex items-center space-x-8">
          
          {/* Opción SI */}
          <label className="flex items-center cursor-pointer">
            {/* El input radio se oculta y se usa el span para el círculo de estilo */}
            <input 
              type="radio" 
              name="activa" 
              value="Si" 
              checked={activa === true} 
              onChange={() => setActiva(true)} 
              className="hidden" // Ocultamos el radio por defecto
            />
            <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition duration-150 ease-in-out ${activa ? 'border-blue-600 bg-white' : 'border-gray-400 bg-white'}`}>
                {activa && <span className="h-3 w-3 rounded-full bg-blue-600"></span>}
            </span>
            <span className="ml-2 text-lg text-gray-700">Si</span>
          </label>

          {/* Opción NO */}
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="activa" 
              value="No" 
              checked={activa === false} 
              onChange={() => setActiva(false)} 
              className="hidden" 
            />
            <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition duration-150 ease-in-out ${!activa ? 'border-blue-600 bg-white' : 'border-gray-400 bg-white'}`}>
                {!activa && <span className="h-3 w-3 rounded-full bg-blue-600"></span>}
            </span>
            <span className="ml-2 text-lg text-gray-700">No</span>
          </label>
          
        </div>
      </div>
      
      {/* --- Botones --- */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        
        {/* Botón Atrás (Fondo azul, un poco más claro, y sin sombra tan fuerte como Guardar) */}
        <button
          onClick={onBack}
          className="w-1/3 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          Atrás
        </button>

        {/* Botón Guardar (Fondo azul intenso y más prominente) */}
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