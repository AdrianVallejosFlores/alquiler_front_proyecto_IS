import axios from "axios";

// Crea la instancia de axios
const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000", // Descomenta y ajusta si tu backend está en otra URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Opcional: Tiempo de espera de 10 segundos
});

// Exportación por defecto para que tu import funcione
export default axiosInstance;