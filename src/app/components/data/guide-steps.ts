// src/app/components/data/guide-steps.ts
export interface GuideStep {
  id: number;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: string;
  type: 'intro' | 'step' | 'final';
}

export const guideSteps: GuideStep[] = [
  {
    id: 0,
    title: "¡Bienvenido a SERVINEO!",
    description: "Te mostraremos las funciones principales de la plataforma en un recorrido rápido de 2 minutos. Aprenderás a buscar servicios, registrarte como Fixer o cliente, y más.",
    position: "center",
    icon: "👋",
    type: "intro"
  },
  {
    id: 1,
    title: "Buscador de Servicios",
    description: "Escribe el servicio que necesitas y presiona Enter para buscar. Encontrarás proveedores calificados cerca de tu ubicación.",
    targetElement: "#search-header",
    position: "bottom",
    icon: "🔍",
    type: "step"
  },
  {
    id: 2,
    title: "Categorías de Servicios",
    description: "Explora servicios organizados por categoría para encontrar fácilmente lo que necesitas.",
    targetElement: "#servicios",
    position: "top",
    icon: "📋",
    type: "step"
  },
  {
    id: 3,
    title: "Mapa Interactivo",
    description: "Encuentra fixers cerca de tu ubicación en tiempo real con nuestro mapa interactivo.",
    targetElement: "#mapa",
    position: "left",
    icon: "🗺️",
    type: "step"
  },
  {
    id: 4,
    title: "Trabajos Recientes",
    description: "Inspírate con trabajos realizados recientemente por nuestros fixers verificados.",
    targetElement: "#trabajos-recientes",
    position: "top",
    icon: "🛠️",
    type: "step"
  },
  {
    id: 5,
    title: "Ser Fixer",
    description: "¿Quieres ofrecer tus servicios? Únete como fixer y empieza a generar ingresos.",
    targetElement: "#become-fixer",
    position: "top",
    icon: "💼",
    type: "step"
  },
  {
    id: 6,
    title: "¡Tutorial Completado!",
    description: "Ya conoces las funciones principales de SERVINEO.",
    position: "center",
    icon: "🎉",
    type: "final"
  }
];