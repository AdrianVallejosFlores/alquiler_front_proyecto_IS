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
       
      {/* ❌ ELIMINADO: Sección de Soporte duplicada - Ya existe en el Footer */}

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

      {/* ❌ ELIMINADO: Sección Ser Fixer duplicada - Ya existe en el Header */}

      {/* ✅ MODIFICADO: Sección Video Tutorial de Cómo ser FIXER */}
      <section 
        data-tutorial="tutorial-video" // ✅ Para paso 6
        className="my-10"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">🎥 Video Tutorial: Cómo ser FIXER</h2>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              Aprende todo lo que necesitas saber para convertirte en Fixer y comenzar a ofrecer tus servicios en nuestra plataforma
            </p>
            <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">[Video tutorial sobre cómo ser Fixer]</p>
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