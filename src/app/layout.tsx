"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { NotificationProvider } from "@/context/NotificationContext";
import Header from "./components/Header/Header";

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
}: {
  children: React.ReactNode;
}) {
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NotificationProvider>
          {!isOnline && (
            <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
              <p className="font-semibold">Estás sin conexión</p>
              <p className="text-sm">Comprueba tu conexión a internet.</p>
            </div>
          )}

          <Header />

          <div className="pt-16 sm:pt-20">
            {children}
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
