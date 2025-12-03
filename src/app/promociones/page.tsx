"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const URL = "http://localhost:4000";
const ID_OFERTA = "67b123456789abcdef012345";

// --- TIPOS ---
interface Promocion {
  id: string;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

// --- COMPONENTE MODAL (CON BLOQUEO DE BOTÓN) ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Promocion) => void;
  promoEditar: Promocion | null;
}

const ModalPromocion: React.FC<ModalProps> = ({ isOpen, onClose, onSave, promoEditar }) => {
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");

  // Variable para verificar si sobrepasamos el límite
  const isOverLimit = descripcion.length > 100;

  // Cargar datos si estamos editando
  useEffect(() => {
    if (promoEditar) {
      setDescripcion(promoEditar.descripcion);
      setEstado(promoEditar.estado);
    } else {
      setDescripcion(""); // Limpiar si es nuevo
      setEstado("Activo");
    }
  }, [promoEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // 1. Validación: Verificar que no esté vacío
    if (!descripcion.trim()) {
      alert("Error: El campo de descripción no puede estar vacío.");
      return;
    }
    
    // (Ya no necesitamos validar >100 aquí porque el botón estará bloqueado)

    const nuevaPromo: Promocion = {
      id: promoEditar ? promoEditar.id : Date.now().toString(),
      descripcion,
      estado,
    };
    onSave(nuevaPromo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
        
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6">
          {promoEditar ? "Editar promoción." : "Crear nueva promoción."}
        </h2>
        
        <div className="space-y-6">
          {/* Campo Descripción */}
          <div>
            <label className="block text-xl font-bold text-black mb-2">
              Descripción promoción:
            </label>
            <textarea
              className={`w-full border rounded-lg p-3 text-lg resize-none h-32 focus:ring-2 focus:outline-none ${
                isOverLimit 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              // Quitamos maxLength={100} para permitir escribir y ver que se bloquea el botón
              placeholder="Escribe aquí la descripción..."
            />
            {/* Contador de caracteres */}
            <div className={`text-right text-sm mt-1 font-medium ${isOverLimit ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
              {descripcion.length}/100 caracteres
            </div>
          </div>
          
          {/* Radio Buttons */}
          <div className="flex items-center gap-6">
            <label className="text-xl font-bold text-black">¿Activa?</label>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="estadoPromocion" 
                    className="w-6 h-6 border-2 border-black rounded-full checked:bg-black appearance-none cursor-pointer"
                    checked={estado === "Activo"}
                    onChange={() => setEstado("Activo")}
                  />
                  {estado === "Activo" && (
                    <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full pointer-events-none"></div>
                  )}
                </div>
                <span className="text-xl text-black">Si</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="estadoPromocion" 
                    className="w-6 h-6 border-2 border-black rounded-full appearance-none cursor-pointer"
                    checked={estado === "Inactivo"}
                    onChange={() => setEstado("Inactivo")}
                  />
                  {estado === "Inactivo" && (
                     <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full pointer-events-none"></div>
                  )}
                </div>
                <span className="text-xl text-black">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-between gap-4 mt-8">
          <button 
            onClick={onClose} 
            className="w-1/2 py-3 bg-blue-600 text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition shadow"
          >
            Atrás
          </button>
          
          {/* BOTÓN GUARDAR CON LÓGICA DE BLOQUEO */}
          <button 
            onClick={handleSubmit} 
            disabled={isOverLimit} // Se bloquea si pasa de 100
            className={`w-1/2 py-3 rounded-lg text-xl font-bold transition shadow ${
              isOverLimit 
                ? "bg-gray-400 text-gray-100 cursor-not-allowed" // Estilo bloqueado
                : "bg-blue-600 text-white hover:bg-blue-700"     // Estilo normal
            }`}
          >
            {isOverLimit ? "Límite excedido" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL (Sin cambios) ---
export default function PromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promosEliminadas, setPromosEliminadas] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promoAEditar, setPromoAEditar] = useState<Promocion | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = promociones.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(promociones.length / itemsPorPagina);

  const abrirModalNueva = () => {
    setPromoAEditar(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (promo: Promocion) => {
    setPromoAEditar(promo);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const cargarPromos = async () => {
      try {
        const res = await fetch(`${URL}/api/los_vengadores/promociones/oferta/${ID_OFERTA}`);
        const data = await res.json();
    
        const promosFormateadas = data.map((p: any) => ({
          id: p._id,
          descripcion: p.descripcion,
          estado: p.activo ? "Activo" : "Inactivo",
        }));
    
        setPromociones(promosFormateadas);
      } catch (error) {
        console.error("Error cargando promociones:", error);
      }
    };
    
    cargarPromos();
  }, []);
    

  const eliminarPromocion = (id: number | string) => {
    if (!confirm("¿Estás seguro de eliminar esta promoción?")) return;

    if (id.toString().length === 24) {
      setPromosEliminadas([...promosEliminadas, id.toString()]);
    }

    setPromociones(promociones.filter(p => p.id !== id));
  };

  const guardarDesdeModal = async (promoGuardada: Promocion) => {
    if (promoAEditar) {
      setPromociones(prev =>
        prev.map(p => (p.id === promoGuardada.id ? promoGuardada : p))
      );
    } else {
      setPromociones(prev => [...prev, promoGuardada]);
    }
    setIsModalOpen(false);
  };
    
  const guardarCambiosEnBD = async () => {
    try {
        for (const id of promosEliminadas) {
            await fetch(`${URL}/api/los_vengadores/promociones/${id}`, { method: "DELETE" });
        }
        setPromosEliminadas([]);
    
        const promocionesActualizadas: Promocion[] = [];
    
        for (const promo of promociones) {
            if (promo.id.length === 24) {
                await fetch(`${URL}/api/los_vengadores/promociones/${promo.id}/descripcion`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ descripcion: promo.descripcion }),
                });
                await fetch(`${URL}/api/los_vengadores/promociones/${promo.id}/estado`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ activo: promo.estado === "Activo" }),
                });
                promocionesActualizadas.push(promo);
            } else {
                const nueva = await crearNuevaPromocion(promo);
                promocionesActualizadas.push(nueva);
            }
        }
    
        setPromociones(promocionesActualizadas);
        alert("Promociones guardadas en la BD");

    } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("Error al guardar los cambios en la base de datos.");
    }
  };
    
  const crearNuevaPromocion = async (promo: Promocion) => {
    const res = await fetch(`${URL}/api/los_vengadores/promociones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_ofertaTrabajo: ID_OFERTA,
        descripcion: promo.descripcion,
        activo: promo.estado === "Activo",
      }),
    });
    const data = await res.json();
    return { ...promo, id: data._id };
  };
    

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Promociones</h1>
          <button 
            onClick={abrirModalNueva}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition shadow-md"
          >
            Nueva Promoción
          </button>
        </div>

        <div className="space-y-4 mb-8 min-h-[300px]">
          {itemsActuales.length > 0 ? (
            itemsActuales.map((promo) => (
              <div key={promo.id} className="border-2 border-blue-600 rounded-lg p-4 flex justify-between items-center bg-white shadow-sm">
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-bold text-black text-lg">Descripción:</span>
                    <p className="text-gray-800 text-lg mt-1">{promo.descripcion}</p>
                  </div>
                  <div className="font-bold text-black text-lg">
                    Estado: <span className={`font-normal ${promo.estado === 'Activo' ? 'text-black' : 'text-black'}`}>{promo.estado}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 ml-4">
                  <button onClick={() => abrirModalEditar(promo)} className="w-12 h-12 border-2 border-blue-500 rounded flex items-center justify-center hover:bg-blue-50 transition">
                    <span className="text-2xl">✏️</span>
                  </button>
                  <button onClick={() => eliminarPromocion(promo.id)} className="w-12 h-12 border-2 border-blue-500 rounded flex items-center justify-center hover:bg-red-50 transition">
                    <span className="text-2xl">🗑️</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No hay promociones registradas.</p>
          )}
        </div>

        <div className="flex justify-end mb-8 items-center gap-4">
            <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className={`px-4 py-2 border rounded font-semibold transition ${paginaActual === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-blue-600 hover:bg-gray-100"}`}>
              Anterior
            </button>
            <span className="text-blue-600 font-semibold">Página {paginaActual} de {totalPaginas || 1}</span>
            <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas || totalPaginas === 0} className={`px-4 py-2 border rounded font-semibold transition ${paginaActual === totalPaginas || totalPaginas === 0 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-blue-600 hover:bg-gray-100"}`}>
              Siguiente
            </button>
        </div>

        <div className="flex justify-between items-center mt-10">
          <Link href="/">
            <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Atrás
            </button>
          </Link>
          <button onClick={guardarCambiosEnBD} className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg">
            Guardar
          </button>
        </div>

        <ModalPromocion isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={guardarDesdeModal} promoEditar={promoAEditar} />
      </div>
    </div>
  );
}