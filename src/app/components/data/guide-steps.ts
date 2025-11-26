// src/app/components/data/guide-steps.ts
export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon: string;
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "¡Bienvenido a SERVINEO!",
    description: "Te mostraremos las funciones principales de la plataforma en un recorrido rápido de 2 minutos. Aprenderás a buscar servicios, registrarte como Fixer o cliente, y más.",
    position: "bottom",
    icon: "👋"
  },
  {
    id: 2,
    title: "Encuentra lo que necesitas",
    description: "Busca servicios profesionales fácilmente. Conectamos clientes con proveedores de servicios desde reparaciones del hogar hasta servicios especializados.",
    targetElement: "#search-section",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Ventajas de SERVINEO",
    description: "Descubre por qué miles eligen SERVINEO: profesionales verificados, servicio a domicilio y la mejor experiencia para tus proyectos.",
    targetElement: "#advantages-section",
    position: "top",
    icon: "⭐"
  },
  {
    id: 4,
    title: "Mapa de Fixers Cercanos",
    description: "Encuentra profesionales cerca de tu ubicación. Visualiza fixers disponibles en tu área de forma rápida y conveniente.",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️"
  },
  {
    id: 5,
    title: "Categorías de Servicios",
    description: "Explora todas nuestras categorías: Limpieza, Cerrajería, Vidriería, Albañilería, Mecánica, Tapicería, Informática y más.",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 6,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos recientes de nuestros fixers. Conoce la calidad y variedad de servicios en nuestra comunidad.",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 7,
    title: "Acciones Rápidas",
    description: "Accede rápido a funciones importantes: agregar disponibilidad, agendar servicios y gestionar tus trabajos.",
    targetElement: "#quick-actions",
    position: "top",
    icon: "⚡"
  },
  {
    id: 8,
    title: "Conviértete en Fixer",
    description: "¿Quieres ofrecer tus servicios? Únete a nuestra comunidad y genera ingresos con tus habilidades profesionales.",
    targetElement: "#become-fixer",
    position: "top",
    icon: "💼"
  },
  {
    id: 9,
    title: "¡Tutorial Completado!",
    description: "Ya conoces SERVINEO. Ahora estás listo para buscar servicios como cliente u ofrecer tus servicios como Fixer.",
    position: "bottom",
    icon: "🎉"
  }
];