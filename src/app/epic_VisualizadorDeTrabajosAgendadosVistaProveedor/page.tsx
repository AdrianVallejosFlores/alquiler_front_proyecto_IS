//src/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { Job, JobStatus } from './interfaces/types';
import { fetchTrabajosProveedor } from './services/api';
import { fmt } from './utils/helpers';
import { useRouter } from 'next/navigation';

/* --- Props para hacerlo reutilizable --- */
interface TrabajosWidgetProps {
  proveedorId: string;
}

/* Paleta (Mantenemos tu diseño original) */
const C = {
  title: '#0C4FE9',
  text: '#1140BC',
  borderMain: '#0C4FE9',
  borderBtn: '#1366FD',
  confirmed: '#1366FD',
  pending: '#F0D92B',
  done: '#31C950',
  cancelled: '#E84141',
  white: '#FFFFFF',
  line: '#1140BC',
  active: '#1366FD',
} as const;

type TabKey = 'all' | JobStatus;
const ITEMS_PER_PAGE = 5; // Reduje a 5 para que se vea mejor en un widget, puedes subirlo a 10

/* --- Íconos (Sin cambios) --- */
const IcoUser = ({ size = 20, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcoCalendar = ({ size = 20, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IcoBrief = ({ size = 20, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IcoClock = ({ size = 20, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

/* --- Componente Principal Adaptado --- */
export default function TrabajosAgendadosWidget({ proveedorId }: TrabajosWidgetProps) {
  const [tab, setTab] = useState<TabKey>('all');
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    // Usamos el ID que viene por props
    fetchTrabajosProveedor(proveedorId || 'proveedor_123')
      .then((d) => {
        if (alive) setJobs(d);
      })
      .catch((err) => {
        console.error('Error al cargar trabajos:', err);
      });
    return () => { alive = false; };
  }, [proveedorId]); 

  const counts = useMemo(() => {
    const c = { confirmed: 0, pending: 0, cancelled: 0, done: 0 } as Record<JobStatus, number>;
    (jobs ?? []).forEach((j) => c[j.status]++);
    return c;
  }, [jobs]);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return tab === 'all' ? jobs : jobs.filter((j) => j.status === tab);
  }, [jobs, tab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    if (currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE) && filtered.length > 0) {
      setCurrentPage(1);
    }
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  // --- Renderizado de Estados de Carga/Vacío ---

  if (!jobs) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-slate-400 animate-in fade-in">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <p className="text-sm">Cargando historial...</p>
      </div>
    );
  }

  // Renderizado Principal
  return (
    <div className="w-full animate-in fade-in duration-300">
      
      {/* 1. Header Simplificado (Estilo Calendario) */}
      <div className="mb-6 border-b border-slate-100 pb-4">
         <h2 className="text-lg font-bold text-slate-900">Historial de trabajos</h2>
         <p className="text-slate-500 text-sm">Gestiona tus servicios agendados y confirmados.</p>
      </div>

      {/* 2. Tabs Responsivos */}
      <div className="mb-6 overflow-x-auto pb-2">
        <TabsComponent tab={tab} setTab={setTab} counts={counts} setCurrentPage={setCurrentPage} />
      </div>

      {/* 3. Contenido según estado */}
      {(tab !== 'all' && counts[tab] === 0) ? (
        <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl">
           <p className="text-amber-500 font-bold text-lg mb-2">Sección vacía</p>
           {/* CORRECCIÓN AQUÍ: Usamos &quot; para las comillas */}
           <p className="text-slate-400 text-sm">No hay trabajos en estado &quot;{tab}&quot; actualmente.</p>
        </div>
      ) : (tab === 'all' && filtered.length === 0) ? (
        <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl">
           <p className="text-slate-500 font-medium text-lg">No tienes trabajos agendados.</p>
        </div>
      ) : (
        /* LISTA DE TRABAJOS */
        <div className="flex flex-col gap-4">
          {paginatedJobs.map((job) => {
            const { fecha, hora } = fmt(job.startISO);
            const { hora: horaFin } = fmt(job.endISO);
            const chipBg =
              job.status === 'confirmed' ? C.confirmed
              : job.status === 'pending' ? C.pending
              : job.status === 'done' ? C.done
              : C.cancelled;

            return (
              <article 
                key={job.id} 
                className="rounded-xl bg-white p-4 transition-all hover:shadow-md"
                style={{ border: `1px solid ${C.borderMain}40`, borderLeft: `4px solid ${C.borderMain}` }}
              >
                {/* Layout Grid Responsivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  
                  {/* Cliente */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-full"><IcoUser /></div>
                    <div>
                      <span className="text-xs font-bold" style={{ color: C.text }}>CLIENTE</span>
                      <div className="text-sm font-semibold text-slate-900">{job.clientName}</div>
                    </div>
                  </div>

                  {/* Fecha y Hora */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <IcoCalendar size={16} />
                        <span className="text-sm text-slate-700">{fecha.replaceAll('-', '/')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IcoClock size={16} />
                        <span className="text-sm text-slate-700">{hora.replace(/^0/, '')} - {horaFin.replace(/^0/, '')}</span>
                    </div>
                  </div>

                  {/* Servicio y Estado */}
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                        <IcoBrief size={16} />
                        <span className="text-sm font-medium text-slate-900">{job.service}</span>
                     </div>
                     <span 
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold w-fit"
                        style={{ 
                            background: `${chipBg}20`, // Fondo con transparencia
                            color: job.status === 'pending' ? '#B45309' : chipBg 
                        }}
                     >
                        {job.status === 'confirmed' ? 'CONFIRMADO'
                        : job.status === 'pending' ? 'PENDIENTE'
                        : job.status === 'done' ? 'TERMINADO'
                        : 'CANCELADO'}
                     </span>
                  </div>

                  {/* Botón Ver Detalles */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => router.push(`/epic_VerDetallesAmbos?id=${encodeURIComponent(job.id)}`)}
                      className="w-full md:w-auto px-4 py-2 rounded-lg text-sm font-bold text-white transition-transform active:scale-95"
                      style={{ background: C.confirmed }}
                    >
                      Ver Detalles
                    </button>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* FOOTER: Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
           <span className="text-sm text-slate-500">
              Página <span className="font-bold text-slate-900">{currentPage}</span> de {totalPages}
           </span>
           
           <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-slate-200 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-slate-200 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
           </div>
        </div>
      )}
    </div>
  );
}


/* --- Componente de Tabs (Adaptado a width 100%) --- */
interface TabsProps {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  setCurrentPage: (page: number) => void;
  counts: Record<JobStatus, number>;
}

function TabsComponent({ tab, setTab, counts, setCurrentPage }: TabsProps) {
  const tabs: TabKey[] = ['all', 'confirmed', 'pending', 'cancelled', 'done'];
  
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {tabs.map((k) => {
        const active = tab === k;
        const badge = k === 'all'
          ? (counts.confirmed + counts.pending + counts.cancelled + counts.done) 
          : counts[k];

        return (
          <button 
            key={k} 
            onClick={() => { setTab(k); setCurrentPage(1); }} 
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ 
              border: `1px solid ${active ? C.active : '#E2E8F0'}`, 
              background: active ? C.active : C.white,
              color: active ? C.white : '#64748B',
              flex: '1 0 auto' // Esto hace que los tabs se distribuyan bien
            }}
          >
            <span>
                {k === 'all' ? 'Todos' 
                : k === 'confirmed' ? 'Confirmados' 
                : k === 'pending' ? 'Pendientes' 
                : k === 'cancelled' ? 'Cancelados' 
                : 'Terminados'}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                {badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}