import { TutorialStep } from './types';

export const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Paso 1 de 6: Barra de búsqueda",
    description: "Aquí puedes buscar cualquier servicio que necesites. Escribe lo que buscas y encuentra Fixers calificados en segundos.",
    targetElement: "search-bar",
    position: "bottom"
  },
  {
    id: 5,
    title: "Paso 2 de 6: Ser Fixer",
    description: "¿Quieres ofrecer tus servicios? Haz clic aquí para convertirte en Fixer y comenzar a generar ingresos con tus habilidades profesionales.",
    targetElement: "become-fixer",
    position: "bottom"
  },
  {
    id: 4,
    title: "Paso 3 de 6: Trabajos recientes",
    description: "Revisa tus trabajos anteriores y los comentarios de otros usuarios. Mantén un historial organizado de todos tus servicios.",
    targetElement: "recent-jobs",
    position: "top"
  },
  {
    id: 3,
    title: "Paso 4 de 6: Agendar servicio",
    description: "Programa tus servicios fácilmente. Selecciona fecha, hora y describe lo que necesitas. Los Fixers confirmarán su disponibilidad.",
    targetElement: "quick-actions",
    position: "bottom"
  },
  {
    id: 6,
    title: "Paso 5 de 6: Video Tutorial",
    description: "Mira nuestro video tutorial para aprender todo sobre cómo ser Fixer y aprovechar al máximo nuestra plataforma.",
    targetElement: "tutorial-video",
    position: "top"
  },
  {
    id: 2,
    title: "Paso 6 de 6: Soporte",
    description: "¿Tienes preguntas? Nuestro equipo de soporte está aquí para ayudarte 24/7. Encuentra nuestros contactos en el footer de la página.",
    targetElement: "support-section",
    position: "top"
  }
];

export const tutorialFeatures = [
  { name: "Barra de búsqueda" },
  { name: "Soporte al cliente" },
  { name: "Agendar servicios" },
  { name: "Trabajos recientes" },
  { name: "Ser Fixer" },
  { name: "Video tutorial" }
];
