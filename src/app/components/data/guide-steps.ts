export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: string;
  showStats?: boolean; // Para mostrar estadísticas como en imagen 2
  isFinalStep?: boolean; // Para el paso final especial
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "¡Bienvenido a SERVINEO!",
    description: "Te mostraremos las funciones principales de la plataforma en un recorrido rápido de 2 minutos. Aprenderás a buscar servicios, registrarte como Fixer o cliente, y más.",
    position: "center",
    icon: "👋",
    showStats: true
  },
  {
    id: 2,
    title: "Buscador de Servicios",
    description: "Encuentra fácilmente lo que necesitas. Escribe el servicio que buscas y encuentra proveedores calificados.",
    targetElement: "#search-header",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Categorías de Servicios",
    description: "Explora servicios organizados por categoría para tu proyecto.",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 4,
    title: "Mapa Interactivo",
    description: "Encuentra fixers cerca de tu ubicación en tiempo real.",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️"
  },
  {
    id: 5,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos realizados por nuestros fixers.",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 6,
    title: "¡Tutorial Completado!",
    description: "Ya conoces las funciones principales de SERVINEO. Ahora estás listo para:",
    position: "center",
    icon: "🎉",
    isFinalStep: true
  }
];