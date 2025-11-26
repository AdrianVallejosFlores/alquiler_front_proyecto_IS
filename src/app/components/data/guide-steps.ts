export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: string;
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "Buscador de Servicios",
    description: "Escribe el servicio que necesitas y presiona Enter para buscar. Encontrarás proveedores calificados cerca de tu ubicación.",
    targetElement: "#search-header",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 2,
    title: "Categorías de Servicios",
    description: "Explora servicios organizados por categoría para encontrar fácilmente lo que necesitas.",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 3,
    title: "Mapa Interactivo",
    description: "Encuentra fixers cerca de tu ubicación en tiempo real con nuestro mapa interactivo.",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️"
  },
  {
    id: 4,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos realizados recientemente por nuestros fixers verificados.",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 5,
    title: "Ser Fixer",
    description: "¿Quieres ofrecer tus servicios? Únete como fixer y empieza a generar ingresos.",
    targetElement: "#become-fixer",
    position: "top",
    icon: "💼"
  },
  {
    id: 6,
    title: "¡Tutorial Completado!",
    description: "Ya conoces las funciones principales de SERVINEO.",
    position: "center",
    icon: "🎉"
  }
];