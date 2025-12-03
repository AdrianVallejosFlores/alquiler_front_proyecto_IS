'use client';
// pages/promociones/crear.tsx
import CrearPromocion from '../crear_promocion/CrearPromocion';
import { NextPage } from 'next';

const CrearPromocionPage: NextPage = () => {
  
  const handleBack = () => {
    console.log('Navegar hacia atrás, tal vez usando router.back() de Next.js');
    // Ejemplo: router.back();
  };

  const handleSave = (description: string, isActive: boolean) => {
    console.log('Datos a guardar:', { description, isActive });
    // Aquí llamarías a una API para guardar la promoción
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-10">
      <CrearPromocion onBack={handleBack} onSave={handleSave} />
    </div>
  );
};

export default CrearPromocionPage;