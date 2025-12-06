"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { NotificationProvider } from "@/context/NotificationContext";
import Header from "./components/Header/Header";
import NotificationBell from "../components/NotificationBell"; // ⬅️ AÑADIDO

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Si ya se ejecutó antes en esta pestaña, no volver a correr
    if (sessionStorage.getItem("appLoadedOnce")) return;

    const now = new Date().toISOString();
    localStorage.setItem("appLoadedAt", now);

    // 🔹 Reiniciar la condición de días cada vez que se carga desde cero
    localStorage.setItem("condicion_envio", "1");
    localStorage.setItem("lista_nuevos_servicios", "0");


    const now_hour = new Date().toISOString();
    localStorage.setItem("hora_local_actual", now_hour);

    // Marcar que ya se ejecutó
    sessionStorage.setItem("appLoadedOnce", "1");
  }, []);

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NotificationProvider>

          {!isOnline && (
            <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
              <p className="font-semibold">Estás sin conexión</p>
              <p className="text-sm">Comprueba tu conexión a internet.</p>
            </div>
          )}

          <Header />

          {/* 🔔 Campanita flotante global + BOTONES a la derecha */}
          <div className="fixed top-20 right-4 z-50 flex items-center gap-3">
            <div className="flex gap-2">

              <a
                id="btn-ir-agenda"
                href="/booking/agenda"
                className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition shadow"
              >
                Ir Agenda
              </a>

              <a
                id="btn-ir-agenda-fixer"
                href="/booking/worker"
                className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition shadow"
              >
                Ir Agenda (Fixer)
              </a>

              <a
                id="btn-ir-comision"
                href="/bitcrew/comision"
                className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition shadow"
              >
                Ir a Comisión
              </a>

              <a
                id="btn-ir-billetera"
                href="/bitcrew/wallet"
                className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition shadow"
              >
                Ir a Billetera
              </a>

            </div>

            <NotificationBell />
          </div>

          <div className="pt-16 sm:pt-20">
            {children}
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
