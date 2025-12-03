'use client';

import React from 'react';
import { HighlightedText } from './HighlightedText';
import { useHighlighting } from '../hooks/useHighlighting';
import { useFilterTermMatch } from '../hooks/useFilterTermMatch';
import type { Filtros } from '../../BusquedaAvanzada/BusquedaAvanzada';


interface JobCardWithHighlightProps {
  title: string;
  company: string;
  service: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  employmentType: string;
  employmentTypeColor: string;
  rating?: number;
  onViewDetails?: () => void;
  appliedFilters?: Filtros | null;
}

export const JobCardWithHighlight: React.FC<JobCardWithHighlightProps> = (props) => {
  const { searchTerms } = useHighlighting();
  const { hasMatch: filterTermMatch } = useFilterTermMatch(searchTerms, props.appliedFilters || null);
  const shouldHighlight = searchTerms.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Encabezado con gradiente */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          {shouldHighlight ? (
            <HighlightedText text={props.company} searchTerms={searchTerms} />
          ) : (
            props.company
          )}
        </h2>
        <p className="text-white/90">
          {shouldHighlight ? (
            <HighlightedText text={props.title} searchTerms={searchTerms} />
          ) : (
            props.title
          )}
        </p>
      </div>

      <div className="p-6 flex-grow">
        {/* Estado y Calificación */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            props.employmentType === "Disponible"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          } ${filterTermMatch ? 'ring-2 ring-yellow-300' : ''}`}>
            {props.employmentType}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-5 w-5 ${star <= Math.round(props.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {props.rating ? `(${Number(props.rating).toFixed(1)})` : '(Sin calificaciones)'}
            </span>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex items-center mb-4 text-gray-600">
          <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {shouldHighlight ? (
              <HighlightedText text={props.location} searchTerms={searchTerms} />
            ) : (
              props.location
            )}
          </span>
        </div>

        {/* Servicios y Precio */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Servicios:</h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {shouldHighlight ? (
                  <HighlightedText text={props.service} searchTerms={searchTerms} />
                ) : (
                  props.service
                )}
              </span>
              <span className="font-medium text-blue-600">
                {props.salaryRange}
              </span>
            </div>
          </div>
        </div>

        {/* Fecha de registro */}
        <div className="text-xs text-gray-500 flex items-center mb-6">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registrado: {props.postedDate}
        </div>
       
        <div className="mt-auto">
          <button
            onClick={props.onViewDetails}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};