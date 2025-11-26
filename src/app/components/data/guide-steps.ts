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
    description: "Te mostraremos las funciones principales en 2 minutos",
    position: "bottom",
    icon: "👋"
  },
  {
    id: 2,
    title: "Buscador",
    description: "Encuentra servicios profesionales fácilmente",
    targetElement: "#search-header", // BUSCADOR DEL HEADER DESKTOP
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Categorías",
    description: "Explora servicios organizados por categoría",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 4,
    title: "Mapa",
    description: "Encuentra fixers cerca de tu ubicación",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️"
  },
  {
    id: 5,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos realizados recientemente",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 6,
    title: "Acciones Rápidas",
    description: "Acceso directo a funciones importantes",
    targetElement: "#quick-actions",
    position: "top",
    icon: "⚡"
  },
  {
    id: 7,
    title: "Ser Fixer",
    description: "Únete como profesional y ofrece tus servicios",
    targetElement: "#become-fixer",
    position: "top",
    icon: "💼"
  },
  {
    id: 8,
    title: "¡Tutorial Completado!",
    description: "Ya estás listo para usar SERVINEO",
    position: "bottom",
    icon: "🎉"
  }
];