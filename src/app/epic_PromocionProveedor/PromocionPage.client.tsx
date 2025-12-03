'use client';

import React, { useState } from 'react';
import CrearPromocion from './components/CrearPromocion';

type Promocion = {
  id: string;
  descripcion: string;
  activa: boolean;
};

type Props = {
  fixerId?: string; // lo dejamos opcional para poder reusarlo en varios sitios
};

const PromocionPageClient: React.FC<Props> = ({ fixerId }) => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const handleBackForm = () => {
    setMostrandoFormulario(false);
  };

  const handleSavePromocion = (description: string, isActive: boolean) => {
    const nueva: Promocion = {
      id: crypto.randomUUID(),
      descripcion: description,
      activa: isActive,
    };

    setPromociones((prev) => [...prev, nueva]);
    setMostrandoFormulario(false);
  };

  if (mostrandoFormulario) {
    return (
      <CrearPromocion
        onBack={handleBackForm}
        onSave={handleSavePromocion}
      />
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Promociones</h2>
          <p className="text-xs text-slate-500">
            Administra tus promociones activas e inactivas. Estas se mostrarán en tu perfil de proveedor.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrandoFormulario(true)}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
        >
          + Añadir promoción
        </button>
      </div>

      {promociones.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Aún no hay promociones registradas. Crea una promoción para destacar tus servicios.
        </p>
      ) : (
        <ul className="space-y-3">
          {promociones.map((promo) => (
            <li
              key={promo.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{promo.descripcion}</p>
                <p className="text-xs text-slate-500">
                  Estado: {promo.activa ? 'Activa' : 'Inactiva'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  promo.activa ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {promo.activa ? 'Activa' : 'Inactiva'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PromocionPageClient;