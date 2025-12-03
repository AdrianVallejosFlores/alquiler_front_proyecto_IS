import React from 'react';

const resolveImage = (imagen: string | undefined) => {
  if (!imagen) return '/images/portfolio/placeholder.jpg';
  // Si la imagen ya comienza con http o https, usarla directamente
  if (imagen.startsWith('http')) return imagen;
  // Si la imagen comienza con / es una ruta desde public
  if (imagen.startsWith('/')) return imagen;
  // Si no, asumimos que está en la carpeta de carpinteria
  return `/images/portfolio/carpinteria/${imagen}`;
};

import Image from 'next/image';

const defaultImages = [
  {
    id: 1,
    imagen: '/images/portfolio/carpinteria/restauracion-silla.jpg',
    titulo: 'Restauración de Silla Clásica',
    descripcion: 'Trabajo detallado de restauración completa, incluyendo lijado, refuerzo de estructura y acabado barnizado.'
  },
  {
    id: 2,
    imagen: '/images/portfolio/carpinteria/mueble-modular.jpg',
    titulo: 'Mueble Modular en Proceso',
    descripcion: 'Construcción de mueble modular personalizado mostrando la calidad del trabajo interno y estructural.'
  },
  {
    id: 3,
    imagen: '/images/portfolio/carpinteria/mesa-comedor.jpg',
    titulo: 'Mesa de Comedor de Madera Maciza',
    descripcion: 'Fabricación de mesa robusta en madera noble con acabado premium y barniz protector.'
  },
  {
    id: 4,
    imagen: '/images/portfolio/carpinteria/set-sillas.jpg',
    titulo: 'Set de Sillas de Madera',
    descripcion: 'Conjunto de sillas a medida con diseño elegante y acabado en barniz brillante.'
  }
];

import { Portfolio } from '../types/usuario.types';

const PortfolioGrid = ({ portfolio, serverOrigin }: { portfolio?: Portfolio[]; serverOrigin: string }) => {
  const items = portfolio?.length ? portfolio : defaultImages;
  
  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
          Portafolio y Proyectos
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.map((p, idx) => (
          <div key={idx} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 aspect-video hover:shadow-xl transition-all duration-500 hover:border-blue-300 dark:hover:border-blue-600">
            <div className="relative w-full h-full">
              <Image 
                src={resolveImage(p.imagen)}
                alt={p.titulo || `Proyecto de decoración ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx < 2}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h4 className="text-lg font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{p.titulo}</h4>
                <p className="text-sm text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{p.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGrid;