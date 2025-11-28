// src/app/components/ayuda/PanelAyuda.tsx

'use client';
import { useMemo, useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Home, 
  MessageCircle, 
  PlayCircle, 
  ShieldCheck, 
  User, 
  HelpCircle,
  FileText,
  Briefcase,
  Search as SearchIcon,
  Star,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// --- DATOS Y CONTENIDO (Simulación de CMS/BD) ---
// Definimos la estructura exacta solicitada en los ACs

const DATA_MANUAL = {
  'guia-inicio': {
    title: 'Guía de inicio',
    icon: <Home className="w-5 h-5" />,
    items: [
      { id: 'bienvenida', title: 'Bienvenido a Servineo', content: 'welcome' },
      { id: 'primeros-pasos', title: 'Primeros pasos', content: 'steps' },
      { id: 'tour', title: 'Tour por la plataforma', content: 'tour' },
    ]
  },
  'guia-uso': {
    title: 'Guía de uso de Servineo',
    icon: <FileText className="w-5 h-5" />,
    items: [
      { id: 'que-es', title: '¿Qué es Servineo?', content: 'def-servineo' },
      { id: 'para-clientes', title: 'Para clientes', content: 'manual-cliente' },
      { id: 'para-fixers', title: 'Para fixers', content: 'manual-fixer' },
    ]
  },
  'como-funciona': {
    title: 'Cómo funciona',
    icon: <SearchIcon className="w-5 h-5" />,
    items: [
      { id: 'busqueda', title: 'Búsqueda de servicios', content: 'exp-busqueda' },
      { id: 'calificaciones', title: 'Sistema de calificaciones', content: 'exp-calificaciones' },
      { id: 'mensajeria', title: 'Mensajería y comunicación', content: 'exp-mensajeria' },
    ]
  },
  'cuenta-perfil': {
    title: 'Cuenta y perfil',
    icon: <User className="w-5 h-5" />,
    items: [
      { id: 'crear-cuenta', title: 'Crear una cuenta', content: 'exp-crear-cuenta' },
      { id: 'completar-perfil', title: 'Completar tu perfil', content: 'exp-perfil' },
      { id: 'configuracion', title: 'Configuración de cuenta', content: 'exp-config' },
    ]
  },
  'seguridad': {
    title: 'Seguridad y confianza',
    icon: <ShieldCheck className="w-5 h-5" />,
    items: [
      { id: 'verificacion', title: 'Verificación de identidad', content: 'exp-verificacion' },
      { id: 'pagos-seguros', title: 'Pagos seguros', content: 'exp-pagos' },
      { id: 'proteccion-datos', title: 'Protección de datos', content: 'exp-datos' },
    ]
  },
  'faqs': {
    title: 'Preguntas frecuentes',
    icon: <HelpCircle className="w-5 h-5" />,
    items: [
      { id: 'lista-faqs', title: 'Preguntas y respuestas', content: 'faqs-list' }
    ]
  },
  'soporte': {
    title: 'Soporte y ayuda',
    icon: <MessageCircle className="w-5 h-5" />,
    items: [
      { id: 'contactar', title: 'Contactar soporte', content: 'soporte-info' },
      { id: 'videotutoriales', title: 'Videotutoriales', content: 'videos' },
      { id: 'reportar', title: 'Reportar un problema', content: 'report-info' },
    ]
  }
};

// Preguntas Frecuentes Data
const FAQS_DATA = [
    { q: '¿Qué es Servineo?', a: 'Servineo es una plataforma que conecta clientes con proveedores de servicios (Fixers).' },
    { q: '¿Cómo me registro?', a: 'Puedes registrarte usando tu correo o Google.' },
    { q: '¿Es seguro pagar?', a: 'Sí, utilizamos pasarelas de pago seguras.' },
    { q: '¿Cómo verifican a los Fixers?', a: 'Mediante validación de identidad biométrica.' },
];

export default function PanelAyuda() {
  // Estado para navegación
  const [activeCategory, setActiveCategory] = useState('guia-inicio');
  const [activeSubItem, setActiveSubItem] = useState('bienvenida');
  
  // Estado para búsqueda
  const [query, setQuery] = useState('');

  // Lógica de búsqueda (Cumple AC: "Resultados coinciden parcialmente")
  const searchResults = useMemo(() => {
    if (!query) return null;
    const lowerQ = query.toLowerCase();
    const results: any[] = [];

    Object.entries(DATA_MANUAL).forEach(([catKey, catData]) => {
      catData.items.forEach(item => {
        if (item.title.toLowerCase().includes(lowerQ)) {
          results.push({ ...item, catKey });
        }
      });
    });
    return results;
  }, [query]);

  // Manejador del Tour (Simulado según AC)
  const handleStartTour = () => {
    alert('Evento: Se inicia el tour en la primera pantalla.');
    // Aquí iría la lógica real, ej: window.dispatchEvent(new Event('startTour'));
  };

  // Función para renderizar el contenido dinámico
  const renderContent = (contentKey: string) => {
    switch (contentKey) {
      // --- GUÍA DE INICIO ---
      case 'welcome':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido a Servineo</h2>
            <p className="text-gray-600 text-lg">Tu plataforma de confianza para encontrar y ofrecer servicios en Bolivia.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
               <Link href="/auth/register" className="cta-button-primary">
                 Crear cuenta
               </Link>
               <Link href="/auth/login" className="cta-button-secondary">
                 Iniciar sesión
               </Link>
            </div>
          </div>
        );
      case 'steps':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Primeros Pasos</h2>
            <p className="text-gray-600">Sigue esta guía rápida para empezar a usar la plataforma.</p>
            {/* AC: Banners responsive (1 col < 1200px, 2 cols >= 1200px) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
              <div className="banner-card">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-3"><User className="text-blue-600"/></div>
                <h3 className="font-bold text-lg">Para Clientes</h3>
                <p className="text-sm text-gray-600 mb-4">Encuentra al profesional ideal en minutos.</p>
                <Link href="/servicios" className="text-blue-600 font-semibold hover:underline">Explorar servicios &rarr;</Link>
              </div>
              <div className="banner-card">
                <div className="bg-green-100 p-3 rounded-full w-fit mb-3"><Briefcase className="text-green-600"/></div>
                <h3 className="font-bold text-lg">Para Fixers</h3>
                <p className="text-sm text-gray-600 mb-4">Monetiza tus habilidades hoy mismo.</p>
                <Link href="/fixer/registro" className="text-green-600 font-semibold hover:underline">Ser Fixer &rarr;</Link>
              </div>
            </div>
          </div>
        );
      case 'tour':
        return (
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-gray-800">Tour por la plataforma</h2>
             <p className="text-gray-600">Realiza un recorrido interactivo para conocer todas las funciones.</p>
             <button 
                onClick={handleStartTour}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition-all hover:scale-105"
             >
               <PlayCircle className="w-5 h-5" />
               Comenzar tour
             </button>
          </div>
        );

      // --- GUÍA DE USO ---
      case 'def-servineo':
        return (
            <article className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-800">¿Qué es Servineo?</h2>
                <p className="text-gray-600 mt-4">Servineo es la aplicación líder en conexión de servicios...</p>
            </article>
        );
      case 'manual-cliente':
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Manual para Clientes</h2>
                <p className="text-gray-600">Aprende a contratar servicios de manera segura.</p>
                {/* AC: Banners responsive */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="banner-flow bg-white border-l-4 border-blue-500">
                        <h4 className="font-bold">1. Busca</h4>
                        <p className="text-sm">Usa el buscador inteligente.</p>
                    </div>
                    <div className="banner-flow bg-white border-l-4 border-blue-500">
                        <h4 className="font-bold">2. Compara</h4>
                        <p className="text-sm">Revisa calificaciones y precios.</p>
                    </div>
                    <div className="banner-flow bg-white border-l-4 border-blue-500">
                        <h4 className="font-bold">3. Contrata</h4>
                        <p className="text-sm">Acuerda los detalles y paga seguro.</p>
                    </div>
                </div>
                <div className="mt-6">
                    <Link href="/manual-cliente-completo" className="cta-button-primary inline-block">Ver manual completo</Link>
                </div>
            </div>
        );
      case 'manual-fixer':
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Manual para Fixers</h2>
                <p className="text-gray-600">Optimiza tu perfil y consigue más clientes.</p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-bold text-yellow-800">Tip Pro:</h4>
                    <p className="text-sm text-yellow-700">Los perfiles completos al 100% reciben el doble de solicitudes.</p>
                </div>
                <Link href="/fixer/registro" className="cta-button-secondary inline-block">Registrarme como Fixer</Link>
            </div>
        );

      // --- CÓMO FUNCIONA / CUENTA ---
      case 'exp-busqueda':
      case 'exp-calificaciones':
      case 'exp-mensajeria':
      case 'exp-crear-cuenta':
      case 'exp-perfil':
      case 'exp-config':
      case 'exp-verificacion':
      case 'exp-pagos':
      case 'exp-datos':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{
                // Buscar el título dinámicamente
                Object.values(DATA_MANUAL).flatMap(g => g.items).find(i => i.content === contentKey)?.title
            }</h2>
            <p className="text-gray-600">
                Texto explicativo detallado sobre esta funcionalidad... 
                (Aquí iría el contenido editorial redactado por el equipo).
            </p>
          </div>
        );

      // --- FAQS ---
      case 'faqs-list':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Preguntas Frecuentes</h2>
            <div className="space-y-3">
               {FAQS_DATA.map((faq, idx) => (
                   <details key={idx} className="group bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-all">
                       <summary className="font-medium text-gray-800 flex justify-between items-center list-none outline-none focus:ring-2 focus:ring-blue-500 rounded">
                           {faq.q}
                           <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform"/>
                       </summary>
                       <p className="text-gray-600 mt-3 text-sm pl-1 border-l-2 border-blue-500 ml-1">{faq.a}</p>
                   </details>
               ))}
            </div>
          </div>
        );

      // --- SOPORTE ---
      case 'soporte-info':
        return (
             <div className="text-center py-10">
                 <h2 className="text-2xl font-bold text-gray-800">¿Necesitas ayuda extra?</h2>
                 <p className="text-gray-600 mb-6">Nuestro equipo está disponible 24/7 para asistirte.</p>
                 <a href="https://wa.me/59112345678" target="_blank" rel="noreferrer" className="cta-button-whatsapp inline-flex items-center gap-2">
                     <MessageCircle className="w-5 h-5"/> Contactar por WhatsApp
                 </a>
                 <p className="mt-4 text-sm text-gray-500">También puedes escribirnos a soporte@servineo.com</p>
             </div>
        );
      case 'videos':
        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Videotutoriales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1,2,3,4].map(v => (
                        <div key={v} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative group cursor-pointer">
                            <PlayCircle className="w-12 h-12 text-gray-500 group-hover:text-blue-600 transition-colors"/>
                            <span className="absolute bottom-2 left-2 text-xs font-bold text-gray-700 bg-white/80 px-2 py-1 rounded">Tutorial {v}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
      case 'report-info':
        return (
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h2 className="text-xl font-bold text-red-800 mb-2">Reportar un problema</h2>
                <p className="text-red-700 text-sm mb-4">Si encontraste un error técnico o comportamiento inapropiado, háznoslo saber.</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">Abrir formulario de reporte</button>
            </div>
        );

      default:
        return <div>Seleccione una opción</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER: AC - Búsqueda arriba izquierda, Botón volver a inicio */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
           
           {/* Left: Logo & Search */}
           <div className="flex items-center gap-6 flex-1">
              <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">S</div>
                  <span className="hidden sm:inline">Servineo</span>
              </Link>

              {/* AC: Barra de búsqueda, placeholder específico, borde azul al foco */}
              <div className="relative w-full max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar en la guía..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                 />
                 {query && (
                    <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4"/>
                    </button>
                 )}
              </div>
           </div>

           {/* Right: Volver a inicio */}
           <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              Volver a inicio
           </Link>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVEGACIÓN */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-8">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(DATA_MANUAL).map(([key, category]) => (
                    <div key={key} className="mb-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 px-2">
                            {category.icon}
                            {category.title}
                        </h3>
                        <nav className="space-y-1">
                            {category.items.map((item) => {
                                const isActive = activeSubItem === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveCategory(key);
                                            setActiveSubItem(item.id);
                                            setQuery(''); // Limpiar búsqueda al navegar
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 
                                            ${isActive 
                                                ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
                                            }
                                        `}
                                    >
                                        {item.title}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="md:col-span-8 lg:col-span-9 min-h-[500px]">
            
            {/* VISTA DE RESULTADOS DE BÚSQUEDA */}
            {query ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Resultados para "{query}"</h2>
                    {searchResults && searchResults.length > 0 ? (
                        <div className="grid gap-4">
                            {searchResults.map((res: any) => (
                                <button 
                                    key={res.id}
                                    onClick={() => {
                                        setActiveCategory(res.catKey);
                                        setActiveSubItem(res.id);
                                        setQuery('');
                                    }}
                                    className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                                >
                                    <h3 className="font-bold text-blue-600 group-hover:text-blue-800">{res.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">En: {DATA_MANUAL[res.catKey as keyof typeof DATA_MANUAL].title}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // AC: Mensaje "No se encontraron resultados"
                        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500">No se encontraron resultados que coincidan con tu búsqueda.</p>
                        </div>
                    )}
                </div>
            ) : (
                // VISTA DE CONTENIDO NORMAL
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 animate-fadeIn">
                    {/* Breadcrumbs simple */}
                    <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 uppercase tracking-wide">
                        <span>{DATA_MANUAL[activeCategory as keyof typeof DATA_MANUAL].title}</span>
                        <ChevronRight className="w-3 h-3"/>
                        <span className="text-blue-600 font-bold">{
                            DATA_MANUAL[activeCategory as keyof typeof DATA_MANUAL].items.find(i => i.id === activeSubItem)?.title
                        }</span>
                    </div>

                    {/* Contenido renderizado */}
                    {activeCategory && activeSubItem && renderContent(
                         DATA_MANUAL[activeCategory as keyof typeof DATA_MANUAL].items.find(i => i.id === activeSubItem)?.content || ''
                    )}
                </div>
            )}

            {/* FOOTER INTERNO: AC - "No encuentras lo que buscas?" */}
            {!query && (
                <div className="mt-12 bg-blue-50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">¿No encuentras lo que buscas?</h4>
                        <p className="text-gray-600 text-sm mt-1">Nuestro equipo de soporte está listo para ayudarte personalmente.</p>
                    </div>
                    {/* AC: Verificar que el botón "Contactar soporte" dirija al contacto */}
                    <button onClick={() => setActiveSubItem('contactar')} className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors">
                        Contactar soporte
                    </button>
                </div>
            )}

        </main>
      </div>
      
      {/* Estilos CSS en línea para utilidades específicas de botones */}
      <style jsx>{`
        .cta-button-primary {
          @apply px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center block w-full sm:w-auto;
        }
        .cta-button-secondary {
          @apply px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-semibold shadow-sm hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 transition-all text-center block w-full sm:w-auto;
        }
        .cta-button-whatsapp {
            @apply px-8 py-3 bg-green-500 text-white rounded-full font-bold shadow-lg hover:bg-green-600 hover:scale-105 transition-all;
        }
        .banner-card {
            @apply p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
      `}</style>
    </div>
  );
}