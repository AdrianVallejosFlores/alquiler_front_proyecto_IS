// src/app/Homepage/page.tsx
'use client'; // AGREGAR ESTO AL INICIO DEL ARCHIVO

import Mapa from "../components/mapa/MapaWrapper";
import CarruselOfertas from "../components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "../components/ListaCategorias/HomeFixer";
import Footer from "../components/Footer/Footer";
import CarruselInspirador from "../components/CarruselInspirador/CarruselInspirador";
import Link from "next/link";
import categorias, { type CategoriaBase } from "../components/data/categoriasData";
import HelpButton from "../components/HelpButton/HelpButton";

export default function Home() {
  return (
    <main>
      {/* Hero / inspiración */}
      <section className="my-5">
        <CarruselInspirador />
      </section>

      <HelpButton />

      {/* Mapa */}
      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      {/* Servicios / categorías */}
      <section id="servicios" className="my-5 w-full">
        <HomeFixer categorias={categorias as CategoriaBase[]} />
      </section>
       
      {/* Trabajos recientes */}
      <section 
        id="trabajos-recientes" 
        data-tutorial="recent-jobs" // ✅ Para paso 4
        className="my-5 w-full"
      >
        <CarruselOfertas />
      </section>

      {/* Acciones rápidas */}
      <section 
        className="my-10"
        data-tutorial="quick-actions" // ✅ Para paso 3
      >
        <div className="min-h-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Acciones rápidas</h2>

            <div className="flex flex-col gap-4">
              <Link
                href="/register_a_job"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors text-center"
              >
                Agregar Disponibilidad
              </Link>

              <Link
                href="/agenda_proveedor"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors text-center"
              >
                Agendar tu servicio
              </Link>

              <Link
                href="/epic_VisualizadorDeTrabajosAgendadosVistaProveedor"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-center"
              >
                Trabajos Agendados (Vista-Proveedor)
              </Link>

              <Link
                href="/epic_VisualizadorDeTrabajosAgendadosVistaCliente"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Mis Trabajos (Vista-Cliente)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ MODIFICADO: Sección Video Tutorial de Cómo ser FIXER con YouTube */}
      <section 
        data-tutorial="tutorial-video" // ✅ Para paso 6
        className="my-10"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">🎥 Video Tutorial: Cómo ser FIXER</h2>
          <div className="bg-gray-100 rounded-2xl p-6 text-center shadow-lg">
            <p className="text-gray-700 mb-6 text-lg">
              Aprende todo lo que necesitas saber para convertirte en Fixer y comenzar a ofrecer tus servicios en nuestra plataforma
            </p>
            
            {/* ✅ NUEVO: Video de YouTube integrado */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/5lGf_-xGDUs?rel=0&modestbranding=1"
                title="Video Tutorial: Cómo ser Fixer en SERVINEO"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-xl"
              />
            </div>
            
            <div className="mt-6 space-y-3">
              <p className="text-gray-600 text-sm">
                📺 <strong>Video explicativo:</strong> Conoce el proceso completo para registrarte como Fixer
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {/* ✅ CAMBIADO: Botón con verificación de login */}
                <button
                  onClick={() => {
                    // Verificar si está logueado (igual que el Header)
                    const isLoggedIn = localStorage.getItem('auth_token') || localStorage.getItem('user');
                    
                    if (!isLoggedIn) {
                      // Redirigir al login si no está logueado
                      window.location.href = '/login?next=/convertirse-fixer';
                    } else {
                      // Ir al registro Fixer si está logueado
                      window.location.href = '/convertirse-fixer';
                    }
                  }}
                  className="bg-linear-to-r from-[#52abff] to-[#11255a] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#3a9cff] hover:to-[#0e1f4d] transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🛠 Comenzar Registro
                </button>
                <a
                  href="https://youtu.be/5lGf_-xGDUs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <span>▶</span> Ver en YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}