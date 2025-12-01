"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- TIPOS ---
interface Promocion {
  id: number;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

// --- DATOS DE PRUEBA ---
const datosIniciales: Promocion[] = [
  { id: 1, descripcion: "¡ 10% de descuento para clientes nuevos !", estado: "Activo" },
  { id: 2, descripcion: "Cotización en obra gratis", estado: "Activo" },
  { id: 3, descripcion: "¡ 20% de descuento para clientes antiguos !", estado: "Activo" },
  { id: 4, descripcion: "Limpieza de jardines: 2x1 este fin de semana", estado: "Activo" },
  { id: 5, descripcion: "Revisión eléctrica básica gratuita", estado: "Inactivo" },
  { id: 6, descripcion: "Descuento del 15% en plomería de emergencia", estado: "Activo" },
  { id: 7, descripcion: "Instalación de aire acondicionado con 5% off", estado: "Activo" },
  { id: 8, descripcion: "Consulta de diseño de interiores gratis", estado: "Activo" },
  { id: 9, descripcion: "Mantenimiento de techos: 10% de descuento", estado: "Inactivo" },
  { id: 10, descripcion: "Pintura de fachadas: Paga 3 paredes, pinta 4", estado: "Activo" },
  { id: 11, descripcion: "Impermeabilización con garantía extendida", estado: "Activo" },
  { id: 12, descripcion: "Pack de reparación de muebles de madera", estado: "Inactivo" },
];

// --- COMPONENTE MODAL (DISEÑO ACTUALIZADO SEGÚN IMAGEN) ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Promocion) => void;
  promoEditar: Promocion | null;
}

const ModalPromocion: React.FC<ModalProps> = ({ isOpen, onClose, onSave, promoEditar }) => {
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");

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
    if (!descripcion.trim()) return alert("La descripción es obligatoria");
    
    const nuevaPromo: Promocion = {
      id: promoEditar ? promoEditar.id : Date.now(),
      descripcion,
      estado,
    };
    onSave(nuevaPromo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
        
        {/* Título: Azul y Grande */}
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
              className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          
          {/* Radio Buttons para ¿Activa? */}
          <div className="flex items-center gap-6">
            <label className="text-xl font-bold text-black">¿Activa?</label>
            
            <div className="flex items-center gap-6">
              {/* Opción SI */}
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="estadoPromocion" 
                    className="w-6 h-6 border-2 border-black rounded-full checked:bg-black appearance-none cursor-pointer"
                    checked={estado === "Activo"}
                    onChange={() => setEstado("Activo")}
                  />
                  {/* Pequeño punto interior para simular radio nativo customizado si se desea, o usar default */}
                  {estado === "Activo" && (
                    <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full pointer-events-none"></div>
                  )}
                </div>
                <span className="text-xl text-black">Si</span>
              </label>

              {/* Opción NO */}
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

        {/* Botones de Acción (Atrás y Guardar) */}
        <div className="flex justify-between gap-4 mt-8">
          <button 
            onClick={onClose} 
            className="w-1/2 py-3 bg-blue-600 text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition shadow"
          >
            Atrás
          </button>
          <button 
            onClick={handleSubmit} 
            className="w-1/2 py-3 bg-blue-600 text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition shadow"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL (Sin cambios mayores, solo integración) ---
export default function PromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>(datosIniciales);
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

  const guardarDesdeModal = (promoGuardada: Promocion) => {
    if (promoAEditar) {
      setPromociones(promociones.map(p => p.id === promoGuardada.id ? promoGuardada : p));
    } else {
      setPromociones([promoGuardada, ...promociones]);
    }
    setIsModalOpen(false);
  };

  const eliminarPromocion = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta promoción?")) {
      const nuevasPromociones = promociones.filter((p) => p.id !== id);
      setPromociones(nuevasPromociones);
      const nuevoTotalPaginas = Math.ceil(nuevasPromociones.length / itemsPorPagina);
      if (paginaActual > nuevoTotalPaginas && nuevoTotalPaginas > 0) {
        setPaginaActual(nuevoTotalPaginas);
      }
    }
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
          <button onClick={() => alert("Guardado global simulado")} className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg">
            Guardar
          </button>
        </div>

        <ModalPromocion isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={guardarDesdeModal} promoEditar={promoAEditar} />
      </div>
    </div>
  );
}