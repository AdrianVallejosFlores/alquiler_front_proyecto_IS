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
      {/* --- Hero / inspiración --- */}
      <section id="carrusel" className="my-5">
        <CarruselInspirador />
      </section>

      {/* Botón de ayuda flotante */}
      <HelpButton />

      {/* --- Mapa --- */}
      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      {/* --- Servicios / categorías --- */}
      <section id="servicios" className="my-5 w-full">
        {/* HomeFixer solo necesita id, titulo, descripcion, icono */}
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