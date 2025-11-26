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
    <main className="bg-linear-to-b from-white to-gray-50">
      {/* --- Sección de búsqueda --- */}
      <section id="search-section" className="py-12 bg-linear-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-blue-100">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Encuentra lo que necesitas
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Conectamos clientes con proveedores de servicios profesionales.<br />
              Desde reparaciones del hogar hasta servicios especializados.
            </p>
            
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Qué servicio necesitas?"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg transition-all duration-200"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  🔍 Buscar
                </button>
              </div>
            </div>

            {/* Estadísticas mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-blue-100">
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600 font-medium">FIXERS activos</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-green-100">
                <div className="text-3xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">1,200+</div>
                <div className="text-sm text-gray-600 font-medium">Servicios completados</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-purple-100">
                <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">4.8</div>
                <div className="text-sm text-gray-600 font-medium">Calificación promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Hero / inspiración --- */}
      <section id="carrusel" className="py-8">
        <CarruselInspirador />
      </section>

      {/* Botón de ayuda flotante */}
      <HelpButton />

      {/* --- Ventajas de SERVINEO --- */}
      <section id="advantages-section" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Ventajas de SERVINEO
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Descubre por qué miles de personas confían en nosotros para sus proyectos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                ✅
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Profesionales Verificados</h3>
              <p className="text-gray-600">Todos nuestros fixers pasan por un riguroso proceso de verificación para garantizar calidad y confianza.</p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                🏠
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Servicio a Domicilio</h3>
              <p className="text-gray-600">Los profesionales van hasta tu ubicación para realizar el trabajo donde más te convenga.</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                🔒
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Pago Seguro</h3>
              <p className="text-gray-600">Sistema de pago 100% seguro con garantía de satisfacción y protección al cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Mapa --- */}
      <section id="mapa" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Fixers cerca de ti
          </h2>
          <Mapa />
        </div>
      </section>

      {/* --- Servicios / categorías --- */}
      <section id="servicios" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestros Servicios
          </h2>
          <HomeFixer categorias={categorias as CategoriaBase[]} />
        </div>
      </section>

      {/* --- Trabajos recientes --- */}
      <section id="trabajos-recientes" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Trabajos Recientes
          </h2>
          <CarruselOfertas />
        </div>
      </section>

      {/* --- Acciones rápidas --- */}
      <section id="quick-actions" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
            <h2 className="text-3xl font-bold text-center mb-8">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/register_a_job"
                className="bg-white text-blue-600 py-4 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                📅 Agregar Disponibilidad
              </Link>
              <Link
                href="/agenda_proveedor"
                className="bg-white text-blue-600 py-4 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                ⚡ Agendar tu servicio
              </Link>
              <Link
                href="/epic_VisualizadorDeTrabajosAgendadosVistaProveedor"
                className="bg-white text-blue-600 py-4 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                👨‍💼 Trabajos Agendados
              </Link>
              <Link
                href="/epic_VisualizadorDeTrabajosAgendadosVistaCliente"
                className="bg-white text-blue-600 py-4 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                📋 Mis Trabajos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Sección para convertirse en Fixer --- */}
      <section id="become-fixer" className="py-16 bg-linear-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres ser Fixer?
            </h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Únete a nuestra comunidad y empieza a generar ingresos con tus habilidades profesionales.
            </p>
            <Link
              href="/convertir-fixer"
              className="inline-block bg-white text-blue-600 py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              💼 Regístrate como Fixer
            </Link>
          </div>
        </div>
      </section>

      {/* --- Pie de página --- */}
      <Footer />
    </main>
  );
}