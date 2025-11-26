export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: string;
  isFinalStep?: boolean;
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "Buscador de Servicios",
    description: "Encuentra fácilmente lo que necesitas. Escribe el servicio que buscas y encuentra proveedores calificados.",
    targetElement: "#search-header",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 2,
    title: "Categorías de Servicios",
    description: "Explora servicios organizados por categoría para tu proyecto.",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 3,
    title: "Mapa Interactivo",
    description: "Encuentra fixers cerca de tu ubicación en tiempo real.",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️"
  },
  {
    id: 4,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos realizados por nuestros fixers.",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 5,
    title: "Ser Fixer",
    description: "Únete como profesional y ofrece tus servicios.",
    targetElement: "#become-fixer",
    position: "top",
    icon: "💼"
  },
  {
    id: 6,
    title: "¡Tutorial Completado!",
    description: "Ya conoces las funciones principales de SERVINEO.",
    position: "center",
    icon: "🎉",
    isFinalStep: true
  }
];