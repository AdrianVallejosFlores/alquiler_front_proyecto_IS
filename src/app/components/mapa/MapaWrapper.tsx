// src/app/components/MapaWrapper.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BuscadorUbicaciones from "./BuscadorUbicaciones";
import FixersHeader from "./FixersHeader";
import PermisoGeolocalizacion from "./PermisoGeolocalizacion";
import { Ubicacion, Fixer, UserLocation, UbicacionFromAPI } from "../../types";
import { UbicacionManager } from "./UbicacionManager";
import Mapa from "./MapaClient";

// Ubicación por defecto
const PLAZA_PRINCIPAL: Ubicacion = {
  id: 1,
  nombre: "Plaza 14 de Septiembre",
  posicion: [-17.394211, -66.156376] as [number, number],
};

// Interfaz para la estructura REAL de tu API
interface FixerFromAPI {
  _id: string;
  fixerId: string;
  userId: string;
  name: string;
  photoUrl: string;
  whatsapp: string;
  location?: { lat: number; lng: number };
  categories: string[];
  rating?: number;
  verified?: boolean;
  termsAccepted: boolean;
  jobsCount: number;
  ratingAvg: number;
  ratingCount: number;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function MapaWrapper() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [fixersFiltrados, setFixersFiltrados] = useState<Fixer[]>([]);

  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(PLAZA_PRINCIPAL);
  const [, setUserLocation] = useState<UserLocation | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permisoDecidido, setPermisoDecidido] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ubicacionManager = UbicacionManager.getInstancia();
  const isInitialLoad = useRef(true);

  // --- GEOLOCALIZACIÓN ---
  const obtenerUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      console.log("Geolocalización no soportada");
      setPermisoDecidido(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nuevaUbicacion: UserLocation = {
          lat: latitude,
          lng: longitude,
          accuracy,
          timestamp: position.timestamp,
        };
        setUserLocation(nuevaUbicacion);

        const ubicacionTemporal: Ubicacion = {
          id: 999,
          nombre: "📍 Mi ubicación actual",
          posicion: [latitude, longitude] as [number, number],
        };

        ubicacionManager.setUbicacion(ubicacionTemporal);
        setUbicacionSeleccionada(ubicacionTemporal);
        setPermisoDecidido(true);
      },
      () => {
        console.log("Ubicación rechazada - Enfocando en Plaza Principal");
        ubicacionManager.setUbicacion(PLAZA_PRINCIPAL);
        setUbicacionSeleccionada(PLAZA_PRINCIPAL);
        setUserLocation(null);
        setPermisoDecidido(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [ubicacionManager]);

  useEffect(() => {
    const handleSolicitarGeo = () => {
      console.log("Evento 'solicitar-geolocalizacion' recibido...");
      obtenerUbicacion();
    };

    const handleLoginExitoso = () => {
      setIsLoggedIn(true);
    };

    window.addEventListener("solicitar-geolocalizacion", handleSolicitarGeo);
    window.addEventListener("login-exitoso", handleLoginExitoso);

    return () => {
      window.removeEventListener("solicitar-geolocalizacion", handleSolicitarGeo);
      window.removeEventListener("login-exitoso", handleLoginExitoso);
    };
  }, [obtenerUbicacion]);

  // --- CARGA DE DATOS (CORREGIDO) ---
  const cargarDatos = useCallback(async () => {
    // Si es la carga inicial o se pide explícitamente reintentar (cuando error existe)
    setCargando(true);
    setError(null);

    try {
      console.log("🔄 Conectando con Backend...");

      // 1. AUMENTAMOS EL TIMEOUT A 15 SEGUNDOS (Vercel Cold Start)
      const TIMEOUT_MS = 15000; 

      const [resUbicaciones, resFixers] = await Promise.all([
        //fetch("https://wallletback.vercel.app/api/ubicaciones", { 
        fetch("http://localhost:4000/api/ubicaciones", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        }),
        //fetch("https://wallletback.vercel.app/api/fixers", {
        fetch("http://localhost:4000/api/fixers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        }),
      ]);

      if (!resUbicaciones.ok) {
        throw new Error(`Error Ubicaciones: ${resUbicaciones.status}`);
      }
      if (!resFixers.ok) {
        throw new Error(`Error Fixers: ${resFixers.status}`);
      }

      const dataUbicaciones = await resUbicaciones.json();
      const dataFixers = await resFixers.json();

      console.log("✅ Datos recibidos del Backend");

      // Transformar ubicaciones
      if (dataUbicaciones.success && Array.isArray(dataUbicaciones.data)) {
        const ubicacionesTransformadas: Ubicacion[] = dataUbicaciones.data.map(
          (item: UbicacionFromAPI, index: number) => ({
            id: index + 1,
            nombre: item.nombre,
            posicion: [item.posicion.lat, item.posicion.lng] as [number, number],
          })
        );
        setUbicaciones(ubicacionesTransformadas);
      }

      // Transformar Fixers
      if (dataFixers.success && Array.isArray(dataFixers.data)) {
        const fixersTransformados: Fixer[] = dataFixers.data.map((fixer: FixerFromAPI) => {
          const posicionDefault = { lat: -17.3895, lng: -66.1568 };
          return {
            _id: fixer._id,
            nombre: fixer.name,
            posicion: fixer.location || posicionDefault,
            especialidad: fixer.categories?.join(', ') || 'Servicios generales',
            descripcion: `Profesional en ${fixer.categories?.join(', ') || 'servicios varios'}`,
            rating: fixer.rating || 4.5,
            verified: fixer.verified || false,
            whatsapp: fixer.whatsapp,
            imagenPerfil: fixer.photoUrl || '/imagenes_respaldo/perfil-default.jpg'
          };
        });
        
        setFixers(fixersTransformados);
        const cercanos = ubicacionManager.filtrarFixersCercanos(fixersTransformados);
        setFixersFiltrados(cercanos);
      }

    } catch (error: any) {
      console.error("❌ Error de conexión:", error);
      
      let msg = "Error desconocido";
      if (error.name === 'TimeoutError') {
        msg = "El servidor tardó mucho en responder (Timeout).";
      } else if (error.message.includes("Failed to fetch")) {
        msg = "No se pudo conectar al servidor. Verifica tu internet o CORS.";
      } else {
        msg = error.message;
      }
      setError(msg);
    } finally {
      setCargando(false);
      isInitialLoad.current = false;
    }
  }, [ubicacionManager]);

  useEffect(() => {
    if (!permisoDecidido) {
      ubicacionManager.setUbicacion(PLAZA_PRINCIPAL);
    }
    // Solo cargamos datos una vez al inicio o si permisoDecidido cambia
    if (isInitialLoad.current || permisoDecidido) {
        cargarDatos();
    }
  }, [permisoDecidido, ubicacionManager, cargarDatos]);

  const handleMarcadorAgregado = (lat: number, lng: number) => {
    const nuevaUbicacion: Ubicacion = {
      id: Date.now(),
      nombre: "📍 Ubicación seleccionada",
      posicion: [lat, lng] as [number, number],
    };

    ubicacionManager.setUbicacion(nuevaUbicacion);
    const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
    setFixersFiltrados(cercanos);
    setUbicacionSeleccionada(nuevaUbicacion);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-[#2a87ff]">
          Conectando con el servidor...
        </p>
        <p className="text-sm text-gray-500">Esto puede tardar unos segundos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center shadow-lg">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error de conexión</h2>
          <p className="text-red-600 mb-6 text-sm">{error}</p>
          <button
            onClick={cargarDatos}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors font-semibold shadow-md active:scale-95"
          >
            Reintentar conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <BuscadorUbicaciones
        ubicaciones={ubicaciones}
        onBuscar={(u) => {
          setUbicacionSeleccionada(u);
          ubicacionManager.setUbicacion(u);
          const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
          setFixersFiltrados(cercanos);
        }}
        ubicacionActual={ubicacionSeleccionada}
      />
      <FixersHeader />

      <Mapa
        isLoggedIn={isLoggedIn}
        ubicaciones={ubicaciones}
        fixers={fixersFiltrados}
        ubicacionSeleccionada={ubicacionSeleccionada}
        onUbicacionClick={(u) => {
          setUbicacionSeleccionada(u);
          ubicacionManager.setUbicacion(u);
          const cercanos = ubicacionManager.filtrarFixersCercanos(fixers);
          setFixersFiltrados(cercanos);
        }}
        onMarcadorAgregado={handleMarcadorAgregado}
      />

      <PermisoGeolocalizacion isLoggedIn={isLoggedIn} />
    </div>
  );
}