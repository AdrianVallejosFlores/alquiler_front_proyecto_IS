//src/app/Homepage/page.tsx
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
       
      {/* ✅ NUEVO: Sección de Soporte con data-tutorial */}
      <section 
        id="soporte" 
        data-tutorial="support-section" // ✅ NUEVO: Para paso 2
        className="my-10 bg-blue-50 p-6 rounded-lg"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#11255a] mb-4">💬 Soporte al Cliente</h2>
          <p className="text-gray-700 mb-4">
            ¿Necesitas ayuda? Nuestro equipo de soporte está disponible para asistirte
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+59173782241" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              📞 Llamar
            </a>
            <a href="mailto:servineobol@gmail.com" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              ✉️ Email
            </a>
          </div>
        </div>
      </section>

      {/* Trabajos recientes */}
      <section 
        id="trabajos-recientes" 
        data-tutorial="recent-jobs" // ✅ NUEVO: Para paso 4
        className="my-5 w-full"
      >
        <CarruselOfertas />
      </section>

      {/* Acciones rápidas */}
      <section 
        className="my-10"
        data-tutorial="quick-actions" // ✅ NUEVO: Para paso 3
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

      {/* ✅ NUEVO: Sección Ser Fixer */}
      <section 
        data-tutorial="become-fixer" // ✅ NUEVO: Para paso 5
        className="my-10 bg-linear-to-r from-[#11255a] to-[#52abff] text-white p-8 rounded-lg"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">🛠️ ¿Quieres ser Fixer?</h2>
          <p className="mb-6 text-blue-100">
            Únete a nuestra comunidad y comienza a generar ingresos con tus habilidades profesionales
          </p>
          <Link
            href="/convertirse-fixer"
            className="bg-white text-[#11255a] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Convertirse en Fixer
          </Link>
        </div>
      </section>

      {/* ✅ NUEVO: Sección Video Explicativo */}
      <section 
        data-tutorial="tutorial-video" // ✅ NUEVO: Para paso 6
        className="my-10"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">🎥 Video Tutorial de SERVINEO</h2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              Mira nuestro video explicativo para conocer todas las funciones de la plataforma
            </p>
            <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">[Espacio para video explicativo]</p>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Ver Video Tutorial
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}