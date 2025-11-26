// src/app/components/data/guide-steps.ts
export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  image?: string;
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "¡Bienvenido a SERVINEO!",
    description: "Te mostraremos las funciones principales de la plataforma en un recorrido rápido de 2 minutos. Aprenderás a buscar servicios, registrarte como Fixer o cliente, y más.",
    position: "bottom"
  },
  {
    id: 2,
    title: "Encuentra lo que necesitas",
    description: "Conectamos clientes con proveedores de servicios profesionales. Desde reparaciones del hogar hasta servicios especializados.",
    targetElement: "#search-section",
    position: "bottom"
  },
  {
    id: 3,
    title: "Ventajas de SERVINEO",
    description: "Haz clic en este botón para conocer por qué miles de personas eligen SERVINEO. Descubre nuestros beneficios exclusivos, profesionales verificados y servicio a domicilio.",
    targetElement: "#advantages-section",
    position: "top"
  },
  {
    id: 4,
    title: "Mapa de Fixers Cercanos",
    description: "Visualiza en el mapa los fixers disponibles cerca de tu ubicación. Encuentra profesionales en tu área de forma rápida y conveniente.",
    targetElement: "#mapa",
    position: "left"
  },
  {
    id: 5,
    title: "Categorías de Servicios",
    description: "Explora nuestras categorías: Limpieza, Cerrajería, Vidriería, Albañilería, Mecánica, Tapicería, Informática y más.",
    targetElement: "#servicios",
    position: "top"
  },
  {
    id: 6,
    title: "Trabajos Recientes",
    description: "Consulta los trabajos más recientes realizados por nuestros fixers. Inspírate y conoce la calidad de trabajo de nuestra comunidad.",
    targetElement: "#trabajos-recientes",
    position: "top"
  },
  {
    id: 7,
    title: "Acciones Rápidas",
    description: "Accede rápidamente a funciones importantes como agregar disponibilidad, agendar servicios y ver tus trabajos.",
    targetElement: "#quick-actions",
    position: "top"
  },
  {
    id: 8,
    title: "Conviértete en Fixer",
    description: "¿Quieres ser FIXER? Únete a nuestra comunidad y empieza a generar ingresos con tus habilidades.",
    targetElement: "#become-fixer",
    position: "top"
  },
  {
    id: 9,
    title: "¡Tutorial Completado!",
    description: "Ya conoces las funciones principales de SERVINEO. Ahora estás listo para buscar servicios como cliente u ofrecer tus servicios como Fixer.",
    position: "bottom"
  }
];