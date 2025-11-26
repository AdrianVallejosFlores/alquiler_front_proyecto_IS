export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // AÑADIR 'center'
  icon: string;
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "¡Bienvenido a SERVINEO!",
    description: "Te mostraremos las funciones principales en 2 minutos. Aprenderás a buscar servicios y usar la plataforma.",
    position: "center",
    icon: "👋"
  },
  {
    id: 2,
    title: "Buscador de Servicios",
    description: "Aquí puedes buscar cualquier servicio que necesites. Escribe lo que buscas y encuentra proveedores calificados cerca de ti.",
    targetElement: "#search-header",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Categorías de Servicios",
    description: "Explora nuestras categorías organizadas para encontrar fácilmente el servicio ideal para tu proyecto.",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 4,
    title: "Mapa Interactivo",
    description: "Encuentra fixers cerca de tu ubicación. Visualiza los profesionales disponibles en tu zona.",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️"
  },
  {
    id: 5,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos realizados recientemente por nuestros fixers verificados.",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 6,
    title: "¡Listo para Comenzar!",
    description: "Ya conoces las funciones principales. ¡Empieza a encontrar o ofrecer servicios en SERVINEO!",
    position: "center",
    icon: "🎉"
  }
];