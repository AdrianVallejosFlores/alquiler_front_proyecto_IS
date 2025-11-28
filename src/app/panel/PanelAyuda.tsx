// src/app/components/ayuda/PanelAyuda.tsx

'use client';
import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Home, 
  HelpCircle,
  FileText, 
  Search as SearchIcon,
  Phone,
  ShieldCheck,
  User,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

// --- PALETA DE COLORES (Según PDF 'bay-of-many') ---
// 50: '#eef7ff' (Fondos claros)
// 100: '#d8ecff'
// 200: '#b9ddff' (Bordes suaves)
// 600: '#1366fd' (Azul vibrante)
// 700: '#0c4fe9' (Botón Primary / Hover)
// 800: '#1140bc' (Textos oscuros / Focus)

// --- TIPOS DE DATOS ---
type ActionButton = {
  label: string;
  href?: string;
  onClick?: string;
  type: 'primary' | 'secondary';
};

type AccordionItem = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  actions?: ActionButton[];
};

type PageData = {
  id: string;
  title: string;
  accordions: AccordionItem[];
};

type Category = {
  title: string;
  icon: React.ReactNode;
  directPageData?: PageData; 
  items?: {
    id: string;
    title: string;
    pageData: PageData;
  }[];
};

// --- DATOS DEL MANUAL ---
const DATA_MANUAL: Record<string, Category> = {
  'guia-inicio': {
    title: 'Guía de inicio',
    icon: <Home className="w-5 h-5" />,
    directPageData: {
      id: 'guia-inicio-page',
      title: 'Guía de inicio',
      accordions: [
        { 
          id: 'bienvenida', 
          title: 'Bienvenido a Servineo', 
          description: 'Gracias por elegir Servineo, tu plataforma de confianza para conectar con profesionales calificados en Cochabamba, Bolivia.',
          bullets: [
             'Explora nuestra plataforma sin compromiso',
             'Crea tu cuenta gratis en minutos',
             'Encuentra el servicio que necesitas rápidamente',
             'Únete a miles de usuarios satisfechos'
          ]
        },
        { 
          id: 'primeros-pasos', 
          title: 'Primeros pasos', 
          description: 'Comienza tu experiencia en Servineo siguiendo estos simples pasos.',
          bullets: [
              '1. Crea tu cuenta o inicia sesión',
              '2. Completa tu perfil básico',
              '3. Explora servicios y categorías',
              '4. Contacta al fixer que necesitas'
          ],
          actions: [
              { label: 'Crear cuenta', href: '/auth/register', type: 'primary' },
              { label: 'Explorar servicios', href: '/servicios', type: 'secondary' }
          ] 
        },
        { 
          id: 'tour', 
          title: 'Tour por la plataforma', 
          description: 'Conoce las principales funcionalidades de Servineo y cómo aprovecharlas al máximo.',
          bullets: [
              'Búsqueda inteligente en tiempo real',
              'Mapa interactivo de fixers cercanos',
              'Sistema de calificaciones transparente',
              'Mensajería directa con profesionales'
          ],
          actions: [
              { label: 'Comenzar tour', onClick: 'startTour', type: 'primary' }
          ]
        },
      ]
    }
  },
  'guia-uso': {
    title: 'Guía de uso de Servineo',
    icon: <FileText className="w-5 h-5" />,
    items: [
      {
        id: 'que-es',
        title: '¿Qué es Servineo?',
        pageData: {
          id: 'page-que-es',
          title: '¿Qué es Servineo?',
          accordions: [
            {
              id: 'introduccion',
              title: 'Introducción a Servineo',
              description: 'Servineo es la plataforma líder en Cochabamba, Bolivia, que conecta a personas que necesitan servicios con profesionales calificados llamados "Fixers". Desde reparaciones del hogar hasta servicios especializados, todo en un solo lugar de manera rápida, segura y confiable.',
              bullets: [
                'Acceso a cientos de profesionales verificados',
                'Sistema de calificaciones transparente',
                'Respuestas en menos de 2 horas',
                'Pagos seguros y protegidos'
              ]
            },
            {
              id: 'ventajas',
              title: 'Ventajas de usar Servineo',
              description: 'Nuestra plataforma ofrece múltiples beneficios tanto para clientes como para fixers, creando un ecosistema de confianza y profesionalismo.',
              bullets: [
                'Ahorra tiempo buscando el profesional adecuado',
                'Compara precios y servicios fácilmente',
                'Accede a perfiles verificados con calificaciones reales',
                'Comunicación directa con el profesional'
              ]
            }
          ]
        }
      },
      {
        id: 'para-clientes',
        title: 'Para clientes',
        pageData: {
          id: 'page-para-clientes',
          title: 'Guía para clientes',
          accordions: [
            {
              id: 'como-buscar',
              title: 'Cómo buscar un servicio',
              description: 'Utiliza nuestra barra de búsqueda inteligente en tiempo real o explora las categorías disponibles. También puedes usar el mapa interactivo para encontrar fixers cerca de tu ubicación.',
              bullets: [
                "Usa palabras clave específicas como 'electricista' o 'plomero'",
                'Filtra por ubicación para encontrar fixers cercanos',
                'Revisa las categorías destacadas en el carrusel',
                'Activa la geolocalización para mejores resultados'
              ],
              actions: [
                { label: 'Ir a búsqueda de servicios', href: '/servicios', type: 'secondary' }
              ]
            },
            {
              id: 'revisar-perfiles',
              title: 'Revisar perfiles y calificaciones',
              description: 'Examina los perfiles de los Fixers disponibles. Puedes ver sus calificaciones, reseñas de clientes anteriores, portafolio de trabajos realizados y tarifas detalladas.',
              bullets: [
                'Lee comentarios de otros usuarios',
                'Verifica la experiencia y certificaciones',
                'Compara tarifas entre diferentes profesionales',
                'Revisa el portafolio de trabajos anteriores'
              ],
              actions: [
                { label: 'Ver servicios disponibles', href: '/servicios', type: 'secondary' }
              ]
            },
            {
              id: 'contratar',
              title: 'Contratar un servicio',
              description: "Haz clic en 'Contratar' para enviar tu solicitud. Describe los detalles del trabajo, coordina horarios y confirma el servicio de forma segura.",
              bullets: [
                'Sé específico en la descripción del trabajo',
                'Proporciona fotos si es posible',
                'Coordina horarios con anticipación',
                'Confirma los detalles antes de finalizar'
              ]
            },
            {
              id: 'calificar',
              title: 'Calificar el servicio recibido',
              description: 'Después de completar el servicio, podrás calificar tu experiencia. Esto ayuda a mantener la calidad de la plataforma y ayuda a otros usuarios.',
              bullets: [
                'Sé honesto en tu calificación',
                'Detalla tanto aspectos positivos como negativos',
                'Tu opinión ayuda a otros usuarios',
                'Las calificaciones son transparentes y públicas'
              ]
            }
          ]
        }
      },
      {
        id: 'para-fixers',
        title: 'Para fixers',
        pageData: {
          id: 'page-para-fixers',
          title: 'Guía para fixers',
          accordions: [
            {
              id: 'registro-fixer',
              title: 'Cómo registrarse como Fixer',
              description: "Haz clic en 'Ser Fixer' y completa tu perfil profesional con tus habilidades, experiencia, certificaciones, portafolio y tarifas.",
              bullets: [
                'Completa el 100% de tu perfil',
                'Sube fotos de trabajos anteriores',
                'Establece tarifas competitivas',
                'Agrega todas tus certificaciones'
              ],
              actions: [
                { label: 'Registrarme como Fixer', href: '/fixer/registro', type: 'secondary' }
              ]
            },
            {
              id: 'recibir-solicitudes',
              title: 'Recibir solicitudes de trabajo',
              description: 'Los clientes en tu área podrán encontrarte y enviarte solicitudes. Recibirás notificaciones instantáneas.',
              bullets: [
                'Activa notificaciones push',
                'Responde en menos de 2 horas',
                'Mantén tu disponibilidad actualizada',
                'Sé profesional en tu comunicación'
              ]
            },
            {
              id: 'reputacion',
              title: 'Ganar reputación',
              description: 'Realiza trabajos con profesionalismo y calidad. Las calificaciones positivas aumentan tu visibilidad y te traen más trabajos.',
              bullets: [
                'Llega puntual y bien equipado',
                'Comunícate claramente con el cliente',
                'Mantén calidad consistente',
                'Solicita calificación después de cada trabajo'
              ]
            },
            {
              id: 'ingresos',
              title: 'Maximizar tus ingresos',
              description: 'Aprovecha al máximo la plataforma para conseguir más trabajos y aumentar tus ganancias.',
              bullets: [
                'Mantén un perfil completo y actualizado',
                'Responde rápidamente a solicitudes',
                'Ofrece promociones ocasionales',
                'Construye una base de clientes leales'
              ]
            }
          ]
        }
      }
    ]
  },
  'como-funciona': {
    title: 'Cómo funciona',
    icon: <SearchIcon className="w-5 h-5" />,
    items: [
      { id: 'busqueda', title: 'Búsqueda de servicios', pageData: { id: 'p-busq', title: 'Búsqueda', accordions: [] } },
    ]
  },
  'cuenta-perfil': {
    title: 'Cuenta y perfil',
    icon: <User className="w-5 h-5" />,
    items: [
      { id: 'crear-cuenta', title: 'Crear cuenta', pageData: { id: 'p-crear', title: 'Crear cuenta', accordions: [] } },
    ]
  },
  'seguridad': {
    title: 'Seguridad y confianza',
    icon: <ShieldCheck className="w-5 h-5" />,
    items: [
        { id: 'verificacion', title: 'Verificación', pageData: { id: 'p-verif', title: 'Verificación', accordions: [] } },
    ]
  },
  'faqs': {
    title: 'Preguntas frecuentes',
    icon: <HelpCircle className="w-5 h-5" />,
    directPageData: { id: 'p-faqs', title: 'Preguntas Frecuentes', accordions: [] }
  },
  'soporte': {
    title: 'Soporte y ayuda',
    icon: <Phone className="w-5 h-5" />,
    items: [
        { id: 'contactar', title: 'Contactar soporte', pageData: { id: 'p-cont', title: 'Contacto', accordions: [] } }
    ]
  }
};

export default function PanelAyuda() {
  const [activeCategory, setActiveCategory] = useState<string>('guia-inicio');
  const [activePageId, setActivePageId] = useState<string>('');
  const [expandedSidebarItems, setExpandedSidebarItems] = useState<string[]>([]);
  const [openMainAccordion, setOpenMainAccordion] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Reset de página al volver a inicio
  useEffect(() => {
    if (activeCategory === 'guia-inicio') {
       setActivePageId('');
    }
  }, [activeCategory]);

  // Función para abrir/cerrar carpeta del sidebar
  const toggleSidebarFolder = (key: string) => {
    if (expandedSidebarItems.includes(key)) {
      setExpandedSidebarItems(expandedSidebarItems.filter(k => k !== key));
    } else {
      setExpandedSidebarItems([...expandedSidebarItems, key]);
    }
  };

  // Manejador de clicks en el Sidebar
  const handleSidebarClick = (catKey: string, subItem?: any) => {
    // 1. Activar la categoría padre siempre
    setActiveCategory(catKey);

    if (subItem) {
        // --- CASO: Click en Sub-item (Hijo) ---
        setActivePageId(subItem.id);
        setOpenMainAccordion(null); // Resetear acordeones internos
        setQuery('');
        
        // Asegurar que el padre se mantenga abierto si clickeo un hijo
        if (!expandedSidebarItems.includes(catKey)) {
            setExpandedSidebarItems(prev => [...prev, catKey]);
        }
    } else {
        // --- CASO: Click en Categoría (Padre) ---
        if (DATA_MANUAL[catKey].items) {
            // Si tiene hijos, INTERCAMBIAMOS (Toggle) el estado
            // Esto permite abrir y cerrar al hacer click repetido
            toggleSidebarFolder(catKey);
        } else {
            // Es una página directa (como Guia Inicio)
            setActivePageId('');
        }
        setQuery('');
    }
  };

  // Renderizado dinámico
  const getCurrentPageData = (): PageData | null => {
    const category = DATA_MANUAL[activeCategory];
    if (!category) return null;
    if (category.directPageData) return category.directPageData;
    if (category.items && activePageId) {
        const item = category.items.find(i => i.id === activePageId);
        return item ? item.pageData : null;
    }
    if (category.items && category.items.length > 0) {
        return category.items[0].pageData; 
    }
    return null;
  };

  const currentPage = getCurrentPageData();

  const handleStartTour = () => {
    alert('Iniciando tour...');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-[#b9ddff] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
           <div className="flex items-center gap-6 flex-1">
              <Link href="/" className="flex items-center gap-2 text-[#1366fd] font-bold text-xl hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-[#1366fd] text-white rounded-lg flex items-center justify-center">S</div>
                  <span className="hidden sm:inline">Servineo</span>
              </Link>
              <div className="relative w-full max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar en la guía..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#eef7ff] border border-transparent rounded-lg text-sm text-[#1140bc] placeholder-gray-500 focus:bg-white focus:border-[#0c4fe9] focus:ring-4 focus:ring-[#d8ecff] outline-none transition-all"
                 />
                 {query && (
                    <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4"/>
                    </button>
                 )}
              </div>
           </div>
           <Link href="/" className="text-sm font-medium text-[#1366fd] hover:text-[#0c4fe9] transition-colors flex items-center gap-1">
              Volver a inicio
           </Link>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-[1400px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* --- SIDEBAR IZQUIERDO --- */}
        <aside className="md:col-span-4 lg:col-span-3">
            <nav className="space-y-1 sticky top-24">
                {Object.entries(DATA_MANUAL).map(([key, category]) => {
                    const isActiveCategory = activeCategory === key;
                    const isExpanded = expandedSidebarItems.includes(key);
                    const hasSubItems = category.items && category.items.length > 0;

                    const categoryButtonClass = `w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-200 
                        ${isActiveCategory && !hasSubItems 
                            ? 'bg-[#eef7ff] text-[#0c4fe9] font-bold border-l-4 border-[#0c4fe9]' 
                            : 'text-gray-600 hover:bg-[#eef7ff] hover:text-[#0c4fe9] border-l-4 border-transparent'
                        }
                        ${isActiveCategory && hasSubItems 
                            ? 'bg-gray-50 text-[#1140bc] font-medium'
                            : ''
                        }
                    `;

                    return (
                        <div key={key} className="mb-1">
                            {/* Botón Padre (Categoría) */}
                            <button
                                onClick={() => handleSidebarClick(key)}
                                className={categoryButtonClass}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={isActiveCategory ? 'text-[#0c4fe9]' : 'text-gray-400'}>
                                        {category.icon}
                                    </span>
                                    <span>{category.title}</span>
                                </div>
                                {hasSubItems && (
                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}/>
                                )}
                            </button>

                            {/* Submenús (Hijos) */}
                            {hasSubItems && isExpanded && (
                                <div className="ml-4 pl-4 border-l border-[#b9ddff] mt-1 space-y-1">
                                    {category.items?.map(item => {
                                        const isSubActive = activeCategory === key && (activePageId === item.id || (!activePageId && category.items![0].id === item.id)); 
                                        
                                        return (
                                            <button 
                                                key={item.id}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evitar disparar el click del padre
                                                    handleSidebarClick(key, item);
                                                }}
                                                className={`block w-full text-left text-sm py-2 transition-all rounded-md px-2
                                                    ${isSubActive 
                                                        ? 'bg-black text-white font-bold shadow-md' 
                                                        : 'text-gray-500 hover:text-[#0c4fe9] hover:bg-[#eef7ff]'
                                                    }
                                                `}
                                            >
                                                {item.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="md:col-span-8 lg:col-span-9 min-h-[500px]">
            
            {currentPage ? (
                <div className="animate-fadeIn space-y-4">
                    <h1 className="text-2xl font-bold text-[#1140bc] mb-6 px-1">{currentPage.title}</h1>
                    
                    {/* Lista de Acordeones */}
                    <div className="space-y-4">
                        {currentPage.accordions.map((item) => {
                            const isOpen = openMainAccordion === item.id;

                            return (
                                <div 
                                    key={item.id} 
                                    className={`bg-white rounded-xl overflow-hidden transition-all duration-300
                                        ${isOpen 
                                            ? 'shadow-md border border-[#b9ddff] ring-1 ring-[#eef7ff]' 
                                            : 'shadow-sm border border-gray-200 hover:border-[#b9ddff]'
                                        }
                                    `}
                                >
                                    {/* Botón para abrir/cerrar acordeón */}
                                    <button 
                                        onClick={() => setOpenMainAccordion(isOpen ? null : item.id)}
                                        className="w-full flex items-center justify-between p-5 text-left bg-white"
                                    >
                                        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-[#0c4fe9]' : 'text-gray-700'}`}>
                                            {item.title}
                                        </span>
                                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#0c4fe9]' : ''}`}/>
                                    </button>

                                    {/* Contenido desplegable */}
                                    {isOpen && (
                                        <div className="px-6 pb-6 pt-0 animate-fadeIn">
                                            <p className="text-gray-600 mb-5 leading-relaxed">
                                                {item.description}
                                            </p>

                                            {item.bullets.length > 0 && (
                                                <div className="bg-[#eef7ff] rounded-lg p-5 mb-6 border border-[#b9ddff]">
                                                    <div className="flex items-center gap-2 mb-3 text-[#1140bc] font-bold text-sm uppercase tracking-wide">
                                                        <HelpCircle className="w-4 h-4" />
                                                        <span>Información útil</span>
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {item.bullets.map((bullet, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-[#1140bc] text-sm">
                                                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#1366fd] rounded-full flex-shrink-0" />
                                                                <span>{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {item.actions && item.actions.length > 0 && (
                                                <div className="flex flex-wrap gap-4 mt-4">
                                                    {item.actions.map((action, idx) => (
                                                        action.onClick === 'startTour' ? (
                                                            <button 
                                                                key={idx}
                                                                onClick={handleStartTour}
                                                                className={action.type === 'primary' ? 'cta-button-primary' : 'cta-button-secondary'}
                                                            >
                                                                {action.label}
                                                            </button>
                                                        ) : (
                                                            <Link 
                                                                key={idx} 
                                                                href={action.href || '#'}
                                                                className={action.type === 'primary' ? 'cta-button-primary' : 'cta-button-secondary'}
                                                            >
                                                                {action.label}
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-10 border border-[#b9ddff] shadow-sm text-center">
                    <h2 className="text-xl font-bold text-gray-400">Seleccione una opción del menú</h2>
                </div>
            )}

            {/* FOOTER */}
            <div className="mt-12 bg-[#eef7ff] rounded-xl p-8 border border-[#b9ddff]">
                <h4 className="font-bold text-[#1140bc] text-lg mb-2">¿No encuentras lo que buscas?</h4>
                <p className="text-[#1366fd] text-sm mb-6">
                    Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta o problema.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button className="cta-button-secondary flex items-center gap-2">
                        <Phone className="w-5 h-5"/>
                        Contactar soporte
                    </button>
                    
                    <Link href="/" className="cta-button-primary flex items-center gap-2">
                        <Home className="w-5 h-5"/>
                        Volver al inicio
                    </Link>
                </div>
            </div>

        </main>
      </div>

      <style jsx>{`
        .cta-button-primary {
          @apply text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:ring-4 focus:outline-none transition-all inline-flex items-center justify-center;
          background-color: #0c4fe9;
        }
        .cta-button-primary:hover {
          background-color: #1140bc;
        }
        .cta-button-primary:focus {
           --tw-ring-color: #89c9ff;
        }

        .cta-button-secondary {
          @apply font-medium rounded-lg text-sm px-5 py-2.5 mb-2 border focus:ring-4 focus:outline-none transition-all inline-flex items-center justify-center bg-white;
          color: #0c4fe9;
          border-color: #0c4fe9;
        }
        .cta-button-secondary:hover {
          background-color: #eef7ff;
        }
        .cta-button-secondary:focus {
           --tw-ring-color: #d8ecff;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}