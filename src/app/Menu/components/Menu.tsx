'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CerrarSesiones } from "./cerrarSesiones";
import CambiarTelefono from "./cambiarTelefono";
import CambiarContrasena from "./cambiarContraseña";
import ActualizarUbicacion from "./actualizarUbicacion";
import PaginaMetodosAutenticacion from "../../metodosAutenticacion/metodosAuten/pagina";
import { MessageSeguridad } from "./messageSeguridad";
import { MensajeCerrarSesion } from "./mensajeCerrarSesion";
import SesionesDispositivos from "./sesiones-dispositivos"; 

// --- Funciones de Sesión (Importar de tu '@/lib/auth/session') ---
// NOTA: Para que esto funcione, debes importar las funciones getToken, getStoredUser, clearSession, etc.
// En este código combinado, mantengo la lógica de getToken() local del primer código, 
// pero en un proyecto real, deberías importar estas funciones.

const getToken = () => {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || null;
};

// Simulación de getStoredUser y la interfaz StoredUser (Necesario si no se importa)
interface StoredUser {
    fixerId?: string;
    nombre?: string;
    correo?: string;
}
const getStoredUser = (): StoredUser | null => {
    const stored = sessionStorage.getItem("userData") || localStorage.getItem("userData");
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
    return null;
};
// ------------------------------------------------------------------

export default function SimpleProfileMenu() {
    // --- ESTADOS DE VISIBILIDAD DE MODALES/SUBMENÚS ---
    const [showCerrarSesionMessage, setShowCerrarSesionMessage] = useState(false);
    const [showCambiarTelefono, setShowCambiarTelefono] = useState(false);
    const [showCambiarContrasena, setShowCambiarContrasena] = useState(false);
    const [showActualizarUbicacion, setShowActualizarUbicacion] = useState(false);
    const [showMetodosAutenticacion, setShowMetodosAutenticacion] = useState(false);
    const [showMessageSeguridad, setShowMessageSeguridad] = useState(false);
    const [showMensajeCerrarSesion, setShowMensajeCerrarSesion] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [showSesionesDispositivos, setShowSesionesDispositivos] = useState(false);

    // --- ESTADOS DE SESIÓN Y DATOS (Tomados del Header) ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
    
    // --- ESTADO DE BILLETERA ---
    const [loadingWallet, setLoadingWallet] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Usamos 5000 como default base

    const router = useRouter();

    const [user, setUser] = useState<{
        id: string;
        nombre: string;
        correo: string;
        fotoPerfil: string;
        telefono: string;
        fixerId?: string; 
    } | null>(null);

    // Función para sincronizar la sesión (Tomado del Header)
    const syncSession = useCallback(() => {
        setIsLoggedIn(Boolean(getToken()));
        setCurrentUser(getStoredUser());
    }, []);

    // 🔴 LÓGICA DE ACCESO A BILLETERA (Consolidada)
    const handleWalletAccess = async () => {
        if (loadingWallet) return;

        // Utilizamos currentUser para obtener el fixerId como en el Header
        const fixerId = currentUser?.fixerId;

        // 1. Validar que sea Fixer y esté logueado
        if (!fixerId) {
            console.warn("Fixer ID no disponible. Redirigiendo a /convertirse-fixer.");
            router.push('/convertirse-fixer'); // O tu ruta para ser Fixer
            return;
        }

        setLoadingWallet(true);

        try {
            const token = getToken();
            if (!token) {
                router.push('/login'); 
                return;
            }

            // 2. Llamar al Backend para buscar o crear la billetera
            // NOTE: Ajusta el API_URL si es necesario (el header usaba '/api' al final)
            const response = await fetch(`${API_URL}/api/bitcrew/wallet/fixer/${fixerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Éxito: Redirigir a la vista de billetera
                router.push(`/bitcrew/wallet?fixer_id=${fixerId}`);
            } else {
                console.error("Error al obtener billetera:", data.message);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        } finally {
            setLoadingWallet(false);
        }
    };


    // 🔴 Cerrar sesión: limpia storage y muestra mensaje de salida (Consolidada)
    const handleLogout = () => {
        // Lógica de limpieza de sesión del Header (más completa)
        // clearSession() y removeFromStorage() deben ser importados/definidos
        
        // Simulación de limpieza (basada en el SimpleProfileMenu)
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");
        
        // El resto de la lógica de SimpleProfileMenu
        setShowMensajeCerrarSesion(true);
    };


    // ✅ Handlers que usará MensajeCerrarSesion (onContinue / onCancel)
    const handleConfirmLogout = () => {
        const eventLogout = new CustomEvent("logout-exitoso");
        window.dispatchEvent(eventLogout);

        setShowMensajeCerrarSesion(false);
        router.push("/");
    };

    const handleCancelLogout = () => {
        setShowMensajeCerrarSesion(false);
    };

    // ⏳ useEffect de Sesión y Datos de Usuario
    useEffect(() => {
        // Sincronizar estado de sesión (del Header)
        syncSession(); 

        // Lógica de carga de datos de 'user' para el menú (del SimpleProfileMenu)
        const storedUser = sessionStorage.getItem("userData") || localStorage.getItem("userData");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser({
                    id: parsed._id || parsed.id || '',
                    nombre: parsed.nombre || `${parsed.firstName ?? ""} ${parsed.lastName ?? ""}`.trim() || "Usuario",
                    correo: parsed.correo || parsed.email || "correo@desconocido.com",
                    fotoPerfil: `${parsed.fotoPerfil}` || "/default-avatar.png",
                    telefono: parsed.telefono || "",
                    fixerId: parsed.fixerId || parsed.workerId // Asegúrate de obtener el fixerId
                });
            } catch (error) {
                console.error("Error al leer userData del storage:", error);
            }
        }
        
        // Efecto para el mensaje de cierre de sesión (del SimpleProfileMenu)
        if (showMensajeCerrarSesion) {
            const timer = setTimeout(() => {
                const eventLogout = new CustomEvent("logout-exitoso");
                window.dispatchEvent(eventLogout);
                setShowMensajeCerrarSesion(false);
                router.push("/");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showMensajeCerrarSesion, router, syncSession]); // Añadir syncSession a las dependencias

    
    // --- Handlers de Menú ---
    const handleContinue = () => setShowCerrarSesionMessage(false);
    const handleCancel = () => setShowCerrarSesionMessage(false);
    const handleCerrarSesionesClick = () => setShowCerrarSesionMessage(true);
    const handleCambiarTelefonoClick = () => setShowCambiarTelefono(true);
    const handleCerrarCambiarTelefono = () => setShowCambiarTelefono(false);
    const toggleSubMenu = () => setShowSubMenu(prev => !prev);
    const handleCambiarContrasenaClick = () => setShowCambiarContrasena(true);
    const handleCerrarCambiarContrasena = () => setShowCambiarContrasena(false);
    const handleActualizarUbicacionClick = () => setShowActualizarUbicacion(true);
    const handleCerrarActualizarUbicacion = () => setShowActualizarUbicacion(false);
    const handleMetodosAutenticacionClick = () => setShowMetodosAutenticacion(true);
    const handleCerrarMetodosAutenticacion = () => setShowMetodosAutenticacion(false);
    const handleSesionesDispositivosClick = () => {
        setShowSesionesDispositivos(true);
    };


    return (
        <div className="relative w-full min-w-[220px] sm:min-w-[260px] lg:min-w-[300px] max-w-sm bg-white rounded-3xl shadow-lg border border-gray-200 p-5 sm:p-6 lg:p-6">

            {/* Datos del usuario */}
            <div className="flex items-center mb-4">
                <Image
                    src={user?.fotoPerfil || "/default-avatar.png"}
                    alt="Foto de perfil"
                    width={50}
                    height={50}
                    className="rounded-full object-cover border border-gray-300"
                    unoptimized
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
                    }}
                />
                <div className="ml-3 truncate">
                    <p className="font-semibold text-gray-800 text-base sm:text-base">
                        {user?.nombre || "Cargando..."}
                    </p>
                    <p className="text-sm sm:text-sm text-gray-600">
                        {user?.correo || "Cargando..."}
                    </p>
                </div>
            </div>

            <hr className="border-gray-300 mb-3" />

            {/* Opciones Principales */}
            <button
                onClick={() => router.push("/booking/agenda/citas-agendadas")}
                className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 w-full text-left transition duration-150"
            >
                Mis Citas
            </button>


            <button
                onClick={handleWalletAccess}
                disabled={loadingWallet}
                className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 w-full text-left transition duration-150 disabled:opacity-50"
            >
                {loadingWallet ? 'Cargando Billetera...' : 'Mi Billetera'}
            </button>


            <button
                onClick={() => router.push("/booking/worker")}
                className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 w-full text-left transition duration-150"
            >
                Gestionar Citas
            </button>

            {/* Botón Configuración */}
            <button
                onClick={toggleSubMenu}
                className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 w-full text-left transition duration-150"
            >
                Configuración
            </button>

            {/* Submenú */}
            {showSubMenu && (
                <div className="flex flex-col space-y-3 pl-4 mt-3 border-l-2 border-gray-200
                                max-h-[60vh] sm:max-h-[50vh] md:max-h-[40vh] overflow-y-auto">
                    {/* Botones de configuración... */}
                    <button
                        onClick={handleCambiarContrasenaClick}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
                    >
                        Cambiar contraseña
                    </button>
                    <button
                        onClick={handleCambiarTelefonoClick}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
                    >
                        Cambiar teléfono
                    </button>
                    <button
                        onClick={handleActualizarUbicacionClick}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
                    >
                        Actualizar ubicación
                    </button>
                    <button
                        onClick={handleMetodosAutenticacionClick}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
                    >
                        Métodos de autenticación
                    </button>
                    <button
                        onClick={() => setShowMessageSeguridad(true)}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
                    >
                        Seguridad
                    </button>
                    <button
                        onClick={handleSesionesDispositivosClick}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
                    >
                        Sesiones y dispositivos
                    </button>
                    <button
                        onClick={handleCerrarSesionesClick}
                        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left mt-2"
                    >
                        Cerrar sesiones
                    </button>
                </div>
            )}

            {/* Botón Cerrar sesión principal */}
            <button
                onClick={handleLogout}
                className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left mt-3"
            >
                Cerrar sesión
            </button>

            {/* Modales (mantienen su lógica original) */}
            {showCerrarSesionMessage && (
                <CerrarSesiones onContinue={handleContinue} onCancel={handleCancel} />
            )}
            {showCambiarTelefono && (
                <CambiarTelefono
                    onClose={handleCerrarCambiarTelefono}
                    userId={user?.id || ""}
                    telefonoActual={user?.telefono || ""}
                />
            )}
            {showCambiarContrasena && (
                <CambiarContrasena onClose={handleCerrarCambiarContrasena} />
            )}
            {showActualizarUbicacion && (
                <ActualizarUbicacion onClose={handleCerrarActualizarUbicacion} />
            )}
            {showMessageSeguridad && (
                <MessageSeguridad onClose={() => setShowMessageSeguridad(false)} />
            )}
            {showMensajeCerrarSesion && (
                <MensajeCerrarSesion
                    onContinue={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                />
            )}
            {showMetodosAutenticacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Métodos de Autenticación</h2>
                            <button onClick={handleCerrarMetodosAutenticacion} className="text-gray-500 hover:text-gray-700 text-2xl font-semibold">×</button>
                        </div>
                        <div className="p-4"><PaginaMetodosAutenticacion /></div>
                        <div className="flex justify-end p-6 border-t border-gray-200">
                            <button onClick={handleCerrarMetodosAutenticacion} className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition duration-200 font-semibold">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            {showSesionesDispositivos && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[40px]">
                        <button onClick={() => setShowSesionesDispositivos(false)} className="absolute right-6 top-6 z-10 bg-white rounded-full w-9 h-9 flex items-center justify-center text-gray-700 shadow-md hover:bg-gray-100"></button>
                        <SesionesDispositivos />
                    </div>
                </div>
            )}
        </div>
    );
}