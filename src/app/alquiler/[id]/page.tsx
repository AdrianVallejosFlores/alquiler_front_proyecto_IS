import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import JobDetailClient from './JobDetailClient';
import { Usuario } from './types/usuario.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

async function getUser(id: string) {
  const endpoint = `${API_BASE}/borbotones/usuarios/${id}`;
  console.log('Fetching from:', endpoint);
  
  try {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  try {
    if (!API_BASE) {
      console.error('API_BASE is not defined');
      return <div className="p-6">Error: API_BASE no está definido</div>;
    }

    const id = params.id;
    if (!id) {
      return (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-xl font-semibold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700">No se proporcionó un ID de usuario válido.</p>
            <Link href="/alquiler/paginacion" className="mt-4 inline-block text-blue-600 hover:underline">
              Volver a la lista de usuarios
            </Link>
          </div>
        </div>
      );
    }

    console.log('API_BASE:', API_BASE);
    console.log('ID del usuario:', id);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const endpoint = `${API_BASE}/borbotones/usuarios/${id}`;
    console.log('Intentando fetch a:', endpoint);
    
    const res = await fetch(endpoint, { 
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Usuario no encontrado</h2>
            <p className="text-gray-600 mb-4">No pudimos encontrar un profesional con el identificador proporcionado.</p>
            <div className="flex gap-3">
              <Link href="/alquiler/paginacion" className="px-4 py-2 bg-blue-600 text-white rounded">Volver a resultados</Link>
              <Link href="/alquiler" className="px-4 py-2 border border-gray-300 rounded">Ir al inicio</Link>
            </div>
            <div className="mt-4 text-xs text-gray-400">Endpoint intentado: {endpoint}</div>
          </div>
        );
      }
      return <div className="p-6">Error al obtener los datos: {res.status}</div>;
    }

    const json = await res.json();
    const usuario: Usuario = json.data;

    if (!usuario) return <div className="p-6">Usuario sin datos.</div>;

    const postedDate = usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : '';
    const SERVER_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/api\/?$/, '');

    const promedio = (usuario.calificaciones && usuario.calificaciones.length > 0)
      ? (usuario.calificaciones.reduce((acc:any, c:any) => acc + (c.puntuacion || 0), 0) / usuario.calificaciones.length)
      : undefined;

    return (
      <JobDetailClient
        usuario={usuario}
        postedDate={postedDate}
        SERVER_ORIGIN={SERVER_ORIGIN}
        promedio={promedio}
      />
    );
  } catch (error) {
    console.error('Error fetch usuario:', error);
    return <div className="p-6">Error al cargar los datos.</div>;
  }
}
