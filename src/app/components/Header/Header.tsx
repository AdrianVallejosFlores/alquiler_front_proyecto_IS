'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import Icono from './Icono';
import { useRouter, usePathname } from 'next/navigation';
import SimpleProfileMenu from '@/app/Menu/components/Menu';
import { useForceLogout } from "../../teamsys/hooks/useForceLogout";
import { clearSession, getStoredUser, getToken, SESSION_EVENTS, type StoredUser } from '@/lib/auth/session';
import { STORAGE_KEYS, removeFromStorage } from '@/app/convertirse-fixer/storage';

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [areButtonsVisible, setAreButtonsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   // control si el menu esta visible
   const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // NUEVO: solo cuando esto sea true creamos socket
  const [canInitSocket, setCanInitSocket] = useState(false);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const lastScrollY = useRef(0);
  const isSocketReady = useForceLogout(
    isLoggedIn && canInitSocket ? userId : null
  );
  const handleHomeClick = () => {
    // Si el socket NO está formado, limpiamos
    
    if (!isSocketReady) {
      // lo que pediste:
      sessionStorage.clear(); // o solo algunas claves si prefieres
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    }
    // No hace falta router.push aquí, Link ya navega a "/"
  };
  const router = useRouter();
  // Detectar si es móvil
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkSize = () => setIsMobile(window.innerWidth < 640);
  checkSize();
  window.addEventListener("resize", checkSize);
  return () => window.removeEventListener("resize", checkSize);
}, []);
  const pathname = usePathname();

  const syncSession = useCallback(() => {
    setIsLoggedIn(Boolean(getToken()));
    setCurrentUser(getStoredUser());
  }, []);

  useEffect(() => {
    setIsClient(true);

    // Verificar si hay un token de sesión al cargar el componente
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      setCanInitSocket(true);
    }
    try {
      const raw =
        sessionStorage.getItem("userData") ||
        localStorage.getItem("userData");

      if (raw) {
        const parsed = JSON.parse(raw);
        const id = parsed._id || null;
        setUserId(id);
      }
    } catch (e) {
      console.error("[Header] error leyendo userData:", e);
    }
    syncSession();

    const handleScroll = () => {
      if (window.innerWidth < 640) {
        setAreButtonsVisible(window.scrollY <= lastScrollY.current || window.scrollY === 0);
        lastScrollY.current = window.scrollY;
      }
    };

    // Escuchar evento de login exitoso
    const handleLoginExitoso = () => {
      setIsLoggedIn(true);
      setCanInitSocket(true);

      try {
        const raw =
          sessionStorage.getItem("userData") ||
          localStorage.getItem("userData");
        if (raw) {
          const parsed = JSON.parse(raw);
          const id = parsed._id || null;
          setUserId(id);
        }
      } catch (e) {
        console.error("[Header] error leyendo userData tras login:", e);
      }
    };

    // Escuchar evento de logout
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setCanInitSocket(false);
      setUserId(null);
    };

    const handleSessionChange = () => {
      syncSession();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener(SESSION_EVENTS.login, handleSessionChange);
    window.addEventListener(SESSION_EVENTS.logout, handleSessionChange);
    window.addEventListener(SESSION_EVENTS.updated, handleSessionChange);
    window.addEventListener('loginExitoso', handleLoginExitoso);
    window.addEventListener('logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener(SESSION_EVENTS.login, handleSessionChange);
      window.removeEventListener(SESSION_EVENTS.logout, handleSessionChange);
      window.removeEventListener(SESSION_EVENTS.updated, handleSessionChange);
      window.removeEventListener('loginExitoso', handleLoginExitoso);
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, [syncSession]);

  // Ocultar barra de búsqueda en login y registro
  const shouldShowSearchBar = !['/login', '/registro'].includes(pathname);

  // cerrar menu al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
    
      // Solo crea socket cuando hay login + userId válido

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push('/404');
    }
  };

  const handleLogout = () => {
    clearSession();
    Object.values(STORAGE_KEYS).forEach((key) => removeFromStorage(key));
    setIsLoggedIn(false);
    setCurrentUser(null);
    setMenuVisible(false);

    window.dispatchEvent(new CustomEvent(SESSION_EVENTS.logout));
    window.dispatchEvent(new CustomEvent(SESSION_EVENTS.updated));

    router.push('/');
  };

  const fixerId = currentUser?.fixerId ?? null;
  const fixerCtaHref = fixerId ? `/fixers/${fixerId}` : '/convertirse-fixer';
  const fixerCtaLabel = fixerId ? 'Mi perfil Fixer' : 'Ser Fixer';
  const rawName = currentUser?.nombre?.trim();
  const displayName = rawName && rawName.length > 0 ? rawName.split(/\s+/)[0] : currentUser?.correo ?? 'Usuario';

  if (!isClient) return null;

  const hideAuthButtons = pathname?.startsWith('/convertirse-fixer');
  const loginFixerRedirect = '/login?next=/convertirse-fixer';
  const fixerEntryHref = isLoggedIn ? fixerCtaHref : loginFixerRedirect;
  const fixerEntryLabel = isLoggedIn ? fixerCtaLabel : 'Ser Fixer';

  return (
    <>
      {/* HEADER DESKTOP / TABLET */}
      <header className="hidden sm:flex items-center justify-between p-4 bg-[#EEF7FF] shadow-md fixed top-0 left-0 w-full z-50">
        <div className="flex items-center">
          <Link href="/" onClick={handleHomeClick}>
            <Icono size={40} />
          </Link>
          <span className="ml-2 text-xl font-bold text-[#11255A]">Servineo</span>
        </div>

        <div className="grow mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              onKeyDown={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-[#D8ECFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a87ff] bg-white text-[#11255A]"
            />
            <svg
              className="absolute w-5 h-5 text-[#89C9FF] left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Si estamos en login/registro, centrar los elementos */}
        {!shouldShowSearchBar && <div className="grow"></div>}

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/ser-fixer">
                <button className="px-4 py-2 font-semibold text-[#ffffff] bg-[#2a87ff] rounded-md hover:bg-[#1a347a] transition-colors">
                  Ser Fixer
                </button>
              </Link>

              <Link href="/login">
                <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] transition-colors">
                  Iniciar Sesión
                </button>
              </Link>

              <Link href="/registro">
                <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] transition-colors">
                  Registrarse
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/ser-fixer">
                <button className="px-4 py-2 font-semibold text-[#ffffff] bg-[#2a87ff] rounded-md hover:bg-[#1a347a] transition-colors">
                  Ser Fixer
                </button>
              </Link>
              
              {/* ICONO CON MENÚ PERSONALIZADO */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-[#11255A]">Usuario</span>

                <div className="relative menu-container">
                  <svg
                    onClick={() => setMenuVisible(!menuVisible)} // 👈 Al hacer clic, abre/cierra tu menú
                    className="w-8 h-8 text-[#2a87ff] cursor-pointer"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>

                  {menuVisible && (
                    <div className="absolute right-0 mt-2 z-50">
                      <SimpleProfileMenu /> {/* 👈 Tu menú reemplaza el botón Cerrar Sesión */}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {hideAuthButtons ? null : (
            !isLoggedIn ? (
              <>
                <Link href={fixerEntryHref}>
                  <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#1a347a] transition-colors">
                    {fixerEntryLabel}
                  </button>
                </Link>
                <Link href="/offers">
                  <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] transition-colors">
                    Ofertas de Trabajo
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] transition-colors">
                    Iniciar Sesion
                  </button>
                </Link>
                <Link href="/registro">
                  <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] transition-colors">
                    Registrarse
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href={fixerCtaHref}>
                  <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#1a347a] transition-colors">
                    {fixerCtaLabel}
                  </button>
                </Link>
                <Link href="/offers">
                  <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] transition-colors">
                    Ofertas de Trabajo
                  </button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#11255A]">{displayName}</span>
                  <div className="relative group">
                    <svg
                      className="w-8 h-8 text-[#2a87ff] cursor-pointer"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesion
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </header>


      {/* HEADER MOVIL SUPERIOR */}
      <header className="sm:hidden fixed top-0 left-0 w-full p-2 bg-[#EEF7FF] shadow-md z-50">
        <div className="flex items-center space-x-2 w-full">
          <Link href="/">
            <Icono size={28} />
          </Link>
          {/* BARRA DE BÚSQUEDA MÓVIL - Solo mostrar si no estamos en login/registro */}
          {shouldShowSearchBar && (
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar"
                onKeyDown={handleSearch}
                className="w-full px-3 py-1.5 pl-9 border border-[#D8ECFF] rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#2a87ff] bg-white text-[#11255A]"
              />
              <svg
                className="absolute w-4 h-4 text-[#89C9FF] left-2.5 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          )}
          {/* Si estamos en login/registro, ocupar el espacio restante */}
          {!shouldShowSearchBar && <div className="flex-1"></div>}
        </div>
      </header>

      {/* FOOTER MOVIL INFERIOR */}
      <footer
        className={`sm:hidden fixed left-0 w-full px-3 py-2 bg-[#EEF7FF] shadow-md z-50
          transition-all duration-300 ease-in-out
          ${areButtonsVisible ? 'bottom-0' : '-bottom-24'}`}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[#11255A] font-bold text-sm">Servineo</span>

          {!isLoggedIn ? (
            <div className="flex w-full space-x-1">
              <Link href="/login" className="flex-1">
                <button className="w-full px-2 py-1.5 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] text-xs">
                  Iniciar Sesión
                </button>
              </Link>

              <Link href="/registro" className="flex-1">
                <button className="w-full px-2 py-1.5 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] text-xs">
                  Registrarse
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 w-full">
              <Link href="/ser-fixer" className="flex-1">
                <button className="w-full px-2 py-1 text-xs font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#1a347a]">
                  Ser Fixer
                </button>
              </Link>
              <div className="relative menu-container flex items-center space-x-1 flex-1 justify-end">
                <span className="text-[#11255A] text-xs font-semibold truncate">Usuario</span>
                <svg
                  onClick={() => setMenuVisible(!menuVisible)} // 👈 Misma lógica para móvil
                  className="w-5 h-5 text-[#2a87ff] cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>

                {/* Escritorio: menú cae hacia abajo */}
{menuVisible && !isMobile && (
  <div className="absolute right-0 top-full mt-2 z-50">
    <SimpleProfileMenu />
  </div>
)}

{/* Móvil: menú sube hacia arriba */}
{menuVisible && isMobile && (
  <div className="absolute right-0 bottom-full mb-2 z-50">
    <SimpleProfileMenu />
  </div>
)}
              </div>
            </div>
          )}
          {hideAuthButtons ? null : (
            !isLoggedIn ? (
              <div className="flex w-full space-x-1">
                <Link href="/offers" className="flex-1">
                  <button className="w-full px-2 py-1.5 font-semibold text-white bg-[#1f7ae5] rounded-md hover:bg-[#1353a8] text-xs">
                    Ofertas
                  </button>
                </Link>
                <Link href="/login" className="flex-1">
                  <button className="w-full px-2 py-1.5 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] text-xs">
                    Iniciar Sesion
                  </button>
                </Link>
                <Link href="/registro" className="flex-1">
                  <button className="w-full px-2 py-1.5 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] text-xs">
                    Registrarse
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 w-full">
                <Link href="/offers" className="flex-1">
                  <button className="w-full px-2 py-1 text-xs font-semibold text-white bg-[#1f7ae5] rounded-md hover:bg-[#1353a8]">
                    Ofertas
                  </button>
                </Link>
                <Link href={fixerCtaHref} className="flex-1">
                  <button className="w-full px-2 py-1 text-xs font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#1a347a]">
                    {fixerCtaLabel}
                  </button>
                </Link>
                <div className="flex items-center space-x-1 flex-1 justify-end">
                  <span className="text-[#11255A] text-xs font-semibold truncate">{displayName}</span>
                  <div className="relative group">
                    <svg
                      className="w-5 h-5 text-[#2a87ff] cursor-pointer"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </footer>

      <div className="h-16 sm:h-0" />
    </>
  );
}