"use client";
import React, { useState } from "react";
import Link from "next/link";
import ModalEditar from "./ModalEditar"; // Asegúrate de que la ruta sea correcta

// Datos de prueba
const datosIniciales = [
  { id: 1, descripcion: "¡ 10% de descuento para clientes nuevos !", estado: "Activo" },
  { id: 2, descripcion: "Cotización en obra gratis", estado: "Activo" },
  { id: 3, descripcion: "¡ 20% de descuento para clientes antiguos !", estado: "Activo" },
];

export default function PromocionesPage() {
  const [promociones, setPromociones] = useState(datosIniciales);

  // --- ESTADOS PARA EL MODAL ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [promoSeleccionada, setPromoSeleccionada] = useState<{id: number, descripcion: string} | null>(null);

  // 1. Función para ABRIR el modal al dar click al lápiz
  const abrirModalEdicion = (promo: { id: number; descripcion: string }) => {
    setPromoSeleccionada(promo);
    setModalAbierto(true);
  };

  // 2. Función para GUARDAR los cambios que vienen del modal
  const guardarCambios = (id: number, nuevaDescripcion: string) => {
    const promocionesActualizadas = promociones.map((p) =>
      p.id === id ? { ...p, descripcion: nuevaDescripcion } : p
    );
    setPromociones(promocionesActualizadas);
    setModalAbierto(false); // Cerramos el modal
  };

  // Función de eliminar (la que ya tenías)
  const eliminarPromocion = (id: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta promoción?");
    if (confirm) {
      setPromociones(promociones.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Promociones</h1>  

          
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition shadow-md">
            Nueva Promoción
          </button>
                 
          

        </div>

        {/* Lista de Promociones */}
        <div className="space-y-4 mb-8">
          {promociones.map((promo) => (
            <div
              key={promo.id}
              className="border-2 border-blue-600 rounded-lg p-4 flex justify-between items-center bg-white shadow-sm"
            >
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-bold text-black text-lg">Descripción:</span>
                  <p className="text-gray-800 text-lg mt-1">{promo.descripcion}</p>
                </div>
                <div className="font-bold text-black text-lg">
                  Estado: <span className="font-normal">{promo.estado}</span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col gap-3 ml-4">
                {/* Botón Editar - AHORA CONECTADO */}
                <button 
                  onClick={() => abrirModalEdicion(promo)}
                  className="w-12 h-12 border-2 border-blue-500 rounded flex items-center justify-center hover:bg-blue-50 transition"
                >
                  <span className="text-2xl">✏️</span>
                </button>

                {/* Botón Eliminar */}
                <button 
                  onClick={() => eliminarPromocion(promo.id)}
                  className="w-12 h-12 border-2 border-blue-500 rounded flex items-center justify-center hover:bg-red-50 transition"
                >
                  <span className="text-2xl">🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ... (Paginación y botones inferiores siguen igual) ... */}
        
        <div className="flex justify-end mb-8 items-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded text-blue-600 font-semibold hover:bg-gray-100">Anterior</button>
            <span className="text-blue-600 font-semibold">Página 1 de 3</span>
            <button className="px-4 py-2 border border-gray-300 rounded text-blue-600 font-semibold hover:bg-gray-100">Siguiente</button>
        </div>

        <div className="flex justify-between items-center mt-10">
          <Link href="/">
            <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Atrás
            </button>
          </Link>
          <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg">
            Guardar
          </button>
        </div>

      </div>

      {/* AQUÍ INSERTAMOS EL COMPONENTE MODAL */}
      <ModalEditar 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarCambios}
        promocionActual={promoSeleccionada}
      />

    </div>
  );
}