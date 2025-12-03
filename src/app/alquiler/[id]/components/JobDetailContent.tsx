'use client';

import React from 'react';
import Link from 'next/link';
import ProfileHeader from './ProfileHeader';
import ServicesList from './ServicesList';
import PortfolioGrid from './PortfolioGrid';
import ReviewsList from './ReviewsList';
import BackToResults from './BackToResults';
import { Usuario } from '../types/usuario.types';

interface JobDetailContentProps {
  usuario: Usuario;
  postedDate: string;
  SERVER_ORIGIN: string;
  promedio?: number;
}

export default function JobDetailContent({
  usuario,
  postedDate,
  SERVER_ORIGIN,
  promedio,
}: JobDetailContentProps) {
  const avatar = usuario.portfolio?.[0]?.imagen;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <BackToResults className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a las ofertas
          </BackToResults>
        </div>

        <ProfileHeader
          nombre={usuario.nombre}
          servicios={usuario.servicios}
          activo={usuario.activo}
          fecha_registro={usuario.fecha_registro}
          avatarUrl={
            avatar && String(avatar).startsWith('http')
              ? String(avatar)
              : avatar
              ? `${SERVER_ORIGIN}${avatar}`
              : '/images/portfolio/placeholder.jpg'
          }
          rating={promedio ? Number(promedio.toFixed(1)) : undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex-shrink-0">
                  <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sobre el Profesional</h2>
              </div>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300 text-base">
                {usuario.descripcion ||
                  'Sin descripción. Este profesional no ha añadido una descripción todavía.'}
              </p>
            </div>

            <ServicesList servicios={usuario.servicios} />
            <PortfolioGrid portfolio={usuario.portfolio} serverOrigin={SERVER_ORIGIN} />
            <ReviewsList calificaciones={usuario.calificaciones} nombreUsuario={usuario.nombre} />
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-xl transition-shadow duration-300 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16.51 2.75h-1.34V2h-4.34v.75H7.49V2H6v20h12V2h-1.49v-.75zm-.01 18.5H7.5V7h9.01v14.25z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contactar</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5c0-1.1.9-2 2-2h3.28c.49 0 .95.29 1.16.75l2.05 4.45c.25.52.01 1.14-.51 1.38-.4.2-.82.03-1.02-.32L8.3 8.62c-.26.79-.26 1.63 0 2.42l1.56 2.7c.2.35.63.51 1.02.32.52-.24.76-.86.51-1.38L8.78 8.45c.22-.46.67-.75 1.16-.75H13c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5z"/></svg>
                  Solicitar Presupuesto
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.979 0-3.875.771-5.287 2.169C3.055 10.41 2.257 12.314 2.257 14.33c0 2.016.798 3.919 2.24 5.36 1.44 1.44 3.35 2.24 5.361 2.24h.006c2.016 0 3.917-.8 5.358-2.24 1.44-1.44 2.24-3.344 2.24-5.36 0-2.015-.8-3.92-2.24-5.361-1.44-1.397-3.344-2.169-5.358-2.169"/></svg>
                  WhatsApp
                </button>
                <button className="w-full border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54c-.4-.5-1.07-.5-1.48 0-.41.54-.41 1.39 0 1.93l2.2 2.62c.37.44.92.7 1.48.7.56 0 1.11-.26 1.48-.7l3.65-4.39c.41-.54.41-1.39 0-1.93-.41-.54-1.07-.54-1.48 0l-2.1 2.52z"/></svg>
                  Videollamada
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                  <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ubicación</h4>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {usuario.ciudad?.nombre || 'Sin ubicación'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                Registrado desde <span className="font-semibold text-gray-700 dark:text-gray-200">{postedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}