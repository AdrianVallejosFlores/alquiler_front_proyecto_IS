"use client";

import { useState, useEffect } from "react";
import Header from "./Header/Header";
import { useUsuarioNuevo } from "../hooks/useUsuarioNuevo";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  // Aunque no se usen aquí, mantenemos el hook por si es necesario en componentes hijos
  const { modalAbierto, cerrarModal } = useUsuarioNuevo();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Asegurarse de que window existe antes de usar navigator
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
    <>
      {/* Banner de "Sin Conexión" */}
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
          <p className="font-semibold">Estás sin conexión</p>
          <p className="text-sm">Comprueba tu conexión a internet.</p>
        </div>
      )}

      <Header />

      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16 sm:pb-0 pt-16 sm:pt-20">
          {children}
        </main>
      </div>
    </>
  );
}
