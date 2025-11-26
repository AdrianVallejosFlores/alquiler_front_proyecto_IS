// src/app/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header/Header";
import InteractiveGuide from "./components/ui/interactive-guide";
import { useInteractiveGuide } from "./hooks/use-interactive-guide";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOnline, setIsOnline] = useState(true);
  
  // Hook de la guía interactiva
  const {
    isGuideActive,
    currentStep,
    isFirstVisit,
    startGuide,
    nextStep,
    prevStep,
    closeGuide,
    restartGuide
  } = useInteractiveGuide();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Escuchar evento para iniciar guía desde el footer
    const handleStartGuide = () => {
      startGuide();
    };

    window.addEventListener('startInteractiveGuide', handleStartGuide);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener('startInteractiveGuide', handleStartGuide);
    };
  }, [startGuide]);

  // Efecto para iniciar automáticamente en la primera visita
  useEffect(() => {
    if (isFirstVisit) {
      // Pequeño delay para asegurar que la página esté cargada
      const timer = setTimeout(() => {
        startGuide();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, startGuide]);

  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGuideActive) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'Escape':
          e.preventDefault();
          closeGuide();
          break;
      }
    };

    if (isGuideActive) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isGuideActive, nextStep, prevStep, closeGuide]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Banner de "Sin Conexión" */}
        {!isOnline && (
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
            <p className="font-semibold">
              Estás sin conexión
            </p>
            <p className="text-sm">
              Comprueba tu conexión a internet.
            </p>
          </div>
        )}

        <Header />

        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pb-16 sm:pb-0 pt-16 sm:pt-20">
            {children}
          </main>
        </div>

        {/* Guía Interactiva */}
        <InteractiveGuide
          isActive={isGuideActive}
          currentStep={currentStep}
          onNext={nextStep}
          onPrev={prevStep}
          onClose={closeGuide}
          onRestart={restartGuide}
        />

      </body>
    </html>
  );
}