import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Tag, Plus, X } from 'lucide-react';

// Interfaces
interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'Activo' | 'No activo';
  imagen: string;
}

interface Promocion {
  descuento: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

const OfertasTrabajoProvider: React.FC = () => {
  // Estado inicial con datos de ejemplo
  const [ofertas, setOfertas] = useState<Oferta[]>([
    {
      id: 1,
      titulo: 'Instalación de Enchufes',
      descripcion: 'Cableado seguro para puntos de energía',
      estado: 'Activo',
      imagen: '/images/ofertas/electricidad.jpg'
    },
    {
      id: 2,
      titulo: 'Colocación de Pisos',
      descripcion: 'Instalación de cerámica',
      estado: 'No activo',
      imagen: '/images/ofertas/pisos.jpg'
    },
    {
      id: 3,
      titulo: 'Reparación de Grifos',
      descripcion: 'Detección y arreglo de goteras',
      estado: 'Activo',
      imagen: '/images/ofertas/griferia.jpg'
    },
    {
      id: 4,
      titulo: 'Pintura de Interiores',
      descripcion: 'Acabados profesionales para espacios',
      estado: 'Activo',
      imagen: '/images/ofertas/pintura.jpg'
    }
  ]);

  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [mostrarEliminar, setMostrarEliminar] = useState<boolean>(false);
  const [mostrarPromociones, setMostrarPromociones] = useState<boolean>(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
  const [cambiosPendientes, setCambiosPendientes] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Datos para promoción
  const [nuevaPromocion, setNuevaPromocion] = useState<Promocion>({
    descuento: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: ''
  });

  const ofertasPorPagina = 3;
  const totalPaginas = Math.ceil(ofertas.length / ofertasPorPagina);

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Calcular ofertas a mostrar
  const indiceInicio = (paginaActual - 1) * ofertasPorPagina;
  const indiceFin = indiceInicio + ofertasPorPagina;
  const ofertasActuales = ofertas.slice(indiceInicio, indiceFin);

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  const handleEditar = (oferta: Oferta) => {
    console.log('Editando oferta:', oferta.id);
    alert(`Redirigiendo al formulario de edición de: ${oferta.titulo}`);
  };

  const handlePromociones = (oferta: Oferta) => {
    setOfertaSeleccionada(oferta);
    setMostrarPromociones(true);
  };

  const handleEliminarClick = (oferta: Oferta) => {
    setOfertaSeleccionada(oferta);
    setMostrarEliminar(true);
  };

  const confirmarEliminacion = () => {
    if (!ofertaSeleccionada) return;
    
    setOfertas(ofertas.filter((o: Oferta) => o.id !== ofertaSeleccionada.id));
    setMostrarEliminar(false);
    setOfertaSeleccionada(null);
    setCambiosPendientes(true);
    
    // Ajustar página si es necesario
    if (ofertasActuales.length === 1 && paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleCrearPromocion = () => {
    if (!nuevaPromocion.descuento || !nuevaPromocion.fechaInicio || !nuevaPromocion.fechaFin) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    console.log('Promoción creada:', {
      ofertaId: ofertaSeleccionada?.id,
      ...nuevaPromocion
    });
    
    alert(`Promoción creada para: ${ofertaSeleccionada?.titulo}\nDescuento: ${nuevaPromocion.descuento}%`);
    
    setMostrarPromociones(false);
    setNuevaPromocion({ descuento: '', fechaInicio: '', fechaFin: '', descripcion: '' });
    setCambiosPendientes(true);
  };

  const handleNuevaOferta = () => {
    console.log('Redirigiendo a formulario de nueva oferta');
    alert('Redirigiendo al formulario de creación de nueva oferta');
  };

  const handleAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handleAtras = () => {
    if (cambiosPendientes) {
      if (window.confirm('Tienes cambios sin guardar. ¿Deseas salir?')) {
        console.log('Volviendo a vista anterior');
        alert('Volviendo a la vista anterior');
      }
    } else {
      console.log('Volviendo a vista anterior');
      alert('Volviendo a la vista anterior');
    }
  };

  const handleGuardar = () => {
    console.log('Guardando cambios');
    setCambiosPendientes(false);
    alert('Cambios guardados exitosamente');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Ofertas de Trabajo</h1>
          <button
            onClick={handleNuevaOferta}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Nueva Oferta
          </button>
        </div>

        {/* Lista de Ofertas */}
        <div className="space-y-4">
          {ofertasActuales.map((oferta: Oferta) => (
            <div
              key={oferta.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Imagen */}
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative bg-gray-200">
                  {imageErrors.has(oferta.id) ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">Imagen no disponible</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={oferta.imagen}
                      alt={oferta.titulo}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(oferta.id)}
                    />
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Título: <span className="font-semibold">{oferta.titulo}</span>
                      </h2>
                      <p className="text-gray-700 mb-3">
                        <span className="font-bold">Descripción:</span> {oferta.descripcion}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">Estado:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            oferta.estado === 'Activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {oferta.estado}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex sm:flex-col gap-2">
                      <button
                        onClick={() => handleEditar(oferta)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-none"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handlePromociones(oferta)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-none"
                      >
                        Promociones
                      </button>
                      <button
                        onClick={() => handleEliminarClick(oferta)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-none"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleAnterior}
              disabled={paginaActual === 1}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                paginaActual === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            <span className="text-gray-700 font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={handleSiguiente}
              disabled={paginaActual === totalPaginas}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                paginaActual === totalPaginas
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Siguiente
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Botones de navegación inferior */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={handleAtras}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            Atrás
          </button>

          <button
            onClick={handleGuardar}
            disabled={!cambiosPendientes}
            className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              cambiosPendientes
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {mostrarEliminar && ofertaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              ¿Deseas eliminar esta oferta permanentemente?
            </p>
            <p className="text-gray-900 font-semibold mb-6">
              &quot;{ofertaSeleccionada.titulo}&quot;
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarEliminar(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Promociones */}
      {mostrarPromociones && ofertaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Tag className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Nueva Promoción</h3>
              </div>
              <button
                onClick={() => setMostrarPromociones(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-700 mb-4">
              Oferta: <span className="font-bold">{ofertaSeleccionada.titulo}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descuento (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={nuevaPromocion.descuento}
                  onChange={(e) => setNuevaPromocion({...nuevaPromocion, descuento: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: 20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={nuevaPromocion.fechaInicio}
                  onChange={(e) => setNuevaPromocion({...nuevaPromocion, fechaInicio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={nuevaPromocion.fechaFin}
                  onChange={(e) => setNuevaPromocion({...nuevaPromocion, fechaFin: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={nuevaPromocion.descripcion}
                  onChange={(e) => setNuevaPromocion({...nuevaPromocion, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe los términos de la promoción..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarPromociones(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearPromocion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Crear Promoción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfertasTrabajoProvider;