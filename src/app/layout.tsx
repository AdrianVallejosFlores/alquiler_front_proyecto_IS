"use client";

import { useState, useEffect } from "react";

import { Geist, Geist_Mono, Inter, Roboto_Mono } from "next/font/google";

import "./globals.css";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";

import Header from "./components/Header/Header";
import NotificationBell from "@/components/NotificationBell";

// Fuentes
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <html
      lang="es"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${inter.variable}
        ${robotoMono.variable}
      `}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>

      <body className="bg-blue-50 text-gray-900 antialiased min-h-screen" suppressHydrationWarning>
        {/* Banner de desconexión */}
        {!isOnline && (
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
            <p className="font-semibold">Estás sin conexión</p>
            <p className="text-sm">Comprueba tu conexión a internet.</p>
          </div>
        )}

        {/* Header + campanita */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-40">
          <Header />
          <NotificationBell />
        </header>

        {/* Contenido */}
        <main className="pt-16 sm:pt-20 p-4">{children}</main>
      </body>
    </html>
  );
}
