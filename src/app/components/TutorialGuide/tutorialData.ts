import { TutorialStep } from './types';

export const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Paso 1 de 6: Barra de búsqueda",
    description: "🔍 Aquí puedes buscar cualquier servicio que necesites. Escribe lo que buscas y encuentra Fixers calificados en segundos.",
    targetElement: "search-bar",
    position: "bottom",
    icon: "🔍"
  },
  {
    id: 2,
    title: "Paso 2 de 6: Soporte",
    description: "💬 ¿Tienes preguntas? Nuestro equipo de soporte está aquí para ayudarte 24/7. Contáctanos por chat, teléfono o email.",
    targetElement: "support-section",
    position: "bottom",
    icon: "💬"
  },
  {
    id: 3,
    title: "Paso 3 de 6: Agendar servicio",
    description: "📅 Programa tus servicios fácilmente. Selecciona fecha, hora y describe lo que necesitas. Los Fixers confirmarán su disponibilidad.",
    targetElement: "quick-actions",
    position: "bottom",
    icon: "📅"
  },
  {
    id: 4,
    title: "Paso 4 de 6: Trabajos recientes",
    description: "⭐ Revisa tus trabajos anteriores y los comentarios de otros usuarios. Mantén un historial organizado de todos tus servicios.",
    targetElement: "recent-jobs",
    position: "top",
    icon: "⭐"
  },
  {
    id: 5,
    title: "Paso 5 de 6: Ser Fixer",
    description: "🛠️ ¿Quieres ofrecer tus servicios? Únete como Fixer y comienza a generar ingresos con tus habilidades profesionales.",
    targetElement: "become-fixer",
    position: "top",
    icon: "🛠️"
  },
  {
    id: 6,
    title: "Paso 6 de 6: Video explicativo",
    description: "🎥 Mira nuestro video tutorial para conocer todas las funciones avanzadas de SERVINEO y sacarle el máximo provecho.",
    targetElement: "tutorial-video",
    position: "top",
    icon: "🎥"
  }
];

export const tutorialFeatures = [
  { name: "Barra de búsqueda", icon: "🔍" },
  { name: "Soporte al cliente", icon: "💬" },
  { name: "Agendar servicios", icon: "📅" },
  { name: "Trabajos recientes", icon: "⭐" },
  { name: "Ser Fixer", icon: "🛠️" },
  { name: "Video tutorial", icon: "🎥" }
];