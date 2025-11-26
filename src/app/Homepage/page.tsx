// src/app/Homepage/page.tsx

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
      {/* --- Sección de búsqueda --- */}
      <section id="search-section" className="my-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Encuentra lo que necesitas
            </h1>
            <p className="text-gray-600 mb-6">
              Conectamos clientes con proveedores de servicios profesionales.<br />
              Desde reparaciones del hogar hasta servicios especializados.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Qué servicio necesitas?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Buscar
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">FIXERS activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,200+</div>
                <div className="text-sm text-gray-600">Servicios completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <div className="text-sm text-gray-600">Calificación promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Hero / inspiración --- */}
      <section id="carrusel" className="my-5">
        <CarruselInspirador />
      </section>

      {/* Botón de ayuda flotante */}
      <HelpButton />

      {/* --- Ventajas de SERVINEO --- */}
      <section id="advantages-section" className="my-10 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Ventajas de SERVINEO</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Profesionales Verificados</h3>
              <p className="text-gray-600">Todos nuestros fixers pasan por un proceso de verificación para garantizar calidad.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Servicio a Domicilio</h3>
              <p className="text-gray-600">Los profesionales van hasta tu ubicación para realizar el trabajo.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Pago Seguro</h3>
              <p className="text-gray-600">Sistema de pago seguro y garantía de satisfacción.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Mapa --- */}
      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      {/* --- Servicios / categorías --- */}
      <section id="servicios" className="my-5 w-full">
        <HomeFixer categorias={categorias as CategoriaBase[]} />
      </section>

      {/* --- Trabajos recientes --- */}
      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>

      {/* --- Acciones rápidas --- */}
      <section id="quick-actions" className="my-10">
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

      {/* --- Sección para convertirse en Fixer --- */}
      <section id="become-fixer" className="my-10">
        <div className="min-h-0 flex items-center justify-center">
          <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">¿Quieres ser Fixer?</h2>
            <p className="mb-6">Únete a nuestra comunidad y empieza a generar ingresos con tus habilidades.</p>
            <Link
              href="/convertir-fixer"
              className="bg-white text-blue-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Regístrate como Fixer
            </Link>
          </div>
        </div>
      </section>

      {/* --- Pie de página --- */}
      <Footer />
    </main>
  );
}