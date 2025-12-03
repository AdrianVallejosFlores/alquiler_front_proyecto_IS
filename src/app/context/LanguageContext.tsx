'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'es' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  es: {
    categories: 'Categorías',
    tagline: 'La plataforma líder que conecta clientes con proveedores de servicios profesionales. Encuentra el fixer perfecto para tu proyecto.',
    recentJobs: 'Trabajos recientes',
    map: 'Mapa',
    servicesList: 'Lista de servicios',
    carousel: 'Sección carrusel',
    systemFeatures: 'Funciones del Sistema',
    howItWorks: '¿Cómo funciona?',
    userGuide: 'Guía de Usuario',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    support: 'Soporte',
    privacyPolicy: 'Política de Privacidad',
    termsOfUse: 'Términos de uso',
    cookiesPolicy: 'Política de cookies',
    viewManual: 'Ver manual usuario',
    accessRequiredTitle: 'Acceso Requerido',
    accessRequiredBody: 'Para acceder a la Guía de Usuario, necesita estar logueado.',
    cancel: 'Cancelar',
    signIn: 'Iniciar Sesión'
  },
  en: {
    categories: 'Categories',
    tagline: 'The leading platform that connects clients with professional service providers. Find the perfect fixer for your project.',
    recentJobs: 'Recent jobs',
    map: 'Map',
    servicesList: 'Services list',
    carousel: 'Carousel section',
    systemFeatures: 'System Features',
    howItWorks: 'How it works?',
    userGuide: 'User Guide',
    login: 'Sign in',
    register: 'Register',
    support: 'Support',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    cookiesPolicy: 'Cookies Policy',
    viewManual: 'View user manual',
    accessRequiredTitle: 'Access Required',
    accessRequiredBody: 'To access the User Guide you need to be signed in.',
    cancel: 'Cancel',
    signIn: 'Sign In'
  }
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('servineo-lang') as Lang | null;
      if (stored === 'en' || stored === 'es') setLangState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('servineo-lang', lang);
      document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
  };

  const t = (key: string, fallback = '') => {
    return translations[lang]?.[key] ?? fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
