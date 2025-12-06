// src/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/page.tsx
'use client';

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import { useRouter } from 'next/navigation';

// Tipado compartido con la vista Cliente
import { Job, JobStatus } from './interfaces/types';
import { fetchTrabajosProveedor } from './services/api';
import { fmt } from './utils/helpers';

/* --- Props para hacerlo reutilizable --- */
interface TrabajosWidgetProps {
  proveedorId: string;
}

/* --- Paleta de colores (compartida con la vista Cliente) --- */
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

// Puedes cambiarlo a 10 si quieres que sea igual que la vista Cliente
const ITEMS_PER_PAGE = 5;

/* --- Íconos (mantenemos la misma paleta) --- */
const IcoUser = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IcoCalendar = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IcoBrief = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const IcoClock = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

/* --- Componente principal: Trabajos Agendados (Vista Proveedor) --- */
export default function TrabajosAgendadosWidget({ proveedorId }: TrabajosWidgetProps) {
  const [tab, setTab] = useState<TabKey>('all');
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Para que los detalles sepan que venimos desde proveedor
  const from = 'proveedor';

  /* --- Carga de trabajos del proveedor --- */
  useEffect(() => {
    let alive = true;

    // Reseteamos mientras carga
    setJobs(null);

    // Usamos el ID que viene por props
    fetchTrabajosProveedor(proveedorId || 'proveedor_123')
      .then((d) => {
        if (!alive) return;

        // Normalizamos posibles estados
        const normalized = (d ?? []).map((j: Job & { status: string }) => ({
          ...j,
          status: (j.status === 'done' ? 'done' : j.status) as JobStatus,
        }));

        setJobs(normalized);
      })
      .catch((err) => {
        console.error('Error al cargar trabajos (proveedor):', err);
      });

    return () => {
      alive = false;
    };
  }, [proveedorId]);

  /* --- Contadores por estado --- */
  const counts = useMemo(() => {
    const c = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      done: 0,
    } as Record<JobStatus, number>;

    (jobs ?? []).forEach((j) => c[j.status]++);
    return c;
  }, [jobs]);

  /* --- Filtro por tab --- */
  const filtered = useMemo(() => {
    if (!jobs) return [];
    return tab === 'all' ? jobs : jobs.filter((j) => j.status === tab);
  }, [jobs, tab]);

  /* --- Paginación --- */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (
      currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE) &&
      filtered.length > 0
    ) {
      setCurrentPage(1);
    }

    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  /* --- Navegación hacia las vistas de detalle --- */
  const handleVerDetalles = (job: Job) => {
    const status = job.status;

    if (status === 'cancelled') {
      // 👉 Vista específica de trabajos cancelados (Proveedor)
      router.push(
        `/epic_VerDetallesEstadoCancelado-VistaProveedor?id=${encodeURIComponent(
          job.id,
        )}`,
      );
    } else {
      // 👉 Vista compartida, indicando que venimos desde proveedor
      router.push(
        `/epic_VerDetallesAmbos?id=${encodeURIComponent(
          job.id,
        )}&from=${from}`,
      );
    }
  };

  /* --- Estado de carga (mismo estilo que Cliente) --- */
  if (!jobs) {
    return (
      <div
        style={{
          padding: 24,
          maxWidth: 980,
          margin: '0 auto',
          fontWeight: 500,
          color: C.text,
          fontSize: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: C.title,
            width: 660,
            marginTop: 0,
          }}
        >
          Trabajos Agendados
        </h1>
        <div
          style={{
            height: 1.5,
            width: 660,
            background: C.line,
            marginBottom: 10,
          }}
        />
        <p style={{ textAlign: 'center' }}>Cargando trabajos del proveedor...</p>
      </div>
    );
  }

  /* --- Render principal --- */
  return (
    <div className="w-full animate-in fade-in duration-300">
      <div
        style={{
          padding: 24,
          maxWidth: 980,
          margin: '0 auto',
          fontWeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
        }}
      >
        {/* --- Header: igual estilo que vista Cliente --- */}
        <h1
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: C.title,
            width: 660,
            marginTop: 0,
          }}
        >
          Trabajos Agendados
        </h1>
        <div
          style={{
            height: 1.5,
            width: 660,
            background: C.line,
            marginBottom: 10,
          }}
        />

        {/* --- Tabs (mismo diseño que Cliente) --- */}
        <TabsComponent
          tab={tab}
          setTab={setTab}
          counts={counts}
          setCurrentPage={setCurrentPage}
        />

        {/* --- Lista de trabajos --- */}
        <div
          className="scrollwrap"
          style={{
            display: 'grid',
            gap: 14,
            maxHeight: 520,
            overflow: 'auto',
            paddingRight: 8,
            width: 660,
          }}
        >
          {paginatedJobs.map((job) => {
            const { fecha, hora } = fmt(job.startISO);
            const { hora: horaFin } = fmt(job.endISO);

            // Color según estado
            const chipBg =
              job.status === 'confirmed'
                ? C.confirmed
                : job.status === 'pending'
                ? C.pending
                : job.status === 'done'
                ? C.done
                : C.cancelled;

            return (
              <article
                key={job.id}
                style={{
                  border: `2.5px solid ${C.borderMain}`,
                  borderRadius: 8,
                  background: C.white,
                  padding: '14px 18px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr auto',
                    gridTemplateRows: 'auto auto',
                    columnGap: 16,
                    rowGap: 6,
                    alignItems: 'center',
                  }}
                >
                  {/* --- Cliente --- */}
                  <div
                    style={{
                      gridColumn: '1',
                      gridRow: '1',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <IcoUser />
                    <div>
                      <span style={{ color: C.text }}>Cliente</span>
                      <br />
                      <span style={{ color: '#000' }}>{job.clientName}</span>
                    </div>
                  </div>

                  {/* --- Fecha --- */}
                  <div
                    style={{
                      gridColumn: '2',
                      gridRow: '1',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <IcoCalendar />
                    <div style={{ transform: 'translateY(3px)' }}>
                      <span style={{ color: C.text }}>Fecha</span>
                      <br />
                      <span style={{ color: '#000' }}>
                        {fecha.replaceAll('-', '/')}
                      </span>
                    </div>
                  </div>

                  {/* --- Hora Inicio --- */}
                  <div
                    style={{
                      gridColumn: '3',
                      gridRow: '1',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <IcoClock />
                    <div style={{ transform: 'translateY(3px)' }}>
                      <span style={{ color: C.text }}>Hora Inicio</span>
                      <br />
                      <span style={{ color: '#000' }}>
                        {hora.replace(/^0/, '')}
                      </span>
                    </div>
                  </div>

                  {/* --- Botón Ver Detalles --- */}
                  <div
                    style={{
                      gridColumn: '4',
                      gridRow: '1 / span 2',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      onClick={() => handleVerDetalles(job)}
                      style={{
                        padding: '8px 14px',
                        minWidth: 110,
                        height: 36,
                        borderRadius: 8,
                        background: C.confirmed,
                        color: C.white,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Ver Detalles
                    </button>
                  </div>

                  {/* --- Estado (chip sólido, igual que Cliente) --- */}
                  <div style={{ gridColumn: '1', gridRow: '2' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        borderRadius: 12,
                        background: chipBg,
                        color:
                          job.status === 'pending' ? '#000000' : C.white,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {job.status === 'confirmed'
                        ? 'Confirmado'
                        : job.status === 'pending'
                        ? 'Pendiente'
                        : job.status === 'done'
                        ? 'Terminado'
                        : 'Cancelado'}
                    </div>
                  </div>

                  {/* --- Servicio --- */}
                  <div
                    style={{
                      gridColumn: '2',
                      gridRow: '2',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <IcoBrief />
                    <div>
                      <span style={{ color: C.text }}>Servicio</span>
                      <br />
                      <span style={{ color: '#000' }}>{job.service}</span>
                    </div>
                  </div>

                  {/* --- Hora Fin --- */}
                  <div
                    style={{
                      gridColumn: '3',
                      gridRow: '2',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <IcoClock />
                    <div>
                      <span style={{ color: C.text }}>Hora Fin</span>
                      <br />
                      <span style={{ color: '#000' }}>
                        {horaFin.replace(/^0/, '')}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* --- Footer: paginación (similar a Cliente) --- */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            width: 660,
          }}
        >
          <span
            style={{
              color: C.text,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Página {currentPage} de {totalPages || 1}
          </span>

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                style={{
                  padding: '10px 15px',
                  borderRadius: 5,
                  border: '1px solid #ddd',
                  background: C.white,
                  color: C.text,
                  cursor:
                    currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.6 : 1,
                }}
              >
                Anterior
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages),
                  )
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 15px',
                  borderRadius: 5,
                  border: '1px solid #ddd',
                  background: C.white,
                  color: C.text,
                  cursor:
                    currentPage === totalPages
                      ? 'not-allowed'
                      : 'pointer',
                  opacity: currentPage === totalPages ? 0.6 : 1,
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Tabs (replicando el estilo de la vista Cliente) --- */
interface TabsProps {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  setCurrentPage: (page: number) => void;
  counts: Record<JobStatus, number>;
}

function TabsComponent({
  tab,
  setTab,
  counts,
  setCurrentPage,
}: TabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        marginBottom: 14,
        width: 660,
      }}
    >
      {(['all', 'confirmed', 'pending', 'cancelled', 'done'] as TabKey[]).map(
        (k) => {
          const active = tab === k;
          const badge =
            k === 'all'
              ? counts.confirmed +
                counts.pending +
                counts.cancelled +
                counts.done
              : counts[k];

          const baseBtn: CSSProperties = {
            borderRadius: 8,
            border: `2px solid ${C.borderBtn}`,
            background: active ? C.active : C.white,
            color: active ? C.white : C.text,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '8px 12px',
            flex: '1 0 auto',
          };

          return (
            <button
              key={k}
              onClick={() => {
                setTab(k);
                setCurrentPage(1);
              }}
              style={baseBtn}
            >
              {k === 'all'
                ? `Todos (${badge})`
                : k === 'confirmed'
                ? `Confirmados (${badge})`
                : k === 'pending'
                ? `Pendientes (${badge})`
                : k === 'cancelled'
                ? `Cancelados (${badge})`
                : `Terminados (${badge})`}
            </button>
          );
        },
      )}
    </div>
  );
}
