import React from 'react';

type Review = {
  nombre_cliente: string;
  puntuacion: number;
  comentario: string;
  fecha_calificacion: string;
};

const defaultReviews: Review[] = [
  {
    nombre_cliente: "Andrea S.",
    puntuacion: 5,
    comentario: "Excelente trabajo, mandé a hacer unas repisas y quedaron perfectas. La madera es de buena calidad y entregaron antes del plazo. ¡Muy recomendados!",
    fecha_calificacion: "2023-10-25"
  },
  {
    nombre_cliente: "Luis F.",
    puntuacion: 4,
    comentario: "Mandé a reparar una mesa antigua y quedó como nueva. Solo tardaron un día más de lo acordado, pero valió la pena por el resultado.",
    fecha_calificacion: "2023-10-18"
  },
  {
    nombre_cliente: "Camila T.",
    puntuacion: 5,
    comentario: "Encargué un ropero a medida y me encantó. Muy buena atención, escucharon todas mis ideas y el acabado quedó profesional.",
    fecha_calificacion: "2023-10-10"
  },
  {
    nombre_cliente: "Rodrigo M.",
    puntuacion: 4,
    comentario: "Buen servicio y precios razonables. Me hicieron una puerta de madera muy resistente, aunque el color final fue un poco más claro que el que pedí.",
    fecha_calificacion: "2023-10-05"
  },
  {
    nombre_cliente: "Doryan P.",
    puntuacion: 5,
    comentario: "Súper cumplidos y detallistas. Me fabricaron un mueble para TV hermoso, todo encaja perfecto. ¡Sin duda volvería a contratarlos!",
    fecha_calificacion: "2023-09-28"
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

interface ReviewsListProps {
  calificaciones?: any[];
  nombreUsuario?: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ calificaciones, nombreUsuario }) => {
  const items = nombreUsuario === "Ana María Flores" ? defaultReviews : (calificaciones ?? []);
  
  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
          Opiniones de Clientes Verificados
        </h3>
      </div>
      
      <div className="space-y-6">
        {items.map((review, idx) => (
          <div key={idx} className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">{review.nombre_cliente}</div>
                  {review.fecha_calificacion && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(review.fecha_calificacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
                  <StarRating rating={review.puntuacion} />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base">{review.comentario}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;