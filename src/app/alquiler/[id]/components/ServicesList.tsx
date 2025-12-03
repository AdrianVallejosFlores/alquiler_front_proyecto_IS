import React from 'react';

import { Servicio } from '../types/usuario.types';

const ServicesList = ({ servicios }: { servicios?: Servicio[] }) => {
  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
          Servicios Ofrecidos
        </h3>
      </div>
      
      <div className="grid gap-4">
        {(servicios || []).map((s, i) => (
          <div key={i} className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex justify-between items-start gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-blue-600 dark:text-blue-400"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {s.nombre}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">
                    {s.descripcion}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Precio</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                  Bs. {Number(s.precio_personalizado ?? s.precio).toLocaleString('es-BO')}
                </div>
              </div>
            </div>
          </div>
        ))}
        {(servicios || []).length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="mx-auto mb-3 opacity-50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <p>No hay servicios registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;