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

// --- COMPONENTE MODAL (Ventana Emergente) ---
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
    
    // Si promoEditar existe usamos su ID, si no, generamos uno temporal (Date.now)
    const nuevaPromo: Promocion = {
      id: promoEditar ? promoEditar.id : Date.now(),
      descripcion,
      estado,
    };
    onSave(nuevaPromo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {promoEditar ? "Editar Promoción" : "Nueva Promoción"}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: 10% de descuento..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Estado</label>
            <select
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
              value={estado}
              onChange={(e) => setEstado(e.target.value as "Activo" | "Inactivo")}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-bold">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function PromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>(datosIniciales);
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promoAEditar, setPromoAEditar] = useState<Promocion | null>(null);

  // Estados de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  // Lógica de Paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = promociones.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(promociones.length / itemsPorPagina);

  // --- HANDLERS ---

  // Abrir modal para crear
  const abrirModalNueva = () => {
    setPromoAEditar(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar (AQUÍ ESTABA EL FALTANTE)
  const abrirModalEditar = (promo: Promocion) => {
    setPromoAEditar(promo);
    setIsModalOpen(true);
  };

  // Guardar cambios del modal
  const guardarDesdeModal = (promoGuardada: Promocion) => {
    if (promoAEditar) {
      // Editar existente
      setPromociones(promociones.map(p => p.id === promoGuardada.id ? promoGuardada : p));
    } else {
      // Crear nueva (al principio de la lista)
      setPromociones([promoGuardada, ...promociones]);
    }
    setIsModalOpen(false);
  };

  // Eliminar
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
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Promociones</h1>
          <button 
            onClick={abrirModalNueva}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition shadow-md"
          >
            Nueva Promoción
          </button>
        </div>

        {/* Lista de Promociones */}
        <div className="space-y-4 mb-8 min-h-[300px]">
          {itemsActuales.length > 0 ? (
            itemsActuales.map((promo) => (
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
                    Estado: <span className={`font-normal ${promo.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>{promo.estado}</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-3 ml-4">
                  <button 
                    onClick={() => abrirModalEditar(promo)} // <--- AHORA SÍ TIENE EL ONCLICK
                    className="w-12 h-12 border-2 border-blue-500 rounded flex items-center justify-center hover:bg-blue-50 transition"
                  >
                    <span className="text-2xl">✏️</span>
                  </button>
                  <button 
                    onClick={() => eliminarPromocion(promo.id)}
                    className="w-12 h-12 border-2 border-blue-500 rounded flex items-center justify-center hover:bg-red-50 transition"
                  >
                    <span className="text-2xl">🗑️</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No hay promociones registradas.</p>
          )}
        </div>

        {/* Paginación */}
        <div className="flex justify-end mb-8 items-center gap-4">
            <button 
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className={`px-4 py-2 border rounded font-semibold transition ${
                paginaActual === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-blue-600 hover:bg-gray-100"
              }`}
            >
              Anterior
            </button>
            <span className="text-blue-600 font-semibold">
              Página {paginaActual} de {totalPaginas || 1}
            </span>
            <button 
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              className={`px-4 py-2 border rounded font-semibold transition ${
                paginaActual === totalPaginas || totalPaginas === 0 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-blue-600 hover:bg-gray-100"
              }`}
            >
              Siguiente
            </button>
        </div>

        {/* Botones Inferiores */}
        <div className="flex justify-between items-center mt-10">
          <Link href="/">
            <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Atrás
            </button>
          </Link>
          <button 
            onClick={() => alert("Aquí conectaríamos con el backend para guardar todo.")}
            className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Guardar
          </button>
        </div>

        {/* Modal Renderizado */}
        <ModalPromocion 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={guardarDesdeModal}
          promoEditar={promoAEditar}
        />
      </div>
    </div>
  );
}