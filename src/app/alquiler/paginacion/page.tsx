'use client';
import type { Filtros, ResultItem } from "../BusquedaAvanzada/BusquedaAvanzada";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "./components/jobCard";
import UserProfileCard from "./components/UserProfileCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import { Job } from "../../../types/job";
// import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado"; 
import FiltrosForm from "../Feature/Componentes/FiltroForm";
import { UsuarioResumen } from "../Feature/Types/filtroType";
import BusquedaAvanzada from "../BusquedaAvanzada/BusquedaAvanzada";

// imports para el resaltado 
import { JobCardWithHighlight } from "./components/JobCardWithHighlight";
import { UserProfileCardWithHighlight } from "./components/UserProfileCardWithHighlight";
import { useHighlighting } from "./hooks/useHighlighting";

// Componente de carga
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center p-8 min-h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando búsqueda...</span>
    </div>
  );
}

// Componente principal
function BusquedaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { searchTerms, hasHighlighting } = useHighlighting();

  const urlQuery = searchParams.get("q") || "";
  const urlPage = searchParams.get("page");
  const urlSort = searchParams.get("sort");

  // Función para capitalizar cada palabra (Title Case)
  function capitalize(texto: string) {
    if (!texto) return "";
    return texto
      .toString()
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((w) => (w.length === 0 ? '' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join(' ');
  }

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(capitalize(urlQuery));
  const [isLoading, setIsLoading] = useState(true);
  const [buscando, setBuscando] = useState(false); // Para la búsqueda manual (ya no se usa tanto)
  const [estadoBusqueda, setEstadoBusqueda] = useState<"idle" | "success" | "error">("idle");
  const [errorCaracteres, setErrorCaracteres] = useState<string>("");
  const [hasLoadedJobs, setHasLoadedJobs] = useState(false); // ¡IMPORTANTE!

  // Efecto para manejar la página desde URL o sessionStorage
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);

    if (urlPage) {
      const pageNum = parseInt(urlPage, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        currentParams.set('page', '1');
        router.replace(`?${currentParams.toString()}`, { scroll: false });
      }
    } else if (sessionStorage.getItem('lastPage')) {
      const lastPage = sessionStorage.getItem('lastPage');
      currentParams.set('page', lastPage || '1');
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    }

    if (urlPage) {
      sessionStorage.setItem('lastPage', urlPage);
    }
  }, [urlPage, router]);

  const [sortBy, setSortBy] = useState("Fecha (Reciente)");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
  type ModoVista = "jobs" | "usuarios";
  const [modoVista, setModoVista] = useState<ModoVista>("jobs");
  const [filtersNoResults, setFiltersNoResults] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [filtrosActuales, setFiltrosActuales] = useState<Filtros | null>(null);
  const itemsPerPage = 10;

  const opcionesOrdenamiento = [
    "Fecha (Reciente)",
    "Nombre A-Z",
    "Nombre Z-A",
    "Mayor Calificación (⭐)",
  ];

  const ordenarItems = (opcion: string, lista: Job[]) => {
    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => (b.company || "").localeCompare(a.company || ""));
        break;
      case "Fecha (Reciente)":
        sorted.sort(
          (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return sorted;
  };

  //  Función para normalizar texto
  const normalizar = (texto: string) =>
    texto.toLowerCase().normalize("NFD").replace(/[\u0000-\u036f]/g, "");

  
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const jobs = await getJobs();
        setAllJobs(jobs);
        setHasLoadedJobs(true); // ¡Importante! Marcamos que ya cargaron
      } catch (error) {
        console.error("Error cargando trabajos:", error);
        setAllJobs([]);
        setHasLoadedJobs(true); // Marcar como cargado incluso si hay error
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []); // El array vacío [] asegura que SOLO se ejecute una vez

  
  const performSearch = (termino: string, baseData: Job[] = allJobs) => {
    if (termino.trim() === "") {
      setSearchResults(baseData);
      return;
    }

    
    const normalizarBusqueda = (texto: string) => {
      return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[´'"]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    };

    const queryNormalizado = normalizarBusqueda(termino);
    const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

    if (tokens.length === 0) {
      setSearchResults([]);
      return;
    }
    
    // Algoritmo de búsqueda local (debe coincidir con el de BusquedaAutocompletado)
    const resultados = baseData.filter(job => {
        const tituloNormalizado = job.title ? normalizarBusqueda(job.title) : "";
        const empresaNormalizada = job.company ? normalizarBusqueda(job.company) : "";
        const serviciosNormalizados = job.service ? normalizarBusqueda(job.service) : "";

        const campos = [tituloNormalizado, empresaNormalizada, serviciosNormalizados];

        // Verificar que TODOS los tokens aparezcan en ORDEN en algún campo
        return campos.some(campoTexto => {
            if (!campoTexto) return false;

            let posicionActual = 0;
            let todosLosTokensEnOrden = true;

            for (const token of tokens) {
                const posicionToken = campoTexto.indexOf(token, posicionActual);
                if (posicionToken === -1) {
                    todosLosTokensEnOrden = false;
                    break;
                }
                posicionActual = posicionToken + token.length;
            }
            return todosLosTokensEnOrden;
        });
    });

    setSearchResults(resultados);
    // Esta función ya no retorna nada, solo actualiza el estado
  };


  useEffect(() => {
    // No hacer nada si los trabajos iniciales aún no han cargado
    if (!hasLoadedJobs) {
      return;
    }

    // Sincronizar el término de búsqueda con la URL
    setSearchTerm(capitalize(urlQuery));
    
    // Activar/desactivar estado de carga visual
    if (urlQuery.trim() !== "") {
      setIsLoading(true); // Muestra "cargando" mientras filtra
      setEstadoBusqueda("success"); // Asumimos éxito, performSearch filtra
      console.log("🔍 [Effect URL] Buscando trabajos basado en URL:", urlQuery);
      performSearch(urlQuery, allJobs); // performSearch actualiza setSearchResults
    } else {
      // Si la URL está limpia, mostrar todos los trabajos
      console.log("🔍 [Effect URL] URL limpia, mostrando todos los trabajos.");
      setSearchResults(allJobs);
      setEstadoBusqueda("idle");
    }
    
    setIsLoading(false); // Quita "cargando"

  }, [urlQuery, hasLoadedJobs, allJobs]); // ⬅️ ¡ESTA ES LA CLAVE!



  const handleAdvancedFilters = (filtros: Filtros, resultadosApi?: ResultItem[]) => {
  console.log("🟦 Filtros recibidos:", filtros);
  console.log("🟩 Resultados API recibidos:", resultadosApi);

  // Guardar los filtros actuales para resaltado
  setFiltrosActuales(filtros);

  // 1️⃣ SI LA API DEVUELVE RESULTADOS → MOSTRAR PROFESIONALES
 if (resultadosApi && resultadosApi.length > 0) {
  console.log("🟢 Mostrando resultados desde API avanzada");

  setUsuariosFiltrados(
    resultadosApi.map((item) => item as unknown as UsuarioResumen)
  );

  setModoVista("usuarios");
  setFiltrosAplicados(true);
  setFiltersNoResults(resultadosApi.length === 0);
  return;
}


  // 2️⃣ SI LA API NO DEVUELVE → usar filtro local sobre ALLJOBS
  let filtrados = allJobs.filter((job) => {
    let ok = true;

    if (filtros.tipoServicio)
      ok &&= job.title.toLowerCase().includes(filtros.tipoServicio.toLowerCase());

    if (filtros.zona)
      ok &&= job.location?.toLowerCase().includes(filtros.zona.toLowerCase());

    if (filtros.horario)
      ok &&= job.employmentType.toLowerCase() === filtros.horario.toLowerCase();

    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
      const precioNum = Number(job.salaryRange.replace(/[^0-9.-]+/g, ""));
      if (filtros.precioMin !== undefined) ok &&= precioNum >= filtros.precioMin;
      if (filtros.precioMax !== undefined) ok &&= precioNum <= filtros.precioMax;
    }

    return ok;
  });

  // 3️⃣ Si hay búsqueda en URL (?q=...), mantener tu lógica
  if (urlQuery.trim() !== "") {
    const normalizar = (t: string) =>
      t.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[´'"]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const tokens = normalizar(urlQuery).split(" ").filter((t) => t.length > 0);

    filtrados = filtrados.filter((job) => {
      const campos = [
        normalizar(job.title || ""),
        normalizar(job.company || ""),
        normalizar(job.service || "")
      ];

      return campos.some((campo) =>
        tokens.every((tk) => campo.includes(tk))
      );
    });
  }

  console.log("🟡 Mostrando resultados filtrados de trabajos");
  setSearchResults(filtrados);
  setModoVista("jobs");
  setFiltrosAplicados(true);
  setFiltersNoResults(filtrados.length === 0);
};


  const [busquedaAvanzadaAbierta, setBusquedaAvanzadaAbierta] = useState(false);

  const ordenarUsuarios = (opcion: string, lista: UsuarioResumen[]) => {
    const sorted = [...lista];
    switch (opcion) {
      case "Nombre A-Z":
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "Nombre Z-A":
        sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "Mayor Calificación (⭐)":
        sorted.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));
        break;
    }
    return sorted;
  };

  const jobsToDisplay = useMemo(() => {
    // SIEMPRE trabajar sobre searchResults
   const data = searchResults;
return ordenarItems(sortBy, data);

  }, [searchResults, sortBy]);

  const usuariosOrdenados = useMemo(
    () => ordenarUsuarios(sortBy, usuariosFiltrados),
    [sortBy, usuariosFiltrados]
  );

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(jobsToDisplay, itemsPerPage);

  const handleViewDetails = (id: string | number) => {
    router.push(`/alquiler/${id}`);
  };

 

  // CORREGIDA
  const handleClearSearch = () => {
    console.log("🧹 LIMPIANDO BÚSQUEDA COMPLETA - Restaurando estado inicial");

    // 
    if (allJobs.length > 0) {
      setSearchResults(allJobs);
    } else {
      // Recargar datos si es necesario
      console.log("🔄 Recargando datos...");
      getJobs().then(jobs => {
        setAllJobs(jobs);
        setSearchResults(jobs);
      });
    }

    // Resetear todos los estados
    setSearchTerm("");
    setFiltrosAplicados(false);
    setErrorCaracteres("");
    setUsuariosFiltrados([]);
    setModoVista("jobs");
    setFiltersNoResults(false);

    // Limpiar URL
    const params = new URLSearchParams();
    params.set('page', '1');
    router.replace(`?${params.toString()}`, { scroll: false });

    // Limpiar sessionStorage
    sessionStorage.removeItem('lastPage');

    // Resetear ordenamiento
    setTimeout(() => setSortBy("Fecha (Reciente)"), 0);

    console.log("✅ Búsqueda limpiada, estado inicial restaurado");
  };

  const handleClearFilters = () => {
    // Al limpiar filtros, mantener la búsqueda de URL si existe
    if (urlQuery && urlQuery.trim() !== "") {
      performSearch(urlQuery, allJobs);
    } else {
      setSearchResults(allJobs);
    }

    setFiltrosAplicados(false);
    setFiltersNoResults(false);
    setUsuariosFiltrados([]);
    setModoVista("jobs");
    setErrorCaracteres("");
    setSortBy("Fecha (Reciente)");
  };

  const mostrarSinResultadosFiltros =
    filtrosAplicados &&
    modoVista === "jobs" &&
    usuariosFiltrados.length === 0 &&
    filtersNoResults;

  const mostrarErrorCaracteres = errorCaracteres && !buscando;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-8">
          <BusquedaAvanzada
            onAplicarFiltros={handleAdvancedFilters}
            onLimpiarFiltros={() => handleClearFilters()}
            onToggle={(abierta: boolean) => setBusquedaAvanzadaAbierta(abierta)}
          />
        </div>

        {!busquedaAvanzadaAbierta && (
          <div className="mt-6">
            <FiltrosForm
              onResults={(usuarios: UsuarioResumen[]) => {
                setUsuariosFiltrados(usuarios);
                setModoVista(usuarios.length > 0 ? "usuarios" : "jobs");
                setFiltrosAplicados(true);
              }}
              onFilterNoResults={(noResults: boolean) => {
                setFiltersNoResults(noResults);
                setFiltrosAplicados(true);
              }}
              onClearFilters={handleClearFilters}
              sort={sortBy}
              setSort={setSortBy}
              opcionesOrdenamiento={opcionesOrdenamiento}
              totalItems={totalItems}
              disabled={
                (modoVista === "jobs" && jobsToDisplay.length === 0) ||
                (modoVista === "usuarios" && usuariosFiltrados.length === 0)
              }
            />
          </div>
        )}

        {/* Vista usuarios */}
        {modoVista === "usuarios" ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Resultados de Profesionales
            </h2>
            {usuariosFiltrados.length > 0 ? (
              <>
                <div className="UserProfilesContainer space-y-6">
                  {usuariosFiltrados.map((usuario, index) => (
                    // ✅ REEMPLAZADO: UserProfileCard condicional con resaltado
                    hasHighlighting ? (
                      <UserProfileCardWithHighlight
                        key={`${usuario.id_usuario}-${index}-highlight`}
                        usuario={usuario}
                        onContactClick={() =>
                          router.push(`/alquiler/${usuario.id_usuario}`)
                        }
                      />
                    ) : (
                      <UserProfileCard
                        key={`${usuario.id_usuario}-${index}`}
                        usuario={usuario}
                        onContactClick={() =>
                          router.push(`/alquiler/${usuario.id_usuario}`)
                        }
                      />
                    )
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Se encontraron {usuariosFiltrados.length} profesionales
                </p>
              </>
            ) : (
              <p className="text-center text-gray-600 mt-4">
                No se encontraron profesionales con los filtros seleccionados
              </p>
            )}
            <button
              onClick={() => {
                handleClearFilters();
                router.push('/alquiler');
              }}
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Volver a ofertas
            </button>
          </section>
        ) : (
          // Vista de Trabajos (Jobs)
          <section className="mt-10">
            {isLoading ? ( // 🟢 USAMOS EL isLoading GENERAL
              <p className="text-center text-gray-500 text-lg">Cargando ofertas...</p>
            ) : (
              <>
                <div className="text-xl text-blue-700 font-semibold mb-6">
                  {mostrarSinResultadosFiltros || totalItems === 0
                    ? "No se encontraron ofertas"
                    : `Mostrando ${startIndex} - ${endIndex} de ${totalItems} Ofertas Disponibles`}
                </div>

                <div className="results-area mt-6">
                  {/* Ya no hay 'buscando', el estado 'isLoading' lo maneja */}
                  {mostrarErrorCaracteres ? ( // Esto es por si 'analizarCaracteresQuery' falla
                    <div className="text-center py-8">
                       <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                        {/* ... (código de error de caracteres) ... */}
                        <p className="text-gray-600 mb-4">{errorCaracteres}</p>
                        <button
                          onClick={handleClearSearch}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    </div>
                  ) : mostrarSinResultadosFiltros ? (
                    <div className="text-center py-8">
                      <p className="text-xl text-gray-600 mb-4">
                        No se encontraron ofertas con los filtros seleccionados
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver todas las ofertas
                      </button>
                    </div>
                  ) : currentItems.length === 0 ? (
                    // Mensaje unificado para "Sin Resultados"
                    <div className="text-center py-8">
                      <p className="text-xl text-gray-600 mb-4">
                        {searchTerm && estadoBusqueda === "success"
                          ? `No se encontraron resultados para "${searchTerm}"`
                          : "No hay ofertas de trabajo disponibles en este momento."}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ver todas las ofertas
                        </button>
                      )}
                    </div>
                  ) : (
                    // Mostrar resultados
                    <>
                      <div className="space-y-6">
                        {currentItems.map((job, index) => (                      
                          hasHighlighting ? (
                            <JobCardWithHighlight
                              key={`${job.title}-${index}-highlight`}
                              {...job}
                              appliedFilters={filtrosActuales}
                              onViewDetails={() => handleViewDetails(job.id)}
                            />
                          ) : (
                            <JobCard
                              key={`${job.title}-${index}`}
                              {...job}
                              onViewDetails={() => handleViewDetails(job.id)}
                            />
                          )
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-10">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                            handleNextPage={handleNextPage}
                            handlePrevPage={handlePrevPage}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

// Export principal
export default function BusquedaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusquedaContent />
    </Suspense>
  );
}