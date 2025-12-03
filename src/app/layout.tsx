"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
// import type { Metadata } from "next"; // ⚠️ En 'use client' no puedes exportar metadata, si la necesitas, muévela a un layout.server.tsx o page.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header/Header";
import NotificationBell from "../components/NotificationBell";

// 1. IMPORTA EL PROVIDER (Ajusta la ruta si tu archivo está en otro lado)
import { NotificationProvider } from "@/context/NotificationContext"; 

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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* 2. ENVUELVE TODO CON EL PROVIDER */}
        <NotificationProvider>
          
          {/* 🔴 Banner de offline */}
          {!isOnline && (
            <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
              <p className="font-semibold">Estás sin conexión</p>
              <p className="text-sm">Comprueba tu conexión a internet.</p>
            </div>
          )}

          {/* 🟦 Header */}
          <div className="relative">
            <Header />

            {/* 🔔 Campanita NOTIFICACIONES — flotante en esquina derecha */}
            <div className="fixed top-20 right-4 z-50">
              {/* Ahora este componente SÍ funcionará porque está dentro del Provider */}
              <NotificationBell />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="pt-16 sm:pt-20">
            {children}
          </div>

        </NotificationProvider>
      </body>
    </html>
  );
}