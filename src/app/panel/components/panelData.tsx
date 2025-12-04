import { ReactNode } from 'react';

// --- TIPOS DE DATOS ---
export type ActionButton = {
  label: string;
  href?: string;
  onClick?: () => void;
  type: 'primary' | 'secondary';
};

export type AccordionItem = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  actions?: ActionButton[];
};

export type PageData = {
  id: string;
  title: string;
  accordions: AccordionItem[];
};

export type CategoryItem = {
  id: string;
  title: string;
  pageData: PageData;
};

export type Category = {
  title: string;
  icon: ReactNode; // Cambiado de React.ReactNode a ReactNode para importar fácil
  directPageData?: PageData; 
  items?: CategoryItem[];
};

// Necesitarás importar los iconos aquí o pasarlos como componentes, 
// pero para mantener la data pura, a veces es mejor dejar la definición del componente Icono en el renderizado.
// Sin embargo, para que funcione tu código actual tal cual, importaremos los iconos aquí.
import { 
  Home, BookOpen, Settings, User, ShieldCheck, HelpCircle, Phone 
} from 'lucide-react';

// --- DATOS DEL MANUAL ---
export const DATA_MANUAL: Record<string, Category> = {
  'inicio': {
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
              { label: 'Crear cuenta', href: '/registro', type: 'primary' },
              { label: 'Explorar servicios', href: '/#servicios', type: 'secondary' }
          ] 
        },
        { 
          id: 'tour-plataforma', 
          title: 'Tour por la plataforma', 
          description: 'Conoce las principales funcionalidades de Servineo y cómo aprovecharlas al máximo.',
          bullets: [
              'Búsqueda inteligente en tiempo real',
              'Mapa interactivo de fixers cercanos',
              'Sistema de calificaciones transparente',
              'Mensajería directa con profesionales'
          ],
          actions: [
              { label: 'Comenzar tour', onClick: () => {
                  try {
                    window.dispatchEvent(new CustomEvent('show-tutorial'));
                  } catch (e) {
                    console.log('Tutorial event dispatched');
                  }
                }, type: 'primary' }
          ]
        },
      ]
    }
  },
  'guia-uso': {
    title: 'Guía de uso de Servineo',
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      {
        id: 'que-es-servineo',
        title: '¿Qué es Servineo?',
        pageData: {
          id: 'page-que-es',
          title: '¿Qué es Servineo?',
          accordions: [
            {
              id: 'introduccion',
              title: 'Introducción a Servineo',
              description: 'Servineo es la plataforma líder en Cochabamba, Bolivia, que conecta a personas que necesitan servicios con profesionales calificados llamados "Fixers".',
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
              description: 'Nuestra plataforma ofrece múltiples beneficios tanto para clientes como para fixers.',
              bullets: [
                'Ahorra tiempo buscando el profesional adecuado',
                'Compara precios y servicios fácilmente',
                'Accede a perfiles verificados',
                'Comunicación directa'
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
              id: 'buscar-servicio',
              title: 'Cómo buscar un servicio',
              description: 'Utiliza nuestra barra de búsqueda inteligente en tiempo real o explora las categorías disponibles.',
              bullets: [
                "Usa palabras clave específicas",
                'Filtra por ubicación',
                'Revisa las categorías destacadas',
                'Activa la geolocalización'
              ],
              actions: [
                { 
                  label: 'Ir a búsqueda', 
                  onClick: () => {
                    // Si ya estamos en la homepage, solo enfocar
                    if (window.location.pathname === '/') {
                      const searchInput = document.querySelector('[data-tutorial="search-bar"]') as HTMLInputElement;
                      if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                      // Scroll a servicios
                      const serviciosSection = document.getElementById('servicios');
                      if (serviciosSection) {
                        serviciosSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      // Navegar a home y luego enfocar
                      window.location.href = '/#servicios';
                      // Usar un evento de carga para enfocar después
                      window.addEventListener('load', () => {
                        setTimeout(() => {
                          const searchInput = document.querySelector('[data-tutorial="search-bar"]') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.focus();
                            searchInput.select();
                          }
                        }, 500);
                      }, { once: true });
                    }
                  },
                  type: 'secondary' 
                }
              ]
            },
            {
              id: 'revisar-perfiles',
              title: 'Revisar perfiles y calificaciones',
              description: 'Examina los perfiles de los Fixers disponibles.',
              bullets: [
                'Lee comentarios de otros usuarios',
                'Verifica la experiencia',
                'Compara tarifas',
                'Revisa el portafolio'
              ],
              actions: [
                { label: 'Ver categorías', href: '/categorias', type: 'secondary' }
              ]
            },
            {
              id: 'contratar-servicio',
              title: 'Contratar un servicio',
              description: "Haz clic en 'Contratar' para enviar tu solicitud.",
              bullets: [
                'Sé específico en la descripción',
                'Proporciona fotos si es posible',
                'Coordina horarios',
                'Confirma los detalles'
              ]
            },
            {
              id: 'calificar-servicio',
              title: 'Calificar el servicio recibido',
              description: 'Después de completar el servicio, podrás calificar tu experiencia.',
              bullets: [
                'Sé honesto en tu calificación',
                'Detalla aspectos positivos y negativos',
                'Tu opinión ayuda a otros',
                'Las calificaciones son públicas'
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
              id: 'registrarse-fixer',
              title: 'Cómo registrarse como Fixer',
              description: "Haz clic en 'Ser Fixer' y completa tu perfil profesional.",
              bullets: [
                'Completa el 100% de tu perfil',
                'Sube fotos de trabajos',
                'Establece tarifas competitivas',
                'Agrega certificaciones'
              ],
              actions: [
                { label: 'Registrarme como Fixer', href: '/registro-fixer', type: 'primary' }
              ]
            },
            {
              id: 'recibir-solicitudes',
              title: 'Recibir solicitudes de trabajo',
              description: 'Los clientes en tu área podrán encontrarte y enviarte solicitudes.',
              bullets: [
                'Activa notificaciones push',
                'Responde en menos de 2 horas',
                'Mantén disponibilidad actualizada',
                'Sé profesional'
              ]
            },
            {
              id: 'ganar-reputacion',
              title: 'Ganar reputación',
              description: 'Realiza trabajos con profesionalismo y calidad.',
              bullets: [
                'Llega puntual',
                'Comunícate claramente',
                'Mantén calidad consistente',
                'Solicita calificación'
              ]
            },
            {
              id: 'maximizar-ingresos',
              title: 'Maximizar tus ingresos',
              description: 'Aprovecha al máximo la plataforma para conseguir más trabajos.',
              bullets: [
                'Mantén perfil actualizado',
                'Responde rápido',
                'Ofrece promociones',
                'Construye base de clientes'
              ]
            }
          ]
        }
      }
    ]
  },
  'como-funciona': {
    title: 'Cómo funciona',
    icon: <Settings className="w-5 h-5" />,
    items: [
      { 
        id: 'busqueda-servicios', 
        title: 'Búsqueda de servicios', 
        pageData: { 
            id: 'p-busqueda', 
            title: 'Búsqueda de servicios', 
            accordions: [
                {
                    id: 'busqueda-texto',
                    title: 'Búsqueda por texto',
                    description: 'Usa la barra de búsqueda para encontrar servicios específicos.',
                    bullets: ['Escribe palabras clave', 'Resultados en tiempo real', 'Búsqueda por fixer o servicio']
                },
                {
                    id: 'mapa-fixers',
                    title: 'Mapa de fixers cercanos',
                    description: 'Usa el mapa interactivo para encontrar fixers cerca.',
                    bullets: ['Permite acceso a ubicación', 'Marcadores de disponibilidad', 'Ver detalles en mapa']
                }
            ] 
        } 
      },
      { 
        id: 'sistema-calificaciones', 
        title: 'Sistema de calificaciones', 
        pageData: { 
            id: 'p-calificaciones', 
            title: 'Sistema de calificaciones', 
            accordions: [
                {
                    id: 'como-calificar',
                    title: 'Cómo calificar',
                    description: 'Recibirás una notificación para calificar al fixer.',
                    bullets: ['Sé honesto', 'Califica puntualidad y calidad', 'Tu calificación es pública']
                },
                {
                    id: 'importancia',
                    title: 'Importancia',
                    description: 'Las calificaciones son fundamentales para la plataforma.',
                    bullets: ['Mejores notas aparecen primero', 'Sistema verificado']
                }
            ] 
        } 
      },
      { 
        id: 'mensajeria', 
        title: 'Mensajería y comunicación', 
        pageData: { 
            id: 'p-mensajeria', 
            title: 'Mensajería', 
            accordions: [
                {
                    id: 'chat-directo',
                    title: 'Chat directo',
                    description: 'Comunícate directamente con los fixers.',
                    bullets: ['Conversaciones privadas', 'Comparte fotos', 'Historial disponible']
                }
            ] 
        } 
      },
    ]
  },
  'cuenta-perfil': {
    title: 'Cuenta y perfil',
    icon: <User className="w-5 h-5" />,
    items: [
      { 
        id: 'crear-cuenta', 
        title: 'Crear una cuenta', 
        pageData: { 
            id: 'p-crear-cuenta', 
            title: 'Crear una cuenta', 
            accordions: [
                {
                    id: 'registro-cliente',
                    title: 'Registro como cliente',
                    description: 'Crear una cuenta es rápido y sencillo.',
                    bullets: ['Usa correo válido', 'Contraseña segura', 'Verifica tu email'],
                    actions: [{ label: 'Crear cuenta ahora', href: '/registro', type: 'primary' }]
                },
                {
                    id: 'registro-fixer-prof',
                    title: 'Registro como Fixer',
                    description: 'Proporciona información adicional sobre tus habilidades.',
                    bullets: ['Documento de identidad', 'Fotos de trabajos', 'Tarifas iniciales'],
                    actions: [{ label: 'Registrarme como Fixer', href: '/registro-fixer', type: 'primary' }]
                }
            ] 
        } 
      },
      {
        id: 'completar-perfil',
        title: 'Completar tu perfil',
        pageData: {
            id: 'p-completar',
            title: 'Completar tu perfil',
            accordions: [
                {
                    id: 'perfil-cliente',
                    title: 'Perfil de cliente',
                    description: 'Un perfil completo te ayuda a recibir mejores respuestas.',
                    bullets: ['Foto de perfil', 'Verificar teléfono', 'Ubicación', 'Métodos de pago']
                },
                {
                    id: 'perfil-fixer',
                    title: 'Perfil de Fixer',
                    description: 'Aumenta tus posibilidades de conseguir trabajos.',
                    bullets: ['Fotos profesionales', 'Experiencia', 'Certificaciones', 'Cobertura']
                }
            ]
        }
      },
      {
        id: 'configuracion',
        title: 'Configuración de cuenta',
        pageData: {
            id: 'p-config',
            title: 'Configuración',
            accordions: [
                {
                    id: 'privacidad',
                    title: 'Ajustes de privacidad',
                    description: 'Controla quién puede ver tu información.',
                    bullets: ['Visibilidad de perfil', 'Permisos de ubicación', 'Notificaciones']
                }
            ]
        }
      }
    ]
  },
  'seguridad': {
    title: 'Seguridad y confianza',
    icon: <ShieldCheck className="w-5 h-5" />,
    items: [
        { 
            id: 'verificacion', 
            title: 'Verificación de identidad', 
            pageData: { 
                id: 'p-verif', 
                title: 'Verificación de identidad', 
                accordions: [
                    {
                        id: 'proceso-verif',
                        title: 'Proceso de verificación',
                        description: 'Todos los fixers pasan por un proceso riguroso.',
                        bullets: ['Verificación de documento', 'Antecedentes', 'Validación']
                    },
                    {
                        id: 'badges',
                        title: 'Insignias',
                        description: 'Los fixers verificados reciben insignias.',
                        bullets: ['Identidad verificada', 'Profesional certificado', 'Sello de calidad']
                    }
                ] 
            } 
        },
        { 
            id: 'pagos-seguros', 
            title: 'Pagos seguros', 
            pageData: { 
                id: 'p-pagos', 
                title: 'Pagos seguros', 
                accordions: [
                    {
                        id: 'metodos',
                        title: 'Métodos de pago',
                        description: 'Aceptamos múltiples métodos para tu seguridad.',
                        bullets: ['Tarjetas', 'Transferencias', 'QR / Billeteras', 'Efectivo verificado']
                    },
                    {
                        id: 'proteccion',
                        title: 'Protección',
                        description: 'Pagos protegidos con encriptación.',
                        bullets: ['Encriptación SSL', 'Protección de fraude', 'Garantía']
                    }
                ] 
            } 
        },
        { 
            id: 'proteccion-datos', 
            title: 'Protección de datos', 
            pageData: { 
                id: 'p-datos', 
                title: 'Protección de datos', 
                accordions: [
                    {
                        id: 'politica',
                        title: 'Política de privacidad',
                        description: 'Tus datos personales nunca se comparten sin consentimiento.',
                        bullets: ['Normativas internacionales', 'Datos encriptados', 'Derecho al olvido']
                    }
                ] 
            } 
        }
    ]
  },
  'faqs': {
    title: 'Preguntas frecuentes',
    icon: <HelpCircle className="w-5 h-5" />,
    directPageData: { 
        id: 'p-faqs', 
        title: 'Preguntas Frecuentes', 
        accordions: [
            {
                id: 'faq-generales',
                title: 'Preguntas generales',
                description: 'Respuestas a las dudas más comunes.',
                bullets: [
                    '¿Cómo funciona? - Conectamos clientes con fixers',
                    '¿Es gratis? - El registro y búsqueda son gratuitos',
                    '¿Dónde opera? - Cochabamba, Bolivia'
                ]
            },
            {
                id: 'faq-pagos',
                title: 'Sobre pagos',
                description: 'Información sobre transacciones.',
                bullets: [
                    '¿Cuándo se paga? - Según acuerdo con el fixer',
                    '¿Facturas? - Sí, todos los servicios se facturan',
                    '¿Comisiones? - Pequeña comisión por transacción'
                ]
            }
        ] 
    }
  },
  'soporte': {
    title: 'Soporte y ayuda',
    icon: <Phone className="w-5 h-5" />,
    items: [
        { 
            id: 'contacto', 
            title: 'Contactar soporte', 
            pageData: { 
                id: 'p-cont', 
                title: 'Contacto', 
                accordions: [
                    {
                        id: 'canales',
                        title: 'Canales de soporte',
                        description: 'Estamos disponibles para ayudarte.',
                        bullets: ['Chat en vivo (8am-10pm)', 'Email: soporte@servineo.com', 'WhatsApp'],
                        actions: [{ label: 'Ir al centro de ayuda', href: 'https://wa.me/59160379823', type: 'secondary' }]
                    }
                ] 
            } 
        },
        { 
            id: 'videos-tutoriales', 
            title: 'Videos tutoriales', 
            pageData: { 
                id: 'p-videos', 
                title: 'Videos tutoriales', 
                accordions: [
                    {
                        id: 'tuto-cliente',
                        title: 'Para clientes',
                        description: 'Aprende visualmente a usar la plataforma.',
                        bullets: ['Cómo buscar', 'Cómo contratar', 'Gestión de perfil'],
                        actions: [
                          { label: 'Ver video tutorial', href: 'https://www.youtube.com/watch?v=5lGf_-xGDUs', type: 'primary' }
                        ]
                    },
                    {
                        id: 'tuto-fixer',
                        title: 'Para fixers',
                        description: 'Guías para profesionales.',
                        bullets: ['Perfil atractivo', 'Responder solicitudes', 'Gestionar trabajos'],
                        actions: [
                          { label: 'Ver video tutorial', href: 'https://www.youtube.com/watch?v=5lGf_-xGDUs', type: 'primary' }
                        ]
                    }
                ] 
            } 
        },
        { 
            id: 'reportar', 
            title: 'Reportar un problema', 
            pageData: { 
                id: 'p-reportar', 
                title: 'Reportar problema', 
                accordions: [
                    {
                        id: 'tipos-reporte',
                        title: 'Qué reportar',
                        description: 'Si experimentas problemas, repórtalo.',
                        bullets: ['Errores técnicos', 'Comportamiento inapropiado', 'Problemas de pago']
                    }
                ] 
            } 
        }
    ]
  }
};