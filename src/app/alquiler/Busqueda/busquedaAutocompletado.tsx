'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { Job } from "../paginacion/types/job";
import "./busqueda.css";
import { Trash2 } from "lucide-react";

import { normalizarGoogle, normalizarQueryBusqueda, analizarCaracteresQuery, tieneCaracteresProblema, generarHashTexto } from "./normalizacion";

import { useSearchHistory } from './hooks/useHistorialBusqueda';

type EstadoSugerencias = "idle" | "loading" | "error" | "success";
type EstadoBusqueda = "idle" | "loading" | "success" | "error" | "sinResultados";

interface BusquedaAutocompletadoProps {
    onSearch: (searchTerm: string, resultados: Job[], actualizarUrl?: boolean) => void;
    datos?: Job[];
    placeholder?: string;
    valorInicial?: string;
    campoBusqueda?: keyof Job | "all";
    maxResultados?: number;
    mostrarHistorial?: boolean;
    apiConfig?: {
        endpoint: string;
        campoResultado: string;
    };
}

interface EspecialidadBackend {
    id_especialidad: number;
    nombre: string;
    fecha_asignacion?: string;
}

interface ApiResponse {
    success: boolean;
    data: EspecialidadBackend[];
    message?: string;
    count?: number;
    searchTerm?: string;
}

// Helper: normaliza NEXT_PUBLIC_API_URL evitando duplicar '/api'
function getApiRoot(): string {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'https://alquiler-back-1-9td5.onrender.com';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

// ============================================================================
// SERVICIO DE BACKEND - MODIFICADO PARA ORDEN EXACTO
// ============================================================================

class BackendService {
    private static API_BASE = getApiRoot();

    static async searchJobsBackend(query: string, endpoint?: string): Promise<Job[]> {
        try {
            console.log('🚀 [BACKEND-ORDEN-EXACTO] Buscando con orden exacto:', query);

            const queryNormalizado = query;
            const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

            if (tokens.length === 0) {
                return [];
            }

            console.log('🔄 [BACKEND-ORDEN-EXACTO] Tokens para búsqueda:', tokens);
            const payload = {
                queryOriginal: query,
                queryNormalizado: queryNormalizado,
                tokens: tokens,
                estrategias: tokens,
                campos: ['title', 'company', 'service', 'description'],
                config: {
                    caseInsensitive: true,
                    ignoreAccents: true,
                    fuzzyMatch: false,
                    partialMatch: false,
                    buscarPorInicioPalabra: false, // 🔥 DESACTIVADO
                    buscarEnServiciosIndividuales: false, // 🔥 DESACTIVADO
                    ordenExacto: true, // 🔥 NUEVO: Forzar orden exacto
                    matchFraseCompleta: true // 🔥 NUEVO: Coincidencia de frase completa
                }
            };

            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ [BACKEND-ORDEN-EXACTO] Respuesta recibida:', data);

                if (data.success && data.data && Array.isArray(data.data)) {
                    console.log(`✅ [BACKEND-ORDEN-EXACTO] ${data.data.length} resultados del backend`);
                    return data.data.slice(0, 50);
                } else if (data.success) {
                    console.log('ℹ️ [BACKEND-ORDEN-EXACTO] Backend respondió sin datos');
                    return [];
                }
            }

            console.log('⚠️ [BACKEND-ORDEN-EXACTO] Respuesta no válida');
            throw new Error('Backend response not valid');

        } catch (error) {
            console.log('❌ [BACKEND-ORDEN-EXACTO] Error:', error);
            throw error;
        }
    }

    static async searchByEspecialidadBackend(especialidad: string): Promise<Job[]> {
        if (!especialidad.trim()) {
            return [];
        }

        console.log('🎯 [ESPECIALIDAD-ORDEN-EXACTO] Buscando por especialidad:', especialidad);

        try {
            const especialidadNormalizada = normalizarQueryBusqueda(especialidad);
            const tokens = especialidadNormalizada.split(' ').filter(token => token.length > 0);

            const apiEndpoint = `${this.API_BASE}/borbotones/search/especialidad`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    especialidad: especialidad,
                    especialidadNormalizada: especialidadNormalizada,
                    tokens: tokens,
                    estrategias: tokens,
                    buscarPorInicioPalabra: false, // 🔥 DESACTIVADO
                    buscarEnServiciosIndividuales: false, // 🔥 DESACTIVADO
                    ordenExacto: true, // 🔥 NUEVO
                    matchFraseCompleta: true // 🔥 NUEVO
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && Array.isArray(data.data)) {
                    console.log(`✅ [ESPECIALIDAD-ORDEN-EXACTO] ${data.data.length} resultados`);
                    return data.data;
                }
            }

            throw new Error('Backend response not valid');

        } catch (error) {
            console.log('❌ [ESPECIALIDAD-ORDEN-EXACTO] Error:', error);
            throw error;
        }
    }

    static async getAutocompleteSuggestionsBackend(query: string, endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS-ORDEN-EXACTO] Buscando sugerencias para:', query);

            const queryNormalizado = normalizarQueryBusqueda(query);

            const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/autocomplete`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const url = `${apiEndpoint}?q=${encodeURIComponent(queryNormalizado)}&limit=6&inicioPalabra=false&ordenExacto=true`;

            const response = await fetch(url, { signal: controller.signal });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data: ApiResponse = await response.json();
                console.log('✅ [SUGERENCIAS-ORDEN-EXACTO] Respuesta completa del backend:', data);

                if (data.success) {
                    if (data.data && Array.isArray(data.data)) {
                        const sugerencias = data.data
                            .map((item: EspecialidadBackend) => item.nombre)
                            .filter((nombre: string) => nombre && nombre.trim())
                            .slice(0, 10);

                        console.log('📋 [SUGERENCIAS-ORDEN-EXACTO] Sugerencias procesadas:', sugerencias);
                        return sugerencias;
                    } else {
                        console.log('ℹ️ [SUGERENCIAS-ORDEN-EXACTO] Backend: success=true pero data no es array');
                        return [];
                    }
                } else {
                    console.log('❌ [SUGERENCIAS-ORDEN-EXACTO] Backend: success=false');
                    throw new Error('Backend response not successful');
                }
            }

            console.log('⚠️ [SUGERENCIAS-ORDEN-EXACTO] Respuesta HTTP no ok:', response.status);
            throw new Error(`HTTP ${response.status}`);

        } catch (error) {
            console.log('❌ [SUGERENCIAS-ORDEN-EXACTO] Error:', error);
            throw error;
        }
    }
}

// ============================================================================
// SERVICIO LOCAL UNIFICADO - MODIFICADO PARA ORDEN EXACTO
// ============================================================================

class LocalService {
    static buscarTrabajos(query: string, jobs: Job[], campoBusqueda: keyof Job | "all" = "all"): Job[] {
        console.log('🔍 [LOCAL-ORDEN-EXACTO] Buscando localmente con orden exacto:', query);

        if (!query.trim()) return [];

        const queryNormalizado = normalizarQueryBusqueda(query);
        const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

        if (tokens.length === 0) return [];

        return jobs.filter(job => {
            if (campoBusqueda === "all") {
                const tituloNormalizado = job.title ? this.normalizarTexto(job.title) : "";
                const empresaNormalizada = job.company ? this.normalizarTexto(job.company) : "";
                const serviciosNormalizados = job.service ? this.normalizarTexto(job.service) : "";

                const campos = [tituloNormalizado, empresaNormalizada, serviciosNormalizados];

                // 🔥 NUEVO: Verificar que TODOS los tokens aparezcan en ORDEN en algún campo
                return campos.some(campoTexto => {
                    if (!campoTexto) return false;

                    // 🔥 VERIFICAR ORDEN EXACTO: Los tokens deben aparecer en el orden correcto
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
            } else {
                const campoValor = job[campoBusqueda];
                if (!campoValor) return false;

                const campoNormalizado = this.normalizarTexto(String(campoValor));

                // 🔥 NUEVO: Verificar orden exacto en campo específico
                let posicionActual = 0;
                let todosLosTokensEnOrden = true;

                for (const token of tokens) {
                    const posicionToken = campoNormalizado.indexOf(token, posicionActual);
                    if (posicionToken === -1) {
                        todosLosTokensEnOrden = false;
                        break;
                    }
                    posicionActual = posicionToken + token.length;
                }

                return todosLosTokensEnOrden;
            }
        }).slice(0, 50);
    }

    static getSugerencias(query: string, jobs: Job[]): string[] {
        console.log('💡 [SUGERENCIAS-LOCAL-ORDEN-EXACTO] Generando sugerencias locales para:', query);

        if (!query.trim() || query.trim().length < 2) {
            console.log('⏸️ [SUGERENCIAS-LOCAL-ORDEN-EXACTO] Query muy corta, omitiendo');
            return [];
        }

        const queryNormalizado = normalizarQueryBusqueda(query);
        const sugerencias = new Set<string>();

        jobs.forEach(job => {
            if (job.service) {
                const servicios = job.service.split(',').map(s => s.trim());

                servicios.forEach(servicio => {
                    const servicioNormalizado = this.normalizarTexto(servicio);

                    // 🔥 MODIFICADO: Solo sugerir si coincide desde el inicio con orden
                    if (servicioNormalizado.startsWith(queryNormalizado)) {
                        sugerencias.add(servicio);
                    }
                });
            }
        });

        jobs.forEach(job => {
            const campos = ['title', 'company'] as const;
            campos.forEach(campo => {
                if (job[campo]) {
                    const valorCampo = String(job[campo]);
                    const campoNormalizado = this.normalizarTexto(valorCampo);

                    // 🔥 MODIFICADO: Solo sugerir si coincide desde el inicio con orden
                    if (campoNormalizado.startsWith(queryNormalizado)) {
                        sugerencias.add(valorCampo);
                    }
                }
            });
        });

        const sugerenciasArray = Array.from(sugerencias);

        const sugerenciasOrdenadas = sugerenciasArray.sort((a, b) => {
            const aNormalizado = this.normalizarTexto(a);
            const bNormalizado = this.normalizarTexto(b);

            const aEmpiezaExacto = aNormalizado.startsWith(queryNormalizado);
            const bEmpiezaExacto = bNormalizado.startsWith(queryNormalizado);

            if (aEmpiezaExacto && !bEmpiezaExacto) return -1;
            if (!aEmpiezaExacto && bEmpiezaExacto) return 1;

            if (a.length !== b.length) return a.length - b.length;

            return aNormalizado.localeCompare(bNormalizado);
        });

        const sugerenciasFinales = sugerenciasOrdenadas.slice(0, 10);
        console.log('✅ [SUGERENCIAS-LOCAL-ORDEN-EXACTO] Sugerencias locales encontradas:', sugerenciasFinales);
        return sugerenciasFinales;
    }

    private static normalizarTexto(texto: string): string {
        if (!texto) return "";
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´'"]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }
}

// ============================================================================
// SERVICIO PRINCIPAL - MODIFICADO PARA ORDEN EXACTO
// ============================================================================

class BusquedaService {
    private static API_BASE = getApiRoot();

    // 🔥 MODIFICADO: Calcular relevancia basada en ORDEN EXACTO
    private static calcularRelevancia(job: Job, query: string): number {
        const queryNormalizado = normalizarQueryBusqueda(query);
        const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

        let puntaje = 0;

        if (!job.title) return puntaje;

        const tituloNormalizado = this.normalizarTexto(job.title);
        const empresaNormalizada = job.company ? this.normalizarTexto(job.company) : "";
        const serviciosNormalizados = job.service ? this.normalizarTexto(job.service) : "";

        console.log('🔍 [RELEVANCIA-ORDEN-EXACTO] Calculando para:', {
            titulo: job.title,
            query: query,
            tituloNormalizado: tituloNormalizado,
            queryNormalizado: queryNormalizado
        });

        // 🔥 MÁXIMA PRIORIDAD: Coincidencia EXACTA del nombre completo
        if (tituloNormalizado === queryNormalizado) {
            puntaje += 1000;
            console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Coincidencia EXACTA +1000');
        }

        // 🔥 ALTA PRIORIDAD: El query contiene el nombre completo
        if (tituloNormalizado.includes(queryNormalizado)) {
            puntaje += 500;
            console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Query contiene nombre completo +500');
        }

        // 🔥 ALTA PRIORIDAD: El nombre contiene el query completo
        if (queryNormalizado.includes(tituloNormalizado)) {
            puntaje += 400;
            console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Nombre contiene query +400');
        }

        // 🔥 NUEVO: Verificar ORDEN EXACTO de tokens en título
        const ordenExactoTitulo = this.verificarOrdenExacto(tituloNormalizado, tokens);
        if (ordenExactoTitulo) {
            puntaje += 600; // 🔥 ALTA PRIORIDAD PARA ORDEN EXACTO
            console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Orden exacto en título +600');
        }

        // 🔥 NUEVO: Verificar ORDEN EXACTO en empresa
        if (empresaNormalizada) {
            const ordenExactoEmpresa = this.verificarOrdenExacto(empresaNormalizada, tokens);
            if (ordenExactoEmpresa) {
                puntaje += 300;
                console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Orden exacto en empresa +300');
            }
        }

        // 🔥 NUEVO: Verificar ORDEN EXACTO en servicios
        if (serviciosNormalizados) {
            const ordenExactoServicios = this.verificarOrdenExacto(serviciosNormalizados, tokens);
            if (ordenExactoServicios) {
                puntaje += 200;
                console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Orden exacto en servicios +200');
            }
        }

        // 🔥 COINCIDENCIA DE TODAS LAS PALABRAS EN ORDEN (ya no es necesario, se maneja arriba)
        const palabrasTitulo = tituloNormalizado.split(' ');
        const todasLasPalabrasCoinciden = tokens.every(token =>
            palabrasTitulo.some(palabra => palabra.includes(token))
        );

        if (todasLasPalabrasCoinciden && !ordenExactoTitulo) {
            puntaje += 100; // 🔥 REDUCIDO porque no es orden exacto
            console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Todas las palabras coinciden (sin orden) +100');
        }

        console.log(`📊 [RELEVANCIA-ORDEN-EXACTO] Puntaje final para "${job.title}": ${puntaje}`);
        return puntaje;
    }

    // 🔥 NUEVO: Función para verificar orden exacto
    private static verificarOrdenExacto(texto: string, tokens: string[]): boolean {
        if (!texto || tokens.length === 0) return false;

        let posicionActual = 0;

        for (const token of tokens) {
            const posicionToken = texto.indexOf(token, posicionActual);
            if (posicionToken === -1) {
                return false; // Token no encontrado
            }
            posicionActual = posicionToken + token.length;
        }

        return true; // Todos los tokens encontrados en orden
    }

    // 🔥 MODIFICADO: Ordenar resultados por relevancia con énfasis en orden exacto
    public static ordenarPorRelevancia(resultados: Job[], query: string): Job[] {
        if (!query.trim() || resultados.length === 0) {
            return resultados;
        }

        console.log('🎯 [RELEVANCIA-ORDEN-EXACTO] Ordenando resultados por relevancia...');

        const resultadosConPuntaje = resultados.map(job => ({
            job,
            puntaje: this.calcularRelevancia(job, query)
        }));

        // Orden descendente (mayor relevancia primero)
        resultadosConPuntaje.sort((a, b) => {
            if (b.puntaje !== a.puntaje) {
                return b.puntaje - a.puntaje;
            }

            // 🔥 DESEMPATE: Si mismo puntaje, priorizar mejor rating
            const ratingA = a.job.rating || 0;
            const ratingB = b.job.rating || 0;
            return ratingB - ratingA;
        });

        const resultadosOrdenados = resultadosConPuntaje.map(item => item.job);

        console.log('📋 [RELEVANCIA-ORDEN-EXACTO] Resultados ordenados:');
        resultadosConPuntaje.forEach((item, index) => {
            console.log(`   ${index + 1}. "${item.job.title}" - Puntaje: ${item.puntaje}`);
        });

        return resultadosOrdenados;
    }

    private static normalizarTexto(texto: string): string {
        if (!texto) return "";
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[´'"]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // 🔥 MODIFICADO: Búsqueda optimizada con orden exacto
    static async searchJobsOptimized(query: string, jobsReales: Job[], endpoint?: string): Promise<Job[]> {
        try {
            console.log('🔍 [SERVICE-ORDEN-EXACTO] Buscando primero en backend con orden exacto:', query);

            if (!query.trim()) {
                return [];
            }

            const queryNormalizado = query;
            console.log('✅ [SERVICE-ORDEN-EXACTO] Query ya normalizado desde componente:', queryNormalizado);

            const tokens = queryNormalizado.split(' ').filter(token => token.length > 0);

            if (tokens.length === 0) {
                return [];
            }

            // 1. INTENTAR BACKEND PRIMERO CON ORDEN EXACTO
            const resultadosBackend = await BackendService.searchJobsBackend(queryNormalizado, endpoint);

            if (resultadosBackend && resultadosBackend.length > 0) {
                console.log(`✅ [BACKEND-ORDEN-EXACTO] ${resultadosBackend.length} resultados del backend`);
                const resultadosOrdenados = this.ordenarPorRelevancia(resultadosBackend, query);
                return resultadosOrdenados;
            }

            // 2. Si backend responde pero sin resultados, usar FALLBACK LOCAL CON ORDEN EXACTO
            console.log('🔄 [BACKEND-ORDEN-EXACTO] Backend respondió sin resultados, usando fallback local con orden exacto');
            const resultadosLocales = LocalService.buscarTrabajos(query, jobsReales);
            return this.ordenarPorRelevancia(resultadosLocales, query);

        } catch (error) {
            console.log('🔄 [BACKEND-ORDEN-EXACTO] Backend falló, usando local como fallback con orden exacto:', error);
            const resultadosLocales = LocalService.buscarTrabajos(query, jobsReales);
            return this.ordenarPorRelevancia(resultadosLocales, query);
        }
    }

    static async searchByEspecialidad(especialidad: string, jobsReales: Job[]): Promise<Job[]> {
        if (!especialidad.trim()) {
            return [];
        }

        console.log('🎯 [ESPECIALIDAD-ORDEN-EXACTO] Buscando por especialidad con orden exacto:', especialidad);

        try {
            const resultadosBackend = await BackendService.searchByEspecialidadBackend(especialidad);
            return resultadosBackend;
        } catch (backendError) {
            console.log('🔄 [ESPECIALIDAD-ORDEN-EXACTO] Backend falló, usando local como fallback con orden exacto');
            return LocalService.buscarTrabajos(especialidad, jobsReales);
        }
    }

    static async getAutocompleteSuggestions(query: string, jobsReales: Job[], endpoint?: string): Promise<string[]> {
        try {
            console.log('🔍 [SUGERENCIAS-ORDEN-EXACTO] Buscando sugerencias en backend con orden exacto:', query);

            // 1. INTENTAR BACKEND PRIMERO SIEMPRE CON ORDEN EXACTO
            const sugerenciasBackend = await BackendService.getAutocompleteSuggestionsBackend(query, endpoint);

            console.log('📊 [SUGERENCIAS-ORDEN-EXACTO] Respuesta backend:', {
                tieneSugerencias: sugerenciasBackend && sugerenciasBackend.length > 0,
                cantidad: sugerenciasBackend?.length || 0,
                sugerencias: sugerenciasBackend
            });

            // 2. SI el backend responde con array vacío, usar FALLBACK LOCAL CON ORDEN EXACTO
            if (sugerenciasBackend && sugerenciasBackend.length === 0) {
                console.log('🔄 [SUGERENCIAS-ORDEN-EXACTO] Backend respondió con array VACÍO, usando FALLBACK LOCAL');
                const sugerenciasLocales = LocalService.getSugerencias(query, jobsReales);
                console.log('💡 [SUGERENCIAS-LOCAL-ORDEN-EXACTO] Sugerencias locales encontradas:', sugerenciasLocales);
                return sugerenciasLocales;
            }

            // 3. SI el backend tiene sugerencias, usarlas
            if (sugerenciasBackend && sugerenciasBackend.length > 0) {
                console.log('✅ [SUGERENCIAS-ORDEN-EXACTO] Usando sugerencias del backend');
                return sugerenciasBackend;
            }

            // 4. Por seguridad, si llegamos aquí, usar local
            console.log('🔄 [SUGERENCIAS-ORDEN-EXACTO] Caso inesperado, usando fallback local');
            return LocalService.getSugerencias(query, jobsReales);

        } catch (error) {
            console.log('🔄 [SUGERENCIAS-ORDEN-EXACTO] Backend falló, usando local como fallback:', error);
            const sugerenciasLocales = LocalService.getSugerencias(query, jobsReales);
            console.log('💡 [SUGERENCIAS-LOCAL-ORDEN-EXACTO] Sugerencias locales por error:', sugerenciasLocales);
            return sugerenciasLocales;
        }
    }
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function BusquedaAutocompletado({
    onSearch,
    datos = [],
    placeholder = "Buscar por título, servicio, empresa...",
    valorInicial = "",
    campoBusqueda = "all",
    maxResultados = 50,
    mostrarHistorial = true,
    apiConfig
}: BusquedaAutocompletadoProps) {
    // Helper: Title Case (capitalizar cada palabra)
    const titleCase = (t: string) => {
        if (!t) return "";
        return t.toString().trim().replace(/\s+/g, ' ').split(' ').map((w) => (w.length === 0 ? '' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(' ');
    };

    const [query, setQuery] = useState(titleCase(valorInicial));
    const [sugerencias, setSugerencias] = useState<string[]>([]);
    const [estadoSugerencias, setEstadoSugerencias] = useState<EstadoSugerencias>("idle");
    const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>("idle");
    const [mensaje, setMensaje] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [mostrarLoadingSugerencias, setMostrarLoadingSugerencias] = useState(false);
    const [resultados, setResultados] = useState<Job[]>([]);
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [mensajeNoResultados, setMensajeNoResultados] = useState("");
    const [inputFocused, setInputFocused] = useState(false);

    // 🔥 REFERENCIAS SEPARADAS PARA COMPORTAMIENTO AMAZON
    const debounceSugerenciasRef = useRef<NodeJS.Timeout | null>(null);
    const debounceResultadosRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const terminoBusquedaAnteriorSugerencias = useRef("");
    const terminoBusquedaAnteriorResultados = useRef("");
    const busquedaEnCurso = useRef(false);
    const desactivarBusquedaAutomatica = useRef(false);

    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const justFocusedRef = useRef(false);
    const showLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 🔥 NUEVAS REFERENCIAS para búsqueda local - AÑADE ESTO
    const debounceSugerenciasLocalesRef = useRef<NodeJS.Timeout | null>(null);
    const debounceResultadosLocalesRef = useRef<NodeJS.Timeout | null>(null);

    // USAR HOOK DE HISTORIAL
    const {
        historial,
        cargandoHistorial,
        mostrarHistorialLocal,
        setMostrarHistorialLocal,
        guardarEnHistorial,
        limpiarHistorialBackend,
        eliminarDelHistorial,
        seleccionarDelHistorial,
        indiceSeleccionado,
        setIndiceSeleccionado,
        seleccionarPorIndice
    } = useSearchHistory({
        mostrarHistorial,
        apiConfig
    });

    // 🧹 LIMPIEZA: Cleanup de timeouts al desmontar el componente
    useEffect(() => {
        return () => {
            if (showLoadingTimeoutRef.current) {
                clearTimeout(showLoadingTimeoutRef.current);
            }
            if (debounceSugerenciasRef.current) {
                clearTimeout(debounceSugerenciasRef.current);
            }
            if (debounceResultadosRef.current) {
                clearTimeout(debounceResultadosRef.current);
            }
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    // 🔥 MODIFICADO: Flujo exacto solicitado - Primero analizarCaracteresQuery, luego normalizarGoogle
    const ejecutarBusquedaCompleta = useCallback(async (
        texto: string,
        guardarEnHistorialFlag: boolean = true,
        esEspecialidad: boolean = false,
        actualizarUrl: boolean = true
    ) => {

        // 🛑 DETENER BÚSQUEDAS REPETIDAS
        if (busquedaEnCurso.current) {
            console.log('⏸️ [BÚSQUEDA] Ya hay una búsqueda en curso, omitiendo...');
            return;
        }


        // Esto es síncrono. La próxima vez que se renderice, esto será 'true'.
        busquedaEnCurso.current = true;
        const textoLimpio = texto.trim();

        // Hay que cancelarlos para que no compitan.
        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
        }
        if (debounceResultadosRef.current) {
            clearTimeout(debounceResultadosRef.current);
        }
        if (debounceSugerenciasLocalesRef.current) {
            clearTimeout(debounceSugerenciasLocalesRef.current);
        }

        /**if (guardarEnHistorialFlag && mostrarHistorial) {
            guardarEnHistorial(textoLimpio);
        }*/

        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);
        setLoadingResultados(true);
        setEstadoBusqueda("loading");



        console.log('🚀 [BÚSQUEDA-COMPLETA] Iniciando búsqueda para:', textoLimpio, 'actualizarUrl:', actualizarUrl);

        // 🔥 PASO 1: ANALIZAR CARACTERES PROBLEMA
        const analisis = analizarCaracteresQuery(textoLimpio);


        if (analisis.tieneProblema) {
            console.log('🚫 [BÚSQUEDA] Caracteres problema detectados - Mostrando mensaje de no resultados');

            // 🔥 MOSTRAR MENSAJE COMO SI FUERA BÚSQUEDA SIN RESULTADOS
            setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
            setEstadoBusqueda("sinResultados");
            setLoadingResultados(false);
            setResultados([]);

            // Informar al padre con array vacío
            onSearch(textoLimpio, [], actualizarUrl);
            busquedaEnCurso.current = false;
            return; // 🔥 SALIR - NO PASA A NORMALIZACIÓN
        }



        // 🔥 PASO 2: SI NO HAY CARACTERES PROBLEMA, ENTONCES NORMALIZAR
        let queryParaBuscar: string;

        try {
            // 🔥 ESTO ES LO QUE QUERÍAS - Primero analizar, luego normalizar si pasa
            queryParaBuscar = normalizarQueryBusqueda(textoLimpio);
            console.log('✅ [BÚSQUEDA] Query normalizado:', queryParaBuscar, '← Original:', textoLimpio);
        } catch (error) {
            // 🔥 POR SEGURIDAD - aunque analizarCaracteresQuery ya filtró, por si acaso
            console.log('🚫 [BÚSQUEDA] Error en normalización:', error);
            setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);
            setEstadoBusqueda("sinResultados");
            setLoadingResultados(false);
            setResultados([]);
            onSearch(textoLimpio, [], actualizarUrl);
            busquedaEnCurso.current = false;
            return;
        }

        // 🔥 CONTINUAR CON VALIDACIONES NORMALES (longitud, etc.)
        if (textoLimpio.length > 80) {
            setMensaje("La búsqueda no puede exceder 80 caracteres");
            setEstadoBusqueda("error");
            setLoadingResultados(false);
            busquedaEnCurso.current = false;
            return;
        }

        if (textoLimpio.length < 2) {
            setMensaje("La búsqueda debe tener al menos 2 caracteres");
            setEstadoBusqueda("idle");
            setResultados([]);
            setLoadingResultados(false);
            setMensajeNoResultados("");
            onSearch("", [], actualizarUrl);
            busquedaEnCurso.current = false;
            return;
        }


        if (analisis.tieneSeparadores) {
            setMensajeNoResultados(analisis.mensaje || "Búsqueda con separadores");
        }

        terminoBusquedaAnteriorResultados.current = textoLimpio;



        try {
            console.log('🔍 [BÚSQUEDA] Buscando trabajos con query normalizado:', queryParaBuscar);

            let resultadosFinales: Job[] = [];

            if (esEspecialidad) {
                resultadosFinales = await BusquedaService.searchByEspecialidad(textoLimpio, datos);
            } else {
                // 🔥 ENVIAR EL QUERY NORMALIZADO AL SERVICIO
                resultadosFinales = await BusquedaService.searchJobsOptimized(queryParaBuscar, datos, apiConfig?.endpoint);
            }

            console.log('📊 [BÚSQUEDA] Resultados encontrados:', resultadosFinales.length);

            setResultados(resultadosFinales);
            setEstadoBusqueda("success");

            if (resultadosFinales.length > 0) {
                setMensajeNoResultados("");

                // PASO 1: Guardar en historial (CON AWAIT)
                if (guardarEnHistorialFlag && mostrarHistorial) {
                    await guardarEnHistorial(textoLimpio);
                }

                // PASO 2: Navegar (DESPUÉS de guardar)
                onSearch(textoLimpio, resultadosFinales, actualizarUrl);

            } else {
                setMensajeNoResultados(`No se encontraron resultados para "${textoLimpio}"`);

                // PASO 1: Guardar el 404 (CON AWAIT)
                if (mostrarHistorial) {
                    console.log('💾 [HISTORIAL] Guardando término sin resultados (404) en historial:', textoLimpio);
                    await guardarEnHistorial(textoLimpio); // <-- ¡LA CLAVE!
                }

                // PASO 2: Navegar (DESPUÉS de guardar)
                onSearch(textoLimpio, [], actualizarUrl);
            }

        } catch (error) {
            console.error("❌ [BÚSQUEDA] Error:", error);
            setEstadoBusqueda("error");
            setMensajeNoResultados(`Error en la búsqueda para "${textoLimpio}"`);
            onSearch(textoLimpio, [], actualizarUrl);
            busquedaEnCurso.current = false;

        } finally {
            setLoadingResultados(false);
            busquedaEnCurso.current = false;
        }
    }, [datos, onSearch, guardarEnHistorial, mostrarHistorial, apiConfig?.endpoint, setMostrarSugerencias,
        setMostrarHistorialLocal,
        setLoadingResultados,
        setEstadoBusqueda,
        setMensajeNoResultados,
        setResultados,
        setMensaje]);

    // 🔥 CORREGIDO: Selección de sugerencia AHORA actualiza URL
    const seleccionarSugerencia = useCallback(async (texto: string) => {
        console.log('🎯 [SUGERENCIA] Iniciando selección...');

        desactivarBusquedaAutomatica.current = true;

        // Limpiar todos los timeouts
        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
            debounceSugerenciasRef.current = null;
        }
        if (debounceResultadosRef.current) {
            clearTimeout(debounceResultadosRef.current);
            debounceResultadosRef.current = null;
        }

        setQuery(titleCase(texto));
        setSugerencias([]);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);

        // 🔥 SOLUCIÓN: Blur con timeout para asegurar que se ejecute
        // 🔥 SOLUCIÓN MEJORADA: Múltiples métodos para asegurar el blur
        console.log('🔴 [FOCUS] Forzando pérdida de focus después de selección...');

        // Método 1: Blur del input específico
        if (inputRef.current) {
            inputRef.current.blur();
        }

        // Método 2: Blur de cualquier elemento activo
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Método 3: Forzar el estado
        setInputFocused(false);

        // Método 4: Timeout adicional como respaldo
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.blur();
            }
            setInputFocused(false);
        }, 50);

        console.log('🚀 [SUGERENCIA] Ejecutando búsqueda desde sugerencia...');
        await ejecutarBusquedaCompleta(texto, true, false, true);

        setTimeout(() => {
            desactivarBusquedaAutomatica.current = false;
            console.log('🔄 [AMAZON] Búsqueda dinámica reactivada después de selección');
        }, 3000);

    }, [ejecutarBusquedaCompleta]);

    // ============================================================================
    // 🔥 NUEVO: useEffect PARA SUGERENCIAS LOCALES EN TIEMPO REAL
    // ============================================================================
    useEffect(() => {
         
        if (busquedaEnCurso.current) {
            console.log('🚫 [SUGERENCIAS] Omitido, búsqueda completa en curso.');
            return;
        }


        if (debounceSugerenciasLocalesRef.current) {
            clearTimeout(debounceSugerenciasLocalesRef.current);
        }

        const texto = query.trim();
        const textoNormalizado = normalizarGoogle(texto, "sugerencias");

        // Condiciones para mostrar sugerencias locales
        const debeBuscarSugerenciasLocales = Boolean(
            inputFocused &&
            texto.length >= 1 &&
            !busquedaEnCurso.current
        );

        console.log('🔍 [SUGERENCIAS-LOCALES-REAL-TIME] Estado:', {
            texto,
            textoNormalizado,
            inputFocused,
            debeBuscarSugerenciasLocales,
            busquedaEnCurso: busquedaEnCurso.current
        });

        if (debeBuscarSugerenciasLocales) {
            debounceSugerenciasLocalesRef.current = setTimeout(async () => {
                if (busquedaEnCurso.current) {
                    console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                    return;
                }
                try {
                    if (busquedaEnCurso.current) {
                        console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                        return;
                    }
                    console.log('🚀 [SUGERENCIAS-LOCALES-REAL-TIME] Buscando sugerencias locales para:', texto);

                    // 🔥 BUSCAR SUGERENCIAS LOCALES DIRECTAMENTE
                    const sugerenciasLocales = LocalService.getSugerencias(texto, datos);

                    console.log('💡 [SUGERENCIAS-LOCALES-REAL-TIME] Resultados locales:', {
                        texto,
                        sugerencias: sugerenciasLocales,
                        cantidad: sugerenciasLocales.length
                    });

                    // ✅ ACTUALIZAR ESTADO DE SUGERENCIAS
                    setSugerencias(sugerenciasLocales);
                    setEstadoSugerencias(sugerenciasLocales.length > 0 ? "success" : "success");

                    if (sugerenciasLocales.length === 0) {
                        setMensajeNoResultados(`No se encontraron sugerencias para "${texto}"`);
                    } else {
                        setMensajeNoResultados("");
                    }

                } catch (error) {
                    console.error('❌ [SUGERENCIAS-LOCALES-REAL-TIME] Error:', error);
                    setEstadoSugerencias("error");
                    setSugerencias([]);
                }
            }, 200); // Debounce más corto para respuesta más rápida
        } else {
            // Si no debe buscar, limpiar sugerencias
            if (texto.length === 0) {
                setSugerencias([]);
                setEstadoSugerencias("idle");
                setMensajeNoResultados("");
            }
        }

        return () => {
            if (debounceSugerenciasLocalesRef.current) {
                clearTimeout(debounceSugerenciasLocalesRef.current);
            }
        };
    }, [query, inputFocused, datos, onSearch]);

    // ============================================================================
    // 🔥 NUEVO: useEffect PARA RESULTADOS LOCALES EN TIEMPO REAL  
    // ============================================================================
    useEffect(() => {
         
        if (busquedaEnCurso.current) {
            console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
            return;
        }

        if (debounceResultadosLocalesRef.current) {
            clearTimeout(debounceResultadosLocalesRef.current);
        }

        const texto = query.trim();
        const textoNormalizado = normalizarGoogle(texto, "sugerencias");

        // Condiciones para búsqueda local automática
        const debeBuscarResultadosLocales = Boolean(
            inputFocused &&
            texto.length >= 2 && // Desde 2 caracteres para resultados
            !busquedaEnCurso.current &&
            !desactivarBusquedaAutomatica.current
        );

        console.log('🔍 [RESULTADOS-LOCALES-REAL-TIME] Estado:', {
            texto,
            textoNormalizado,
            inputFocused,
            debeBuscarResultadosLocales,
            busquedaEnCurso: busquedaEnCurso.current
        });

        if (debeBuscarResultadosLocales) {
            debounceResultadosLocalesRef.current = setTimeout(async () => {
                if (busquedaEnCurso.current) {
                    console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                    return;
                }
                try {
                    if (busquedaEnCurso.current) {
                        console.log('🚫 [SUGERENCIAS-BACKEND] Cancelado.');
                        return;
                    }
                    console.log('🚀 [RESULTADOS-LOCALES-REAL-TIME] Buscando resultados locales para:', texto);

                    // 🔥 BUSCAR RESULTADOS LOCALES DIRECTAMENTE
                    const resultadosLocales = LocalService.buscarTrabajos(texto, datos, campoBusqueda);
                    const resultadosOrdenados = BusquedaService.ordenarPorRelevancia(resultadosLocales, texto);

                    console.log('📊 [RESULTADOS-LOCALES-REAL-TIME] Resultados encontrados:', {
                        texto,
                        resultados: resultadosOrdenados.length,
                        items: resultadosOrdenados.map(r => r.title)
                    });

                    // ✅ ACTUALIZAR ESTADO DE RESULTADOS
                    setResultados(resultadosOrdenados);
                    setEstadoBusqueda("success");
                    setLoadingResultados(false);

                    // ✅ ACTUALIZAR PADRE (pero sin guardar en historial)
                    onSearch(texto, resultadosOrdenados, false);

                    if (resultadosOrdenados.length === 0) {
                        setMensajeNoResultados(`No se encontraron resultados para "${texto}"`);
                    } else {
                        setMensajeNoResultados("");
                    }

                } catch (error) {
                    console.error('❌ [RESULTADOS-LOCALES-REAL-TIME] Error:', error);
                    setEstadoBusqueda("error");
                    setMensajeNoResultados(`Error en la búsqueda para "${texto}"`);
                    setLoadingResultados(false);
                }
            }, 400); // Debounce para resultados
        }

        return () => {
            if (debounceResultadosLocalesRef.current) {
                clearTimeout(debounceResultadosLocalesRef.current);
            }
        };
    }, [query, inputFocused, datos, campoBusqueda]);

    // 🔥 MODIFICADO: Manejar cambio en el input - solo mensajes informativos
    const manejarCambioInput = useCallback((nuevoValor: string) => {
        // Mostrar/guardar en Title Case mientras el usuario escribe
        //const valorCapitalizado = titleCase(nuevoValor || "");
        //setQuery(valorCapitalizado);
        setQuery(nuevoValor);

        const textoLimpio = nuevoValor.trim();

        // 🔥 SOLO MOSTRAR MENSAJE INFORMATIVO, NO BLOQUEAR
        const analisis = analizarCaracteresQuery(textoLimpio);

        if (analisis.tieneSeparadores && !analisis.tieneProblema) {
            setMensajeNoResultados(analisis.mensaje || "Búsqueda con separadores");
        } else {
            setMensajeNoResultados("");
        }

        if (nuevoValor === "") {
            setEstadoBusqueda("idle");
            setLoadingResultados(false);
            setMensajeNoResultados("");
            onSearch("", [], true);
            terminoBusquedaAnteriorSugerencias.current = "";
            terminoBusquedaAnteriorResultados.current = "";
            busquedaEnCurso.current = false;
        }
    }, [onSearch]);

    // 🔥 MODIFICADO: buscarSugerencias - SOLO BACKEND, FALLBACK LOCAL
    // ✅ ESTA FUNCIÓN YA MANEJA BACKEND + LOCAL AUTOMÁTICAMENTE
    const buscarSugerencias = useCallback(async (textoNormalizado: string): Promise<string[]> => {
        try {
            console.log('🔍 [AMAZON-SUGERENCIAS] Buscando para texto normalizado:', textoNormalizado);

            if (textoNormalizado.length < 1) {
                console.log('⏸️ [AMAZON-SUGERENCIAS] Texto muy corto');

            }

            console.log('🔄 [AMAZON-SUGERENCIAS] Llamando al servicio...');

            // 🔥 ESTE SERVICIO MANEJA BACKEND + LOCAL AUTOMÁTICAMENTE
            const sugerenciasOptimizadas = await BusquedaService.getAutocompleteSuggestions(
                textoNormalizado,
                datos,
                apiConfig?.endpoint
            );

            console.log('✅ [AMAZON-SUGERENCIAS] Respuesta recibida:', {
                texto: textoNormalizado,
                sugerencias: sugerenciasOptimizadas,
                cantidad: sugerenciasOptimizadas.length,
                origen: sugerenciasOptimizadas.length > 0 ? 'BACKEND/LOCAL' : 'VACIO'
            });

            return sugerenciasOptimizadas;

        } catch (error) {
            console.error('❌ [AMAZON-SUGERENCIAS] Error:', error);
            return [];
        }
    }, [datos, apiConfig?.endpoint]);

    // 🔥 useEffect: Sugerencias automáticas al escribir
    useEffect(() => {
        if (!inputFocused || !query.trim()) {
            setSugerencias([]);
            setMensajeNoResultados("");
            return;
        }

        if (debounceSugerenciasRef.current) {
            clearTimeout(debounceSugerenciasRef.current);
        }

        const texto = query.trim();

        // Buscar sugerencias con debounce
        debounceSugerenciasRef.current = setTimeout(async () => {
            try {
                const textoNormalizado = normalizarGoogle(texto, "sugerencias");
                const sugerenciasFinales = await buscarSugerencias(textoNormalizado);

                if (query.trim() === texto) {
                    setSugerencias(sugerenciasFinales);
                    if (sugerenciasFinales.length === 0) {
                        setMensajeNoResultados(`No se encontraron sugerencias para "${texto}"`);
                    } else {
                        setMensajeNoResultados("");
                    }
                }
            } catch (error) {
                console.error('❌ Error en sugerencias:', error);
                setSugerencias([]);
            }
        }, 200);

        return () => {
            if (debounceSugerenciasRef.current) {
                clearTimeout(debounceSugerenciasRef.current);
            }
        };
    }, [query, inputFocused, buscarSugerencias]);

    const manejarFocusInput = useCallback(async () => {
        setInputFocused(true);
        // NO buscar sugerencias automáticamente al hacer focus
        // Solo mostrar el historial si existe
    }, []);

    // 🔥 MODIFICADO: Búsqueda manual - pierde focus
    const ejecutarBusqueda = useCallback(async () => {
        console.log('🎯 [BÚSQUEDA-MANUAL] Ejecutando búsqueda manual');

        // 🔥 PIERDE EL FOCUS AL EJECUTAR BÚSQUEDA
        inputRef.current?.blur();
        setInputFocused(false);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(false);

        busquedaEnCurso.current = false;

        await ejecutarBusquedaCompleta(query, true, false, true);
    }, [
        query,
        ejecutarBusquedaCompleta,
        setMostrarSugerencias,
        setMostrarHistorialLocal
    ]);

    // 🔥 MODIFICADO: Limpiar SÍ actualiza URL
    const limpiarBusqueda = useCallback(() => {
        setQuery("");
        setSugerencias([]);
        setMensaje("");
        setEstadoSugerencias("idle");
        setEstadoBusqueda("idle");
        setResultados([]);
        setMostrarSugerencias(false);
        setMostrarHistorialLocal(true);
        setLoadingResultados(false);
        setMostrarLoadingSugerencias(false);
        setMensajeNoResultados("");
        terminoBusquedaAnteriorSugerencias.current = "";
        terminoBusquedaAnteriorResultados.current = "";
        busquedaEnCurso.current = false;

        // Limpiar timeout de loading
        if (showLoadingTimeoutRef.current) {
            clearTimeout(showLoadingTimeoutRef.current);
            showLoadingTimeoutRef.current = null;
        }

        desactivarBusquedaAutomatica.current = false;

        // 🔥 Limpiar también actualiza URL
        onSearch("", [], true);
        inputRef.current?.focus();

        console.log('🧹 [AMAZON] Búsqueda limpiada');
    }, [onSearch]);

    const manejarKeyDown = useCallback((e: React.KeyboardEvent) => {
        const itemsList = mostrarHistorialLocal ? historial : sugerencias;
        const totalItems = itemsList.length;

        // 🔹 Evitar navegación si no hay elementos
        if ((mostrarHistorialLocal || mostrarSugerencias) && totalItems === 0) return;

        if (mostrarHistorialLocal || mostrarSugerencias) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setIndiceSeleccionado((prev) =>
                    prev < totalItems - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setIndiceSeleccionado((prev) =>
                    prev > 0 ? prev - 1 : totalItems - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();

                if (indiceSeleccionado !== -1) {
                    const terminoSeleccionado = itemsList[indiceSeleccionado];

                    if (mostrarHistorialLocal) {
                        const textoSeleccionado = seleccionarPorIndice(indiceSeleccionado);
                        if (textoSeleccionado) {
                            setQuery(titleCase(textoSeleccionado));
                            setMostrarHistorialLocal(false);
                            ejecutarBusquedaCompleta(textoSeleccionado, true, false, true);
                        }
                    } else if (mostrarSugerencias) {
                        seleccionarSugerencia(terminoSeleccionado);
                    }
                } else {
                    ejecutarBusqueda();
                }
            } else if (e.key === 'Escape') {
                setMostrarSugerencias(false);
                setMostrarHistorialLocal(false);
                setIndiceSeleccionado(-1);
                setInputFocused(false);
                inputRef.current?.blur();
            } else {
                setIndiceSeleccionado(-1);
            }
        } else {
            if (e.key === 'Enter') {
                ejecutarBusqueda();
            } else if (e.key === 'Escape') {
                limpiarBusqueda();
            }
        }
    }, [
        ejecutarBusqueda,
        limpiarBusqueda,
        mostrarHistorialLocal,
        mostrarSugerencias,
        historial,
        sugerencias,
        indiceSeleccionado,
        setIndiceSeleccionado,
        seleccionarPorIndice,
        seleccionarSugerencia,
        ejecutarBusquedaCompleta
    ]);

    // Efecto para controlar la visibilidad del historial y sugerencias
    useEffect(() => {
        const texto = query.trim();
        const esSoloEspacios = query.length > 0 && texto.length === 0;

        const debeMostrarHistorial = Boolean(
            inputFocused &&
            !esSoloEspacios &&
            texto.length === 0 &&
            mostrarHistorial

        );

        // ✅ Mostrar sugerencias solo si hay algo que mostrar
        // NO mostrar mientras está cargando para evitar parpadeos
        const debeMostrarSugerencias = Boolean(
            inputFocused &&
            !esSoloEspacios &&
            texto.length >= 1 &&
            !mostrarLoadingSugerencias  // No mostrar si está cargando
        );

        setMostrarHistorialLocal(debeMostrarHistorial);
        setMostrarSugerencias(debeMostrarSugerencias);

    }, [query, inputFocused, mostrarHistorial, mostrarLoadingSugerencias]);
    // Efecto para cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setMostrarSugerencias(false);
                setMostrarHistorialLocal(false);
                setInputFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setMostrarHistorialLocal]);

    // Manejar selección del historial
    const manejarSeleccionHistorial = useCallback(async (texto: string) => {
        const textoSeleccionado = seleccionarDelHistorial(texto) || "";
        setQuery(titleCase(textoSeleccionado));
        setSugerencias([]);
        setMensaje("");
        setMostrarSugerencias(false);
        setMensajeNoResultados("");
        setIndiceSeleccionado(-1);

        if (textoSeleccionado) {
            await ejecutarBusquedaCompleta(textoSeleccionado, true, false, true);
        }
    }, [seleccionarDelHistorial, ejecutarBusquedaCompleta, setIndiceSeleccionado]);

    return (
        <div
            className="contenedor-busqueda"
            ref={containerRef}
            onMouseDown={() => {
                // Si el usuario hace clic EN CUALQUIER LUGAR
                // dentro del componente, cancelamos el blur.
                if (blurTimeoutRef.current) {
                    clearTimeout(blurTimeoutRef.current);
                    blurTimeoutRef.current = null;
                }
            }}
        >
            <div className="busqueda-barra">
                <Search className="icono-busqueda" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        manejarCambioInput(e.target.value);
                        setMostrarHistorialLocal(false);
                    }}
                    onMouseDown={() => {
                        if (!inputFocused) {
                            console.log('🖱️ [MOUSE-DOWN] Forzando estado de foco desde el input.');

                            if (blurTimeoutRef.current) {
                                clearTimeout(blurTimeoutRef.current);
                                blurTimeoutRef.current = null;
                            }
                            manejarFocusInput();
                        }
                    }}
                    onKeyDown={manejarKeyDown}
                    onFocus={() => {
                        // Limpia cualquier blur pendiente
                        if (blurTimeoutRef.current) {
                            clearTimeout(blurTimeoutRef.current);
                            blurTimeoutRef.current = null;
                        }

                        justFocusedRef.current = true;
                        manejarFocusInput();
                        setTimeout(() => {
                            justFocusedRef.current = false;
                        }, 100);
                    }}
                    onBlur={() => {
                        if (justFocusedRef.current) {
                            return;
                        }

                        if (blurTimeoutRef.current) {
                            clearTimeout(blurTimeoutRef.current);
                        }

                        blurTimeoutRef.current = setTimeout(() => {
                            if (document.activeElement === inputRef.current) {
                                console.log('🏁 [BLUR] Blur cancelado, el foco sigue en el input (scroll).');
                                return;
                            }

                            console.log('🏁 [BLUR] Blur real detectado. Cerrando menú.');
                            setInputFocused(false);
                        }, 200);
                    }}
                    maxLength={80}
                    className="busqueda-input"
                />
                {query && (
                    <button
                        className="btn-limpiar"
                        onClick={limpiarBusqueda}
                        type="button"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className={`contador-caracteres ${query.length > 70 ? 'alerta' : ''}`}>
                {query.length}/80 caracteres
                {tieneCaracteresProblema(query) && <span className="caracteres-invalidos"> - Caracteres especiales se ignoran</span>}
            </div>

            {/* ✅ HISTORIAL ✅ */}
            {mostrarHistorialLocal && (
                <ul className="caja-sugerencias" onMouseDown={(e) => {
                    e.preventDefault(); // Mantiene el foco del navegador

                    // Cancela el timeout de blur
                    if (blurTimeoutRef.current) {
                        clearTimeout(blurTimeoutRef.current);
                        blurTimeoutRef.current = null;
                    }
                }}>

                    <li className="sugerencias-header" onMouseDown={(e) => e.preventDefault()}>
                        Búsquedas recientes
                        {cargandoHistorial && (
                            <span className="cargando-indicador">Cargando...</span>
                        )}
                    </li>

                    {/* ✅ AQUÍ LA CONDICIÓN PARA MOSTRAR EL MENSAJE */}
                    {!cargandoHistorial && historial.length === 0 ? (
                        <li className="mensaje-historialon" onMouseDown={(e) => e.preventDefault()}>
                            No hay búsquedas recientes
                        </li>
                    ) : (
                        historial.slice(0, 5).map((item, i) => (
                            <li
                                key={i}
                                className={`item-historial ${i === indiceSeleccionado ? 'seleccionado' : ''}`}
                                onClick={() => manejarSeleccionHistorial(item)}
                            >
                                <div className="contenedor-texto-historial">
                                    <Clock className="icono-historial" size={16} />
                                    <span className="texto-historial">{item}</span>
                                </div>

                                <button
                                    className="boton-eliminar-historial"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        eliminarDelHistorial(item);
                                    }}
                                    title="Eliminar elemento"
                                >
                                    ✕
                                </button>
                            </li>
                        ))
                    )}

                    {/* ✅ Solo mostrar limpiar si hay elementos */}
                    {historial.length > 0 && (
                        <li
                            className="item-limpiar-todo"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={limpiarHistorialBackend}
                        >
                            <Trash2 size={14} />
                            Limpiar historial
                        </li>
                    )}
                </ul>
            )}

            {/* SUGERENCIAS */}
            {mostrarSugerencias && (
                <ul
                    className="caja-sugerencias"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        if (blurTimeoutRef.current) {
                            clearTimeout(blurTimeoutRef.current);
                            blurTimeoutRef.current = null;
                        }
                    }}
                >
                    <li className="sugerencias-header">
                        Sugerencias
                    </li>

                    {mostrarLoadingSugerencias && (
                        <li className="mensaje-sugerencia cargando">
                            <div className="spinner"></div>
                            Buscando sugerencias...
                        </li>
                    )}

                    {!mostrarLoadingSugerencias && estadoSugerencias === "error" && (
                        <li className="mensaje-error">
                            <Search className="icono-sugerencia" size={16} />
                            {mensaje}
                        </li>
                    )}

                    {!mostrarLoadingSugerencias && estadoSugerencias !== "error" && (
                        <>
                            {sugerencias.length > 0 ? (
                                sugerencias.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => seleccionarSugerencia(s)}
                                        className={i === indiceSeleccionado ? 'seleccionado' : ''}
                                    >
                                        <Search className="icono-sugerencia" size={16} />
                                        {s}
                                    </li>
                                ))
                            ) : mensajeNoResultados ? (
                                <li className="mensaje-sugerencia">
                                    <div className="icono-info">ℹ️</div>
                                    {mensajeNoResultados}
                                </li>
                            ) : (
                                <li className="mensaje-sugerencia">
                                    <div className="icono-info">ℹ️</div>
                                    Sin sugerencias
                                </li>
                            )}
                        </>
                    )}
                </ul>
            )}

            {/* Mostrar loading en área de resultados */}
            {loadingResultados && (
                <div className="cargando">
                    <div className="spinner"></div>
                    <span>Buscando resultados...</span>
                </div>
            )}

        </div>
    );
}