'use client';

export default function PromotionsList({ fixerId }: { fixerId?: string }) {
  
  // El texto de la única promoción
  const promoTitle = "¡50% de Descuento!";

  return (
    // Quitamos el 'border-t' y reducimos el margen superior (mt-4 en lugar de mt-10)
    <section className="mt-6 w-full flex flex-col items-start">
      
      {/* Contenedor principal sin bordes extraños */}
      <div className="w-full">
        
        {/* Título azul más pegado al contenido */}
        <h3 className="text-2xl font-bold text-blue-600 mb-2">
          Promociones:
        </h3>

        {/* Recuadro de la promoción */}
        <div className="border-2 border-black bg-white p-4 w-full flex items-center shadow-sm">
          <p className="font-bold text-black text-lg">
            {promoTitle}
          </p>
        </div>

      </div>
    </section>
  );
}