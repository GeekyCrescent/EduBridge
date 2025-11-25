import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Traducciones
const resources = {
  es: {
    translation: {
      // General
      app_name: 'EduBridge',
      tagline: 'Tu puente al nuevo hogar',
      loading: 'Cargando...',
      
      // Navegación
      nav_home: 'Inicio',
      nav_mentor: 'Mentor',
      nav_progress: 'Progreso',
      
      // Home
      welcome_back: '¡Hola de nuevo!',
      daily_mission: 'Misión del día',
      your_adventures: 'Tus aventuras',
      completed: 'completadas',
      xp_total: 'XP total',
      your_achievements: 'Tus logros',
      keep_going: '¡Vas increíble!',
      motivational_message: 'Cada paso que das te acerca más a sentirte como en casa. Recuerda: ser diferente es tu superpoder 🦸‍♂️',
      continue_exploring: 'Seguir explorando',
      
      // Aventuras
      adventure_country: 'Conoce tu nuevo país',
      adventure_country_desc: 'Descubre dónde estás ahora',
      adventure_emergency: 'Números importantes',
      adventure_emergency_desc: 'Por si necesitas ayuda',
      adventure_transport: 'Cómo moverte',
      adventure_transport_desc: 'Calles, direcciones y señales',
      adventure_school: 'Tu nueva escuela',
      adventure_school_desc: 'Clases, tareas y profes',
      adventure_culture: 'Cultura y costumbres',
      adventure_culture_desc: 'Cómo saluda la gente',
      adventure_daily: 'Cosas que verás mucho',
      adventure_daily_desc: 'Dinero, transporte y tiendas',
      adventure_weather: 'Clima y ropa',
      adventure_weather_desc: 'Qué usar según el tiempo',
      adventure_friends: 'Cómo hacer amigos',
      adventure_friends_desc: 'Frases para acercarte',
      
      // Mentor Kai
      kai_greeting_1: '¡Hola! Soy Kai, tu guía en esta aventura 🌍',
      kai_greeting_2: 'Juntos vamos a explorar tu nuevo hogar',
      kai_greeting_3: '¿Listo para aprender cosas increíbles?',
      kai_greeting_4: 'Cada día es una nueva aventura 💚',
      
      // Tips
      tip_please: "¿Sabías que decir 'por favor' abre muchas puertas?",
      tip_completed: '¡Genial! Ya completaste 2 aventuras hoy 🎉',
      tip_help: '¿Necesitas ayuda con algo específico?',
      
      // Logros
      achievement_explorer: 'Explorador',
      achievement_explorer_desc: 'Primera aventura',
      achievement_prepared: 'Preparado',
      achievement_prepared_desc: 'Números guardados',
      achievement_star: 'Estrella',
      achievement_star_desc: '3 estrellas',
      achievement_legend: 'Leyenda',
      achievement_legend_desc: 'Todas completadas',
      
      // Árbol de habilidades
      skill_tree: 'Árbol de habilidades',
      your_progress: 'TU PROGRESO',
      xp_earned: 'XP ganados',
      all_categories: 'Todas',
      category_cultural: 'Cultural',
      category_language: 'Idioma',
      category_academic: 'Académico',
      category_social: 'Social',
      experience: 'Experiencia',
      unlocked_with: 'Desbloqueado con:',
      practice: 'Practicar',
      progress_summary: 'Resumen de progreso',
      keep_it_up: '¡Sigue así!',
      skill_message: 'Cada habilidad que desbloqueas te acerca más a sentirte como en casa 🏠',
      
      // Celebraciones
      celebration_level_up: '¡Subiste de nivel!',
      celebration_achievement: '¡Nuevo logro desbloqueado!',
      celebration_streak: '¡Racha de {days} días!',
      celebration_complete: '¡Aventura completada!',
      
      // Errores
      error_connection: 'Error de conexión',
      error_try_again: 'Inténtalo de nuevo',
    },
  },
  en: {
    translation: {
      // General
      app_name: 'EduBridge',
      tagline: 'Your bridge to a new home',
      loading: 'Loading...',
      
      // Navigation
      nav_home: 'Home',
      nav_mentor: 'Mentor',
      nav_progress: 'Progress',
      
      // Home
      welcome_back: 'Welcome back!',
      daily_mission: 'Daily mission',
      your_adventures: 'Your adventures',
      completed: 'completed',
      xp_total: 'Total XP',
      your_achievements: 'Your achievements',
      keep_going: 'You\'re doing great!',
      motivational_message: 'Every step you take brings you closer to feeling at home. Remember: being different is your superpower 🦸‍♂️',
      continue_exploring: 'Keep exploring',
      
      // Adventures
      adventure_country: 'Know your new country',
      adventure_country_desc: 'Discover where you are now',
      adventure_emergency: 'Important numbers',
      adventure_emergency_desc: 'In case you need help',
      adventure_transport: 'How to get around',
      adventure_transport_desc: 'Streets, directions and signs',
      adventure_school: 'Your new school',
      adventure_school_desc: 'Classes, homework and teachers',
      adventure_culture: 'Culture and customs',
      adventure_culture_desc: 'How people greet each other',
      adventure_daily: 'Things you\'ll see often',
      adventure_daily_desc: 'Money, transport and stores',
      adventure_weather: 'Weather and clothes',
      adventure_weather_desc: 'What to wear for the weather',
      adventure_friends: 'How to make friends',
      adventure_friends_desc: 'Phrases to get closer',
      
      // Mentor Kai
      kai_greeting_1: 'Hi! I\'m Kai, your guide on this adventure 🌍',
      kai_greeting_2: 'Together we\'re going to explore your new home',
      kai_greeting_3: 'Ready to learn amazing things?',
      kai_greeting_4: 'Every day is a new adventure 💚',
      
      // Tips
      tip_please: 'Did you know that saying \'please\' opens many doors?',
      tip_completed: 'Great! You completed 2 adventures today 🎉',
      tip_help: 'Need help with something specific?',
      
      // Achievements
      achievement_explorer: 'Explorer',
      achievement_explorer_desc: 'First adventure',
      achievement_prepared: 'Prepared',
      achievement_prepared_desc: 'Numbers saved',
      achievement_star: 'Star',
      achievement_star_desc: '3 stars',
      achievement_legend: 'Legend',
      achievement_legend_desc: 'All completed',
      
      // Skill tree
      skill_tree: 'Skill tree',
      your_progress: 'YOUR PROGRESS',
      xp_earned: 'XP earned',
      all_categories: 'All',
      category_cultural: 'Cultural',
      category_language: 'Language',
      category_academic: 'Academic',
      category_social: 'Social',
      experience: 'Experience',
      unlocked_with: 'Unlocked with:',
      practice: 'Practice',
      progress_summary: 'Progress summary',
      keep_it_up: 'Keep it up!',
      skill_message: 'Every skill you unlock brings you closer to feeling at home 🏠',
      
      // Celebrations
      celebration_level_up: 'Level up!',
      celebration_achievement: 'New achievement unlocked!',
      celebration_streak: '{days} day streak!',
      celebration_complete: 'Adventure completed!',
      
      // Errors
      error_connection: 'Connection error',
      error_try_again: 'Try again',
    },
  },
  pt: {
    translation: {
      // General
      app_name: 'EduBridge',
      tagline: 'Sua ponte para um novo lar',
      loading: 'Carregando...',
      
      // Navigation
      nav_home: 'Início',
      nav_mentor: 'Mentor',
      nav_progress: 'Progresso',
      
      // Home
      welcome_back: 'Bem-vindo de volta!',
      daily_mission: 'Missão do dia',
      your_adventures: 'Suas aventuras',
      completed: 'completadas',
      xp_total: 'XP total',
      your_achievements: 'Suas conquistas',
      keep_going: 'Você está indo muito bem!',
      motivational_message: 'Cada passo que você dá te aproxima de se sentir em casa. Lembre-se: ser diferente é seu superpoder 🦸‍♂️',
      continue_exploring: 'Continuar explorando',
      
      // Mentor Kai
      kai_greeting_1: 'Olá! Sou Kai, seu guia nesta aventura 🌍',
      kai_greeting_2: 'Juntos vamos explorar seu novo lar',
      kai_greeting_3: 'Pronto para aprender coisas incríveis?',
      kai_greeting_4: 'Cada dia é uma nova aventura 💚',
    },
  },
  fr: {
    translation: {
      app_name: 'EduBridge',
      tagline: 'Ton pont vers un nouveau foyer',
      loading: 'Chargement...',
      nav_home: 'Accueil',
      nav_mentor: 'Mentor',
      nav_progress: 'Progrès',
      welcome_back: 'Bon retour!',
      daily_mission: 'Mission du jour',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.split('-')[0], // Detecta idioma del dispositivo
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;