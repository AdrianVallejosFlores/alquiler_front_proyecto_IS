import React from 'react';
import { HighlightedText } from '@/app/alquiler/paginacion/components/HighlightedText';

type Props = {
  nombre?: string;
  servicios?: any[];
  activo?: boolean;
  fecha_registro?: string;
  avatarUrl?: string;
  rating?: number | string;
  searchTerms?: string[];
};

const ProfileHeader = ({ nombre, servicios, activo, fecha_registro, avatarUrl, rating, searchTerms = [] }: Props) => {
  const postedDate = fecha_registro ? new Date(fecha_registro).toLocaleDateString() : '';

  // Avatar: si no hay imagen, mostrar iniciales
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-10"></div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-lg opacity-30"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 text-blue-600 dark:text-blue-300 text-5xl font-bold select-none">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(nombre)}</span>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                  {searchTerms.length > 0 ? (
                    <HighlightedText text={nombre || 'Sin nombre'} searchTerms={searchTerms} />
                  ) : (
                    nombre || 'Sin nombre'
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg font-medium">
                  {searchTerms.length > 0 ? (
                    <HighlightedText text={(servicios && servicios.length > 0 && servicios[0].nombre) || 'Servicios'} searchTerms={searchTerms} />
                  ) : (
                    (servicios && servicios.length > 0 && servicios[0].nombre) || 'Servicios'
                  )}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 rounded-lg px-4 py-2 font-medium">
                Registrado: <span className="text-gray-700 dark:text-gray-200">{fecha_registro ? new Date(fecha_registro).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                activo 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 shadow-md' 
                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900 dark:to-rose-900 dark:text-red-300 shadow-md'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${activo ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                {activo ? 'Disponible' : 'No disponible'}
              </div>

              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900 px-4 py-2 rounded-full shadow-sm">
                <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <span className="font-bold text-amber-700 dark:text-amber-200 text-lg">{rating ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
