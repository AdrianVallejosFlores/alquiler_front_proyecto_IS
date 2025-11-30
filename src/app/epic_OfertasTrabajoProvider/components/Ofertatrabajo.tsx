import React, { useState, useEffect } from 'react';

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
  // Estado inicial con datos de ejemplo e imágenes EXACTAS del mockup
  const [ofertas, setOfertas] = useState<Oferta[]>([
    {
      id: 1,
      titulo: 'Instalación de Enchufes',
      descripcion: 'Cableado seguro para puntos de energía',
      estado: 'Activo',
      imagen: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&h=200&fit=crop&q=80'
    },
    {
      id: 2,
      titulo: 'Colocación de Pisos',
      descripcion: 'Instalación de cerámica',
      estado: 'No activo',
      imagen: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200&h=200&fit=crop&q=80'
    },
    {
      id: 3,
      titulo: 'Reparación de Grifos',
      descripcion: 'Detección y arreglo de goteras',
      estado: 'Activo',
      imagen: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop&q=80'
    },
    {
      id: 4,
      titulo: 'Instalación Eléctrica',
      descripcion: 'Cableado y conexiones eléctricas',
      estado: 'Activo',
      imagen: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=200&h=200&fit=crop&q=80'
    },
    {
      id: 5,
      titulo: 'Pintura de Interiores',
      descripcion: 'Acabados profesionales para espacios',
      estado: 'Activo',
      imagen: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop&q=80'
    },
    {
      id: 6,
      titulo: 'Reparación de Techos',
      descripcion: 'Arreglo y mantenimiento de techos',
      estado: 'No activo',
      imagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop&q=80'
    },
    {
      id: 7,
      titulo: 'Instalación de Ventanas',
      descripcion: 'Colocación de ventanas y marcos',
      estado: 'Activo',
      imagen: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=200&fit=crop&q=80'
    }
  ]);

  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [mostrarEliminar, setMostrarEliminar] = useState<boolean>(false);
  const [mostrarPromociones, setMostrarPromociones] = useState<boolean>(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
  const [cambiosPendientes, setCambiosPendientes] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Datos para promoción
  const [nuevaPromocion, setNuevaPromocion] = useState<Promocion>({
    descuento: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: ''
  });

  const ofertasPorPagina = 3;
  const totalPaginas = Math.ceil(ofertas.length / ofertasPorPagina);

  // Simular carga inicial (< 2 segundos como requiere el criterio 11)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Calcular ofertas a mostrar
  const indiceInicio = (paginaActual - 1) * ofertasPorPagina;
  const indiceFin = indiceInicio + ofertasPorPagina;
  const ofertasActuales = ofertas.slice(indiceInicio, indiceFin);

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
    
    // Ajustar página si es necesario (criterio 8)
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
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Ofertas de Trabajo</h1>
          <button
            onClick={handleNuevaOferta}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            Nueva Oferta
          </button>
        </div>

        {/* Lista de Ofertas */}
        <div className="space-y-4">
          {ofertasActuales.map((oferta: Oferta) => (
            <div
              key={oferta.id}
              className="border-4 border-blue-600 rounded-lg p-4 bg-white"
            >
              <div className="flex gap-4">
                {/* Imagen con borde */}
                <div className="shrink-0">
                  <div className="w-24 h-24 border-2 border-blue-600 rounded overflow-hidden bg-gray-100">
                    <img
                      src={oferta.imagen}
                      alt={oferta.titulo}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/200x200/3b82f6/ffffff?text=${encodeURIComponent(oferta.titulo.substring(0, 15))}`;
                      }}
                    />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <div className="mb-1">
                      <span className="font-bold text-black">Título: </span>
                      <span className="text-black">{oferta.titulo}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-black">Descripción: </span>
                      <span className="text-black">{oferta.descripcion}</span>
                    </div>
                    <div>
                      <span className="font-bold text-black">Estado: </span>
                      <span className="text-black">{oferta.estado}</span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditar(oferta)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md font-semibold text-sm transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handlePromociones(oferta)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md font-semibold text-sm transition-colors"
                    >
                      Promociones
                    </button>
                    <button
                      onClick={() => handleEliminarClick(oferta)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md font-semibold text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex items-center justify-end gap-4">
            <button
              onClick={handleAnterior}
              disabled={paginaActual === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginaActual === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Anterior
            </button>

            <span className="text-blue-600 font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={handleSiguiente}
              disabled={paginaActual === totalPaginas}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginaActual === totalPaginas
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Botones de navegación inferior - GUARDAR SIEMPRE EN AZUL */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={handleAtras}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-semibold transition-colors"
          >
            Atrás
          </button>

          <button
            onClick={handleGuardar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-semibold transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {mostrarEliminar && ofertaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
            
            <p className="text-gray-700 mb-2">
              ¿Deseas eliminar esta oferta permanentemente?
            </p>
            <p className="text-gray-900 font-semibold mb-6">
              &quot;{ofertaSeleccionada.titulo}&quot;
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarEliminar(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
              <h3 className="text-xl font-bold text-gray-800">Nueva Promoción</h3>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={nuevaPromocion.descripcion}
                  onChange={(e) => setNuevaPromocion({...nuevaPromocion, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe los términos de la promoción..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarPromociones(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearPromocion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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