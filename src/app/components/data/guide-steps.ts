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
    title: "¡Bienvenido!",
    description: "Recorrido rápido de 2 minutos por las funciones principales",
    position: "bottom",
    icon: "👋"
  },
  {
    id: 2,
    title: "Buscador",
    description: "Encuentra servicios profesionales fácilmente",
    targetElement: "#search-section",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Ventajas",
    description: "Descubre por qué nos eligen miles de usuarios",
    targetElement: "#advantages-section",
    position: "top",
    icon: "⭐"
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
    title: "Servicios",
    description: "Explora todas nuestras categorías disponibles",
    targetElement: "#servicios",
    position: "top",
    icon: "📋"
  },
  {
    id: 6,
    title: "Trabajos",
    description: "Inspírate con trabajos recientes",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 7,
    title: "Acciones",
    description: "Acceso rápido a funciones importantes",
    targetElement: "#quick-actions",
    position: "top",
    icon: "⚡"
  },
  {
    id: 8,
    title: "Ser Fixer",
    description: "Únete y genera ingresos con tus habilidades",
    targetElement: "#become-fixer",
    position: "top",
    icon: "💼"
  },
  {
    id: 9,
    title: "¡Listo!",
    description: "Ya conoces SERVINEO. ¡Empieza a usar la plataforma!",
    position: "bottom",
    icon: "🎉"
  }
];