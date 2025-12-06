import React from 'react';
import Link from 'next/link';
import categorias from '../../components/data/categoriasData';
import { getFixersByCategory } from '@/lib/api/fixer';

// 1. Definimos las interfaces para los tipos de datos
interface CategoryData {
  titulo: string;
  descripcion?: string;
  slug?: string;
}

interface FixerLocation {
  address?: string;
}

interface Fixer {
  id: string | number;
  name?: string;
  city?: string;
  location?: FixerLocation;
  price?: string | number;
  jobsCount?: number;
}

interface ApiResponseItem {
  category?: {
    name?: string;
    titulo?: string;
  };
  fixers?: Fixer[];
}

type Props = { params: Promise<{ slug: string }> };

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Casteamos 'categorias' a un tipo conocido para poder iterar sin errores
  // (Asumiendo que 'categorias' es un array de objetos compatible con CategoryData)
  const localCategories = categorias as unknown as CategoryData[];

  // Find category from local data (fallback) by slug or title
  const category: CategoryData = localCategories.find((c) => {
    const s = c.slug ?? slugify(c.titulo);
    return s === slug;
  }) ?? { titulo: slug.replace(/-/g, ' '), descripcion: '' };

  // Try to fetch fixers from API using slug or title
  let fixers: Fixer[] = [];
  
  try {
    // Asumimos que la respuesta es un array de ApiResponseItem
    const rawData = await getFixersByCategory(category.titulo);
    const data = rawData as ApiResponseItem[];

    // API returns array of categories with fixers; find matching
    const found = data.find((d) => {
      const categoryName = d.category?.name ?? d.category?.titulo ?? '';
      return categoryName.toLowerCase() === category.titulo.toLowerCase();
    });

    if (found && found.fixers) {
      fixers = found.fixers;
    }
  } catch (e) {
    // ignore network errors — show empty list
    console.warn('Could not fetch fixers for category', e);
  }

  return (
    <main>
      {/* Header */}
      <header className="bg-linear-to-r from-[#11255a] to-[#52abff] text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-sm opacity-90 inline-block mb-3">← Volver a categorías</Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">{category.titulo}</h1>
              {category.descripcion && (
                <p className="mt-2 text-blue-100">{category.descripcion}</p>
              )}
              <p className="mt-3 text-sm text-blue-200">{fixers.length} profesionales disponibles en tu área</p>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-white border rounded text-sm">Mejor calificación</button>
            <button className="px-3 py-2 bg-white border rounded text-sm">Filtros</button>
          </div>
          <div className="text-sm text-gray-600">Vista: <span className="ml-2">🔳</span></div>
        </div>

        {/* Grid de fixers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fixers.length === 0 && (
            <div className="col-span-full text-center text-gray-600 py-10">No hay profesionales registrados para esta categoría todavía.</div>
          )}

          {fixers.map((f) => (
            <div key={f.id} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-lg">{(f.name && f.name[0]) || 'F'}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{f.name || 'Nombre desconocido'}</h3>
                  <div className="text-sm text-gray-500">{f.city ?? f.location?.address ?? '—'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-700 font-semibold">Bs. {f.price ?? '—'}</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">Trabajos completados: {f.jobsCount ?? 0}</div>
              <div className="mt-4 flex gap-3">
                <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded">Ver perfil</button>
                <button className="bg-white border px-4 py-2 rounded">Contactar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}